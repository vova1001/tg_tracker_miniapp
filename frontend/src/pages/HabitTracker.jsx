// src/pages/HabitTracker.jsx
import React, { useState } from 'react';
import UserHeader from '../components/UserHeader';

export default function HabitTracker() {
  const [selectedDay, setSelectedDay] = useState('today');
  const [habits, setHabits] = useState([
    { id: 1, name: 'Тренировка по легкой атлетике', color: 'red', completed: false },
    { id: 2, name: 'Чтение книги', color: 'blue', completed: false },
    { id: 3, name: 'Прогулка в парке', color: 'green', completed: false },
    { id: 4, name: 'Выпить стакан воды', color: 'yellow', progress: '3/6', completed: false },
  ]);

  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const dates = [7, 8, 9, 10, 11, 12, 13];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Шапка с фото пользователя - справа сверху */}
      <div className="flex justify-end p-4">
        <UserHeader />
      </div>

      <div className="px-4 pb-8">
        {/* Заголовок */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Трекер привычек</h1>

        {/* Табы Все/Сегодня */}
        <div className="flex gap-4 mb-6">
          <button 
            className={`pb-2 px-1 ${selectedDay === 'all' ? 'border-b-2 border-green-500 text-green-600 font-semibold' : 'text-gray-500'}`}
            onClick={() => setSelectedDay('all')}
          >
            Все
          </button>
          <button 
            className={`pb-2 px-1 ${selectedDay === 'today' ? 'border-b-2 border-green-500 text-green-600 font-semibold' : 'text-gray-500'}`}
            onClick={() => setSelectedDay('today')}
          >
            Сегодня
          </button>
        </div>

        {/* Календарная неделя */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="grid grid-cols-7 gap-2 text-center mb-2">
            {days.map(day => (
              <div key={day} className="text-sm text-gray-500">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 text-center">
            {dates.map(date => (
              <div key={date} className="text-lg font-medium text-gray-700">{date}</div>
            ))}
          </div>
        </div>

        {/* Список привычек */}
        <div className="space-y-3">
          {habits.map(habit => (
            <div key={habit.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
              {/* Цветной индикатор */}
              <div className={`w-1 h-8 rounded-full bg-${habit.color}-500`} />
              
              {/* Название */}
              <div className="flex-1">
                <span className="text-gray-800">📌 {habit.name}</span>
                {habit.progress && (
                  <span className="block text-xs text-gray-500 mt-1">{habit.progress}</span>
                )}
              </div>

              {/* Чекбокс */}
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500"
                checked={habit.completed}
                onChange={() => {
                  const newHabits = habits.map(h => 
                    h.id === habit.id ? {...h, completed: !h.completed} : h
                  );
                  setHabits(newHabits);
                }}
              />
            </div>
          ))}

          {/* Кнопка добавления */}
          <button className="w-full py-3 bg-white border border-dashed border-green-400 rounded-xl text-green-600 font-medium hover:bg-green-50 transition-colors">
            + Добавить привычку
          </button>
        </div>
      </div>
    </div>
  );
}