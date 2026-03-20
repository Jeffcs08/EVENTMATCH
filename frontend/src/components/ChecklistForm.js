import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ChecklistForm = ({ item, eventId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    task: '',
    phase: 'Planejamento',
    priority: 'media',
    done: false,
    event: eventId || ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        task: item.task || '',
        phase: item.phase || 'Planejamento',
        priority: item.priority || 'media',
        done: item.done || false,
        event: item.event || eventId || ''
      });
    }
  }, [item, eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (item?.id) {
        await api.put(`/checklist/${item.id}/`, formData);
      } else {
        await api.post('/checklist/', formData);
      }
      onSave();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      alert('Erro ao salvar tarefa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{item?.id ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tarefa *</label>
            <input
              type="text"
              name="task"
              value={formData.task}
              onChange={handleChange}
              required
              placeholder="Ex: Contratar buffet, comprar alianças..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fase</label>
              <input
                type="text"
                name="phase"
                value={formData.phase}
                onChange={handleChange}
                placeholder="Ex: Planejamento, Pré-casamento, Dia do evento"
              />
            </div>

            <div className="form-group">
              <label>Prioridade</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="alta">🔴 Alta</option>
                <option value="media">🟡 Média</option>
                <option value="baixa">🟢 Baixa</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" disabled={loading} className="btn">
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChecklistForm;