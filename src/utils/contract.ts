import { Address } from 'viem';

// Contract configuration
export const CONTRACT_ADDRESS = '0x...' as Address; // Will be set after deployment
export const CONTRACT_ABI = [
  // Company management
  {
    "inputs": [
      {"internalType": "string", "name": "_name", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "uint256", "name": "_totalShares", "type": "uint256"},
      {"internalType": "uint256", "name": "_initialValuation", "type": "uint256"}
    ],
    "name": "createCompany",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "companyId", "type": "uint256"},
      {"internalType": "bytes", "name": "amount", "type": "bytes"},
      {"internalType": "bytes", "name": "shares", "type": "bytes"},
      {"internalType": "bytes", "name": "inputProof", "type": "bytes"}
    ],
    "name": "makeInvestment",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "companyId", "type": "uint256"}],
    "name": "getCompanyInfo",
    "outputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "uint8", "name": "totalShares", "type": "uint8"},
      {"internalType": "uint8", "name": "currentValuation", "type": "uint8"},
      {"internalType": "uint8", "name": "totalRaised", "type": "uint8"},
      {"internalType": "uint8", "name": "investorCount", "type": "uint8"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "bool", "name": "isVerified", "type": "bool"},
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
      {"internalType": "uint256", "name": "updatedAt", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "investmentId", "type": "uint256"}],
    "name": "getInvestmentInfo",
    "outputs": [
      {"internalType": "uint8", "name": "amount", "type": "uint8"},
      {"internalType": "uint8", "name": "shares", "type": "uint8"},
      {"internalType": "uint8", "name": "valuation", "type": "uint8"},
      {"internalType": "address", "name": "investor", "type": "address"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"internalType": "bool", "name": "isActive", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "investor", "type": "address"}],
    "name": "getInvestorReputation",
    "outputs": [
      {"internalType": "uint8", "name": "score", "type": "uint8"},
      {"internalType": "uint8", "name": "totalInvestments", "type": "uint8"},
      {"internalType": "uint8", "name": "successfulExits", "type": "uint8"},
      {"internalType": "bool", "name": "isVerified", "type": "bool"},
      {"internalType": "uint256", "name": "lastUpdated", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "investor", "type": "address"}],
    "name": "getInvestorPortfolio",
    "outputs": [{"internalType": "uint32[]", "name": "", "type": "uint32[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  // Events
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "companyId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "owner", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "name", "type": "string"}
    ],
    "name": "CompanyCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "investmentId", "type": "uint256"},
      {"indexed": true, "internalType": "uint256", "name": "companyId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "investor", "type": "address"},
      {"indexed": false, "internalType": "uint32", "name": "amount", "type": "uint32"}
    ],
    "name": "InvestmentMade",
    "type": "event"
  }
] as const;

// Utility functions for contract interaction
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatAmount = (amount: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

export const formatShares = (shares: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(shares);
};

export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(2)}%`;
};

export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

