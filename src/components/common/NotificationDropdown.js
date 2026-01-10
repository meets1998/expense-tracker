'use client';

import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiX, FiCheck, FiInfo, FiAlertCircle, FiTrash2, FiClock } from 'react-icons/fi';

const NotificationWrapper = styled.div`
  position: relative;
`;

const BellButton = styled(motion.button)`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
    border-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
`;

const NotificationBadge = styled(motion.span)`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  border: 2px solid var(--bg-card);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
`;

const GlassDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 12px);
  right: -10px;
  width: 380px;
  max-height: 500px;
  background: rgba(26, 26, 36, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 480px) {
    position: fixed;
    top: auto;
    bottom: 90px;
    right: 16px;
    left: 16px;
    width: auto;
    max-height: 65vh;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    right: 24px;
    width: 12px;
    height: 12px;
    background: rgba(26, 26, 36, 0.85);
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    transform: rotate(45deg);
    backdrop-filter: blur(20px);
  }
`;

const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const DropdownTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MarkAllButton = styled.button`
  font-size: 0.75rem;
  color: var(--accent-primary);
  background: rgba(99, 102, 241, 0.1);
  border: none;
  cursor: pointer;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-weight: 500;
  transition: all var(--transition-fast);
  
  &:hover {
    background: rgba(99, 102, 241, 0.2);
  }
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
  }
`;

const NotificationList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
`;

const NotificationItem = styled(motion.div)`
  display: flex;
  gap: 0.875rem;
  padding: 1rem;
  border-radius: 14px;
  cursor: pointer;
  transition: all var(--transition-fast);
  background: ${({ $unread }) => $unread ? 'rgba(99, 102, 241, 0.08)' : 'transparent'};
  margin-bottom: 0.375rem;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  ${({ $unread }) => $unread && `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--accent-gradient);
      border-radius: 0 3px 3px 0;
    }
  `}
`;

const NotificationIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${({ $type }) => {
    switch ($type) {
      case 'success': return 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)';
      case 'warning': return 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(251, 191, 36, 0.2) 100%)';
      case 'error': return 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(248, 113, 113, 0.2) 100%)';
      default: return 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)';
    }
  }};
  color: ${({ $type }) => {
    switch ($type) {
      case 'success': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6366f1';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.p`
  font-size: 0.9rem;
  font-weight: ${({ $unread }) => $unread ? '600' : '500'};
  margin-bottom: 0.25rem;
  color: var(--text-primary);
`;

const NotificationText = styled.p`
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NotificationTime = styled.p`
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const EmptyState = styled.div`
  padding: 3.5rem 2rem;
  text-align: center;
`;

const EmptyIcon = styled.div`
  width: 70px;
  height: 70px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

const EmptyTitle = styled.p`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.375rem;
  color: var(--text-primary);
`;

const EmptyText = styled.p`
  font-size: 0.85rem;
  color: var(--text-muted);
`;

const DropdownFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const ClearAllButton = styled.button`
  font-size: 0.8rem;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all var(--transition-fast);
  
  &:hover {
    color: var(--error);
    background: rgba(239, 68, 68, 0.1);
  }
`;

// Sample notifications
const getInitialNotifications = () => [
  {
    id: '1',
    type: 'info',
    title: 'Welcome to ExpenseWise! 🎉',
    message: 'Start tracking your expenses by clicking "Add Expense" button.',
    time: 'Just now',
    unread: true,
  },
  {
    id: '2',
    type: 'success',
    title: 'Expense Added',
    message: 'Your food expense of ₹250 has been recorded successfully.',
    time: '5 min ago',
    unread: true,
  },
  {
    id: '3',
    type: 'warning',
    title: 'Budget Alert',
    message: 'You\'ve spent 75% of your monthly shopping budget.',
    time: '1 hour ago',
    unread: false,
  },
  {
    id: '4',
    type: 'info',
    title: 'Daily Reminder',
    message: 'Don\'t forget to log your expenses for today!',
    time: '3 hours ago',
    unread: false,
  },
];

const getIcon = (type) => {
  switch (type) {
    case 'success': return FiCheck;
    case 'warning': return FiAlertCircle;
    case 'error': return FiX;
    default: return FiInfo;
  }
};

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setNotifications(getInitialNotifications());
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  if (!mounted) return null;

  return (
    <NotificationWrapper ref={wrapperRef}>
      <BellButton
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
        title="Notifications"
      >
        <FiBell size={20} />
        <AnimatePresence>
          {unreadCount > 0 && (
            <NotificationBadge
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </NotificationBadge>
          )}
        </AnimatePresence>
      </BellButton>

      <AnimatePresence>
        {isOpen && (
          <GlassDropdown
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <DropdownHeader>
              <DropdownTitle>Notifications</DropdownTitle>
              <HeaderActions>
                {unreadCount > 0 && (
                  <MarkAllButton onClick={markAllAsRead}>
                    Mark all read
                  </MarkAllButton>
                )}
                <CloseButton onClick={() => setIsOpen(false)}>
                  <FiX size={18} />
                </CloseButton>
              </HeaderActions>
            </DropdownHeader>

            <NotificationList>
              {notifications.length === 0 ? (
                <EmptyState>
                  <EmptyIcon>🔔</EmptyIcon>
                  <EmptyTitle>All caught up!</EmptyTitle>
                  <EmptyText>No new notifications</EmptyText>
                </EmptyState>
              ) : (
                notifications.map((notification, index) => {
                  const Icon = getIcon(notification.type);
                  return (
                    <NotificationItem
                      key={notification.id}
                      $unread={notification.unread}
                      onClick={() => markAsRead(notification.id)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <NotificationIcon $type={notification.type}>
                        <Icon size={18} />
                      </NotificationIcon>
                      <NotificationContent>
                        <NotificationTitle $unread={notification.unread}>
                          {notification.title}
                        </NotificationTitle>
                        <NotificationText>{notification.message}</NotificationText>
                        <NotificationTime>
                          <FiClock size={10} />
                          {notification.time}
                        </NotificationTime>
                      </NotificationContent>
                    </NotificationItem>
                  );
                })
              )}
            </NotificationList>

            {notifications.length > 0 && (
              <DropdownFooter>
                <ClearAllButton onClick={clearAll}>
                  <FiTrash2 size={14} />
                  Clear all
                </ClearAllButton>
              </DropdownFooter>
            )}
          </GlassDropdown>
        )}
      </AnimatePresence>
    </NotificationWrapper>
  );
}