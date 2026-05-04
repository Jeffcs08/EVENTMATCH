import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import './AuthPages.css';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(true);
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError('Token inválido ou expirado.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await api.post('/password_reset/confirm/', {
        token: token,
        password: password
      });

      setMessage('Senha redefinida com sucesso! Redirecionando...');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      console.error('Erro:', err);
      setError(err.response?.data?.password?.[0] || 'Token inválido ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h1>La Vie Casamentos</h1>
          <h2>Link Inválido</h2>
          <div className="auth-error">
            Este link de recuperação é inválido ou já expirou.
          </div>
          <Link to="/forgot-password">Solicitar novo link</Link><br />
          <Link to="/login">Voltar ao login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>La Vie Casamentos</h1>
        <h2>Redefinir Senha</h2>

        {message && <div className="auth-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nova Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="form-group">
            <label>Confirmar Nova Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Digite a senha novamente"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Redefinindo...' : 'Redefinir Senha'}
          </button>
        </form>

        <Link to="/login">Voltar para o login</Link>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
