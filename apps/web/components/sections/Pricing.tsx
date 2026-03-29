"use client";

import { Card, CardContent, CardHeader } from "@aicaller/ui";
import NumberFlow from "@number-flow/react";
import { CheckCheck } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { DASHBOARD_URL } from "@/lib/urls";

const plans = [
  {
    name: "Starter",
    description: "For trying CallMind and building your first agent.",
    price: 0,
    yearlyPrice: 0,
    priceLabel: "Free",
    period: "forever",
    buttonText: "Get started free",
    buttonHref: `${DASHBOARD_URL}/signup`,
    buttonVariant: "outline",
    popular: false,
    features: [
      "1 AI agent",
      "1 knowledge base",
      "Up to 50 calls / month",
      "Basic conversation logs",
      "Community support",
    ],
  },
  {
    name: "Pro",
    description: "For businesses that need reliable AI call handling at scale.",
    price: 2999,
    yearlyPrice: 28790, // roughly 20% off yearly
    pricePrefix: "₹",
    period: "per month",
    yearlyPeriod: "per year",
    buttonText: "Start Pro trial",
    buttonHref: `${DASHBOARD_URL}/signup?plan=pro`,
    buttonVariant: "default",
    popular: false,
    features: [
      "Unlimited agents",
      "Unlimited knowledge bases",
      "500 calls / month included",
      "Full conversation transcripts",
      "Summary editing",
      "API access + webhooks",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    description: "For large teams and high-volume deployments with custom needs.",
    price: 0,
    yearlyPrice: 0,
    priceLabel: "Custom",
    period: "tailored to you",
    buttonText: "Contact us",
    buttonHref: "mailto:hello@callmind.ai",
    buttonVariant: "outline",
    popular: false,
    features: [
      "Everything in Pro",
      "Custom call volumes",
      "Dedicated phone numbers",
      "Custom LLM / STT / TTS",
      "SLA guarantee",
      "Dedicated account manager",
      "On-premise option",
    ],
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-neutral-50 border border-gray-200 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={`relative z-10 w-fit sm:h-12 h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors ${
            selected === "0"
              ? "text-white border-4 shadow-sm shadow-[#206ce8] border-[#206ce8] bg-gradient-to-t from-[#206ce8] via-blue-500 to-[#4d8bf0]"
              : "text-muted-foreground hover:text-black"
          }`}
        >
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={`relative z-10 w-fit sm:h-12 h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors ${
            selected === "1"
              ? "text-white border-4 shadow-sm shadow-[#206ce8] border-[#206ce8] bg-gradient-to-t from-[#206ce8] via-blue-500 to-[#4d8bf0]"
              : "text-muted-foreground hover:text-black"
          }`}
        >
          <span className="relative flex items-center gap-2">
            Yearly
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${selected === "1" ? "bg-white/20 text-white" : "bg-blue-50 text-black"}`}>
              Save 20%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <section id="pricing" className="px-4 py-24 lg:py-32 min-h-screen mx-auto relative bg-neutral-100">
      <div
        className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, #206ce8 0%, transparent 70%)`,
          opacity: 0.15,
          mixBlendMode: "multiply",
        }}
      />

      <div className="text-center mb-6 max-w-3xl mx-auto">
        <h2
          className="md:text-6xl sm:text-4xl text-3xl font-bold tracking-tight text-[#1e1e1e] mb-4"
        >
          Simple, honest pricing
        </h2>

        <p
          className="sm:text-base text-sm text-gray-500 sm:w-[70%] w-[80%] mx-auto"
        >
          Start free, scale when you need to. No hidden fees. No per-minute billing surprises.
        </p>
      </div>

      <div>
        <PricingSwitch onSwitch={togglePricingPeriod} />
      </div>

      <div className="grid md:grid-cols-3 max-w-7xl gap-6 py-12 mx-auto relative z-10">
        {plans.map((plan, index) => (
          <div
            key={plan.name}
          >
            <Card
              className="relative h-full flex flex-col border-neutral-200 transition-all bg-white"
            >
              <CardHeader className="text-left pb-4">
                <div className="flex justify-between items-center mb-2 h-8">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {plan.name}
                  </h3>
                </div>
                <div className="flex items-baseline mb-2 min-h-[48px]">
                  {plan.priceLabel ? (
                    <span className="text-4xl font-bold text-gray-900 tracking-tight">
                      {plan.priceLabel}
                    </span>
                  ) : (
                    <span className="text-4xl font-bold text-gray-900 tracking-tight flex items-baseline">
                      <span className="text-3xl mr-1">{plan.pricePrefix}</span>
                      <NumberFlow
                        value={isYearly ? plan.yearlyPrice : plan.price}
                        className="text-4xl font-bold"
                      />
                    </span>
                  )}
                  <span className="text-gray-500 ml-2 text-sm">
                    / {isYearly && plan.yearlyPeriod ? plan.yearlyPeriod : plan.period}
                  </span>
                </div>
                <p className="text-sm text-gray-500 h-[60px]">{plan.description}</p>
              </CardHeader>

              <CardContent className="pt-0 flex-1 flex flex-col">
                <Link
                  href={plan.buttonHref}
                  className={`block w-full text-center py-2 px-4 text-sm font-medium rounded-full transition-all mb-6 text-white border-4 shadow-sm shadow-[#206ce8] border-[#206ce8] bg-gradient-to-t from-[#206ce8] via-blue-500 to-[#4d8bf0] hover:brightness-110`}
                >
                  {plan.buttonText}
                </Link>
                
                <div className="h-px bg-gray-100 mb-6" />

                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <span className="h-5 w-5 rounded-full bg-[#f0f5ff] text-[#206ce8] flex items-center justify-center shrink-0 mr-3 mt-0.5">
                        <CheckCheck strokeWidth={3} className="h-3 w-3" />
                      </span>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}