import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Plus, 
  Check, 
  BookOpen
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export default function QuickAddTaskModal() {
  const { isQuickAddOpen, setIsQuickAddOpen, roadmaps, addTaskToSchedule } = useStudy();

  const [selectedRoadmapId, setSelectedRoadmapId] = useState(roadmaps[0]?.id || 'go-developer');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-09-29'); // Defaults to tomorrow
  const [timeSlot, setTimeSlot] = useState('10:00 - 11:00');
  const [durationMinutes, setDurationMinutes] = useState(45);

  if (!isQuickAddOpen) return null;

  const currentRoadmap = roadmaps.find(r => r.id === selectedRoadmapId) || roadmaps[0];
  
  // Flatten topics in current roadmap
  const availableTopics = [];
  currentRoadmap.weeks.forEach(w => {
    (w.days || []).forEach(d => {
      availableTopics.push({
        id: d.id,
        title: d.title,
        weekNumber: w.weekNumber,
        estimatedMinutes: d.estimatedMinutes || 45
      });
    });
  });

  const getDayNameFromDate = (dateStr) => {
    const daysMap = {
      '2026-09-28': 'Lunes',
      '2026-09-29': 'Martes',
      '2026-09-30': 'Miércoles',
      '2026-10-01': 'Jueves',
      '2026-10-02': 'Viernes',
      '2026-10-03': 'Sábado',
      '2026-10-04': 'Domingo'
    };
    return daysMap[dateStr] || 'Lunes';
  };

  const handleSave = () => {
    let titleToUse = customTitle.trim();
    let topicIdToUse = selectedTopicId;

    if (!titleToUse && selectedTopicId) {
      const topicObj = availableTopics.find(t => t.id === selectedTopicId);
      titleToUse = topicObj ? topicObj.title : 'Sesión de Estudio';
    } else if (!titleToUse && !selectedTopicId) {
      if (availableTopics.length > 0) {
        titleToUse = availableTopics[0].title;
        topicIdToUse = availableTopics[0].id;
      } else {
        titleToUse = 'Nueva Sesión de Aprendizaje';
      }
    }

    addTaskToSchedule({
      roadmapId: selectedRoadmapId,
      topicId: topicIdToUse || `custom-${Date.now()}`,
      title: titleToUse,
      date: selectedDate,
      dayName: getDayNameFromDate(selectedDate),
      timeSlot: timeSlot,
      durationMinutes: Number(durationMinutes)
    });

    setIsQuickAddOpen(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(12px)',
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
            <Calendar size={18} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Planear Sesión en la Agenda</h2>
          </div>
          <button
            onClick={() => setIsQuickAddOpen(false)}
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
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Select Date Quick Buttons */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
              ¿Para cuándo planificas?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setSelectedDate('2026-09-28')}
                className={`btn ${selectedDate === '2026-09-28' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.8rem', padding: '8px' }}
              >
                Hoy (Lun 28)
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate('2026-09-29')}
                className={`btn ${selectedDate === '2026-09-29' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.8rem', padding: '8px' }}
              >
                Mañana (Mar 29)
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate('2026-09-30')}
                className={`btn ${selectedDate === '2026-09-30' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.8rem', padding: '8px' }}
              >
                Miércoles (30)
              </button>
            </div>
          </div>

          {/* Select Roadmap */}
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
              Ruta de Aprendizaje
            </label>
            <select
              value={selectedRoadmapId}
              onChange={(e) => {
                setSelectedRoadmapId(e.target.value);
                setSelectedTopicId('');
              }}
              className="input-field"
              style={{ padding: '9px 12px' }}
            >
              {roadmaps.map(r => (
                <option key={r.id} value={r.id}>{r.title}</option>
              ))}
            </select>
          </div>

          {/* Choose topic from roadmap */}
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
              Tema del Roadmap
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => {
                setSelectedTopicId(e.target.value);
                setCustomTitle('');
              }}
              className="input-field"
              style={{ padding: '9px 12px' }}
            >
              <option value="">-- Seleccionar tema sugerido del roadmap --</option>
              {availableTopics.map(t => (
                <option key={t.id} value={t.id}>Semana {t.weekNumber}: {t.title}</option>
              ))}
            </select>
          </div>

          {/* Or type custom topic */}
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
              O escribe un tema personalizado
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Ej: Repasar apuntes de Concurrencia o Ejercicio en Go"
              className="input-field"
            />
          </div>

          {/* Time & Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Horario
              </label>
              <input
                type="text"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                placeholder="10:00 - 11:00"
                className="input-field"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Duración (minutos)
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="input-field"
              >
                <option value={30}>30 minutos</option>
                <option value={45}>45 minutos</option>
                <option value={60}>60 minutos (1h)</option>
                <option value={90}>90 minutos (1.5h)</option>
              </select>
            </div>
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
            justifyContent: 'flex-end',
            gap: '12px'
          }}
        >
          <button
            onClick={() => setIsQuickAddOpen(false)}
            className="btn btn-secondary"
            style={{ padding: '8px 16px' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary"
            style={{ padding: '8px 20px' }}
          >
            <Plus size={16} />
            <span>Añadir a la Agenda</span>
          </button>
        </div>
      </div>
    </div>
  );
}
