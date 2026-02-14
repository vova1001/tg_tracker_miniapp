import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="absolute top-5 left-5 z-50
                 p-2 rounded-full
                 bg-blue-50/20 dark:bg-gray-800/40
                 shadow-md
                 hover:bg-blue-50/40 dark:hover:bg-gray-800/60
                 transition duration-200"
    >
      <ArrowLeft
        size={20}
        className="text-blue-500 dark:text-blue-400"
      />
    </button>
  );
}
