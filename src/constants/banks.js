export const BANKS = [
  {
    id: 'cash',
    name: 'Cash',
    color: '#22c55e',
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    color: '#004c8f',
  },
  {
    id: 'sbi',
    name: 'State Bank of India',
    color: '#1a5baa',
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    color: '#f58220',
  },
  {
    id: 'axis',
    name: 'Axis Bank',
    color: '#800020',
  },
  {
    id: 'kotak',
    name: 'Kotak Mahindra',
    color: '#ed1c24',
  },
  {
    id: 'paytm',
    name: 'Paytm Wallet',
    color: '#00baf2',
  },
  {
    id: 'gpay',
    name: 'Google Pay',
    color: '#4285f4',
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    color: '#5f259f',
  },
  {
    id: 'other',
    name: 'Other',
    color: '#71717a',
  },
];

export const getBankById = (id) => {
  return BANKS.find(bank => bank.id === id) || BANKS[BANKS.length - 1];
};