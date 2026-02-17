import { useAuth } from '../auth/useAuth';
import DashboardButton from '../components/DashboardButton';

export default function MainPage() {
  const { user, loading, error, logs } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <p className="text-gray-500">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-12 px-4 bg-blue-50 relative">

      <h1 className="text-4xl sm:text-5xl font-bold text-blue-900 text-center mb-6">
        Ваш трекер
      </h1>

      {/* Аватарка в кружке */}
      {user?.photo_url ? (
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-300 mb-3">
          <img src={user.photo_url} alt="avatar" className="w-full h-full object-cover"/>
        </div>
      ) : (
        <div className="w-32 h-32 rounded-full bg-blue-300 border-4 border-blue-300 mb-3 flex items-center justify-center text-white text-4xl font-bold">
          {user?.first_name?.[0] || '?'}
        </div>
      )}

      {/* Имя пользователя под фото (всегда есть) */}
      <div className="text-center mb-2">
        <p className="text-xl font-semibold text-blue-900">
          {user?.first_name} {user?.last_name}
        </p>
      </div>

      {/* Никнейм под именем (если есть) */}
      {user?.username && (
        <p className="text-blue-600 font-medium mb-8">@{user.username}</p>
      )}

      {/* Если нет username, добавляем отступ */}
      {!user?.username && <div className="mb-8"></div>}

      {/* Кнопки с нормальным цветом */}
      <div className="flex flex-col gap-4 w-full max-w-md">
        <DashboardButton label="Трекер привычек" to="/habits"/>
        <DashboardButton label="Ежедневник" to="/diary"/>
        <DashboardButton label="Заметки" to="/notes"/>
      </div>

      {/* Лог-окно */}
      <div className="fixed bottom-0 left-0 w-full max-h-48 overflow-y-auto bg-gray-100 p-2 text-xs border-t border-gray-300">
        {error && <div className="text-red-500">Ошибка: {error}</div>}
        {logs.map((log, i) => <div key={i}>{log}</div>)}
      </div>

    </div>
  );
}