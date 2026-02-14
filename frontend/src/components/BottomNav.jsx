import { NavLink } from "react-router-dom";
import { Home, Repeat, BookOpen, StickyNote, Settings } from "lucide-react";

export default function BottomNav() {
  const base = "flex flex-col items-center justify-center transition-all duration-200";

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2
                 z-50
                 bg-white/80 backdrop-blur-lg
                 px-6 py-3
                 rounded-2xl shadow-lg flex gap-8"
    >
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${base} ${isActive ? "text-blue-900 scale-110" : "text-gray-400"}`
        }
      >
        <Home size={22} />
      </NavLink>

      <NavLink
        to="/habits"
        className={({ isActive }) =>
          `${base} ${isActive ? "text-blue-900 scale-110" : "text-gray-400"}`
        }
      >
        <Repeat size={22} />
      </NavLink>

      <NavLink
        to="/diary"
        className={({ isActive }) =>
          `${base} ${isActive ? "text-blue-900 scale-110" : "text-gray-400"}`
        }
      >
        <BookOpen size={22} />
      </NavLink>

      <NavLink
        to="/notes"
        className={({ isActive }) =>
          `${base} ${isActive ? "text-blue-900 scale-110" : "text-gray-400"}`
        }
      >
        <StickyNote size={22} />
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `${base} ${isActive ? "text-blue-900 scale-110" : "text-gray-400"}`
        }
      >
        <Settings size={22} />
      </NavLink>
    </div>
  );
}
