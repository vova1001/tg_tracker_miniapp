import { useEffect, useState } from 'react';
import { getInitData } from '../telegram/telegram';
import { authAPI } from '../api/client';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);

  // функция добавления логов
  function addLog(message) {
    setLogs(prev => [...prev, message]);
    console.log(message); // для разработки
  }

  useEffect(() => {
    async function authenticate() {
      try {
        setLoading(true);
        addLog("🔥 Старт аутентификации");

        // 1️⃣ Получаем initData
        const initData = getInitData();
        addLog("1️⃣ InitData получено: " + JSON.stringify(initData));

        if (!initData) {
          addLog("⚠️ initData отсутствует!");
          if (import.meta.env.MODE === 'development') {
            addLog("Локальная разработка: используем заглушку");
          } else {
            throw new Error('Not in Telegram WebApp');
          }
        }

        // 2️⃣ Отправка на бек (login)
        addLog("2️⃣ Отправляю login на бек...");
        const loginRes = await authAPI.login(initData);
        addLog("✅ Login успешен, ответ бэка: " + JSON.stringify(loginRes));

        // 3️⃣ Получение данных пользователя
        addLog("3️⃣ Запрашиваю getCurrentUser...");
        const userData = await authAPI.getCurrentUser();
        addLog("✅ UserData получены: " + JSON.stringify(userData));

        // 4️⃣ Сохраняем пользователя в стейт
        setUser(userData);
        addLog("4️⃣ Пользователь сохранён в стейт");

      } catch (err) {
        addLog("❌ Ошибка аутентификации: " + err.message);
        setError(err.message);
      } finally {
        setLoading(false);
        addLog("🔚 Аутентификация завершена");
      }
    }

    authenticate();
  }, []);

  return { user, loading, error, logs };
}
