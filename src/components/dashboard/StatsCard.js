'use client';

import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const CardWrapper = styled(motion.div)`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  transition: all var(--transition-normal);
  
  ${({ $gradient }) => $gradient && css`
    background: linear-gradient(
      135deg,
      rgba(99, 102, 241, 0.15) 0%,
      rgba(139, 92, 246, 0.15) 100%
    );
    border-color: rgba(99, 102, 241, 0.3);
  `}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: ${({ $color }) => $color ? `${$color}20` : 'var(--bg-secondary)'};
  color: ${({ $color }) => $color || 'var(--accent-primary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const Label = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
`;

const Value = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  
  ${({ $gradient }) => $gradient && css`
    background: var(--accent-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `}
`;

export default function StatsCard({ 
  icon: Icon, 
  label, 
  value, 
  color,
  gradient = false,
  delay = 0 
}) {
  const [mounted, setMounted] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update display value when value prop changes
  useEffect(() => {
    setDisplayValue(value);
    console.log(`📈 StatsCard "${label}" updated:`, value);
  }, [value, label]);

  if (!mounted) {
    return (
      <CardWrapper $gradient={gradient}>
        <Label>{label}</Label>
        <Value>Loading...</Value>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      $gradient={gradient}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {Icon && (
        <IconWrapper $color={color}>
          <Icon size={24} />
        </IconWrapper>
      )}
      <Label>{label}</Label>
      <Value $gradient={gradient}>{displayValue}</Value>
    </CardWrapper>
  );
}