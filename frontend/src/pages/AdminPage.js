import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './AdminPage.css';

const AdminPage = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar se é admin
    if (user?.username !== 'admin') {
      window.location.href = '/dashboard';
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, eventsRes] = await Promise.all([
        api.get('/auth/admin/users/'),
        api.get('/auth/admin/events/')
      ]);
      setUsers(usersRes.data);
      setEvents(eventsRes.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        await api.delete(`/auth/admin/event/${eventId}/`);
        fetchData();
      } catch (error) {
        console.error('Erro ao excluir evento:', error);
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Não definida';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Painel Administrativo - La Vie Casamentos</h1>
        <div className="admin-user-info">
          <span>👑 Admin: {user?.username}</span>
          <button onClick={logout} className="btn-logout">Sair</button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total de Usuários</h3>
          <p className="stat-number">{users.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total de Eventos</h3>
          <p className="stat-number">{events.length}</p>
        </div>
      </div>

      <div className="admin-sections">
        {/* Seção de Usuários */}
        <div className="admin-section">
          <h2>👥 Usuários Cadastrados</h2>
          <div className="users-grid">
            {users.map((user) => (
              <div 
                key={user.id} 
                className={`user-card ${selectedUser?.id === user.id ? 'selected' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="user-avatar">👤</div>
                <div className="user-info">
                  <h3>{user.username}</h3>
                  <p>{user.email || 'Sem email'}</p>
                  <p className="user-stats">📅 {user.events?.length || 0} eventos</p>
                  <p className="user-date">Cadastro: {new Date(user.date_joined).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seção de Eventos do Usuário Selecionado */}
        {selectedUser && (
          <div className="admin-section">
            <h2>📅 Eventos de {selectedUser.username}</h2>
            <div className="events-grid">
              {selectedUser.events && selectedUser.events.length > 0 ? (
                selectedUser.events.map((event) => (
                  <div key={event.id} className="event-card admin-event-card">
                    <div className="event-card-header">
                      <h3>{event.name || event.couple_names || 'Evento'}</h3>
                      <button 
                        onClick={() => handleDeleteEvent(event.id)}
                        className="btn-delete"
                        title="Excluir evento"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="event-card-body">
                      <p><strong>Tipo:</strong> {event.event_type_display || event.event_type}</p>
                      <p><strong>Tema:</strong> {event.theme_display || event.theme}</p>
                      <p><strong>Orçamento:</strong> {formatCurrency(event.budget_total)}</p>
                      <p><strong>Data:</strong> {formatDate(event.event_date)}</p>
                      <p><strong>Local:</strong> {event.venue || 'Não definido'}</p>
                      <p><strong>Convidados:</strong> {event.guests_expected || 0}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-events">Este usuário ainda não tem eventos.</p>
              )}
            </div>
          </div>
        )}

        {/* Seção de Todos os Eventos */}
        <div className="admin-section">
          <h2>📋 Todos os Eventos</h2>
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card admin-event-card">
                <div className="event-card-header">
                  <h3>{event.name || event.couple_names || 'Evento'}</h3>
                  <div className="event-actions">
                    <span className="event-user">👤 {event.user_username || 'Usuário'}</span>
                    <button 
                      onClick={() => handleDeleteEvent(event.id)}
                      className="btn-delete"
                      title="Excluir evento"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="event-card-body">
                  <p><strong>Tipo:</strong> {event.event_type_display || event.event_type}</p>
                  <p><strong>Tema:</strong> {event.theme_display || event.theme}</p>
                  <p><strong>Orçamento:</strong> {formatCurrency(event.budget_total)}</p>
                  <p><strong>Data:</strong> {formatDate(event.event_date)}</p>
                  <p><strong>Local:</strong> {event.venue || 'Não definido'}</p>
                  <p><strong>Convidados:</strong> {event.guests_expected || 0}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;