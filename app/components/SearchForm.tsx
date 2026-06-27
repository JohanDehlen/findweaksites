'use client';

import { useState } from 'react';
import { scoreAllBusinesses } from '@/app/lib/scoreWeakness';
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

export default function SearchForm() {
  const [email, setEmail] = useState('');
  const [niche, setNiche] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('US');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    tier: string;
    searchLimit: number;
    searchesUsed: number;
  } | null>(null);
  const [problemFilter, setProblemFilter] = useState<{ [key: string]: boolean }>({
    'no-website': true,
    'not-https': true,
    'low-reviews': true,
    'low-rating': true,
    'no-phone': true,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email to search.');
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
      const scoredBusinesses = await scoreAllBusinesses(data.businesses || []);
      setResults(scoredBusinesses);

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
    if (score <= 30) return 'border-red-500';
    if (score <= 50) return 'border-orange-500';
    if (score <= 70) return 'border-yellow-500';
    return 'border-green-500';
  };

  const getGoogleMapsUrl = (business: any) => {
    const query = encodeURIComponent(`${business.name} ${business.address}`);
    return `https://www.google.com/maps/search/${query}`;
  };

  const hasProblem = (business: any, problemType: string) => {
    const problemText = business.problems?.join('|') || '';
    switch (problemType) {
      case 'no-website':
        return problemText.includes('No website');
      case 'not-https':
        return problemText.includes('Not HTTPS');
      case 'low-reviews':
        return problemText.includes('Only') || problemText.includes('Low review count');
      case 'low-rating':
        return problemText.includes('Low rating') || problemText.includes('Below 4.0');
      case 'no-phone':
        return problemText.includes('No phone');
      default:
        return false;
    }
  };

  const filteredResults = results.filter((business: any) => {
    for (const [problem, selected] of Object.entries(problemFilter)) {
      if (selected === true) {
        if (!hasProblem(business, problem)) return false;
      }
    }
    return true;
  });

  const setProblemValue = (problem: string, value: boolean) => {
    setProblemFilter({
      ...problemFilter,
      [problem]: value,
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-2">FindWeakSites</h1>
            <p className="text-lg text-gray-700">
              Search any niche and location to uncover businesses with weak websites, poor SEO, and untapped growth opportunities.
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
                    Tier: {userInfo.tier.toUpperCase()} | Searches: {userInfo.searchesUsed}/{userInfo.searchLimit}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What niche? (e.g., Plumbers, Dentists, Solar Installers, Thai Restaurants, etc.)
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Search for businesses:
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Which don't have a website</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setProblemValue('no-website', true)}
                        className={`px-4 py-2 rounded text-sm font-medium transition ${
                          problemFilter['no-website'] === true
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setProblemValue('no-website', false)}
                        className={`px-4 py-2 rounded text-sm font-medium transition ${
                          problemFilter['no-website'] === false
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Which don't have an HTTPS website</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setProblemValue('not-https', true)}
                        className={`px-4 py-2 rounded text-sm font-medium transition ${
                          problemFilter['not-https'] === true
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setProblemValue('not-https', false)}
                        className={`px-4 py-2 rounded text-sm font-medium transition ${
                          problemFilter['not-https'] === false
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Which have a low review count</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setProblemValue('low-reviews', true)}
                        className={`px-4 py-2 rounded text-sm font-medium transition ${
                          problemFilter['low-reviews'] === true
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setProblemValue('low-reviews', false)}
                        className={`px-4 py-2 rounded text-sm font-medium transition ${
                          problemFilter['low-reviews'] === false
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Which have a low rating</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setProblemValue('low-rating', true)}
                        className={`px-4 py-2 rounded text-sm font-medium transition ${
                          problemFilter['low-rating'] === true
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setProblemValue('low-rating', false)}
                        className={`px-4 py-2 rounded text-sm font-medium transition ${
                          problemFilter['low-rating'] === false
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Which don't have a phone number listed</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setProblemValue('no-phone', true)}
                        className={`px-4 py-2 rounded text-sm font-medium transition ${
                          problemFilter['no-phone'] === true
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setProblemValue('no-phone', false)}
                        className={`px-4 py-2 rounded text-sm font-medium transition ${
                          problemFilter['no-phone'] === false
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
              >
                {loading ? 'Searching...' : 'Find Weak Sites'}
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
                Found {filteredResults.length} of {results.length} businesses
              </h2>
              <div className="space-y-4">
                {filteredResults.map((business: any, idx: number) => (
                  <div key={idx} className={`bg-white rounded-lg shadow p-6 border-l-4 ${getBorderColor(business.score)}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{business.name}</h3>
                        <p className="text-sm text-gray-600">{business.address}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-red-600">{Math.round(business.score)}/100</div>
                        <p className="text-xs text-gray-500">Website Strength</p>
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
                      {business.phone && <p>{business.phone}</p>}
                      <p>{business.rating || 'N/A'} rating | {business.reviewCount || 0} reviews</p>
                      <p>
                        <a href={getGoogleMapsUrl(business)} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                          View on Google Maps
                        </a>
                      </p>
                    </div>

                    <div className="mb-4">
                      <p className="font-semibold text-sm text-gray-700 mb-2">Top Issues:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {business.problems?.map((p: string, i: number) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    <p className="text-sm font-semibold text-gray-800 p-3 bg-gray-50 rounded">
                      {business.opportunity}
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