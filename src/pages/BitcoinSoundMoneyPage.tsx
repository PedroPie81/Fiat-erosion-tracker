import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ShieldCheck, Flame, Coins, ArrowRight, TrendingUp, 
  Lock, CheckCircle2, AlertTriangle, Scale, Cpu, 
  HelpCircle, ChevronDown, ChevronUp, BarChart3, Globe,
  Layers, RefreshCw, Zap, DollarSign, Calculator
} from 'lucide-react';

interface MonetaryProperty {
  name: string;
  bitcoin: string;
  gold: string;
  fiat: string;
  description: string;
  winner: 'bitcoin' | 'gold' | 'fiat' | 'tie';
}

const MONETARY_PROPERTIES: MonetaryProperty[] = [
  {
    name: 'Scarcity & Supply Cap',
    bitcoin: 'Absolute: Strict 21M hard cap enforced by cryptographic consensus. 0% unexpected supply inflation.',
    gold: 'Relative: Annual mining supply increases ~1.5%–2% per year. Deep-sea & asteroid mining potential.',
    fiat: 'Zero Scarcity: Central banks can print unlimited trillions at zero marginal cost.',
    description: 'The ability of a money to resist supply dilution and preserve purchasing power across generations.',
    winner: 'bitcoin'
  },
  {
    name: 'Divisibility & Micro-Payments',
    bitcoin: 'Infinite in practice: 1 BTC = 100,000,000 Satoshis (sub-satoshi layers on Lightning Network).',
    gold: 'Poor: Difficult and costly to divide into sub-gram units for everyday grocery or coffee purchases.',
    fiat: 'Moderate: Divisible to 2 decimal places (cents/pence), highly degraded by inflation over time.',
    description: 'How easily the money can be divided into smaller denominations to facilitate precise pricing.',
    winner: 'bitcoin'
  },
  {
    name: 'Portability & Global Transfer',
    bitcoin: 'Perfect: Billions in value can be carried in 12 memory seed words or sent globally in seconds.',
    gold: 'Very Poor: Heavy, dangerous to transport, subject to customs seizure, high freight & insurance costs.',
    fiat: 'Moderate: Electronic banking exists but is subject to capital controls, wire delays, and bank freezes.',
    description: 'The ease, speed, and safety of transporting large values across international borders.',
    winner: 'bitcoin'
  },
  {
    name: 'Verifiability & Auditability',
    bitcoin: 'Instant & Free: Anyone can independently verify the entire ledger on a $50 node in seconds.',
    gold: 'Difficult: Requires chemical assays, spectrometry, melting, or drilling to detect tungsten cores.',
    fiat: 'Opaque: Fractional reserve banking means depositors cannot audit actual bank solvency.',
    description: 'How easily an ordinary merchant or citizen can authenticate genuine money without trusting third parties.',
    winner: 'bitcoin'
  },
  {
    name: 'Durability & Longevity',
    bitcoin: 'Indestructible: Exists across thousands of distributed nodes globally; immune to physical decay.',
    gold: 'Near Perfect: Does not corrode, tarnish, or decay over millennia.',
    fiat: 'Poor: Paper notes degrade physically; digital bank balances decay in purchasing power to zero.',
    description: 'Resistance to environmental damage, physical degradation, and entropy over time.',
    winner: 'tie'
  },
  {
    name: 'Censorship Resistance',
    bitcoin: 'Total: No central server, CEO, or government can freeze, reverse, or confiscate private key UTXOs.',
    gold: 'Moderate: Physical gold can be confiscated (e.g., US Executive Order 6102 in 1933).',
    fiat: 'Zero: Central banks, governments, and commercial banks can freeze, de-bank, or seize funds at will.',
    description: 'Immunity to arbitrary seizure, political weaponization, and state-sanctioned de-banking.',
    winner: 'bitcoin'
  }
];

const FAQS = [
  {
    q: 'Why is Bitcoin classified as sound money?',
    a: 'Bitcoin is classified as sound money because it fulfills every classical economic property of money (scarcity, durability, divisibility, portability, verifiability, and fungibility) while eliminating the fatal flaw of historical fiat currencies: political supply manipulation. With an immutable hard cap of 21 million units and a programmatic issuance halving every 210,000 blocks (~4 years), Bitcoin is the first engineered monetary asset with absolute mathematical scarcity.'
  },
  {
    q: 'How does Bitcoin act as an effective hedge against fiat currency erosion?',
    a: 'Fiat currency erosion occurs because central banks continuously expand the M2 money supply through quantitative easing, deficit monetization, and fractional reserve lending. As more fiat units chase the same pool of real goods and assets, the purchasing power of each dollar, pound, or euro plummets. Because Bitcoin’s supply cannot expand in response to increased demand or political pressure, capital fleeing debased fiat naturally bids up Bitcoin’s purchasing power over multi-year time horizons.'
  },
  {
    q: 'What is the Cantillon Effect, and why does fiat money printing harm everyday savers?',
    a: 'The Cantillon Effect describes the uneven distribution of newly created money in an economy. When central banks print money, the first recipients—mega-banks, government contractors, private equity funds, and institutional borrowers—spend the newly created currency at pre-inflation prices before markets adjust. By the time the new money trickles down to ordinary wage earners, retail prices for food, energy, and housing have already spiked, effectively stealing purchasing power from savers and transferring it to the financial elite.'
  },
  {
    q: 'Why is Bitcoin superior to Physical Gold for combating fiat debasement in the 21st century?',
    a: 'While gold was humanity’s sound money standard for millennia, it has physical limitations in the digital age: gold is expensive to store, dangerous to transport, difficult to audit without specialized equipment, and easily centralized in bank vaults where governments can confiscate it or issue unbacked paper claims against it. Bitcoin is purely digital, auditable by anyone in seconds on open-source hardware, instantly transferable across borders, and cannot be paper-rehypothecated if held in self-custody.'
  },
  {
    q: 'Isn’t Bitcoin too volatile in fiat terms to be a reliable store of value?',
    a: 'In the short term, Bitcoin is volatile because it is a nascent $1–2 trillion asset undergoing price discovery on an open global market. However, when measured over 4-year halving cycles (which align with its algorithmic supply schedule), Bitcoin has historically never produced a negative return for investors holding for at least four years. Its "volatility" is largely upward purchasing power expansion against melting fiat baselines.'
  },
  {
    q: 'Can the 21 million Bitcoin supply limit ever be changed or inflated?',
    a: 'Mathematically and socially, no. Changing the 21 million cap would require unanimous consensus across the global network of independent node operators, miners, developers, and economic users. Since every Bitcoin holder’s financial interest is directly harmed by supply dilution, the network participants would reject any software hard fork that attempts to print more coins, leaving any debased fork isolated and worthless.'
  }
];

const BitcoinSoundMoneyPage: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [calculatorYears, setCalculatorYears] = useState<number>(5);
  const [initialFiatAmount, setInitialFiatAmount] = useState<number>(10000);
  const [annualInflationRate, setAnnualInflationRate] = useState<number>(8); // Shadow/Real Inflation rate
  const [btcAnnualCagr, setBtcAnnualCagr] = useState<number>(35); // Conservative annualized BTC CAGR

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Calculations for interactive comparison
  const fiatErosionFactor = Math.pow(1 - annualInflationRate / 100, calculatorYears);
  const remainingPurchasingPower = Math.round(initialFiatAmount * fiatErosionFactor);
  const totalErosionPercent = Math.round((1 - fiatErosionFactor) * 100);

  const btcGrowthFactor = Math.pow(1 + btcAnnualCagr / 100, calculatorYears);
  const btcProjectedValue = Math.round(initialFiatAmount * btcGrowthFactor);
  const btcRealPurchasingPower = Math.round(btcProjectedValue * fiatErosionFactor);

  // SEO JSON-LD Structured Data Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Why Bitcoin is Sound Money: The Ultimate Hedge Against Fiat Currency Erosion",
    "description": "An in-depth economic analysis of Bitcoin as sound money, mathematical scarcity, the Cantillon Effect, and protecting purchasing power against sovereign fiat currency erosion.",
    "author": {
      "@type": "Person",
      "name": "Peter Adam J"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Fiat Erosion Tracker"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://fiat-erosion-tracker.com/bitcoin-sound-money"
    },
    "keywords": "bitcoin sound money, fiat currency erosion, hedge against inflation, purchasing power loss, cantillon effect, stock to flow bitcoin, hard money vs fiat, 21 million limit",
    "about": [
      { "@type": "Thing", "name": "Bitcoin" },
      { "@type": "Thing", "name": "Sound Money" },
      { "@type": "Thing", "name": "Fiat Currency Erosion" },
      { "@type": "Thing", "name": "Inflation Hedge" },
      { "@type": "Thing", "name": "Cantillon Effect" }
    ]
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 py-12 px-6 font-sans">
      <Helmet>
        <title>Why Bitcoin is Sound Money & The Ultimate Hedge Against Fiat Currency Erosion</title>
        <meta 
          name="description" 
          content="Discover why Bitcoin represents the ultimate sound money and generational hedge against fiat currency erosion. Explore absolute scarcity, the 21 million hard cap, the Cantillon Effect, and purchasing power preservation." 
        />
        <meta 
          name="keywords" 
          content="bitcoin sound money, fiat currency erosion, hedge against inflation, bitcoin purchasing power, cantillon effect, stock to flow, 21 million hard cap, monetary debasement hedge, store of value, gold vs bitcoin" 
        />
        <meta property="og:title" content="Why Bitcoin is Sound Money | The Antidote to Fiat Currency Erosion" />
        <meta property="og:description" content="Discover how Bitcoin's mathematical scarcity protects long-term purchasing power against unbacked fiat money printing, central bank debasement, and the Cantillon Effect." />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-xs uppercase tracking-widest text-zinc-500 font-bold">
          <Link to="/" className="text-[#f97316] hover:underline flex items-center gap-1">
            &larr; Fiat Erosion Tracker
          </Link>
          <span>/</span>
          <span className="text-zinc-400">Bitcoin Sound Money & Hedge</span>
        </div>

        {/* Hero Header */}
        <header className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#f97316] mb-3">
            <Coins className="h-4 w-4" /> Monetary Theory & Wealth Preservation
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Why Bitcoin is <span className="text-[#f97316]">Sound Money</span> and the Ultimate Hedge Against <span className="text-amber-400">Fiat Currency Erosion</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-300 font-light leading-relaxed max-w-3xl mb-8">
            Fiat currency is designed to lose value over time. Through programmatic monetary scarcity, decentralized proof-of-work, and an unalterable 21-million cap, Bitcoin provides an incorruptible mathematical refuge for savers seeking to preserve generational purchasing power.
          </p>

          {/* Quick Pillar Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-800/80">
            <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
              <div className="text-xs uppercase text-zinc-500 font-bold flex items-center gap-1.5 mb-1">
                <Lock className="h-3.5 w-3.5 text-[#f97316]" /> Absolute Scarcity
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">21,000,000</div>
              <div className="text-xs text-zinc-400 mt-1">Zero arbitrary supply inflation forever</div>
            </div>

            <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
              <div className="text-xs uppercase text-zinc-500 font-bold flex items-center gap-1.5 mb-1">
                <Cpu className="h-3.5 w-3.5 text-amber-500" /> Decentralized Consensus
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">50,000+ Nodes</div>
              <div className="text-xs text-zinc-400 mt-1">No CEO, no central bank, no single point of failure</div>
            </div>

            <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
              <div className="text-xs uppercase text-zinc-500 font-bold flex items-center gap-1.5 mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> Anti-Cantillon Asset
              </div>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono">100% Equal</div>
              <div className="text-xs text-zinc-400 mt-1">Identical monetary rules for every human on Earth</div>
            </div>
          </div>
        </header>

        {/* Section 1: The Anatomy of Fiat Currency Erosion */}
        <section className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 md:p-10 mb-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-500 mb-2">
            <Flame className="h-4 w-4" /> The Mechanics of Monetary Dilution
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Understanding Fiat Currency Erosion & The Cantillon Effect
          </h2>
          <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-6">
            Most people assume that prices rise because businesses get greedier. In reality, prices rise because the unit of account (fiat paper currency) is being manufactured in limitless quantities by central banks and commercial fractional-reserve lenders.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-zinc-950/70 border border-zinc-800/80 p-6 rounded-2xl">
              <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-400" /> The Stealth Tax of Fiat Expansion
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                When a government runs multitrillion-dollar budget deficits, it borrows by issuing Treasury bonds. When tax revenue is insufficient to pay those bonds, the central bank prints new reserves to monetize the sovereign debt.
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                This silently dilutes every existing dollar, euro, or pound in circulation. It acts as an unlegislated, regressive wealth tax that disproportionately hurts the working class and fixed-income pensioners who cannot afford hard financial assets.
              </p>
            </div>

            <div className="bg-zinc-950/70 border border-zinc-800/80 p-6 rounded-2xl">
              <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
                <Scale className="h-4 w-4 text-amber-400" /> The Cantillon Effect (Structural Inequality)
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                Named after 18th-century economist Richard Cantillon, this principle explains that newly printed money does not enter the economy evenly.
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Institutions closest to the central bank (Wall Street banks, defense contractors, primary dealers) receive newly created money first and spend it before consumer prices adjust. By the time that money filters down into average paychecks, prices for housing, groceries, and healthcare have already expanded.
              </p>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-r from-rose-950/30 to-zinc-950 border border-rose-900/40 rounded-2xl text-xs leading-relaxed text-zinc-300 flex items-start gap-3">
            <Flame className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-rose-400 font-bold uppercase tracking-wider block mb-1">
                The Historical Truth of Fiat Lifespans:
              </strong>
              Since the Roman Empire debased the silver Denarius to 1971 when Richard Nixon severed the US Dollar from gold, over 775 fiat currencies have existed. More than 70% collapsed to zero through hyperinflation, 20% were destroyed in wars, and the remaining surviving currencies (including USD, GBP, and EUR) have lost over 95% to 99% of their original purchasing power.
            </div>
          </div>
        </section>

        {/* Section 2: Interactive Fiat Erosion vs. Bitcoin Simulator */}
        <section className="p-6 sm:p-8 md:p-10 rounded-3xl bg-zinc-950/90 border border-zinc-800 shadow-2xl mb-12 space-y-8">
          <div className="border-b border-zinc-800/80 pb-6">
            <div className="flex items-center gap-2 text-[#f97316] text-xs font-extrabold uppercase tracking-widest mb-1">
              <Calculator className="h-4 w-4" />
              <span>Interactive Simulation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Fiat Currency Erosion vs. Bitcoin Purchasing Power Simulator
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Adjust the timeline, estimated real inflation rate, and Bitcoin compound annual growth to observe the divergence in purchasing power over time:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Controls */}
            <div className="bg-zinc-900/70 p-6 rounded-2xl border border-zinc-800 flex flex-col gap-6">
              <div>
                <label className="text-xs uppercase font-bold text-zinc-300 flex justify-between mb-2">
                  <span>Initial Capital:</span>
                  <span className="text-white font-mono font-bold">${initialFiatAmount.toLocaleString()}</span>
                </label>
                <input 
                  type="range" 
                  min="1000" 
                  max="100000" 
                  step="1000"
                  value={initialFiatAmount}
                  onChange={(e) => setInitialFiatAmount(Number(e.target.value))}
                  className="w-full accent-[#f97316] bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs uppercase font-bold text-zinc-300 flex justify-between mb-2">
                  <span>Holding Horizon:</span>
                  <span className="text-[#f97316] font-mono font-bold">{calculatorYears} Years</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  step="1"
                  value={calculatorYears}
                  onChange={(e) => setCalculatorYears(Number(e.target.value))}
                  className="w-full accent-[#f97316] bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs uppercase font-bold text-zinc-300 flex justify-between mb-2">
                  <span>Real Fiat Inflation (Annual):</span>
                  <span className="text-rose-400 font-mono font-bold">{annualInflationRate}% / yr</span>
                </label>
                <input 
                  type="range" 
                  min="3" 
                  max="20" 
                  step="0.5"
                  value={annualInflationRate}
                  onChange={(e) => setAnnualInflationRate(Number(e.target.value))}
                  className="w-full accent-rose-500 bg-zinc-800 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-zinc-500 block mt-1">Reflects true monetary supply expansion (M2)</span>
              </div>

              <div>
                <label className="text-xs uppercase font-bold text-zinc-300 flex justify-between mb-2">
                  <span>Projected Bitcoin CAGR:</span>
                  <span className="text-amber-400 font-mono font-bold">{btcAnnualCagr}% / yr</span>
                </label>
                <input 
                  type="range" 
                  min="10" 
                  max="60" 
                  step="5"
                  value={btcAnnualCagr}
                  onChange={(e) => setBtcAnnualCagr(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-zinc-800 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-zinc-500 block mt-1">Historically &gt;50% annualized since 2011</span>
              </div>
            </div>

            {/* Simulation Results Output */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Fiat Scenario */}
              <div className="bg-zinc-900/70 border border-rose-900/30 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      Unhedged Fiat Cash
                    </span>
                    <Flame className="h-4 w-4 text-rose-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Cash in Bank Deposit</h3>
                  <p className="text-xs text-zinc-400 mb-6">Subject to relentless compound fiat currency erosion.</p>

                  <div className="space-y-3 pt-4 border-t border-zinc-800/80">
                    <div>
                      <div className="text-[11px] uppercase font-bold text-zinc-500">Nominal Cash Balance</div>
                      <div className="text-2xl font-mono font-bold text-zinc-300 mt-0.5">${initialFiatAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase font-bold text-zinc-500">Real Retained Purchasing Power</div>
                      <div className="text-2xl font-mono font-bold text-rose-400 mt-0.5">${remainingPurchasingPower.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase font-bold text-zinc-500">Total Purchasing Power Stolen</div>
                      <div className="text-base font-mono font-bold text-rose-500 mt-0.5">-{totalErosionPercent}% lost to inflation</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/60 text-[11px] text-zinc-500 italic">
                  In {calculatorYears} years, your ${initialFiatAmount.toLocaleString()} will buy what ${remainingPurchasingPower.toLocaleString()} buys today.
                </div>
              </div>

              {/* Bitcoin Scenario */}
              <div className="bg-zinc-900/70 border border-amber-500/30 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Bitcoin Sound Money
                    </span>
                    <ShieldCheck className="h-4 w-4 text-[#f97316]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Bitcoin (Self-Custody)</h3>
                  <p className="text-xs text-zinc-400 mb-6">Protected by absolute cryptographic scarcity.</p>

                  <div className="space-y-3 pt-4 border-t border-zinc-800/80">
                    <div>
                      <div className="text-[11px] uppercase font-bold text-zinc-500">Nominal Projected Fiat Value</div>
                      <div className="text-2xl font-mono font-bold text-amber-400 mt-0.5">${btcProjectedValue.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase font-bold text-zinc-500">Real Inflation-Adjusted Power</div>
                      <div className="text-2xl font-mono font-bold text-emerald-400 mt-0.5">${btcRealPurchasingPower.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase font-bold text-zinc-500">Net Purchasing Power Multiplier</div>
                      <div className="text-base font-mono font-bold text-emerald-400 mt-0.5">+{(btcRealPurchasingPower / initialFiatAmount).toFixed(1)}x real wealth expansion</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/60 text-[11px] text-zinc-500 italic">
                  Protected from money supply dilution and sovereign debt monetization.
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* Section 3: The 6 Core Properties of Sound Money (Comparison Table) */}
        <section className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 md:p-10 mb-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
            <Scale className="h-4 w-4" /> Monetary Science & Austrian Economics
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
            The 6 Pillars of Sound Money: Bitcoin vs. Gold vs. Fiat
          </h2>
          <p className="text-zinc-400 text-sm mb-8">
            Throughout history, what societies adopt as money is determined by physical and mathematical properties. Here is how Bitcoin compares to historical gold and modern fiat currencies:
          </p>

          <div className="space-y-6">
            {MONETARY_PROPERTIES.map((prop, index) => (
              <div 
                key={index}
                className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 transition-all hover:border-zinc-700"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 pb-3 border-b border-zinc-800/60">
                  <h3 className="font-bold text-white text-base md:text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#f97316]" /> {prop.name}
                  </h3>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-orange-500/10 text-[#f97316] border border-orange-500/20">
                    Advantage: {prop.winner === 'bitcoin' ? '⚡ Bitcoin' : prop.winner === 'tie' ? '🤝 Tie' : prop.winner}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 mb-4 italic">
                  {prop.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  
                  {/* Bitcoin */}
                  <div className="bg-orange-950/10 border border-orange-500/20 p-4 rounded-xl">
                    <span className="font-bold text-[#f97316] block mb-1">⚡ Bitcoin (Digital)</span>
                    <p className="text-zinc-300 leading-relaxed">{prop.bitcoin}</p>
                  </div>

                  {/* Gold */}
                  <div className="bg-yellow-950/10 border border-yellow-500/20 p-4 rounded-xl">
                    <span className="font-bold text-yellow-500 block mb-1">🪙 Physical Gold</span>
                    <p className="text-zinc-300 leading-relaxed">{prop.gold}</p>
                  </div>

                  {/* Fiat */}
                  <div className="bg-rose-950/10 border border-rose-500/20 p-4 rounded-xl">
                    <span className="font-bold text-rose-400 block mb-1">💵 Government Fiat</span>
                    <p className="text-zinc-300 leading-relaxed">{prop.fiat}</p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Why Bitcoin is the Perfect Hedge against Modern Financial Repression */}
        <section className="bg-gradient-to-br from-amber-950/20 via-zinc-900 to-zinc-950 border border-amber-900/30 rounded-3xl p-8 md:p-10 mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-[#f97316]" /> How to Protect Against Financial Repression
          </h2>
          <p className="text-zinc-300 text-sm leading-relaxed mb-6">
            As sovereign debts reach record percentage points of global GDP, governments inevitably engage in <em>financial repression</em>: keeping interest rates below real inflation rates to artificially lower debt service costs while quietly confiscating real purchasing power from citizens.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-xs">
            <div className="bg-zinc-950/80 border border-zinc-800 p-5 rounded-2xl">
              <h3 className="font-bold text-white mb-2 text-sm text-[#f97316]">1. Non-Confiscability</h3>
              <p className="text-zinc-400 leading-relaxed">
                When secured with self-custody private keys, no third party, exchange, or government agency can freeze or seize your wealth without your passphrase.
              </p>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800 p-5 rounded-2xl">
              <h3 className="font-bold text-white mb-2 text-sm text-amber-400">2. Programmable Scarcity</h3>
              <p className="text-zinc-400 leading-relaxed">
                Unlike corporate shares that can dilute or real estate that can be burdened with property taxes, Bitcoin's 21M limit is mathematically locked in stone.
              </p>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800 p-5 rounded-2xl">
              <h3 className="font-bold text-white mb-2 text-sm text-emerald-400">3. Global Liquidity</h3>
              <p className="text-zinc-400 leading-relaxed">
                Trades 24/7/365 across every country without banking holidays, foreign exchange friction, or reliance on SWIFT/clearing houses.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              to="/" 
              className="w-full sm:w-auto px-8 py-3.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-xl transition-all shadow-lg text-center text-sm"
            >
              Calculate Your Real Fiat Currency Erosion &rarr;
            </Link>
            <Link 
              to="/case-studies" 
              className="w-full sm:w-auto px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold rounded-xl border border-zinc-700 transition-all text-center text-sm"
            >
              Explore Historical Hyperinflation Case Studies
            </Link>
            <Link 
              to="/bitcoin-wallets" 
              className="w-full sm:w-auto px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold rounded-xl border border-zinc-700 transition-all text-center text-sm"
            >
              View Top 100 Richest Bitcoin Wallets
            </Link>
          </div>
        </section>

        {/* Section 5: SEO FAQ Section */}
        <section className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 md:p-10 mb-16">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
            <HelpCircle className="h-4 w-4" /> Frequently Asked Questions
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6">
            Bitcoin Sound Money & Fiat Erosion FAQ
          </h2>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="bg-zinc-950 border border-zinc-800/80 rounded-xl overflow-hidden transition-all"
                >
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-zinc-900/50 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-white text-sm md:text-base">{faq.q}</span>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-[#f97316] shrink-0" /> : <ChevronDown className="h-4 w-4 text-zinc-500 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/50 mt-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Interlink Navigation Hub */}
        <footer className="pt-8 border-t border-zinc-800/80 flex flex-wrap justify-between items-center gap-4 text-xs text-zinc-500">
          <div className="flex flex-wrap gap-4 font-semibold">
            <Link to="/" className="hover:text-white transition-colors">Fiat Erosion Calculator</Link>
            <Link to="/cost-vs-wages" className="text-emerald-400 hover:underline">⏱️ Cost vs. Wages</Link>
            <Link to="/case-studies" className="hover:text-white transition-colors">Historical Case Studies</Link>
            <Link to="/history" className="hover:text-white transition-colors">History of Money</Link>
            <Link to="/inflation" className="hover:text-white transition-colors">What Is Inflation?</Link>
            <Link to="/cbdc" className="hover:text-white transition-colors">CBDC Control Risks</Link>
            <Link to="/bitcoin-wallets" className="hover:text-white transition-colors">Top 100 Bitcoin Wallets</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
          <div>
            © 2026 Peter Adam J (@Peteradamj) • Fiat Erosion Tracker Research
          </div>
        </footer>

      </div>
    </div>
  );
};

export default BitcoinSoundMoneyPage;
