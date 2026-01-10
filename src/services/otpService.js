'use client';

// OTP Storage (will be replaced with EmailJS in Phase 2)
const OTP_STORAGE_KEY = 'expensewise_otp';
const OTP_EXPIRY_MINUTES = 5;

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
    
    // Check if email matches
    if (otpData.email !== email.toLowerCase().trim()) {
      return { success: false, error: 'Invalid OTP. Please try again.' };
    }
    
    // Check if OTP expired
    if (Date.now() > otpData.expiresAt) {
      sessionStorage.removeItem(OTP_STORAGE_KEY);
      return { success: false, error: 'OTP expired. Please request a new one.' };
    }
    
    // Check if OTP matches
    if (otpData.otp !== enteredOTP) {
      return { success: false, error: 'Invalid OTP. Please try again.' };
    }
    
    // OTP is valid - clear it
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
    return Math.ceil(remaining / 1000); // Return seconds
  } catch {
    return 0;
  }
};

// Send OTP (Currently just generates and stores - will integrate EmailJS in Phase 2)
export const sendOTP = async (email, userName = '') => {
  const otp = generateOTP();
  
  // Store the OTP
  const stored = storeOTP(email, otp);
  
  if (!stored) {
    return { 
      success: false, 
      error: 'Failed to generate OTP. Please try again.' 
    };
  }
  
  // For development: Log OTP to console (remove in production)
  console.log('========================================');
  console.log(`📧 OTP for ${email}: ${otp}`);
  console.log(`⏰ Valid for ${OTP_EXPIRY_MINUTES} minutes`);
  console.log('========================================');
  
  // TODO: Phase 2 - Send via EmailJS
  // await emailjs.send(serviceId, templateId, {
  //   to_email: email,
  //   to_name: userName,
  //   otp_code: otp,
  // });
  
  return { 
    success: true, 
    message: `OTP sent to ${email}`,
    // For development only - remove in production
    devOTP: process.env.NODE_ENV === 'development' ? otp : undefined,
  };
};

// Resend OTP
export const resendOTP = async (email, userName = '') => {
  // Clear existing OTP
  clearOTP();
  
  // Send new OTP
  return sendOTP(email, userName);
};