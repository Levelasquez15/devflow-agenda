import React from 'react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Flame, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Trash2
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export default function WeeklyView() {
  const { 
    schedule, 
    roadmaps, 
    startStudySession, 
    setIsQuickAddOpen,
    deleteScheduledTask,
    updateScheduledTask,
    getStudyStats
  } = useStudy();

  const stats = getStudyStats();

  const daysOfWeek = [
    { key: 'Lunes', date: '2026-09-28', isToday: true, label: 'Lun 28 Sep' },
    { key: 'Martes', date: '2026-09-29', isToday: false, isTomorrow: true, label: 'Mar 29 Sep' },
    { key: 'Miércoles', date: '2026-09-30', isToday: false, label: 'Mié 30 Sep' },
    { key: 'Jueves', date: '2026-10-01', isToday: false, label: 'Jue 01 Oct' },
    { key: 'Viernes', date: '2026-10-02', isToday: false, label: 'Vie 02 Oct' },
    { key: 'Sábado', date: '2026-10-03', isToday: false, label: 'Sáb 03 Oct' },
    { key: 'Domingo', date: '2026-10-04', isToday: false, label: 'Dom 04 Oct' }
  ];

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
    // Fallback if not found in pre-populated days
    return {
      id: task.topicId,
      title: task.title,
      estimatedMinutes: task.durationMinutes,
      youtubeId: 'YS4e4q9oBaU',
      concepts: ['Estudio autónomo', 'Práctica de código'],
      exercises: [{ id: 'ex-def-1', text: 'Completar objetivos planificados del tema', done: false }]
    };
  };

  const handleLaunchSession = (task) => {
    const topic = getTopicForTask(task);
    startStudySession(topic, task, 'pomodoro');
  };

  const formatMinutes = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
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
      {/* Weekly Header Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          flexShrink: 0
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Agenda Semanal de Aprendizaje</h1>
            <span
              style={{
                fontSize: '0.75rem',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: '3px 10px',
                borderRadius: '999px',
                fontWeight: 600
              }}
            >
              Semana 39 • 28 Sep - 4 Oct 2026
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            Organiza tus bloques de estudio diario, monitorea el tiempo real dedicado y cumple tus metas de roadmap.
          </p>
        </div>

        {/* Weekly Progress Overview Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            className="glass-card"
            style={{
              padding: '10px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Completado esta Semana
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {stats.completedCount} de {stats.totalTasksCount} temas
              </div>
            </div>
            <div style={{ width: '1px', height: '28px', background: 'var(--border-subtle)' }} />
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Horas Estudiadas
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                {(stats.weekSeconds / 3600).toFixed(1)} hrs
              </div>
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

      {/* 7-Day Grid View */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '12px',
          overflowX: 'auto',
          overflowY: 'hidden',
          minHeight: '480px'
        }}
      >
        {daysOfWeek.map((day) => {
          const dayTasks = schedule.filter(t => t.date === day.date || t.dayName === day.key);
          const totalPlannedMins = dayTasks.reduce((acc, t) => acc + (t.durationMinutes || 45), 0);
          const totalDoneSecs = dayTasks.reduce((acc, t) => acc + (t.actualSecondsStudied || 0), 0);

          return (
            <div
              key={day.key}
              style={{
                background: day.isToday ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-sidebar)',
                border: day.isToday ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* Day Header */}
              <div
                style={{
                  padding: '12px 14px',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: day.isToday ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      color: day.isToday ? '#a5b4fc' : 'var(--text-primary)'
                    }}
                  >
                    {day.key}
                  </span>
                  {day.isToday && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        background: 'var(--accent-primary)',
                        color: '#fff',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                      }}
                    >
                      HOY
                    </span>
                  )}
                  {day.isTomorrow && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        background: 'rgba(6, 182, 212, 0.2)',
                        color: '#38bdf8',
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}
                    >
                      Mañana
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>{day.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>
                    {totalDoneSecs > 0 ? formatMinutes(totalDoneSecs) : `${totalPlannedMins}m`}
                  </span>
                </div>
              </div>

              {/* Tasks List */}
              <div
                style={{
                  flex: 1,
                  padding: '10px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  overflowY: 'auto'
                }}
              >
                {dayTasks.map((task) => {
                  const roadmap = getRoadmapForTask(task);
                  const isCompleted = task.status === 'completed';

                  return (
                    <div
                      key={task.id}
                      className="glass-card glass-card-hoverable"
                      style={{
                        padding: '12px',
                        borderLeft: `3px solid ${roadmap?.color || 'var(--accent-primary)'}`,
                        background: isCompleted ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-card)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      {/* Badge and Time Slot */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className={`badge ${roadmap?.badgeClass || 'badge-go'}`} style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                          {roadmap?.title?.split(' ')[0] || 'Roadmap'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            onClick={() => deleteScheduledTask(task.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-dim)',
                              cursor: 'pointer',
                              padding: '2px'
                            }}
                            title="Eliminar de la agenda"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Topic Title */}
                      <div
                        style={{
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          lineHeight: '1.3',
                          color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: isCompleted ? 'line-through' : 'none'
                        }}
                      >
                        {task.title}
                      </div>

                      {/* Footer: Time & Action */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          <Clock size={12} />
                          <span>{task.durationMinutes || 45} min</span>
                        </div>

                        {isCompleted ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.72rem', fontWeight: 600 }}>
                            <CheckCircle2 size={13} />
                            <span>Hecho</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleLaunchSession(task)}
                            className="btn btn-primary"
                            style={{
                              padding: '3px 8px',
                              fontSize: '0.72rem',
                              borderRadius: '6px',
                              gap: '4px',
                              height: '24px'
                            }}
                          >
                            <Play size={11} fill="#fff" />
                            <span>Estudiar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {dayTasks.length === 0 && (
                  <div
                    style={{
                      padding: '24px 8px',
                      textAlign: 'center',
                      color: 'var(--text-dim)',
                      fontSize: '0.75rem',
                      fontStyle: 'italic'
                    }}
                  >
                    Sin sesiones programadas
                  </div>
                )}
              </div>

              {/* Add Task Button at bottom of column */}
              <div style={{ padding: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setIsQuickAddOpen(true)}
                  className="btn btn-ghost"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <Plus size={13} />
                  <span>Añadir</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
