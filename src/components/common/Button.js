'use client';

import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

const variants = {
  primary: css`
    background: var(--accent-gradient);
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
    }
  `,
  secondary: css`
    background: var(--bg-card);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    
    &:hover:not(:disabled) {
      background: var(--bg-card-hover);
      border-color: var(--accent-primary);
    }
  `,
  ghost: css`
    background: transparent;
    color: var(--text-secondary);
    border: none;
    
    &:hover:not(:disabled) {
      color: var(--text-primary);
      background: var(--bg-card);
    }
  `,
  danger: css`
    background: var(--error);
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background: #dc2626;
    }
  `,
};

const sizes = {
  sm: css`
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    border-radius: var(--radius-sm);
  `,
  md: css`
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: var(--radius-md);
  `,
  lg: css`
    padding: 1rem 2rem;
    font-size: 1.125rem;
    border-radius: var(--radius-md);
  `,
};

const StyledButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  
  ${({ $variant }) => variants[$variant] || variants.primary}
  ${({ $size }) => sizes[$size] || sizes.md}
  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Spinner = styled.span`
  width: 18px;
  height: 18px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {loading ? <Spinner /> : null}
      {children}
    </StyledButton>
  );
}