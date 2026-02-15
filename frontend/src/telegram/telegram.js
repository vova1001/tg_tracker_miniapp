// telegram.js
export async function waitForTelegram(timeout = 5000) {
    const start = Date.now();
    
    while (Date.now() - start < timeout) {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    return false;
}

export function initTelegramWebApp() {
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.setBackgroundColor('#f0f9ff');
        return true;
    }
    return false;
}

export function getInitData() {
    // Сначала проверяем через глобальную переменную
    if (window.Telegram?.WebApp?.initData) {
        return window.Telegram.WebApp.initData;
    }
    
    // Пробуем через sessionStorage (на случай если сохранили раньше)
    const saved = sessionStorage.getItem('tg_init_data');
    if (saved) {
        return saved;
    }
    
    return null;
}

export function getUserData() {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        // Сохраняем для надежности
        sessionStorage.setItem('tg_user', JSON.stringify(user));
        return user;
    }
    
    // Пробуем из sessionStorage
    const saved = sessionStorage.getItem('tg_user');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            return null;
        }
    }
    
    return null;
}