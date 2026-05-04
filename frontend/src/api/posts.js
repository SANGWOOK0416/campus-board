const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const getPosts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/api/posts?${query}`);
  if (!res.ok) throw new Error('게시글을 불러오는데 실패했습니다.');
  return res.json();
};

export const getPostById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/posts/${id}`);
  if (!res.ok) throw new Error('게시글을 불러오는데 실패했습니다.');
  return res.json();
};

export const createPost = async (data, token) => {
  const res = await fetch(`${BASE_URL}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('게시글 작성에 실패했습니다.');
  return res.json();
};

export const addComment = async (postId, content, token) => {
  const res = await fetch(`${BASE_URL}/api/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error('댓글 작성에 실패했습니다.');
  return res.json();
};

export const toggleLike = async (postId, token) => {
  const res = await fetch(`${BASE_URL}/api/posts/${postId}/like`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('좋아요 처리에 실패했습니다.');
  return res.json();
};
