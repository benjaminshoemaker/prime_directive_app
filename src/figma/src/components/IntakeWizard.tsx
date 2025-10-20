import { useState } from "react";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Progress } from "./ui/progress";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface IntakeData {
  zipCode: string;
  householdSize: string;
  monthlyIncome: number;
  hasHighInterestDebt: string;
  hasEmployerMatch: string;
  emergencyFundMonths: number;
}

interface IntakeWizardProps {
  onComplete: (data: IntakeData) => void;
  onBack: () => void;
}

export function IntakeWizard({ onComplete, onBack }: IntakeWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<IntakeData>({
    zipCode: "",
    householdSize: "",
    monthlyIncome: 3000,
    hasHighInterestDebt: "",
    hasEmployerMatch: "",
    emergencyFundMonths: 0,
  });

  const totalSteps = 6;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return data.zipCode.length === 5;
      case 1:
        return data.householdSize !== "";
      case 2:
        return data.monthlyIncome > 0;
      case 3:
        return data.hasHighInterestDebt !== "";
      case 4:
        return data.hasEmployerMatch !== "";
      case 5:
        return true; // Emergency fund can be skipped
      default:
        return false;
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(0);

  const goNext = () => {
    setDirection(1);
    handleNext();
  };

  const goBack = () => {
    setDirection(-1);
    handleBack();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Progress */}
      <div className="px-4 py-6 border-b bg-white sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={goBack}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <Progress value={progress} className="h-2" />
            </div>
            <span className="text-sm text-muted-foreground">
              {currentStep + 1}/{totalSteps}
            </span>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 px-4 py-8 overflow-hidden">
        <div className="max-w-md mx-auto h-full flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex-1 flex flex-col"
            >
              {currentStep === 0 && (
                <div className="space-y-8">
                  <div className="text-center space-y-3">
                    <h2 className="text-2xl" style={{ fontWeight: 700 }}>
                      What's your ZIP code?
                    </h2>
                    <p className="text-muted-foreground">
                      This helps us understand your area's cost of living.
                    </p>
                  </div>
                  <div className="max-w-xs mx-auto">
                    <Input
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      placeholder="12345"
                      value={data.zipCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setData({ ...data, zipCode: value });
                      }}
                      className="h-14 text-center text-lg"
                    />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center space-y-3">
                    <h2 className="text-2xl" style={{ fontWeight: 700 }}>
                      Household size?
                    </h2>
                    <p className="text-muted-foreground">
                      Including yourself and any dependents.
                    </p>
                  </div>
                  <RadioGroup
                    value={data.householdSize}
                    onValueChange={(value) =>
                      setData({ ...data, householdSize: value })
                    }
                    className="space-y-3"
                  >
                    {["1", "2", "3", "4", "5+"].map((size) => (
                      <div
                        key={size}
                        className="flex items-center space-x-3 bg-secondary rounded-lg p-4 cursor-pointer hover:bg-secondary/80 transition-colors"
                        onClick={() => setData({ ...data, householdSize: size })}
                      >
                        <RadioGroupItem value={size} id={`size-${size}`} />
                        <Label
                          htmlFor={`size-${size}`}
                          className="flex-1 cursor-pointer"
                        >
                          {size} {size === "1" ? "person" : "people"}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center space-y-3">
                    <h2 className="text-2xl" style={{ fontWeight: 700 }}>
                      Monthly take-home income?
                    </h2>
                    <p className="text-muted-foreground">
                      After taxes and deductions.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl text-primary" style={{ fontWeight: 700 }}>
                        ${data.monthlyIncome.toLocaleString()}
                      </div>
                    </div>
                    <Slider
                      value={[data.monthlyIncome]}
                      onValueChange={([value]) =>
                        setData({ ...data, monthlyIncome: value })
                      }
                      min={500}
                      max={15000}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>$500</span>
                      <span>$15,000+</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="text-center space-y-3">
                    <h2 className="text-2xl" style={{ fontWeight: 700 }}>
                      Do you have high-interest debt?
                    </h2>
                    <p className="text-muted-foreground">
                      Credit cards, payday loans, or debt over 10% APR.
                    </p>
                  </div>
                  <RadioGroup
                    value={data.hasHighInterestDebt}
                    onValueChange={(value) =>
                      setData({ ...data, hasHighInterestDebt: value })
                    }
                    className="space-y-3"
                  >
                    {[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                      { value: "unsure", label: "Not sure" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-3 bg-secondary rounded-lg p-4 cursor-pointer hover:bg-secondary/80 transition-colors"
                        onClick={() =>
                          setData({ ...data, hasHighInterestDebt: option.value })
                        }
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`debt-${option.value}`}
                        />
                        <Label
                          htmlFor={`debt-${option.value}`}
                          className="flex-1 cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="text-center space-y-3">
                    <h2 className="text-2xl" style={{ fontWeight: 700 }}>
                      Employer retirement match?
                    </h2>
                    <p className="text-muted-foreground">
                      Does your employer match 401(k) or similar contributions?
                    </p>
                  </div>
                  <RadioGroup
                    value={data.hasEmployerMatch}
                    onValueChange={(value) =>
                      setData({ ...data, hasEmployerMatch: value })
                    }
                    className="space-y-3"
                  >
                    {[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                      { value: "unsure", label: "Not sure" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-3 bg-secondary rounded-lg p-4 cursor-pointer hover:bg-secondary/80 transition-colors"
                        onClick={() =>
                          setData({ ...data, hasEmployerMatch: option.value })
                        }
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`match-${option.value}`}
                        />
                        <Label
                          htmlFor={`match-${option.value}`}
                          className="flex-1 cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-8">
                  <div className="text-center space-y-3">
                    <h2 className="text-2xl" style={{ fontWeight: 700 }}>
                      Emergency fund coverage?
                    </h2>
                    <p className="text-muted-foreground">
                      How many months of expenses do you have saved?
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl text-primary" style={{ fontWeight: 700 }}>
                        {data.emergencyFundMonths === 0
                          ? "None"
                          : data.emergencyFundMonths === 6
                          ? "6+ months"
                          : `${data.emergencyFundMonths} ${
                              data.emergencyFundMonths === 1 ? "month" : "months"
                            }`}
                      </div>
                    </div>
                    <Slider
                      value={[data.emergencyFundMonths]}
                      onValueChange={([value]) =>
                        setData({ ...data, emergencyFundMonths: value })
                      }
                      min={0}
                      max={6}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>None</span>
                      <span>6+ months</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Next Button - Pinned to bottom */}
          <div className="mt-8 pt-4">
            <Button
              onClick={goNext}
              disabled={!canProceed()}
              size="lg"
              className="w-full h-14"
            >
              {currentStep === totalSteps - 1 ? "See My Plan →" : "Next →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
