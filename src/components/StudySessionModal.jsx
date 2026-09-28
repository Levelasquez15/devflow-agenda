import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Code, 
  Copy, 
  Check, 
  Sparkles,
  Maximize2,
  Bot,
  Send,
  MessageSquare
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export default function StudySessionModal() {
  const { 
    activeSession, 
    closeStudySession, 
    completeStudySession, 
    toggleExercise, 
    saveTopicNotes,
    askAiTutor,
    geminiApiKey
  } = useStudy();

  if (!activeSession) return null;

  const { topic, task, roadmap } = activeSession;

  // Study timer mode: 'pomodoro' | 'continuous'
  const [timerMode, setTimerMode] = useState(activeSession.mode || 'pomodoro');
  
  // Pomodoro config & state
  const [pomodoroDuration, setPomodoroDuration] = useState(25 * 60); // 25 min
  const [breakDuration, setBreakDuration] = useState(5 * 60); // 5 min
  const [isBreak, setIsBreak] = useState(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(25 * 60);
  
  // Real active study seconds tracked
  const [actualStudiedSeconds, setActualStudiedSeconds] = useState(task?.actualSecondsStudied || 0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Active side tab: 'exercises' | 'notes' | 'tutor'
  const [sideTab, setSideTab] = useState('exercises');
  const [notesText, setNotesText] = useState(topic?.notes || task?.notes || '');
  const [copiedCode, setCopiedCode] = useState(false);

  // AI Tutor chat state
  const [tutorQuestion, setTutorQuestion] = useState('');
  const [isTutorThinking, setIsTutorThinking] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: `¡Hola! Soy tu Tutor IA para esta lección sobre "${topic?.title}". ¿Tienes alguna duda sobre el video, los conceptos o cómo resolver el ejercicio?`
    }
  ]);

  // YouTube Player instance ref
  const ytPlayerRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Setup YouTube IFrame API
  useEffect(() => {
    let player = null;

    const initPlayer = () => {
      if (window.YT && window.YT.Player && topic?.youtubeId) {
        player = new window.YT.Player('youtube-player-embed', {
          height: '100%',
          width: '100%',
          videoId: topic.youtubeId,
          playerVars: {
            autoplay: 0,
            modestbranding: 1,
            rel: 0,
            controls: 1
          },
          events: {
            onStateChange: (event) => {
              // 1 = playing, 2 = paused, 0 = ended
              if (event.data === 1) {
                setIsPlaying(true);
              } else {
                setIsPlaying(false);
              }
            }
          }
        });
        ytPlayerRef.current = player;
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // Poll briefly if API script is still initializing
      const checkYt = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkYt);
          initPlayer();
        }
      }, 300);
      return () => clearInterval(checkYt);
    }

    return () => {
      if (ytPlayerRef.current && ytPlayerRef.current.destroy) {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {
          console.error(e);
        }
      }
    };
  }, [topic?.youtubeId]);

  // Timer tick effect: counts actual studied seconds when isPlaying or timer is active
  useEffect(() => {
    if (isPlaying) {
      timerIntervalRef.current = setInterval(() => {
        setActualStudiedSeconds(prev => prev + 1);

        if (timerMode === 'pomodoro') {
          setTimerSecondsLeft(prev => {
            if (prev <= 1) {
              // Switch between focus and break
              if (!isBreak) {
                setIsBreak(true);
                if (window.electronAPI?.sendNotification) {
                  window.electronAPI.sendNotification('¡Momento de Descanso!', 'Has completado 25 min de enfoque. Tómate 5 minutos de relajación.');
                }
                return breakDuration;
              } else {
                setIsBreak(false);
                if (window.electronAPI?.sendNotification) {
                  window.electronAPI.sendNotification('¡A Estudiar de Nuevo!', 'El descanso ha terminado. ¡Continuemos con el roadmap!');
                }
                return pomodoroDuration;
              }
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isPlaying, timerMode, isBreak, pomodoroDuration, breakDuration]);

  // Format time helpers
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatHoursMinutes = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${s}s`;
    return `${mins}m ${s}s`;
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleFinishSession = () => {
    saveTopicNotes(topic.id, notesText);
    completeStudySession(topic.id, task?.id, actualStudiedSeconds, notesText);
    closeStudySession();
  };

  const handleSendTutorQuestion = async (customQ = null) => {
    const q = customQ || tutorQuestion;
    if (!q.trim() || isTutorThinking) return;

    const userText = q.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setTutorQuestion('');
    setIsTutorThinking(true);

    try {
      const answer = await askAiTutor({
        question: userText,
        topicTitle: topic.title,
        roadmapTitle: roadmap?.title || 'Tecnología',
        apiKey: geminiApiKey
      });
      setChatMessages(prev => [...prev, { sender: 'ai', text: answer }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: 'Ocurrió un error al contactar al tutor IA. Inténtalo de nuevo.' }]);
    } finally {
      setIsTutorThinking(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.88)',
        backdropFilter: 'blur(16px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
      className="animate-fade-in"
    >
      <div
        className="glass-card"
        style={{
          width: '95vw',
          maxWidth: '1440px',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-hover)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-canvas)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span
              className={`badge ${roadmap?.badgeClass || 'badge-go'}`}
              style={{ fontSize: '0.8rem', padding: '4px 12px' }}
            >
              {roadmap?.title || 'Roadmap'}
            </span>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {topic.title}
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {topic.youtubeTitle || 'Sesión de aprendizaje interactiva'}
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mode Switcher */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '3px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <button
                onClick={() => setTimerMode('pomodoro')}
                style={{
                  background: timerMode === 'pomodoro' ? 'var(--accent-primary)' : 'transparent',
                  color: timerMode === 'pomodoro' ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>🍅 Pomodoro</span>
              </button>
              <button
                onClick={() => setTimerMode('continuous')}
                style={{
                  background: timerMode === 'continuous' ? 'var(--accent-cyan)' : 'transparent',
                  color: timerMode === 'continuous' ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>⏱️ Continuo</span>
              </button>
            </div>

            {/* Complete Button */}
            <button
              onClick={handleFinishSession}
              className="btn btn-emerald"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <CheckCircle size={16} />
              <span>Marcar Completado</span>
            </button>

            {/* Close Button */}
            <button
              onClick={closeStudySession}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Studio Content Area (Split: Left Video & Controls / Right Tabs) */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          
          {/* Left Column: YouTube Player & Active Study Timer */}
          <div
            style={{
              flex: '1 1 65%',
              display: 'flex',
              flexDirection: 'column',
              background: '#070a12',
              borderRight: '1px solid var(--border-subtle)',
              position: 'relative'
            }}
          >
            {/* Embedded YouTube Container */}
            <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
              <div
                id="youtube-player-embed"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
              />
            </div>

            {/* Bottom Study Time Tracking Bar */}
            <div
              style={{
                padding: '16px 24px',
                background: 'var(--bg-canvas)',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* Active Play Indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: isPlaying ? '#10b981' : '#f59e0b',
                      boxShadow: isPlaying ? '0 0 12px #10b981' : 'none'
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Estado del Reproductor
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {isPlaying ? 'Estudiando activamente' : 'Video pausado'}
                    </div>
                  </div>
                </div>

                <div style={{ width: '1px', height: '32px', background: 'var(--border-subtle)' }} />

                {/* Tracked Study Time */}
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Tiempo Registrado en Sesión
                  </div>
                  <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38bdf8' }}>
                    {formatHoursMinutes(actualStudiedSeconds)}
                  </div>
                </div>
              </div>

              {/* Timer Control / Pomodoro Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {timerMode === 'pomodoro' ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: isBreak ? 'rgba(16, 185, 129, 0.12)' : 'rgba(99, 102, 241, 0.12)',
                      border: `1px solid ${isBreak ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    {isBreak ? <Coffee size={20} color="#10b981" /> : <Clock size={20} color="#818cf8" />}
                    <div>
                      <div style={{ fontSize: '0.7rem', color: isBreak ? '#34d399' : '#a5b4fc', fontWeight: 700, textTransform: 'uppercase' }}>
                        {isBreak ? 'Descanso' : 'Bloque de Enfoque'}
                      </div>
                      <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fff' }}>
                        {formatTime(timerSecondsLeft)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'rgba(6, 182, 212, 0.12)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <Clock size={20} color="#06b6d4" />
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#67e8f9', fontWeight: 700, textTransform: 'uppercase' }}>
                        Modo Continuo Activo
                      </div>
                      <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fff' }}>
                        {formatHoursMinutes(actualStudiedSeconds)}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (ytPlayerRef.current) {
                      if (isPlaying) {
                        ytPlayerRef.current.pauseVideo();
                      } else {
                        ytPlayerRef.current.playVideo();
                      }
                    }
                  }}
                  className="btn btn-primary"
                  style={{ height: '42px', padding: '0 20px', borderRadius: 'var(--radius-md)' }}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  <span>{isPlaying ? 'Pausar' : 'Reanudar'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Exercises, Concepts & Notion-style Notes */}
          <div
            style={{
              flex: '1 1 35%',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--bg-card)',
              overflow: 'hidden'
            }}
          >
            {/* Tabs Header */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'var(--bg-canvas)'
              }}
            >
              <button
                onClick={() => setSideTab('exercises')}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: sideTab === 'exercises' ? 'var(--bg-card)' : 'transparent',
                  border: 'none',
                  borderBottom: sideTab === 'exercises' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  color: sideTab === 'exercises' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Code size={16} />
                <span>Ejercicios & Retos</span>
              </button>
              <button
                onClick={() => setSideTab('notes')}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: sideTab === 'notes' ? 'var(--bg-card)' : 'transparent',
                  border: 'none',
                  borderBottom: sideTab === 'notes' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  color: sideTab === 'notes' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <BookOpen size={15} />
                <span>Apuntes Notion</span>
              </button>
              <button
                onClick={() => setSideTab('tutor')}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: sideTab === 'tutor' ? 'var(--bg-card)' : 'transparent',
                  border: 'none',
                  borderBottom: sideTab === 'tutor' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  color: sideTab === 'tutor' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Bot size={15} color={sideTab === 'tutor' ? 'var(--accent-primary)' : 'currentColor'} />
                <span>Tutor IA</span>
              </button>
            </div>

            {/* Tab 1: Exercises and Code */}
            {sideTab === 'exercises' && (
              <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Concepts List */}
                {topic.concepts && topic.concepts.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px' }}>
                      Conceptos Clave del Roadmap
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {topic.concepts.map((concept, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-subtle)',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.78rem',
                            color: 'var(--text-primary)'
                          }}
                        >
                          • {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Practical Exercises Checkbox List */}
                <div>
                  <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '10px' }}>
                    Práctica Guiada & Desafíos
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(topic.exercises || []).map((ex) => (
                      <div
                        key={ex.id}
                        onClick={() => toggleExercise(roadmap?.id, topic.id, ex.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          background: ex.done ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                          border: `1px solid ${ex.done ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-subtle)'}`,
                          cursor: 'pointer',
                          transition: 'all 0.18s'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={ex.done}
                          onChange={() => {}}
                          style={{ marginTop: '3px', cursor: 'pointer', accentColor: 'var(--accent-emerald)' }}
                        />
                        <span
                          style={{
                            fontSize: '0.85rem',
                            color: ex.done ? 'var(--text-muted)' : 'var(--text-primary)',
                            textDecoration: ex.done ? 'line-through' : 'none',
                            lineHeight: '1.4'
                          }}
                        >
                          {ex.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code Snippet to Practice */}
                {topic.codeSnippet && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                        Código de Referencia
                      </h4>
                      <button
                        onClick={() => handleCopyCode(topic.codeSnippet)}
                        className="btn btn-ghost"
                        style={{ padding: '3px 8px', fontSize: '0.75rem', height: '26px' }}
                      >
                        {copiedCode ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                        <span>{copiedCode ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                    <pre
                      style={{
                        background: '#080c14',
                        padding: '14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-card)',
                        fontSize: '0.82rem',
                        fontFamily: 'var(--font-mono)',
                        color: '#cbd5e1',
                        overflowX: 'auto',
                        lineHeight: '1.5'
                      }}
                    >
                      <code>{topic.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Notion-style Notes */}
            {sideTab === 'notes' && (
              <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Toma apuntes mientras ves el video o resuelves el ejercicio:
                  </span>
                  <button
                    onClick={() => saveTopicNotes(topic.id, notesText)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '4px 10px', height: '26px' }}
                  >
                    Guardar
                  </button>
                </div>
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Escribe tus notas, fragmentos de código o dudas aquí estilo Notion..."
                  style={{
                    flex: 1,
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-card)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    lineHeight: '1.6',
                    resize: 'none',
                    outline: 'none'
                  }}
                  onBlur={() => saveTopicNotes(topic.id, notesText)}
                />
              </div>
            )}

            {/* Tab 3: AI Tutor */}
            {sideTab === 'tutor' && (
              <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
                {/* Quick Suggestion Pills */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Preguntas Rápidas al Tutor:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {[
                      '¿Me explicas el concepto con una analogía?',
                      '¿Cómo resuelvo el ejercicio práctico?',
                      '¿Cuáles son los errores más comunes?'
                    ].map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendTutorQuestion(q)}
                        className="btn btn-secondary"
                        style={{
                          fontSize: '0.72rem',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          textAlign: 'left'
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Messages Log */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    padding: '8px 4px'
                  }}
                >
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '90%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: msg.sender === 'user' ? 'var(--gradient-cyan)' : 'rgba(255, 255, 255, 0.04)',
                        border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                        color: '#fff',
                        fontSize: '0.82rem',
                        lineHeight: '1.5'
                      }}
                    >
                      {msg.sender === 'ai' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', color: 'var(--accent-primary)', fontSize: '0.72rem', fontWeight: 700 }}>
                          <Bot size={12} />
                          <span>TUTOR IA</span>
                        </div>
                      )}
                      <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                    </div>
                  ))}

                  {isTutorThinking && (
                    <div
                      style={{
                        alignSelf: 'flex-start',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        fontSize: '0.78rem',
                        color: '#a5b4fc',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Sparkles size={14} className="glow-effect" />
                      <span>El Tutor IA está analizando tu lección...</span>
                    </div>
                  )}
                </div>

                {/* Input Field */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendTutorQuestion();
                  }}
                  style={{ display: 'flex', gap: '8px' }}
                >
                  <input
                    type="text"
                    value={tutorQuestion}
                    onChange={(e) => setTutorQuestion(e.target.value)}
                    placeholder="Hazle una pregunta al Tutor sobre este video..."
                    className="input-field"
                    style={{ fontSize: '0.82rem', padding: '10px 12px' }}
                  />
                  <button
                    type="submit"
                    disabled={!tutorQuestion.trim() || isTutorThinking}
                    className="btn btn-primary"
                    style={{ padding: '0 14px', flexShrink: 0 }}
                  >
                    <Send size={15} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
