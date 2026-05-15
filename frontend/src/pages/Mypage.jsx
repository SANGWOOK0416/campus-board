import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import writtenLogo from '../assets/write.png';
import writtencommentsLogo from '../assets/writtencomment.png';
import heartLogo from '../assets/heart.png';
import { getMyPosts, getMyComments, getMyLikes, getPostById } from '../api/posts';
import './Board.css';

const Mypage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const [posts, setPosts]       = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes]       = useState([]);

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
    getAccessTokenSilently({
      authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
    }).then(token => {
      Promise.all([
        getMyPosts(token, { page: 1, limit: 5 }),
        getMyComments(token, { page: 1, limit: 5 }),
        getMyLikes(token, { page: 1, limit: 5 }),
      ]).then(([postsData, commentsData, likesData]) => {
        setPosts(postsData.posts || []);
        setComments(commentsData.comments || []);
        setLikes(likesData.likes || []);
      });
    }).catch(() => {});
  }, []);

  return (
    <main className="main-container">
      <div className="grid-layout">

        {/* 작성한 글 */}
        <div className="board-card large">
          <div className="board-header">
            <Link to="/written" className="header-left" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
              <img src={writtenLogo} alt="작성한 글" className="header-icon-img" />
              <h2 className="board-title">작성한 글</h2>
            </Link>
          </div>
          <div className="board-table-wrap">
            {posts.length === 0 ? (
              <p className="board-status">작성한 게시글이 없습니다.</p>
            ) : (
              <table className="board-table">
                <tbody>
                  {posts.map(p => (
                    <tr key={p._id} onClick={() => navigate(p.board_id === 'major' ? '/majdetail' : '/gradetail', { state: { post: p } })} style={{ cursor: 'pointer' }}>
                      <td className="col-title">{p.title}</td>
                      <td className="col-center" style={{ width: '20%' }}>{boardLabel(p.board_id)}</td>
                      <td className="col-center" style={{ width: '20%' }}>{formatDate(p.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="side-boards" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* 작성한 댓글 */}
          <div className="board-card small">
            <div className="board-header">
              <Link to="/writtencomment" className="header-left" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                <img src={writtencommentsLogo} alt="작성한 댓글" className="header-icon-img" />
                <h2 className="board-title">작성한 댓글</h2>
              </Link>
            </div>
            <div className="board-table-wrap">
              {comments.length === 0 ? (
                <p className="board-status">작성한 댓글이 없습니다.</p>
              ) : (
                <table className="board-table">
                  <tbody>
                    {comments.map(c => (
                      <tr key={c._id}
                        onClick={() => c.post_id?._id && goToPost(c.post_id._id, c.post_id.board_id)}
                        style={{ cursor: c.post_id?._id ? 'pointer' : 'default' }}>
                        <td className="col-title">{c.content}</td>
                        <td className="col-center" style={{ width: '30%' }}>{c.post_id?.title || '(삭제된 글)'}</td>
                        <td className="col-center" style={{ width: '20%' }}>{formatDate(c.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* 좋아요 남긴 글 */}
          <div className="board-card small">
            <div className="board-header">
              <Link to="/liked" className="header-left" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                <img src={heartLogo} alt="좋아요 남긴 글" className="header-icon-img" />
                <h2 className="board-title">좋아요 남긴 글</h2>
              </Link>
            </div>
            <div className="board-table-wrap">
              {likes.length === 0 ? (
                <p className="board-status">좋아요한 게시글이 없습니다.</p>
              ) : (
                <table className="board-table">
                  <tbody>
                    {likes.map(l => (
                      <tr key={l._id}
                        onClick={() => l.post_id?._id && goToPost(l.post_id._id, l.post_id.board_id)}
                        style={{ cursor: l.post_id?._id ? 'pointer' : 'default' }}>
                        <td className="col-title">{l.post_id?.title || '(삭제된 글)'}</td>
                        <td className="col-center" style={{ width: '20%' }}>{l.post_id ? boardLabel(l.post_id.board_id) : '-'}</td>
                        <td className="col-center" style={{ width: '20%' }}>{formatDate(l.post_id?.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Mypage;
