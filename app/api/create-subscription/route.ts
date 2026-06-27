import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PRICE_IDS = {
  pro: process.env.STRIPE_PRICE_ID_PRO!,
  agency: process.env.STRIPE_PRICE_ID_AGENCY!,
};

export async function POST(request: NextRequest) {
  try {
    const { email, tier } = await request.json();

    if (!email || !tier) {
      return NextResponse.json(
        { error: 'Email and tier required' },
        { status: 400 }
      );
    }

    // Create or get Stripe customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId = customers.data[0]?.id;

    if (!customerId) {
      const customer = await stripe.customers.create({ email });
      customerId = customer.id;
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: PRICE_IDS[tier as 'pro' | 'agency'] }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    // Update Supabase
    const searchLimit = tier === 'pro' ? 200 : 999999;

    await supabase
      .from('subscriptions')
      .upsert(
        {
          email,
          tier,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
          search_limit: searchLimit,
        },
        { onConflict: 'email' }
      );

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent
        ?.client_secret,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}