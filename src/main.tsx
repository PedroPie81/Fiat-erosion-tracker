import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import PrivacyPolicy from './pages/PrivacyPolicy';
import HistoryPage from './pages/HistoryPage';
import CbdcPage from './pages/CbdcPage';
import InflationPage from './pages/InflationPage';
import BitcoinWallets from './pages/BitcoinWallets';
import CaseStudiesPage from './pages/CaseStudiesPage';
import BitcoinSoundMoneyPage from './pages/BitcoinSoundMoneyPage';
import CostVsWagesPage from './pages/CostVsWagesPage';
import MoneySupplyPage from './pages/MoneySupplyPage';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/cbdc" element={<CbdcPage />} />
          <Route path="/inflation" element={<InflationPage />} />
          <Route path="/bitcoin-wallets" element={<BitcoinWallets />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/historical-case-studies" element={<CaseStudiesPage />} />
          <Route path="/bitcoin-sound-money" element={<BitcoinSoundMoneyPage />} />
          <Route path="/bitcoin-hedge" element={<BitcoinSoundMoneyPage />} />
          <Route path="/cost-vs-wages" element={<CostVsWagesPage />} />
          <Route path="/cost-of-living-vs-wages" element={<CostVsWagesPage />} />
          <Route path="/cost-vs-hours-worked" element={<CostVsWagesPage />} />
          <Route path="/money-supply" element={<MoneySupplyPage />} />
          <Route path="/m1-m2-money-supply" element={<MoneySupplyPage />} />
          <Route path="/central-bank-money-supply" element={<MoneySupplyPage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
