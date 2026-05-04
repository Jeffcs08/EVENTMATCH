import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import EventForm from '../components/EventForm';
import GuestList from '../components/GuestList';
import GuestForm from '../components/GuestForm';
import SupplierList from '../components/SupplierList';
import SupplierForm from '../components/SupplierForm';
import './pages.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalGuests: 0,
    totalSuppliers: 0,
    totalTasks: 0
  });

  useEffect(() => {
    fetchEvents();
    fetchStats();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile/');
      setProfile(response.data.profile);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/events/');
      setEvents(response.data);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [eventsRes, guestsRes, suppliersRes, tasksRes] = await Promise.all([
        api.get('/events/'),
        api.get('/guests/'),
        api.get('/suppliers/'),
        api.get('/checklist/')
      ]);

      setStats({
        totalEvents: eventsRes.data.length,
        totalGuests: guestsRes.data.length,
        totalSuppliers: suppliersRes.data.length,
        totalTasks: tasksRes.data.length
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        await api.delete(`/events/${id}/`);
        await fetchEvents();
        await fetchStats();
        if (selectedEvent === id) {
          setSelectedEvent(null);
        }
      } catch (error) {
        console.error('Erro ao excluir evento:', error);
      }
    }
  };

  const handleSave = () => {
    setShowEventForm(false);
    setEditingEvent(null);
    fetchEvents();
    fetchStats();
  };

  const handleGuestEdit = (guest) => {
    setEditingGuest(guest);
    setShowGuestForm(true);
  };

  const handleGuestDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este convidado?')) {
      try {
        await api.delete(`/guests/${id}/`);
        fetchStats();
      } catch (error) {
        console.error('Erro ao excluir convidado:', error);
      }
    }
  };

  const handleGuestSave = () => {
    setShowGuestForm(false);
    setEditingGuest(null);
    fetchStats();
  };

  const handleSupplierEdit = (supplier) => {
    setEditingSupplier(supplier);
    setShowSupplierForm(true);
  };

  const handleSupplierDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
      try {
        await api.delete(`/suppliers/${id}/`);
        fetchStats();
      } catch (error) {
        console.error('Erro ao excluir fornecedor:', error);
      }
    }
  };

  const handleSupplierSave = () => {
    setShowSupplierForm(false);
    setEditingSupplier(null);
    fetchStats();
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

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>La Vie Casamentos</h1>
        <div className="user-info">
          {user?.username === 'admin' && (
            <Link to="/admin" className="btn-admin">
              👑 Admin
            </Link>
          )}
          <Link to="/profile" className="btn-profile">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Avatar" 
                className="profile-avatar-small"
              />
            ) : (
              <span className="profile-avatar-placeholder">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            )}
            <span>{user?.username}</span>
          </Link>
          <button onClick={logout} className="btn-logout">
            Sair
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Eventos</h3>
          <p className="stat-number">{stats.totalEvents}</p>
        </div>
        <div className="stat-card">
          <h3>Convidados</h3>
          <p className="stat-number">{stats.totalGuests}</p>
        </div>
        <div className="stat-card">
          <h3>Fornecedores</h3>
          <p className="stat-number">{stats.totalSuppliers}</p>
        </div>
        <div className="stat-card">
          <h3>Tarefas</h3>
          <p className="stat-number">{stats.totalTasks}</p>
        </div>
      </div>

      <div className="section-header">
        <h2>Meus Eventos</h2>
        <button 
          className="btn"
          onClick={() => {
            setEditingEvent(null);
            setShowEventForm(true);
          }}
        >
          + Novo Evento
        </button>
      </div>

      {loading ? (
        <div className="loading">Carregando eventos...</div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <p>Você ainda não tem nenhum evento cadastrado.</p>
          <button 
            className="btn"
            onClick={() => {
              setEditingEvent(null);
              setShowEventForm(true);
            }}
          >
            Criar meu primeiro evento
          </button>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-card-header">
                <h3>{event.name || event.couple_names || 'Evento'}</h3>
                <div className="event-actions">
                  <button onClick={() => handleEdit(event)} className="btn-icon" title="Editar">✏️</button>
                  <button onClick={() => handleDelete(event.id)} className="btn-icon" title="Excluir">🗑️</button>
                </div>
              </div>
              <div className="event-card-body">
                <p><strong>Tipo:</strong> {event.event_type_display || event.event_type}</p>
                <p><strong>Tema:</strong> {event.theme_display || event.theme}</p>
                <p><strong>Orçamento:</strong> {formatCurrency(event.budget_total)}</p>
                <p><strong>Data:</strong> {formatDate(event.event_date)}</p>
                <p><strong>Local:</strong> {event.venue || 'Não definido'}</p>
                <p><strong>Cidade:</strong> {event.city || 'Não definida'}</p>
                <p><strong>Convidados:</strong> {event.guests_expected || 0}</p>
              </div>
              <button 
                className={`btn-select ${selectedEvent === event.id ? 'selected' : ''}`}
                onClick={() => setSelectedEvent(event.id)}
              >
                {selectedEvent === event.id ? '✓ Evento Selecionado' : 'Selecionar Evento'}
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedEvent && (
        <div className="management-section">
          <div className="section-header">
            <h2>Gerenciando: {events.find(e => e.id === selectedEvent)?.name || events.find(e => e.id === selectedEvent)?.couple_names || 'Evento'}</h2>
            <button 
              className="btn-secondary"
              onClick={() => setSelectedEvent(null)}
            >
              Trocar Evento
            </button>
          </div>

          <div className="section-header" style={{ marginTop: '30px' }}>
            <h2>Convidados</h2>
          </div>

          <GuestList
            eventId={selectedEvent}
            onEdit={handleGuestEdit}
            onDelete={handleGuestDelete}
          />

          <div className="section-header" style={{ marginTop: '30px' }}>
            <h2>Fornecedores</h2>
          </div>

          <SupplierList
            eventId={selectedEvent}
            onEdit={handleSupplierEdit}
            onDelete={handleSupplierDelete}
          />
        </div>
      )}

      {showEventForm && (
        <EventForm
          event={editingEvent}
          onSave={handleSave}
          onCancel={() => {
            setShowEventForm(false);
            setEditingEvent(null);
          }}
        />
      )}

      {showGuestForm && (
        <GuestForm
          guest={editingGuest}
          eventId={selectedEvent}
          onSave={handleGuestSave}
          onCancel={() => {
            setShowGuestForm(false);
            setEditingGuest(null);
          }}
        />
      )}

      {showSupplierForm && (
        <SupplierForm
          supplier={editingSupplier}
          eventId={selectedEvent}
          onSave={handleSupplierSave}
          onCancel={() => {
            setShowSupplierForm(false);
            setEditingSupplier(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
