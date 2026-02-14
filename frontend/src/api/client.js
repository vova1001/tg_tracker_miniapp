// src/api/client.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function api(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const res = await fetch(url, {
    credentials: 'include', // ← обязательно для куки!
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error('API error');
  }

  return res.json();
}

export const authAPI = {
  // 1. Авторизация (получаем куку)
  login: (initData) => {
    return api('/auth', {
      method: 'POST',
      body: JSON.stringify({ initData }),
    });
  },
  
  // 2. Получение данных пользователя (уже с кукой)
  getCurrentUser: () => {
    return api('/auth/get-user'); // GET запрос, кука улетит автоматически
  }
};