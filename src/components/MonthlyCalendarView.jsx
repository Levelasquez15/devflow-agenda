import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Plus,
  Flame
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export default function MonthlyCalendarView() {
  const { schedule, roadmaps, setIsQuickAddOpen, startStudySession, getStudyStats } = useStudy();
  const [selectedDay, setSelectedDay] = useState('2026-09-28');
  const stats = getStudyStats();

  const daysOfWeekNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Sept 2026 grid (Sept 1 is Tuesday -> offset 1, 30 days)
  const calendarDays = [];
  // Previous month padding (1 day for August 31)
  calendarDays.push({ dayNumber: 31, date: '2026-08-31', isCurrentMonth: false });

  for (let i = 1; i <= 30; i++) {
    const dayStr = i < 10 ? `0${i}` : `${i}`;
    const fullDate = `2026-09-${dayStr}`;
    calendarDays.push({
      dayNumber: i,
      date: fullDate,
      isCurrentMonth: true,
      isToday: fullDate === '2026-09-28'
    });
  }

  // Next month padding (October 1 to 4 to complete grid of 35)
  for (let i = 1; i <= 4; i++) {
    calendarDays.push({
      dayNumber: i,
      date: `2026-10-0${i}`,
      isCurrentMonth: false
    });
  }

  const getTasksForDate = (date) => {
    return schedule.filter(t => t.date === date);
  };

  const selectedDayTasks = getTasksForDate(selectedDay);

  const getRoadmapForTask = (task) => {
    return roadmaps.find(r => r.id === task.roadmapId) || roadmaps[0];
  };

  const getTopicForTask = (task) => {
    const roadmap = getRoadmapForTask(task);
    if (!roadmap) return null;
    for (const w of roadmap.weeks) {
      const match = (w.days || []).find(d => d.id === task.topicId);
      if (match) return match;
    }
    return {
      id: task.topicId,
      title: task.title,
      estimatedMinutes: task.durationMinutes,
      youtubeId: 'YS4e4q9oBaU',
      concepts: ['Práctica libre'],
      exercises: []
    };
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        padding: '24px',
        gap: '20px'
      }}
    >
      {/* Calendar Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Calendario Mensual & Cumplimiento</h1>
            <span
              style={{
                fontSize: '0.78rem',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: '3px 12px',
                borderRadius: '999px',
                fontWeight: 600
              }}
            >
              Septiembre 2026
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            Visualiza tu constancia a lo largo del mes y gestiona la distribución de tus rutas de estudio.
          </p>
        </div>

        {/* Monthly Target Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            className="glass-card"
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Meta Mensual (40 hrs)
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {(stats.totalSeconds / 3600).toFixed(1)} / 40 hrs ({Math.min(100, Math.round((stats.totalSeconds / (40 * 3600)) * 100))}%)
              </div>
            </div>
            <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, Math.round((stats.totalSeconds / (40 * 3600)) * 100))}%`,
                  background: 'var(--gradient-brand)'
                }}
              />
            </div>
          </div>

          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="btn btn-primary"
            style={{ padding: '10px 18px' }}
          >
            <Plus size={16} />
            <span>Planear Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Calendar Body: Left (Month Grid) / Right (Selected Day Details) */}
      <div style={{ flex: 1, display: 'flex', gap: '20px', overflow: 'hidden' }}>
        
        {/* Left: 35-cell Month Grid */}
        <div
          style={{
            flex: '1 1 68%',
            background: 'var(--bg-sidebar)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Day of Week Headers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-canvas)'
            }}
          >
            {daysOfWeekNames.map((d, i) => (
              <div
                key={i}
                style={{
                  padding: '10px',
                  textAlign: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)'
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Month Grid Cells */}
          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gridTemplateRows: 'repeat(5, 1fr)',
              gap: '1px',
              background: 'var(--border-subtle)'
            }}
          >
            {calendarDays.map((cell, idx) => {
              const dayTasks = getTasksForDate(cell.date);
              const isSelected = selectedDay === cell.date;
              const hasCompleted = dayTasks.some(t => t.status === 'completed');

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDay(cell.date)}
                  style={{
                    background: isSelected 
                      ? 'rgba(99, 102, 241, 0.14)' 
                      : cell.isToday 
                        ? 'rgba(6, 182, 212, 0.08)' 
                        : cell.isCurrentMonth 
                          ? 'var(--bg-sidebar)' 
                          : 'rgba(10, 14, 23, 0.5)',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    position: 'relative',
                    border: isSelected ? '1px solid var(--accent-primary)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = cell.isToday 
                        ? 'rgba(6, 182, 212, 0.08)' 
                        : cell.isCurrentMonth 
                          ? 'var(--bg-sidebar)' 
                          : 'rgba(10, 14, 23, 0.5)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: cell.isToday ? 800 : 600,
                        color: cell.isToday 
                          ? '#38bdf8' 
                          : cell.isCurrentMonth 
                            ? 'var(--text-primary)' 
                            : 'var(--text-dim)',
                        width: '22px',
                        height: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        background: cell.isToday ? 'rgba(6, 182, 212, 0.2)' : 'transparent'
                      }}
                    >
                      {cell.dayNumber}
                    </span>

                    {hasCompleted && (
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#10b981',
                          boxShadow: '0 0 8px #10b981'
                        }}
                      />
                    )}
                  </div>

                  {/* Task preview pills */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px' }}>
                    {dayTasks.slice(0, 2).map((t) => {
                      const r = getRoadmapForTask(t);
                      return (
                        <div
                          key={t.id}
                          style={{
                            fontSize: '0.68rem',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            background: t.status === 'completed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            color: t.status === 'completed' ? '#34d399' : 'var(--text-secondary)',
                            borderLeft: `2px solid ${r?.color || 'var(--accent-primary)'}`,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {t.title}
                        </div>
                      );
                    })}
                    {dayTasks.length > 2 && (
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                        +{dayTasks.length - 2} más
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Day Inspector & Activities */}
        <div
          style={{
            flex: '1 1 32%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-canvas)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Detalles del Día
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {selectedDay}
              </h3>
            </div>
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="btn btn-secondary"
              style={{ padding: '4px 10px', fontSize: '0.75rem', height: '28px' }}
            >
              <Plus size={14} />
              <span>Añadir</span>
            </button>
          </div>

          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {selectedDayTasks.map((task) => {
              const roadmap = getRoadmapForTask(task);
              const topic = getTopicForTask(task);
              const isCompleted = task.status === 'completed';

              return (
                <div
                  key={task.id}
                  className="glass-card"
                  style={{
                    padding: '14px',
                    borderLeft: `3px solid ${roadmap?.color || 'var(--accent-primary)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className={`badge ${roadmap?.badgeClass || 'badge-go'}`} style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                      {roadmap?.title}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {task.durationMinutes} min
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                    {task.title}
                  </h4>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                    {isCompleted ? (
                      <span style={{ color: '#10b981', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <CheckCircle2 size={14} />
                        <span>Completado</span>
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        Pendiente
                      </span>
                    )}

                    {!isCompleted && (
                      <button
                        onClick={() => startStudySession(topic, task, 'pomodoro')}
                        className="btn btn-primary"
                        style={{ padding: '3px 10px', fontSize: '0.75rem', height: '24px' }}
                      >
                        Estudiar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {selectedDayTasks.length === 0 && (
              <div
                style={{
                  padding: '40px 10px',
                  textAlign: 'center',
                  color: 'var(--text-dim)',
                  fontSize: '0.85rem'
                }}
              >
                No hay sesiones en esta fecha. Haz clic en "Añadir" para planificar.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
