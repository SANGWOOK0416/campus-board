import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import communityLogo from '../assets/community.png';
import { FaReply } from 'react-icons/fa';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { addComment, toggleLike, getComments } from '../api/posts';
import './Board.css';

const GradeDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const post = location.state?.post;

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.like_count || 0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!post?._id) return;
    getComments(post._id).then(setComments).catch(() => {});
  }, [post?._id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleLike = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
      });
      const res = await toggleLike(post._id, token);
      setLiked(!liked);
      setLikeCount(res.like_count);
    } catch (e) {
      console.error('좋아요 실패:', e);
      alert('좋아요 처리에 실패했습니다: ' + e.message);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
      });
      await addComment(post._id, comment, token);
      setComment('');
      const updated = await getComments(post._id);
      setComments(updated);
      alert('댓글이 등록되었습니다.');
    } catch (e) {
      console.error('댓글 실패:', e);
      alert('댓글 등록에 실패했습니다: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!post) {
    return (
      <main className="main-container">
        <div className="board-card large">
          <div className="board-header">
            <div className="header-left">
              <img src={communityLogo} alt="학년 게시판" className="header-icon-img" />
              <h2 className="board-title">학년 게시판</h2>
            </div>
            <button className="back-btn" onClick={() => window.history.back()}>
              <FaReply style={{ transform: 'scaleX(-1)' }} />
            </button>
          </div>
          <p className="board-status">게시글을 찾을 수 없습니다.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="main-container">
      <div className="board-card large">
        <div className="board-header">
          <div className="header-left">
            <img src={communityLogo} alt="학년 게시판" className="header-icon-img" />
            <h2 className="board-title">학년 게시판</h2>
          </div>
          <button className="back-btn" onClick={() => window.history.back()}>
            <FaReply style={{ transform: 'scaleX(-1)' }} />
          </button>
        </div>

        <div className="detail-meta">
          <h3 className="detail-title">{post.title}</h3>
          <div className="detail-info-row">
            <div className="detail-info-left">
              <div className="detail-info-item">
                <span className="label">작성자</span>
                <span className="value">{post.user_id?.name || '익명'}</span>
              </div>
              <div className="detail-info-item">
                <span className="label">작성일</span>
                <span className="value">{formatDate(post.created_at)}</span>
              </div>
            </div>
            <span className="detail-views">조회 {post.view_count ?? 0}</span>
          </div>
        </div>

        <div className="detail-body">{post.content}</div>

        <div className="footer">
          <span />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.9rem', color: '#999' }}>{likeCount}</span>
            <button className="like-button" onClick={handleLike}>
              {liked ? <AiFillHeart /> : <AiOutlineHeart />}
            </button>
          </div>
        </div>

        <div className="comment-wrapper">
          {comments.length > 0 && (
            <div className="comment-list">
              {comments.map(c => (
                <div key={c._id} className="comment-item">
                  <span className="comment-author">{c.user_id?.name || '익명'}</span>
                  <span className="comment-date">{formatDate(c.created_at)}</span>
                  <p className="comment-content">{c.content}</p>
                </div>
              ))}
            </div>
          )}
          {isAuthenticated ? (
            <div className="comment-input-container">
              <textarea
                className="comment-textarea"
                placeholder="댓글을 남겨보세요"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="comment-submit-row">
                <button className="comment-submit-btn" onClick={handleComment} disabled={submitting}>
                  {submitting ? '등록 중...' : '등록'}
                </button>
              </div>
            </div>
          ) : (
            <div className="comment-login-banner">
              <p>댓글을 작성하려면 <button onClick={() => navigate('/login')} className="login-link-btn">로그인</button>이 필요합니다.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default GradeDetail;
