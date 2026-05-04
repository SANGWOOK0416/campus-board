import React from 'react';
import { useNavigate } from 'react-router-dom';
import communityLogo from '../assets/community.png';
import writeIcon from '../assets/write.png';

const GradeBoard = () => {
  const navigate = useNavigate();
  const isLoggedIn = false; 

  return (
    <main className="main-container">
      <div className="single-layout">
        <div className="board-card">
          <div className="board-header">
            <div className="header-left">
              <img src={communityLogo} alt="전공 게시판" className="header-icon-img" />
              <h2 className="board-title">전공 게시판</h2>
            </div>
            {isLoggedIn && (
              <div className="header-right" onClick={() => navigate('/majorwrite')}>
                <img src={writeIcon} alt="글쓰기" className="header-icon-img clickable" />
              </div>
            )}
          </div>
          <div className="board-content">
          </div>
        </div>
      </div>
    </main>
  );
};

export default GradeBoard;