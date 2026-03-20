import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import './styles.css';

const StatsCharts = ({ eventId }) => {
  const [guestData, setGuestData] = useState([]);
  const [supplierData, setSupplierData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [budgetData, setBudgetData] = useState({ spent: 0, total: 0 });

  useEffect(() => {
    if (eventId) {
      fetchData();
    }
  }, [eventId]);

  const fetchData = async () => {
    try {
      // Buscar convidados
      const guests = await api.get('/guests/');
      const eventGuests = guests.data.filter(g => g.event === eventId);
      
      const guestStatus = {
        confirmado: eventGuests.filter(g => g.status === 'confirmado').length,
        pendente: eventGuests.filter(g => g.status === 'pendente').length,
        recusado: eventGuests.filter(g => g.status === 'recusado').length
      };
      
      setGuestData([
        { name: 'Confirmados', value: guestStatus.confirmado, color: '#10b981' },
        { name: 'Pendentes', value: guestStatus.pendente, color: '#f59e0b' },
        { name: 'Recusados', value: guestStatus.recusado, color: '#ef4444' }
      ]);

      // Buscar fornecedores
      const suppliers = await api.get('/suppliers/');
      const eventSuppliers = suppliers.data.filter(s => s.event === eventId);
      
      const supplierStatus = {
        contratado: eventSuppliers.filter(s => s.status === 'contratado').length,
        negociacao: eventSuppliers.filter(s => s.status === 'negociacao').length,
        cotado: eventSuppliers.filter(s => s.status === 'cotado').length
      };
      
      setSupplierData([
        { name: 'Contratados', value: supplierStatus.contratado, color: '#10b981' },
        { name: 'Negociação', value: supplierStatus.negociacao, color: '#f59e0b' },
        { name: 'Cotados', value: supplierStatus.cotado, color: '#6b7280' }
      ]);

      // Buscar tarefas
      const tasks = await api.get('/checklist/');
      const eventTasks = tasks.data.filter(t => t.event === eventId);
      
      setTaskData([
        { name: 'Concluídas', value: eventTasks.filter(t => t.done).length, color: '#10b981' },
        { name: 'Pendentes', value: eventTasks.filter(t => !t.done).length, color: '#f59e0b' }
      ]);

      // Buscar orçamento
      const events = await api.get('/events/');
      const event = events.data.find(e => e.id === eventId);
      
      if (event) {
        const totalSpent = eventSuppliers.reduce((acc, s) => acc + Number(s.value), 0);
        setBudgetData({
          spent: totalSpent,
          total: Number(event.budget_total)
        });
      }

    } catch (error) {
      console.error('Erro ao buscar dados para gráficos:', error);
    }
  };

  if (!eventId) {
    return <div className="chart-placeholder">Selecione um evento para ver os gráficos</div>;
  }

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <h3>Status dos Convidados</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={guestData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {guestData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="chart-legend">
          {guestData.map((item, index) => (
            <div key={index} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: item.color }}></span>
              <span>{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-card">
        <h3>Status dos Fornecedores</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={supplierData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {supplierData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="chart-legend">
          {supplierData.map((item, index) => (
            <div key={index} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: item.color }}></span>
              <span>{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-card">
        <h3>Progresso do Checklist</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={taskData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
              {taskData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Orçamento</h3>
        <div className="budget-display">
          <div className="budget-item">
            <span className="budget-label">Total:</span>
            <span className="budget-value">R$ {budgetData.total.toLocaleString('pt-BR')}</span>
          </div>
          <div className="budget-item">
            <span className="budget-label">Gasto:</span>
            <span className="budget-value spent">R$ {budgetData.spent.toLocaleString('pt-BR')}</span>
          </div>
          <div className="budget-item">
            <span className="budget-label">Restante:</span>
            <span className="budget-value remaining">
              R$ {(budgetData.total - budgetData.spent).toLocaleString('pt-BR')}
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(budgetData.spent / budgetData.total) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCharts;