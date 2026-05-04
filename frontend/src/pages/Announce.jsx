import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import announceLogo from '../assets/announce.png';
import { getNotices } from '../api/notices';
import './Board.css';

const Announce = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getNotices({ page, limit: 15 })
      .then(data => {
        setNotices(data.notices);
        setTotalPages(data.pagination.totalPages);
        setLoading(false);
      })
      .catch(() => {
        setError('공지사항을 불러오지 못했습니다.');
        setLoading(false);
      });
  }, [page]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  return (
    <main className="main-container">
      <div className="single-layout">
        <div className="board-card">
          <div className="board-header">
            <div className="header-left">
              <img src={announceLogo} alt="공지사항" className="header-icon-img" />
              <h2 className="board-title">공지사항</h2>
            </div>
          </div>

          <div className="board-table-wrap">
            {loading && <p className="board-status">불러오는 중...</p>}
            {error && <p className="board-status" style={{ color: '#e55' }}>{error}</p>}
            {!loading && !error && notices.length === 0 && (
              <p className="board-status">등록된 공지사항이 없습니다.</p>
            )}
            {!loading && !error && notices.length > 0 && (
              <table className="board-table">
                <thead>
                  <tr>
                    <th style={{ width: '60%' }}>제목</th>
                    <th style={{ width: '20%' }}>작성자</th>
                    <th style={{ width: '20%' }}>날짜</th>
                  </tr>
                </thead>
                <tbody>
                  {notices.map(notice => (
                    <tr key={notice._id} onClick={() => navigate('/anndetail', { state: { notice } })}>
                      <td className="col-title">
                        {notice.is_pinned && <span className="notice-badge">공지</span>}
                        {notice.title}
                      </td>
                      <td className="col-center">{notice.author}</td>
                      <td className="col-center">{formatDate(notice.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {!loading && totalPages > 1 && (
            <div className="board-pagination">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>이전</button>
              <span className="page-info">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>다음</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Announce;
