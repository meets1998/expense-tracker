'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiCreditCard, FiPlus, FiUser } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { getAvatarById } from '@/constants';

const NavWrapper = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-card);
  border-top: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
  z-index: 100;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const NavList = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  max-width: 400px;
  margin: 0 auto;
`;

const NavItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  color: ${({ $active }) => $active ? 'var(--accent-primary)' : 'var(--text-muted)'};
  transition: color var(--transition-fast);
  position: relative;
  text-decoration: none;
  
  &:hover {
    color: var(--text-primary);
  }
`;

const NavLabel = styled.span`
  font-size: 0.65rem;
  font-weight: 500;
`;

const AddButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: var(--accent-gradient);
  border-radius: 50%;
  color: white;
  margin-top: -20px;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
  text-decoration: none;
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: var(--accent-primary);
  border-radius: 50%;
`;

const AvatarButton = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  text-decoration: none;
`;

const MiniAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $bgColor }) => $bgColor || '#fef3c7'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  border: 2px solid ${({ $active }) => $active ? 'var(--accent-primary)' : 'transparent'};
`;

const AvatarLabel = styled.span`
  font-size: 0.65rem;
  font-weight: 500;
  color: ${({ $active }) => $active ? 'var(--accent-primary)' : 'var(--text-muted)'};
`;

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Watch for user changes
  useEffect(() => {
    if (user) {
      const avatar = getAvatarById(user.avatarId);
      setCurrentAvatar(avatar);
    }
  }, [user, user?.avatarId]);

  if (!mounted) {
    return null;
  }

  const isProfileActive = pathname === '/profile' || pathname.startsWith('/profile/');

  return (
    <NavWrapper>
      <NavList>
        <NavItem 
          href="/dashboard"
          $active={pathname === '/dashboard'}
        >
          {pathname === '/dashboard' && (
            <ActiveIndicator layoutId="mobileNavIndicator" />
          )}
          <FiHome size={22} />
          <NavLabel>Home</NavLabel>
        </NavItem>
        
        <NavItem 
          href="/expenses"
          $active={pathname === '/expenses' || pathname.startsWith('/expenses')}
        >
          {(pathname === '/expenses' || pathname.startsWith('/expenses')) && 
           !pathname.includes('/add') && (
            <ActiveIndicator layoutId="mobileNavIndicator" />
          )}
          <FiCreditCard size={22} />
          <NavLabel>Expenses</NavLabel>
        </NavItem>
        
        <AddButton href="/expenses/add">
          <FiPlus size={24} />
        </AddButton>
        
        <AvatarButton href="/profile">
          <MiniAvatar 
            $bgColor={currentAvatar?.bgColor}
            $active={isProfileActive}
          >
            {currentAvatar?.emoji || '😊'}
          </MiniAvatar>
          <AvatarLabel $active={isProfileActive}>Profile</AvatarLabel>
        </AvatarButton>
      </NavList>
    </NavWrapper>
  );
}