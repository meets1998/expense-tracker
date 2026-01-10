'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getCategoryById, getBankById } from '@/constants';
import { formatCurrency, formatDateShort } from '@/utils';
import { FiArrowRight } from 'react-icons/fi';

const Wrapper = styled(motion.div)`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
`;

const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--accent-primary);
  
  &:hover {
    text-decoration: underline;
  }
`;

const ExpenseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ExpenseItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--bg-card-hover);
  }
`;

const CategoryIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: ${({ $color }) => `${$color}20`};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ExpenseInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ExpenseCategory = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.125rem;
`;

const ExpenseMeta = styled.p`
  font-size: 0.75rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BankDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const ExpenseAmount = styled.p`
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--error);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
`;

export default function RecentExpenses({ expenses }) {
  // Safely handle undefined/null data
  const safeExpenses = expenses || [];
  const recentExpenses = safeExpenses.slice(0, 5);

  if (recentExpenses.length === 0) {
    return (
      <Wrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Header>
          <Title>Recent Expenses</Title>
        </Header>
        <EmptyState>No expenses recorded yet</EmptyState>
      </Wrapper>
    );
  }

  return (
    <Wrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Header>
        <Title>Recent Expenses</Title>
        <ViewAllLink href="/expenses">
          View all <FiArrowRight size={14} />
        </ViewAllLink>
      </Header>
      
      <ExpenseList>
        {recentExpenses.map((expense, index) => {
          const category = getCategoryById(expense.category);
          const bank = getBankById(expense.bank);
          const Icon = category.icon;

          return (
            <ExpenseItem
              key={expense.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <CategoryIcon $color={category.color}>
                <Icon size={18} />
              </CategoryIcon>
              <ExpenseInfo>
                <ExpenseCategory>{category.name}</ExpenseCategory>
                <ExpenseMeta>
                  {formatDateShort(expense.date)}
                  <span>•</span>
                  <BankDot $color={bank.color} />
                  {bank.name}
                </ExpenseMeta>
              </ExpenseInfo>
              <ExpenseAmount>-{formatCurrency(expense.amount)}</ExpenseAmount>
            </ExpenseItem>
          );
        })}
      </ExpenseList>
    </Wrapper>
  );
}