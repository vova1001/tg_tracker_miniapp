// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './auth/useAuth';
import MainPage from './pages/MainPage';
import HabitTracker from './pages/HabitTracker';

// Заглушки для других страниц
const Diary = () => <div className="p-8 text-center">Ежедневник в разработке</div>;
const Notes = () => <div className="p-8 text-center">Заметки в разработке</div>;

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Загрузка...</p>
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/habits" element={<HabitTracker />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </BrowserRouter>
  );
}