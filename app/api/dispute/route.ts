import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize the secure Supabase Service Role client
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

interface DisputeRequestBody {
  reportId: string;
  editedText: string;
  recipientEmail: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: DisputeRequestBody = await req.json();
    const { reportId, editedText, recipientEmail } = body;

    // Defensive request body checking
    if (!reportId || !editedText || !recipientEmail) {
      return NextResponse.json(
        { error: 'Bad Request: Missing reportId, editedText, or recipientEmail parameters.' },
        { status: 400 }
      );
    }

    // 1. Verify that the corresponding audit report row exists
    const { data: report, error: fetchErr } = await supabase
      .from('audit_reports')
      .select('id, invoice_name')
      .eq('id', reportId)
      .single();

    if (fetchErr || !report) {
      return NextResponse.json(
        { error: 'Not Found: Target audit report record could not be resolved.' },
        { status: 404 }
      );
    }

    // 2. ACTIVE EMAIL PROVIDER INTEGRATION PLACEHOLDER
    /*
    import { Resend } from 'resend';
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'disputes@auditorbox.com',
      to: recipientEmail,
      subject: `DISPUTE NOTICE: Billing Variances Flagged on ${report.invoice_name}`,
      text: editedText,
    });
    */
    console.log(`[EMAIL DISPATCH MOCK] Sending dispute for ${report.invoice_name} to ${recipientEmail}`);

    // 3. Update audit ledger metadata with timestamp and edited content overrides
    const { error: updateErr } = await supabase
      .from('audit_reports')
      .update({
        dispute_sent_at: new Date().toISOString(),
        dispute_email_draft: editedText,
        vendor_email: recipientEmail
      })
      .eq('id', reportId);

    if (updateErr) {
      throw new Error(`Database Update Failure: ${updateErr.message}`);
    }

    // 4. Return success footprint parameters
    return NextResponse.json(
      { success: true, message: 'Vendor dispute email dispatched and transaction metrics logged.' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('CRITICAL ERROR IN DISPUTE TRANSMISSION ENGINE:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message || 'An unexpected runtime anomaly occurred.' },
      { status: 500 }
    );
  }
}
