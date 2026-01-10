'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { ExpenseForm } from '@/components/expenses';
import { Loader } from '@/components/common';
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

const ErrorCard = styled(motion.div)`
  background: var(--bg-card);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  text-align: center;
`;

const ErrorIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  color: var(--error);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
`;

const ErrorTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const ErrorText = styled.p`
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--accent-gradient);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all var(--transition-fast);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
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

export default function EditExpensePage({ params }) {
  const router = useRouter();
  const { getExpenseById, updateExpense, canEditExpense } = useExpenses();
  const { success } = useToastContext();
  
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Small delay to ensure context is ready
    const timer = setTimeout(() => {
      const foundExpense = getExpenseById(params.id);
      
      if (!foundExpense) {
        setError('not_found');
      } else if (!canEditExpense(foundExpense)) {
        setError('not_editable');
      } else {
        setExpense(foundExpense);
      }
      
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [params.id, getExpenseById, canEditExpense]);

  const handleSubmit = (data) => {
    setSubmitting(true);
    
    // Update expense
    updateExpense(params.id, data);
    
    // Show success state
    setShowSuccess(true);
    success('Expense updated successfully!');
    
    // Redirect after animation
    setTimeout(() => {
      router.push('/expenses');
    }, 1500);
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <Container>
        <Loader text="Loading expense..." />
      </Container>
    );
  }

  if (error === 'not_found') {
    return (
      <Container>
        <BackLink href="/expenses">
          <FiArrowLeft size={16} /> Back to Expenses
        </BackLink>
        
        <ErrorCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ErrorIcon>
            <FiAlertCircle size={28} />
          </ErrorIcon>
          <ErrorTitle>Expense Not Found</ErrorTitle>
          <ErrorText>
            The expense you&apos;re looking for doesn&apos;t exist or has been deleted.
          </ErrorText>
          <BackButton href="/expenses">
            <FiArrowLeft size={16} /> Go to Expenses
          </BackButton>
        </ErrorCard>
      </Container>
    );
  }

  if (error === 'not_editable') {
    return (
      <Container>
        <BackLink href="/expenses">
          <FiArrowLeft size={16} /> Back to Expenses
        </BackLink>
        
        <ErrorCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ErrorIcon>
            <FiAlertCircle size={28} />
          </ErrorIcon>
          <ErrorTitle>Cannot Edit Expense</ErrorTitle>
          <ErrorText>
            Expenses from previous months cannot be edited.<br />
            You can only edit expenses from the current month.
          </ErrorText>
          <BackButton href="/expenses">
            <FiArrowLeft size={16} /> Go to Expenses
          </BackButton>
        </ErrorCard>
      </Container>
    );
  }

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
        <Title>Edit Expense</Title>
        <Subtitle>Update expense details</Subtitle>
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
            <SuccessTitle>Expense Updated!</SuccessTitle>
            <SuccessText>Redirecting to expenses...</SuccessText>
          </SuccessMessage>
        ) : (
          <ExpenseForm
            initialData={expense}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={submitting}
          />
        )}
      </FormCard>
    </Container>
  );
}