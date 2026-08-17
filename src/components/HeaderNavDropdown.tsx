import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, History, Flame, ShieldAlert, Coins, 
  ChevronDown, ArrowRight, Sparkles, ExternalLink, Compass,
  Clock, Calculator, Landmark, Receipt
} from 'lucide-react';

interface NavPageItem {
  path: string;
  title: string;
  shortTitle: string;
  description: string;
  tag: string;
  tagColor: string;
  icon: React.ReactNode;
  isNew?: boolean;
}

const NAV_PAGES: NavPageItem[] = [
  {
    path: '/tax-vs-wages',
    title: 'Tax Burden vs. Wages & Fiscal Drag Tracker (1971–2026)',
    shortTitle: 'Tax Burden vs. Wages',
    description: 'Track how direct income tax, payroll/NICs, 20% VAT, property levies, and frozen tax brackets (fiscal drag) squeeze working wages across USD, GBP, and EUR.',
    tag: 'Taxes & Fiscal Drag',
    tagColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    icon: <Receipt className="h-5 w-5 text-rose-400" />,
    isNew: true
  },
  {
    path: '/money-supply',
    title: 'Global Money Supply Tracker (M0, M1, M2, M3, M4)',
    shortTitle: 'Money Supply (M1, M2, M3)',
    description: 'Track exponential fiat money printing, central bank balance sheets, and savings dilution across USD, GBP, EUR, and Global aggregates from 1971 to 2026.',
    tag: 'Monetary Printing',
    tagColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    icon: <Landmark className="h-5 w-5 text-amber-400" />
  },
  {
    path: '/cost-vs-wages',
    title: 'Cost of Things vs. Wages & Hours Worked (1971–2026)',
    shortTitle: 'Cost vs. Wages & Hours',
    description: 'Calculate how many hours of work were needed to buy a house, car, tuition, groceries, and gold across USD, GBP, and EUR from 1971 to 2026.',
    tag: 'Labor & Wages',
    tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    icon: <Clock className="h-5 w-5 text-emerald-400" />
  },
  {
    path: '/bitcoin-sound-money',
    title: 'Why Bitcoin is Sound Money & The Hedge Against Fiat Erosion',
    shortTitle: 'Bitcoin: Sound Money Hedge',
    description: 'Mathematical scarcity, the 21M cap, the Cantillon Effect, and why Bitcoin preserves multi-generational purchasing power against fiat debasement.',
    tag: 'Sound Money & Hedge',
    tagColor: 'bg-orange-500/10 text-[#f97316] border-orange-500/20',
    icon: <Coins className="h-5 w-5 text-[#f97316]" />
  },
  {
    path: '/case-studies',
    title: 'Historical Case Studies (Weimar, Venezuela, Zimbabwe, Rome)',
    shortTitle: 'Historical Case Studies',
    description: 'Deep-dive analysis of currency collapses: Roman denarius debasement, Weimar 1923, Zimbabwe, Hungarian Pengő & modern Venezuela.',
    tag: 'Historical Deep Dive',
    tagColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    icon: <History className="h-5 w-5 text-amber-500" />
  },
  {
    path: '/bitcoin-wallets',
    title: 'Top 100 Richest Bitcoin Wallets (Live Whale Tracker)',
    shortTitle: 'Top 100 Wallets',
    description: 'Real-time blockchain intelligence: track exchange cold storage vaults, government seizures, and dormant Satoshi-era sleeping giants.',
    tag: 'On-Chain Intel',
    tagColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    icon: <Sparkles className="h-5 w-5 text-yellow-500" />
  },
  {
    path: '/history',
    title: 'The History of Money & Centralized Control',
    shortTitle: 'History of Money',
    description: 'How money evolved from decentralized gold and silver barter into government-monopolized fiat and central bank manipulation.',
    tag: 'Monetary History',
    tagColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: <BookOpen className="h-5 w-5 text-blue-500" />
  },
  {
    path: '/inflation',
    title: 'What Is Inflation? (The Hidden Wealth Theft)',
    shortTitle: 'What Is Inflation?',
    description: 'How money printing, quantitative easing, and CPI basket adjustments secretly transfer wealth away from working-class savers.',
    tag: 'Economic Theory',
    tagColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    icon: <Flame className="h-5 w-5 text-rose-500" />
  },
  {
    path: '/cbdc',
    title: 'CBDCs: Programmable Digital Currency & Control Risks',
    shortTitle: 'CBDCs & Control',
    description: 'Understand central bank digital currencies, spending expiration dates, negative interest rates, and financial surveillance.',
    tag: 'Financial Liberty',
    tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    icon: <ShieldAlert className="h-5 w-5 text-purple-500" />
  }
];

const HeaderNavDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPage = (path: string) => {
    setSelectedPath(path);
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="w-full max-w-4xl mt-2 mb-8" ref={dropdownRef}>
      {/* Dropdown Box Container */}
      <div className="bg-gradient-to-r from-zinc-900/90 via-zinc-900/70 to-zinc-950/90 border border-zinc-800/90 hover:border-zinc-700/80 rounded-2xl p-4 sm:p-5 shadow-xl transition-all">
        
        {/* Header line */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-[#f97316] border border-orange-500/20">
              <Compass className="h-4 w-4" />
            </span>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-zinc-300 flex items-center gap-1.5">
                Educational Knowledge Hub & Case Studies
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/30">
                  <Sparkles className="h-2.5 w-2.5 mr-1" /> Research Library
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Dropdown Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between gap-3 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 px-4 py-3 rounded-xl text-left text-sm text-zinc-200 hover:text-white transition-all shadow-inner group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#f97316]/40"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <div className="flex items-center gap-3 truncate">
              <Coins className="h-4 w-4 text-[#f97316] shrink-0" />
              <span className="font-semibold truncate">
                {isOpen ? 'Select a research guide or case study below...' : 'Browse Educational Pages & Case Studies...'}
              </span>
            </div>
            <ChevronDown className={`h-4 w-4 text-zinc-400 group-hover:text-white transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#f97316]' : ''}`} />
          </button>

          {/* Expanded Dropdown Menu Panel */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 divide-y divide-zinc-900/80 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-zinc-500 font-bold bg-zinc-900/30">
                Select a research page to navigate:
              </div>
              {NAV_PAGES.map((page) => {
                const isCurrent = location.pathname === page.path;
                return (
                  <button
                    key={page.path}
                    type="button"
                    onClick={() => handleSelectPage(page.path)}
                    className={`w-full text-left p-3.5 sm:px-4 sm:py-3.5 hover:bg-zinc-900/70 transition-colors flex items-start gap-3.5 group cursor-pointer ${isCurrent ? 'bg-zinc-900/40' : ''}`}
                  >
                    <div className="mt-0.5 p-2 rounded-xl bg-zinc-900 border border-zinc-800/80 group-hover:border-zinc-700 transition-colors shrink-0">
                      {page.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-zinc-100 group-hover:text-white transition-colors">
                          {page.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${page.tagColor}`}>
                          {page.tag}
                        </span>
                        {page.isNew && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#f97316] text-white animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed group-hover:text-zinc-300">
                        {page.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-[#f97316] group-hover:translate-x-1 transition-all shrink-0 mt-3 hidden sm:block" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Clickable Chips below the dropdown - Clean 4-tab grid/flex without awkward cutoffs or grey boxes */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-zinc-800/60 text-xs">
          <span className="text-[10px] uppercase font-bold text-zinc-500 shrink-0">Featured:</span>
          
          <button
            type="button"
            onClick={() => handleSelectPage('/tax-vs-wages')}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            🧾 Tax vs. Wages & Fiscal Drag
          </button>

          <button
            type="button"
            onClick={() => handleSelectPage('/money-supply')}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            🏛️ Money Supply (M1/M2/M3)
          </button>

          <button
            type="button"
            onClick={() => handleSelectPage('/cost-vs-wages')}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            ⏱️ Cost vs. Wages & Hours
          </button>

          <button
            type="button"
            onClick={() => handleSelectPage('/bitcoin-sound-money')}
            className="px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-[#f97316] border border-orange-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            ⚡ Bitcoin Sound Money
          </button>
        </div>

      </div>
    </div>
  );
};

export default HeaderNavDropdown;
