import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './styles.css';

const ChecklistList = ({ eventId, onEdit, onDelete }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, [eventId]);

  const fetchItems = async () => {
    try {
      const response = await api.get('/checklist/');
      const filteredItems = eventId 
        ? response.data.filter(i => i.event === eventId)
        : response.data;
      setItems(filteredItems);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar checklist:', error);
      setLoading(false);
    }
  };

  const toggleDone = async (id, currentValue) => {
    try {
      await api.patch(`/checklist/${id}/`, { done: !currentValue });
      fetchItems();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'alta': return 'priority-high';
      case 'media': return 'priority-medium';
      case 'baixa': return 'priority-low';
      default: return '';
    }
  };

  if (loading) return <div className="loading">Carregando checklist...</div>;

  return (
    <div className="list-container">
      <div className="list-header">
        <h3>Checklist do Casamento</h3>
        <button onClick={() => onEdit(null)} className="btn-small">
          + Nova Tarefa
        </button>
      </div>
      
      {items.length === 0 ? (
        <p className="empty-message">Nenhuma tarefa cadastrada.</p>
      ) : (
        <div className="checklist-container">
          {items.map((item) => (
            <div key={item.id} className={`checklist-item ${item.done ? 'item-done' : ''}`}>
              <div className="checklist-content">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleDone(item.id, item.done)}
                  className="checklist-checkbox"
                />
                <div className="checklist-text">
                  <div className="checklist-header">
                    <strong>{item.task}</strong>
                    <span className={`priority-badge ${getPriorityClass(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                  <div className="checklist-meta">
                    <span className="phase">{item.phase}</span>
                  </div>
                </div>
              </div>
              <div className="checklist-actions">
                <button onClick={() => onEdit(item)} className="btn-icon">✏️</button>
                <button onClick={() => onDelete(item.id)} className="btn-icon">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChecklistList;   