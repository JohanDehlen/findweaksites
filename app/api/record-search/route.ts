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

    // Increment search count
    const { data } = await supabase
      .from('user_searches')
      .select('searches_this_month')
      .eq('email', email)
      .single();

    await supabase
      .from('user_searches')
      .update({ searches_this_month: (data?.searches_this_month || 0) + 1 })
      .eq('email', email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording search:', error);
    return NextResponse.json(
      { error: 'Failed to record search' },
      { status: 500 }
    );
  }
}