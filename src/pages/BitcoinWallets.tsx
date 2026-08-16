import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { 
  Search, ShieldAlert, Coins, RefreshCw, Copy, Check, ExternalLink, 
  Info, TrendingUp, Landmark, Award, Calendar, ChevronDown, ChevronUp, EyeOff
} from 'lucide-react';
import { getFallbackWallets, getBtcPriceUsd } from '../data/bitcoinWalletsData';

interface BitcoinWallet {
  rank: number;
  address: string;
  label: string | null;
  balance: number;
  percentage: number;
  usdValue: number;
  firstIn: string;
  lastIn: string;
  ins: number;
  firstOut: string | null;
  lastOut: string | null;
  outs: number;
}

const BitcoinWallets: React.FC = () => {
  const [wallets, setWallets] = useState<BitcoinWallet[]>([]);
  const [btcPrice, setBtcPrice] = useState<number>(65000);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMode, setStatusMode] = useState<'live' | 'cached'>('cached');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [expandedRank, setExpandedRank] = useState<number | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      setError(null);

      let currentPrice = 65000;
      try {
        currentPrice = await getBtcPriceUsd();
      } catch (priceErr) {
        console.warn('Live price fetch warning:', priceErr);
      }
      setBtcPrice(currentPrice);

      try {
        const response = await fetch('/api/bitcoin-wallets');
        const contentType = response.headers.get('content-type') || '';
        if (response.ok && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.wallets && data.wallets.length > 0) {
            setWallets(data.wallets);
            if (data.btcPrice) setBtcPrice(data.btcPrice);
            setStatusMode(data.source === 'live' ? 'live' : 'cached');
            return;
          }
        }
      } catch (apiErr) {
        // Express local server or API not present, fall through to client generator
      }

      const fallback = getFallbackWallets(currentPrice);
      setWallets(fallback);
      setStatusMode('cached');
    } catch (err: any) {
      console.warn('Wallet loading error:', err);
      const fallback = getFallbackWallets(65000);
      setWallets(fallback);
      setBtcPrice(65000);
      setStatusMode('cached');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedAddress(text);
        setTimeout(() => setCopiedAddress(null), 2000);
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedAddress(text);
        setTimeout(() => setCopiedAddress(null), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const getEntityCategory = (wallet: BitcoinWallet): 'exchange' | 'government' | 'sleeping-giant' | 'other' => {
    const lbl = (wallet.label || '').toLowerCase();
    const address = wallet.address.toLowerCase();
    
    if (
      lbl.includes('binance') || 
      lbl.includes('bitfinex') || 
      lbl.includes('robinhood') || 
      lbl.includes('kraken') || 
      lbl.includes('okx') || 
      lbl.includes('bittrex') || 
      lbl.includes('huobi') || 
      lbl.includes('coinbase') || 
      lbl.includes('gemini') || 
      lbl.includes('bitflyer') ||
      lbl.includes('cold') || 
      lbl.includes('exchange')
    ) {
      return 'exchange';
    }
    
    if (
      lbl.includes('government') || 
      lbl.includes('seized') || 
      lbl.includes('silk road') || 
      lbl.includes('hack') || 
      lbl.includes('us marshals') || 
      lbl.includes('department of justice')
    ) {
      return 'government';
    }
    
    // Sleeping giant: holds lots of coins, first transaction was years ago, but has exactly 0 outgoing transactions (outs === 0)
    if (wallet.outs === 0 && (wallet.ins <= 5 || wallet.firstIn.includes('2010') || wallet.firstIn.includes('2011') || wallet.firstIn.includes('2012') || wallet.firstIn.includes('2013') || wallet.firstIn.includes('2014'))) {
      return 'sleeping-giant';
    }
    
    return 'other';
  };

  // Process data with filtering and sorting
  const processedWallets = useMemo(() => {
    let result = [...wallets];

    // Search query filter
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      result = result.filter(w => 
        w.address.toLowerCase().includes(q) || 
        (w.label && w.label.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(w => getEntityCategory(w) === selectedCategory);
    }

    // Sorting
    result.sort((a, b) => {
      let valA: any = a[sortBy as keyof BitcoinWallet];
      let valB: any = b[sortBy as keyof BitcoinWallet];

      // Handle nulls
      if (valA === null) valA = '';
      if (valB === null) valB = '';

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      } else {
        return sortOrder === 'asc'
          ? (valA > valB ? 1 : -1)
          : (valB > valA ? 1 : -1);
      }
    });

    return result;
  }, [wallets, searchTerm, selectedCategory, sortBy, sortOrder]);

  // Aggregate stats
  const stats = useMemo(() => {
    if (wallets.length === 0) return { totalBtc: 0, totalUsd: 0, totalPct: 0, exchangeCount: 0, govCount: 0, sleepingCount: 0 };
    
    let totalBtc = 0;
    let exchangeCount = 0;
    let govCount = 0;
    let sleepingCount = 0;

    wallets.forEach(w => {
      totalBtc += w.balance;
      const cat = getEntityCategory(w);
      if (cat === 'exchange') exchangeCount++;
      else if (cat === 'government') govCount++;
      else if (cat === 'sleeping-giant') sleepingCount++;
    });

    return {
      totalBtc,
      totalUsd: totalBtc * btcPrice,
      totalPct: wallets.reduce((acc, w) => acc + w.percentage, 0),
      exchangeCount,
      govCount,
      sleepingCount
    };
  }, [wallets, btcPrice]);

  // Chart Data: Top 15 wallets comparison
  const chartData = useMemo(() => {
    return wallets.slice(0, 15).map(w => ({
      name: w.label || `${w.address.substring(0, 6)}...${w.address.slice(-4)}`,
      balance: Math.round(w.balance),
      label: w.label || 'Whale Wallet'
    }));
  }, [wallets]);

  // Chart Data: Category Breakdown Pie
  const categoryPieData = useMemo(() => {
    if (wallets.length === 0) return [];
    
    let exchangeBtc = 0;
    let govBtc = 0;
    let sleepingBtc = 0;
    let otherBtc = 0;

    wallets.forEach(w => {
      const cat = getEntityCategory(w);
      if (cat === 'exchange') exchangeBtc += w.balance;
      else if (cat === 'government') govBtc += w.balance;
      else if (cat === 'sleeping-giant') sleepingBtc += w.balance;
      else otherBtc += w.balance;
    });

    return [
      { name: 'Exchanges', value: Math.round(exchangeBtc), color: '#3b82f6' },
      { name: 'Governments', value: Math.round(govBtc), color: '#ef4444' },
      { name: 'Satoshi/Sleeping Whales', value: Math.round(sleepingBtc), color: '#eab308' },
      { name: 'Other Private Whales', value: Math.round(otherBtc), color: '#a855f7' }
    ];
  }, [wallets]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc'); // Default to descending on first click (largest first)
    }
  };

  const toggleExpand = (rank: number) => {
    if (expandedRank === rank) {
      setExpandedRank(null);
    } else {
      setExpandedRank(rank);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans">
      <Helmet>
        <title>Top 100 Richest Bitcoin Wallets | Live Blockchain Whale Tracker</title>
        <meta name="description" content="Track the largest 100 Bitcoin addresses in real-time. Live stats, exchange cold storage, government-seized wallets, and long-sleeping Satoshi-era whales." />
      </Helmet>

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 pt-12 pb-6 border-b border-zinc-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1.5 animate-pulse">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span> Live Blockchain Data
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border flex items-center gap-1.5 ${
                statusMode === 'live' 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                  : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/50'
              }`}>
                {statusMode === 'live' ? 'Synced with Bitinfocharts' : 'Local Archive Version'}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 text-white">
              🐋 Top 100 <span className="text-amber-500">Bitcoin Wallets</span>
            </h1>
            <p className="text-zinc-400 text-sm md:text-base max-w-2xl font-light">
              This panel tracks the absolute largest capital nodes on the Bitcoin network. Monitor the behavior of centralized exchanges, nation-state seizures, and deep-ocean sleeping giants.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/40 md:min-w-[240px]">
            <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Live BTC Index Price</div>
            <div className="text-2xl md:text-3xl font-mono font-extrabold text-amber-500 flex items-center gap-2">
              <Coins className="h-6 w-6 text-amber-500" />
              ${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <button 
              onClick={fetchWallets} 
              disabled={loading}
              className="text-[10px] text-zinc-400 font-semibold hover:text-white transition-all flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin text-amber-500' : ''}`} />
              Sync Network Data
            </button>
          </div>
        </div>

        {/* Global Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/50 transition-all flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase text-zinc-500 tracking-wider font-semibold mb-1 flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-amber-500" /> Top 100 Combined Balance
              </div>
              <div className="text-2xl font-mono font-bold text-zinc-100">
                {loading ? '---' : stats.totalBtc.toLocaleString(undefined, { maximumFractionDigits: 0 })} BTC
              </div>
            </div>
            <div className="text-xs text-zinc-500 mt-2">
              Valued at <strong className="text-zinc-300">${stats.totalUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD</strong>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/50 transition-all flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase text-zinc-500 tracking-wider font-semibold mb-1 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-blue-500" /> Circulating Supply Control
              </div>
              <div className="text-2xl font-mono font-bold text-zinc-100">
                {loading ? '---' : stats.totalPct.toFixed(2)}%
              </div>
            </div>
            <div className="text-xs text-zinc-500 mt-2">
              Held by just <strong className="text-zinc-300">100 addresses</strong> out of ~50 million active wallets
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/50 transition-all flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase text-zinc-500 tracking-wider font-semibold mb-1 flex items-center gap-1">
                <Landmark className="h-3.5 w-3.5 text-rose-500" /> Exchange Cold Vaults
              </div>
              <div className="text-2xl font-mono font-bold text-zinc-100">
                {loading ? '---' : stats.exchangeCount} Wallets
              </div>
            </div>
            <div className="text-xs text-zinc-500 mt-2">
              Binance, Bitfinex, Robinhood, OKX cold reserves
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/50 transition-all flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase text-zinc-500 tracking-wider font-semibold mb-1 flex items-center gap-1">
                <EyeOff className="h-3.5 w-3.5 text-yellow-500" /> Sleeping Whales & Satoshi
              </div>
              <div className="text-2xl font-mono font-bold text-zinc-100">
                {loading ? '---' : stats.sleepingCount} Wallets
              </div>
            </div>
            <div className="text-xs text-zinc-500 mt-2">
              Unmoved for 7+ years with <strong className="text-zinc-300">0 outputs</strong>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-6 py-10 flex-1 flex flex-col gap-10">
        
        {/* Charts & Visualization Section */}
        {!loading && wallets.length > 0 && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Bar Chart: Wealth Distribution */}
            <div className="lg:col-span-2 bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                  <TrendingUp className="h-4.5 w-4.5 text-amber-500" /> Wealth concentration (Top 15 addresses)
                </h3>
                <p className="text-xs text-zinc-500 mt-1">Comparing the absolute coin balances of the top 15 mega-wallets</p>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#71717a" 
                      fontSize={9} 
                      tickLine={false} 
                      axisLine={false}
                      angle={-25}
                      textAnchor="end"
                    />
                    <YAxis 
                      stroke="#71717a" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                    />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                      itemStyle={{ fontWeight: 'bold', color: '#f4f4f5' }}
                      labelStyle={{ color: '#a1a1aa', marginBottom: '4px', fontSize: 11 }}
                      formatter={(val, name, props) => [`${Number(val).toLocaleString()} BTC`, 'Balance']}
                    />
                    <Bar dataKey="balance" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => {
                        const isExchange = entry.label !== 'Whale Wallet';
                        return <Cell key={`cell-${index}`} fill={isExchange ? '#3b82f6' : '#f59e0b'} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart: Entity Breakdown */}
            <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                  <Landmark className="h-4.5 w-4.5 text-blue-500" /> Share by Entity Type
                </h3>
                <p className="text-xs text-zinc-500 mt-1">Proportion of the top 100 wealth held by entity categories</p>
              </div>
              <div className="h-[200px] relative flex justify-center items-center my-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                      itemStyle={{ fontWeight: 'bold', color: '#f4f4f5', fontSize: 11 }}
                      formatter={(val) => [`${Number(val).toLocaleString()} BTC`, 'Volume']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-mono font-extrabold text-white">Top 100</span>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Category Shares</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10px]">
                {categoryPieData.map((item, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-zinc-400 font-medium">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </section>
        )}

        {/* Filters and Search Panel */}
        <section className="bg-zinc-900/10 border border-zinc-800/50 p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full md:max-w-md flex items-center">
            <Search className="absolute left-4 h-4 w-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search address, label, exchange tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 pl-11 pr-4 py-2.5 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 w-full focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Filtering and Categorization tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button 
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                selectedCategory === 'all' 
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' 
                  : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-white'
              }`}
            >
              All Wallets
            </button>
            <button 
              onClick={() => setSelectedCategory('exchange')}
              className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                selectedCategory === 'exchange' 
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                  : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-white'
              }`}
            >
              Exchanges
            </button>
            <button 
              onClick={() => setSelectedCategory('government')}
              className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                selectedCategory === 'government' 
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                  : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-white'
              }`}
            >
              Governments
            </button>
            <button 
              onClick={() => setSelectedCategory('sleeping-giant')}
              className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                selectedCategory === 'sleeping-giant' 
                  ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' 
                  : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-white'
              }`}
            >
              Sleeping Giants
            </button>
          </div>

        </section>

        {/* Loading and Error states */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/10 border border-zinc-800/40 rounded-2xl">
            <RefreshCw className="h-10 w-10 text-amber-500 animate-spin mb-4" />
            <h4 className="text-lg font-bold text-white">Retrieving Blockchain Data</h4>
            <p className="text-zinc-500 text-sm mt-1">Interrogating address records and exchange mappings...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-16 bg-red-950/10 border border-red-900/30 rounded-2xl">
            <ShieldAlert className="h-12 w-12 text-rose-500 mb-4" />
            <h4 className="text-lg font-bold text-white">Synchronizer Disturbance</h4>
            <p className="text-rose-300 text-sm mt-1 max-w-md text-center">{error}</p>
            <button 
              onClick={fetchWallets} 
              className="mt-6 px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg text-sm transition-all cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Rich List Table */}
        {!loading && !error && (
          <div className="bg-zinc-900/20 border border-zinc-800/60 rounded-xl overflow-hidden">
            {processedWallets.length === 0 ? (
              <div className="text-center py-20 text-zinc-500">
                <Info className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
                <p>No wallets matching current search filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-950/80 border-b border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                      <th className="py-4 px-6 w-16 cursor-pointer hover:text-white" onClick={() => handleSort('rank')}>
                        Rank {sortBy === 'rank' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="py-4 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('address')}>
                        Bitcoin Address & Entity Tag {sortBy === 'address' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="py-4 px-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('balance')}>
                        Balance (BTC) {sortBy === 'balance' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="py-4 px-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('percentage')}>
                        % Supply {sortBy === 'percentage' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="py-4 px-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('ins')}>
                        Txs (In/Out) {sortBy === 'ins' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="py-4 px-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('lastIn')}>
                        Last Activity {sortBy === 'lastIn' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="py-4 px-6 w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/60 text-sm font-medium">
                    {processedWallets.map((wallet) => {
                      const isExpanded = expandedRank === wallet.rank;
                      const cat = getEntityCategory(wallet);
                      
                      // Theme style depending on category
                      let badgeStyle = "bg-zinc-800 text-zinc-400 border-zinc-700/30";
                      let entityTypeName = "Private Whale";
                      
                      if (cat === 'exchange') {
                        badgeStyle = "bg-blue-500/10 text-blue-400 border-blue-500/20";
                        entityTypeName = "Exchange Vault";
                      } else if (cat === 'government') {
                        badgeStyle = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                        entityTypeName = "Gov Seized";
                      } else if (cat === 'sleeping-giant') {
                        badgeStyle = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
                        entityTypeName = "Sleeping Giant";
                      }

                      // Gold, silver, bronze ranks
                      let rankBadge = null;
                      if (wallet.rank === 1) rankBadge = "🥇";
                      else if (wallet.rank === 2) rankBadge = "🥈";
                      else if (wallet.rank === 3) rankBadge = "🥉";

                      return (
                        <React.Fragment key={wallet.rank}>
                          <tr className={`hover:bg-zinc-900/30 transition-colors ${isExpanded ? 'bg-zinc-900/15' : ''}`}>
                            {/* Rank */}
                            <td className="py-4 px-6 font-mono font-bold text-zinc-400">
                              <span className="flex items-center gap-1">
                                {rankBadge && <span className="text-base">{rankBadge}</span>}
                                {wallet.rank}
                              </span>
                            </td>
                            
                            {/* Address & Tag */}
                            <td className="py-4 px-4">
                              <div className="flex flex-col gap-1.5 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs text-zinc-100 break-all select-all select-none">
                                    {wallet.address.substring(0, 10)}...{wallet.address.slice(-10)}
                                  </span>
                                  <button 
                                    onClick={() => copyToClipboard(wallet.address)}
                                    className="text-zinc-600 hover:text-zinc-300 transition-colors p-1"
                                    title="Copy full address"
                                  >
                                    {copiedAddress === wallet.address ? (
                                      <Check className="h-3 w-3 text-emerald-500" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </button>
                                  <a 
                                    href={`https://bitinfocharts.com/bitcoin/address/${wallet.address}`}
                                    target="_blank"
                                    referrerPolicy="no-referrer"
                                    className="text-zinc-600 hover:text-amber-500 transition-colors p-1"
                                    title="View on Bitinfocharts explorer"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {wallet.label ? (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                      🐋 {wallet.label}
                                    </span>
                                  ) : null}
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${badgeStyle}`}>
                                    {entityTypeName}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Balance */}
                            <td className="py-4 px-4 text-right font-mono">
                              <div className="text-zinc-100 font-bold">{wallet.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })} BTC</div>
                              <div className="text-xs text-zinc-500 font-semibold">${wallet.usdValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD</div>
                            </td>

                            {/* Percentage */}
                            <td className="py-4 px-4 text-right font-mono font-bold text-zinc-300">
                              {wallet.percentage.toFixed(4)}%
                            </td>

                            {/* Ins / Outs */}
                            <td className="py-4 px-4 text-right font-mono text-zinc-400 text-xs">
                              <span className="text-emerald-500" title="Inputs / Incoming txs">+{wallet.ins}</span>
                              <span className="text-zinc-600 mx-1">/</span>
                              <span className={wallet.outs > 0 ? "text-rose-500" : "text-zinc-500"} title="Outputs / Outgoing txs">
                                -{wallet.outs}
                              </span>
                            </td>

                            {/* Last Activity */}
                            <td className="py-4 px-4 text-right font-mono text-xs text-zinc-500">
                              {wallet.lastIn.split(' ')[0]}
                            </td>

                            {/* Toggle Details */}
                            <td className="py-4 px-6 text-right">
                              <button 
                                onClick={() => toggleExpand(wallet.rank)}
                                className="text-zinc-500 hover:text-zinc-100 p-1.5 rounded-lg hover:bg-zinc-900 transition-all cursor-pointer"
                              >
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </button>
                            </td>
                          </tr>

                          {/* Expanded Details Row */}
                          {isExpanded && (
                            <tr className="bg-zinc-950/40 border-t-0">
                              <td colSpan={7} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                  {/* Section 1: Dates */}
                                  <div className="flex flex-col gap-3 bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50">
                                    <h4 className="text-xs font-bold uppercase text-zinc-500 tracking-wider flex items-center gap-1">
                                      <Calendar className="h-3.5 w-3.5" /> Chronology & Timeline
                                    </h4>
                                    <div className="flex flex-col gap-2">
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-400">First Incoming:</span>
                                        <span className="font-mono text-zinc-200 font-bold">{wallet.firstIn}</span>
                                      </div>
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-400">Last Incoming:</span>
                                        <span className="font-mono text-zinc-200 font-bold">{wallet.lastIn}</span>
                                      </div>
                                      <div className="flex justify-between items-center text-xs border-t border-zinc-800/50 pt-2 mt-1">
                                        <span className="text-zinc-400">First Outgoing:</span>
                                        <span className="font-mono text-zinc-200 font-bold">{wallet.firstOut || 'Never (Accumulation node)'}</span>
                                      </div>
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-400">Last Outgoing:</span>
                                        <span className="font-mono text-zinc-200 font-bold">{wallet.lastOut || 'Never'}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Section 2: Tx Counts */}
                                  <div className="flex flex-col gap-3 bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50">
                                    <h4 className="text-xs font-bold uppercase text-zinc-500 tracking-wider flex items-center gap-1">
                                      <TrendingUp className="h-3.5 w-3.5" /> Transaction Analysis
                                    </h4>
                                    <div className="flex flex-col gap-2">
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-400">Incoming Counts:</span>
                                        <span className="font-mono text-emerald-500 font-bold">{wallet.ins} inputs</span>
                                      </div>
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-400">Outgoing Counts:</span>
                                        <span className="font-mono text-rose-500 font-bold">{wallet.outs} outputs</span>
                                      </div>
                                      <div className="flex justify-between items-center text-xs border-t border-zinc-800/50 pt-2 mt-1">
                                        <span className="text-zinc-400">Activity Class:</span>
                                        <span className="font-bold text-zinc-200 uppercase tracking-wide text-[10px] px-1.5 py-0.5 rounded bg-zinc-800">
                                          {wallet.outs === 0 ? 'Pure Accumulator' : 'Active Transactor'}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-400">Wallet Age:</span>
                                        <span className="font-medium text-zinc-200">
                                          {new Date().getFullYear() - parseInt(wallet.firstIn.split('-')[0])} years old
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Section 3: Entity context */}
                                  <div className="flex flex-col gap-3 bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50">
                                    <h4 className="text-xs font-bold uppercase text-zinc-500 tracking-wider flex items-center gap-1">
                                      <Info className="h-3.5 w-3.5" /> Address Intelligence
                                    </h4>
                                    <div className="flex flex-col gap-1.5 text-xs text-zinc-400 leading-relaxed">
                                      <p>
                                        This wallet contains {wallet.balance.toLocaleString()} BTC. At present price index, this wallet possesses more spending power than some small sovereign states' entire gold reserves.
                                      </p>
                                      <div className="mt-2 flex items-center justify-between border-t border-zinc-800/50 pt-2">
                                        <span className="text-zinc-500">Address format:</span>
                                        <span className="font-mono font-bold text-zinc-400">
                                          {wallet.address.startsWith('bc1q') ? 'SegWit (Bech32)' : 
                                           wallet.address.startsWith('bc1p') ? 'Taproot (Bech32m)' :
                                           wallet.address.startsWith('3') ? 'P2SH (Multisig)' : 'Legacy (P2PKH)'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Informational / Educational Segment */}
        <section className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl p-8 mt-4">
          <h3 className="text-xl font-bold text-white mb-4">Understanding the Rich List</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-zinc-400">
            <div>
              <h4 className="text-zinc-200 font-bold mb-2">Exchanges vs. Cold Storage</h4>
              <p className="mb-4">
                The massive wallets at ranks #1, #2, and similar do not belong to individuals. They are the cold storage vaults of massive centralized exchanges like <strong>Binance, Bitfinex, Robinhood, and OKX</strong>.
              </p>
              <p>
                These vaults hold the consolidated deposits of millions of retail and institutional users. Moving coins out of these wallets is highly coordinated and heavily secured with multi-signature architectures.
              </p>
            </div>
            <div>
              <h4 className="text-zinc-200 font-bold mb-2">The Legend of Satoshi's Coins</h4>
              <p className="mb-4">
                Satoshi Nakamoto (Bitcoin's anonymous creator) is estimated to have mined over 1 million BTC between 2009 and 2010. However, Satoshi's holdings are not consolidated in a single address.
              </p>
              <p>
                Satoshi dispersed those coins across over 20,000 distinct single-block reward addresses (50 BTC each). Consequently, no single Satoshi address appears in this top 100 panel — they remain a scattered, dormant constellation of sound money.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-800/50 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/" 
              className="w-full sm:w-auto px-8 py-3.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-xl transition-colors shadow-lg text-center text-sm"
            >
              &larr; Back to Fiat Erosion Tracker
            </Link>
            <Link 
              to="/cost-vs-wages" 
              className="w-full sm:w-auto px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-emerald-300 hover:text-white font-bold rounded-xl transition-colors text-center text-sm border border-zinc-700"
            >
              ⏱️ Cost of Things vs. Wages
            </Link>
            <Link 
              to="/bitcoin-sound-money" 
              className="w-full sm:w-auto px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 hover:text-white font-bold rounded-xl transition-colors text-center text-sm border border-zinc-700"
            >
              ⚡ Why Bitcoin is Sound Money
            </Link>
            <Link 
              to="/case-studies" 
              className="w-full sm:w-auto px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold rounded-xl transition-colors text-center text-sm border border-zinc-700"
            >
              🏛️ Read Historical Case Studies
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-12 px-6 mt-12 text-center text-zinc-600 text-xs">
        <p>© 2026 Peter Adam J (@Peteradamj) • Tracker Data provided as-is • Not financial advice • All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BitcoinWallets;
