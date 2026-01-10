'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiCalendar } from 'react-icons/fi';
import { Button, Input, Select } from '@/components/common';
import { CATEGORIES, BANKS } from '@/constants';
import { getToday } from '@/utils';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const FormSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  
  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

/* Amount Input Styles */
const AmountWrapper = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  
  span {
    color: var(--error);
  }
`;

const AmountInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const CurrencySymbol = styled.span`
  position: absolute;
  left: 1.25rem;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-muted);
  z-index: 1;
`;

const StyledAmountInput = styled.input`
  width: 100%;
  padding: 1.5rem 1rem 1.5rem 3.5rem;
  background: var(--bg-secondary);
  border: 2px solid ${({ $error }) => $error ? 'var(--error)' : 'var(--border-color)'};
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  transition: all var(--transition-fast);
  
  &::placeholder {
    color: var(--text-muted);
    font-weight: 400;
  }
  
  &:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
    outline: none;
  }
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  &[type=number] {
    -moz-appearance: textfield;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
    padding: 1.25rem 1rem 1.25rem 3rem;
  }
`;

const ErrorText = styled.p`
  color: var(--error);
  font-size: 0.8rem;
  margin-top: 0.5rem;
  text-align: center;
`;

/* Category Grid Styles */
const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.625rem;
  
  @media (max-width: 560px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (max-width: 400px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
`;

const CategoryButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.75rem 0.25rem;
  min-height: 80px;
  background: ${({ $selected, $color }) => 
    $selected ? `${$color}20` : 'var(--bg-secondary)'};
  border: 2px solid ${({ $selected, $color }) => 
    $selected ? $color : 'transparent'};
  border-radius: var(--radius-md);
  color: ${({ $selected }) => 
    $selected ? 'var(--text-primary)' : 'var(--text-secondary)'};
  transition: all var(--transition-fast);
  cursor: pointer;
  
  &:hover {
    background: ${({ $color }) => `${$color}15`};
    border-color: ${({ $color }) => `${$color}50`};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 400px) {
    min-height: 70px;
    padding: 0.5rem 0.25rem;
  }
`;

const CategoryIconWrapper = styled.span`
  font-size: 1.25rem;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 400px) {
    font-size: 1.125rem;
  }
`;

const CategoryLabel = styled.span`
  font-size: 0.65rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 0.125rem;
  
  @media (max-width: 400px) {
    font-size: 0.6rem;
  }
`;

/* Date Input Styles */
const DateInputWrapper = styled.div`
  width: 100%;
`;

const DateInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid ${({ $error }) => $error ? 'var(--error)' : 'var(--border-color)'};
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all var(--transition-fast);
  
  &:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    outline: none;
  }
  
  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
    opacity: 0.7;
    
    &:hover {
      opacity: 1;
    }
  }
`;

/* Description Input Styles */
const DescriptionWrapper = styled.div`
  width: 100%;
`;

const DescriptionInput = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  max-height: 150px;
  transition: all var(--transition-fast);
  
  &::placeholder {
    color: var(--text-muted);
  }
  
  &:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    outline: none;
  }
`;

const CharCount = styled.span`
  display: block;
  text-align: right;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
`;

/* Button Group */
const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  
  @media (max-width: 400px) {
    flex-direction: column-reverse;
  }
`;

export default function ExpenseForm({ 
  initialData = null, 
  onSubmit, 
  onCancel,
  loading = false 
}) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    bank: '',
    date: getToday(),
    description: '',
  });
  const [errors, setErrors] = useState({});

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount?.toString() || '',
        category: initialData.category || '',
        bank: initialData.bank || '',
        date: initialData.date || getToday(),
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow numbers and single decimal point with up to 2 decimal places
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setFormData(prev => ({ ...prev, amount: value }));
      if (errors.amount) {
        setErrors(prev => ({ ...prev, amount: '' }));
      }
    }
  };

  const handleCategorySelect = (categoryId) => {
    setFormData(prev => ({ ...prev, category: categoryId }));
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: '' }));
    }
  };

  const handleBankChange = (bankId) => {
    setFormData(prev => ({ ...prev, bank: bankId }));
    if (errors.bank) {
      setErrors(prev => ({ ...prev, bank: '' }));
    }
  };

  const handleDateChange = (e) => {
    setFormData(prev => ({ ...prev, date: e.target.value }));
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: '' }));
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 150) {
      setFormData(prev => ({ ...prev, description: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate amount
    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    } else if (amount > 10000000) {
      newErrors.amount = 'Amount seems too large. Please verify.';
    }
    
    // Validate category
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    // Validate bank/payment method
    if (!formData.bank) {
      newErrors.bank = 'Please select a payment method';
    }
    
    // Validate date
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (selectedDate > today) {
        newErrors.date = 'Date cannot be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const expenseData = {
      amount: parseFloat(formData.amount),
      category: formData.category,
      bank: formData.bank,
      date: formData.date, // Should be in YYYY-MM-DD format
      description: formData.description.trim(),
    };
    
    console.log('📤 Submitting expense:', expenseData);
    
    onSubmit(expenseData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Amount Section */}
      <FormSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SectionTitle>Amount</SectionTitle>
        <AmountWrapper>
          <AmountInputContainer>
            <CurrencySymbol>₹</CurrencySymbol>
            <StyledAmountInput
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={formData.amount}
              onChange={handleAmountChange}
              $error={!!errors.amount}
              autoFocus
              disabled={loading}
            />
          </AmountInputContainer>
          {errors.amount && <ErrorText>{errors.amount}</ErrorText>}
        </AmountWrapper>
      </FormSection>

      {/* Category Section */}
      <FormSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <SectionTitle>Category</SectionTitle>
        <CategoryGrid>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <CategoryButton
                key={cat.id}
                type="button"
                $selected={formData.category === cat.id}
                $color={cat.color}
                onClick={() => handleCategorySelect(cat.id)}
                disabled={loading}
              >
                <CategoryIconWrapper $color={cat.color}>
                  <Icon size={20} />
                </CategoryIconWrapper>
                <CategoryLabel>{cat.name.split(' ')[0]}</CategoryLabel>
              </CategoryButton>
            );
          })}
        </CategoryGrid>
        {errors.category && <ErrorText>{errors.category}</ErrorText>}
      </FormSection>

      {/* Payment & Date Section */}
      <FormSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <SectionTitle>Details</SectionTitle>
        <Row>
          <Select
            label="Payment Method"
            options={BANKS}
            value={formData.bank}
            onChange={handleBankChange}
            placeholder="Select bank/wallet"
            error={errors.bank}
            required
            disabled={loading}
          />
          
          <DateInputWrapper>
            <Label>
              Date <span>*</span>
            </Label>
            <DateInput
              type="date"
              value={formData.date}
              onChange={handleDateChange}
              max={getToday()}
              $error={!!errors.date}
              disabled={loading}
            />
            {errors.date && <ErrorText style={{ textAlign: 'left' }}>{errors.date}</ErrorText>}
          </DateInputWrapper>
        </Row>
        
        <DescriptionWrapper>
          <Label>Description (Optional)</Label>
          <DescriptionInput
            placeholder="What was this expense for? e.g., Lunch at cafe, Uber to office..."
            value={formData.description}
            onChange={handleDescriptionChange}
            disabled={loading}
          />
          <CharCount>{formData.description.length}/150</CharCount>
        </DescriptionWrapper>
      </FormSection>

      {/* Submit Buttons */}
      <ButtonGroup>
        {onCancel && (
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onCancel}
            fullWidth
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          fullWidth 
          loading={loading}
        >
          {initialData ? 'Update Expense' : 'Add Expense'}
        </Button>
      </ButtonGroup>
    </Form>
  );
}