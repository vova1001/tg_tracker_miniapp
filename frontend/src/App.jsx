import React from "react";
import DashboardButton from "./components/DashboardButton";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen items-center">
     <header className="text-center mt-8">
 <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent
               bg-gradient-to-r from-green-500 to-green-400">
  Ваш трекер
</h1>

</header>


      <main className="flex flex-col items-center gap-6 mt-12">
        <DashboardButton label="Просмотр статистики" />
        <DashboardButton label="Добавить действие" />
        <DashboardButton label="Выставить напоминание" />
        <DashboardButton label="Создать группы для статистики" />
        <DashboardButton label="Ежедневник" />
      </main>

      <footer className="text-center mt-auto mb-6 text-gray-500 text-sm">
  Created by Vovchik🖤
</footer>
    </div>
  );
}
