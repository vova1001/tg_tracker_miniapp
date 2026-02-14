// src/components/DashboardButton.jsx
import React from 'react';

export default function DashboardButton({ label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border border-green-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 font-medium text-lg"
    >
      {label}
    </button>
  );
}