'use client';

import styled, { css } from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

const SelectWrapper = styled.div`
  width: 100%;
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

const SelectButton = styled.button`
  width: 100%;
  padding: 0.875rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 1rem;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  transition: all var(--transition-fast);
  cursor: pointer;
  
  &:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    outline: none;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${({ $error }) => $error && css`
    border-color: var(--error);
  `}
  
  ${({ $isOpen }) => $isOpen && css`
    border-color: var(--accent-primary);
  `}
`;

const SelectValue = styled.span`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  overflow: hidden;
  
  ${({ $placeholder }) => $placeholder && css`
    color: var(--text-muted);
  `}
`;

const ColorDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const ChevronIcon = styled(FiChevronDown)`
  transition: transform var(--transition-fast);
  color: var(--text-muted);
  flex-shrink: 0;
  
  ${({ $isOpen }) => $isOpen && css`
    transform: rotate(180deg);
  `}
`;

const Dropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 100;
  max-height: 280px;
  overflow-y: auto;
`;

const Option = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 0.95rem;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: background var(--transition-fast);
  cursor: pointer;
  
  &:hover {
    background: var(--bg-secondary);
  }
  
  ${({ $selected }) => $selected && css`
    background: rgba(99, 102, 241, 0.1);
    color: var(--accent-primary);
  `}
`;

const CheckIcon = styled(FiCheck)`
  margin-left: auto;
  color: var(--accent-primary);
`;

const ErrorMessage = styled.span`
  display: block;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--error);
`;

export default function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  
  const selectedOption = options.find(opt => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionId) => {
    onChange(optionId);
    setIsOpen(false);
  };

  return (
    <SelectWrapper ref={wrapperRef}>
      {label && (
        <Label>
          {label}
          {required && <span> *</span>}
        </Label>
      )}
      <SelectButton
        type="button"
        onClick={handleToggle}
        $isOpen={isOpen}
        $error={!!error}
        disabled={disabled}
      >
        <SelectValue $placeholder={!selectedOption}>
          {selectedOption ? (
            <>
              {selectedOption.color && <ColorDot $color={selectedOption.color} />}
              {selectedOption.emoji && <span>{selectedOption.emoji}</span>}
              {selectedOption.name}
            </>
          ) : (
            placeholder
          )}
        </SelectValue>
        <ChevronIcon size={18} $isOpen={isOpen} />
      </SelectButton>
      
      <AnimatePresence>
        {isOpen && (
          <Dropdown
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {options.map((option) => (
              <Option
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id)}
                $selected={option.id === value}
              >
                {option.color && <ColorDot $color={option.color} />}
                {option.emoji && <span>{option.emoji}</span>}
                {option.name}
                {option.id === value && <CheckIcon size={16} />}
              </Option>
            ))}
          </Dropdown>
        )}
      </AnimatePresence>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </SelectWrapper>
  );
}