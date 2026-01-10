'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AVATARS } from '@/constants';

const SelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-align: center;
`;

const AvatarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  
  @media (max-width: 400px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }
`;

const AvatarButton = styled(motion.button)`
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-lg);
  background: ${({ $bgColor }) => $bgColor};
  border: 3px solid ${({ $selected }) => $selected ? 'var(--accent-primary)' : 'transparent'};
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  ${({ $selected }) => $selected && `
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.3);
  `}
  
  &:hover {
    transform: scale(1.05);
    border-color: var(--accent-primary);
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  @media (max-width: 400px) {
    font-size: 1.5rem;
  }
`;

const SelectedIndicator = styled(motion.div)`
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: var(--accent-primary);
  border-radius: 50%;
`;

export default function AvatarSelector({ selectedAvatar, onSelect }) {
  const handleSelect = (avatarId) => {
    if (onSelect && typeof onSelect === 'function') {
      onSelect(avatarId);
    }
  };

  return (
    <SelectorWrapper>
      <Label>Choose your avatar</Label>
      <AvatarsGrid>
        {AVATARS.map((avatar) => (
          <AvatarButton
            key={avatar.id}
            type="button"
            $bgColor={avatar.bgColor}
            $selected={selectedAvatar === avatar.id}
            onClick={() => handleSelect(avatar.id)}
            whileTap={{ scale: 0.95 }}
          >
            {avatar.emoji}
            {selectedAvatar === avatar.id && (
              <SelectedIndicator
                layoutId="avatarIndicator"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </AvatarButton>
        ))}
      </AvatarsGrid>
    </SelectorWrapper>
  );
}