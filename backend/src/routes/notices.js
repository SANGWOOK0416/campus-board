const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');

// GET /api/notices — 공지사항 목록 조회
// query: ?page=1&limit=10&department=학과공지
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.department) {
      filter.department = req.query.department;
    }
    if (req.query.is_pinned === 'true') {
      filter.is_pinned = true;
    } else if (req.query.is_pinned === 'false') {
      filter.is_pinned = { $ne: true };
    }

    const [notices, total] = await Promise.all([
      Notice.find(filter)
        .sort({ is_pinned: -1, created_at: -1 })
        .skip(skip)
        .limit(limit),
      Notice.countDocuments(filter)
    ]);

    res.json({
      notices,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: err.message });
  }
});

// GET /api/notices/:id — 공지사항 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ error: 'NotFound', message: '공지사항을 찾을 수 없습니다.' });
    }
    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: 'InternalServerError', message: err.message });
  }
});

module.exports = router;
