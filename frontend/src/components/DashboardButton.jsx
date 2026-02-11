import React from "react";
import { motion } from "framer-motion";

export default function DashboardButton({ label }) {
  return (
  <motion.button
  whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
  whileTap={{ scale: 0.95 }}
  className="w-64 py-4 bg-gradient-to-r from-green-400 to-green-500
             text-white font-semibold rounded-2xl shadow-md
             hover:shadow-xl transition-all duration-300"
>
  {label}
</motion.button>

  );
}
