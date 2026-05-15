import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import writtencommentLogo from '../assets/writtencomment.png';
import { getMyComments, getPostById } from '../api/posts';
import './Board.css';

const WrittenCommentPage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
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
      .then(token => getMyComments(token))
      .then(data => {
        setComments(data.comments || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error('작성한 댓글 로드 실패:', e);
        setError('댓글 목록을 불러오지 못했습니다.');
        setLoading(false);
      });
  }, []);

  return (
    <main className="main-container">
      <div className="single-layout">
        <div className="board-card">
          <div className="board-header">
            <div className="header-left">
              <img src={writtencommentLogo} alt="작성한 댓글" className="header-icon-img" />
              <h2 className="board-title">작성한 댓글</h2>
            </div>
          </div>

          <div className="board-table-wrap">
            {loading && <p className="board-status">불러오는 중...</p>}
            {error && <p className="board-status" style={{ color: '#e55' }}>{error}</p>}
            {!loading && !error && comments.length === 0 && (
              <p className="board-status">작성한 댓글이 없습니다.</p>
            )}
            {!loading && !error && comments.length > 0 && (
              <table className="board-table">
                <thead>
                  <tr>
                    <th style={{ width: '45%' }}>댓글 내용</th>
                    <th style={{ width: '30%' }}>원본 게시글</th>
                    <th style={{ width: '10%' }}>게시판</th>
                    <th style={{ width: '15%' }}>날짜</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map(c => (
                    <tr key={c._id}
                      onClick={() => c.post_id?._id && goToPost(c.post_id._id, c.post_id.board_id)}
                      style={{ cursor: c.post_id?._id ? 'pointer' : 'default' }}>
                      <td className="col-title">{c.content}</td>
                      <td className="col-center">{c.post_id?.title || '(삭제된 글)'}</td>
                      <td className="col-center">{c.post_id ? boardLabel(c.post_id.board_id) : '-'}</td>
                      <td className="col-center">{formatDate(c.created_at)}</td>
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

export default WrittenCommentPage;
