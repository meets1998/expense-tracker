'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { getBankById } from '@/constants';
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

const BankList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const BankItem = styled(motion.div)`
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

const BankDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const BankInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const BankName = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
`;

const BankMeta = styled.p`
  font-size: 0.75rem;
  color: var(--text-muted);
`;

const BankAmount = styled.p`
  font-size: 0.95rem;
  font-weight: 600;
  text-align: right;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
`;

export default function BankBreakdown({ expensesByBank, total }) {
  // Safely handle undefined/null data
  const safeData = expensesByBank || {};
  const safeTotal = total || 0;
  
  const banks = Object.entries(safeData)
    .map(([id, data]) => ({
      ...getBankById(id),
      ...data,
    }))
    .sort((a, b) => b.total - a.total);

  if (banks.length === 0) {
    return (
      <BreakdownWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Header>
          <Title>By Payment Method</Title>
        </Header>
        <EmptyState>No expenses yet this month</EmptyState>
      </BreakdownWrapper>
    );
  }

  return (
    <BreakdownWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Header>
        <Title>By Payment Method</Title>
      </Header>
      
      <BankList>
        {banks.map((bank, index) => (
          <BankItem
            key={bank.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <BankDot $color={bank.color} />
            <BankInfo>
              <BankName>{bank.name}</BankName>
              <BankMeta>
                {bank.count} transaction{bank.count !== 1 ? 's' : ''} • {formatPercentage(bank.total, safeTotal)}
              </BankMeta>
            </BankInfo>
            <BankAmount>{formatCurrency(bank.total)}</BankAmount>
          </BankItem>
        ))}
      </BankList>
    </BreakdownWrapper>
  );
}