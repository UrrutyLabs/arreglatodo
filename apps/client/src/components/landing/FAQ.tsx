"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Card } from "@repo/ui";
import { Text } from "@repo/ui";
import { Button } from "@repo/ui";

import type { FAQItem } from "@repo/content";

interface FAQProps {
  title: string;
  description: string;
  items: FAQItem[];
  showContactCTA?: boolean;
  ctaText?: string;
  ctaHref?: string;
}

export function FAQ({
  title,
  description,
  items,
  showContactCTA = true,
  ctaText = "Contactanos",
  ctaHref = "#contacto",
}: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(
    new Set([0, 1, 2, 3]) // First 4 questions expanded by default
  );

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Text variant="h1" className="mb-4 text-primary">
              {title}
            </Text>
            <Text variant="body" className="text-muted">
              {description}
            </Text>
          </div>

          <div className="space-y-4 mb-8">
            {items.map((item, index) => {
              const isOpen = openItems.has(index);
              return (
                <Card key={index} className="overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-surface/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <Text variant="h2" className="text-text pr-4 text-lg">
                      {item.question}
                    </Text>
                    <ChevronDown
                      className={`w-5 h-5 text-muted shrink-0 transition-transform ${
                        isOpen ? "transform rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  <div
                    id={`faq-answer-${index}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                    aria-hidden={!isOpen}
                  >
                    <div className="px-4 pb-4">
                      <Text variant="body" className="text-muted leading-relaxed">
                        {item.answer}
                      </Text>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {showContactCTA && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-muted" />
                <Text variant="body" className="text-muted">
                  ¿Tenés otra duda?
                </Text>
              </div>
              <div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    window.location.href = ctaHref;
                  }}
                  className="text-primary"
                >
                  {ctaText}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
