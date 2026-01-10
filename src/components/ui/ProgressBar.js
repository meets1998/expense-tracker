'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';

const ProgressWrapper = styled.div`
  width: 100%;
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const LabelText = styled.span`
  color: var(--text-secondary);
`;

const LabelValue = styled.span`
  font-weight: 600;
  color: var(--text-primary);
`;

const Track = styled.div`
  height: ${({ $height }) => $height || '8px'};
  background: var(--bg-secondary);
  border-radius: 100px;
  overflow: hidden;
`;

const Fill = styled(motion.div)`
  height: 100%;
  background: ${({ $color, $gradient }) => 
    $gradient || $color || 'var(--accent-gradient)'};
  border-radius: 100px;
`;

export default function ProgressBar({ 
  value = 0, 
  max = 100, 
  label,
  showValue = true,
  formatValue = (v) => `${v}%`,
  color,
  gradient,
  height,
  animated = true,
}) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <ProgressWrapper>
      {(label || showValue) && (
        <Label>
          {label && <LabelText>{label}</LabelText>}
          {showValue && <LabelValue>{formatValue(value)}</LabelValue>}
        </Label>
      )}
      <Track $height={height}>
        <Fill
          $color={color}
          $gradient={gradient}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </Track>
    </ProgressWrapper>
  );
}