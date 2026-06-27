'use client';

import { useState } from 'react';
import PaymentModal from './PaymentModal';

interface Business {
  name: string;
  address: string;
  rating?: number;
  reviewCount?: number;
  website?: string;
  phone?: string;
  [key: string]: any;
}

interface WebsiteCheckResult {
  hasSSL: boolean;
  hasSchema: boolean;
  socialMedia: { facebook: boolean; instagram: boolean };
  aiVisibilityScore: number;
  problems: string[];
}

export default function AISearchForm() {
  const [email, setEmail] = useState('');
  const [niche, setNiche] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('US');
  const [hasWebsite, setHasWebsite] = useState<boolean | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    tier: string;
    searchLimit: number;
    searchesUsed: number;
  } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email to search.');
      return;
    }

    if (hasWebsite === null) {
      setError('Please select whether businesses have websites.');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      // Check search limit
      const checkRes = await fetch('/api/check-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const checkData = await checkRes.json();
      setUserInfo(checkData);

      if (!checkData.canSearch) {
        setShowPaymentModal(true);
        setLoading(false);
        return;
      }

      // Make search
      const res = await fetch('/api/search-businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, location, country }),
      });

      if (!res.ok) throw new Error('Search failed');

      const data = await res.json();
      let businesses = data.businesses || [];

      // Filter by website preference
      if (hasWebsite) {
        businesses = businesses.filter((b: any) => b.website);
      } else {
        businesses = businesses.filter((b: any) => !b.website);
      }

      // If they have websites, check AI visibility
      if (hasWebsite) {
        businesses = await Promise.all(
          businesses.map(async (business: any) => {
            try {
              const checkRes = await fetch('/api/check-website', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ website: business.website }),
              });

              const websiteCheck: WebsiteCheckResult = await checkRes.json();

              return {
                ...business,
                ...websiteCheck,
                score: websiteCheck.aiVisibilityScore,
              };
            } catch (err) {
              console.error(`Error checking ${business.website}:`, err);
              return {
                ...business,
                aiVisibilityScore: 0,
                hasSSL: false,
                hasSchema: false,
                socialMedia: { facebook: false, instagram: false },
                problems: ['Unable to check website'],
              };
            }
          })
        );

        // Sort by AI visibility score (lowest first = best opportunities)
        businesses.sort((a: any, b: any) => a.score - b.score);
      } else {
        // No website = highest opportunity (score 0)
        businesses = businesses.map((b: any) => ({
          ...b,
          score: 0,
          aiVisibilityScore: 0,
          problems: ['No website detected'],
        }));
      }

      setResults(businesses);

      // Record search
      await fetch('/api/record-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch (err) {
      setError('Search failed. Try again.');
      console.error(err);
    }

    setLoading(false);
  };

  const getBorderColor = (score: number) => {
    if (score <= 25) return 'border-red-500';
    if (score <= 50) return 'border-orange-500';
    if (score <= 75) return 'border-yellow-500';
    return 'border-green-500';
  };

  const getOpportunityLevel = (score: number): string => {
    if (score === 0) return 'CRITICAL - No Website';
    if (score <= 25) return 'CRITICAL - Nearly Invisible in AI';
    if (score <= 50) return 'HIGH - Major AI Visibility Gaps';
    if (score <= 75) return 'MEDIUM - Some Optimization Needed';
    return 'LOW - Well Optimized';
  };

  const getGoogleMapsUrl = (business: any) => {
    const query = encodeURIComponent(`${business.name} ${business.address}`);
    return `https://www.google.com/maps/search/${query}`;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-2">AI Visibility Scanner</h1>
            <p className="text-lg text-gray-700">
              Scan any niche and location to find businesses invisible in ChatGPT, Google AI Overviews, and Google Maps.
            </p>
          </div>

          <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@agency.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                  required
                />
                {userInfo && (
                  <p className="text-xs text-gray-600 mt-1">
                    Tier: {userInfo.tier.toUpperCase()} | Scans: {userInfo.searchesUsed}/{userInfo.searchLimit}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What niche? (e.g., Plumbers, Dentists, Solar Installers, Law Firms)
                </label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder=""
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What location? (e.g., New York, London, Toronto, Brisbane)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder=""
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                </select>
              </div>

              {/* Website Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Do businesses have websites?
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setHasWebsite(true)}
                    className={`flex-1 py-3 rounded-lg text-sm font-medium transition ${
                      hasWebsite === true
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Yes - Check AI Visibility
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasWebsite(false)}
                    className={`flex-1 py-3 rounded-lg text-sm font-medium transition ${
                      hasWebsite === false
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    No - No Website
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
              >
                {loading ? 'Scanning...' : 'Scan Businesses'}
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {results.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Found {results.length} businesses | {hasWebsite ? 'AI Visibility Analysis' : 'No Website Prospects'}
              </h2>
              <div className="space-y-4">
                {results.map((business: any, idx: number) => (
                  <div key={idx} className={`bg-white rounded-lg shadow p-6 border-l-4 ${getBorderColor(business.score)}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{business.name}</h3>
                        <p className="text-sm text-gray-600">{business.address}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-red-600">{Math.round(business.score)}/100</div>
                        <p className="text-xs text-gray-500">AI Visibility Score</p>
                      </div>
                    </div>

                    <div className="text-sm space-y-1 mb-4">
                      {business.website && (
                        <p>
                          <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                            {business.website}
                          </a>
                        </p>
                      )}
                      {business.phone && <p>Phone: {business.phone}</p>}
                      <p>{business.rating || 'N/A'} rating | {business.reviewCount || 0} reviews</p>
                      <p>
                        <a href={getGoogleMapsUrl(business)} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                          View on Google Maps
                        </a>
                      </p>
                    </div>

                    {hasWebsite && (
                      <div className="mb-4 p-4 bg-gray-50 rounded">
                        <p className="font-semibold text-sm text-gray-700 mb-2">AI Visibility Issues:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {business.problems?.map((p: string, i: number) => (
                            <li key={i}>✗ {p}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <p className="text-sm font-semibold text-gray-800 p-3 bg-blue-50 rounded">
                      {getOpportunityLevel(business.score)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showPaymentModal && userInfo && (
        <PaymentModal
          email={email}
          searchesUsed={userInfo.searchesUsed}
          searchLimit={userInfo.searchLimit}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </>
  );
}