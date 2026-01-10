'use client';

import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { getCategoryById } from '@/constants';
import { formatCurrency, formatPercentage } from '@/utils';

const BreakdownWrapper = styled(motion.div)`
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

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CategoryItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
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
`;

const CategoryInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const CategoryName = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const CategoryMeta = styled.p`
  font-size: 0.75rem;
  color: var(--text-muted);
`;

const CategoryAmount = styled.p`
  font-size: 0.95rem;
  font-weight: 600;
  text-align: right;
`;

const ProgressBar = styled.div`
  height: 4px;
  background: var(--bg-secondary);
  border-radius: 2px;
  margin-top: 0.5rem;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${({ $color }) => $color};
  border-radius: 2px;
`;

const ExpandedDetails = styled(motion.div)`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--border-color);
`;

const ExpenseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
`;

export default function CategoryBreakdown({ expensesByCategory, total }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Safely handle undefined/null data
  const safeData = expensesByCategory || {};
  const safeTotal = total || 0;

  const categories = Object.entries(safeData)
    .map(([id, data]) => ({
      ...getCategoryById(id),
      ...data,
    }))
    .sort((a, b) => b.total - a.total);

  if (categories.length === 0) {
    return (
      <BreakdownWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Header>
          <Title>By Category</Title>
        </Header>
        <EmptyState>No expenses yet this month</EmptyState>
      </BreakdownWrapper>
    );
  }

  return (
    <BreakdownWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Header>
        <Title>By Category</Title>
      </Header>
      
      <CategoryList>
        {categories.slice(0, 5).map((category, index) => {
          const Icon = category.icon;
          const percentage = safeTotal > 0 ? (category.total / safeTotal) * 100 : 0;
          const isExpanded = expandedCategory === category.id;

          return (
            <CategoryItem 
              key={category.id}
              onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <CategoryIcon $color={category.color}>
                <Icon size={18} />
              </CategoryIcon>
              
              <CategoryInfo>
                <CategoryName>{category.name}</CategoryName>
                <CategoryMeta>
                  {category.count} expense{category.count !== 1 ? 's' : ''} • {formatPercentage(category.total, safeTotal)}
                </CategoryMeta>
                <ProgressBar>
                  <ProgressFill
                    $color={category.color}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                  />
                </ProgressBar>
                
                <AnimatePresence>
                  {isExpanded && category.expenses && (
                    <ExpandedDetails
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {category.expenses.slice(0, 3).map((exp) => (
                        <ExpenseItem key={exp.id}>
                          <span>{exp.description || 'No description'}</span>
                          <span>{formatCurrency(exp.amount)}</span>
                        </ExpenseItem>
                      ))}
                    </ExpandedDetails>
                  )}
                </AnimatePresence>
              </CategoryInfo>
              
              <CategoryAmount>{formatCurrency(category.total)}</CategoryAmount>
            </CategoryItem>
          );
        })}
      </CategoryList>
    </BreakdownWrapper>
  );
}