export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateOTP = (otp) => {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

export const validateAmount = (amount) => {
  const numAmount = parseFloat(amount);
  return !isNaN(numAmount) && numAmount > 0;
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 50;
};

export const validateExpense = (expense) => {
  const errors = {};

  if (!validateRequired(expense.amount) || !validateAmount(expense.amount)) {
    errors.amount = 'Please enter a valid amount';
  }

  if (!validateRequired(expense.category)) {
    errors.category = 'Please select a category';
  }

  if (!validateRequired(expense.date)) {
    errors.date = 'Please select a date';
  }

  if (!validateRequired(expense.bank)) {
    errors.bank = 'Please select a payment method';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};