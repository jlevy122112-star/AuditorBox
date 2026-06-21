import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export async function POST(req: NextRequest) {
  try {
    const { userId, projectId, invoiceName, invoiceFileBase64, vendorEmail } = await req.json();

    if (!userId || !projectId || !invoiceFileBase64) {
      return NextResponse.json({ error: 'Bad Request: Missing parameters.' }, { status: 400 });
    }

    // 1. Verify Project Ownership (Cross-Tenant Security Validation Check)
    const { data: verifiedProject, error: projectVerifyErr } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single();

    if (projectVerifyErr || !verifiedProject) {
      console.error(`[SECURITY TAMPER ALERT] User ${userId} attempted to log data to unauthorized project workspace: ${projectId}`);
      return NextResponse.json({ error: 'Forbidden: Project validation matching failure.' }, { status: 403 });
    }

    // 2. Production Core LLM System Hook Point
    // This is where your base64 string flows directly into your OpenAI vision payload model.
    const mockSavedVarianceAmount = 1450.00; 
    const mockGeneratedDisputeText = `Attention Accounts Payable,\n\nOur contract specifies flat-rate pricing for bulk materials on this jobsite. Your delivery ticket matches invoice line charges that reflect a unit rate inflation. Please adjust by issuing a credit memo for $1,450.00.`;

    const reportId = `rep_${Date.now()}`;

    // 3. Track calculations securely inside the database ledger tracking lines
    const { error: insertErr } = await supabase
      .from('audit_reports')
      .insert({
        id: reportId,
        user_id: userId,
        project_id: projectId,
        invoice_name: invoiceName || 'Unresolved_Document_Ticket.pdf',
        vendor_email: vendorEmail || 'billing@supplier-domain.com',
        dispute_email_draft: mockGeneratedDisputeText,
        saved_amount: mockSavedVarianceAmount,
        status: 'variance_found'
      });

    if (insertErr) {
      throw new Error(`Database transaction exception writing audit ledger: ${insertErr.message}`);
    }

    return NextResponse.json({
      success: true,
      reportId,
      leakDetectedAmount: mockSavedVarianceAmount,
      message: 'Forensic audit processing sequence finalized cleanly and safely verified.'
    }, { status: 200 });

  } catch (err: any) {
    console.error('CRITICAL SYSTEM FAILURE IN AUDIT LOG ENGINE:', err);
    return NextResponse.json({ error: 'Internal Analysis Fault', message: err.message }, { status: 500 });
  }
}
    }

    const senderPhoneNumber = twilioFormObject['From'];
    const twilioMediaUrl = twilioFormObject['MediaUrl0'];

    // 2. Identify Linked Field Staff in Database Cache
    const { data: foremanRecord, error: dbLookupError } = await supabase
      .from('foremen')
      .select('project_id, foreman_name, projects(user_id, project_name)')
      .eq('phone_number', senderPhoneNumber)
      .single();

    if (dbLookupError || !foremanRecord) {
      return new NextResponse(
        `<Response><Message>AuditorBox System Alert: Phone number ${senderPhoneNumber} is unmapped. Contact your project manager.</Message></Response>`,
        { headers: { 'Content-Type': 'text/xml' } }
      );
    }

    const projectId = foremanRecord.project_id;
    const foremanName = foremanRecord.foreman_name;
    const projectJoinData = (foremanRecord as any).projects;
    const userId = projectJoinData?.user_id;
    const projectName = projectJoinData?.project_name;

    if (!twilioMediaUrl) {
      return new NextResponse(
        `<Response><Message>Hello ${foremanName}. We found your link to "${projectName}". Please reply directly to this thread with a PHOTO of your material ticket to run the audit.</Message></Response>`,
        { headers: { 'Content-Type': 'text/xml' } }
      );
    }

    // 3. Fire-and-Forget Background Async Worker Processing Stream (Zero-Latency Core Response)
    const primaryAuditEndpoint = `${req.nextUrl.origin}/api/audit`;
    
    // Executing via void keeps the pipeline open while instantly freeing up the Twilio connection
    void (async () => {
      try {
        const imagePayloadResponse = await fetch(twilioMediaUrl);
        const imageArrayBuffer = await imagePayloadResponse.arrayBuffer();
        const imageBase64String = Buffer.from(imageArrayBuffer).toString('base64');

        await fetch(primaryAuditEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            projectId,
            invoiceName: `SMS_Intake_${new Date().toISOString().split('T')[0]}_${foremanName.replace(/\s+/g, '_')}.jpeg`,
            invoiceFileBase64: imageBase64String,
          }),
        });
      } catch (bgError) {
        console.error('[BACKGROUND TASK EXCEPTION]', bgError);
      }
    })();

    // 4. Return instant TwiML XML layout to clear client gateway holds
    return new NextResponse(
      `<Response><Message>Got it, ${foremanName}! Ticket logged for "${projectName}". Checking contract rates for overcharges now.</Message></Response>`,
      { headers: { 'Content-Type': 'text/xml' }, status: 200 }
    );

  } catch (globalError) {
    console.error('CRITICAL LOGISTIC FAILURE IN TEXT BOT WEBHOOK ENDPOINT:', globalError);
    return new NextResponse('<Response><Message>System processing anomaly. Please retry snapshot download shortly.</Message></Response>', {
      headers: { 'Content-Type': 'text/xml' },
      status: 500
    });
  }
}
xexport async function POST(req: NextRequest) {
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
