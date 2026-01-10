'use client';

import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';

const OTPWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const InputsContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  
  @media (max-width: 400px) {
    gap: 0.5rem;
  }
`;

const OTPBox = styled.input`
  width: 52px;
  height: 60px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  background: var(--bg-secondary);
  border: 2px solid ${({ $hasValue, $focused }) => 
    $focused ? 'var(--accent-primary)' : 
    $hasValue ? 'var(--success)' : 'var(--border-color)'};
  border-radius: var(--radius-md);
  color: var(--text-primary);
  transition: all var(--transition-fast);
  
  @media (max-width: 400px) {
    width: 44px;
    height: 52px;
    font-size: 1.25rem;
  }
  
  &:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    outline: none;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResendWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: var(--accent-primary);
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:disabled {
    color: var(--text-muted);
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    text-decoration: underline;
  }
`;

const Timer = styled.span`
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
`;

const HelpText = styled.p`
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
`;

export default function OTPInput({ 
  length = 6, 
  onComplete, 
  onResend,
  disabled = false 
}) {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [resendTimer, setResendTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Focus first input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (index, value) => {
    // Only allow single digit
    const val = value.replace(/[^0-9]/g, '').slice(-1);
    
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Move to next input if value entered
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    const otpString = newOtp.join('');
    if (otpString.length === length && onComplete) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current and stay
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
    
    // Move to next input on right arrow
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Move to previous input on left arrow
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
    
    if (!pasteData) return;

    const newOtp = new Array(length).fill('');
    pasteData.split('').forEach((char, index) => {
      if (index < length) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);

    // Focus last filled input or last input
    const lastFilledIndex = Math.min(pasteData.length, length) - 1;
    if (lastFilledIndex >= 0 && inputRefs.current[lastFilledIndex]) {
      inputRefs.current[lastFilledIndex].focus();
    }

    // Check if complete
    const otpString = newOtp.join('');
    if (otpString.length === length && onComplete) {
      onComplete(otpString);
    }
  };

  const handleFocus = (index) => {
    setFocusedIndex(index);
    // Select text on focus
    inputRefs.current[index]?.select();
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return;
    
    setIsResending(true);
    setOtp(new Array(length).fill(''));
    
    if (onResend) {
      await onResend();
    }
    
    setResendTimer(30);
    setIsResending(false);
    
    // Focus first input
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  return (
    <OTPWrapper>
      <InputsContainer>
        {otp.map((digit, index) => (
          <OTPBox
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            ref={(ref) => (inputRefs.current[index] = ref)}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            disabled={disabled}
            autoComplete="off"
            $hasValue={!!digit}
            $focused={focusedIndex === index}
          />
        ))}
      </InputsContainer>
      
      <ResendWrapper>
        <span>Didn&apos;t receive the code?</span>
        {resendTimer > 0 ? (
          <Timer>Resend in {resendTimer}s</Timer>
        ) : (
          <ResendButton 
            onClick={handleResend} 
            disabled={disabled || isResending}
          >
            {isResending ? 'Sending...' : 'Resend Code'}
          </ResendButton>
        )}
      </ResendWrapper>
      
      <HelpText>
        Check your spam folder if you don&apos;t see the email
      </HelpText>
    </OTPWrapper>
  );
}