import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const CbdcPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 py-12 px-6 font-sans">
      <Helmet>
        <title>CBDCs: The Risks of Programmable Digital Currencies and Government Totalitarian Control | Fiat Erosion Tracker</title>
        <meta name="description" content="Learn about Central Bank Digital Currencies (CBDCs), their programmable features, and how they enable corrupt governments to exert totalitarian control over spending, savings, and personal freedoms." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 md:p-12">
        <Link to="/" className="inline-flex items-center text-[#f97316] hover:underline mb-8 text-sm font-bold tracking-wider uppercase">
          &larr; Back to App
        </Link>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-8">CBDCs: A Tool for Totalitarian Government Control?</h1>
        
        <div className="space-y-10 leading-relaxed text-lg text-zinc-400">
          <p className="text-xl text-zinc-300 font-medium">
            Central Bank Digital Currencies (CBDCs) are the next evolution of fiat money. Unlike decentralized cryptocurrencies, CBDCs are issued and fully controlled by a central bank. While marketed as a convenient upgrade to our financial system, they represent a profound shift toward absolute financial surveillance and control.
          </p>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">What Are CBDCs?</h2>
            <p className="mb-4">
              A CBDC is a digital token representing the fiat currency of a nation (like a digital dollar, euro, or pound). However, unlike the digital money currently in your bank account—which is a liability of a commercial bank—a CBDC is a direct liability of the central bank. 
            </p>
            <p>
              This direct relationship eliminates intermediaries, giving the central bank unprecedented visibility into and control over every single transaction made by every citizen. It is the ultimate centralization of financial power.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Programmable Features and Corruption Risks</h2>
            <p className="mb-4">
              The most dangerous aspect of CBDCs is their programmability. Because the currency is digital and centrally managed, governments can write code to dictate exactly how, when, and where your money can be spent.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li><strong>Expiration Dates:</strong> To "stimulate the economy," governments could program your savings to expire if not spent by a certain date, effectively destroying your ability to save for the future.</li>
              <li><strong>Spending Limits and Restrictions:</strong> Purchases could be restricted based on your carbon footprint, health status, or political affiliations. "Unapproved" purchases (like certain books, meat, or firearms) could be algorithmically blocked.</li>
              <li><strong>Negative Interest Rates:</strong> In a cashless CBDC system, you cannot withdraw physical cash to avoid negative interest rates. The central bank can simply deduct money directly from your account.</li>
              <li><strong>Zero Privacy:</strong> Every transaction is permanently recorded on a centralized ledger, eliminating the anonymity of cash and allowing complete financial surveillance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Totalitarian Control Through CBDCs</h2>
            <p className="mb-4">
              When a government has the power to program money, it has the power to program human behavior. CBDCs provide the ultimate tool for totalitarian control, enabling corrupt officials to enforce compliance with state mandates instantly.
            </p>
            <p>
              If you dissent against government policies, your financial life can be turned off with a single keystroke. We have already seen precursors to this, such as the freezing of bank accounts belonging to protesters during the 2022 Canadian trucker convoy. A CBDC makes this kind of financial censorship frictionless, automated, and absolute.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Real-World Examples and Warnings</h2>
            <p className="mb-4">
              The push for CBDCs is not a theoretical future; it is happening right now across the globe.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li><strong>China's e-CNY:</strong> The digital yuan is already being piloted, integrating deeply with China's mass surveillance apparatus and social credit system. It allows the state to monitor all spending and punish dissidents financially.</li>
              <li><strong>Western CBDCs:</strong> The UK (Britcoin), the EU (Digital Euro), and the US are all actively researching or developing CBDCs. Privacy advocates and civil liberties groups have raised severe alarms about the potential for abuse, noting that promises of "privacy protection" are easily reversed by future administrations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Alternatives to Centralized Digital Money</h2>
            <p className="mb-4">
              CBDCs amplify the existing problems of fiat currency—inflation, debasement, and corruption—by adding direct, programmable control over your life. They are the antithesis of financial freedom.
            </p>
            <p>
              To protect your wealth and your liberty, it is crucial to understand and utilize decentralized alternatives. Assets like physical gold and decentralized cryptocurrencies like Bitcoin offer a way to store value outside the reach of central bank manipulation and government surveillance.
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

export default CbdcPage;
