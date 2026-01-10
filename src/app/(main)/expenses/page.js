'use client';

import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { ExpenseList, ExpenseFilters } from '@/components/expenses';
import { Modal, Button, Loader } from '@/components/common';
import { useExpenses } from '@/context/ExpenseContext';
import { useToastContext } from '@/context/ToastContext';
import { formatCurrency } from '@/utils';

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
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const HeaderContent = styled.div``;

const Title = styled(motion.h1)`
  font-size: 1.75rem;
  margin-bottom: 0.25rem;
`;

const Subtitle = styled(motion.p)`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const TotalBadge = styled.span`
  color: var(--accent-primary);
  font-weight: 600;
`;

const AddButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--accent-gradient);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.9rem;
  transition: all var(--transition-fast);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  }
`;

const ModalContent = styled.div`
  text-align: center;
  padding: 1rem 0;
`;

const ModalIcon = styled.div`
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

const ModalTitle = styled.h3`
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
`;

const ModalText = styled.p`
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
`;

const SummaryBar = styled(motion.div)`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SummaryItem = styled.div`
  text-align: center;
  
  @media (min-width: 480px) {
    text-align: left;
  }
`;

const SummaryLabel = styled.p`
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SummaryValue = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ $highlight }) => $highlight ? 'var(--accent-primary)' : 'var(--text-primary)'};
`;

export default function ExpensesPage() {
  const router = useRouter();
  const { 
    currentMonthExpenses, 
    totalCurrentMonth,
    todayExpenses,
    totalToday,
    deleteExpense,
    canEditExpense,
    isLoaded
  } = useExpenses();
  const { success } = useToastContext();
  
  const [filters, setFilters] = useState({ categories: [], banks: [] });
  const [sortBy, setSortBy] = useState('date');
  const [deleteModal, setDeleteModal] = useState({ open: false, expense: null });

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    let result = [...currentMonthExpenses];
    
    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter(exp => filters.categories.includes(exp.category));
    }
    
    // Apply bank filter
    if (filters.banks.length > 0) {
      result = result.filter(exp => filters.banks.includes(exp.bank));
    }
    
    // Apply sorting
    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'amount') {
      result.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    }
    
    return result;
  }, [currentMonthExpenses, filters, sortBy]);

  const handleEdit = (expense) => {
    router.push(`/expenses/edit/${expense.id}`);
  };

  const handleDeleteClick = (expense) => {
    setDeleteModal({ open: true, expense });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.expense) {
      deleteExpense(deleteModal.expense.id);
      success('Expense deleted successfully');
    }
    setDeleteModal({ open: false, expense: null });
  };

  if (!isLoaded) {
    return (
      <Container>
        <Loader text="Loading expenses..." />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            Expenses
          </Title>
          <Subtitle
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Manage your monthly expenses
          </Subtitle>
        </HeaderContent>
        
        <AddButton href="/expenses/add">
          <FiPlus size={18} />
          Add Expense
        </AddButton>
      </Header>

      <SummaryBar
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <SummaryItem>
          <SummaryLabel>This Month</SummaryLabel>
          <SummaryValue $highlight>{formatCurrency(totalCurrentMonth)}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Today</SummaryLabel>
          <SummaryValue>{formatCurrency(totalToday)}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Transactions</SummaryLabel>
          <SummaryValue>{currentMonthExpenses.length}</SummaryValue>
        </SummaryItem>
      </SummaryBar>

      <ExpenseFilters
        filters={filters}
        onFilterChange={setFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <ExpenseList
        expenses={filteredExpenses}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        canEdit={canEditExpense}
      />

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, expense: null })}
        maxWidth="380px"
      >
        <ModalContent>
          <ModalIcon>
            <FiTrash2 size={28} />
          </ModalIcon>
          <ModalTitle>Delete Expense?</ModalTitle>
          <ModalText>
            This action cannot be undone. The expense will be permanently removed.
          </ModalText>
          <ModalButtons>
            <Button 
              variant="secondary" 
              onClick={() => setDeleteModal({ open: false, expense: null })}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </ModalButtons>
        </ModalContent>
      </Modal>
    </Container>
  );
}