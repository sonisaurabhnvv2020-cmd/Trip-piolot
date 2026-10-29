import React, { useState } from 'react';
import { DollarSign, Users, TrendingUp, Globe, Sparkles, ShieldCheck, HeartHandshake, Zap } from 'lucide-react';

export const RevenueCalculator: React.FC = () => {
  const [monthlyPrice, setMonthlyPrice] = useState<number>(0.99);
  const [annualPrice, setAnnualPrice] = useState<number>(7.99);
  const [subscriberCount, setSubscriberCount] = useState<number>(35000);
  const [annualPercentage, setAnnualPercentage] = useState<number>(30); // 30% take annual pass

  // Computations
  const monthlySubscribers = Math.round(subscriberCount * (1 - annualPercentage / 100));
  const annualSubscribers = Math.round(subscriberCount * (annualPercentage / 100));

  const monthlyMRRFromMonthly = monthlySubscribers * monthlyPrice;
  const monthlyMRRFromAnnual = (annualSubscribers * annualPrice) / 12;
  const totalMRR = monthlyMRRFromMonthly + monthlyMRRFromAnnual;
  const totalARR = totalMRR * 12;

  // Estimated server & AI API inference costs (~$0.05 per active user per month)
  const estimatedCost = subscriberCount * 0.05;
  const netGrossMarginPercent = Math.max(0, Math.round(((totalMRR - estimatedCost) / totalMRR) * 100));

  const applyPreset = (count: number, price: number) => {
    setSubscriberCount(count);
    setMonthlyPrice(price);
  };

  return (
    <div className="space-y-6">
      {/* Header Intro */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Common-Man Friendly Micro-Pricing Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              Global Revenue & Mass-Adoption Simulator
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              By keeping the price at an affordable micro-value like <strong>$0.99 / month</strong> (cheaper than a single cup of tea or bus ticket), anyone in the world can easily afford it without financial hesitation. High volume creates enormous recurring revenue.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyPreset(10000, 0.99)}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
            >
              10K Users
            </button>
            <button
              onClick={() => applyPreset(50000, 0.99)}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
            >
              50K Users
            </button>
            <button
              onClick={() => applyPreset(150000, 0.99)}
              className="px-2.5 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-800/80 rounded-lg transition-colors"
            >
              150K Users
            </button>
          </div>
        </div>
      </div>

      {/* 4 Financial Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Recurring Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Monthly Revenue (MRR)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white mt-2">
            ${Math.round(totalMRR).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Predictable recurring cash flow every month</p>
        </div>

        {/* Annual Recurring Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Annual Run Rate (ARR)</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-400 mt-2">
            ${Math.round(totalARR).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Total projected annual earnings</p>
        </div>

        {/* Active Subscribers */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Active Commuters</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white mt-2">
            {subscriberCount.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Global daily commuters & drivers</p>
        </div>

        {/* Software Gross Margin */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Net Gross Margin</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-purple-300 mt-2">
            ~{netGrossMarginPercent}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">High software leverage after AI API costs</p>
        </div>
      </div>

      {/* Interactive Controls & Economics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Interactive Financial Sliders</span>
          </h3>

          {/* Slider 1: Active Commuter Subscribers */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Total Active Subscribed Users:</span>
              <span className="font-mono font-bold text-white text-sm bg-slate-800 px-2.5 py-0.5 rounded">
                {subscriberCount.toLocaleString()} users
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="200000"
              step="1000"
              value={subscriberCount}
              onChange={(e) => setSubscriberCount(Number(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1,000 (Local Launch)</span>
              <span>50,000 (Major Metro)</span>
              <span>200,000 (Global Fleet)</span>
            </div>
          </div>

          {/* Slider 2: Monthly Micro-Price */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Monthly Pocket Commuter Price:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm bg-slate-800 px-2.5 py-0.5 rounded">
                ${monthlyPrice.toFixed(2)} / mo
              </span>
            </div>
            <input
              type="range"
              min="0.49"
              max="2.99"
              step="0.10"
              value={monthlyPrice}
              onChange={(e) => setMonthlyPrice(Number(e.target.value))}
              className="w-full accent-emerald-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$0.49 (Ultra-Frictionless)</span>
              <span>$0.99 (Recommended Sweet Spot)</span>
              <span>$2.99 (Premium Cap)</span>
            </div>
          </div>

          {/* Slider 3: Annual Pass Price */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Annual Super-Saver Pass:</span>
              <span className="font-mono font-bold text-white text-sm bg-slate-800 px-2.5 py-0.5 rounded">
                ${annualPrice.toFixed(2)} / yr
              </span>
            </div>
            <input
              type="range"
              min="4.99"
              max="19.99"
              step="0.50"
              value={annualPrice}
              onChange={(e) => setAnnualPrice(Number(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          {/* Annual Adopters Ratio */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Commuters Choosing Annual Pass:</span>
              <span className="font-mono font-bold text-white text-sm bg-slate-800 px-2.5 py-0.5 rounded">
                {annualPercentage}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              step="5"
              value={annualPercentage}
              onChange={(e) => setAnnualPercentage(Number(e.target.value))}
              className="w-full accent-purple-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Right Column: Why Micro-Pricing Wins */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
              Why the "Common Man" Model Generates More Money
            </h4>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="text-emerald-400">01.</span>
                <span>Zero Subscription Resistance</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                At $0.99/month (or ~₹79 in India / €0.99 in EU), people subscribe instantly without having to think or review their budget.
              </p>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="text-cyan-400">02.</span>
                <span>Mass Global Addressable Market</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Over 1.2 billion people commute daily worldwide. Capturing just 0.01% of that population equals 120,000 paying users (~$1.4M ARR).
              </p>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="text-purple-400">03.</span>
                <span>Near-Zero Churn</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Because it saves them 15 to 30 minutes of stressful traffic every single day, users never cancel a $0.99 plan.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Target Launch Price:</span>
            <span className="font-bold font-mono text-emerald-400">$0.99 / user / month</span>
          </div>
        </div>
      </div>
    </div>
  );
};
