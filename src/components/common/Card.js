'use client';

import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

const StyledCard = styled(motion.div)`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: ${({ $padding }) => $padding || '1.5rem'};
  transition: all var(--transition-normal);
  
  ${({ $hoverable }) => $hoverable && css`
    cursor: pointer;
    
    &:hover {
      background: var(--bg-card-hover);
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }
  `}
  
  ${({ $gradient }) => $gradient && css`
    background: linear-gradient(
      135deg,
      var(--bg-card) 0%,
      var(--bg-card-hover) 100%
    );
  `}
`;

export default function Card({
  children,
  hoverable = false,
  gradient = false,
  padding,
  animate = true,
  ...props
}) {
  return (
    <StyledCard
      $hoverable={hoverable}
      $gradient={gradient}
      $padding={padding}
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.4 }}
      {...props}
    >
      {children}
    </StyledCard>
  );
}