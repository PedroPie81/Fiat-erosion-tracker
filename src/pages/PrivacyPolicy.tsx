import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 py-12 px-6 font-sans">
      <div className="max-w-3xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 md:p-12">
        <Link to="/" className="inline-flex items-center text-[#f97316] hover:underline mb-8 text-sm font-bold tracking-wider uppercase">
          &larr; Back to App
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Privacy Policy</h1>
        <p className="text-zinc-500 mb-8">Effective Date: February 22, 2026</p>

        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
            <p>
              Welcome to the Fiat Erosion Tracker. We respect your privacy and are committed to protecting it. 
              This Privacy Policy explains that our application is designed to be a personal tool for tracking fiat currency erosion and inflation data, 
              and we intentionally collect as little information as possible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>
            <p>
              <strong>We do not collect any personal information.</strong> You do not need to create an account, log in, or provide your name, email address, or payment details to use this app.
            </p>
            <p className="mt-2">
              Any data you input into the calculators or charts (such as savings amounts or asset values) remains entirely on your device and is never transmitted to our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. How We Use Information</h2>
            <p>
              Because we do not collect personal data, we do not use, sell, or share your personal information. 
              The app simply processes your inputs locally in your browser to generate the charts and comparisons you see on the screen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Cookies and Tracking</h2>
            <p>
              We may use local browser storage (such as <code>localStorage</code> or <code>sessionStorage</code>) solely to save your user preferences and settings (like your selected currency) so you don't have to re-enter them every time you visit.
            </p>
            <p className="mt-2">
              We may use basic, anonymized analytics (such as Google Analytics or Vercel Web Analytics) to understand general usage trends (e.g., page views). This data cannot be used to identify you personally.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Third-Party Services</h2>
            <p>
              The app is hosted on Vercel. Vercel may collect basic connection information (like IP addresses) for security and operational purposes. 
              We may also fetch public financial data from third-party APIs to power our charts. These services only receive the standard network requests required to function and do not receive any of your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time if our practices change. Any updates will be posted on this page with a revised "Effective Date."
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please contact us at: <br />
              <a href="mailto:your-email@example.com" className="text-[#f97316] hover:underline mt-1 inline-block">your-email@example.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
