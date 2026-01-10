'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { ExpenseForm } from '@/components/expenses';
import { useExpenses } from '@/context/ExpenseContext';
import { useToastContext } from '@/context/ToastContext';

const Container = styled.div`
  padding: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--text-primary);
  }
`;

const Header = styled(motion.div)`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  margin-bottom: 0.25rem;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const FormCard = styled(motion.div)`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  
  @media (min-width: 480px) {
    padding: 2rem;
  }
`;

const SuccessMessage = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.1);
  color: var(--success);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const SuccessTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const SuccessText = styled.p`
  color: var(--text-secondary);
`;

export default function AddExpensePage() {
  const router = useRouter();
  const { addExpense } = useExpenses();
  const { success } = useToastContext();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (data) => {
    setLoading(true);
    
    // Add expense
    const newExpense = addExpense(data);
    
    // Show success state briefly
    setShowSuccess(true);
    success('Expense added successfully!');
    
    // Redirect after animation
    setTimeout(() => {
      router.push('/expenses');
    }, 1500);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Container>
      <BackLink href="/expenses">
        <FiArrowLeft size={16} /> Back to Expenses
      </BackLink>
      
      <Header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Title>Add Expense</Title>
        <Subtitle>Record a new expense</Subtitle>
      </Header>
      
      <FormCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {showSuccess ? (
          <SuccessMessage
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <SuccessIcon>
              <FiCheckCircle size={40} />
            </SuccessIcon>
            <SuccessTitle>Expense Added!</SuccessTitle>
            <SuccessText>Redirecting to expenses...</SuccessText>
          </SuccessMessage>
        ) : (
          <ExpenseForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        )}
      </FormCard>
    </Container>
  );
}