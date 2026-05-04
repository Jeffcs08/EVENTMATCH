import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

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
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 20, textAlign: 'center' }}>
      <h1>La Vie Casamentos</h1>
      <h2>Recuperar Senha</h2>
      {message && <div style={{ color: 'green' }}>{message}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <p>Digite seu email para receber um link de recuperação.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: 10, margin: '10px 0' }}
        />
        <button type="submit" disabled={loading} style={{ padding: 10, width: '100%' }}>
          {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
        </button>
      </form>
      <Link to="/login">Voltar ao login</Link>
    </div>
  );
};

export default ForgotPasswordPage;
