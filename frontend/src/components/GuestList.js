import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './styles.css';

const GuestList = ({ eventId, onEdit, onDelete }) => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuests();
  }, [eventId]);

  const fetchGuests = async () => {
    try {
      const response = await api.get('/guests/');
      // Filtra por evento se eventId for fornecido
      const filteredGuests = eventId 
        ? response.data.filter(g => g.event === eventId)
        : response.data;
      setGuests(filteredGuests);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar convidados:', error);
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'confirmado': return 'status-confirmed';
      case 'pendente': return 'status-pending';
      case 'recusado': return 'status-declined';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'confirmado': return '✅ Confirmado';
      case 'pendente': return '⏳ Pendente';
      case 'recusado': return '❌ Recusado';
      default: return status;
    }
  };

  if (loading) return <div className="loading">Carregando convidados...</div>;

  return (
    <div className="list-container">
      <div className="list-header">
        <h3>Convidados</h3>
        <button onClick={() => onEdit(null)} className="btn-small">
          + Adicionar
        </button>
      </div>
      
      {guests.length === 0 ? (
        <p className="empty-message">Nenhum convidado cadastrado.</p>
      ) : (
        <div className="guest-list">
          {guests.map((guest) => (
            <div key={guest.id} className="guest-card">
              <div className="guest-header">
                <h4>{guest.name}</h4>
                <div className="guest-actions">
                  <button onClick={() => onEdit(guest)} className="btn-icon">✏️</button>
                  <button onClick={() => onDelete(guest.id)} className="btn-icon">🗑️</button>
                </div>
              </div>
              <div className="guest-details">
                <span className={`status-badge ${getStatusClass(guest.status)}`}>
                  {getStatusText(guest.status)}
                </span>
                <p><strong>Grupo:</strong> {guest.group_name || 'Geral'}</p>
                {guest.table_name && <p><strong>Mesa:</strong> {guest.table_name}</p>}
                {guest.phone && <p><strong>Telefone:</strong> {guest.phone}</p>}
                {guest.dietary && <p><strong>Obs:</strong> {guest.dietary}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuestList;