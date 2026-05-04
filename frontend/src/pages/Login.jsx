import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logImg from '../assets/logimg.jpg';
import donggukLogo from '../assets/logo.png';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate('/signup');
  };

  // 로고 클릭 시 홈(/)으로 이동하는 함수
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="loginContainer">
      <div className="whiteBox">
        <div className="leftImage">
          <img src={logImg} alt="Login" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="rightForm">
          {/* onClick 추가 및 클릭 가능한 표시(cursor) 추가 */}
          <img 
            src={donggukLogo} 
            alt="Logo" 
            onClick={handleLogoClick}
            style={{ width: '250px', marginBottom: '20px', cursor: 'pointer' }} 
          />
          <h1>역사를 걸으면 동국이 보이고<br />동국이 걸으면 역사가 된다.</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <input type="text" placeholder="아이디" />
            <input type="password" placeholder="비밀번호" />
            <button className="btnPrimary">로그인</button>
            <button className="btnGoogle" onClick={handleSignupClick}>
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;