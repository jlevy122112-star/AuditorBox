import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';

// Ensure standard, defensive environment variable validation at compile/runtime
if (!process.env.OPENAI_API_KEY) {
  throw new Error('CRITICAL CONFIGURATION ERROR: Missing OPENAI_API_KEY environment variable.');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('CRITICAL CONFIGURATION ERROR: Missing NEXT_PUBLIC_SUPABASE_URL environment variable.');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('CRITICAL CONFIGURATION ERROR: Missing SUPABASE_SERVICE_ROLE_KEY environment variable.');
}

// Initialize stateful API SDK clients once globally
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

interface IncomingRequestBody {
  userId: string;
  projectId: string;
  invoiceName: string;
  invoiceFileBase64: string;
  vendorEmail?: string;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Parse inbound request payload details safely
    const body: IncomingRequestBody = await req.json();
    const { userId, projectId, invoiceName, invoiceFileBase64, vendorEmail } = body;

    if (!userId || !projectId || !invoiceName || !invoiceFileBase64) {
      return NextResponse.json(
        { error: 'Bad Request: Missing required structural parameters.' },
        { status: 400 }
      );
    }

    // 2. Gatekeeping Check: Validate active Stripe Profile Status
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('stripe_subscription_status')
      .eq('id', userId)
      .single();

    if (profileErr || !profile) {
      return NextResponse.json(
        { error: 'Unauthorized: User workspace profile context not found.' },
        { status: 403 }
      );
    }

    if (profile.stripe_subscription_status !== 'active') {
      return NextResponse.json(
        { error: 'Payment Required: Access restricted until an active subscription is linked.' },
        { status: 403 }
      );
    }

    // 3. Database Sync: Fetch baseline target contract array
    const { data: bidSheet, error: bidSheetErr } = await supabase
      .from('bid_sheets')
      .select('extracted_json')
      .eq('project_id', projectId)
      .single();

    if (bidSheetErr || !bidSheet) {
      return NextResponse.json(
        { error: 'Not Found: Target project contract baseline bid sheet could not be resolved.' },
        { status: 404 }
      );
    }

    // Ensure type safety of the unstructured database json data matrix
    const baselineContractItems = bidSheet.extracted_json;

    // 4. Progress Billing Aggregation: Pull past audit runs to calculate dynamic project ceilings
    const { data: pastReports, error: reportsErr } = await supabase
      .from('audit_reports')
      .select('discrepancy_json')
      .eq('project_id', projectId)
      .eq('status', 'Flagged');

    if (reportsErr) {
      return NextResponse.json(
        { error: 'Database Internal Error: Failed to run historical cumulative trace.' },
        { status: 500 }
      );
    }

    // Flatten previous historical overcharges to capture cumulative quantities already run
    const historicalBillingSummary = pastReports?.flatMap((report) => {
      if (Array.isArray(report.discrepancy_json)) {
        return report.discrepancy_json;
      }
      return [];
    }) || [];

    // 5. Vision AI Extraction Layer: Extract structured table items from base64 string
    const visionResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You are an elite structural construction accountant data extractor. Process this visual construction asset and extract every line item. Return a JSON object containing an array named "items" matching exactly this TypeScript structure: {"items": Array<{item_description: string, quantity: number, unit_price: number, total_price: number}>}. Do not output any conversational filler text, markdown formatting blocks, or backticks. Return raw parsed JSON text only.',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extract and normalize all tabular row lines found inside this invoice or delivery ticket image payload string.' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${invoiceFileBase64}` } },
          ],
        },
      ],
    });

    const parsedVisionText = visionResponse.choices[0].message.content;
    if (!parsedVisionText) {
      throw new Error('AI Layer Failure: Vision model returned an empty string output parameter.');
    }

    const extractedInvoiceJson = JSON.parse(parsedVisionText);
    const invoiceItems = extractedInvoiceJson.items || [];

    // 6. Semantic Reconciliation Processing Layer: Compute discrepancies using structural contexts
    const reconciliationResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are an expert forensic accountant auditing heavy industrial construction material supplier invoices against contract bids. 
          Your goal is to run comparison evaluations between the Incoming Current Invoice array and the Master Baseline Contract array, while accounting for the Historical Cumulative Runs already captured across the lifecycle of this project.

          Perform item mapping based entirely on contextual semantic proximity and word meanings (e.g., matching "1/2-in Copper Elbow" to "Cpr Elb .50" or "Schedule 40 PVC 2inch" to "2 inch PVC Pipe").

          Flag structural discrepancies under these strict operational boundaries:
          1. The current incoming invoiced unit_price is higher than the baseline contract unit_price for that matched part profile.
          2. The current invoice quantity combined with the historical cumulative quantities already billed for that matched item exceeds the absolute maximum allowed limit specified in the master contract baseline dataset.

          For every overcharge anomaly caught, map the calculated metrics fields accurately:
          variance_loss = (charged_price - expected_price) * current_invoice_quantity.
          
          Sum all individual variance_loss values together to compute the absolute total 'amount_saved' figure.

          In tandem, compile a professional, direct, formal email draft written from the sub-contractor business position addressed to the vendor's billing division. Outline the specific contract price breaches or quantity cap line items, cite the exact figures, and firmly demand a formal credit memo.

          You must return a JSON object matching exactly this structure:
          {
            "status": "Flagged" | "Clean",
            "amount_saved": number,
            "discrepancies": Array<{item_description: string, expected_price: number, charged_price: number, variance_loss: number, reason: string}>,
            "dispute_email_draft": string
          }
          Do not output any markdown formatting code wrapping indicators. Return raw JSON string parameters only.`,
        },
        {
          role: 'user',
          content: JSON.stringify({
            master_contract_baseline: baselineContractItems,
            historical_cumulative_runs: historicalBillingSummary,
            current_incoming_delivery: invoiceItems,
          }),
        },
      ],
    });

    const parsedReconciliationText = reconciliationResponse.choices[0].message.content;
    if (!parsedReconciliationText) {
      throw new Error('AI Layer Failure: Reconciliation model returned an empty processing payload.');
    }

    const auditOutput = JSON.parse(parsedReconciliationText);

    // 7. Commit Record Database Sync: Final write execution updates the dashboard widget via immediate schema insert
    const { data: newAuditReport, error: insertErr } = await supabase
      .from('audit_reports')
      .insert({
        user_id: userId,
        project_id: projectId,
        invoice_name: invoiceName,
        vendor_email: vendorEmail || null,
        amount_saved: auditOutput.amount_saved || 0.00,
        status: auditOutput.status || 'Clean',
        discrepancy_json: auditOutput.discrepancies || [],
        dispute_email_draft: auditOutput.dispute_email_draft || '',
      })
      .select()
      .single();

    if (insertErr || !newAuditReport) {
      throw new Error(`Database Commit Failure: ${insertErr?.message || 'Empty row selection returned.'}`);
    }

    // 8. Return comprehensive success parameters back to the client interface layer
    return NextResponse.json({
      success: true,
      report: newAuditReport,
    });

  } catch (error: any) {
    console.error('CRITICAL BACKEND OPERATION FAULT IN /api/audit:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message || 'An unexpected failure occurred.' },
      { status: 500 }
    );
  }
}
