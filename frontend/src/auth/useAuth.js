import { useEffect, useState } from 'react';
import { getInitData } from '../telegram/telegram';
import { authAPI } from '../api/client';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]); // для UI логов

  // функция добавления логов в UI
  function addLog(message) {
    setLogs(prev => [...prev, message]);
    console.log(message); // оставляем в консоль для разработки
  }

  useEffect(() => {
    async function authenticate() {
      try {
        setLoading(true);

        // 1️⃣ Получаем initData от Telegram
        const initData = getInitData();
        addLog("InitData: " + JSON.stringify(initData));

        if (!initData) {
          throw new Error('Not in Telegram WebApp');
        }

        // 2️⃣ Отправляем initData на бек
        const loginRes = await authAPI.login(initData);
        addLog("Login успешен, ответ бэка: " + JSON.stringify(loginRes));

        // 3️⃣ Получаем данные пользователя
        const userData = await authAPI.getCurrentUser();
        addLog("UserData с бекенда: " + JSON.stringify(userData));

        // 4️⃣ Сохраняем пользователя в стейт
        setUser(userData);

      } catch (err) {
        addLog('Auth error: ' + err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    authenticate();
  }, []);

  return { user, loading, error, logs };
}
