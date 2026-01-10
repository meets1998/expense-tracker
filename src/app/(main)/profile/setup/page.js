'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Loader } from '@/components/common';
import { AvatarSelector } from '@/components/profile';
import { useAuth } from '@/context/AuthContext';
import { useToastContext } from '@/context/ToastContext';
import { FiUser, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: var(--bg-primary);
`;

const Card = styled(motion.div)`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  width: 100%;
  max-width: 480px;
  box-shadow: var(--shadow-lg);
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--text-primary);
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ErrorMessage = styled.p`
  color: var(--error);
  font-size: 0.875rem;
  text-align: center;
  margin-top: -1rem;
`;

export default function ProfileSetupPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, login, updateUser } = useAuth();
  const { success } = useToastContext();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('avatar1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) return;

    // Check if user is already logged in (edit mode)
    if (isAuthenticated && user) {
      console.log('📝 Edit mode - current user:', user);
      setIsEditMode(true);
      setName(user.name || '');
      setSelectedAvatar(user.avatarId || 'avatar1');
      setPageReady(true);
      return;
    }

    // Check for new user data in sessionStorage (registration flow)
    try {
      const newUserData = sessionStorage.getItem('newUser');
      if (newUserData) {
        const parsed = JSON.parse(newUserData);
        console.log('🆕 New user setup:', parsed);
        setUserData(parsed);
        setName(parsed.name || '');
        setSelectedAvatar(parsed.avatarId || 'avatar1');
        setPageReady(true);
        return;
      }
    } catch (err) {
      console.error('Error loading new user data:', err);
    }

    // No valid state, redirect to login
    console.log('⚠️ No user data found, redirecting to login');
    router.replace('/login');
  }, [authLoading, isAuthenticated, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const trimmedName = name.trim();
    
    if (!trimmedName || trimmedName.length < 2) {
      setError('Please enter a valid name (at least 2 characters)');
      return;
    }
    
    setLoading(true);
    
    try {
      if (isEditMode) {
        // Update existing user
        console.log('💾 Saving profile updates:', { name: trimmedName, avatarId: selectedAvatar });
        
        updateUser({
          name: trimmedName,
          avatarId: selectedAvatar,
        });
        
        success('Profile updated successfully!');
        
        // Small delay to ensure state is updated
        setTimeout(() => {
          router.push('/profile');
        }, 300);
        
      } else {
        // Complete registration for new user
        const finalUserData = {
          ...userData,
          name: trimmedName,
          avatarId: selectedAvatar,
        };
        
        console.log('🎉 Completing registration:', finalUserData);
        
        // Clear session storage
        sessionStorage.removeItem('newUser');
        
        // Login the user
        login(finalUserData);
        
        success('Profile created successfully!');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
      setLoading(false);
    }
  };

  // Show loading while checking auth state
  if (authLoading || !pageReady) {
    return (
      <Container>
        <Loader text="Loading..." />
      </Container>
    );
  }

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isEditMode && (
          <BackLink href="/profile">
            <FiArrowLeft size={16} /> Back to Profile
          </BackLink>
        )}
        
        <Title>{isEditMode ? 'Edit Profile' : 'Set Up Your Profile'}</Title>
        <Subtitle>
          {isEditMode ? 'Update your profile details' : 'Personalize your account'}
        </Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <AvatarSelector
            selectedAvatar={selectedAvatar}
            onSelect={setSelectedAvatar}
          />
          
          <Input
            label="Display Name"
            type="text"
            placeholder="How should we call you?"
            icon={<FiUser size={18} />}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            disabled={loading}
            required
          />
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button 
            type="submit" 
            fullWidth 
            size="lg"
            loading={loading}
          >
            {loading 
              ? 'Saving...' 
              : isEditMode 
                ? 'Save Changes' 
                : 'Complete Setup'
            }
          </Button>
        </Form>
      </Card>
    </Container>
  );
}