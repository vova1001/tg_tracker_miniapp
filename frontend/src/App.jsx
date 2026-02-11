import React from "react";
import DashboardButton from "./components/DashboardButton";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-blue-50 flex flex-col justify-between">
      
      {/* Шапка */}
      <header className="text-center mt-8">
        <h1 className="text-4xl font-extrabold text-blue-700 drop-shadow-md">
          Ваш Трекер
        </h1>
      </header>

      {/* Центр с кнопками */}
      <main className="flex flex-col items-center gap-6 mt-12">
        <DashboardButton label="Статистика" />
        <DashboardButton label="Добавить действие" />
        <DashboardButton label="Выставить напоминание" />
        <DashboardButton label="Выбрать день" />
      </main>

      {/* Подвал */}
      <footer className="text-center mb-4 text-gray-500 text-sm">
        Created by LilPupsik ❤️
      </footer>
    </div>
  );
}
