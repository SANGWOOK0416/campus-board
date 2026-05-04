import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import announceLogo from '../assets/announce.png';
import communityLogo from '../assets/community.png';
import { getNotices } from '../api/notices';
import { getPosts } from '../api/posts';
import './Board.css';

const BoardCard = ({ title, icon, isLarge, to, children, noContentPadding }) => (
  <div className={`board-card ${isLarge ? 'large' : 'small'}`}>
    <div className="board-header">
      <Link to={to} className="header-left" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
        <img src={icon} alt={title} className="header-icon-img" />
        <h2 className="board-title">{title}</h2>
      </Link>
    </div>
    {noContentPadding ? children : <div className="board-content">{children}</div>}
  </div>
);

const NoticeTable = ({ items, onClickItem }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  if (!items.length) return <p className="board-status">등록된 공지사항이 없습니다.</p>;

  return (
    <div className="board-table-wrap">
      <table className="board-table">
        <thead>
          <tr>
            <th style={{ width: '60%' }}>제목</th>
            <th style={{ width: '20%' }}>작성자</th>
            <th style={{ width: '20%' }}>날짜</th>
          </tr>
        </thead>
        <tbody>
          {items.map((notice) => (
            <tr key={notice._id} onClick={() => onClickItem(notice)}>
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
    </div>
  );
};

const PostList = ({ items, onClick, labelKey = 'title', subKey = null }) => {
  if (!items.length) return <p className="board-status" style={{ fontSize: '0.85rem', color: '#999' }}>등록된 글이 없습니다.</p>;
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {items.map((item) => (
        <li
          key={item._id}
          onClick={() => onClick(item)}
          style={{ padding: '6px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>{item[labelKey]}</span>
          {subKey && <span style={{ color: '#999', fontSize: '0.8rem', flexShrink: 0 }}>{item[subKey]}</span>}
        </li>
      ))}
    </ul>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [majorPosts, setMajorPosts] = useState([]);
  const [gradePosts, setGradePosts] = useState([]);

  useEffect(() => {
    getNotices({ page: 1, limit: 20 })
      .then(data => {
        const all = data.notices || [];
        const pinned = all.filter(n => n.is_pinned);
        const regular = all.filter(n => !n.is_pinned).slice(0, Math.max(5, 10 - pinned.length));
        setNotices([...pinned, ...regular]);
      })
      .catch(() => {});

    getPosts({ page: 1, limit: 5, board_id: 'major' })
      .then(data => setMajorPosts(data.posts || []))
      .catch(() => {});

    getPosts({ page: 1, limit: 5, board_id: 'grade' })
      .then(data => setGradePosts(data.posts || []))
      .catch(() => {});
  }, []);

  return (
    <main className="main-container">
      <div className="grid-layout">
        <BoardCard title="공지사항" icon={announceLogo} isLarge={true} to="/announce" noContentPadding>
          <NoticeTable
            items={notices}
            onClickItem={(item) => navigate('/anndetail', { state: { notice: item } })}
          />
        </BoardCard>
        <div className="side-boards" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <BoardCard title="전공 게시판" icon={communityLogo} to="/majorcommunity">
            <PostList
              items={majorPosts}
              onClick={(item) => navigate('/majdetail', { state: { post: item } })}
              labelKey="title"
            />
          </BoardCard>
          <BoardCard title="학년 게시판" icon={communityLogo} to="/gradecommunity">
            <PostList
              items={gradePosts}
              onClick={(item) => navigate('/gradetail', { state: { post: item } })}
              labelKey="title"
            />
          </BoardCard>
        </div>
      </div>
    </main>
  );
};

export default Home;
