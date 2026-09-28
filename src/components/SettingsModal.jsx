import React, { useState } from 'react';
import { 
  X, 
  Settings as SettingsIcon, 
  Key, 
  Sparkles, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  ExternalLink,
  Check
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export default function SettingsModal() {
  const { isSettingsOpen, setIsSettingsOpen, geminiApiKey, setGeminiApiKey } = useStudy();
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isSettingsOpen) return null;

  const handleSaveKey = () => {
    setGeminiApiKey(apiKeyInput.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleResetData = () => {
    if (window.confirm('¿Estás seguro de que deseas reiniciar todos los datos a su estado original?')) {
      localStorage.removeItem('devflow_roadmaps');
      localStorage.removeItem('devflow_schedule');
      window.location.reload();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 260,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      className="animate-fade-in"
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-hover)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-canvas)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SettingsIcon size={18} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Configuración de la Aplicación</h2>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Form */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* AI Settings Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={16} color="var(--accent-primary)" />
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Modelo de Inteligencia Artificial (Investigador de Rutas)
              </label>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>
              La app incluye un <strong>motor offline de investigación inteligente</strong> con rutas curadas para cualquier habilidad. Si lo deseas, puedes añadir tu API Key de Gemini para que investigue y redacte planes hiperpersonalizados con LLM.
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Pega tu Google Gemini API Key aquí (opcional)..."
                className="input-field"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}
              />
              <button
                onClick={handleSaveKey}
                className="btn btn-primary"
                style={{ padding: '8px 16px', flexShrink: 0 }}
              >
                {isSaved ? <Check size={14} color="#fff" /> : 'Guardar'}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ fontSize: '0.74rem', color: geminiApiKey ? '#10b981' : '#38bdf8' }}>
                {geminiApiKey ? '● Gemini API Conectado' : '● Motor Inteligente Local Activo (Sin costo)'}
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
              >
                <span>Obtener API Key gratuita</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

          {/* Data Reset & Storage */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>
              Gestión de Datos Locales
            </label>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Tus horas de estudio, notas y roadmaps se guardan de forma privada en el almacenamiento local de tu computadora.
            </p>

            <button
              onClick={handleResetData}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', color: '#fb7185', borderColor: 'rgba(244, 63, 94, 0.3)' }}
            >
              <RotateCcw size={14} />
              <span>Restablecer Rutas y Agenda de Fábrica</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-canvas)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}
        >
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="btn btn-secondary"
            style={{ padding: '8px 20px' }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
