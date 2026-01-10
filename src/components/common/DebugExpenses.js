'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useExpenses } from '@/context/ExpenseContext';

const DebugButton = styled.button`
  position: fixed;
  bottom: 100px;
  right: 20px;
  background: #6366f1;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  z-index: 9999;
  
  @media (max-width: 768px) {
    bottom: 90px;
    right: 10px;
  }
`;

const DebugPanel = styled.div`
  position: fixed;
  bottom: 140px;
  right: 20px;
  background: #1a1a24;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 16px;
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 9999;
  font-size: 12px;
  color: #fff;
  
  @media (max-width: 768px) {
    right: 10px;
    left: 10px;
    width: auto;
    bottom: 130px;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #333;
`;

const Label = styled.span`
  color: #888;
`;

const Value = styled.span`
  color: #fff;
  font-weight: bold;
`;

const ExpenseItem = styled.div`
  background: #222;
  padding: 8px;
  margin: 8px 0;
  border-radius: 6px;
  font-size: 11px;
`;

const ActionButton = styled.button`
  background: ${props => props.$danger ? '#ef4444' : '#22c55e'};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  margin-right: 8px;
  margin-top: 8px;
`;

export default function DebugExpenses() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const {
    expenses,
    currentMonthExpenses,
    todayExpenses,
    totalCurrentMonth,
    totalToday,
    clearAllExpenses,
    refreshData,
    isLoaded,
  } = useExpenses();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <DebugButton onClick={() => setIsOpen(!isOpen)}>
        🔧 Debug {isOpen ? '▼' : '▲'}
      </DebugButton>
      
      {isOpen && (
        <DebugPanel>
          <h4 style={{ marginBottom: 12, color: '#6366f1' }}>📊 Expense Debug</h4>
          
          <Row>
            <Label>Today:</Label>
            <Value>{today}</Value>
          </Row>
          
          <Row>
            <Label>Data Loaded:</Label>
            <Value>{isLoaded ? '✅ Yes' : '⏳ No'}</Value>
          </Row>
          
          <Row>
            <Label>Total Expenses:</Label>
            <Value>{expenses.length}</Value>
          </Row>
          
          <Row>
            <Label>This Month Count:</Label>
            <Value>{currentMonthExpenses.length}</Value>
          </Row>
          
          <Row>
            <Label>This Month Total:</Label>
            <Value style={{ color: '#22c55e' }}>₹{totalCurrentMonth.toFixed(2)}</Value>
          </Row>
          
          <Row>
            <Label>Today Count:</Label>
            <Value>{todayExpenses.length}</Value>
          </Row>
          
          <Row>
            <Label>Today Total:</Label>
            <Value style={{ color: '#f59e0b' }}>₹{totalToday.toFixed(2)}</Value>
          </Row>
          
          <h5 style={{ marginTop: 12, marginBottom: 8 }}>Recent Expenses:</h5>
          
          {expenses.slice(0, 3).map((exp, i) => (
            <ExpenseItem key={exp.id || i}>
              <div><strong>ID:</strong> {exp.id?.slice(0, 8)}...</div>
              <div><strong>Amount:</strong> ₹{exp.amount} (type: {typeof exp.amount})</div>
              <div><strong>Date:</strong> {exp.date}</div>
              <div><strong>Category:</strong> {exp.category}</div>
            </ExpenseItem>
          ))}
          
          <div style={{ marginTop: 12 }}>
            <ActionButton onClick={refreshData}>
              🔄 Migrate Data
            </ActionButton>
            <ActionButton 
              $danger 
              onClick={() => {
                if (confirm('Delete ALL expenses?')) {
                  clearAllExpenses();
                }
              }}
            >
              🗑️ Clear All
            </ActionButton>
          </div>
        </DebugPanel>
      )}
    </>
  );
}