'use client';

import styled, { css } from 'styled-components';
import { forwardRef, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: ${({ $noMargin }) => $noMargin ? '0' : '1rem'};
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  padding-right: ${({ $hasIcon }) => $hasIcon ? '3rem' : '1rem'};
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all var(--transition-fast);
  
  &::placeholder {
    color: var(--text-muted);
  }
  
  &:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${({ $hasError }) => $hasError && css`
    border-color: var(--error);
    
    &:focus {
      border-color: var(--error);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}
`;

const IconButton = styled.button`
  position: absolute;
  right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--text-primary);
  }
`;

const Error = styled.span`
  display: block;
  font-size: 0.8125rem;
  color: var(--error);
  margin-top: 0.375rem;
`;

const Hint = styled.span`
  display: block;
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-top: 0.375rem;
`;

const Input = forwardRef(function Input({
  label,
  type = 'text',
  error,
  hint,
  noMargin = false,
  ...props
}, ref) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  
  return (
    <Wrapper $noMargin={noMargin}>
      {label && <Label>{label}</Label>}
      <InputWrapper>
        <StyledInput
          ref={ref}
          type={inputType}
          $hasError={!!error}
          $hasIcon={isPassword}
          {...props}
        />
        {isPassword && (
          <IconButton
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </IconButton>
        )}
      </InputWrapper>
      {error && <Error>{error}</Error>}
      {hint && !error && <Hint>{hint}</Hint>}
    </Wrapper>
  );
});

export default Input;