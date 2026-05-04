import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './AuthPages.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Tentando login com:', username);
      
      const response = await api.post('/auth/login/', {
        username,
        password
      });

      console.log('Resposta do login:', response.data);

      const { access, refresh, user } = response.data;
      
      if (!access) {
        throw new Error('Token não recebido');
      }
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('username', user.username);
      
      login(user, { access, refresh });
      
      console.log('Login realizado! Redirecionando...');
      
      if (user.username === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      
    } catch (err) {
      console.error('Erro no login:', err);
      console.error('Resposta do erro:', err.response?.data);
      
      if (err.response?.status === 401) {
        setError('Usuário ou senha incorretos');
      } else if (err.response?.status === 400) {
        setError('Preencha todos os campos');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Erro de conexão. Verifique se o servidor está rodando.');
      } else {
        setError(err.response?.data?.error || 'Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>La Vie Casamentos</h1>
          <h2>Entre na sua conta</h2>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Digite seu usuário"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Digite sua senha"
              autoComplete="current-password"
            />
          </div>

          {/* Link Esqueceu a senha - ADICIONADO AQUI */}
          <div className="auth-links">
            <Link to="/forgot-password" className="forgot-link">
              Esqueceu sua senha?
            </Link>
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Não tem uma conta? <Link to="/register">Cadastre-se</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;