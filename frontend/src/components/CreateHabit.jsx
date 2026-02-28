import React, { useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { Home, Repeat, BookOpen, StickyNote, Settings } from 'lucide-react';

export default function CreateHabit() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Получаем данные из state
  const { selectedDate, habitToEdit } = location.state || { 
    selectedDate: new Date(),
    habitToEdit: null 
  };
  
  console.log('Editing habit:', habitToEdit); // Для отладки

  // Инициализируем форму данными из редактируемой привычки или пустыми значениями
  const [formData, setFormData] = useState({
    emoji: habitToEdit?.emoji || '📝',
    title: habitToEdit?.title || '',
    description: habitToEdit?.description || '',
    color: habitToEdit?.color || '#3B82F6',
    group: habitToEdit?.group || 'Нет'
  });

  // Состояния для шкалы измерения
  const [scaleEnabled, setScaleEnabled] = useState(!!habitToEdit?.scale);
  const [scaleValue, setScaleValue] = useState(habitToEdit?.scale?.value || '10');
  const [scaleUnit, setScaleUnit] = useState(habitToEdit?.scale?.unit || 'шт');
  const [customUnit, setCustomUnit] = useState('');
  const [showCustomUnit, setShowCustomUnit] = useState(false);

  // Сохраняем прогресс из редактируемой привычки (только для внутреннего использования)
  const savedProgress = habitToEdit?.progress || 0;

  // Предустановленные единицы измерения
  const presetUnits = [
    { value: 'шт', label: 'Штуки', emoji: '📦' },
    { value: 'км', label: 'Километры', emoji: '🏃' },
    { value: 'м', label: 'Метры', emoji: '📏' },
    { value: 'л', label: 'Литры', emoji: '💧' },
    { value: 'мл', label: 'Миллилитры', emoji: '🥛' },
    { value: 'кг', label: 'Килограммы', emoji: '🏋️' },
    { value: 'г', label: 'Граммы', emoji: '⚖️' },
    { value: 'мин', label: 'Минуты', emoji: '⏱️' },
    { value: 'ч', label: 'Часы', emoji: '⏰' },
    { value: 'стр', label: 'Страницы', emoji: '📄' },
    { value: 'раз', label: 'Раз', emoji: '🔄' },
    { value: 'подход', label: 'Подходы', emoji: '💪' },
  ];

  // Состояния для напоминания
  const [reminderEnabled, setReminderEnabled] = useState(habitToEdit?.reminders?.length > 0);
  const [reminderTimes, setReminderTimes] = useState(habitToEdit?.reminders || ['09:00']);

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showGroupInput, setShowGroupInput] = useState(false);
  const [newGroup, setNewGroup] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  
  // Определяем финальную единицу измерения
  const finalUnit = showCustomUnit ? customUnit : scaleUnit;
  
  const habitData = {
    ...formData,
    id: habitToEdit?.id || Date.now(),
    date: selectedDate.toDateString(), // используем selectedDate из state
    completed: false,
    progress: savedProgress,
    scale: scaleEnabled ? { 
      value: scaleValue, 
      unit: finalUnit 
    } : null,
    reminders: reminderEnabled ? reminderTimes : []
  };
  
  const existingHabits = JSON.parse(localStorage.getItem('habits') || '[]');
  
  let updatedHabits;
  if (habitToEdit) {
    updatedHabits = existingHabits.map(h => 
      h.id === habitToEdit.id ? habitData : h
    );
  } else {
    updatedHabits = [...existingHabits, habitData];
  }
  
  localStorage.setItem('habits', JSON.stringify(updatedHabits));
  
  // ВАЖНО: передаем selectedDate обратно, чтобы остаться на том же дне
  navigate('/habits', { state: { selectedDate: selectedDate } });
};

  const handleGroupClick = () => {
    setShowGroupInput(true);
  };

  const handleGroupSave = () => {
    if (newGroup.trim()) {
      setFormData(prev => ({ ...prev, group: newGroup.trim() }));
      setNewGroup('');
      setShowGroupInput(false);
    }
  };

  const handleGroupCancel = () => {
    setShowGroupInput(false);
    setNewGroup('');
  };

  const addReminderTime = () => {
    setReminderTimes([...reminderTimes, '12:00']);
  };

  const updateReminderTime = (index, value) => {
    const newTimes = [...reminderTimes];
    newTimes[index] = value;
    setReminderTimes(newTimes);
  };

  const removeReminderTime = (index) => {
    const newTimes = reminderTimes.filter((_, i) => i !== index);
    setReminderTimes(newTimes);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-6 max-w-md pb-24">
        
        {/* Шапка */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/habits')}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-900 hover:bg-blue-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-xl font-semibold text-blue-900">
            {habitToEdit ? 'Редактировать привычку' : 'Новая привычка'}
          </h1>
          <div className="w-10"></div>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ОДИН БОЛЬШОЙ БЛОК: Название, описание, цвет, группа */}
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            
            {/* Секция с эмодзи, названием и описанием */}
            <div className="p-5">
              <div className="flex gap-4">
                {/* Эмодзи */}
                <button
                  type="button"
                  onClick={() => {
                    const emoji = prompt('Введите эмодзи', formData.emoji);
                    if (emoji) setFormData(prev => ({ ...prev, emoji }));
                  }}
                  className="w-20 bg-gray-100 rounded-xl flex items-center justify-center text-4xl hover:bg-gray-200 transition-colors flex-shrink-0"
                  style={{ height: 'calc(2.5rem + 0.5rem + 2.5rem)' }}
                >
                  {formData.emoji}
                </button>
                
                {/* Название и описание */}
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Название"
                    className="w-full h-10 px-3 rounded-xl bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder-gray-400 text-sm"
                    required
                  />
                  
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Описание"
                    rows="1"
                    className="w-full h-10 px-3 py-2 rounded-xl bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder-gray-400 text-sm resize-none overflow-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Стильная линия */}
            <div className="relative px-5">
              <div className="border-b border-gray-200/70 w-[calc(100%-2rem)] mx-auto"></div>
            </div>

            {/* Секция с цветом */}
            <div className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-base text-gray-700">Цвет</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: formData.color }}
                  >
                    <svg 
                      className={`w-4 h-4 text-white transition-transform duration-300 ${showColorPicker ? 'rotate-90' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {showColorPicker && (
                    <div className="p-1 bg-white rounded-lg shadow-md border border-gray-200">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        className="w-24 h-8 rounded cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Стильная линия */}
            <div className="relative px-5">
              <div className="border-b border-gray-200/70 w-[calc(100%-2rem)] mx-auto"></div>
            </div>

            {/* Секция с группой */}
            <div className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-base text-gray-700">Группа</span>
                {!showGroupInput ? (
                  <button
                    type="button"
                    onClick={handleGroupClick}
                    className="h-8 px-4 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm flex items-center gap-1"
                  >
                    {formData.group}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newGroup}
                      onChange={(e) => setNewGroup(e.target.value)}
                      placeholder="Название группы"
                      className="h-8 px-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleGroupSave}
                      className="h-8 px-3 bg-blue-900 text-white rounded-full text-sm hover:bg-blue-800"
                    >
                      Ок
                    </button>
                    <button
                      type="button"
                      onClick={handleGroupCancel}
                      className="h-8 px-3 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* БЛОК 2: Шкала измерения */}
          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-base text-gray-700">Шкала измерения</span>
              <button
                type="button"
                onClick={() => setScaleEnabled(!scaleEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                  scaleEnabled ? 'bg-blue-900' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                    scaleEnabled ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            {scaleEnabled && (
              <div className="space-y-4">
                {/* Количество */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Сколько нужно сделать?</label>
                  <input
                    type="number"
                    value={scaleValue}
                    onChange={(e) => setScaleValue(e.target.value)}
                    placeholder="10"
                    className="w-full h-10 px-3 rounded-xl bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800"
                    min="1"
                  />
                </div>

                {/* Единицы измерения */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">В чем измеряем?</label>
                  
                  {/* Кнопки выбора единиц */}
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {presetUnits.slice(0, 6).map(unit => (
                      <button
                        key={unit.value}
                        type="button"
                        onClick={() => {
                          setScaleUnit(unit.value);
                          setShowCustomUnit(false);
                        }}
                        className={`
                          flex items-center justify-center gap-1 px-2 py-2 rounded-xl border-2 transition-all text-sm
                          ${!showCustomUnit && scaleUnit === unit.value 
                            ? 'border-blue-900 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-400'
                          }
                        `}
                      >
                        <span>{unit.emoji}</span>
                        <span>{unit.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {presetUnits.slice(6, 12).map(unit => (
                      <button
                        key={unit.value}
                        type="button"
                        onClick={() => {
                          setScaleUnit(unit.value);
                          setShowCustomUnit(false);
                        }}
                        className={`
                          flex items-center justify-center gap-1 px-2 py-2 rounded-xl border-2 transition-all text-sm
                          ${!showCustomUnit && scaleUnit === unit.value 
                            ? 'border-blue-900 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-400'
                          }
                        `}
                      >
                        <span>{unit.emoji}</span>
                        <span>{unit.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Своя единица измерения */}
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => setShowCustomUnit(!showCustomUnit)}
                      className={`
                        w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border-2 transition-all text-sm
                        ${showCustomUnit 
                          ? 'border-blue-900 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-400'
                        }
                      `}
                    >
                      <span>✏️</span>
                      <span>Своя единица</span>
                    </button>

                    {showCustomUnit && (
                      <div className="mt-2">
                        <input
                          type="text"
                          value={customUnit}
                          onChange={(e) => setCustomUnit(e.target.value)}
                          placeholder="например: глотков, подходов, кругов"
                          className="w-full h-10 px-3 rounded-xl bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Информация о текущем прогрессе (только при редактировании) */}
                {habitToEdit && savedProgress > 0 && (
                  <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
                    ⏳ Текущий прогресс: {savedProgress}/{scaleValue} {scaleUnit}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* БЛОК 3: Напоминание */}
          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-base text-gray-700">Напоминание</span>
              <button
                type="button"
                onClick={() => setReminderEnabled(!reminderEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                  reminderEnabled ? 'bg-blue-900' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                    reminderEnabled ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            {reminderEnabled && (
              <div className="space-y-3">
                {reminderTimes.map((time, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => updateReminderTime(index, e.target.value)}
                      className="flex-1 h-10 px-3 rounded-xl bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    {reminderTimes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeReminderTime(index)}
                        className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 flex items-center justify-center"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addReminderTime}
                  className="flex items-center gap-2 text-blue-900 hover:text-blue-700 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Добавить время</span>
                </button>
              </div>
            )}
          </div>

          {/* Кнопка сохранения */}
          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-4 rounded-2xl text-lg font-medium hover:bg-blue-800 transition-colors mt-6"
          >
            {habitToEdit ? 'Сохранить изменения' : 'Сохранить'}
          </button>
        </form>
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