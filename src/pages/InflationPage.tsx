import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const InflationPage: React.FC = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "What Is Inflation? The Hidden Theft of Your Wealth and Purchasing Power",
    "description": "Understand what inflation really is, how quantitative easing and fiat printing debase currency, and why official CPI understates real cost-of-living increases.",
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
      "@id": "https://fiat-erosion-tracker.vercel.app/inflation"
    },
    "keywords": "what is inflation, fiat currency debasement, shadowstats vs cpi, quantitative easing, stealth tax inflation, money printing wealth destruction"
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 py-12 px-6 font-sans">
      <Helmet>
        <title>What Is Inflation? The Hidden Theft of Your Wealth | Fiat Erosion Tracker</title>
        <meta name="description" content="Understand what inflation really is, how central banks debase currency through quantitative easing, and how it acts as a hidden tax on your wealth." />
        <meta name="keywords" content="what is inflation, fiat currency debasement, shadow inflation vs official CPI, quantitative easing, money printing wealth loss, stealth tax" />
        <meta property="og:title" content="What Is Inflation? The Hidden Theft of Your Wealth" />
        <meta property="og:description" content="Discover how central banks print money out of thin air, dilute your savings, and manipulate official CPI statistics." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://fiat-erosion-tracker.vercel.app/inflation" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://fiat-erosion-tracker.vercel.app/inflation" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      
      <div className="max-w-4xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 md:p-12">
        <Link to="/" className="inline-flex items-center text-[#f97316] hover:underline mb-8 text-sm font-bold tracking-wider uppercase">
          &larr; Back to App
        </Link>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-8">What Is Inflation? The Hidden Theft of Your Wealth</h1>
        
        <div className="space-y-6 leading-relaxed text-lg text-zinc-400">
          <p>
            Inflation is often described as a general rise in prices over time, eroding the purchasing power of money. But at its core, it's not a natural economic phenomenon—it's largely a result of deliberate policies by central banks and governments. When these institutions print excessive amounts of money, they debase the currency, flooding the economy with new dollars, euros, or whatever fiat money is in circulation. This debasement acts like a silent tax, devaluing the savings you've worked hard to accumulate.
          </p>
          <p>
            Consider how it works: Central banks, like the Federal Reserve in the US, engage in quantitative easing (QE)—essentially creating money out of thin air to buy government bonds or other assets. This injects trillions into the system, as seen during the 2008 financial crisis and the COVID-19 pandemic, where the US money supply (M2) ballooned by over 40% in just two years. The result? More money chasing the same goods and services, driving up prices. Your $100 in the bank buys less tomorrow because the currency's value has been diluted. Savings accounts with paltry interest rates can't keep up, leading to negative real returns. It's wealth redistribution from savers and wage earners to debtors and asset holders, often benefiting the elite who borrow cheaply.
          </p>
          <p>
            Governments and central banks exacerbate this by manipulating key metrics like the Consumer Price Index (CPI). The CPI is supposed to measure inflation by tracking a basket of goods and services. However, it's frequently adjusted to understate reality. For instance, methodologies have changed over decades: hedonic adjustments reduce reported prices for "quality improvements" (e.g., a faster computer counts as cheaper), substitution assumes consumers switch to cheaper alternatives (like ground beef instead of steak), and geometric weighting downplays volatile items like food and energy. ShadowStats, an independent tracker, estimates true US inflation could be 5-10% higher than official figures. This sleight of hand allows policymakers to claim inflation is "under control" at 2%, while everyday costs soar. During the 2021-2023 inflation spike, official CPI hit 9%, but many felt it was far worse due to these distortions.
          </p>
          <p>
            The effects ripple into assets and home prices, creating bubbles that further inequality. Cheap money from printing drives investors into stocks, real estate, and commodities as hedges against devaluation. Home prices in major cities have skyrocketed—US median home values rose 50% from 2020-2023 alone, pricing out first-time buyers. This asset inflation benefits property owners and speculators but punishes renters and those without investments. When bubbles burst, recessions follow, yet central banks print more to "stimulate," perpetuating the cycle.
          </p>
          <p>
            In essence, inflation isn't just rising prices—it's a policy tool that erodes your financial security. To protect yourself, consider diversifying into hard assets like gold, real estate, or cryptocurrencies, which historically outpace fiat debasement. Awareness is the first step; demand transparency from those controlling the money supply. True economic health requires sound money, not endless printing presses.
          </p>

          <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
            <Link to="/" className="w-full sm:w-auto px-8 py-3.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-xl transition-colors shadow-lg text-center">
              Return to the Erosion Tracker
            </Link>
            <Link to="/cost-vs-wages" className="w-full sm:w-auto px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-emerald-300 hover:text-white font-bold rounded-xl transition-colors text-center border border-zinc-700">
              ⏱️ Cost of Things vs. Wages
            </Link>
            <Link to="/bitcoin-sound-money" className="w-full sm:w-auto px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 hover:text-white font-bold rounded-xl transition-colors text-center border border-zinc-700">
              ⚡ Why Bitcoin is Sound Money
            </Link>
            <Link to="/case-studies" className="w-full sm:w-auto px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold rounded-xl transition-colors text-center border border-zinc-700">
              🏛️ Read Historical Case Studies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InflationPage;
