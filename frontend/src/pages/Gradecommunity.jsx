import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import communityLogo from '../assets/community.png';
import { getPosts } from '../api/posts';
import './Board.css';

const GradeBoard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getPosts({ page, limit: 15 })
      .then(data => {
        setPosts(data.posts);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch(() => {
        setError('게시글을 불러오지 못했습니다.');
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
              <img src={communityLogo} alt="학년 게시판" className="header-icon-img" />
              <h2 className="board-title">학년 게시판</h2>
            </div>
          </div>

          <div className="board-table-wrap">
            {loading && <p className="board-status">불러오는 중...</p>}
            {error && <p className="board-status" style={{ color: '#e55' }}>{error}</p>}
            {!loading && !error && posts.length === 0 && (
              <p className="board-status">등록된 게시글이 없습니다.</p>
            )}
            {!loading && !error && posts.length > 0 && (
              <table className="board-table">
                <thead>
                  <tr>
                    <th style={{ width: '55%' }}>제목</th>
                    <th style={{ width: '15%' }}>작성자</th>
                    <th style={{ width: '15%' }}>날짜</th>
                    <th style={{ width: '15%' }}>조회</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post._id} onClick={() => navigate('/gradetail', { state: { post } })}>
                      <td className="col-title">{post.title}</td>
                      <td className="col-center">{post.user_id?.name || '익명'}</td>
                      <td className="col-center">{formatDate(post.created_at)}</td>
                      <td className="col-center">{post.view_count ?? 0}</td>
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

export default GradeBoard;
