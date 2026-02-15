import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Ждем готовности Telegram перед рендерингом
async function initApp() {
    try {
        // Ждем Telegram (максимум 3 секунды)
        await Promise.race([
            window.TELEGRAM_READY,
            new Promise(resolve => setTimeout(resolve, 3000))
        ]);
        
        console.log('🚀 Telegram готов, запускаем приложение');
        
    } catch (error) {
        console.warn('⚠️ Telegram не загрузился, но продолжаем:', error);
    } finally {
        // Рендерим приложение в любом случае
        ReactDOM.createRoot(document.getElementById("root")).render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    }
}

// Запускаем
initApp();