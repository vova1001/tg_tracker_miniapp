import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./auth/useAuth";

import Layout from "./components/Layout";
import MainPage from "./pages/MainPage";
import HabitTracker from "./pages/HabitTracker";
import Diary from "./pages/Diary";
import Notes from "./pages/Notes";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <p className="text-blue-900">Загрузка...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><MainPage /></Layout>} />
        <Route path="/habits" element={<Layout><HabitTracker /></Layout>} />
        <Route path="/diary" element={<Layout><Diary /></Layout>} />
        <Route path="/notes" element={<Layout><Notes /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
