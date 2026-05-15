import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';
import logImg from '../assets/logimg.jpg';
import donggukLogo from '../assets/logo.png';

const LoginPage = () => {
  const { loginWithPopup, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const signupSuccess = location.state?.signupSuccess;
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginWithPopup({
        authorizationParams: {
          login_hint: email,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });
      navigate('/');
    } catch (err) {
      if (err.message !== 'Popup closed') {
        setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer">
      <div className="whiteBox">
        <div className="leftImage">
          <img src={logImg} alt="로그인 이미지" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="rightForm">
          <img
            src={donggukLogo}
            alt="로고 이미지"
            onClick={handleLogoClick}
            style={{ width: '250px', marginBottom: '20px', cursor: 'pointer' }}
          />
          <h1>역사를 걸으면 동국이 보이고<br />동국이 걸으면 역사가 된다.</h1>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {signupSuccess && <p style={{ color: 'green', fontSize: '0.85rem', margin: '4px 0' }}>회원가입이 완료되었습니다. 로그인해주세요.</p>}
            {error && <p style={{ color: 'red', fontSize: '0.85rem', margin: '4px 0' }}>{error}</p>}
            <button className="btnPrimary" type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
          <button className="btnGoogle" onClick={() => navigate('/signup')}>회원가입</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
