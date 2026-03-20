import React, { useState } from 'react';
import api from '../services/api';
import './styles.css';

const AIChat = ({ eventId, eventData, guests, suppliers, checklist }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! Sou sua assistente IA para planejamento de casamentos. Como posso ajudar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Preparar dados do evento para o contexto
      const context = {
        event: eventData,
        guests: guests.filter(g => g.event === eventId),
        suppliers: suppliers.filter(s => s.event === eventId),
        checklist: checklist.filter(c => c.event === eventId)
      };

      const response = await api.post('/chat/', {
        event_id: eventId,
        message: input,
        context: context
      });

      const assistantMessage = { 
        role: 'assistant', 
        content: response.data.reply || 'Desculpe, não consegui processar sua pergunta.' 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro no chat:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, tive um problema ao processar sua mensagem. Tente novamente.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Assistente IA</h3>
        <span className="chat-status">🟢 Online</span>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="chat-message assistant">
            <div className="message-content typing">Digitando...</div>
          </div>
        )}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Pergunte sobre o planejamento..."
          disabled={loading || !eventId}
          className="chat-input"
        />
        <button 
          onClick={sendMessage} 
          disabled={loading || !eventId || !input.trim()}
          className="chat-send-btn"
        >
          {loading ? '...' : 'Enviar'}
        </button>
      </div>
      
      {!eventId && (
        <div className="chat-warning">
          Selecione um evento para usar o chat
        </div>
      )}
    </div>
  );
};

export default AIChat;