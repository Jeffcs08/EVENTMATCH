import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './styles.css';

const EventList = ({ onEdit, onDelete }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events/');
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Carregando eventos...</div>;

  return (
    <div className="list-container">
      {events.length === 0 ? (
        <p className="empty-message">Nenhum evento cadastrado ainda.</p>
      ) : (
        <div className="card-grid">
          {events.map((event) => (
            <div key={event.id} className="card">
              <div className="card-header">
                <h3>{event.couple_names}</h3>
                <div className="card-actions">
                  <button onClick={() => onEdit(event)} className="btn-icon">✏️</button>
                  <button onClick={() => onDelete(event.id)} className="btn-icon">🗑️</button>
                </div>
              </div>
              <div className="card-body">
                <p><strong>Data:</strong> {new Date(event.event_date).toLocaleDateString('pt-BR')}</p>
                <p><strong>Local:</strong> {event.venue}</p>
                <p><strong>Cidade:</strong> {event.city}</p>
                <p><strong>Convidados:</strong> {event.guests_expected}</p>
                <p><strong>Orçamento:</strong> R$ {event.budget_total}</p>
                <p><strong>Estilo:</strong> {event.style}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;