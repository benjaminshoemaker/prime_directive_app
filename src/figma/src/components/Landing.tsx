import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Target, Shield, Zap } from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Logo */}
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl" style={{ fontWeight: 700 }}>
              NextStep Money
            </h1>
            <p className="text-xl text-muted-foreground">
              Take control in 60 seconds.
            </p>
          </div>

          {/* CTA Button */}
          <Button
            onClick={onStart}
            size="lg"
            className="w-full h-14 text-lg"
          >
            Start →
          </Button>

          {/* Mini Cards */}
          <div className="space-y-4 pt-8">
            <Card className="p-4 bg-secondary border-none shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm">
                    <span style={{ fontWeight: 600 }}>Spend future money carefully.</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Commit to saving, not spending.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-secondary border-none shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm">
                    <span style={{ fontWeight: 600 }}>Build safety before growth.</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Emergency funds protect your future.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-secondary border-none shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm">
                    <span style={{ fontWeight: 600 }}>Automate once you can.</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Make smart money habits effortless.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-4 border-t">
        <div className="max-w-md mx-auto flex justify-center gap-6 text-sm text-muted-foreground">
          <button className="hover:text-foreground transition-colors">
            Privacy
          </button>
          <button className="hover:text-foreground transition-colors">
            About
          </button>
        </div>
      </footer>
    </div>
  );
}
