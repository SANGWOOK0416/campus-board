const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const getNotices = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/api/notices?${query}`);
  if (!res.ok) throw new Error('공지사항을 불러오는데 실패했습니다.');
  return res.json();
};

export const getNoticeById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/notices/${id}`);
  if (!res.ok) throw new Error('공지사항을 불러오는데 실패했습니다.');
  return res.json();
};
