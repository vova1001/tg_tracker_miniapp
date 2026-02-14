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

        // 1️⃣ Получаем initData
        const initData = getInitData();
        console.log("InitData:", initData);

        if (!initData) {
          throw new Error('Not in Telegram WebApp');
        }

        // 2️⃣ Отправляем на бек (получаем куку)
        await authAPI.login(initData);
        console.log("Login успешен, отправляю getCurrentUser...");

        // 3️⃣ Запрашиваем данные пользователя
        const userData = await authAPI.getCurrentUser();
        console.log("UserData с бекенда:", userData);

        // 4️⃣ Сохраняем пользователя
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
