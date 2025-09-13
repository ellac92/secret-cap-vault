import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletConnect } from "@/components/WalletConnect";
import { InvestmentCard } from "@/components/InvestmentCard";
import { useContractState } from "@/hooks/useContract";
import { Shield, Zap, Eye, ChevronRight, Lock, TrendingUp, Users } from "lucide-react";
import heroImage from "@/assets/hero-investment.jpg";

const Index = () => {
  const { companies, loading, error } = useContractState();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Secret Cap Vault</span>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Invest Privately,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-glow to-primary-glow">
                Scale Publicly
              </span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Revolutionary on-chain funding platform with encrypted cap tables, 
              protecting valuation secrecy while enabling transparent investment tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="hero" size="xl" className="animate-float">
                Explore Opportunities
                <ChevronRight className="h-5 w-5" />
              </Button>
              <Button variant="outline-hero" size="xl">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Revolutionary Investment Infrastructure</h2>
            <p className="text-xl text-muted-foreground">
              Built for the next generation of private market investments with blockchain security and privacy.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="group hover:shadow-glow transition-all duration-300 border-primary/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Encrypted Cap Tables</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Advanced encryption protects sensitive valuation data while maintaining investment transparency on-chain.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-glow transition-all duration-300 border-accent/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-success rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Instant Settlement</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Smart contracts enable immediate fund deployment and equity distribution without traditional delays.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-glow transition-all duration-300 border-financial-blue/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-financial-blue rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Privacy First</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Selective transparency ensures investor privacy while meeting regulatory compliance requirements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Investment Opportunities */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Featured Investment Opportunities</h2>
            <p className="text-xl text-muted-foreground">
              Exclusive access to pre-vetted startups with confidential valuations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="text-muted-foreground">Loading investment opportunities...</div>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-8">
                <div className="text-destructive">Error loading companies: {error}</div>
              </div>
            ) : companies.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <div className="text-muted-foreground">No investment opportunities available at the moment.</div>
              </div>
            ) : (
              companies.map((company, index) => (
                <InvestmentCard
                  key={company.id}
                  company={company}
                  sector={index === 0 ? "Artificial Intelligence" : index === 1 ? "Cybersecurity" : "Clean Energy"}
                  status={index === 0 ? "open" : index === 1 ? "closing" : "closed"}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">$2.4B+</div>
              <div className="text-muted-foreground">Total Funding Raised</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">450+</div>
              <div className="text-muted-foreground">Funded Startups</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-success mb-2">15K+</div>
              <div className="text-muted-foreground">Active Investors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-financial-blue mb-2">98%</div>
              <div className="text-muted-foreground">Privacy Score</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Secret Cap Vault</span>
            </div>
            <p className="text-muted-foreground text-center md:text-right">
              © 2024 Secret Cap Vault. Revolutionizing private market investments.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;