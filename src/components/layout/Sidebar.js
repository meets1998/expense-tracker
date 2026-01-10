'use client';

import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiGrid, 
  FiCreditCard, 
  FiPieChart, 
  FiSettings, 
  FiLogOut,
  FiX,
  FiUser
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 199;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const SidebarWrapper = styled(motion.aside)`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  background: var(--bg-card);
  border-right: 1px solid var(--border-color);
  z-index: 200;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  
  @media (min-width: 768px) {
    transform: translateX(0);
  }
  
  ${({ $isOpen }) => $isOpen && css`
    transform: translateX(0);
  `}
`;

const LogoSection = styled.div`
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  cursor: pointer;
  
  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`;

const NavSection = styled.div`
  margin-bottom: 1.5rem;
`;

const NavLabel = styled.span`
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 0.75rem;
  margin-bottom: 0.5rem;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-weight: 500;
  transition: all var(--transition-fast);
  margin-bottom: 0.25rem;
  
  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
  
  ${({ $isActive }) => $isActive && css`
    background: var(--accent-gradient);
    color: white;
    
    &:hover {
      background: var(--accent-gradient);
      color: white;
    }
  `}
`;

const NavIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const Footer = styled.div`
  padding: 1rem;
  border-top: 1px solid var(--border-color);
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: rgba(239, 68, 68, 0.1);
    color: var(--error);
  }
`;

const navItems = [
  { href: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { href: '/expenses', icon: FiCreditCard, label: 'Expenses' },
  { href: '/profile', icon: FiUser, label: 'Profile' },
  { href: '/settings', icon: FiSettings, label: 'Settings' },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      
      <SidebarWrapper $isOpen={isOpen}>
        <LogoSection>
          <Logo href="/dashboard">ExpenseWise</Logo>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </LogoSection>
        
        <Navigation>
          <NavSection>
            <NavLabel>Menu</NavLabel>
            {navItems.map(item => (
              <NavItem
                key={item.href}
                href={item.href}
                $isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
                onClick={onClose}
              >
                <NavIcon>
                  <item.icon size={18} />
                </NavIcon>
                {item.label}
              </NavItem>
            ))}
          </NavSection>
        </Navigation>
        
        <Footer>
          <LogoutButton onClick={handleLogout}>
            <NavIcon>
              <FiLogOut size={18} />
            </NavIcon>
            Logout
          </LogoutButton>
        </Footer>
      </SidebarWrapper>
    </>
  );
}