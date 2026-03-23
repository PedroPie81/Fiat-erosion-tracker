import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const InflationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 py-12 px-6 font-sans">
      <Helmet>
        <title>What Is Inflation? The Hidden Theft of Your Wealth | Fiat Erosion Tracker</title>
        <meta name="description" content="Understand what inflation really is, how central banks debase currency, and how it acts as a hidden tax on your wealth." />
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
        </div>
      </div>
    </div>
  );
};

export default InflationPage;
