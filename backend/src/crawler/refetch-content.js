/**
 * 기존 공지사항의 content를 개선된 파서로 재수집하는 일회성 스크립트
 */
const mongoose = require('mongoose');
const Notice = require('../models/Notice');
const { fetchContent } = require('./parser');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-info';

const run = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB 연결 완료');

  const notices = await Notice.find({}, 'list_no source_url content');
  console.log(`총 ${notices.length}개 공지사항 업데이트 시작...`);

  let updated = 0;
  for (const notice of notices) {
    try {
      const content = await fetchContent(notice.source_url);
      if (content && content !== notice.content) {
        await Notice.updateOne({ _id: notice._id }, { $set: { content, updated_at: new Date() } });
        updated++;
        process.stdout.write(`\r${updated}/${notices.length} 업데이트 완료`);
      }
      // 서버 부하 방지
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.error(`\n[${notice.list_no}] 오류:`, err.message);
    }
  }

  console.log(`\n완료: ${updated}개 업데이트`);
  await mongoose.disconnect();
};

run().catch(console.error);
