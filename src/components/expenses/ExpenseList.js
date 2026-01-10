'use client';

import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ExpenseCard from './ExpenseCard';
import { formatDate, formatCurrency } from '@/utils';
import { parseISO, format } from 'date-fns';

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DateGroup = styled.div`
  margin-bottom: 0.5rem;
`;

const DateHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
`;

const DateLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
`;

const DateTotal = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--error);
`;

const ExpensesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  font-size: 0.9rem;
`;

export default function ExpenseList({ 
  expenses, 
  onEdit, 
  onDelete,
  canEdit,
  groupByDate = true 
}) {
  if (expenses.length === 0) {
    return (
      <EmptyState
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <EmptyIcon>📝</EmptyIcon>
        <EmptyTitle>No expenses found</EmptyTitle>
        <EmptyText>Start tracking your expenses by adding one!</EmptyText>
      </EmptyState>
    );
  }

  if (!groupByDate) {
    return (
      <ListWrapper>
        <AnimatePresence mode="popLayout">
          {expenses.map((expense, index) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={onEdit}
              onDelete={onDelete}
              canEdit={canEdit?.(expense) ?? true}
              index={index}
            />
          ))}
        </AnimatePresence>
      </ListWrapper>
    );
  }

  // Group expenses by date
  const groupedExpenses = expenses.reduce((groups, expense) => {
    const date = expense.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {});

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => 
    new Date(b) - new Date(a)
  );

  return (
    <ListWrapper>
      {sortedDates.map((date, groupIndex) => {
        const dateExpenses = groupedExpenses[date];
        const dateTotal = dateExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        
        return (
          <DateGroup key={date}>
            <DateHeader>
              <DateLabel>{formatDate(date, 'EEEE, dd MMM')}</DateLabel>
              <DateTotal>-{formatCurrency(dateTotal)}</DateTotal>
            </DateHeader>
            
            <ExpensesList>
              <AnimatePresence mode="popLayout">
                {dateExpenses.map((expense, index) => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    canEdit={canEdit?.(expense) ?? true}
                    index={groupIndex * 10 + index}
                  />
                ))}
              </AnimatePresence>
            </ExpensesList>
          </DateGroup>
        );
      })}
    </ListWrapper>
  );
}