import React from 'react';
import { 
  BarChart3, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  Award,
  BookOpen
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export default function StatsDashboard() {
  const { schedule, roadmaps, getStudyStats } = useStudy();
  const stats = getStudyStats();

  const daysOfWeek = [
    { key: 'Lun', date: '2026-09-28', full: 'Lunes' },
    { key: 'Mar', date: '2026-09-29', full: 'Martes' },
    { key: 'Mié', date: '2026-09-30', full: 'Miércoles' },
    { key: 'Jue', date: '2026-10-01', full: 'Jueves' },
    { key: 'Vie', date: '2026-10-02', full: 'Viernes' },
    { key: 'Sáb', date: '2026-10-03', full: 'Sábado' },
    { key: 'Dom', date: '2026-10-04', full: 'Domingo' }
  ];

  // Calculate studied hours per day for the chart
  const weeklyStudyByDay = daysOfWeek.map(day => {
    const dayTasks = schedule.filter(t => t.date === day.date || t.dayName === day.full);
    const totalSecs = dayTasks.reduce((acc, t) => acc + (t.actualSecondsStudied || 0), 0);
    return {
      day: day.key,
      hours: Number((totalSecs / 3600).toFixed(1)),
      minutes: Math.round(totalSecs / 60)
    };
  });

  const maxHours = Math.max(...weeklyStudyByDay.map(d => d.hours), 2.5);

  const formatHours = (secs) => {
    const hrs = (secs / 3600).toFixed(1);
    return `${hrs} hrs`;
  };

  const completedSessions = schedule.filter(t => t.status === 'completed');

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        padding: '28px',
        gap: '24px',
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      {/* Title */}
      <div style={{ flexShrink: 0 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Contabilidad & Métricas de Estudio</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
          Registro exacto del tiempo de enfoque, constancia en tus rutas de aprendizaje y progreso semanal.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Horas Hoy
            </span>
            <Clock size={16} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
            {formatHours(stats.todaySeconds)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Tiempo contabilizado con el reproductor
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Esta Semana
            </span>
            <TrendingUp size={16} color="#818cf8" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#818cf8' }}>
            {formatHours(stats.weekSeconds)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Meta semanal: 10.0 hrs recomendadas
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Racha Activa
            </span>
            <Flame size={16} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>
            {stats.streak} días
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            ¡Excelente disciplina de estudio continuo!
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Temas Cumplidos
            </span>
            <Award size={16} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#10b981' }}>
            {stats.completedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Módulos dominados de tus roadmaps
          </div>
        </div>
      </div>

      {/* Two Column Section: Left (Weekly Bar Chart) / Right (Roadmap Mastery) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '24px' }}>
        
        {/* Weekly Bar Chart */}
        <div
          className="glass-card"
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Distribución Semanal de Estudio</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Horas dedicadas</span>
          </div>

          {/* Bar Chart Container */}
          <div
            style={{
              height: '200px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '12px',
              paddingTop: '20px',
              borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            {weeklyStudyByDay.map((item, idx) => {
              const heightPercent = maxHours > 0 ? (item.hours / maxHours) * 100 : 0;
              const isToday = item.day === 'Lun';

              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    height: '100%',
                    justifyContent: 'flex-end'
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: isToday ? '#38bdf8' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {item.hours > 0 ? `${item.hours}h` : '-'}
                  </span>

                  <div
                    style={{
                      width: '100%',
                      maxWidth: '36px',
                      height: `${Math.max(6, heightPercent)}%`,
                      background: isToday 
                        ? 'var(--gradient-cyan)' 
                        : item.hours > 0 
                          ? 'var(--gradient-brand)' 
                          : 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: item.hours > 0 ? '0 0 12px rgba(99, 102, 241, 0.25)' : 'none'
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', fontWeight: isToday ? 700 : 500, color: isToday ? '#38bdf8' : 'var(--text-secondary)' }}>
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Roadmap Mastery Breakdown */}
        <div
          className="glass-card"
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Dominio por Ruta de Aprendizaje</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {roadmaps.map((r) => {
              let totalTopics = 0;
              let completedTopics = 0;
              let totalSecs = 0;

              r.weeks.forEach(w => {
                (w.days || []).forEach(d => {
                  totalTopics++;
                  if (d.status === 'completed') completedTopics++;
                  totalSecs += (d.timeSpentSeconds || 0);
                });
              });

              const percent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

              return (
                <div key={r.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${r.badgeClass || 'badge-go'}`} style={{ fontSize: '0.7rem' }}>
                        {r.title}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {percent}% ({completedTopics}/{totalTopics})
                    </span>
                  </div>

                  <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${percent}%`,
                        background: r.color || 'var(--accent-primary)',
                        borderRadius: '999px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Tiempo total invertido: {(totalSecs / 3600).toFixed(1)} hrs
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* History of Completed Sessions */}
      <div
        className="glass-card"
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Historial de Sesiones Completadas</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {completedSessions.map((session) => (
            <div
              key={session.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={16} color="#10b981" />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {session.title}
                  </div>
                  {session.notes && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', fontStyle: 'italic' }}>
                      "{session.notes}"
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>{session.date}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                  {Math.round((session.actualSecondsStudied || 0) / 60)} min
                </span>
              </div>
            </div>
          ))}

          {completedSessions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
              Aún no has completado sesiones. ¡Inicia una lección en la agenda!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
