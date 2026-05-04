import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 
import logImg from '../assets/logimg.jpg';
import donggukLogo from '../assets/logo.png';

const SignupPage = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="loginContainer">
      <div className="whiteBox">
        <div className="leftImage">
          <img src={logImg} alt="Signup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div className="rightForm">
          <img 
            src={donggukLogo} 
            alt="Logo" 
            onClick={goToHome} 
            style={{ width: '250px', marginBottom: '20px', cursor: 'pointer' }} 
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <input type="text" placeholder="이메일" />
            <input type="text" placeholder="아이디" />
            <input type="text" placeholder="닉네임" />
            <input type="text" placeholder="전공" />
            <input type="password" placeholder="비밀번호" />

            <button className="btnPrimary">계정 만들기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;