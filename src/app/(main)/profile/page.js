'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ProfileCard } from '@/components/profile';
import { Loader } from '@/components/common';
import { useAuth } from '@/context/AuthContext';
import { useExpenses } from '@/context/ExpenseContext';

const Container = styled.div`
  padding: 1.5rem;
  max-width: 500px;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Title = styled(motion.h1)`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
`;

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const { expenses, currentMonthExpenses } = useExpenses();

  const handleEdit = () => {
    // Navigate to profile setup in edit mode
    router.push('/profile/setup');
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <Container>
        <Loader text="Loading profile..." />
      </Container>
    );
  }

  return (
    <Container>
      <Title
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        Profile
      </Title>
      
      <ProfileCard
        user={user}
        totalExpenses={expenses?.length || 0}
        thisMonthExpenses={currentMonthExpenses?.length || 0}
        onEdit={handleEdit}
        onLogout={handleLogout}
      />
    </Container>
  );
}