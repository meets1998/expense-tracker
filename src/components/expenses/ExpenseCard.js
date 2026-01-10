'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { getCategoryById, getBankById } from '@/constants';
import { formatCurrency, formatDate } from '@/utils';

const Card = styled(motion.div)`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--bg-card-hover);
    border-color: rgba(99, 102, 241, 0.3);
  }
`;

const CategoryIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: ${({ $color }) => `${$color}20`};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
`;

const CategoryName = styled.p`
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Amount = styled.p`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--error);
  flex-shrink: 0;
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: var(--text-muted);
`;

const BankDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const Description = styled.p`
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MenuWrapper = styled.div`
  position: relative;
`;

const MenuButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 140px;
  z-index: 50;
  overflow: hidden;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: transparent;
  color: ${({ $danger }) => $danger ? 'var(--error)' : 'var(--text-primary)'};
  font-size: 0.9rem;
  text-align: left;
  transition: background var(--transition-fast);
  
  &:hover {
    background: ${({ $danger }) => $danger ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-secondary)'};
  }
`;

export default function ExpenseCard({ 
  expense, 
  onEdit, 
  onDelete,
  canEdit = true,
  index = 0 
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  
  const category = getCategoryById(expense.category);
  const bank = getBankById(expense.bank);
  const Icon = category.icon;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = () => {
    setShowMenu(false);
    onEdit?.(expense);
  };

  const handleDelete = () => {
    setShowMenu(false);
    onDelete?.(expense);
  };

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      <CategoryIcon $color={category.color}>
        <Icon size={22} />
      </CategoryIcon>
      
      <Content>
        <TopRow>
          <CategoryName>{category.name}</CategoryName>
          <Amount>-{formatCurrency(expense.amount)}</Amount>
        </TopRow>
        
        <BottomRow>
          <MetaItem>{formatDate(expense.date)}</MetaItem>
          <MetaItem>
            <BankDot $color={bank.color} />
            {bank.name}
          </MetaItem>
        </BottomRow>
        
        {expense.description && (
          <Description>{expense.description}</Description>
        )}
      </Content>
      
      {canEdit && (
        <MenuWrapper ref={menuRef}>
          <MenuButton onClick={() => setShowMenu(!showMenu)}>
            <FiMoreVertical size={18} />
          </MenuButton>
          
          {showMenu && (
            <DropdownMenu
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <MenuItem onClick={handleEdit}>
                <FiEdit2 size={16} />
                Edit
              </MenuItem>
              <MenuItem onClick={handleDelete} $danger>
                <FiTrash2 size={16} />
                Delete
              </MenuItem>
            </DropdownMenu>
          )}
        </MenuWrapper>
      )}
    </Card>
  );
}