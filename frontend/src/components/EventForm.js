import React, { useState } from 'react';
import api from '../services/api';

const EventForm = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    couple_names: event?.couple_names || '',
    event_date: event?.event_date || '',
    city: event?.city || '',
    venue: event?.venue || '',
    guests_expected: event?.guests_expected || 0,
    budget_total: event?.budget_total || 0,
    style: event?.style || 'classico',
    ceremony_time: event?.ceremony_time || '16:00',
    party_time: event?.party_time || '18:00',
    notes: event?.notes || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verificar token ANTES de enviar
      const token = localStorage.getItem('access_token');
      console.log('Token que será enviado:', token);
      
      if (!token) {
        alert('Você não está logado! Faça login novamente.');
        window.location.href = '/login';
        return;
      }

      // Converter números
      const dadosParaEnviar = {
        ...formData,
        guests_expected: Number(formData.guests_expected),
        budget_total: Number(formData.budget_total)
      };
      
      console.log('Enviando dados:', dadosParaEnviar);
      
      let response;
      if (event?.id) {
        response = await api.put(`/events/${event.id}/`, dadosParaEnviar);
      } else {
        response = await api.post('/events/', dadosParaEnviar);
      }
      
      console.log('Resposta:', response);
      alert('Evento salvo com sucesso!');
      onSave();
      
    } catch (error) {
      console.error('Erro completo:', error);
      console.error('Resposta do erro:', error.response);
      
      if (error.response?.status === 403) {
        alert('Erro de autenticação! Faça login novamente.');
        localStorage.clear();
        window.location.href = '/login';
      } else {
        alert('Erro ao salvar: ' + (error.response?.data?.message || 'Verifique os dados'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{event?.id ? 'Editar Evento' : 'Novo Evento'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome dos Noivos *</label>
            <input
              type="text"
              name="couple_names"
              value={formData.couple_names}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Data do Evento</label>
            <input
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Cidade</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Local</label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Convidados</label>
            <input
              type="number"
              name="guests_expected"
              value={formData.guests_expected}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Orçamento (R$)</label>
            <input
              type="number"
              name="budget_total"
              value={formData.budget_total}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Estilo</label>
            <select name="style" value={formData.style} onChange={handleChange}>
              <option value="classico">Clássico</option>
              <option value="rustico">Rústico</option>
              <option value="moderno">Moderno</option>
              <option value="luxo">Luxo</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn">
              {loading ? 'Salvando...' : 'Salvar Evento'}
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

export default EventForm;