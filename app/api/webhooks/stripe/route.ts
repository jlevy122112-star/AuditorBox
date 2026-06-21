import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27' as any, // Standard fixed API profile locking definitions
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export async function POST(req: NextRequest) {
  try {
    // 1. Process raw binary text payload to allow complete SHA-256 signature calculation validation checks
    const rawBody = await req.text();
    const signatureHeader = req.headers.get('stripe-signature');

    if (!signatureHeader) {
      return NextResponse.json({ error: 'Missing security validation tokens.' }, { status: 400 });
    }

    let verifiedStripeEvent: Stripe.Event;

    try {
      verifiedStripeEvent = stripe.webhooks.constructEvent(
        rawBody,
        signatureHeader,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (cryptoErr: any) {
      console.error(`[SECURITY ALERT] Webhook cryptographic parsing rejection: ${cryptoErr.message}`);
      return NextResponse.json({ error: `Signature verification failed: ${cryptoErr.message}` }, { status: 400 });
    }

    const eventType = verifiedStripeEvent.type;
    const eventDataObject = verifiedStripeEvent.data.object as any;

    console.log(`[STRIPE INBOUND LOGGER] Processing active event type parameter: ${eventType}`);

    // 2. Main switch extraction processing state engine
    switch (eventType) {
      
      // Case A: Successful billing verification logic pipeline
      case 'invoice.payment_succeeded': {
        const stripeCustomerId = eventDataObject.customer as string;
        const subscriptionStatusValue = 'active';

        if (!stripeCustomerId) break;

        // Trace and update matching profile rows instantly using systemic service roles definitions
        const { error: dbUpdateErr } = await supabase
          .from('profiles')
          .update({ 
            stripe_subscription_status: subscriptionStatusValue,
            stripe_customer_id: stripeCustomerId
          })
          .eq('stripe_customer_id', stripeCustomerId);

        if (dbUpdateErr) {
          throw new Error(`Database record syncing failure inside payment processing: ${dbUpdateErr.message}`);
        }
        
        console.log(`[REVENUE ACCORD SUCCESS] Customer profile marked active for Stripe ID: ${stripeCustomerId}`);
        break;
      }

      // Case B: Delinquent account handling, non-payment drops, or manual termination loops
      case 'customer.subscription.deleted':
      case 'invoice.payment_failed': {
        const stripeCustomerId = eventDataObject.customer as string;
        const subscriptionStatusValue = 'inactive';

        if (!stripeCustomerId) break;

        // Immediately revoke edge access permissions across table definitions
        const { error: dbRevokeErr } = await supabase
          .from('profiles')
          .update({ stripe_subscription_status: subscriptionStatusValue })
          .eq('stripe_customer_id', stripeCustomerId);

        if (dbRevokeErr) {
          throw new Error(`Database record syncing failure inside revocation processing: ${dbRevokeErr.message}`);
        }

        console.log(`[REVENUE LOSS NOTICE] Workspace downgraded to inactive for Stripe ID: ${stripeCustomerId}`);
        break;
      }

      default: {
        console.log(`[WEBHOOK PASSTHROUGH] Unhandled routing condition item: ${eventType}`);
        break;
      }
    }

    // 3. Confirm reception back to Stripe control blocks to clear queue items
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error('CRITICAL MONETIZATION SYSTEM WEBHOOK PROCESSING ERROR:', error);
    return NextResponse.json(
      { error: 'Internal Processing Failure', message: error.message || 'Error occurred.' },
      { status: 500 }
    );
  }
}
