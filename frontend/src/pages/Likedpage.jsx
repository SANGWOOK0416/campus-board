import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import heartLogo from '../assets/heart.png';
import { getMyLikes, getPostById } from '../api/posts';
import './Board.css';

const LikedPage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  const boardLabel = (board_id) => board_id === 'major' ? '전공' : '학년';

  const goToPost = async (postId, boardId) => {
    try {
      const post = await getPostById(postId);
      const path = (post.board_id || boardId) === 'major' ? '/majdetail' : '/gradetail';
      navigate(path, { state: { post } });
    } catch {
      alert('게시글을 불러올 수 없습니다.');
    }
  };

  useEffect(() => {
    setLoading(true);
    getAccessTokenSilently({
      authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
    })
      .then(token => getMyLikes(token))
      .then(data => {
        setLikes(data.likes || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error('좋아요 목록 로드 실패:', e);
        setError('좋아요 목록을 불러오지 못했습니다.');
        setLoading(false);
      });
  }, []);

  return (
    <main className="main-container">
      <div className="single-layout">
        <div className="board-card">
          <div className="board-header">
            <div className="header-left">
              <img src={heartLogo} alt="좋아요 남긴 글" className="header-icon-img" />
              <h2 className="board-title">좋아요 남긴 글</h2>
            </div>
          </div>

          <div className="board-table-wrap">
            {loading && <p className="board-status">불러오는 중...</p>}
            {error && <p className="board-status" style={{ color: '#e55' }}>{error}</p>}
            {!loading && !error && likes.length === 0 && (
              <p className="board-status">좋아요한 게시글이 없습니다.</p>
            )}
            {!loading && !error && likes.length > 0 && (
              <table className="board-table">
                <thead>
                  <tr>
                    <th style={{ width: '55%' }}>제목</th>
                    <th style={{ width: '15%' }}>게시판</th>
                    <th style={{ width: '15%' }}>좋아요</th>
                    <th style={{ width: '15%' }}>날짜</th>
                  </tr>
                </thead>
                <tbody>
                  {likes.map(l => (
                    <tr key={l._id}
                      onClick={() => l.post_id?._id && goToPost(l.post_id._id, l.post_id.board_id)}
                      style={{ cursor: l.post_id?._id ? 'pointer' : 'default' }}>
                      <td className="col-title">{l.post_id?.title || '(삭제된 글)'}</td>
                      <td className="col-center">{l.post_id ? boardLabel(l.post_id.board_id) : '-'}</td>
                      <td className="col-center">♥ {l.post_id?.like_count ?? 0}</td>
                      <td className="col-center">{formatDate(l.post_id?.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default LikedPage;
