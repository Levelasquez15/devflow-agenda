import React from 'react';
import { 
  CalendarDays, 
  Target, 
  Calendar, 
  Map, 
  BarChart3, 
  Plus, 
  Terminal, 
  Shield, 
  Database, 
  BookOpen, 
  ChevronRight,
  Download,
  Upload,
  CheckCircle2,
  Settings,
  BrainCircuit
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export default function Sidebar() {
  const { 
    activeView, 
    setActiveView, 
    roadmaps, 
    selectedRoadmapId, 
    setSelectedRoadmapId,
    setIsGeneratorOpen,
    setIsQuickAddOpen,
    setIsSettingsOpen
  } = useStudy();

  const getRoadmapIcon = (iconName) => {
    switch (iconName) {
      case 'Terminal': return <Terminal size={16} color="#00acd7" />;
      case 'Shield': return <Shield size={16} color="#f43f5e" />;
      case 'Database': return <Database size={16} color="#60a5fa" />;
      default: return <BookOpen size={16} color="#a855f7" />;
    }
  };

  // Calculate completion percentage for each roadmap
  const getRoadmapProgress = (roadmap) => {
    let totalDays = 0;
    let completedDays = 0;
    roadmap.weeks.forEach(w => {
      (w.days || []).forEach(d => {
        totalDays++;
        if (d.status === 'completed') completedDays++;
      });
    });
    if (totalDays === 0) return 0;
    return Math.round((completedDays / totalDays) * 100);
  };

  const navItems = [
    { id: 'weekly', label: 'Agenda Semanal', icon: <CalendarDays size={18} /> },
    { id: 'daily', label: 'Enfoque de Hoy & Mañana', icon: <Target size={18} /> },
    { id: 'monthly', label: 'Calendario Mensual', icon: <Calendar size={18} /> },
    { id: 'roadmaps', label: 'Explorador de Rutas', icon: <Map size={18} /> },
    { id: 'stats', label: 'Métricas de Estudio', icon: <BarChart3 size={18} /> }
  ];

  const handleExportData = () => {
    const data = {
      roadmaps: JSON.parse(localStorage.getItem('devflow_roadmaps') || '[]'),
      schedule: JSON.parse(localStorage.getItem('devflow_schedule') || '[]')
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devflow-study-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <aside
      style={{
        width: '260px',
        height: '100%',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 12px 14px 12px',
        flexShrink: 0
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
        {/* Workspace Title & Plan Quick Trigger */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-card)',
              marginBottom: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>⚡</span>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Plan de Estudio
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Notion & roadmap.sh
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsQuickAddOpen(true)}
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#818cf8',
                borderRadius: '6px',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Añadir tarea a la agenda"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Navigation Views */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: isActive ? 'var(--accent-primary-light)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.color = '#fff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <span style={{ color: isActive ? 'var(--accent-primary)' : 'inherit' }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Roadmaps List */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 8px 6px 8px',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)'
            }}
          >
            <span>Rutas Activas ({roadmaps.length})</span>
            <button
              onClick={() => setIsGeneratorOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px'
              }}
              title="Generar nueva ruta"
            >
              <Plus size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {roadmaps.map((r) => {
              const isSelected = activeView === 'roadmaps' && selectedRoadmapId === r.id;
              const progress = getRoadmapProgress(r);
              return (
                <div
                  key={r.id}
                  onClick={() => {
                    setSelectedRoadmapId(r.id);
                    setActiveView('roadmaps');
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--bg-elevated)' : 'transparent',
                    border: isSelected ? '1px solid var(--border-accent)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.18s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getRoadmapIcon(r.icon)}
                      <span
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: isSelected ? '#ffffff' : 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '140px'
                        }}
                      >
                        {r.title}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: progress === 100 ? '#10b981' : 'var(--text-secondary)'
                      }}
                    >
                      {progress}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      height: '4px',
                      background: 'rgba(255, 255, 255, 0.07)',
                      borderRadius: '999px',
                      overflow: 'hidden',
                      marginTop: '2px'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: r.color || 'var(--accent-primary)',
                        borderRadius: '999px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Settings & Backup */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}
      >
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="btn btn-ghost"
          style={{
            width: '100%',
            justifyContent: 'flex-start',
            fontSize: '0.78rem',
            padding: '6px 10px',
            color: 'var(--text-secondary)'
          }}
        >
          <Settings size={14} />
          <span>Configuración & API Key</span>
        </button>

        <button
          onClick={handleExportData}
          className="btn btn-ghost"
          style={{
            width: '100%',
            justifyContent: 'flex-start',
            fontSize: '0.78rem',
            padding: '6px 10px',
            color: 'var(--text-secondary)'
          }}
        >
          <Download size={14} />
          <span>Exportar Copia de Seguridad</span>
        </button>
      </div>
    </aside>
  );
}
