import React from 'react';
import { useLocation } from 'react-router-dom';
import announceLogo from '../assets/announce.png';
import { FaReply } from 'react-icons/fa';
import './Board.css';

const AnnounceDetail = () => {
  const location = useLocation();
  const notice = location.state?.notice;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (!notice) {
    return (
      <main className="main-container">
        <div className="board-card large">
          <div className="board-header">
            <div className="header-left">
              <img src={announceLogo} alt="공지사항" className="header-icon-img" />
              <h2 className="board-title">공지사항</h2>
            </div>
            <button className="back-btn" onClick={() => window.history.back()}>
              <FaReply style={{ transform: 'scaleX(-1)' }} />
            </button>
          </div>
          <p className="board-status">공지사항을 찾을 수 없습니다.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="main-container">
      <div className="board-card large">
        <div className="board-header">
          <div className="header-left">
            <img src={announceLogo} alt="공지사항" className="header-icon-img" />
            <h2 className="board-title">공지사항</h2>
          </div>
          <button className="back-btn" onClick={() => window.history.back()}>
            <FaReply style={{ transform: 'scaleX(-1)' }} />
          </button>
        </div>

        <div className="detail-meta">
          <h3 className="detail-title">{notice.title}</h3>
          <div className="detail-info-row">
            <div className="detail-info-left">
              <div className="detail-info-item">
                <span className="label">작성자</span>
                <span className="value">{notice.author}</span>
              </div>
              <div className="detail-info-item">
                <span className="label">작성일</span>
                <span className="value">{formatDate(notice.created_at)}</span>
              </div>
            </div>
            {notice.view_count !== undefined && (
              <span className="detail-views">조회 {notice.view_count.toLocaleString()}</span>
            )}
          </div>
        </div>

        <div className="detail-body detail-body-html" dangerouslySetInnerHTML={{ __html: notice.content }} />

        <div className="footer">
          <span />
          <a href={notice.source_url} target="_blank" rel="noreferrer" className="source-btn">
            원문 보기
          </a>
        </div>
      </div>
    </main>
  );
};

export default AnnounceDetail;
