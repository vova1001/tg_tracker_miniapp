import { useNavigate } from "react-router-dom";

export default function DashboardButton({ label, to }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="w-full py-4 rounded-xl
                 border-2 border-blue-300
                 text-blue-900 font-semibold
                 bg-white
                 shadow-md
                 hover:bg-blue-50 hover:shadow-lg
                 transition-all duration-300"
    >
      {label}
    </button>
  );
}
