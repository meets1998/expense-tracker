'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiCalendar, FiTrendingUp, FiClock, FiPlus } from 'react-icons/fi';
import { 
  StatsCard, 
  CategoryBreakdown, 
  BankBreakdown, 
  RecentExpenses,
  CategoryStats,
} from '@/components/dashboard';
import { useAuth } from '@/context/AuthContext';
import { useExpenses } from '@/context/ExpenseContext';

const Container = styled.div`
  padding: 1.5rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const HeaderContent = styled.div``;

const Title = styled(motion.h1)`
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled(motion.p)`
  color: var(--text-secondary);
`;

const AddButton = styled(Link)`
  display: none;
  
  @media (min-width: 768px) {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: var(--accent-gradient);
    color: white;
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
    transition: all var(--transition-fast);
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const BreakdownGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const EmptyState = styled(motion.div)`
  background: var(--bg-card);
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-xl);
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
`;

const EmptyButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--accent-gradient);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-fast);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: var(--text-secondary);
`;

const formatMoney = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const formatMonth = () => {
  return new Date().toLocaleDateString('en-IN', { 
    month: 'long', 
    year: 'numeric' 
  });
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const { 
    currentMonthExpenses,
    totalCurrentMonth,
    totalToday,
    expensesByCategory,
    expensesByBank,
    isLoaded,
  } = useExpenses();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return (
      <Container>
        <LoadingContainer>Loading dashboard...</LoadingContainer>
      </Container>
    );
  }

  const hasExpenses = currentMonthExpenses.length > 0;

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            Dashboard
          </Title>
          <Subtitle
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {formatMonth()} • Welcome{user?.name ? `, ${user.name}` : ''}!
          </Subtitle>
        </HeaderContent>
        
        <AddButton href="/expenses/add">
          <FiPlus size={18} />
          Add Expense
        </AddButton>
      </Header>
      
      {/* Stats Cards */}
      <StatsGrid>
        <StatsCard
          icon={FiCalendar}
          label="This Month"
          value={formatMoney(totalCurrentMonth)}
          color="#6366f1"
          gradient
          delay={0}
        />
        <StatsCard
          icon={FiClock}
          label="Today's Spending"
          value={formatMoney(totalToday)}
          color="#f59e0b"
          delay={0.1}
        />
        <StatsCard
          icon={FiTrendingUp}
          label="Transactions"
          value={String(currentMonthExpenses.length)}
          color="#22c55e"
          delay={0.2}
        />
      </StatsGrid>

      {/* Content */}
      {!hasExpenses ? (
        <EmptyState
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <EmptyIcon>📊</EmptyIcon>
          <EmptyTitle>No expenses this month</EmptyTitle>
          <EmptyText>
            Start tracking your expenses to see insights here.
          </EmptyText>
          <EmptyButton href="/expenses/add">
            <FiPlus size={18} />
            Add Your First Expense
          </EmptyButton>
        </EmptyState>
      ) : (
        <>
          {/* Horizontal Category Stats */}
          <CategoryStats 
            expensesByCategory={expensesByCategory} 
            total={totalCurrentMonth}
          />

          {/* Category & Bank Breakdown */}
          <BreakdownGrid>
            <CategoryBreakdown 
              expensesByCategory={expensesByCategory} 
              total={totalCurrentMonth}
            />
            <BankBreakdown 
              expensesByBank={expensesByBank} 
              total={totalCurrentMonth}
            />
          </BreakdownGrid>
          
          {/* Recent Expenses */}
          <RecentExpenses expenses={currentMonthExpenses} />
        </>
      )}
    </Container>
  );
}