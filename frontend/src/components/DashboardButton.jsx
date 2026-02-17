import { Link } from 'react-router-dom';

export default function DashboardButton({ label, to }) {
  return (
    <Link
      to={to}
      className="w-full bg-white hover:bg-blue-50 text-blue-900 font-semibold py-4 px-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 border-2 border-blue-200 text-center"
    >
      {label}
    </Link>
  );
}