// Просто и понятно - для разработки
const API_URL = 'https://tg-tracker-miniapp-backend.onrender.com';

// Когда будешь деплоить на Render, просто заменишь одну строку:
// const API_URL = 'https://твой-бекенд.onrender.com';

export const authAPI = {
    entry: async (initData) => {
        const response = await fetch(`${API_URL}/entry`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ initData }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.err || error.error || 'Entry failed');
        }
        
        return response.json();
    }
};