import React from "react";

export default function DashboardButton({ label }) {
  return (
    <button
      className="w-64 py-4 bg-blue-500 text-white font-semibold rounded-xl shadow-lg 
                 hover:bg-blue-600 hover:scale-105 transition-all duration-300"
    >
      {label}
    </button>
  );
}
