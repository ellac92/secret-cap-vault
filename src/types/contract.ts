// Contract types and interfaces
export interface Company {
  id: number;
  name: string;
  description: string;
  totalShares: number;
  currentValuation: number;
  totalRaised: number;
  investorCount: number;
  isActive: boolean;
  isVerified: boolean;
  owner: string;
  createdAt: number;
  updatedAt: number;
}

export interface Investment {
  id: number;
  amount: number;
  shares: number;
  valuation: number;
  investor: string;
  timestamp: number;
  isActive: boolean;
}

export interface CapTableEntry {
  id: number;
  shares: number;
  percentage: number;
  holder: string;
  isEncrypted: boolean;
  timestamp: number;
}

export interface ReputationScore {
  score: number;
  totalInvestments: number;
  successfulExits: number;
  isVerified: boolean;
  lastUpdated: number;
}

export interface InvestmentFormData {
  companyId: number;
  amount: number;
  shares: number;
}

export interface CompanyFormData {
  name: string;
  description: string;
  totalShares: number;
  initialValuation: number;
}

