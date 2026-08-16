import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Landmark, Flame, History, ArrowRight, ShieldAlert, 
  TrendingDown, Globe, BookOpen, Clock, AlertTriangle, 
  CheckCircle2, ChevronRight, Scale, Coins, ExternalLink,
  HelpCircle, ChevronDown, ChevronUp, BarChart3
} from 'lucide-react';

interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  era: string;
  country: string;
  peakInflation: string;
  doublingTime: string;
  rootCauses: string[];
  mechanisms: string[];
  humanConsequences: string[];
  resolution: string;
  modernLesson: string;
  iconColor: string;
  badgeText: string;
  quote?: {
    text: string;
    author: string;
  };
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'weimar',
    title: 'The Weimar Republic, Germany',
    subtitle: 'The Archetype of Modern Industrial Hyperinflation',
    era: '1921 – 1923',
    country: 'Germany',
    peakInflation: '29,500% monthly (~324% per day in late 1923)',
    doublingTime: 'Every 3.7 days (prices doubled)',
    rootCauses: [
      'Devastating World War I debt and unpayable Treaty of Versailles reparations (132 billion gold marks).',
      'The 1923 French and Belgian military occupation of the Ruhr industrial basin when reparations lagged.',
      'Passive resistance strike called by the German government, which printed unbacked Papiermarks to pay striking workers wages.'
    ],
    mechanisms: [
      'The Reichsbank ran printing presses 24/7, employing dozens of private printing firms and over 300 paper mills.',
      'By November 1923, one US dollar was equal to 4,200,000,000,000 (4.2 trillion) German Papiermarks.',
      'Denominations reached 100-trillion-mark banknotes; currency was stamped over old notes with trillions.'
    ],
    humanConsequences: [
      'Workers were paid twice daily in duffel bags and rushed out during lunch breaks before prices jumped in the afternoon.',
      'Banknotes were burned in domestic stoves for heat because burning paper money provided more heat than the firewood it could purchase.',
      'Children played with thick stacks of worthless banknotes as building blocks in the streets.',
      'The entire middle class—prudent savers, teachers, pensioners, and civil servants—saw lifetime savings wiped out to zero, creating deep socio-political trauma that destabilized the republic.'
    ],
    resolution: 'The Papiermark was terminated in November 1923 and replaced by the Rentenmark (pegged 1:1,000,000,000,000) backed by a legal mortgage on Germany’s agricultural and industrial land, combined with strict spending discipline under Hjalmar Schacht.',
    modernLesson: 'When government debt obligations exceed productive capacity, printing money to monetize sovereign deficits accelerates into hyperinflation exponentially faster than policymakers anticipate.',
    iconColor: 'text-amber-500',
    badgeText: 'Classic Fiat Meltdown',
    quote: {
      text: 'A cup of coffee that cost 5,000 marks when ordered cost 8,000 marks by the time the bill arrived.',
      author: 'Stefan Zweig, The World of Yesterday'
    }
  },
  {
    id: 'venezuela',
    title: 'Venezuela (The Bolivar Collapse)',
    subtitle: 'Petrodollar Socialism, Price Controls & Sovereign Default',
    era: '2014 – Present',
    country: 'Venezuela',
    peakInflation: 'Over 1,000,000% annual peak (2018), cumulative >10,000,000,000%',
    doublingTime: 'Every 19 to 25 days during the peak crisis',
    rootCauses: [
      'Extreme reliance on crude oil exports (over 95% of foreign exchange) with total state control over energy revenues.',
      'Massive social welfare programs funded by external borrowing and unbacked Central Bank money printing (Banco Central de Venezuela).',
      'Systematic nationalization of private farms, factories, and retail networks, destroying domestic supply chains.'
    ],
    mechanisms: [
      'Strict price and exchange controls (CADIVI / CENCOEX) made basic goods unprofitable to produce legally, spawning rampant black markets.',
      'The Central Bank repeatedly sliced zeros off the currency: 3 zeros in 2008 (Bolívar Fuerte), 5 zeros in 2018 (Bolívar Soberano), and 6 zeros in 2021 (Bolívar Digital) — 14 zeros removed in total.',
      'Cash became so plentiful and worthless that retail merchants weighed bags of banknotes on deli scales instead of counting bills.'
    ],
    humanConsequences: [
      'Severe shortages of basic antibiotics, infant formula, toilet paper, and essential food items.',
      'The average Venezuelan lost an estimated 11 kg (24 lbs) of body weight in 2017 during the "Maduro diet" famine crisis.',
      'Over 7.7 million Venezuelans (over 20% of the entire population) fled their homeland as economic refugees.',
      'Spurred rapid organic grassroots adoption of Bitcoin, USDT (stablecoins), and physical US dollar cash as the de facto survival currency.'
    ],
    resolution: 'De facto dollarization of the economy in 2019-2022, relaxing draconian price controls, allowing US dollars and cryptocurrencies to circulate openly for everyday retail transactions.',
    modernLesson: 'Price controls and currency restrictions never stop inflation; they only produce chronic shortages, destroy productive enterprise, and drive citizens into censorship-resistant digital sound money.',
    iconColor: 'text-rose-500',
    badgeText: '21st Century Crisis',
    quote: {
      text: 'Money in Venezuela ceased to be a store of value or a unit of account. People survived by trading in dollars, eggs, and Bitcoin satoshis.',
      author: 'Caracas Economic Dispatch'
    }
  },
  {
    id: 'zimbabwe',
    title: 'Zimbabwe',
    subtitle: 'Confiscatory Land Reforms & The 100-Trillion-Dollar Banknote',
    era: '2000 – 2009',
    country: 'Zimbabwe',
    peakInflation: '79,600,000,000% (79.6 billion percent) monthly in mid-November 2008',
    doublingTime: 'Every 24.7 hours (prices doubled daily)',
    rootCauses: [
      'Forcible fast-track land redistribution in 2000, seizing commercial commercial farms without compensation and handing them to political loyalists, causing agricultural output (the backbone of the economy) to crash by over 60%.',
      'Heavy military spending in the Second Congo War.',
      'Reserve Bank of Zimbabwe Governor Gideon Gono actively printed money to service government deficits, military salaries, and political patronage.'
    ],
    mechanisms: [
      'Re-denomination cycles: ZWD lost 3 zeros in 2006, 10 zeros in 2008, and 12 zeros in 2009 (25 zeros stripped overall).',
      'The Reserve Bank issued the famous 100,000,000,000,000 ($100 Trillion) Zimbabwe Dollar banknote in January 2009.',
      'The government declared price hikes illegal and arrested over 1,300 business owners and executives for raising prices to match printing rates; store shelves emptied within 48 hours.'
    ],
    humanConsequences: [
      'Teachers and doctors received monthly salaries that could not buy a single loaf of bread or a bus ticket to work.',
      'Hospitals ran out of clean water, electricity, and basic analgesics; life expectancy dropped dramatically.',
      'Citizens abandoned the formal banking system, trading in gold panned by hand from rivers or bartering with fuel coupons.'
    ],
    resolution: 'In April 2009, Zimbabwe officially suspended and abandoned its national currency, legalizing the use of foreign currencies (US Dollar, South African Rand, and British Pound) in a full monetary surrender.',
    modernLesson: 'Monetizing unbacked government spending while simultaneously crippling productive output triggers hyperinflation with mathematical certainty.',
    iconColor: 'text-yellow-500',
    badgeText: 'Highest Banknote Denomination',
    quote: {
      text: 'I was a trillionaire who could not afford to buy a loaf of bread or pay for a bus ride home.',
      author: 'Harare Resident Testimonial'
    }
  },
  {
    id: 'rome',
    title: 'Ancient Roman Empire',
    subtitle: 'The Silver Denarius Debasement & Crisis of the Third Century',
    era: '54 AD – 305 AD',
    country: 'Roman Empire',
    peakInflation: 'Cumulative ~15,000% over the debasement cycle; collapse of imperial coin credibility',
    doublingTime: 'Gradual multi-decade compound decay followed by acute hyperinflation spikes under Diocletian',
    rootCauses: [
      'Escalating military payrolls and palace expenditures exceeding imperial tax receipts.',
      'Exhaustion of Spanish silver mines and lack of new territorial conquests to plunder.',
      'Political instability: 26 emperors claimed the throne within 50 years during the Crisis of the Third Century, each buying soldiers loyalty with newly minted coins.'
    ],
    mechanisms: [
      'Emperor Nero (54–68 AD) was the first to debase the silver Denarius, reducing purity from 98% down to 90% and reducing coin weight.',
      'Emperor Trajan and Marcus Aurelius cut silver to 75-80%; Septimius Severus slashed it to 50%.',
      'By the reign of Claudius Gothicus (268–270 AD) and Gallienus, the Denarius was under 0.5% silver—a mere bronze slug with a microscopic silver wash that wore off in weeks.',
      'Emperor Diocletian passed the Edict on Maximum Prices (301 AD), decreeing the death penalty for merchants selling above fixed ceiling prices.'
    ],
    humanConsequences: [
      'Merchants refused debased imperial coins and hoarded older, pure silver coins (Gresham’s Law).',
      'Roman soldiers refused payment in debased coins, demanding payment in grain, livestock, or pure gold solidi.',
      'Diocletian’s price controls caused merchants to stop selling goods entirely, triggering widespread city food riots and underground black markets.',
      'Urban populations fled Rome and major cities to rural self-sufficient agrarian villas, sowing the seeds of medieval feudalism.'
    ],
    resolution: 'Emperor Constantine the Great (312 AD) abandoned the silver Denarius entirely and introduced the pure gold Solidus (4.5 grams of 24k gold), which remained stable for over 700 years in the Byzantine Empire.',
    modernLesson: 'Debasement of currency is the oldest trick in the political playbook. It inevitably leads to price controls, destruction of free markets, and the physical decline of civilization.',
    iconColor: 'text-orange-500',
    badgeText: 'The Ancient Blueprint',
    quote: {
      text: 'Money is the lifeblood of the empire; when you poison the money with copper, the limbs of the empire wither and die.',
      author: 'Ancient Monetary Analysis'
    }
  },
  {
    id: 'hungary',
    title: 'Hungary (The Pengő Collapse)',
    subtitle: 'The Most Extreme Hyperinflation in Human History',
    era: '1945 – 1946',
    country: 'Hungary',
    peakInflation: '4.19 × 10¹⁶% (41.9 quadrillion percent) per month in July 1946',
    doublingTime: 'Every 15.3 hours (prices doubled multiple times a day)',
    rootCauses: [
      'Post-World War II destruction of 90% of Hungary’s national infrastructure and rail networks.',
      'Crushing war reparations demanded by the Soviet Union, equal to 300% of Hungary’s entire national budget.',
      'The government used newly printed Pengő to meet Soviet reparation quotas and fund reconstruction.'
    ],
    mechanisms: [
      'Daily inflation reached an astonishing 207% per day at the climax.',
      'The central bank printed the 100 Million B.-Pengő note (100 quintillion or 10²⁰ Pengő) — the largest paper banknote denomination in world history.',
      'Tax collections became mathematically impossible because taxes levied on Monday lost 99% of value by the time they cleared on Friday.'
    ],
    humanConsequences: [
      'Sweepers literally swept quadrillions of abandoned Pengő banknotes down the gutters into the sewer drains like garbage.',
      'All commercial transactions reverted entirely to gold, foreign currency, lard, sugar, and cigarettes.',
      'The price of basic bread soared from 6 Pengő to 6,000,000,000,000,000,000,000,000 Pengő.'
    ],
    resolution: 'On August 1, 1946, Hungary abolished the Pengő and introduced the Forint at an exchange rate of 1 Forint = 400,000,000,000,000,000,000,000,000,000 (4×10²⁹) Pengő, backed by gold retrieved from the US vaults.',
    modernLesson: 'There is no theoretical limit to how fast an unbacked fiat paper currency can fall to zero once psychological trust is extinguished.',
    iconColor: 'text-red-500',
    badgeText: 'World Record Hyperinflation'
  },
  {
    id: 'france',
    title: 'Revolutionary France (The Assignats)',
    subtitle: 'Confiscated Lands, Paper Assignats & The Reign of Terror',
    era: '1789 – 1796',
    country: 'France',
    peakInflation: 'Over 300% per month with complete loss of purchasing power',
    doublingTime: 'Every few weeks, accelerating into total currency abandonment',
    rootCauses: [
      'French national insolvency following the American Revolutionary War and royal debts.',
      'The National Constituent Assembly issued paper "Assignats" backed by the confiscation of Catholic Church lands ("biens nationaux").'
    ],
    mechanisms: [
      'Originally intended as interest-bearing bonds, the Assembly repeatedly increased print volumes, transforming them into unbacked legal tender.',
      'To force circulation, the Jacobin government instituted the "Law of the General Maximum" (1793), setting price caps on grain, meat, and fuel.',
      'Refusing paper Assignats or charging a discount against gold coins was made a capital crime punishable by death by the Guillotine.'
    ],
    humanConsequences: [
      'Despite the threat of the guillotine, farmers hoarded grain and refused to bring food to Paris, causing deadly city bread shortages.',
      'Merchants shuttered shops, factories closed, and speculation ran rampant on the black market.',
      'By 1796, Assignats were trading at less than 0.25% of their original nominal face value.'
    ],
    resolution: 'In February 1796, the French government publicly smashed the printing plates in the Place Vendôme in Paris and burned billions of Assignats. Napoleon Bonaparte later stabilized France by establishing the gold-backed French Franc and banning unbacked paper money.',
    modernLesson: 'Even the most brutal state coercion and death penalties cannot force citizens to accept worthless paper currency when its supply has been multiplied beyond reason.',
    iconColor: 'text-purple-500',
    badgeText: 'Guillotine Price Controls'
  }
];

const FAQS = [
  {
    q: 'What is the exact definition of hyperinflation?',
    a: 'In economics, hyperinflation is formally defined by Philip Cagan’s rule as an inflation rate exceeding 50% per month (which equates to an annualized rate of over 12,875%). At this rate, money loses its function as a store of value, prices double in days or weeks, and people immediately dump paper cash for hard goods, commodities, gold, or foreign sound currencies.'
  },
  {
    q: 'Why did the Roman Empire debase its currency instead of raising taxes?',
    a: 'Raising direct taxes on citizens or landed nobility was politically perilous and difficult to enforce over a vast empire. Debasing the silver purity of coins (from 98% down to under 1%) allowed emperors like Nero, Septimius Severus, and Gallienus to secretly "print" money without immediate legislative pushback—stealing purchasing power gradually through stealth monetary dilution.'
  },
  {
    q: 'What are the classic warning signs that a currency is heading toward hyperinflation?',
    a: 'Historical patterns reveal five clear phases: 1) Unsustainable sovereign debt and deficits, 2) The central bank directly monetizing government debt (quantitative easing / money printing), 3) Acceleration of money velocity as the public realizes holding cash is losing purchasing power, 4) Government instituting price controls, currency bans, or mandatory exchange rates, and 5) Complete abandonment of the currency in favor of hard assets like gold, foreign fiat, or decentralized crypto like Bitcoin.'
  },
  {
    q: 'How did Weimar Germany finally stop its hyperinflation in 1923?',
    a: 'Weimar stopped hyperinflation through radical monetary reform: they abolished the worthless Papiermark, stopped the central bank from discounting government Treasury bills, and introduced the Rentenmark in November 1923, which was strictly limited in quantity and pegged 1:1,000,000,000,000 to old marks with a mortgage claim on German land and industry.'
  },
  {
    q: 'Why does Bitcoin serve as an antidote to historical currency debasement?',
    a: 'Unlike fiat currencies or ancient coins which rulers can endlessly debase or print, Bitcoin has an unalterable mathematical hard cap of 21 million coins. Its issuance schedule is governed by decentralized cryptographic consensus rather than political decree, preventing any central authority from inflating the supply to fund deficits or wars.'
  }
];

const CaseStudiesPage: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const filteredCases = selectedCaseId === 'all' 
    ? CASE_STUDIES 
    : CASE_STUDIES.filter(c => c.id === selectedCaseId);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Structured Data Schema for Rich SEO Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Historical Hyperinflation Case Studies: Weimar, Venezuela, Zimbabwe, and Ancient Rome",
    "description": "Comprehensive economic case studies on currency debasement, hyperinflation, and fiat collapse from the Roman Empire to modern Zimbabwe and Venezuela.",
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
      "@id": "https://fiat-erosion-tracker.com/case-studies"
    },
    "about": [
      { "@type": "Thing", "name": "Hyperinflation" },
      { "@type": "Thing", "name": "Weimar Republic Inflation 1923" },
      { "@type": "Thing", "name": "Zimbabwe Hyperinflation" },
      { "@type": "Thing", "name": "Roman Currency Debasement" },
      { "@type": "Thing", "name": "Venezuela Inflation" },
      { "@type": "Thing", "name": "Purchasing Power Loss" }
    ]
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 py-12 px-6 font-sans">
      <Helmet>
        <title>Historical Case Studies of Hyperinflation & Currency Collapse | Weimar, Venezuela, Zimbabwe, Rome</title>
        <meta 
          name="description" 
          content="Explore in-depth historical case studies of fiat debasement and hyperinflation: Ancient Rome's silver denarius, Weimar Germany (1923), Zimbabwe (2008), Venezuela, and Hungarian Pengő. Lessons on purchasing power preservation." 
        />
        <meta 
          name="keywords" 
          content="hyperinflation case studies, weimar republic inflation 1923, zimbabwe 100 trillion dollar bill, venezuela bolivar collapse, roman empire denarius debasement, currency collapse history, fiat money debasement, causes of hyperinflation, sound money, hungarian pengo inflation" 
        />
        <meta property="og:title" content="Historical Case Studies of Hyperinflation & Currency Collapse" />
        <meta property="og:description" content="Explore detailed economic breakdowns of how fiat currencies and ancient empires collapsed through reckless money printing and coin debasement." />
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
          <span className="text-zinc-400">Historical Case Studies</span>
        </div>

        {/* Hero Header */}
        <header className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">
            <BookOpen className="h-4 w-4" /> Comprehensive Economic Research
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
            The Anatomy of <span className="text-[#f97316]">Currency Collapse</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-300 font-light leading-relaxed max-w-3xl mb-8">
            Every unbacked fiat currency in human history has eventually trended toward its intrinsic value: zero. From the copper-diluted silver coins of imperial Rome to the 100-trillion-dollar banknotes of Zimbabwe, explore the recurring mechanisms of sovereign debt, money printing, and purchasing power destruction.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-zinc-800/80">
            <div>
              <div className="text-xs uppercase text-zinc-500 font-bold">Median Fiat Lifespan</div>
              <div className="text-2xl font-extrabold text-white font-mono mt-1">~27 Years</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Historical average</div>
            </div>
            <div>
              <div className="text-xs uppercase text-zinc-500 font-bold">Worst Peak Inflation</div>
              <div className="text-2xl font-extrabold text-red-400 font-mono mt-1">4.19 × 10¹⁶%</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Hungary, July 1946</div>
            </div>
            <div>
              <div className="text-xs uppercase text-zinc-500 font-bold">Largest Banknote</div>
              <div className="text-2xl font-extrabold text-yellow-400 font-mono mt-1">$100 Trillion</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Zimbabwe, 2008</div>
            </div>
            <div>
              <div className="text-xs uppercase text-zinc-500 font-bold">Roman Silver Debasement</div>
              <div className="text-2xl font-extrabold text-orange-400 font-mono mt-1">98% → &lt;0.5%</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Nero to Diocletian</div>
            </div>
          </div>
        </header>

        {/* Filter / Quick Jump Navigation */}
        <section className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <History className="h-4 w-4 text-[#f97316]" /> Select Case Study:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setSelectedCaseId('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCaseId === 'all' 
                  ? 'bg-[#f97316] text-white shadow-md' 
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              All Case Studies ({CASE_STUDIES.length})
            </button>
            {CASE_STUDIES.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCaseId === c.id 
                    ? 'bg-[#f97316] text-white shadow-md' 
                    : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {c.country}
              </button>
            ))}
          </div>
        </section>

        {/* The 5-Stage Pattern of Currency Destruction */}
        <section className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8 mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" /> The Invariable 5-Stage Lifecycle of Fiat Collapse
          </h2>
          <p className="text-zinc-400 text-sm mb-6">
            Throughout 2,000 years of recorded monetary history, hyperinflation and currency destruction follow an identical, predictable cycle regardless of technology, culture, or geography:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#f97316]">STAGE 01</span>
                <h3 className="font-bold text-white text-sm mt-1 mb-2">Unfunded Debt & Deficits</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Government commits to wars, welfare, or entitlements exceeding tax receipts. Political resistance prevents explicit tax hikes.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-amber-500">STAGE 02</span>
                <h3 className="font-bold text-white text-sm mt-1 mb-2">Monetization / Debasement</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  The treasury debases coin purity or central bank prints new unbacked currency to purchase sovereign bonds (stealth tax).
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-yellow-500">STAGE 03</span>
                <h3 className="font-bold text-white text-sm mt-1 mb-2">Velocity Explosion</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Citizens realize purchasing power is melting away. The public rushes to spend cash immediately upon receipt, driving prices vertical.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-rose-500">STAGE 04</span>
                <h3 className="font-bold text-white text-sm mt-1 mb-2">Draconian Price Controls</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  State blames "speculators and hoarders". Caps prices, causing store shelves to empty overnight and black markets to flourish.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-500">STAGE 05</span>
                <h3 className="font-bold text-white text-sm mt-1 mb-2">Flight to Sound Money</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  The populace abandons the debased fiat. Trade spontaneously switches to hard assets: Gold, foreign currency, or decentralized Bitcoin.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Case Studies Cards */}
        <div className="space-y-12">
          {filteredCases.map((study) => (
            <article 
              key={study.id} 
              id={study.id}
              className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-10 transition-all hover:border-zinc-700/80 shadow-lg"
            >
              {/* Card Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-800/80">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {study.era}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      {study.badgeText}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-extrabold text-white">
                    {study.title}
                  </h2>
                  <p className="text-zinc-400 text-base mt-1">{study.subtitle}</p>
                </div>

                <div className="flex flex-col items-start md:items-end bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800 md:min-w-[260px]">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Peak Inflation Metric</span>
                  <span className="text-lg font-mono font-bold text-red-400">{study.peakInflation}</span>
                  <span className="text-xs text-zinc-500 mt-1">Price Doubling: <strong className="text-zinc-300">{study.doublingTime}</strong></span>
                </div>
              </div>

              {/* Quote if present */}
              {study.quote && (
                <div className="my-6 p-4 bg-zinc-950/60 border-l-4 border-amber-500 rounded-r-xl italic text-sm text-zinc-300">
                  "{study.quote.text}"
                  <span className="block not-italic text-xs font-bold text-zinc-500 mt-1.5">— {study.quote.author}</span>
                </div>
              )}

              {/* Grid of details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 text-sm">
                
                {/* Root Causes */}
                <div className="bg-zinc-950/40 p-6 rounded-2xl border border-zinc-800/60">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4" /> Root Catalysts & Sovereign Debts
                  </h3>
                  <ul className="space-y-2.5 text-zinc-300">
                    {study.rootCauses.map((cause, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Printing Mechanisms */}
                <div className="bg-zinc-950/40 p-6 rounded-2xl border border-zinc-800/60">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 mb-4 flex items-center gap-2">
                    <Flame className="h-4 w-4" /> Debasement & Money Printing Mechanics
                  </h3>
                  <ul className="space-y-2.5 text-zinc-300">
                    {study.mechanisms.map((mech, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{mech}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Human Consequences */}
                <div className="bg-zinc-950/40 p-6 rounded-2xl border border-zinc-800/60 md:col-span-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 mb-4 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" /> Human Toll & Destruction of the Middle Class
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {study.humanConsequences.map((cons, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-zinc-300 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/40">
                        <span className="text-purple-400 font-bold mt-0.5">⚠️</span>
                        <span>{cons}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Resolution & Modern Lesson */}
              <div className="pt-6 border-t border-zinc-800/80 flex flex-col gap-4">
                <div className="text-xs leading-relaxed text-zinc-400 bg-emerald-950/20 border border-emerald-900/30 p-4 rounded-xl">
                  <strong className="text-emerald-400 font-bold uppercase tracking-wider block mb-1">How It Ended / Resolution:</strong>
                  {study.resolution}
                </div>
                
                <div className="text-xs leading-relaxed text-zinc-300 bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-start gap-3">
                  <Coins className="h-5 w-5 text-[#f97316] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#f97316] font-bold uppercase tracking-wider block mb-0.5">Timeless Lesson for Savers:</strong>
                    {study.modernLesson}
                  </div>
                </div>
              </div>

            </article>
          ))}
        </div>

        {/* Master Comparison Table */}
        <section className="my-16 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 overflow-hidden">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#f97316]" /> Comparative Matrix: Historical Currency Collapses
          </h2>
          <p className="text-zinc-400 text-sm mb-6">
            A side-by-side comparative analysis of peak monthly inflation rates, doubling times, and eventual monetary resets across history.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Case Study</th>
                  <th className="py-3 px-4">Era / Century</th>
                  <th className="py-3 px-4">Peak Monthly Inflation</th>
                  <th className="py-3 px-4">Price Doubling Rate</th>
                  <th className="py-3 px-4">Debasement Method</th>
                  <th className="py-3 px-4">Eventual Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-medium text-zinc-300">
                <tr className="hover:bg-zinc-900/30">
                  <td className="py-3 px-4 font-bold text-white">Ancient Rome</td>
                  <td className="py-3 px-4">54–305 AD</td>
                  <td className="py-3 px-4 text-orange-400 font-mono">Cumulative ~15,000%</td>
                  <td className="py-3 px-4">Decades → Months</td>
                  <td className="py-3 px-4">Silver content cut 98% → &lt;0.5%</td>
                  <td className="py-3 px-4 text-emerald-400">Pure Gold Solidus</td>
                </tr>
                <tr className="hover:bg-zinc-900/30">
                  <td className="py-3 px-4 font-bold text-white">Weimar Germany</td>
                  <td className="py-3 px-4">1921–1923</td>
                  <td className="py-3 px-4 text-red-400 font-mono font-bold">29,500% / mo</td>
                  <td className="py-3 px-4">3.7 Days</td>
                  <td className="py-3 px-4">Reichsbank paper Papiermark printing</td>
                  <td className="py-3 px-4 text-emerald-400">Rentenmark land mortgage</td>
                </tr>
                <tr className="hover:bg-zinc-900/30">
                  <td className="py-3 px-4 font-bold text-white">Hungary (Pengő)</td>
                  <td className="py-3 px-4">1945–1946</td>
                  <td className="py-3 px-4 text-red-500 font-mono font-bold">4.19 × 10¹⁶% / mo</td>
                  <td className="py-3 px-4">15.3 Hours</td>
                  <td className="py-3 px-4">100-Quintillion note printed</td>
                  <td className="py-3 px-4 text-emerald-400">Gold-backed Forint</td>
                </tr>
                <tr className="hover:bg-zinc-900/30">
                  <td className="py-3 px-4 font-bold text-white">Revolutionary France</td>
                  <td className="py-3 px-4">1789–1796</td>
                  <td className="py-3 px-4 text-orange-400 font-mono">300%+ / mo</td>
                  <td className="py-3 px-4">Weeks</td>
                  <td className="py-3 px-4">Assignats paper with death penalty</td>
                  <td className="py-3 px-4 text-emerald-400">Gold Franc under Napoleon</td>
                </tr>
                <tr className="hover:bg-zinc-900/30">
                  <td className="py-3 px-4 font-bold text-white">Zimbabwe</td>
                  <td className="py-3 px-4">2000–2009</td>
                  <td className="py-3 px-4 text-red-400 font-mono font-bold">79.6 Billion% / mo</td>
                  <td className="py-3 px-4">24.7 Hours</td>
                  <td className="py-3 px-4">$100 Trillion banknote printed</td>
                  <td className="py-3 px-4 text-emerald-400">Currency abandoned (USD)</td>
                </tr>
                <tr className="hover:bg-zinc-900/30">
                  <td className="py-3 px-4 font-bold text-white">Venezuela</td>
                  <td className="py-3 px-4">2014–Present</td>
                  <td className="py-3 px-4 text-red-400 font-mono font-bold">&gt;1,000,000% annual</td>
                  <td className="py-3 px-4">19–25 Days</td>
                  <td className="py-3 px-4">Deficit printing + 14 zeros cut</td>
                  <td className="py-3 px-4 text-emerald-400">De facto Dollar & Crypto</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Why Hard Money & Bitcoin Matter Today */}
        <section className="bg-gradient-to-br from-amber-950/30 to-zinc-900/80 border border-amber-900/40 rounded-3xl p-8 md:p-12 mb-16">
          <div className="max-w-3xl">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 inline-block mb-4">
              The Path to Financial Sovereignty
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4">
              How Savers Protect Themselves from Modern Fiat Debasement
            </h2>
            <p className="text-zinc-300 text-base leading-relaxed mb-6">
              History proves that every centralized currency monopoly eventually succumbs to political spending pressures and debasement. When fiat currencies decay, capital flees to un-inflatable, scarce stores of value:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-xl">
                <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                  <Coins className="h-4 w-4" /> Physical Gold & Silver
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Proven 5,000-year history of surviving the rise and fall of empires, wars, and sovereign defaults.
                </p>
              </div>

              <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-xl">
                <div className="font-bold text-blue-400 mb-1 flex items-center gap-1.5">
                  <Landmark className="h-4 w-4" /> Productive Hard Assets
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Real estate, farmland, and high-quality equity in essential businesses with strong pricing power.
                </p>
              </div>

              <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-xl">
                <div className="font-bold text-[#f97316] mb-1 flex items-center gap-1.5">
                  <Flame className="h-4 w-4" /> Bitcoin (Digital Sound Money)
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Absolute mathematical scarcity (21 million coins), permissionless transferability, and immunity to central bank dilution.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link 
                to="/" 
                className="w-full sm:w-auto px-8 py-3.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-xl transition-all shadow-lg text-center"
              >
                Track Your Purchasing Power Erosion &rarr;
              </Link>
              <Link 
                to="/bitcoin-wallets" 
                className="w-full sm:w-auto px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold rounded-xl border border-zinc-700 transition-all text-center"
              >
                Inspect Top 100 Bitcoin Wallets
              </Link>
            </div>
          </div>
        </section>

        {/* SEO FAQ Section */}
        <section className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 md:p-10 mb-16">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
            <HelpCircle className="h-4 w-4" /> Frequently Asked Questions
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6">
            Hyperinflation & Monetary Debasement FAQ
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
            <Link to="/bitcoin-sound-money" className="text-[#f97316] hover:underline">⚡ Bitcoin Sound Money</Link>
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

export default CaseStudiesPage;
