import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Identify targeted protected path criteria
  const isProtectedPath = pathname.startsWith('/dashboard') || pathname.startsWith('/api/audit');

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // 2. Initialize a mutable response instance to manage active token cookie exchanges
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 3. Initialize server client context tracking standard auth states securely
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for definitive bypass control inside middleware operations
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set({ name, value, ...options });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  // 4. Retrieve the active user session token safely
  const { data: { session } } = await supabase.auth.getSession();

  // Guardrail check: If no authenticated session is resolved, handle routing structures immediately
  if (!session || !session.user) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized: Missing valid session headers.' }, { status: 401 });
    }
    const loginRedirectUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginRedirectUrl);
  }

  // 5. Query public cache profile records to verify monetization status flags
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('stripe_subscription_status')
    .eq('id', session.user.id)
    .single();

  // Guardrail check: Protect data structures if the ledger mapping status evaluates to anything but 'active'
  if (profileError || !profile || profile.stripe_subscription_status !== 'active') {
    // API responses get a clean semantic status response code
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Payment Required: This operational node requires an active premium subscription plan.' },
        { status: 403 }
      );
    }
    
    // Web application browsers are gently routed directly to the payment paywall grid setup
    const pricingRedirectUrl = new URL('/pricing', request.url);
    return NextResponse.redirect(pricingRedirectUrl);
  }

  return response;
}

// Map explicit paths parameters for execution speed optimization limits
export const config = {
  matcher: ['/dashboard/:path*', '/api/audit/:path*'],
};
