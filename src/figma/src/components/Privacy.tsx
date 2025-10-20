import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Shield, X } from "lucide-react";

interface PrivacyProps {
  onClose: () => void;
}

export function Privacy({ onClose }: PrivacyProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-2xl" style={{ fontWeight: 700 }}>
              Privacy & Disclaimer
            </h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="p-6">
            <h2 className="mb-4" style={{ fontWeight: 700 }}>
              Educational Purpose Only
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                NextStep Money v0.1 is an educational tool designed to help you
                understand personal finance principles based on the Prime Directive of
                Personal Finance.
              </p>
              <p>
                This tool provides general guidance and is not personalized financial
                advice. For specific financial planning, please consult with a certified
                financial advisor.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4" style={{ fontWeight: 700 }}>
              No Data Storage
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Your privacy is important to us. All information you enter stays in your
                browser session only. We do not:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="list-disc">Store your data on our servers</li>
                <li className="list-disc">Track your personal information</li>
                <li className="list-disc">Share your data with third parties</li>
                <li className="list-disc">Require account creation or login</li>
              </ul>
              <p>
                When you close this page or restart the quiz, all your information is
                permanently deleted.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4" style={{ fontWeight: 700 }}>
              No Financial Services
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>NextStep Money does not:</p>
              <ul className="space-y-2 ml-6">
                <li className="list-disc">Connect to your bank accounts</li>
                <li className="list-disc">Handle any financial transactions</li>
                <li className="list-disc">Provide investment management</li>
                <li className="list-disc">Offer tax or legal advice</li>
              </ul>
              <p>
                This is a guidance tool only. All financial decisions and actions are
                your own responsibility.
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-accent/10 border-accent/20">
            <h2 className="mb-4" style={{ fontWeight: 700 }}>
              The Prime Directive
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                The advice provided is based on the widely-recognized Prime Directive of
                Personal Finance:
              </p>
              <p className="italic pl-4 border-l-2 border-accent">
                "Avoid committing future funds to spending obligations; commit them to
                saving obligations."
              </p>
              <p>
                This principle emphasizes building financial security through systematic
                saving and smart debt management before pursuing growth investments.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4" style={{ fontWeight: 700 }}>
              Questions or Feedback?
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                This is version 0.1 — a minimal viable product designed for education
                and awareness.
              </p>
              <p>
                Future versions may include progress tracking, reminders, and
                personalized resources, but will always maintain your privacy and data
                security.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <Button onClick={onClose} className="w-full" variant="outline">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
