import DashboardButton from "../components/DashboardButton";
import { useAuth } from "../auth/useAuth";

export default function MainPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <p className="text-blue-900">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start h-full px-4 pt-12">
      {/* Заголовок */}
      <h1 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-8">
        Ваш трекер
      </h1>

      {/* Аватарка с рамкой */}
      <div className="relative mb-3">
        <div className="w-36 h-36 rounded-full border-4 border-blue-300 overflow-hidden shadow-lg">
          {user?.AvatarURL ? (
            <img
              src={user.AvatarURL}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-700 text-xl font-bold">
              ?
            </div>
          )}
        </div>
      </div>

      {/* Telegram тег */}
      <div className="mb-12 min-h-[1.5rem]">
        {user?.TgTag ? (
          <p className="text-blue-900 font-medium text-lg">@{user.TgTag}</p>
        ) : (
          <p className="text-blue-400 font-medium text-lg">Нет тега</p>
        )}
      </div>

      {/* Кнопки */}
      <div className="flex flex-col gap-4 w-full max-w-md">
        <DashboardButton label="Трекер привычек" to="/habits" />
        <DashboardButton label="Ежедневник" to="/diary" />
        <DashboardButton label="Заметки" to="/notes" />
      </div>
    </div>
  );
}
