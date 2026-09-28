import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Video, 
  Code, 
  Check, 
  Clock, 
  Layers,
  ArrowRight,
  BrainCircuit,
  Compass,
  Cpu,
  Globe
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export default function RoadmapGeneratorModal() {
  const { 
    isGeneratorOpen, 
    setIsGeneratorOpen, 
    addCustomRoadmap, 
    generateRoadmapWithAI,
    geminiApiKey,
    setIsSettingsOpen
  } = useStudy();

  const [topicName, setTopicName] = useState('');
  const [weeksCount, setWeeksCount] = useState(4);
  const [dailyMinutes, setDailyMinutes] = useState(45);
  const [skillLevel, setSkillLevel] = useState('Principiante');
  const [isGenerating, setIsGenerating] = useState(false);
  const [researchStatus, setResearchStatus] = useState('');

  if (!isGeneratorOpen) return null;

  const quickTemplates = [
    {
      title: 'Docker & Contenedores',
      category: 'DevOps & Infraestructura',
      color: '#06B6D4',
      badgeClass: 'badge-go',
      icon: 'Terminal',
      description: 'Imágenes, Dockerfiles optimizados, volúmenes persistentes y Docker Compose.'
    },
    {
      title: 'Rust: Ownership & Sistemas',
      category: 'Sistemas & Rendimiento',
      color: '#F59E0B',
      badgeClass: 'badge-sec',
      icon: 'Terminal',
      description: 'Gestión de memoria sin garbage collector, Borrow Checker y concurrencia segura.'
    },
    {
      title: 'Inglés Técnico para Desarrolladores',
      category: 'Idiomas & Carreras Tech',
      color: '#EC4899',
      badgeClass: 'badge-custom',
      icon: 'BookOpen',
      description: 'Daily standups, code reviews, PR descriptions y entrevistas técnicas en inglés.'
    }
  ];

  const handleApplyTemplate = (template) => {
    setTopicName(template.title);
  };

  const handleCreateRoadmap = async () => {
    if (!topicName.trim() || isGenerating) return;

    setIsGenerating(true);
    setResearchStatus('Iniciando investigación...');

    try {
      const generated = await generateRoadmapWithAI({
        prompt: topicName.trim(),
        weeksCount,
        dailyMinutes,
        skillLevel,
        apiKey: geminiApiKey,
        onProgress: (status) => setResearchStatus(status)
      });

      if (generated) {
        addCustomRoadmap(generated);
        setIsGenerating(false);
        setIsGeneratorOpen(false);
        setTopicName('');
        setResearchStatus('');
      }
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      setResearchStatus('Error en la generación. Inténtalo de nuevo.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.88)',
        backdropFilter: 'blur(14px)',
        zIndex: 250,
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
          maxWidth: '720px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-hover)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 26px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-canvas)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--gradient-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
              }}
            >
              <BrainCircuit size={18} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Investigador & Arquitecto IA de Rutas</h2>
                <span
                  style={{
                    fontSize: '0.68rem',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: geminiApiKey ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                    color: geminiApiKey ? '#34d399' : '#38bdf8',
                    border: `1px solid ${geminiApiKey ? 'rgba(16, 185, 129, 0.3)' : 'rgba(6, 182, 212, 0.3)'}`,
                    fontWeight: 700
                  }}
                >
                  {geminiApiKey ? '⚡ Gemini LLM' : '⚡ Motor IA Heurístico'}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Investiga y estructura cualquier tema con videos de YouTube, conceptos y ejercicios prácticos
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsGeneratorOpen(false)}
            disabled={isGenerating}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Form */}
        <div style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Quick Preset Templates */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
              Rutas Sugeridas Frecuentes:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {quickTemplates.map((t, idx) => (
                <div
                  key={idx}
                  onClick={() => handleApplyTemplate(t)}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: topicName === t.title ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: topicName === t.title ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.18s'
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {t.title}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {t.category}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill / Topic Input */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
              ¿Qué tema o tecnología quieres que la IA investigue y te arme?
            </label>
            <input
              type="text"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              disabled={isGenerating}
              placeholder="Ej: Rust, Docker, Kubernetes, Inteligencia Artificial con PyTorch, Inglés B2..."
              className="input-field"
              style={{ fontSize: '0.98rem', padding: '12px 16px' }}
            />
          </div>

          {/* Settings Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Duración del Plan
              </label>
              <select
                value={weeksCount}
                onChange={(e) => setWeeksCount(Number(e.target.value))}
                disabled={isGenerating}
                className="input-field"
                style={{ padding: '8px 12px' }}
              >
                <option value={2}>2 Semanas (Intensivo)</option>
                <option value={4}>4 Semanas (1 Mes)</option>
                <option value={8}>8 Semanas (Especialización)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Tiempo Diario
              </label>
              <select
                value={dailyMinutes}
                onChange={(e) => setDailyMinutes(Number(e.target.value))}
                disabled={isGenerating}
                className="input-field"
                style={{ padding: '8px 12px' }}
              >
                <option value={30}>30 min / día</option>
                <option value={45}>45 min / día</option>
                <option value={60}>1 hora / día</option>
                <option value={90}>1.5 horas / día</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Nivel Inicial
              </label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                disabled={isGenerating}
                className="input-field"
                style={{ padding: '8px 12px' }}
              >
                <option value="Principiante">Desde Cero</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>
          </div>

          {/* Active Generation State Progress Stream */}
          {isGenerating && (
            <div
              className="glass-card"
              style={{
                padding: '16px 20px',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: '2px solid rgba(99, 102, 241, 0.3)',
                  borderTopColor: 'var(--accent-primary)',
                  animation: 'spin 1s linear infinite'
                }}
              />
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#a5b4fc' }}>
                  Investigando y Construyendo Ruta
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '2px', fontWeight: 500 }}>
                  {researchStatus}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 26px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-canvas)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <button
            onClick={() => {
              setIsGeneratorOpen(false);
              setIsSettingsOpen(true);
            }}
            className="btn btn-ghost"
            style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}
          >
            ⚙️ Configurar API Key de IA
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setIsGeneratorOpen(false)}
              disabled={isGenerating}
              className="btn btn-secondary"
              style={{ padding: '8px 16px' }}
            >
              Cancelar
            </button>

            <button
              onClick={handleCreateRoadmap}
              disabled={!topicName.trim() || isGenerating}
              className="btn btn-primary"
              style={{ padding: '8px 22px', opacity: !topicName.trim() || isGenerating ? 0.6 : 1 }}
            >
              <Sparkles size={16} />
              <span>{isGenerating ? 'Investigando...' : 'Investigar & Generar Ruta'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
