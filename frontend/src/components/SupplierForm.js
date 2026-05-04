import React, { useState, useEffect } from 'react';
import api from '../services/api';

const SupplierForm = ({ supplier, eventId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    status: 'cotado',
    value: 0,
    contact: '',
    score: 0,
    event: eventId || ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        category: supplier.category || '',
        status: supplier.status || 'cotado',
        value: supplier.value || 0,
        contact: supplier.contact || '',
        score: supplier.score || 0,
        event: supplier.event || eventId || ''
      });
    }
  }, [supplier, eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'value' || name === 'score' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (supplier?.id) {
        await api.put(`/suppliers/${supplier.id}/`, formData);
      } else {
        await api.post('/suppliers/', formData);
      }
      onSave();
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
      alert('Erro ao salvar fornecedor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{supplier?.id ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nome do Fornecedor *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ex: Buffet Primavera"
              />
            </div>

            <div className="form-group">
              <label>Categoria *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="Ex: Buffet, Fotografia, Decoração..."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="cotado">📄 Cotado</option>
                <option value="negociacao">🤝 Em negociação</option>
                <option value="contratado">✅ Contratado</option>
              </select>
            </div>

            <div className="form-group">
              <label>Valor (R$)</label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                min="0"
                step="100"
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contato</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Telefone, email ou pessoa de contato"
              />
            </div>

            <div className="form-group">
              <label>Nota (0-5)</label>
              <input
                type="number"
                name="score"
                value={formData.score}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.5"
                placeholder="Avaliação do fornecedor"
              />
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

export default SupplierForm;