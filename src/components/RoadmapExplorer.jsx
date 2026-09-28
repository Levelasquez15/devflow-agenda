import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Plus, 
  BookOpen, 
  Terminal, 
  Shield, 
  Database, 
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Code
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export default function RoadmapExplorer() {
  const { 
    roadmaps, 
    selectedRoadmapId, 
    setSelectedRoadmapId, 
    startStudySession, 
    addTaskToSchedule, 
    setIsGeneratorOpen 
  } = useStudy();

  const currentRoadmap = roadmaps.find(r => r.id === selectedRoadmapId) || roadmaps[0];
  const [selectedNode, setSelectedNode] = useState(currentRoadmap?.weeks[0]?.days[0] || null);

  const getRoadmapIcon = (iconName) => {
    switch (iconName) {
      case 'Terminal': return <Terminal size={18} color="#00acd7" />;
      case 'Shield': return <Shield size={18} color="#f43f5e" />;
      case 'Database': return <Database size={18} color="#60a5fa" />;
      default: return <BookOpen size={18} color="#a855f7" />;
    }
  };

  const handleScheduleNodeForToday = (node) => {
    addTaskToSchedule({
      roadmapId: currentRoadmap.id,
      topicId: node.id,
      title: node.title,
      date: '2026-09-28',
      dayName: 'Lunes',
      timeSlot: '18:00 - 19:00',
      durationMinutes: node.estimatedMinutes || 45
    });
  };

  const handleScheduleNodeForTomorrow = (node) => {
    addTaskToSchedule({
      roadmapId: currentRoadmap.id,
      topicId: node.id,
      title: node.title,
      date: '2026-09-29',
      dayName: 'Martes',
      timeSlot: '10:00 - 11:00',
      durationMinutes: node.estimatedMinutes || 45
    });
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
      {/* Top Header with Roadmap Switcher */}
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
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Explorador de Rutas de Aprendizaje</h1>
            <a
              href="https://roadmap.sh"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.04)',
                padding: '3px 8px',
                borderRadius: '6px'
              }}
            >
              <span>Basado en roadmap.sh</span>
              <ExternalLink size={12} />
            </a>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            {currentRoadmap.description}
          </p>
        </div>

        {/* Roadmap Switcher Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {roadmaps.map((r) => {
            const isSelected = selectedRoadmapId === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedRoadmapId(r.id);
                  setSelectedNode(r.weeks[0]?.days[0] || null);
                }}
                className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  fontSize: '0.82rem',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                {getRoadmapIcon(r.icon)}
                <span>{r.title.split(' ')[0]}</span>
              </button>
            );
          })}

          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', padding: '6px 12px' }}
          >
            <Sparkles size={14} color="#c084fc" />
            <span>+ Nueva Ruta</span>
          </button>
        </div>
      </div>

      {/* Main Roadmap Area: Left Interactive Visual Tree / Right Node Inspector */}
      <div style={{ flex: 1, display: 'flex', gap: '20px', overflow: 'hidden' }}>
        
        {/* Left: Visual Roadmap Node Graph */}
        <div
          style={{
            flex: '1 1 65%',
            background: 'var(--bg-sidebar)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px'
          }}
        >
          {currentRoadmap.weeks.map((week, wIdx) => (
            <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
              
              {/* Week Milestone Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-card)',
                  padding: '12px 18px',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: currentRoadmap.color || 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    color: '#fff'
                  }}
                >
                  {week.weekNumber}
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {week.title}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Objetivo: {week.goal}
                  </div>
                </div>
              </div>

              {/* Node Cards in this Week */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '14px',
                  paddingLeft: '14px'
                }}
              >
                {(week.days || []).map((node) => {
                  const isCompleted = node.status === 'completed';
                  const isSelected = selectedNode?.id === node.id;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className="glass-card glass-card-hoverable"
                      style={{
                        padding: '16px',
                        cursor: 'pointer',
                        border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-card)',
                        boxShadow: isSelected ? '0 0 18px rgba(99, 102, 241, 0.25)' : 'none',
                        background: isCompleted ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-card)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            {node.dayName || 'Módulo'}
                          </span>
                          {isCompleted ? (
                            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                              <CheckCircle2 size={14} />
                              <span>COMPLETADO</span>
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                              {node.estimatedMinutes} min
                            </span>
                          )}
                        </div>

                        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: '1.4' }}>
                          {node.title}
                        </h4>
                      </div>

                      {/* Concepts preview */}
                      {node.concepts && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {node.concepts.slice(0, 2).map((c, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: '0.68rem',
                                color: 'var(--text-secondary)',
                                background: 'rgba(255, 255, 255, 0.03)',
                                padding: '2px 6px',
                                borderRadius: '4px'
                              }}
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Quick Study Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startStudySession(node, null, 'pomodoro');
                        }}
                        className="btn btn-primary"
                        style={{
                          width: '100%',
                          padding: '6px',
                          fontSize: '0.78rem',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        <Play size={12} fill="#fff" />
                        <span>Estudiar en Focus Studio</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Selected Node Details & Scheduling Inspector */}
        <div
          style={{
            flex: '1 1 35%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {selectedNode ? (
            <>
              {/* Header */}
              <div
                style={{
                  padding: '20px',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: 'var(--bg-canvas)'
                }}
              >
                <span className={`badge ${currentRoadmap.badgeClass || 'badge-go'}`} style={{ marginBottom: '8px' }}>
                  {currentRoadmap.title}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
                  {selectedNode.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <Clock size={14} />
                  <span>{selectedNode.estimatedMinutes} minutos estimados de estudio</span>
                </div>
              </div>

              {/* Body */}
              <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Concepts */}
                {selectedNode.concepts && (
                  <div>
                    <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px' }}>
                      Conceptos Clave de roadmap.sh
                    </h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {selectedNode.concepts.map((concept, idx) => (
                        <li key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: currentRoadmap.color }}>•</span>
                          <span>{concept}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Practical Exercises */}
                {selectedNode.exercises && selectedNode.exercises.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px' }}>
                      Desafíos Prácticos ({selectedNode.exercises.length})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedNode.exercises.map((ex) => (
                        <div
                          key={ex.id}
                          style={{
                            padding: '8px 10px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {ex.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code preview snippet */}
                {selectedNode.codeSnippet && (
                  <div>
                    <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px' }}>
                      Código de Ejemplo
                    </h4>
                    <pre
                      style={{
                        background: '#090d16',
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.78rem',
                        fontFamily: 'var(--font-mono)',
                        color: '#94a3b8',
                        overflowX: 'auto'
                      }}
                    >
                      <code>{selectedNode.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Bottom Schedule Actions */}
              <div
                style={{
                  padding: '16px 20px',
                  borderTop: '1px solid var(--border-subtle)',
                  background: 'var(--bg-canvas)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <button
                  onClick={() => startStudySession(selectedNode, null, 'pomodoro')}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '10px' }}
                >
                  <Play size={16} fill="#fff" />
                  <span>Iniciar Estudio Inmediato</span>
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleScheduleNodeForToday(selectedNode)}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: '0.75rem', padding: '6px' }}
                  >
                    <Calendar size={13} />
                    <span>Agendar para Hoy</span>
                  </button>
                  <button
                    onClick={() => handleScheduleNodeForTomorrow(selectedNode)}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: '0.75rem', padding: '6px' }}
                  >
                    <Calendar size={13} />
                    <span>Agendar para Mañana</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Selecciona un nodo del mapa para ver los detalles y agendarlo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
