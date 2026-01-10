'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAvatarById } from '@/constants';
import { FiBell, FiPlus } from 'react-icons/fi';

const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  
  @media (min-width: 768px) {
    padding: 1rem 2rem;
  }
`;

const LogoLink = styled(Link)`
  font-size: 1.25rem;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const Greeting = styled.div`
  display: none;
  
  @media (min-width: 768px) {
    display: block;
  }
`;

const GreetingText = styled.p`
  font-size: 0.875rem;
  color: var(--text-muted);
`;

const UserName = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const IconButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--bg-card-hover);
    color: var(--text-primary);
  }
`;

const AddButton = styled(motion(Link))`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
`;

const AvatarLink = styled(Link)`
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $bgColor }) => $bgColor || '#fef3c7'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  border: 2px solid var(--border-color);
  transition: all var(--transition-fast);
  text-decoration: none;
  
  &:hover {
    border-color: var(--accent-primary);
    transform: scale(1.05);
  }
`;

export default function Header() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const [currentName, setCurrentName] = useState('');

  // Update avatar and name whenever user changes
  useEffect(() => {
    setMounted(true);
  }, []);

  // Watch for user changes and update local state
  useEffect(() => {
    if (user) {
      const avatar = getAvatarById(user.avatarId);
      setCurrentAvatar(avatar);
      setCurrentName(user.name || 'User');
      console.log('🔄 Header updated - Avatar:', user.avatarId, 'Name:', user.name);
    }
  }, [user, user?.avatarId, user?.name]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Don't render until mounted (prevents hydration issues)
  if (!mounted) {
    return (
      <HeaderWrapper>
        <LogoLink href="/dashboard">ExpenseWise</LogoLink>
        <Actions>
          <div style={{ width: 40, height: 40 }} />
        </Actions>
      </HeaderWrapper>
    );
  }

  return (
    <HeaderWrapper>
      <LogoLink href="/dashboard">
        ExpenseWise
      </LogoLink>
      
      <Greeting>
        <GreetingText>{getGreeting()},</GreetingText>
        <UserName>{currentName}</UserName>
      </Greeting>
      
      <Actions>
        <AddButton
          href="/expenses/add"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Add Expense"
        >
          <FiPlus size={20} />
        </AddButton>
        
        <IconButton 
          whileTap={{ scale: 0.95 }}
          title="Notifications"
        >
          <FiBell size={18} />
        </IconButton>
        
        <AvatarLink 
          href="/profile"
          $bgColor={currentAvatar?.bgColor}
          title="Profile"
        >
          {currentAvatar?.emoji || '😊'}
        </AvatarLink>
      </Actions>
    </HeaderWrapper>
  );
}