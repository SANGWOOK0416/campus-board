import React, { useState } from 'react';
import auth0 from 'auth0-js';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logImg from '../assets/logimg.jpg';
import donggukLogo from '../assets/logo.png';

const webAuth = new auth0.WebAuth({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientID: import.meta.env.VITE_AUTH0_CLIENT_ID,
  responseType: 'code',
  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  scope: 'openid profile email',
  redirectUri: import.meta.env.VITE_APP_URL || window.location.origin,
});

const LoginPage = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    webAuth.login({
      realm: 'Username-Password-Authentication',
      username: email,
      password: password,
    }, (err) => {
      setLoading(false);
      if (err) setError(err.description || '이메일 또는 비밀번호를 확인해주세요.');
    });
  };

  const handleSignup = () => {
    webAuth.authorize({ screen_hint: 'signup' });
  };

  return (
    <div className="loginContainer">
      <div className="whiteBox">
        <div className="leftImage">
          <img src={logImg} alt="로그인 이미지" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="rightForm">
          <img src={donggukLogo} alt="로고 이미지" style={{ width: '300px' }} />
          <h1>역사를 걸으면 동국이 보이고<br />동국이 걸으면 역사가 된다.</h1>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p style={{ color: 'red', fontSize: '0.85rem', margin: '4px 0' }}>{error}</p>}
            <button className="btnPrimary" type="submit" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>
          <button className="btnGoogle" onClick={handleSignup}>회원가입</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;