// src/components/UserHeader.jsx
import React from 'react';
import { useAuth } from '../auth/useAuth';

export default function UserHeader() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      {/* Фото пользователя */}
      {user?.photo_url ? (
        <img 
          src={user.photo_url} 
          alt={user.first_name}
          className="w-10 h-10 rounded-full object-cover border-2 border-green-400"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-400 flex items-center justify-center text-white font-bold text-lg">
          {user?.first_name?.charAt(0) || '?'}
        </div>
      )}
      
      {/* Имя пользователя */}
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">Привет,</span>
        <span className="font-semibold text-gray-800">
          {user?.first_name} {user?.last_name || ''}
        </span>
        {user?.username && (
          <span className="text-xs text-gray-500">@{user.username}</span>
        )}
      </div>
    </div>
  );
}