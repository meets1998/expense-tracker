'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiMail, FiAlertCircle } from 'react-icons/fi';
import { Button } from '@/components/common';
import { OTPInput } from '@/components/auth';
import { useAuth } from '@/context/AuthContext';
import { verifyOTP, resendOTP, getOTPRemainingTime } from '@/services/otpService';

const Container = styled(motion.div)`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-lg);
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--text-primary);
  }
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.1);
  color: var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const Email = styled.span`
  color: var(--text-primary);
  font-weight: 500;
`;

const ButtonWrapper = styled.div`
  margin-top: 2rem;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--error);
  text-align: center;
  font-size: 0.9rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-md);
`;

const SuccessMessage = styled.div`
  color: var(--success);
  text-align: center;
  font-size: 0.9rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(34, 197, 94, 0.1);
  border-radius: var(--radius-md);
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
`;

const ExpiryNote = styled.p`
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 1rem;
`;

export default function VerifyOTPPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otp, setOtp] = useState('');
  const [remainingTime, setRemainingTime] = useState(0);

  // Load pending auth data
  useEffect(() => {
    const loadAuthData = () => {
      try {
        const pending = sessionStorage.getItem('pendingAuth');
        if (pending) {
          const parsed = JSON.parse(pending);
          setAuthData(parsed);
          setRemainingTime(getOTPRemainingTime());
        } else {
          router.replace('/login');
          return;
        }
      } catch (err) {
        console.error('Error loading auth data:', err);
        router.replace('/login');
        return;
      }
      setPageLoading(false);
    };

    const timer = setTimeout(loadAuthData, 100);
    return () => clearTimeout(timer);
  }, [router]);

  // Update remaining time
  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        const time = getOTPRemainingTime();
        setRemainingTime(time);
        if (time === 0) {
          setError('OTP expired. Please request a new one.');
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  const handleOTPComplete = (otpValue) => {
    setOtp(otpValue);
    setError('');
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Verify OTP
    const result = verifyOTP(authData.email, otp);
    
    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }
    
    setSuccess('OTP verified successfully!');
    
    // Small delay to show success message
    setTimeout(() => {
      try {
        const userData = {
          id: Date.now().toString(),
          email: authData.email,
          name: authData.name || authData.email.split('@')[0],
          avatarId: 'avatar1',
          createdAt: new Date().toISOString(),
        };
        
        // Clear pending auth
        sessionStorage.removeItem('pendingAuth');
        
        if (authData.type === 'register') {
          // New user - store data and redirect to profile setup
          sessionStorage.setItem('newUser', JSON.stringify(userData));
          router.push('/profile/setup');
        } else {
          // Existing user - login directly
          login(userData);
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError('Something went wrong. Please try again.');
        setLoading(false);
      }
    }, 1000);
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    setOtp('');
    
    const result = await resendOTP(authData.email, authData.name);
    
    if (result.success) {
      setSuccess('New OTP sent successfully!');
      setRemainingTime(getOTPRemainingTime());
      
      // For development - log new OTP
      if (result.devOTP) {
        console.log('New OTP:', result.devOTP);
      }
    } else {
      setError(result.error || 'Failed to resend OTP');
    }
  };

  // Show loading state
  if (pageLoading) {
    return (
      <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <LoadingState>Loading...</LoadingState>
      </Container>
    );
  }

  // No auth data found
  if (!authData) {
    return null;
  }

  const backLink = authData.type === 'register' ? '/register' : '/login';
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BackLink href={backLink}>
        <FiArrowLeft size={16} /> Back
      </BackLink>
      
      <IconWrapper>
        <FiMail size={28} />
      </IconWrapper>
      
      <Title>Verify Your Email</Title>
      <Subtitle>
        We&apos;ve sent a 6-digit verification code to<br />
        <Email>{authData.email}</Email>
      </Subtitle>
      
      <OTPInput 
        onComplete={handleOTPComplete}
        onResend={handleResend}
        disabled={loading}
      />
      
      {remainingTime > 0 && (
        <ExpiryNote>
          Code expires in {formatTime(remainingTime)}
        </ExpiryNote>
      )}
      
      {error && (
        <ErrorMessage>
          <FiAlertCircle size={16} />
          {error}
        </ErrorMessage>
      )}
      
      {success && (
        <SuccessMessage>
          ✓ {success}
        </SuccessMessage>
      )}
      
      <ButtonWrapper>
        <Button 
          fullWidth 
          size="lg"
          loading={loading}
          onClick={handleVerify}
          disabled={otp.length !== 6 || remainingTime === 0}
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </Button>
      </ButtonWrapper>
    </Container>
  );
}