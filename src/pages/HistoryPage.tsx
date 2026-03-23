import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const HistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 py-12 px-6 font-sans">
      <Helmet>
        <title>History of Money: From Decentralized Barter to Corrupt Centralized Fiat | Fiat Erosion Tracker</title>
        <meta name="description" content="Discover the history of money, how it evolved from gold-backed and decentralized systems to government-controlled fiat currencies prone to corruption and inflation manipulation." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 md:p-12">
        <Link to="/" className="inline-flex items-center text-[#f97316] hover:underline mb-8 text-sm font-bold tracking-wider uppercase">
          &larr; Back to App
        </Link>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-8">The History of Money and the Rise of Centralized Control</h1>
        
        <div className="space-y-10 leading-relaxed text-lg text-zinc-400">
          <p className="text-xl text-zinc-300 font-medium">
            Money started as a decentralized tool—a way to facilitate fair trade without relying on a central authority. Over millennia, it evolved from commodity-based systems like gold and silver into the unbacked, government-controlled fiat currencies we use today. This centralization has opened the door to unprecedented manipulation and corruption.
          </p>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Early Decentralized Systems (Barter and Precious Metals)</h2>
            <p className="mb-4">
              Before governments monopolized currency, free markets naturally selected the best forms of money. Ancient civilizations used shells, beads, and eventually precious metals like gold and silver. These commodities had intrinsic value, were scarce, and could not be created out of thin air.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li><strong>Scarcity:</strong> Gold requires physical energy and labor to mine, preventing arbitrary inflation.</li>
              <li><strong>Decentralization:</strong> No single ruler or entity controlled the global supply of precious metals.</li>
              <li><strong>Fair Trade:</strong> Transactions were peer-to-peer, relying on the verifiable weight and purity of the metal.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Gold Standard and Limited Government Influence</h2>
            <p className="mb-4">
              As economies grew, carrying heavy metals became impractical. Paper money was introduced as a receipt, fully backed by gold held in vaults. Under a true Gold Standard, governments were constrained: they could only print paper money if they had the physical gold to back it.
            </p>
            <p>
              This limitation prevented politicians from funding endless wars or massive welfare programs through stealth taxation (inflation). If a government wanted to spend more, it had to explicitly raise taxes—a highly unpopular move that kept state power in check.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Shift to Fiat Money and Central Bank Power</h2>
            <p className="mb-4">
              The 20th century saw the systematic dismantling of sound money. Governments realized that the Gold Standard restricted their ambitions. 
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300 mb-4">
              <li><strong>1913:</strong> The creation of the Federal Reserve in the US centralized control over the money supply.</li>
              <li><strong>1933:</strong> Executive Order 6102 forced US citizens to surrender their gold to the government.</li>
              <li><strong>1971:</strong> The "Nixon Shock" temporarily (and then permanently) severed the US dollar's final link to gold, birthing the modern fiat era.</li>
            </ul>
            <p>
              Today, all major currencies are "fiat" (by decree). They are backed by nothing but the promise of the government and the threat of force to collect taxes. Central banks now have the power to print endless amounts of currency.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Modern Corruption in Centralized Money</h2>
            <p className="mb-4">
              When a central authority can print money at will, corruption is inevitable. The ability to create currency out of nothing is the ultimate power, and it is routinely abused to benefit the political and financial elite at the expense of the working class.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li><strong>The Cantillon Effect:</strong> Newly printed money benefits those closest to the source (banks, large corporations, governments) who spend it before prices rise. By the time it reaches the average citizen, their purchasing power has already been diluted.</li>
              <li><strong>Funding Endless Wars:</strong> Without the ability to print money, unpopular wars would quickly bankrupt a state. Fiat currency allows governments to hide the true cost of war through inflation.</li>
              <li><strong>Bailouts and Moral Hazard:</strong> Central banks routinely bail out failing financial institutions, privatizing profits while socializing losses.</li>
              <li><strong>Hyperinflation:</strong> From Weimar Germany to modern-day Venezuela, Zimbabwe, and Argentina, corrupt governments have repeatedly destroyed their citizens' life savings through reckless money printing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Why Decentralization Matters Today</h2>
            <p className="mb-4">
              The history of fiat money is a history of eventual collapse. Every unbacked paper currency in history has eventually returned to its intrinsic value: zero. 
            </p>
            <p>
              To escape the corruption of centralized money, individuals are increasingly turning to decentralized alternatives. Hard assets like real estate and physical gold offer traditional protection, while Bitcoin represents a digital return to sound money—a decentralized, mathematically scarce network that no government or central bank can manipulate, inflate, or control.
            </p>
            <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
              <Link to="/" className="inline-block px-8 py-4 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-xl transition-colors shadow-lg">
                Return to the Erosion Tracker
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
