/**
 * Calendar App
 * Monthly calendar with event management
 */

import { useState, useEffect } from 'react';
import './Calendar.css';

interface CalendarProps {
  windowId: string;
  nodeId?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  time?: string; // HH:MM format
  description?: string;
  color: string;
}

const STORAGE_KEY = 'calendar-app-events';
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];

export default function Calendar({ windowId }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');

  // Load events from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEvents(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to parse calendar events:', err);
      }
    }
  }, []);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get events for a specific date
  const getEventsForDate = (dateStr: string): CalendarEvent[] => {
    return events.filter(event => event.date === dateStr);
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Go to today
  const goToday = () => {
    setCurrentDate(new Date());
  };

  // Open event creation modal
  const openEventModal = (dateStr: string) => {
    setSelectedDate(dateStr);
    setNewEventTitle('');
    setNewEventTime('');
    setNewEventDescription('');
    setShowEventModal(true);
  };

  // Create new event
  const createEvent = () => {
    if (!newEventTitle.trim() || !selectedDate) return;

    const newEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      title: newEventTitle,
      date: selectedDate,
      time: newEventTime || undefined,
      description: newEventDescription || undefined,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };

    setEvents(prev => [...prev, newEvent]);
    setShowEventModal(false);
  };

  // Delete event
  const deleteEvent = (id: string) => {
    const confirmed = confirm('Delete this event?');
    if (confirmed) {
      setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  // Generate calendar grid
  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days: (number | null)[] = [];

    // Fill empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Fill actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const calendarDays = generateCalendar();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const today = formatDate(new Date());

  return (
    <div className="calendar-app">
      {/* Header */}
      <div className="calendar-app__header">
        <button onClick={prevMonth} className="calendar-app__nav-button">◀</button>
        <h2 className="calendar-app__month">{monthName}</h2>
        <button onClick={nextMonth} className="calendar-app__nav-button">▶</button>
        <button onClick={goToday} className="calendar-app__today-button">Today</button>
      </div>

      {/* Weekday headers */}
      <div className="calendar-app__weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-app__weekday">{day}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="calendar-app__grid">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="calendar-app__day calendar-app__day--empty" />;
          }

          const dateStr = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
          const dayEvents = getEventsForDate(dateStr);
          const isToday = dateStr === today;

          return (
            <div
              key={dateStr}
              className={`calendar-app__day ${isToday ? 'calendar-app__day--today' : ''}`}
              onClick={() => openEventModal(dateStr)}
            >
              <div className="calendar-app__day-number">{day}</div>
              <div className="calendar-app__day-events">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    className="calendar-app__event-dot"
                    style={{ backgroundColor: event.color }}
                    title={event.title}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteEvent(event.id);
                    }}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <div className="calendar-app__event-more">+{dayEvents.length - 3}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="calendar-app__modal-overlay" onClick={() => setShowEventModal(false)}>
          <div className="calendar-app__modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="calendar-app__modal-title">
              New Event - {selectedDate && new Date(selectedDate + 'T00:00').toLocaleDateString()}
            </h3>

            <input
              type="text"
              className="calendar-app__input"
              placeholder="Event title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              autoFocus
            />

            <input
              type="time"
              className="calendar-app__input"
              value={newEventTime}
              onChange={(e) => setNewEventTime(e.target.value)}
            />

            <textarea
              className="calendar-app__textarea"
              placeholder="Description (optional)"
              value={newEventDescription}
              onChange={(e) => setNewEventDescription(e.target.value)}
              rows={3}
            />

            {/* Show existing events for this date */}
            {selectedDate && getEventsForDate(selectedDate).length > 0 && (
              <div className="calendar-app__existing-events">
                <h4>Existing Events:</h4>
                {getEventsForDate(selectedDate).map(event => (
                  <div key={event.id} className="calendar-app__existing-event">
                    <span style={{ color: event.color }}>●</span>
                    <span>{event.time || 'All day'} - {event.title}</span>
                    <button onClick={() => deleteEvent(event.id)}>🗑️</button>
                  </div>
                ))}
              </div>
            )}

            <div className="calendar-app__modal-actions">
              <button onClick={() => setShowEventModal(false)} className="calendar-app__button calendar-app__button--secondary">
                Cancel
              </button>
              <button onClick={createEvent} className="calendar-app__button calendar-app__button--primary">
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
