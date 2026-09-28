import React from 'react';
import { 
  Target, 
  Play, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Plus, 
  Shield, 
  Terminal, 
  Database,
  Calendar,
  Check
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export default function DailyFocusView() {
  const { 
    schedule, 
    roadmaps, 
    startStudySession, 
    addTaskToSchedule, 
    setIsQuickAddOpen, 
    getStudyStats 
  } = useStudy();

  const stats = getStudyStats();
  const todayStr = '2026-09-28';
  const tomorrowStr = '2026-09-29';

  const todayTasks = schedule.filter(t => t.date === todayStr);
  const tomorrowTasks = schedule.filter(t => t.date === tomorrowStr);

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
      estimatedMinutes: task.durationMinutes || 45,
      youtubeId: 'YS4e4q9oBaU',
      concepts: ['Fundamentos', 'Práctica guiada'],
      exercises: [{ id: 'ex-def', text: 'Completar objetivos de la sesión', done: false }]
    };
  };

  const findNextPendingTopic = (category) => {
    let targetRoadmap = roadmaps[0];
    if (category === 'ciberseguridad') {
      targetRoadmap = roadmaps.find(r => r.id === 'cybersecurity-analyst') || roadmaps[0];
    } else if (category === 'go') {
      targetRoadmap = roadmaps.find(r => r.id === 'go-developer') || roadmaps[0];
    } else if (category === 'postgres') {
      targetRoadmap = roadmaps.find(r => r.id === 'postgresql-master') || roadmaps[0];
    }

    for (const w of targetRoadmap.weeks) {
      for (const d of (w.days || [])) {
        const isScheduled = schedule.some(s => s.topicId === d.id);
        if (!isScheduled && d.status !== 'completed') {
          return { topic: d, roadmap: targetRoadmap };
        }
      }
    }
    return { topic: targetRoadmap.weeks[0]?.days[0], roadmap: targetRoadmap };
  };

  const handleQuickAddTomorrow = (skillType) => {
    const next = findNextPendingTopic(skillType);
    if (next && next.topic) {
      addTaskToSchedule({
        roadmapId: next.roadmap.id,
        topicId: next.topic.id,
        title: next.topic.title,
        date: tomorrowStr,
        dayName: 'Martes',
        timeSlot: '16:00 - 17:00',
        durationMinutes: next.topic.estimatedMinutes || 45
      });
    }
  };

  const formatSecs = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        padding: '24px 28px',
        gap: '24px',
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      {/* Top Banner */}
      <div
        className="glass-card"
        style={{
          padding: '22px 28px',
          background: 'linear-gradient(135deg, rgba(20, 27, 45, 0.95) 0%, rgba(13, 18, 31, 0.98) 100%)',
          border: '1px solid var(--border-hover)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          flexShrink: 0
        }}
      >
        <div style={{ maxWidth: '650px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '3px 10px',
                borderRadius: '999px'
              }}
            >
              Enfoque Diario • Lunes 28 de Septiembre
            </span>
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '6px', color: '#ffffff' }}>
            ¿Qué vas a dominar el día de hoy?
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5' }}>
            Cumple tus sesiones del día o programa con antelación los temas que estudiarás mañana.
          </p>
        </div>

        {/* Today's Goal Progress Pill */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Tiempo Estudiado Hoy
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              {formatSecs(stats.todaySeconds)}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <Check size={13} />
              <span>{todayTasks.filter(t => t.status === 'completed').length} de {todayTasks.length} temas cumplidos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Left (Hoy) / Right (Mañana) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        
        {/* Column 1: Metas de HOY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={20} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '1.18rem', fontWeight: 700 }}>Para Hoy (Lunes)</h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {todayTasks.length} actividades
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {todayTasks.map((task) => {
              const roadmap = getRoadmapForTask(task);
              const topic = getTopicForTask(task);
              const isCompleted = task.status === 'completed';

              return (
                <div
                  key={task.id}
                  className="glass-card"
                  style={{
                    padding: '18px',
                    borderLeft: `4px solid ${roadmap?.color || 'var(--accent-primary)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    background: isCompleted ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-card)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className={`badge ${roadmap?.badgeClass || 'badge-go'}`}>
                      {roadmap?.title}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {task.timeSlot}
                    </span>
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: isCompleted ? 'line-through' : 'none'
                      }}
                    >
                      {task.title}
                    </h3>
                    {topic?.concepts && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                        {topic.concepts.slice(0, 3).map((c, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '0.72rem',
                              color: 'var(--text-secondary)',
                              background: 'rgba(255, 255, 255, 0.04)',
                              padding: '2px 8px',
                              borderRadius: '4px'
                            }}
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <Clock size={14} />
                      <span>{task.durationMinutes} min asignados</span>
                    </div>

                    {isCompleted ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 600, fontSize: '0.82rem' }}>
                        <CheckCircle2 size={15} />
                        <span>Completado ({formatSecs(task.actualSecondsStudied)})</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => startStudySession(topic, task, 'pomodoro')}
                        className="btn btn-primary"
                        style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                      >
                        <Play size={13} fill="#fff" />
                        <span>Iniciar Estudio</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {todayTasks.length === 0 && (
              <div
                style={{
                  padding: '30px 20px',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px dashed var(--border-subtle)',
                  color: 'var(--text-secondary)'
                }}
              >
                <p>No tienes sesiones programadas para hoy.</p>
                <button
                  onClick={() => setIsQuickAddOpen(true)}
                  className="btn btn-secondary"
                  style={{ marginTop: '12px' }}
                >
                  <Plus size={14} />
                  <span>Añadir tema para hoy</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Planear para MAÑANA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} color="var(--accent-cyan)" />
              <h2 style={{ fontSize: '1.18rem', fontWeight: 700 }}>Planear para Mañana (Martes)</h2>
            </div>
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '4px 10px', height: '28px' }}
            >
              <Plus size={14} />
              <span>Programar</span>
            </button>
          </div>

          {/* Quick 1-Click Planning Box */}
          <div
            className="glass-card"
            style={{
              padding: '16px 18px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(13, 18, 31, 0.7) 100%)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#06b6d4" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>
                Planificación Inteligente para Mañana
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              ¿Qué te gustaría aprender mañana? Elige una ruta y se agendará automáticamente:
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button
                onClick={() => handleQuickAddTomorrow('ciberseguridad')}
                className="btn btn-secondary"
                style={{ fontSize: '0.78rem', padding: '6px 12px', borderColor: 'rgba(244, 63, 94, 0.3)' }}
              >
                <Shield size={14} color="#f43f5e" />
                <span>+ Ciberseguridad Básica</span>
              </button>
              <button
                onClick={() => handleQuickAddTomorrow('go')}
                className="btn btn-secondary"
                style={{ fontSize: '0.78rem', padding: '6px 12px', borderColor: 'rgba(0, 172, 215, 0.3)' }}
              >
                <Terminal size={14} color="#00acd7" />
                <span>+ Go (Golang)</span>
              </button>
              <button
                onClick={() => handleQuickAddTomorrow('postgres')}
                className="btn btn-secondary"
                style={{ fontSize: '0.78rem', padding: '6px 12px', borderColor: 'rgba(51, 103, 145, 0.4)' }}
              >
                <Database size={14} color="#60a5fa" />
                <span>+ PostgreSQL</span>
              </button>
            </div>
          </div>

          {/* Tomorrow's Scheduled List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tomorrowTasks.map((task) => {
              const roadmap = getRoadmapForTask(task);
              const topic = getTopicForTask(task);

              return (
                <div
                  key={task.id}
                  className="glass-card"
                  style={{
                    padding: '16px',
                    borderLeft: `4px solid ${roadmap?.color || 'var(--accent-cyan)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className={`badge ${roadmap?.badgeClass || 'badge-sec'}`}>
                      {roadmap?.title}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {task.timeSlot}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {task.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <Clock size={13} />
                      <span>{task.durationMinutes} minutos estimados</span>
                    </div>

                    <button
                      onClick={() => startStudySession(topic, task, 'pomodoro')}
                      className="btn btn-ghost"
                      style={{ padding: '4px 10px', fontSize: '0.78rem', color: '#38bdf8' }}
                    >
                      <span>Estudiar Ahora</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}

            {tomorrowTasks.length === 0 && (
              <div
                style={{
                  padding: '30px 20px',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px dashed var(--border-subtle)',
                  color: 'var(--text-secondary)'
                }}
              >
                <p>Aún no has planeado temas para mañana.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
