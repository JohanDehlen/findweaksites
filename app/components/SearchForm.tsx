'use client';

import { useState } from 'react';
import { scoreAllBusinesses } from '@/app/lib/scoreWeakness';

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
  const [niche, setNiche] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('US');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [opportunityFilter, setOpportunityFilter] = useState<string[]>(['high', 'medium', 'low', 'minimal']);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await fetch('/api/search-businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, location, country }),
      });

      if (!res.ok) throw new Error('Search failed');

      const data = await res.json();
      const scoredBusinesses = await scoreAllBusinesses(data.businesses || []);
      setResults(scoredBusinesses);
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

  const filteredResults = results.filter((business: any) => {
    if (business.score <= 30 && opportunityFilter.includes('high')) return true;
    if (business.score > 30 && business.score <= 50 && opportunityFilter.includes('medium')) return true;
    if (business.score > 50 && business.score <= 70 && opportunityFilter.includes('low')) return true;
    if (business.score > 70 && opportunityFilter.includes('minimal')) return true;
    return false;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">FindWeakSites</h1>
          <p className="text-lg text-gray-700">
            Find businesses with weak online presence. Easy sales for agencies.
          </p>
        </div>

        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                What niche? (e.g., Plumbers, Dentists, Solar installers)
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Plumbers"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                What location? (e.g., New York, Los Angeles)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="New York"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Country
              </label>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? 'Searching...' : '🔍 Find Weak Sites'}
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
            <div className="mb-6 bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Opportunity Level:</label>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={opportunityFilter.includes('high')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setOpportunityFilter([...opportunityFilter, 'high']);
                      } else {
                        setOpportunityFilter(opportunityFilter.filter(f => f !== 'high'));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">🔴 High (0-30)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={opportunityFilter.includes('medium')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setOpportunityFilter([...opportunityFilter, 'medium']);
                      } else {
                        setOpportunityFilter(opportunityFilter.filter(f => f !== 'medium'));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">🟠 Medium (31-50)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={opportunityFilter.includes('low')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setOpportunityFilter([...opportunityFilter, 'low']);
                      } else {
                        setOpportunityFilter(opportunityFilter.filter(f => f !== 'low'));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">🟡 Low (51-70)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={opportunityFilter.includes('minimal')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setOpportunityFilter([...opportunityFilter, 'minimal']);
                      } else {
                        setOpportunityFilter(opportunityFilter.filter(f => f !== 'minimal'));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">🟢 Minimal (71+)</span>
                </label>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Found {filteredResults.length} of {results.length} businesses
            </h2>
            <div className="space-y-4">
              {filteredResults.map((business: any, idx: number) => (
                <div
                  key={idx}
                  className={`bg-white rounded-lg shadow p-6 border-l-4 ${getBorderColor(business.score)}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{business.name}</h3>
                      <p className="text-sm text-gray-600">{business.address}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-red-600">
                        {Math.round(business.score)}/100
                      </div>
                      <p className="text-xs text-gray-500">Website Strength</p>
                    </div>
                  </div>

                  <div className="text-sm space-y-1 mb-4">
                    {business.website && (
                      <p>
                        🌐{' '}
                        <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                          {business.website}
                        </a>
                      </p>
                    )}
                    {business.phone && <p>📞 {business.phone}</p>}
                    <p>⭐ {business.rating || 'N/A'} | 📝 {business.reviewCount || 0} reviews</p>
                  </div>

                  <div className="mb-4">
                    <p className="font-semibold text-sm text-gray-700 mb-2">Top Issues:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {business.problems?.map((p: string, i: number) => (
                        <li key={i}>• {p}</li>
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
  );
}