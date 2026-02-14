// src/pages/MainPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardButton from '../components/DashboardButton';

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-4">
      <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent 
                     bg-gradient-to-r from-green-500 to-green-400 text-center mb-12">
        Ваш трекер
      </h1>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <DashboardButton 
          label="Трекер привычек" 
          onClick={() => navigate('/habits')}
        />
        <DashboardButton 
          label="Ежедневник" 
          onClick={() => navigate('/diary')}
        />
        <DashboardButton 
          label="Заметки" 
          onClick={() => navigate('/notes')}
        />
      </div>
    </div>
  );
}