import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './styles.css';

const SupplierList = ({ eventId, onEdit, onDelete }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, [eventId]);

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/suppliers/');
      // Filtra por evento se eventId for fornecido
      const filteredSuppliers = eventId 
        ? response.data.filter(s => s.event === eventId)
        : response.data;
      setSuppliers(filteredSuppliers);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'contratado': return 'status-contracted';
      case 'negociacao': return 'status-negotiating';
      case 'cotado': return 'status-quoted';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'contratado': return '✅ Contratado';
      case 'negociacao': return '🤝 Negociação';
      case 'cotado': return '📄 Cotado';
      default: return status;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) return <div className="loading">Carregando fornecedores...</div>;

  return (
    <div className="list-container">
      <div className="list-header">
        <h3>Fornecedores</h3>
        <button onClick={() => onEdit(null)} className="btn-small">
          + Adicionar Fornecedor
        </button>
      </div>
      
      {suppliers.length === 0 ? (
        <p className="empty-message">Nenhum fornecedor cadastrado.</p>
      ) : (
        <div className="supplier-list">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="supplier-card">
              <div className="supplier-header">
                <div>
                  <h4>{supplier.name}</h4>
                  <span className="supplier-category">{supplier.category}</span>
                </div>
                <div className="supplier-actions">
                  <button onClick={() => onEdit(supplier)} className="btn-icon">✏️</button>
                  <button onClick={() => onDelete(supplier.id)} className="btn-icon">🗑️</button>
                </div>
              </div>
              <div className="supplier-details">
                <span className={`status-badge ${getStatusClass(supplier.status)}`}>
                  {getStatusText(supplier.status)}
                </span>
                
                <div className="supplier-info">
                  <p>
                    <strong>Valor:</strong> 
                    <span className="supplier-value">{formatCurrency(supplier.value)}</span>
                  </p>
                  
                  {supplier.contact && (
                    <p>
                      <strong>Contato:</strong> {supplier.contact}
                    </p>
                  )}
                  
                  {supplier.score > 0 && (
                    <p>
                      <strong>Nota:</strong> 
                      <span className="supplier-score">
                        {'★'.repeat(Math.floor(supplier.score))}
                        {'☆'.repeat(5 - Math.floor(supplier.score))}
                        <span className="score-number"> ({supplier.score})</span>
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupplierList;