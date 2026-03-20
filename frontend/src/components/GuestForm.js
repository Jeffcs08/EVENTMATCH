import React, { useState, useEffect } from 'react';
import api from '../services/api';

const GuestForm = ({ guest, eventId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    group_name: 'Geral',
    status: 'pendente',
    table_name: '',
    dietary: '',
    phone: '',
    event: eventId || ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (guest) {
      setFormData({
        name: guest.name || '',
        group_name: guest.group_name || 'Geral',
        status: guest.status || 'pendente',
        table_name: guest.table_name || '',
        dietary: guest.dietary || '',
        phone: guest.phone || '',
        event: guest.event || eventId || ''
      });
    }
  }, [guest, eventId]);

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
      if (guest?.id) {
        await api.put(`/guests/${guest.id}/`, formData);
      } else {
        await api.post('/guests/', formData);
      }
      onSave();
    } catch (error) {
      console.error('Erro ao salvar convidado:', error);
      alert('Erro ao salvar convidado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{guest?.id ? 'Editar Convidado' : 'Novo Convidado'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome Completo *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Nome do convidado"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Grupo</label>
              <input
                type="text"
                name="group_name"
                value={formData.group_name}
                onChange={handleChange}
                placeholder="Ex: Família da noiva"
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="pendente">⏳ Pendente</option>
                <option value="confirmado">✅ Confirmado</option>
                <option value="recusado">❌ Recusado</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Mesa</label>
              <input
                type="text"
                name="table_name"
                value={formData.table_name}
                onChange={handleChange}
                placeholder="Ex: Mesa 5"
              />
            </div>

            <div className="form-group">
              <label>Telefone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Observações / Restrições alimentares</label>
            <textarea
              name="dietary"
              value={formData.dietary}
              onChange={handleChange}
              placeholder="Ex: Vegetariano, alérgico a frutos do mar..."
              rows="2"
            />
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

export default GuestForm;