import { useNavigate } from 'react-router-dom';
import DashboardButton from '../components/DashboardButton';
import { useAuth } from '../auth/useAuth';

export default function MainPage() {
  const navigate = useNavigate();
  const { user, loading, error } = useAuth();

  console.log("user в MainPage:", user);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <p className="text-gray-500">Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-12 px-4 bg-blue-50">
      <h1 className="text-4xl sm:text-5xl font-bold text-blue-900 text-center mb-6">
        Ваш трекер
      </h1>

      {/* 🔹 Фото пользователя в круглой рамке */}
      {user?.photo_url && (
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-300 mb-2">
          <img
            src={user.photo_url}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 🔹 Telegram username */}
      {user?.username && (
        <p className="text-blue-900 font-medium mb-8">@{user.username}</p>
      )}

      {/* 🔹 Кнопки перехода */}
      <div className="flex flex-col gap-4 w-full max-w-md">
        <DashboardButton label="Трекер привычек" to="/habits" />
        <DashboardButton label="Ежедневник" to="/diary" />
        <DashboardButton label="Заметки" to="/notes" />
      </div>
    </div>
  );
}
