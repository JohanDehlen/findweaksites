'use client';

import { useState } from 'react';

interface PaymentModalProps {
  email: string;
  searchesUsed: number;
  searchLimit: number;
  onClose: () => void;
}

export default function PaymentModal({
  email,
  searchesUsed,
  searchLimit,
  onClose,
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'pro' | 'agency'>('pro');

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tier: selectedTier }),
      });

      const data = await res.json();
      
      // Redirect to Stripe checkout (you'll need to implement this fully)
      window.location.href = `https://checkout.stripe.com/${data.subscriptionId}`;
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Upgrade Your Plan
        </h2>
        <p className="text-gray-600 mb-6">
          You've used {searchesUsed} of your {searchLimit} monthly searches. Upgrade to continue searching.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Pro Tier */}
          <div
            onClick={() => setSelectedTier('pro')}
            className={`p-6 rounded-lg border-2 cursor-pointer transition ${
              selectedTier === 'pro'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
            <p className="text-gray-600 mb-4">
              Perfect for growing agencies
            </p>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900">$19</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ 200 searches/month</li>
              <li>✓ Email support</li>
              <li>✓ All features</li>
            </ul>
          </div>

          {/* Agency Tier */}
          <div
            onClick={() => setSelectedTier('agency')}
            className={`p-6 rounded-lg border-2 cursor-pointer transition ${
              selectedTier === 'agency'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Agency</h3>
            <p className="text-gray-600 mb-4">
              For high-volume prospecting
            </p>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900">$99</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Unlimited searches</li>
              <li>✓ CSV export</li>
              <li>✓ Email templates</li>
              <li>✓ Priority support</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition"
          >
            Close
          </button>
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition"
          >
            {loading ? 'Processing...' : 'Subscribe Now'}
          </button>
        </div>
      </div>
    </div>
  );
}