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
    console.log(message); // для разработчика
  }

  useEffect(() => {
    async function authenticate() {
      try {
        setLoading(true);
        addLog("🔥 Mini App открыт");

        // 1️⃣ Получаем initData
        let initData = getInitData();
        addLog("1️⃣ InitData получено от Telegram: " + JSON.stringify(initData));

        // Локальная заглушка для разработки
        if (!initData && import.meta.env.MODE === 'development') {
          initData = "dummy_init_data_for_local_dev";
          addLog("⚠️ Локальная разработка: используем заглушку initData");
        }

        if (!initData) {
          throw new Error("Not in Telegram WebApp");
        }

        // 2️⃣ Отправляем initData на бек
        addLog("2️⃣ Отправляю initData на бек для проверки...");
        const loginRes = await authAPI.login(initData);
        addLog("✅ Ответ login от бэка: " + JSON.stringify(loginRes));

        // 3️⃣ Запрашиваем данные пользователя
        addLog("3️⃣ Запрашиваю getCurrentUser...");
        const userData = await authAPI.getCurrentUser();
        addLog("✅ UserData с бекенда: " + JSON.stringify(userData));

        // 4️⃣ Сохраняем пользователя
        setUser(userData);
        addLog("4️⃣ Пользователь сохранён в стейт");

      } catch (err) {
        addLog("❌ Ошибка: " + err.message);
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
