// src/auth/useAuth.js
import { useEffect, useState } from 'react';
import { getInitData } from '../telegram/telegram';
import { authAPI } from '../api/client';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function authenticate() {
      try {
        setLoading(true);
        
        // 1. Получаем initData
        const initData = getInitData();
        if (!initData) {
          throw new Error('Not in Telegram');
        }

        // 2. Отправляем на бек (получаем куку)
        await authAPI.login(initData);
        
        // 3. Теперь запрашиваем данные пользователя (кука уже есть!)
        const userData = await authAPI.getCurrentUser();
        
        // 4. Сохраняем пользователя
        setUser(userData);
        
      } catch (err) {
        console.error('Auth error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    authenticate();
  }, []);

  return { user, loading, error };
}