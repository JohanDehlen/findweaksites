'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <h1 className="text-2xl font-bold text-white">FindWeakSites</h1>
        <div className="flex gap-4">
          <Link href="/search/ai" className="text-gray-300 hover:text-white transition">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 md:px-12 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Find Businesses Not Showing Up in AI Search
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Discover local businesses losing customers to ChatGPT, Google AI Overviews, and Google Maps. AI visibility is the new competitive advantage.
          </p>
          <Link
            href="/search/ai"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition transform hover:scale-105 shadow-lg"
          >
            Scan Businesses Now →
          </Link>
        </div>
      </section>

      {/* The Problem */}
      <section className="px-6 py-16 md:px-12 md:py-24 bg-black/30">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            The AI Search Problem
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Problem 1 */}
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-white/10">
              <div className="text-red-400 text-4xl mb-4">1</div>
              <h4 className="text-xl font-bold text-white mb-3">ChatGPT & Google AI Overviews</h4>
              <p className="text-gray-300">
                Customers ask AI for solutions. Competitors show up. Your clients don't.
              </p>
            </div>

            {/* Problem 2 */}
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-white/10">
              <div className="text-red-400 text-4xl mb-4">2</div>
              <h4 className="text-xl font-bold text-white mb-3">No Schema Markup</h4>
              <p className="text-gray-300">
                AI crawlers prefer structured data. Most businesses have zero schema optimization.
              </p>
            </div>

            {/* Problem 3 */}
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-white/10">
              <div className="text-red-400 text-4xl mb-4">3</div>
              <h4 className="text-xl font-bold text-white mb-3">Lost Customers</h4>
              <p className="text-gray-300">
                Businesses lose sales because they're invisible in AI search. Your sales pitch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 md:px-12 md:py-24">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-white/10">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Enter Niche & Location</h4>
              <p className="text-gray-300">
                Search any business type in any city. We'll find them instantly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-white/10">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h4 className="text-xl font-bold text-white mb-3">AI Visibility Analysis</h4>
              <p className="text-gray-300">
                We scan schema markup, SSL, social media, and Google Business Profile presence.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-white/10">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Find Sales-Ready Leads</h4>
              <p className="text-gray-300">
                Get businesses ranked by AI visibility score. Lowest score = best opportunity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="px-6 py-16 md:px-12 md:py-24 bg-black/30">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Why This Matters for Your Agency
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="text-blue-400 text-2xl">✓</div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">New Service Offering</h4>
                <p className="text-gray-400">
                  "AI Visibility Optimization" is the hottest service agencies are selling right now.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-blue-400 text-2xl">✓</div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Easy Sales Pitch</h4>
                <p className="text-gray-400">
                  Show business owners where they're invisible in ChatGPT and Google AI.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-blue-400 text-2xl">✓</div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Qualified Leads</h4>
                <p className="text-gray-400">
                  Businesses with low AI visibility = high willingness to pay for optimization.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-blue-400 text-2xl">✓</div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Future-Proof</h4>
                <p className="text-gray-400">
                  AI search is growing 200%+ annually. This is where customers are going.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 md:px-12 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Find Your Next Leads?
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Search for qualified prospects in seconds. Get 2 free scans to start.
          </p>
          <Link
            href="/search/ai"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition transform hover:scale-105 shadow-lg"
          >
            Start Scanning Now →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 md:px-12 text-center text-gray-400">
        <p>© 2024 FindWeakSites. AI Visibility for Local Businesses.</p>
      </footer>
    </div>
  );
}