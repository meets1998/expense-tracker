// src/services/emailService.js
import emailjs from '@emailjs/browser';

// Initialize EmailJS once
let initialized = false;

const initEmailJS = () => {
  if (!initialized && typeof window !== 'undefined') {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
    initialized = true;
  }
};

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP Email
export const sendOTPEmail = async (email, userName = 'User') => {
  initEmailJS();
  
  const otp = generateOTP();
  
  try {
    const templateParams = {
      to_email: email,
      to_name: userName || email.split('@')[0],
      otp_code: otp,
      expiry_time: '5 minutes',
    };

    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_OTP,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    );

    // Store OTP in localStorage for verification
    if (typeof window !== 'undefined') {
      const otpData = {
        otp,
        email: email.toLowerCase(),
        expiresAt: Date.now() + 5 * 60 * 1000,
      };
      localStorage.setItem('pending_otp', JSON.stringify(otpData));
    }

    return { success: true, message: 'OTP sent successfully!' };
  } catch (error) {
    console.error('EmailJS Error:', error);
    return { success: false, message: error.text || 'Failed to send OTP' };
  }
};

// Verify OTP
export const verifyOTP = (email, enteredOTP) => {
  if (typeof window === 'undefined') {
    return { valid: false, message: 'Invalid environment' };
  }

  const stored = localStorage.getItem('pending_otp');
  if (!stored) {
    return { valid: false, message: 'No OTP found. Request a new one.' };
  }

  const otpData = JSON.parse(stored);

  if (otpData.email !== email.toLowerCase()) {
    return { valid: false, message: 'Email mismatch.' };
  }

  if (Date.now() > otpData.expiresAt) {
    localStorage.removeItem('pending_otp');
    return { valid: false, message: 'OTP expired. Request a new one.' };
  }

  if (otpData.otp !== enteredOTP) {
    return { valid: false, message: 'Invalid OTP.' };
  }

  localStorage.removeItem('pending_otp');
  return { valid: true, message: 'OTP verified!' };
};

// Send Welcome Email
export const sendWelcomeEmail = async (email, userName) => {
  initEmailJS();

  try {
    const templateParams = {
      to_email: email,
      to_name: userName || email.split('@')[0],
      dashboard_link: 'https://pocketkhata.netlify.app/dashboard',
    };

    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_WELCOME,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    );

    return { success: true };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { success: false };
  }
};

// Resend OTP
export const resendOTP = async (email, userName) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pending_otp');
  }
  return sendOTPEmail(email, userName);
};