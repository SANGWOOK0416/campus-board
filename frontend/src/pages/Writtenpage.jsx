import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import writtenLogo from '../assets/write.png';
import { getMyPosts } from '../api/posts';
import './Board.css';

const WrittenPage = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    getAccessTokenSilently({
      authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
    })
      .then(token => getMyPosts(token, { page, limit: 15 }))
      .then(data => {
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
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

  const handleRowClick = (post) => {
    if (post.board_id === 'major') navigate('/majdetail', { state: { post } });
    else navigate('/gradetail', { state: { post } });
  };

  return (
    <main className="main-container">
      <div className="single-layout">
        <div className="board-card">
          <div className="board-header">
            <div className="header-left">
              <img src={writtenLogo} alt="작성한 글" className="header-icon-img" />
              <h2 className="board-title">작성한 글</h2>
            </div>
          </div>

          <div className="board-table-wrap">
            {loading && <p className="board-status">불러오는 중...</p>}
            {error && <p className="board-status" style={{ color: '#e55' }}>{error}</p>}
            {!loading && !error && posts.length === 0 && (
              <p className="board-status">작성한 게시글이 없습니다.</p>
            )}
            {!loading && !error && posts.length > 0 && (
              <table className="board-table">
                <thead>
                  <tr>
                    <th style={{ width: '45%' }}>제목</th>
                    <th style={{ width: '20%' }}>게시판</th>
                    <th style={{ width: '20%' }}>날짜</th>
                    <th style={{ width: '15%' }}>조회</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post._id} onClick={() => handleRowClick(post)} style={{ cursor: 'pointer' }}>
                      <td className="col-title">{post.title}</td>
                      <td className="col-center">{post.board_id === 'major' ? '전공 게시판' : '학년 게시판'}</td>
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

export default WrittenPage;
