'use client';

import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiAlertTriangle, FiInfo } from 'react-icons/fi';

const ToastContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 9999;
  max-width: calc(100vw - 2rem);
  
  @media (min-width: 640px) {
    max-width: 400px;
  }
`;

const ToastItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  border-left: 4px solid ${({ $type }) => {
    switch ($type) {
      case 'success': return 'var(--success)';
      case 'error': return 'var(--error)';
      case 'warning': return 'var(--warning)';
      default: return 'var(--accent-primary)';
    }
  }};
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $type }) => {
    switch ($type) {
      case 'success': return 'rgba(34, 197, 94, 0.15)';
      case 'error': return 'rgba(239, 68, 68, 0.15)';
      case 'warning': return 'rgba(245, 158, 11, 0.15)';
      default: return 'rgba(99, 102, 241, 0.15)';
    }
  }};
  color: ${({ $type }) => {
    switch ($type) {
      case 'success': return 'var(--success)';
      case 'error': return 'var(--error)';
      case 'warning': return 'var(--warning)';
      default: return 'var(--accent-primary)';
    }
  }};
`;

const Message = styled.p`
  flex: 1;
  font-size: 0.9375rem;
  color: var(--text-primary);
  line-height: 1.5;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  flex-shrink: 0;
  
  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
`;

const getIcon = (type) => {
  switch (type) {
    case 'success': return <FiCheck size={14} />;
    case 'error': return <FiX size={14} />;
    case 'warning': return <FiAlertTriangle size={14} />;
    default: return <FiInfo size={14} />;
  }
};

export default function Toast({ toasts, removeToast }) {
  return (
    <ToastContainer>
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            $type={toast.type}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <IconWrapper $type={toast.type}>
              {getIcon(toast.type)}
            </IconWrapper>
            <Message>{toast.message}</Message>
            <CloseButton onClick={() => removeToast(toast.id)}>
              <FiX size={16} />
            </CloseButton>
          </ToastItem>
        ))}
      </AnimatePresence>
    </ToastContainer>
  );
}