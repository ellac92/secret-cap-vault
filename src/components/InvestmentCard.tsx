import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InvestmentModal } from "@/components/InvestmentModal";
import { TrendingUp, Lock, Users, DollarSign } from "lucide-react";
import { Company } from "@/types/contract";

interface InvestmentCardProps {
  company: Company;
  sector: string;
  status: "open" | "closing" | "closed";
  confidential?: boolean;
}

export const InvestmentCard = ({
  company,
  sector,
  status,
  confidential = true
}: InvestmentCardProps) => {
  const statusColors = {
    open: "bg-success text-success-foreground",
    closing: "bg-warning text-foreground",
    closed: "bg-muted text-muted-foreground"
  };

  return (
    <Card className="group hover:shadow-financial transition-all duration-300 border border-border/50 hover:border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-card-foreground flex items-center gap-2">
            {company.name}
            {confidential && (
              <Lock className="h-4 w-4 text-primary animate-pulse" />
            )}
          </CardTitle>
          <Badge className={statusColors[status]} variant="secondary">
            {status}
          </Badge>
        </div>
        <Badge variant="outline" className="w-fit">
          {sector}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Valuation
            </div>
            <div className="font-semibold text-lg">
              {confidential ? "•••••••" : `$${(company.currentValuation / 1000000).toFixed(1)}M`}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Progress
            </div>
            <div className="font-semibold text-lg">
              ${(company.totalRaised / 1000000).toFixed(1)}M / ${(company.currentValuation / 1000000).toFixed(1)}M
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{company.investorCount} investors</span>
        </div>
        
        <div className="pt-2">
          {status === "open" ? (
            <InvestmentModal company={company}>
              <Button 
                variant="success"
                className="w-full"
              >
                Invest Now
              </Button>
            </InvestmentModal>
          ) : (
            <Button 
              variant={status === "closing" ? "financial" : "outline"}
              className="w-full"
              disabled={status === "closed"}
            >
              {status === "closing" ? "Review Terms" : "Investment Closed"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};