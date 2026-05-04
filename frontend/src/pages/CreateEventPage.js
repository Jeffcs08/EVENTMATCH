import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './CreateEventPage.css';

const CreateEventPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    event_type: 'wedding',
    theme: 'classic',
    custom_theme: '',
    budget_total: '',
    event_date: '',
    city: '',
    venue: '',
    guests_expected: '',
    couple_names: '',
    company_name: '',
    start_time: '18:00',
    end_time: '23:00',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
  setError('');

  try {
    // Validações
    if (!formData.name) {
      setError('Nome do evento é obrigatório');
      setLoading(false);
      return;
    }

    if (!formData.budget_total || formData.budget_total <= 0) {
      setError('Orçamento total é obrigatório e deve ser maior que zero');
      setLoading(false);
      return;
    }

    const dadosParaEnviar = {
      ...formData,
      budget_total: parseFloat(formData.budget_total),
      guests_expected: parseInt(formData.guests_expected) || 0
    };

    console.log('Enviando dados:', dadosParaEnviar);

    const response = await api.post('/events/', dadosParaEnviar);
    
    console.log('Resposta do servidor:', response);
    console.log('Status:', response.status);
    console.log('Dados:', response.data);
    
    // Verificar se a resposta foi bem-sucedida
    if (response.status === 201 || response.status === 200) {
      console.log('Evento criado com sucesso! ID:', response.data.id);
      alert('Evento criado com sucesso!');
      navigate('/dashboard');
    } else {
      setError('Erro inesperado ao criar evento');
    }
    
  } catch (err) {
    console.error('Erro completo:', err);
    console.error('Resposta do erro:', err.response);
    console.error('Dados do erro:', err.response?.data);
    
    // Verificar se mesmo com erro o evento foi criado
    if (err.response?.status === 400) {
      setError(err.response?.data?.message || 'Erro ao criar evento. Verifique os dados.');
    } else {
      setError('Erro ao criar evento. Tente novamente.');
    }
  } finally {
    setLoading(false);
  }
};

  // Opções de temas baseadas no tipo de evento
  const getThemeOptions = () => {
    const themes = {
      wedding: [
        { value: 'classic', label: '🎭 Clássico' },
        { value: 'rustic', label: '🌿 Rústico' },
        { value: 'garden', label: '🌸 Jardim' },
        { value: 'beach', label: '🏖️ Praia' },
        { value: 'vintage', label: '📻 Vintage' },
        { value: 'modern', label: '✨ Moderno' },
        { value: 'luxury', label: '💎 Luxo' }
      ],
      corporate: [
        { value: 'tech', label: '💻 Tecnologia' },
        { value: 'modern', label: '✨ Moderno' },
        { value: 'minimalist', label: '⬜ Minimalista' },
        { value: 'luxury', label: '💎 Luxo' }
      ],
      birthday: [
        { value: 'hawaiian', label: '🌺 Havaiano' },
        { value: 'garden', label: '🌸 Jardim' },
        { value: 'vintage', label: '📻 Vintage' },
        { value: 'classic', label: '🎭 Clássico' }
      ],
      party: [
        { value: 'hawaiian', label: '🌺 Havaiano' },
        { value: 'modern', label: '✨ Moderno' },
        { value: 'beach', label: '🏖️ Praia' }
      ]
    };
    return themes[formData.event_type] || themes.wedding;
  };

  return (
    <div className="create-event-container">
      <div className="create-event-box">
        <div className="create-event-header">
          <h1>Criar Novo Evento</h1>
          <p>Conte-nos sobre seu evento para começar o planejamento</p>
        </div>

        {error && <div className="create-event-error">{error}</div>}

        <form onSubmit={handleSubmit} className="create-event-form">
          {/* Nome do Evento */}
          <div className="form-group">
            <label>Nome do Evento *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Casamento Ana & Lucas"
              required
            />
          </div>

          {/* Tipo de Evento */}
          <div className="form-group">
            <label>Tipo de Evento *</label>
            <select name="event_type" value={formData.event_type} onChange={handleChange} required>
              <option value="wedding">💍 Casamento</option>
              <option value="corporate">🏢 Corporativo</option>
              <option value="birthday">🎂 Aniversário</option>
              <option value="party">🎉 Festa</option>
              <option value="other">📌 Outro</option>
            </select>
          </div>

          {/* Tema */}
          <div className="form-group">
            <label>Tema *</label>
            <select name="theme" value={formData.theme} onChange={handleChange} required>
              {getThemeOptions().map(theme => (
                <option key={theme.value} value={theme.value}>{theme.label}</option>
              ))}
              <option value="custom">🎨 Personalizado</option>
            </select>
          </div>

          {/* Tema Personalizado */}
          {formData.theme === 'custom' && (
            <div className="form-group">
              <label>Descreva o tema personalizado</label>
              <input
                type="text"
                name="custom_theme"
                value={formData.custom_theme}
                onChange={handleChange}
                placeholder="Ex: Festa junina, Anos 80, Super-heróis..."
              />
            </div>
          )}

          {/* Orçamento */}
          <div className="form-group">
            <label>Orçamento Total (R$) *</label>
            <input
              type="number"
              name="budget_total"
              value={formData.budget_total}
              onChange={handleChange}
              placeholder="0,00"
              min="0"
              step="100"
              required
            />
            <small className="form-hint">Este será o limite total para gastos do evento</small>
          </div>

          {/* Nomes dos Noivos (se for casamento) */}
          {formData.event_type === 'wedding' && (
            <div className="form-group">
              <label>Nomes dos Noivos</label>
              <input
                type="text"
                name="couple_names"
                value={formData.couple_names}
                onChange={handleChange}
                placeholder="Ex: Ana & Lucas"
              />
            </div>
          )}

          {/* Nome da Empresa (se for corporativo) */}
          {formData.event_type === 'corporate' && (
            <div className="form-group">
              <label>Nome da Empresa</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Ex: Tech Solutions Inc."
              />
            </div>
          )}

          {/* Data do Evento */}
          <div className="form-group">
            <label>Data do Evento</label>
            <input
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
            />
          </div>

          {/* Horários */}
          <div className="form-row">
            <div className="form-group">
              <label>Horário de Início</label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Horário de Término</label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Localização */}
          <div className="form-row">
            <div className="form-group">
              <label>Cidade</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="São Paulo"
              />
            </div>
            <div className="form-group">
              <label>Local / Espaço</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Nome do local"
              />
            </div>
          </div>

          {/* Convidados */}
          <div className="form-group">
            <label>Número de Convidados (estimado)</label>
            <input
              type="number"
              name="guests_expected"
              value={formData.guests_expected}
              onChange={handleChange}
              placeholder="100"
              min="0"
            />
          </div>

          {/* Observações */}
          <div className="form-group">
            <label>Observações adicionais</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Algum detalhe importante? Ex: decoração específica, restrições, etc."
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Criando evento...' : 'Criar Evento'}
            </button>
            <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;