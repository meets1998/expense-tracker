'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ExpenseContext = createContext(null);
const STORAGE_KEY = 'expensewise_expenses';

// Simple date helpers - no external dependencies
const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getCurrentMonthString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [version, setVersion] = useState(0); // Force re-render trigger

  // Load from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Ensure all amounts are numbers
          const cleaned = parsed.map(exp => ({
            ...exp,
            amount: Number(exp.amount) || 0
          }));
          setExpenses(cleaned);
          console.log('✅ Loaded expenses:', cleaned.length);
        }
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
      console.log('💾 Saved expenses:', expenses.length);
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  }, [expenses, isLoaded]);

  // Add expense
  const addExpense = useCallback((data) => {
    const newExpense = {
      id: uuidv4(),
      amount: Number(data.amount) || 0,
      category: data.category || 'other',
      bank: data.bank || 'cash',
      date: data.date || getTodayString(),
      description: data.description || '',
      createdAt: new Date().toISOString(),
    };

    console.log('➕ Adding expense:', newExpense);
    
    setExpenses(prev => [newExpense, ...prev]);
    setVersion(v => v + 1); // Force update
    
    return newExpense;
  }, []);

  // Update expense
  const updateExpense = useCallback((id, data) => {
    setExpenses(prev => prev.map(exp => {
      if (exp.id !== id) return exp;
      return {
        ...exp,
        ...data,
        amount: Number(data.amount) || exp.amount,
        updatedAt: new Date().toISOString(),
      };
    }));
    setVersion(v => v + 1);
  }, []);

  // Delete expense
  const deleteExpense = useCallback((id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    setVersion(v => v + 1);
  }, []);

  // Get expense by ID
  const getExpenseById = useCallback((id) => {
    return expenses.find(exp => exp.id === id) || null;
  }, [expenses]);

  // Calculate current month expenses
  const currentMonthKey = getCurrentMonthString();
  const todayKey = getTodayString();

  const currentMonthExpenses = expenses.filter(exp => {
    if (!exp.date) return false;
    return exp.date.startsWith(currentMonthKey);
  });

  const todayExpenses = expenses.filter(exp => {
    if (!exp.date) return false;
    return exp.date === todayKey;
  });

  // Calculate totals
  const totalCurrentMonth = currentMonthExpenses.reduce((sum, exp) => {
    return sum + (Number(exp.amount) || 0);
  }, 0);

  const totalToday = todayExpenses.reduce((sum, exp) => {
    return sum + (Number(exp.amount) || 0);
  }, 0);

  // Group by category
  const expensesByCategory = {};
  currentMonthExpenses.forEach(exp => {
    const cat = exp.category || 'other';
    if (!expensesByCategory[cat]) {
      expensesByCategory[cat] = { total: 0, count: 0, expenses: [] };
    }
    expensesByCategory[cat].total += Number(exp.amount) || 0;
    expensesByCategory[cat].count += 1;
    expensesByCategory[cat].expenses.push(exp);
  });

  // Group by bank
  const expensesByBank = {};
  currentMonthExpenses.forEach(exp => {
    const bank = exp.bank || 'other';
    if (!expensesByBank[bank]) {
      expensesByBank[bank] = { total: 0, count: 0, expenses: [] };
    }
    expensesByBank[bank].total += Number(exp.amount) || 0;
    expensesByBank[bank].count += 1;
    expensesByBank[bank].expenses.push(exp);
  });

  // Can edit (current month only)
  const canEditExpense = useCallback((expense) => {
    if (!expense?.date) return false;
    return expense.date.startsWith(currentMonthKey);
  }, [currentMonthKey]);

  // Clear all
  const clearAllExpenses = useCallback(() => {
    setExpenses([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    setVersion(v => v + 1);
  }, []);

  // Debug log
  useEffect(() => {
    console.log('📊 Dashboard Data:', {
      total: expenses.length,
      currentMonth: currentMonthExpenses.length,
      today: todayExpenses.length,
      totalCurrentMonth,
      totalToday,
      currentMonthKey,
      todayKey,
    });
  }, [expenses, currentMonthExpenses.length, todayExpenses.length, totalCurrentMonth, totalToday, currentMonthKey, todayKey]);

  const value = {
    expenses,
    currentMonthExpenses,
    todayExpenses,
    totalCurrentMonth,
    totalToday,
    expensesByCategory,
    expensesByBank,
    isLoaded,
    version,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenseById,
    canEditExpense,
    clearAllExpenses,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within ExpenseProvider');
  }
  return context;
};