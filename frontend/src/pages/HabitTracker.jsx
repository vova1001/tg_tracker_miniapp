import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { Home, Repeat, BookOpen, StickyNote, Settings, Sparkles, Filter } from 'lucide-react';
import Calendar from '../components/Calendar';

export default function HabitTracker() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [swipedHabitId, setSwipedHabitId] = useState(null);
  const [showButtons, setShowButtons] = useState({});
  const [completedHabitId, setCompletedHabitId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [showGroupFilter, setShowGroupFilter] = useState(false);
  
  // Для свайпа
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const isDragging = useRef(false);
  const habitRefs = useRef({});
  const dragStartTime = useRef(0);
  
  // Для календаря
  const calendarButtonRef = useRef(null);
  const calendarRef = useRef(null);
  const todayButtonRef = useRef(null);
  const filterButtonRef = useRef(null);
  const filterRef = useRef(null);
  
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  // При загрузке или возврате с создания задачи проверяем дату
  useEffect(() => {
    if (location.state?.selectedDate) {
      setSelectedDate(new Date(location.state.selectedDate));
    }
  }, [location.state]);
  
  // Загружаем привычки из localStorage
  const [allHabits, setAllHabits] = useState(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });

  // Сохраняем в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(allHabits));
  }, [allHabits]);

  // Получаем все уникальные группы с их цветами
  const groupColors = {};
  allHabits.forEach(habit => {
    if (habit.group && habit.group !== 'Нет' && !groupColors[habit.group]) {
      groupColors[habit.group] = habit.color || '#3B82F6';
    }
  });

  const availableGroups = ['all', ...Object.keys(groupColors)];

  // Фильтруем привычки для выбранной даты и группы
  const habits = allHabits.filter(habit => {
    const dateMatch = habit.date === selectedDate.toDateString();
    const groupMatch = selectedGroup === 'all' || habit.group === selectedGroup;
    return dateMatch && groupMatch;
  });

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
    
    if (isToday(selectedDate)) return 'Сегодня';
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (selected.toDateString() === tomorrow.toDateString()) return 'Завтра';
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (selected.toDateString() === yesterday.toDateString()) return 'Вчера';
    
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    return `${selected.getDate()} ${months[selected.getMonth()]}`;
  };

  // Функция для возврата на сегодня
  const goToToday = () => {
    setSelectedDate(new Date());
    if (isCalendarOpen) {
      setIsCalendarOpen(false);
    }
  };

  // Увеличение прогресса с анимацией завершения
  const increaseProgress = (habitId) => {
    setAllHabits(prev => prev.map(habit => {
      if (habit.id === habitId && habit.scale) {
        const maxProgress = parseInt(habit.scale.value) || 1;
        const currentProgress = habit.progress || 0;
        const newProgress = Math.min(currentProgress + 1, maxProgress);
        const wasCompleted = habit.completed;
        const isNowCompleted = newProgress >= maxProgress;
        
        if (!wasCompleted && isNowCompleted) {
          setCompletedHabitId(habitId);
          setTimeout(() => {
            setCompletedHabitId(prev => prev === habitId ? null : prev);
          }, 2000);
        }
        
        return { 
          ...habit, 
          progress: newProgress,
          completed: isNowCompleted
        };
      }
      return habit;
    }));
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

  // Закрытие фильтра групп при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showGroupFilter && 
          filterRef.current && 
          !filterRef.current.contains(event.target) && 
          filterButtonRef.current && 
          !filterButtonRef.current.contains(event.target)) {
        setShowGroupFilter(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showGroupFilter]);

  // Обработчики свайпа
  const handleDragStart = (e, habitId) => {
    if (completedHabitId === habitId) {
      setCompletedHabitId(null);
    }
    
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    
    dragStartX.current = clientX;
    dragCurrentX.current = clientX;
    isDragging.current = true;
    dragStartTime.current = Date.now();
    
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
    
    const habitElement = habitRefs.current[habitId];
    if (habitElement) {
      habitElement.style.transition = 'none';
      habitElement.style.transform = `translateX(${translateX}px)`;
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
          setSwipedHabitId(habitId);
          setShowButtons(prev => ({ ...prev, [habitId]: true }));
          habitElement.style.transform = 'translateX(-96px)';
        }
      } else {
        if (diff < -30 || (isQuickSwipe && diff < -20)) {
          setSwipedHabitId(habitId);
          setShowButtons(prev => ({ ...prev, [habitId]: true }));
          habitElement.style.transform = 'translateX(-96px)';
        } else {
          setSwipedHabitId(null);
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
          habitElement.style.transform = 'translateX(-96px)';
        } else {
          habitElement.style.transform = 'translateX(0)';
        }
      }
      isDragging.current = false;
    }
  };

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

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-md pb-24">
        
        {/* Шапка с тремя кнопками */}
        <div className="flex items-center justify-between mb-8">
          {/* Кнопка "На сегодня" слева */}
          <button 
            ref={todayButtonRef}
            onClick={goToToday}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-900 hover:bg-blue-100 transition-colors"
            title="Вернуться на сегодня"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M5 21v-4M3 19h4M19 3v4M17 5h4M19 21v-4M17 19h4M12 7v4m0 4v4m-4-4h4m4 0h-4" />
            </svg>
          </button>

          {/* Заголовок по центру */}
          <h2 className="text-xl font-semibold text-blue-900">
            {getHeaderText()}
          </h2>

          {/* Кнопка фильтра групп и календарь */}
          <div className="flex gap-2">
            {/* Кнопка фильтра групп */}
            <div className="relative">
              <button 
                ref={filterButtonRef}
                onClick={() => setShowGroupFilter(!showGroupFilter)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  selectedGroup !== 'all' 
                    ? 'bg-blue-900 text-white' 
                    : 'bg-white text-blue-900 hover:bg-blue-100'
                } shadow-sm`}
                title="Фильтр по группам"
              >
                <Filter size={18} />
              </button>

              {/* Выпадающее меню групп */}
              {showGroupFilter && (
                <div 
                  ref={filterRef}
                  className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl z-10 border border-gray-100 py-2"
                >
                  <button
                    onClick={() => {
                      setSelectedGroup('all');
                      setShowGroupFilter(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-400" />
                    <span className={selectedGroup === 'all' ? 'text-blue-900 font-medium' : 'text-gray-700'}>
                      Все задачи
                    </span>
                  </button>
                  
                  {availableGroups.filter(g => g !== 'all').map(group => (
                    <button
                      key={group}
                      onClick={() => {
                        setSelectedGroup(group);
                        setShowGroupFilter(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors flex items-center gap-3"
                    >
                      <div 
                        className="w-5 h-5 rounded-full" 
                        style={{ backgroundColor: groupColors[group] || '#3B82F6' }}
                      />
                      <span className={selectedGroup === group ? 'text-blue-900 font-medium' : 'text-gray-700'}>
                        {group}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Кнопка календаря */}
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
        </div>

        {/* Индикатор активного фильтра */}
        {selectedGroup !== 'all' && (
          <div className="mb-4 flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: groupColors[selectedGroup] || '#3B82F6' }}
              />
              <span className="text-sm text-gray-600">
                Группа: <span className="font-medium text-blue-900">{selectedGroup}</span>
              </span>
            </div>
            <button
              onClick={() => setSelectedGroup('all')}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>
        )}

        {/* Дни недели */}
        <div className="grid grid-cols-7 gap-2 mb-8">
          {weekDaysList.map((date, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setSelectedDate(date)}
            >
              <span className="text-xs font-medium text-blue-400 mb-2">
                {weekDays[index]}
              </span>
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-base font-medium border-2
                  ${isToday(date) && !isSelected(date)
                    ? 'border-blue-900 bg-transparent text-blue-900 font-bold' 
                    : ''
                  }
                  ${isSelected(date)
                    ? 'border-blue-900 bg-blue-900 text-white' 
                    : 'border-blue-900 bg-transparent text-blue-900'
                  }
                  hover:bg-blue-100 hover:border-blue-800 transition-all
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

        {/* Список привычек с прокруткой */}
        <div className="space-y-3 mb-8 max-h-[400px] overflow-y-auto pr-1">
          {habits.length > 0 ? (
            habits.map(habit => {
              const maxProgress = habit.scale?.value ? parseInt(habit.scale.value) : 1;
              const progressPercent = ((habit.progress || 0) / maxProgress) * 100;
              const isCompleted = habit.completed;
              const isAnimating = completedHabitId === habit.id;
              
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
                    {/* Основной контент с цветной обводкой и анимацией */}
                    <div 
                      className={`
                        flex-1 bg-white rounded-2xl p-4 shadow-sm transition-all duration-500
                        ${isAnimating ? 'scale-[1.02] shadow-xl' : ''}
                        ${isCompleted ? 'opacity-90' : ''}
                      `}
                      style={{ 
                        borderLeft: `4px solid ${habit.color || '#3B82F6'}`,
                        boxShadow: isAnimating ? `0 0 20px ${habit.color || '#3B82F6'}80` : ''
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{habit.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-medium text-blue-900">
                              {habit.title}
                            </span>
                          </div>
                          {habit.description && (
                            <p className="text-sm text-blue-400 mt-0.5">{habit.description}</p>
                          )}
                          
                          {/* Блок прогресса */}
                          {habit.scale && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-900 font-medium">
                                  {habit.progress || 0}/{habit.scale.value} {habit.scale.unit}
                                </span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isCompleted) {
                                      increaseProgress(habit.id);
                                    }
                                  }}
                                  disabled={isCompleted}
                                  className={`
                                    w-7 h-7 rounded-full flex items-center justify-center text-lg font-medium transition-all
                                    ${isCompleted 
                                      ? 'bg-green-500 text-white cursor-not-allowed' 
                                      : 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                                    }
                                    ${isAnimating ? 'animate-bounce' : ''}
                                  `}
                                >
                                  {isCompleted ? '✓' : '+'}
                                </button>
                              </div>
                              
                              {/* Прогресс-бар */}
                              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all duration-500 ease-out"
                                  style={{ 
                                    width: `${progressPercent}%`,
                                    backgroundColor: habit.color || '#3B82F6'
                                  }}
                                />
                              </div>

                              {/* Сообщение о завершении */}
                              {isAnimating && (
                                <div className="mt-2 text-center">
                                  <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600 animate-pulse">
                                    <Sparkles size={16} />
                                    Задача выполнена! 🎉
                                    <Sparkles size={16} />
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Кнопки действий */}
                    {showButtons[habit.id] && !isAnimating && (
                      <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                        <button 
                          className="w-12 h-20 bg-green-500 rounded-xl flex flex-col items-center justify-center text-white shadow-sm hover:bg-green-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/create-habit', { 
                              state: { 
                                selectedDate: selectedDate,
                                habitToEdit: habit
                              } 
                            });
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
              <p className="text-blue-400 text-lg">
                {selectedGroup !== 'all' 
                  ? `Нет задач в группе "${selectedGroup}" на этот день` 
                  : 'Нет задач на этот день'}
              </p>
            </div>
          )}
        </div>

        {/* Кнопка добавления привычки */}
        <button 
          onClick={() => {
            navigate('/create-habit', { 
              state: { selectedDate: selectedDate }
            });
          }}
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