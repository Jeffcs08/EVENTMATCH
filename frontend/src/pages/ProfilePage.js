import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
    birth_date: '',
    address: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile/');
      setProfile(response.data);
      setFormData({
        username: response.data.user.username || '',
        email: response.data.user.email || '',
        first_name: response.data.user.first_name || '',
        last_name: response.data.user.last_name || '',
        phone: response.data.profile.phone || '',
        bio: response.data.profile.bio || '',
        birth_date: response.data.profile.birth_date || '',
        address: response.data.profile.address || ''
      });
      if (response.data.profile.avatar_url) {
        setAvatarPreview(response.data.profile.avatar_url);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('birth_date', formData.birth_date);
      formDataToSend.append('address', formData.address);
      
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      }

      const response = await api.put('/auth/profile/', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.user.username !== user?.username) {
        login(response.data.user, {
          access: localStorage.getItem('access_token'),
          refresh: localStorage.getItem('refresh_token')
        });
      }
      
      setProfile(response.data);
      setEditing(false);
      setMessage('Perfil atualizado com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError(error.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Meu Perfil</h1>
        {!editing && (
          <button className="btn-edit" onClick={() => setEditing(true)}>
            Editar Perfil
          </button>
        )}
      </div>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="profile-content">
        <div className="profile-avatar-section">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar" className="profile-avatar" />
          ) : (
            <div className="avatar-placeholder">
              {formData.username?.charAt(0).toUpperCase()}
            </div>
          )}
          {editing && (
            <label className="avatar-upload-btn">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
              <span>Alterar Foto</span>
            </label>
          )}
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h3>Informações Pessoais</h3>
            
            <div className="form-group">
              <label>Nome de usuário</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div className="form-group">
                <label>Sobrenome</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Telefone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="form-group">
                <label>Data de Nascimento</label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Endereço</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!editing}
                rows="3"
                placeholder="Seu endereço completo"
              />
            </div>

            <div className="form-group">
              <label>Biografia</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!editing}
                rows="4"
                placeholder="Conte um pouco sobre você..."
              />
            </div>
          </div>

          {editing && (
            <div className="form-actions">
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
              <button type="button" className="btn-cancel" onClick={() => {
                setEditing(false);
                fetchProfile();
              }}>
                Cancelar
              </button>
            </div>
          )}
        </form>

        <div className="profile-actions">
          <button className="btn-change-password" onClick={() => window.location.href = '/change-password'}>
            Alterar Senha
          </button>
          <button className="btn-logout" onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}>
            Sair da Conta
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;