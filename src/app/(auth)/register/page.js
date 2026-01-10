'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiUser } from 'react-icons/fi';
import { Button, Input } from '@/components/common';
import { validateEmail, validateName } from '@/utils';
import { sendOTP } from '@/services/otpService';

const Container = styled(motion.div)`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-lg);
`;

const Logo = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const ErrorMessage = styled.p`
  color: var(--error);
  font-size: 0.875rem;
  text-align: center;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-md);
`;

const DevNote = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(99, 102, 241, 0.1);
  border: 1px dashed var(--accent-primary);
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-align: center;
  
  code {
    background: var(--bg-secondary);
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    font-weight: 600;
    color: var(--accent-primary);
  }
`;

const LinkText = styled.p`
  text-align: center;
  color: var(--text-secondary);
  margin-top: 1.5rem;
  
  a {
    color: var(--accent-primary);
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const [devOTP, setDevOTP] = useState('');

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setGeneralError('');
  };

  const validate = () => {
    const newErrors = {};
    
    if (!validateName(formData.name)) {
      newErrors.name = 'Please enter a valid name (2-50 characters)';
    }
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setDevOTP('');
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      // Send OTP
      const result = await sendOTP(formData.email, formData.name);
      
      if (!result.success) {
        setGeneralError(result.error || 'Failed to send OTP');
        setLoading(false);
        return;
      }
      
      // Store user data for verification page
      sessionStorage.setItem('pendingAuth', JSON.stringify({
        type: 'register',
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
      }));
      
      // For development - show OTP
      if (result.devOTP) {
        setDevOTP(result.devOTP);
        // Still navigate after showing OTP briefly
        setTimeout(() => {
          router.push('/verify-otp');
        }, 2000);
      } else {
        router.push('/verify-otp');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      setGeneralError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Logo>ExpenseWise</Logo>
      <Subtitle>Create your account to get started</Subtitle>
      
      {generalError && <ErrorMessage>{generalError}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your name"
          icon={<FiUser size={18} />}
          value={formData.name}
          onChange={handleChange('name')}
          error={errors.name}
          disabled={loading}
          required
        />
        
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          icon={<FiMail size={18} />}
          value={formData.email}
          onChange={handleChange('email')}
          error={errors.email}
          disabled={loading}
          required
        />
        
        <Button 
          type="submit" 
          fullWidth 
          loading={loading}
          size="lg"
        >
          {loading ? 'Sending OTP...' : 'Continue with Email'}
        </Button>
      </Form>
      
      {devOTP && (
        <DevNote>
          🔐 Development Mode: Your OTP is <code>{devOTP}</code>
          <br />
          <small>Redirecting to verification page...</small>
        </DevNote>
      )}
      
      <LinkText>
        Already have an account? <Link href="/login">Sign in</Link>
      </LinkText>
    </Container>
  );
}