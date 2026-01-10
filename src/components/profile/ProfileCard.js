'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { getAvatarById } from '@/constants';
import { FiEdit2, FiLogOut, FiMail, FiCalendar } from 'react-icons/fi';

const CardWrapper = styled(motion.div)`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const AvatarWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${({ $bgColor }) => $bgColor || '#fef3c7'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  box-shadow: var(--shadow-md);
`;

const EditButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--accent-primary);
  color: white;
  border: 3px solid var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    transform: scale(1.1);
    background: var(--accent-secondary);
  }
`;

const Name = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  
  svg {
    color: var(--text-muted);
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 2rem;
  padding: 1.25rem 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  margin: 1.5rem 0;
  width: 100%;
  justify-content: center;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-primary);
`;

const StatLabel = styled.p`
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid var(--error);
  color: var(--error);
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--error);
    color: white;
  }
`;

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Unknown';
  }
};

export default function ProfileCard({ 
  user, 
  totalExpenses = 0,
  thisMonthExpenses = 0,
  onEdit, 
  onLogout 
}) {
  // Get avatar safely
  const avatar = getAvatarById(user?.avatarId);
  
  return (
    <CardWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <AvatarWrapper>
        <Avatar $bgColor={avatar?.bgColor}>
          {avatar?.emoji || '😊'}
        </Avatar>
        {onEdit && (
          <EditButton onClick={onEdit} title="Edit Profile">
            <FiEdit2 size={16} />
          </EditButton>
        )}
      </AvatarWrapper>
      
      <Name>{user?.name || 'User'}</Name>
      
      <InfoItem>
        <FiMail size={14} />
        {user?.email || 'No email'}
      </InfoItem>
      
      <InfoItem>
        <FiCalendar size={14} />
        Member since {formatDate(user?.createdAt)}
      </InfoItem>
      
      <Stats>
        <StatItem>
          <StatValue>{totalExpenses}</StatValue>
          <StatLabel>Total Entries</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{thisMonthExpenses}</StatValue>
          <StatLabel>This Month</StatLabel>
        </StatItem>
      </Stats>
      
      {onLogout && (
        <LogoutButton onClick={onLogout}>
          <FiLogOut size={16} />
          Sign Out
        </LogoutButton>
      )}
    </CardWrapper>
  );
}