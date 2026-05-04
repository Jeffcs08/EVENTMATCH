import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './AuthPages.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await api.post('/password_reset/', { email });
      setMessage('Enviamos um link de recuperação para seu email. Verifique sua caixa de entrada.');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.email?.[0] || 'Email não encontrado. Verifique e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>La Vie Casamentos</h1>
          <h2>Recuperar Senha</h2>
        </div>

        {message && <div className="auth-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <p className="info-text">Digite seu email para receber um link de recuperação.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Digite seu email"
              autoComplete="email"
            />
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </button>
        </form>

        <div className="auth-footer">
          <p><Link to="/login" className="back-link">Voltar ao login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
