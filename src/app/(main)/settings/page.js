'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiBell, FiMoon, FiDownload, FiTrash2, FiMail } from 'react-icons/fi';
import { Card, Button } from '@/components/common';
import { useAuth } from '@/context/AuthContext';
import { useExpenses } from '@/context/ExpenseContext';
import { useToastContext } from '@/context/ToastContext';

const Container = styled.div`
  padding: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Title = styled(motion.h1)`
  font-size: 1.75rem;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
`;

const SettingCard = styled(motion.div)`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SettingIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
`;

const SettingText = styled.div``;

const SettingLabel = styled.p`
  font-weight: 500;
  margin-bottom: 0.125rem;
`;

const SettingDescription = styled.p`
  font-size: 0.8rem;
  color: var(--text-muted);
`;

const Toggle = styled.button`
  width: 48px;
  height: 28px;
  border-radius: 14px;
  background: ${({ $active }) => $active ? 'var(--accent-primary)' : 'var(--bg-secondary)'};
  border: 1px solid ${({ $active }) => $active ? 'var(--accent-primary)' : 'var(--border-color)'};
  position: relative;
  transition: all var(--transition-fast);
  
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ $active }) => $active ? '22px' : '3px'};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    transition: left var(--transition-fast);
  }
`;

const DangerZone = styled(motion.div)`
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
`;

const DangerTitle = styled.h3`
  font-size: 1rem;
  color: var(--error);
  margin-bottom: 0.5rem;
`;

const DangerText = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
`;

export default function SettingsPage() {
  const { user } = useAuth();
  const { expenses } = useExpenses();
  const { success, info } = useToastContext();

  const handleExportData = () => {
    const data = {
      user: { name: user?.name, email: user?.email },
      expenses: expenses,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expensewise-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    success('Data exported successfully!');
  };

  const handleClearData = () => {
    if (confirm('Are you sure? This will delete all your expense data.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <Container>
      <Title
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Settings
      </Title>

      <Section>
        <SectionTitle>Notifications</SectionTitle>
        <SettingCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SettingItem>
            <SettingInfo>
              <SettingIcon>
                <FiBell size={18} />
              </SettingIcon>
              <SettingText>
                <SettingLabel>Daily Reminders</SettingLabel>
                <SettingDescription>Get reminded to log expenses</SettingDescription>
              </SettingText>
            </SettingInfo>
            <Toggle $active={true} onClick={() => info('Coming in Phase 2!')} />
          </SettingItem>
          
          <SettingItem>
            <SettingInfo>
              <SettingIcon>
                <FiMail size={18} />
              </SettingIcon>
              <SettingText>
                <SettingLabel>Email Reports</SettingLabel>
                <SettingDescription>Weekly expense summaries</SettingDescription>
              </SettingText>
            </SettingInfo>
            <Toggle $active={false} onClick={() => info('Coming in Phase 2!')} />
          </SettingItem>
        </SettingCard>
      </Section>

      <Section>
        <SectionTitle>Data</SectionTitle>
        <SettingCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SettingItem>
            <SettingInfo>
              <SettingIcon>
                <FiDownload size={18} />
              </SettingIcon>
              <SettingText>
                <SettingLabel>Export Data</SettingLabel>
                <SettingDescription>Download all your data as JSON</SettingDescription>
              </SettingText>
            </SettingInfo>
            <Button size="sm" variant="secondary" onClick={handleExportData}>
              Export
            </Button>
          </SettingItem>
        </SettingCard>
      </Section>

      <Section>
        <SectionTitle>Danger Zone</SectionTitle>
        <DangerZone
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DangerTitle>Clear All Data</DangerTitle>
          <DangerText>
            This will permanently delete all your expenses and account data. This action cannot be undone.
          </DangerText>
          <Button variant="danger" size="sm" onClick={handleClearData}>
            <FiTrash2 size={16} />
            Clear All Data
          </Button>
        </DangerZone>
      </Section>
    </Container>
  );
}