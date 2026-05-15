import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { syncUser } from './api/auth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Mypage from './pages/Mypage';
import Announce from './pages/Announce';
import AnnDetail from './pages/Announcedetail';
import Majorcommunity from './pages/Majorcommunity';
import MajDetail from './pages/Majordetail';
import MajWrite from './pages/Majorwrite';
import Gradecommunity from './pages/Gradecommunity';
import GraDetail from './pages/Gradedetail';
import GraWrite from './pages/Gradewrite';
import Written from "./pages/Writtenpage";
import WriDetail from './pages/Wridetail';
import WrittenComment from "./pages/WrittenCommentpage";
import WriComDetail from "./pages/WriComdetail";
import Liked from "./pages/Likedpage";
import LikDetail from "./pages/Likdetail";
import './App.css';

function Auth0ProviderWithNavigate({ children }) {
  const navigate = useNavigate();

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: import.meta.env.VITE_APP_URL || window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: 'openid profile email',
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
      onRedirectCallback={(appState) => {
        navigate(appState?.returnTo || '/');
      }}
    >
      {children}
    </Auth0Provider>
  );
}

function AppContent() {
  const location = useLocation();
  const { isLoading, error, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/signup';

  // 로그인 성공 후 user가 세팅되면 백엔드에 유저 동기화
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    getAccessTokenSilently({
      authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
    })
      .then(token => syncUser({ email: user.email, name: user.name }, token))
      .catch(err => console.warn('유저 동기화 실패 (비필수):', err.message));
  }, [isAuthenticated, user]);

  if (error && error.message !== 'Popup closed') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '16px' }}>
        <p style={{ color: 'red' }}>인증 오류: {error.message}</p>
        <button onClick={() => window.location.href = '/login'} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          로그인 페이지로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      {!isLoginPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/announce" element={<Announce />} />
        <Route path="/anndetail" element={<AnnDetail />} />
        <Route path="/majorcommunity" element={<Majorcommunity />} />
        <Route path="/majdetail" element={<MajDetail />} />
        <Route path="/majorwrite" element={<MajWrite />} />
        <Route path="/gradecommunity" element={<Gradecommunity />} />
        <Route path="/gradetail" element={<GraDetail />} />
        <Route path="/gradewrite" element={<GraWrite />} />
        <Route path="/written" element={<Written />} />
        <Route path="/wridetail" element={<WriDetail />} />
        <Route path="/writtencomment" element={<WrittenComment />} />
        <Route path="/wricomdetail" element={<WriComDetail />} />
        <Route path="/liked" element={<Liked />} />
        <Route path="/likdetail" element={<LikDetail />} />
      </Routes>
      {!isLoginPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Auth0ProviderWithNavigate>
        <AppContent />
      </Auth0ProviderWithNavigate>
    </Router>
  );
}

export default App;
