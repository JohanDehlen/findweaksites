'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <h1 className="text-2xl font-bold text-white">FindWeakSites</h1>
        <div className="flex gap-4">
          <Link href="/search" className="text-gray-300 hover:text-white transition">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 md:px-12 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Find Businesses Losing Customers Online
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Search any niche and location to uncover businesses with weak websites, poor SEO, and untapped growth opportunities.
          </p>
          <Link
            href="/search"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition transform hover:scale-105 shadow-lg"
          >
            Start Finding Leads →
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 md:px-12 md:py-24 bg-black/30">
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
                Choose any business niche and location. Search for plumbers in New York, dentists in London, or solar installers in Sydney.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-white/10">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Set Your Filters</h4>
              <p className="text-gray-300">
                Choose which issues to target: no website, poor HTTPS, low reviews, low ratings, or missing phone numbers.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-white/10">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Get Qualified Leads</h4>
              <p className="text-gray-300">
                Instantly see businesses ranked by website strength. Export, email, or reach out directly on Google Maps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="px-6 py-16 md:px-12 md:py-24">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Why Agencies Love FindWeakSites
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="flex gap-4">
              <div className="text-blue-400 text-2xl">✓</div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Instant Lead Generation</h4>
                <p className="text-gray-400">
                  Find hundreds of sales-ready prospects in seconds. No more manual research.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4">
              <div className="text-blue-400 text-2xl">✓</div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Smart Website Strength Scoring</h4>
                <p className="text-gray-400">
                  Our algorithm ranks businesses by how weak their online presence is. Easy targets first.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4">
              <div className="text-blue-400 text-2xl">✓</div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Multiple Search Criteria</h4>
                <p className="text-gray-400">
                  Filter by no website, poor security, low reviews, bad ratings, and missing contact info.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-4">
              <div className="text-blue-400 text-2xl">✓</div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Works Globally</h4>
                <p className="text-gray-400">
                  Search across the US, UK, Canada, and Australia. Expand your market reach.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex gap-4">
              <div className="text-blue-400 text-2xl">✓</div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Direct Contact Options</h4>
                <p className="text-gray-400">
                  Get website links, phone numbers, and direct Google Business Profile access for every lead.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="flex gap-4">
              <div className="text-blue-400 text-2xl">✓</div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Save Time & Money</h4>
                <p className="text-gray-400">
                  Stop wasting hours on manual prospecting. Focus on closing deals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-6 py-16 md:px-12 md:py-24 bg-black/30">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Perfect For
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-lg border border-white/10">
              <h4 className="text-lg font-bold text-white mb-2">Web Design Agencies</h4>
              <p className="text-gray-400 text-sm">
                Find local businesses with outdated or missing websites. Perfect sales targets.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-lg border border-white/10">
              <h4 className="text-lg font-bold text-white mb-2">SEO Services</h4>
              <p className="text-gray-400 text-sm">
                Prospect businesses struggling with reviews, ratings, and search visibility.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-lg border border-white/10">
              <h4 className="text-lg font-bold text-white mb-2">Digital Marketing</h4>
              <p className="text-gray-400 text-sm">
                Target businesses ready for a complete online presence overhaul.
              </p>
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
            Start searching for qualified prospects right now. It takes less than 30 seconds.
          </p>
          <Link
            href="/search"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition transform hover:scale-105 shadow-lg"
          >
            Start Finding Leads Now →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 md:px-12 text-center text-gray-400">
        <p>© 2024 FindWeakSites. All rights reserved.</p>
      </footer>
    </div>
  );
}