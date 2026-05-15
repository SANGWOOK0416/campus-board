import React, { useState, useEffect } from 'react';
import communityLogo from '../assets/community.png';
import { FaReply, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { createPost } from '../api/posts';

const GradeWrite = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently, user } = useAuth0();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [fileList, setFileList] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    setDate(formattedDate);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => { setIsDragging(false); };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) setFileList((prev) => [...prev, ...droppedFiles]);
  };

  const removeFile = (index) => {
    setFileList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) { setError('제목을 입력해주세요.'); return; }
    if (!content.trim()) { setError('내용을 입력해주세요.'); return; }

    setLoading(true);
    setError('');
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
      });
      await createPost({ title, content, board_id: 'grade' }, token);
      alert('게시글이 등록되었습니다.');
      navigate('/gradecommunity');
    } catch (err) {
      setError('게시글 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-container">
      <div className="board-card large">
        <div className="board-header">
          <div className="header-left">
            <img src={communityLogo} alt="icon" className="header-icon-img" />
            <h2 className="board-title">학년 게시판</h2>
          </div>
          <button className="back-button" onClick={() => navigate(-1)}>
            <FaReply style={{ transform: 'scaleX(-1)' }} />
          </button>
        </div>

        <div className="post-meta">
          <div className="meta-title-row">
            <strong>제목 :</strong>
            <input
              type="text"
              className="meta-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
            />
          </div>
          <div className="meta-info-row">
            <span><strong>작성자 :</strong> {user?.name || '학생'}</span>
            <span><strong>작성일 :</strong> {date}</span>
          </div>
        </div>

        <div className="board-content">
          <textarea
            className="content-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
          />
        </div>

        {error && <p style={{ color: 'red', fontSize: '0.85rem', padding: '0 16px' }}>{error}</p>}

        <div className="footer">
          <div className="footer-left">
            <div
              className={`dropzone ${isDragging ? 'dragging' : ''}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <span>파일을 이곳에 드래그하여 추가하세요</span>
            </div>

            {fileList.length > 0 && (
              <div className="file-list">
                {fileList.map((file, index) => (
                  <div key={index} className="file-item">
                    <span className="file-name">{file.name}</span>
                    <FaTimes className="file-remove-icon" onClick={() => removeFile(index)} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="footer-right">
            <button className="submit-post-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? '등록 중...' : '게시하기'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default GradeWrite;
