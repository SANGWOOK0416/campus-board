import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logImg from '../assets/logimg.jpg';
import donggukLogo from '../assets/logo.png';

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`https://${AUTH0_DOMAIN}/dbconnections/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: AUTH0_CLIENT_ID,
          email,
          password,
          connection: 'Username-Password-Authentication',
          name: nickname,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        let errMsg = '회원가입에 실패했습니다.';
        if (typeof data.description === 'string') {
          errMsg = data.description;
        } else if (data.description?.rules) {
          errMsg = '비밀번호가 너무 약합니다. 영문 대소문자, 숫자를 포함해 8자 이상 입력해주세요.';
        } else if (typeof data.message === 'string') {
          errMsg = data.message;
        }
        setError(errMsg);
        setLoading(false);
        return;
      }

      navigate('/login', { state: { signupSuccess: true } });
    } catch (err) {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      setLoading(false);
    }
  };

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
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p style={{ color: 'red', fontSize: '0.85rem', margin: '4px 0' }}>{error}</p>}
            <button className="btnPrimary" type="button" onClick={handleSignup} disabled={loading}>
              {loading ? '처리 중...' : '계정 만들기'}
            </button>
          </div>

          <button
            className="btnGoogle"
            onClick={() => navigate('/login')}
            style={{ marginTop: '10px' }}
          >
            이미 계정이 있으신가요? 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
