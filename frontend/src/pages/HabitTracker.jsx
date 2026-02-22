import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Home, Repeat, BookOpen, StickyNote, Settings, Sparkles } from 'lucide-react';
import Calendar from '../components/Calendar';

export default function HabitTracker() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [swipedHabitId, setSwipedHabitId] = useState(null);
  const [showButtons, setShowButtons] = useState({});
  const [celebrationHabitId, setCelebrationHabitId] = useState(null);
  const calendarButtonRef = useRef(null);
  const calendarRef = useRef(null);
  
  // Для мыши и тача
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const isDragging = useRef(false);
  const habitRefs = useRef({});
  const dragStartTime = useRef(0);
  const dragOffset = useRef(0);

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  // Загружаем все привычки из localStorage
  const [allHabits, setAllHabits] = useState(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });

  // Сохраняем в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(allHabits));
  }, [allHabits]);

  // Фильтруем привычки для выбранной даты
  const habits = allHabits.filter(habit => 
    habit.date === selectedDate.toDateString()
  );

  // Функция для увеличения прогресса
  const increaseProgress = (habitId) => {
    setAllHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const maxProgress = habit.scale?.value ? parseInt(habit.scale.value) : 1;
        const newProgress = Math.min((habit.progress || 0) + 1, maxProgress);
        const completed = newProgress >= maxProgress;
        
        // Если достигли максимума - запускаем эффект
        if (completed && !habit.completed) {
          setCelebrationHabitId(habitId);
          setTimeout(() => setCelebrationHabitId(null), 1500);
        }
        
        return {
          ...habit,
          progress: newProgress,
          completed
        };
      }
      return habit;
    }));
  };

  // Получение дней текущей недели
  const getWeekDays = () => {
    const today = new Date(selectedDate);
    const day = today.getDay();
    const diff = day === 0 ? 6 : day - 1;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - diff);
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDaysList = getWeekDays();

  const isToday = (date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const getHeaderText = () => {
    const today = new Date();
    const selected = new Date(selectedDate);
    
    if (isToday(selectedDate)) {
      return 'Сегодня';
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (selected.toDateString() === tomorrow.toDateString()) {
      return 'Завтра';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (selected.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    }
    
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    return `${selected.getDate()} ${months[selected.getMonth()]}`;
  };

  // Обработчики календаря
  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const closeCalendar = () => {
    setIsCalendarOpen(false);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    closeCalendar();
  };

  const handleDateCircleClick = (date) => {
    setSelectedDate(date);
  };

  // Обработчики свайпа
  const handleDragStart = (e, habitId) => {
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    
    dragStartX.current = clientX;
    dragCurrentX.current = clientX;
    isDragging.current = true;
    dragStartTime.current = Date.now();
    dragOffset.current = 0;
    
    if (swipedHabitId && swipedHabitId !== habitId) {
      setSwipedHabitId(null);
      setShowButtons(prev => ({ ...prev, [swipedHabitId]: false }));
    }
    
    e.preventDefault();
  };

  const handleDragMove = (e, habitId) => {
    if (!isDragging.current) return;
    
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    dragCurrentX.current = clientX;
    
    const rawDiff = dragCurrentX.current - dragStartX.current;
    
    let translateX = 0;
    if (swipedHabitId === habitId) {
      translateX = Math.min(0, Math.max(-96, rawDiff - 96));
    } else {
      translateX = Math.min(0, Math.max(-96, rawDiff));
    }
    
    dragOffset.current = translateX;
    
    const habitElement = habitRefs.current[habitId];
    if (habitElement) {
      habitElement.style.transition = 'none';
      habitElement.style.transform = `translateX(${translateX}px)`;
    }
    
    if (translateX < -30) {
      setShowButtons(prev => ({ ...prev, [habitId]: true }));
    } else {
      setShowButtons(prev => ({ ...prev, [habitId]: false }));
    }
    
    e.preventDefault();
  };

  const handleDragEnd = (e, habitId) => {
    if (!isDragging.current) return;
    
    const diff = dragCurrentX.current - dragStartX.current;
    const dragDuration = Date.now() - dragStartTime.current;
    const habitElement = habitRefs.current[habitId];
    
    if (habitElement) {
      habitElement.style.transition = 'transform 0.2s ease';
      
      const isQuickSwipe = dragDuration < 200 && Math.abs(diff) > 20;
      
      if (swipedHabitId === habitId) {
        if (diff > 30 || (isQuickSwipe && diff > 20)) {
          setSwipedHabitId(null);
          setShowButtons(prev => ({ ...prev, [habitId]: false }));
          habitElement.style.transform = 'translateX(0)';
        } else {
          setShowButtons(prev => ({ ...prev, [habitId]: true }));
          habitElement.style.transform = 'translateX(-96px)';
        }
      } else {
        if (diff < -30 || (isQuickSwipe && diff < -20)) {
          setSwipedHabitId(habitId);
          setShowButtons(prev => ({ ...prev, [habitId]: true }));
          habitElement.style.transform = 'translateX(-96px)';
        } else {
          setShowButtons(prev => ({ ...prev, [habitId]: false }));
          habitElement.style.transform = 'translateX(0)';
        }
      }
    }
    
    isDragging.current = false;
    dragStartX.current = 0;
    dragCurrentX.current = 0;
  };

  const handleMouseLeave = (habitId) => {
    if (isDragging.current) {
      const habitElement = habitRefs.current[habitId];
      if (habitElement) {
        habitElement.style.transition = 'transform 0.2s ease';
        if (swipedHabitId === habitId) {
          setShowButtons(prev => ({ ...prev, [habitId]: true }));
          habitElement.style.transform = 'translateX(-96px)';
        } else {
          setShowButtons(prev => ({ ...prev, [habitId]: false }));
          habitElement.style.transform = 'translateX(0)';
        }
      }
      isDragging.current = false;
    }
  };

  // Синхронизация свайпов
  useEffect(() => {
    habits.forEach(habit => {
      const habitElement = habitRefs.current[habit.id];
      if (habitElement) {
        habitElement.style.transition = 'transform 0.2s ease';
        if (swipedHabitId === habit.id) {
          setShowButtons(prev => ({ ...prev, [habit.id]: true }));
          habitElement.style.transform = 'translateX(-96px)';
        } else {
          setShowButtons(prev => ({ ...prev, [habit.id]: false }));
          habitElement.style.transform = 'translateX(0)';
        }
      }
    });
  }, [swipedHabitId, habits]);

  // Закрытие календаря при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCalendarOpen && 
          calendarRef.current && 
          !calendarRef.current.contains(event.target) && 
          calendarButtonRef.current && 
          !calendarButtonRef.current.contains(event.target)) {
        closeCalendar();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCalendarOpen]);

  // Закрыть свайп при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (swipedHabitId && !event.target.closest('.habit-item')) {
        setSwipedHabitId(null);
        setShowButtons(prev => ({ ...prev, [swipedHabitId]: false }));
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [swipedHabitId]);

  // Глобальные обработчики
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging.current) {
        const activeHabitId = swipedHabitId;
        if (activeHabitId) {
          const habitElement = habitRefs.current[activeHabitId];
          if (habitElement) {
            habitElement.style.transition = 'transform 0.2s ease';
            setShowButtons(prev => ({ ...prev, [activeHabitId]: true }));
            habitElement.style.transform = 'translateX(-96px)';
          }
        }
        isDragging.current = false;
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [swipedHabitId]);

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-md pb-24">
        
        {/* Шапка */}
        <div className="flex items-center justify-end mb-8">
          <button 
            ref={calendarButtonRef}
            onClick={toggleCalendar}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              isCalendarOpen 
                ? 'bg-blue-900 text-white' 
                : 'bg-white text-blue-900 hover:bg-blue-100'
            } shadow-sm`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* Заголовок */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-blue-900">
            {getHeaderText()}
          </h2>
        </div>

        {/* Дни недели */}
        <div className="grid grid-cols-7 gap-2 mb-8">
          {weekDaysList.map((date, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleDateCircleClick(date)}
            >
              <span className="text-xs font-medium text-blue-400 mb-2">
                {weekDays[index]}
              </span>
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-base font-medium
                  border-2 transition-all
                  ${isToday(date) && !isSelected(date)
                    ? 'border-blue-900 bg-transparent text-blue-900' 
                    : ''
                  }
                  ${isSelected(date)
                    ? 'border-blue-900 bg-blue-900 text-white' 
                    : 'border-blue-900 bg-transparent text-blue-900'
                  }
                  hover:bg-blue-100 hover:border-blue-800
                `}
              >
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Календарь */}
        {isCalendarOpen && (
          <div className="mb-6" ref={calendarRef}>
            <Calendar 
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>
        )}

        {/* Список привычек для выбранной даты */}
        <div className="space-y-3 mb-8">
          {habits.length > 0 ? (
            habits.map(habit => {
              const maxProgress = habit.scale?.value ? parseInt(habit.scale.value) : 1;
              const progressPercent = ((habit.progress || 0) / maxProgress) * 100;
              
              return (
                <div 
                  key={habit.id}
                  className="relative overflow-hidden habit-item select-none"
                  onMouseDown={(e) => handleDragStart(e, habit.id)}
                  onMouseMove={(e) => handleDragMove(e, habit.id)}
                  onMouseUp={(e) => handleDragEnd(e, habit.id)}
                  onMouseLeave={() => handleMouseLeave(habit.id)}
                  onTouchStart={(e) => handleDragStart(e, habit.id)}
                  onTouchMove={(e) => handleDragMove(e, habit.id)}
                  onTouchEnd={(e) => handleDragEnd(e, habit.id)}
                  onTouchCancel={(e) => handleDragEnd(e, habit.id)}
                >
                  {/* Контейнер для свайпа */}
                  <div 
                    ref={el => habitRefs.current[habit.id] = el}
                    className="flex transition-transform duration-200 will-change-transform"
                    style={{ 
                      transform: swipedHabitId === habit.id ? 'translateX(-96px)' : 'translateX(0)'
                    }}
                  >
                    {/* Основной контент с цветной обводкой */}
                    <div 
                      className={`flex-1 bg-white rounded-2xl p-4 shadow-sm transition-all duration-300 ${
                        celebrationHabitId === habit.id ? 'scale-105 shadow-xl' : ''
                      }`}
                      style={{ 
                        borderLeft: `4px solid ${habit.color || '#3B82F6'}`,
                        boxShadow: celebrationHabitId === habit.id ? `0 0 20px ${habit.color || '#3B82F6'}40` : ''
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{habit.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base font-medium text-blue-900">
                              {habit.title}
                            </span>
                          </div>
                          {habit.description && (
                            <p className="text-sm text-blue-400 mt-0.5">
                              {habit.description}
                            </p>
                          )}
                          
                          {/* Блок прогресса */}
                          {habit.scale && (
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-blue-900 font-medium">
                                  {habit.progress || 0} / {habit.scale.value}
                                </span>
                                <span className="text-blue-400">
                                  {habit.scale.unit}
                                </span>
                              </div>
                              
                              {/* Прогресс-бар */}
                              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
                                  style={{ 
                                    width: `${progressPercent}%`,
                                    backgroundColor: habit.color || '#3B82F6'
                                  }}
                                />
                                
                                {/* Эффект пульсации при достижении цели */}
                                {habit.completed && (
                                  <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Кнопка для увеличения прогресса */}
                        <button 
                          className={`
                            w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                            ${habit.completed 
                              ? 'bg-green-500 text-white hover:bg-green-600' 
                              : 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                            }
                            ${celebrationHabitId === habit.id ? 'animate-bounce' : ''}
                          `}
                          onClick={(e) => {
                            e.stopPropagation();
                            increaseProgress(habit.id);
                          }}
                          disabled={habit.completed}
                        >
                          {habit.completed ? (
                            <Sparkles size={16} className="animate-spin" />
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </button>
                      </div>
                      
                      {/* Поздравительное сообщение */}
                      {celebrationHabitId === habit.id && (
                        <div className="mt-2 text-center text-sm font-medium text-green-600 animate-pulse">
                          🎉 Молодец! Цель достигнута! 🎉
                        </div>
                      )}
                    </div>

                    {/* Кнопки действий */}
                    {showButtons[habit.id] && (
                      <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                        <button 
                          className="w-12 h-20 bg-green-500 rounded-xl flex flex-col items-center justify-center text-white shadow-sm hover:bg-green-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Редактировать', habit.id);
                            setSwipedHabitId(null);
                            setShowButtons(prev => ({ ...prev, [habit.id]: false }));
                          }}
                        >
                          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <span className="text-xs">ред.</span>
                        </button>
                        <button 
                          className="w-12 h-20 bg-red-500 rounded-xl flex flex-col items-center justify-center text-white shadow-sm hover:bg-red-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAllHabits(allHabits.filter(h => h.id !== habit.id));
                            setSwipedHabitId(null);
                            setShowButtons(prev => ({ ...prev, [habit.id]: false }));
                          }}
                        >
                          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span className="text-xs">уд.</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-blue-400 text-lg">Нет задач на этот день</p>
            </div>
          )}
        </div>

        {/* Кнопка добавления привычки */}
        <button 
          onClick={() => navigate('/create-habit', { state: { selectedDate } })}
          className="w-full bg-blue-900 text-white py-4 rounded-xl text-lg font-medium hover:bg-blue-800 transition-colors"
        >
          Добавить привычку
        </button>
      </div>

      {/* Нижняя навигация */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-lg px-6 py-3 rounded-2xl shadow-lg flex gap-8">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center transition-all duration-200 ${isActive ? "text-blue-900 scale-110" : "text-gray-400"}`
          }
        >
          <Home size={22} />
        </NavLink>
        <NavLink
          to="/habits"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center transition-all duration-200 ${isActive ? "text-blue-900 scale-110" : "text-gray-400"}`
          }
        >
          <Repeat size={22} />
        </NavLink>
        <NavLink
          to="/diary"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center transition-all duration-200 ${isActive ? "text-blue-900 scale-110" : "text-gray-400"}`
          }
        >
          <BookOpen size={22} />
        </NavLink>
        <NavLink
          to="/notes"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center transition-all duration-200 ${isActive ? "text-blue-900 scale-110" : "text-gray-400"}`
          }
        >
          <StickyNote size={22} />
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center transition-all duration-200 ${isActive ? "text-blue-900 scale-110" : "text-gray-400"}`
          }
        >
          <Settings size={22} />
        </NavLink>
      </div>
    </div>
  );
}