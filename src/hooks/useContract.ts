import { useState, useEffect } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/utils/contract';
import { Company, Investment, ReputationScore } from '@/types/contract';

// Hook for reading company information
export const useCompany = (companyId: number) => {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getCompanyInfo',
    args: [BigInt(companyId)],
  });
};

// Hook for reading investment information
export const useInvestment = (investmentId: number) => {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getInvestmentInfo',
    args: [BigInt(investmentId)],
  });
};

// Hook for reading investor reputation
export const useInvestorReputation = (investorAddress: string) => {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getInvestorReputation',
    args: [investorAddress as `0x${string}`],
  });
};

// Hook for reading investor portfolio
export const useInvestorPortfolio = (investorAddress: string) => {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getInvestorPortfolio',
    args: [investorAddress as `0x${string}`],
  });
};

// Hook for creating a company
export const useCreateCompany = () => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  
  const createCompany = async (
    name: string,
    description: string,
    totalShares: number,
    initialValuation: number
  ) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'createCompany',
        args: [name, description, BigInt(totalShares), BigInt(initialValuation)],
      });
    } catch (err) {
      console.error('Error creating company:', err);
      throw err;
    }
  };

  return {
    createCompany,
    hash,
    error,
    isPending,
  };
};

// Hook for making an investment
export const useMakeInvestment = () => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  
  const makeInvestment = async (
    companyId: number,
    amount: number,
    shares: number,
    encryptedAmount: Uint8Array,
    encryptedShares: Uint8Array,
    inputProof: Uint8Array
  ) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'makeInvestment',
        args: [
          BigInt(companyId),
          encryptedAmount,
          encryptedShares,
          inputProof,
        ],
        value: BigInt(amount), // ETH value for the investment
      });
    } catch (err) {
      console.error('Error making investment:', err);
      throw err;
    }
  };

  return {
    makeInvestment,
    hash,
    error,
    isPending,
  };
};

// Hook for waiting for transaction confirmation
export const useTransactionStatus = (hash: `0x${string}` | undefined) => {
  return useWaitForTransactionReceipt({
    hash,
  });
};

// Custom hook for managing contract state
export const useContractState = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real implementation, this would fetch from the contract
      // For now, we'll use mock data
      const mockCompanies: Company[] = [
        {
          id: 1,
          name: "NeuralFlow AI",
          description: "Advanced AI solutions for enterprise",
          totalShares: 1000000,
          currentValuation: 45000000,
          totalRaised: 12500000,
          investorCount: 127,
          isActive: true,
          isVerified: true,
          owner: "0x...",
          createdAt: Date.now() / 1000,
          updatedAt: Date.now() / 1000,
        },
        {
          id: 2,
          name: "CryptoSecure",
          description: "Next-generation cybersecurity platform",
          totalShares: 800000,
          currentValuation: 28000000,
          totalRaised: 8200000,
          investorCount: 89,
          isActive: true,
          isVerified: true,
          owner: "0x...",
          createdAt: Date.now() / 1000,
          updatedAt: Date.now() / 1000,
        },
      ];
      setCompanies(mockCompanies);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvestments = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real implementation, this would fetch from the contract
      // For now, we'll use mock data
      const mockInvestments: Investment[] = [
        {
          id: 1,
          amount: 100000,
          shares: 2222,
          valuation: 45000000,
          investor: "0x...",
          timestamp: Date.now() / 1000,
          isActive: true,
        },
      ];
      setInvestments(mockInvestments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch investments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchInvestments();
  }, []);

  return {
    companies,
    investments,
    loading,
    error,
    refetch: () => {
      fetchCompanies();
      fetchInvestments();
    },
  };
};
