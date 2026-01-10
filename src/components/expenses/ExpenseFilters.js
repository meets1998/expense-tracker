'use client';

import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import { CATEGORIES, BANKS } from '@/constants';

const FiltersWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: ${({ $active }) => $active ? 'var(--accent-primary)' : 'var(--bg-card)'};
  border: 1px solid ${({ $active }) => $active ? 'var(--accent-primary)' : 'var(--border-color)'};
  border-radius: var(--radius-md);
  color: ${({ $active }) => $active ? 'white' : 'var(--text-secondary)'};
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  
  &:hover {
    background: ${({ $active }) => $active ? 'var(--accent-primary)' : 'var(--bg-card-hover)'};
    border-color: var(--accent-primary);
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

const Dropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 200px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 50;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: ${({ $selected }) => $selected ? 'rgba(99, 102, 241, 0.1)' : 'transparent'};
  color: ${({ $selected }) => $selected ? 'var(--accent-primary)' : 'var(--text-primary)'};
  font-size: 0.9rem;
  text-align: left;
  transition: background var(--transition-fast);
  
  &:hover {
    background: var(--bg-secondary);
  }
`;

const ColorDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const ActiveFilters = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const ActiveFilterTag = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: rgba(99, 102, 241, 0.15);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  color: var(--accent-primary);
`;

const RemoveButton = styled.button`
  display: flex;
  background: none;
  color: inherit;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

const ClearAllButton = styled.button`
  font-size: 0.8rem;
  color: var(--text-muted);
  background: none;
  
  &:hover {
    color: var(--error);
  }
`;

const SortWrapper = styled.div`
  margin-left: auto;
`;

export default function ExpenseFilters({ 
  filters, 
  onFilterChange,
  sortBy,
  onSortChange 
}) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleCategorySelect = (categoryId) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(c => c !== categoryId)
      : [...filters.categories, categoryId];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleBankSelect = (bankId) => {
    const newBanks = filters.banks.includes(bankId)
      ? filters.banks.filter(b => b !== bankId)
      : [...filters.banks, bankId];
    onFilterChange({ ...filters, banks: newBanks });
  };

  const removeFilter = (type, value) => {
    if (type === 'category') {
      onFilterChange({ 
        ...filters, 
        categories: filters.categories.filter(c => c !== value) 
      });
    } else if (type === 'bank') {
      onFilterChange({ 
        ...filters, 
        banks: filters.banks.filter(b => b !== value) 
      });
    }
  };

  const clearAllFilters = () => {
    onFilterChange({ categories: [], banks: [] });
  };

  const hasActiveFilters = filters.categories.length > 0 || filters.banks.length > 0;

  const getCategoryName = (id) => CATEGORIES.find(c => c.id === id)?.name || id;
  const getBankName = (id) => BANKS.find(b => b.id === id)?.name || id;

  return (
    <FiltersWrapper>
      <FilterBar>
        <DropdownWrapper>
          <FilterButton 
            onClick={() => toggleDropdown('category')}
            $active={filters.categories.length > 0}
          >
            <FiFilter size={16} />
            Category
            {filters.categories.length > 0 && ` (${filters.categories.length})`}
            <FiChevronDown size={14} />
          </FilterButton>
          
          <AnimatePresence>
            {openDropdown === 'category' && (
              <Dropdown
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {CATEGORIES.map((cat) => (
                  <DropdownItem
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    $selected={filters.categories.includes(cat.id)}
                  >
                    <ColorDot $color={cat.color} />
                    {cat.name}
                  </DropdownItem>
                ))}
              </Dropdown>
            )}
          </AnimatePresence>
        </DropdownWrapper>

        <DropdownWrapper>
          <FilterButton 
            onClick={() => toggleDropdown('bank')}
            $active={filters.banks.length > 0}
          >
            <FiFilter size={16} />
            Payment
            {filters.banks.length > 0 && ` (${filters.banks.length})`}
            <FiChevronDown size={14} />
          </FilterButton>
          
          <AnimatePresence>
            {openDropdown === 'bank' && (
              <Dropdown
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {BANKS.map((bank) => (
                  <DropdownItem
                    key={bank.id}
                    onClick={() => handleBankSelect(bank.id)}
                    $selected={filters.banks.includes(bank.id)}
                  >
                    <ColorDot $color={bank.color} />
                    {bank.name}
                  </DropdownItem>
                ))}
              </Dropdown>
            )}
          </AnimatePresence>
        </DropdownWrapper>

        <SortWrapper>
          <DropdownWrapper>
            <FilterButton onClick={() => toggleDropdown('sort')}>
              Sort: {sortBy === 'date' ? 'Latest' : 'Amount'}
              <FiChevronDown size={14} />
            </FilterButton>
            
            <AnimatePresence>
              {openDropdown === 'sort' && (
                <Dropdown
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ right: 0, left: 'auto' }}
                >
                  <DropdownItem
                    onClick={() => { onSortChange('date'); setOpenDropdown(null); }}
                    $selected={sortBy === 'date'}
                  >
                    Latest First
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => { onSortChange('amount'); setOpenDropdown(null); }}
                    $selected={sortBy === 'amount'}
                  >
                    Highest Amount
                  </DropdownItem>
                </Dropdown>
              )}
            </AnimatePresence>
          </DropdownWrapper>
        </SortWrapper>
      </FilterBar>

      <AnimatePresence>
        {hasActiveFilters && (
          <ActiveFilters>
            {filters.categories.map((catId) => (
              <ActiveFilterTag
                key={catId}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {getCategoryName(catId)}
                <RemoveButton onClick={() => removeFilter('category', catId)}>
                  <FiX size={12} />
                </RemoveButton>
              </ActiveFilterTag>
            ))}
            {filters.banks.map((bankId) => (
              <ActiveFilterTag
                key={bankId}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {getBankName(bankId)}
                <RemoveButton onClick={() => removeFilter('bank', bankId)}>
                  <FiX size={12} />
                </RemoveButton>
              </ActiveFilterTag>
            ))}
            <ClearAllButton onClick={clearAllFilters}>
              Clear all
            </ClearAllButton>
          </ActiveFilters>
        )}
      </AnimatePresence>
    </FiltersWrapper>
  );
}