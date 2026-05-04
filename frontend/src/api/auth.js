const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const syncUser = async (userData, token) => {
  const res = await fetch(`${BASE_URL}/api/auth/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error('사용자 동기화에 실패했습니다.');
  return res.json();
};
