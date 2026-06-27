import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Get subscription tier
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('tier, search_limit')
      .eq('email', email)
      .single();

    // Get or create search tracker
    const { data: searches, error } = await supabase
      .from('user_searches')
      .select('searches_this_month, last_reset_date')
      .eq('email', email)
      .single();

    if (error && error.code === 'PGRST116') {
      // No record exists, create one
      await supabase.from('user_searches').insert({
        email,
        searches_this_month: 0,
        last_reset_date: new Date().toISOString(),
      });

      return NextResponse.json({
        email,
        tier: 'free',
        searchLimit: 2,
        searchesUsed: 0,
        canSearch: true,
      });
    }

    // Check if month has reset
    const lastReset = new Date(searches.last_reset_date);
    const now = new Date();
    const monthReset =
      lastReset.getMonth() !== now.getMonth() ||
      lastReset.getFullYear() !== now.getFullYear();

    if (monthReset) {
      // Reset searches
      await supabase
        .from('user_searches')
        .update({
          searches_this_month: 0,
          last_reset_date: now.toISOString(),
        })
        .eq('email', email);

      return NextResponse.json({
        email,
        tier: subscription?.tier || 'free',
        searchLimit: subscription?.search_limit || 2,
        searchesUsed: 0,
        canSearch: true,
      });
    }

    const tier = subscription?.tier || 'free';
    const searchLimit = subscription?.search_limit || 2;
    const searchesUsed = searches.searches_this_month;
    const canSearch = searchesUsed < searchLimit;

    return NextResponse.json({
      email,
      tier,
      searchLimit,
      searchesUsed,
      canSearch,
    });
  } catch (error) {
    console.error('Error checking searches:', error);
    return NextResponse.json(
      { error: 'Failed to check searches' },
      { status: 500 }
    );
  }
}