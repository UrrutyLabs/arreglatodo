"use client";

import { ReactNode } from "react";
import { Check } from "lucide-react";
import { Text } from "@repo/ui";

interface WizardStep {
  number: number;
  label: string;
  isComplete: boolean;
  isActive: boolean;
}

interface WizardLayoutProps {
  currentStep: number;
  stepLabels: string[];
  children: ReactNode;
}

export function WizardLayout({
  currentStep,
  stepLabels,
  children,
}: WizardLayoutProps) {
  const steps: WizardStep[] = stepLabels.map((label, index) => ({
    number: index + 1,
    label,
    isComplete: index + 1 < currentStep,
    isActive: index + 1 === currentStep,
  }));

  return (
    <div className="min-h-screen bg-bg">
      <div className="px-4 py-4 md:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Step Indicator - Mobile */}
          <div className="md:hidden mb-4 md:mb-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        step.isComplete
                          ? "bg-primary text-white"
                          : step.isActive
                            ? "bg-primary text-white"
                            : "bg-surface border-2 border-border text-muted"
                      }`}
                    >
                      {step.isComplete ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <Text
                      variant="xs"
                      className={`mt-1 text-center ${
                        step.isActive
                          ? "text-primary font-medium"
                          : "text-muted"
                      }`}
                    >
                      {step.label}
                    </Text>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-2">
                      <div
                        className={`h-0.5 ${
                          step.isComplete ? "bg-primary" : "bg-border"
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Indicator - Desktop */}
          <div className="hidden md:flex items-center mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      step.isComplete
                        ? "bg-primary text-white"
                        : step.isActive
                          ? "bg-primary text-white"
                          : "bg-surface border-2 border-border text-muted"
                    }`}
                  >
                    {step.isComplete ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="ml-3">
                    <Text
                      variant="small"
                      className={`${
                        step.isActive
                          ? "text-primary font-medium"
                          : "text-muted"
                      }`}
                    >
                      Paso {step.number}
                    </Text>
                    <Text
                      variant="body"
                      className={`font-medium ${
                        step.isActive ? "text-text" : "text-muted"
                      }`}
                    >
                      {step.label}
                    </Text>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div
                      className={`h-0.5 ${
                        step.isComplete ? "bg-primary" : "bg-border"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Content */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
