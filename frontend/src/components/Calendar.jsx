import React, { useState, useEffect, useRef } from 'react';

const Calendar = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef(null);

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        onDateSelect(selectedDate);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedDate, onDateSelect]);

  const getMonthDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = firstDayOfWeek; i > 0; i--) {
      const day = new Date(year, month, 1 - i);
      days.push({ date: day, isCurrentMonth: false });
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const day = new Date(year, month, i);
      days.push({ date: day, isCurrentMonth: true });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const day = new Date(year, month + 1, i);
      days.push({ date: day, isCurrentMonth: false });
    }
    
    return days;
  };

  const isSelectedDate = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date) => {
    return date.toDateString() === new Date().toDateString();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5" ref={calendarRef}>
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-100 text-blue-900"
        >
          ←
        </button>
        <span className="text-base font-medium text-blue-900">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button 
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-100 text-blue-900"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-blue-400 py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {getMonthDays().map((day, index) => (
          <div
            key={index}
            className={`
              text-center py-2 rounded-lg cursor-pointer transition-all text-sm
              ${!day.isCurrentMonth ? 'text-blue-200' : 'text-blue-900 hover:bg-blue-100'}
              ${isSelectedDate(day.date) ? 'bg-blue-900 text-white hover:bg-blue-800' : ''}
              ${isToday(day.date) && !isSelectedDate(day.date) ? 'font-semibold text-blue-900' : ''}
            `}
            onClick={() => onDateSelect(day.date)}
          >
            {day.date.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;