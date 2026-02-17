const API_URL = import.meta.env.MODE === 'development' 
    ? 'http://localhost:8080'
    : 'https://твой-бекенд.onrender.com';

export const authAPI = {
    // Один метод для входа
    entry: async (initData) => {
        const response = await fetch(`${API_URL}/entry`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // для куки
            body: JSON.stringify({ initData }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.err || error.error || 'Entry failed');
        }
        
        return response.json(); // { user, session_id }
    }
};