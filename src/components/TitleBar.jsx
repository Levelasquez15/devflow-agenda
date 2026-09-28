import React, { useState, useEffect } from 'react';
import { Sparkles, Minus, Square, X, Flame, Clock, PlusCircle, Settings } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export default function TitleBar() {
  const { getStudyStats, setIsGeneratorOpen, setIsQuickAddOpen, setIsSettingsOpen } = useStudy();
  const [isMaximized, setIsMaximized] = useState(false);
  const stats = getStudyStats();

  useEffect(() => {
    if (window.electronAPI?.isMaximized) {
      window.electronAPI.isMaximized().then(setIsMaximized);
    }
  }, []);

  const handleMinimize = () => {
    if (window.electronAPI?.minimize) window.electronAPI.minimize();
  };

  const handleMaximize = () => {
    if (window.electronAPI?.maximize) {
      window.electronAPI.maximize();
      setIsMaximized(!isMaximized);
    }
  };

  const handleClose = () => {
    if (window.electronAPI?.close) window.electronAPI.close();
  };

  const formatHours = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
  };

  return (
    <header
      style={{
        height: '44px',
        background: 'var(--bg-canvas)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px 0 16px',
        WebkitAppRegion: 'drag',
        userSelect: 'none',
        zIndex: 100
      }}
    >
      {/* Brand & Workspace Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '8px',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.4)'
          }}
        >
          <Sparkles size={14} color="#ffffff" />
        </div>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.95rem',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          DevFlow Agenda
        </span>
        <span
          style={{
            fontSize: '0.72rem',
            padding: '2px 8px',
            borderRadius: '999px',
            background: 'rgba(99, 102, 241, 0.15)',
            color: '#818cf8',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            fontWeight: 600
          }}
        >
          Roadmaps Desktop
        </span>
      </div>

      {/* Middle Status Pill (Streaks + Today's Study Time) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          WebkitAppRegion: 'no-drag'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#fbbf24'
          }}
        >
          <Flame size={14} color="#f59e0b" />
          <span>Racha: {stats.streak} días</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(6, 182, 212, 0.12)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#38bdf8'
          }}
        >
          <Clock size={14} color="#06b6d4" />
          <span>Hoy: {formatHours(stats.todaySeconds)}</span>
        </div>

        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="btn btn-secondary"
          style={{
            padding: '4px 10px',
            fontSize: '0.78rem',
            height: '28px',
            borderRadius: '8px'
          }}
          title="Planear sesión de estudio"
        >
          <PlusCircle size={14} color="#a5b4fc" />
          <span>Planear</span>
        </button>

        <button
          onClick={() => setIsGeneratorOpen(true)}
          className="btn btn-primary"
          style={{
            padding: '4px 12px',
            fontSize: '0.78rem',
            height: '28px',
            borderRadius: '8px'
          }}
          title="Investigar y generar nueva ruta con IA"
        >
          <Sparkles size={13} />
          <span>Investigar con IA</span>
        </button>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="btn btn-ghost"
          style={{
            padding: '4px',
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            color: 'var(--text-secondary)'
          }}
          title="Configuración & API Key"
        >
          <Settings size={14} />
        </button>
      </div>

      {/* Window Controls (Electron or Browser indicator) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          WebkitAppRegion: 'no-drag'
        }}
      >
        {window.electronAPI?.isElectron ? (
          <>
            <button
              onClick={handleMinimize}
              style={{
                width: '32px',
                height: '28px',
                background: 'transparent',
                border: 'none',
                borderRadius: '6px',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Minus size={14} />
            </button>
            <button
              onClick={handleMaximize}
              style={{
                width: '32px',
                height: '28px',
                background: 'transparent',
                border: 'none',
                borderRadius: '6px',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Square size={12} />
            </button>
            <button
              onClick={handleClose}
              style={{
                width: '32px',
                height: '28px',
                background: 'transparent',
                border: 'none',
                borderRadius: '6px',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e11d48';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-dim)',
              padding: '2px 8px'
            }}
          >
            Escritorio Windows
          </div>
        )}
      </div>
    </header>
  );
}
