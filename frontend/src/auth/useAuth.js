import { useEffect, useState } from 'react';
import { getInitData, getUserData, waitForTelegram } from '../telegram/telegram';
import { authAPI } from '../api/client';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);

  function addLog(message, data = '') {
    const logMessage = `${new Date().toLocaleTimeString()}: ${message} ${data}`;
    setLogs(prev => [...prev, logMessage]);
    console.log(logMessage);
  }

  useEffect(() => {
    async function authenticate() {
      try {
        setLoading(true);
        addLog("🔥 Mini App открыт");

        // ЖДЕМ Telegram (это критично!)
        addLog("⏳ Ожидание Telegram WebApp...");
        const telegramReady = await waitForTelegram();
        addLog("Telegram WebApp готов:", telegramReady ? 'да' : 'нет');

        // Получаем данные пользователя напрямую из Telegram
        const tgUser = getUserData();
        addLog("Пользователь Telegram:", tgUser ? JSON.stringify(tgUser) : 'не найден');

        // 1️⃣ Получаем initData
        let initData = getInitData();
        addLog("1️⃣ InitData от Telegram:", initData ? 'получена' : 'отсутствует');

        if (!initData) {
          // В режиме разработки используем тестовые данные
          if (import.meta.env.MODE === 'development') {
            initData = "test_init_data";
            addLog("⚠️ Режим разработки: используем тестовые данные");
          } else {
            // Если есть пользователь Telegram, но нет initData - создаем заглушку
            if (tgUser) {
              initData = JSON.stringify({ user: tgUser });
              addLog("⚠️ Создана заглушка initData из пользователя");
            } else {
              throw new Error("Не удалось получить данные от Telegram. Убедитесь, что приложение открыто через Telegram.");
            }
          }
        }

        // 2️⃣ Отправляем initData на бек
        addLog("2️⃣ Отправка initData на сервер...");
        const loginRes = await authAPI.login(initData);
        addLog("✅ Ответ сервера:", JSON.stringify(loginRes));

        // 3️⃣ Запрашиваем данные пользователя
        addLog("3️⃣ Запрос данных пользователя...");
        const userData = await authAPI.getCurrentUser();
        addLog("✅ Данные пользователя:", JSON.stringify(userData));

        setUser(userData);
        addLog("4️⃣ Пользователь сохранён");

      } catch (err) {
        addLog("❌ Ошибка:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    authenticate();
  }, []);

  return { user, loading, error, logs };
}