'use client';

import emailjs from '@emailjs/browser';

// OTP Storage
const OTP_STORAGE_KEY = 'expensewise_otp';
const OTP_EXPIRY_MINUTES = 5;

// Initialize EmailJS once
let initialized = false;

const initEmailJS = () => {
  if (!initialized && typeof window !== 'undefined') {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
    initialized = true;
  }
};

// Generate a random 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP with expiry
export const storeOTP = (email, otp) => {
  if (typeof window === 'undefined') return;
  
  const otpData = {
    email: email.toLowerCase().trim(),
    otp: otp,
    createdAt: Date.now(),
    expiresAt: Date.now() + (OTP_EXPIRY_MINUTES * 60 * 1000),
  };
  
  try {
    sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpData));
    return true;
  } catch (error) {
    console.error('Error storing OTP:', error);
    return false;
  }
};

// Verify OTP
export const verifyOTP = (email, enteredOTP) => {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Unable to verify OTP' };
  }
  
  try {
    const stored = sessionStorage.getItem(OTP_STORAGE_KEY);
    
    if (!stored) {
      return { success: false, error: 'OTP expired. Please request a new one.' };
    }
    
    const otpData = JSON.parse(stored);
    
    if (otpData.email !== email.toLowerCase().trim()) {
      return { success: false, error: 'Invalid OTP. Please try again.' };
    }
    
    if (Date.now() > otpData.expiresAt) {
      sessionStorage.removeItem(OTP_STORAGE_KEY);
      return { success: false, error: 'OTP expired. Please request a new one.' };
    }
    
    if (otpData.otp !== enteredOTP) {
      return { success: false, error: 'Invalid OTP. Please try again.' };
    }
    
    sessionStorage.removeItem(OTP_STORAGE_KEY);
    return { success: true };
    
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, error: 'Verification failed. Please try again.' };
  }
};

// Clear stored OTP
export const clearOTP = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(OTP_STORAGE_KEY);
};

// Get remaining time for OTP
export const getOTPRemainingTime = () => {
  if (typeof window === 'undefined') return 0;
  
  try {
    const stored = sessionStorage.getItem(OTP_STORAGE_KEY);
    if (!stored) return 0;
    
    const otpData = JSON.parse(stored);
    const remaining = Math.max(0, otpData.expiresAt - Date.now());
    return Math.ceil(remaining / 1000);
  } catch {
    return 0;
  }
};

// Send OTP via EmailJS
export const sendOTP = async (email, userName = '') => {
  initEmailJS();
  
  const otp = generateOTP();
  
  try {
    // Send email via EmailJS
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_OTP,
      {
        to_email: email,
        to_name: userName || email.split('@')[0],
        otp_code: otp,
        expiry_time: '5 minutes',
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    );
    
    // Store OTP for verification
    const stored = storeOTP(email, otp);
    
    if (!stored) {
      return { 
        success: false, 
        error: 'Failed to process OTP. Please try again.' 
      };
    }
    
    console.log('✅ OTP sent successfully to:', email);
    
    return { 
      success: true, 
      message: `OTP sent to ${email}`,
    };
    
  } catch (error) {
    console.error('❌ EmailJS Error:', error);
    return { 
      success: false, 
      error: error.text || 'Failed to send OTP. Please try again.',
    };
  }
};

// Resend OTP
export const resendOTP = async (email, userName = '') => {
  clearOTP();
  return sendOTP(email, userName);
};