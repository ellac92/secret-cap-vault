import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMakeInvestment, useTransactionStatus } from '@/hooks/useContract';
import { formatAmount, formatShares } from '@/utils/contract';
import { Company } from '@/types/contract';
import { Lock, DollarSign, TrendingUp, Users } from 'lucide-react';

interface InvestmentModalProps {
  company: Company;
  children: React.ReactNode;
}

export const InvestmentModal = ({ company, children }: InvestmentModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [shares, setShares] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { makeInvestment, hash, error, isPending } = useMakeInvestment();
  const { isLoading: isConfirming } = useTransactionStatus(hash);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !shares) return;

    setIsSubmitting(true);
    try {
      // In a real implementation, this would encrypt the values using FHE
      const encryptedAmount = new Uint8Array(32); // Placeholder for encrypted amount
      const encryptedShares = new Uint8Array(32); // Placeholder for encrypted shares
      const inputProof = new Uint8Array(64); // Placeholder for proof

      await makeInvestment(
        company.id,
        parseFloat(amount),
        parseInt(shares),
        encryptedAmount,
        encryptedShares,
        inputProof
      );
      
      setIsOpen(false);
      setAmount('');
      setShares('');
    } catch (err) {
      console.error('Investment failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateShares = (investmentAmount: number) => {
    if (!investmentAmount || !company.currentValuation) return 0;
    return Math.floor((investmentAmount / company.currentValuation) * company.totalShares);
  };

  const calculateAmount = (shareCount: number) => {
    if (!shareCount || !company.totalShares || !company.currentValuation) return 0;
    return (shareCount / company.totalShares) * company.currentValuation;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Invest in {company.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{company.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    Current Valuation
                  </div>
                  <div className="font-semibold text-lg">
                    {formatAmount(company.currentValuation)}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    Total Raised
                  </div>
                  <div className="font-semibold text-lg">
                    {formatAmount(company.totalRaised)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{company.investorCount} investors</span>
                <Badge variant="outline" className="ml-auto">
                  {company.isVerified ? 'Verified' : 'Pending Verification'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Investment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Investment Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="10000"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    const investmentAmount = parseFloat(e.target.value);
                    if (investmentAmount) {
                      setShares(calculateShares(investmentAmount).toString());
                    }
                  }}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shares">Shares</Label>
                <Input
                  id="shares"
                  type="number"
                  placeholder="222"
                  value={shares}
                  onChange={(e) => {
                    setShares(e.target.value);
                    const shareCount = parseInt(e.target.value);
                    if (shareCount) {
                      setAmount(calculateAmount(shareCount).toString());
                    }
                  }}
                  required
                />
              </div>
            </div>

            {/* Investment Summary */}
            {amount && shares && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Investment Amount:</span>
                      <span className="font-semibold">{formatAmount(parseFloat(amount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Shares:</span>
                      <span className="font-semibold">{formatShares(parseInt(shares))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Ownership %:</span>
                      <span className="font-semibold">
                        {((parseInt(shares) / company.totalShares) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error Display */}
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error.message}
              </div>
            )}

            {/* Transaction Status */}
            {hash && (
              <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                {isConfirming ? 'Confirming transaction...' : 'Transaction submitted!'}
                <br />
                <span className="font-mono text-xs">{hash}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!amount || !shares || isPending || isSubmitting || isConfirming}
                className="flex-1"
              >
                {isPending || isSubmitting || isConfirming ? 'Processing...' : 'Invest Now'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

