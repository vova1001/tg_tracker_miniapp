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

        // Ждем Telegram
        addLog("⏳ Ожидание Telegram WebApp...");
        await waitForTelegram();
        addLog("✅ Telegram WebApp готов");

        // Получаем данные пользователя из Telegram (для инфо)
        const tgUser = getUserData();
        addLog("📱 Telegram user:", tgUser ? JSON.stringify(tgUser) : 'не найден');

        // Получаем initData
        let initData = getInitData();
        addLog("📦 InitData:", initData ? 'получена' : 'нет');

        if (!initData) {
          if (import.meta.env.MODE === 'development') {
            initData = "test_init_data";
            addLog("⚠️ Режим разработки: тестовые данные");
          } else {
            throw new Error("Нет initData от Telegram");
          }
        }

        // 🔥 ОДИН ЗАПРОС на бек
        addLog("📤 Отправка на /entry...");
        const response = await authAPI.entry(initData);
        addLog("✅ Ответ:", JSON.stringify(response));

        // response уже содержит user (бек возвращает ResponseUserAndSession)
        setUser(response.user);
        addLog(`👤 Пользователь: ${response.user.first_name} ${response.user.last_name || ''}`);

      } catch (err) {
        addLog("❌ Ошибка:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
        addLog("🏁 Готово");
      }
    }

    authenticate();
  }, []);

  return { user, loading, error, logs };
}