import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export async function POST(req: NextRequest) {
  try {
    const rawBodyText = await req.text();
    
    // 1. Validate Cryptographic Twilio Signatures to Block Spoofing Attacks
    const twilioSignatureHeader = req.headers.get('x-twilio-signature') || '';
    const absoluteWebHookUrl = req.url;
    
    // Convert raw text streams back into operational URL parameters for parsing validation
    const urlParams = new URLSearchParams(rawBodyText);
    const twilioFormObject: Record<string, string> = {};
    urlParams.forEach((value, key) => { twilioFormObject[key] = value; });

    const isRequestLegitimate = twilio.validateRequest(
      process.env.TWILIO_AUTH_TOKEN!,
      twilioSignatureHeader,
      absoluteWebHookUrl,
      twilioFormObject
    );

    if (!isRequestLegitimate) {
      console.error('[SECURITY ALERT] Unauthorized Twilio spoofing attempt blocked.');
      return new NextResponse('<Response><Message>Security Error: Request validation signature match failed.</Message></Response>', {
        headers: { 'Content-Type': 'text/xml' },
        status: 401
      });
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
        <Response>
          <Message>AuditorBox Error: Your mobile number (${senderPhoneNumber}) is not registered to any active jobsite workspaces. Alert your operations manager to enable access controls.</Message>
        </Response>
      `;
      return new NextResponse(twimlUnrecognized, { headers: { 'Content-Type': 'text/xml' } });
    }

    // Unpack relational table mapping dependencies clearly
    const projectId = foremanRecord.project_id;
    const foremanName = foremanRecord.foreman_name;
    const projectJoinData = (foremanRecord as any).projects;
    const userId = projectJoinData?.user_id;
    const projectName = projectJoinData?.project_name;

    // 3. Fallback gate validation check: Did the foreman send a text without a camera asset attached?
    if (!twilioMediaUrl) {
      const twimlMissingMedia = `
        <Response>
          <Message>Hello ${foremanName}, we found your link to "${projectName}". Please reply directly to this thread with a clear PHOTO or SNAPSHOT of the material delivery receipt to run the price audit.</Message>
        </Response>
      `;
      return new NextResponse(twimlMissingMedia, { headers: { 'Content-Type': 'text/xml' } });
    }

    // 4. Download media attachment from Twilio and pipe into native base64 text strings
    const imagePayloadResponse = await fetch(twilioMediaUrl);
    if (!imagePayloadResponse.ok) {
      throw new Error('Telecom Proxy Failure: Unable to securely fetch image binary assets from Twilio CDN.');
    }
    
    const imageArrayBuffer = await imagePayloadResponse.arrayBuffer();
    const imageBase64String = Buffer.from(imageArrayBuffer).toString('base64');

    // 5. Asynchronously trigger the primary core audit processing engine route
    const operationalProcessingEndpoint = `${req.nextUrl.origin}/api/audit`;
    
    // Execute a non-blocking request to stay inside Twilio's required 15-second response window
    fetch(operationalProcessingEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId,
        projectId: projectId,
        invoiceName: `SMS_Intake_${new Date().toISOString().split('T')[0]}_${foremanName.replace(/\s+/g, '_')}.jpeg`,
        invoiceFileBase64: imageBase64String,
        vendorEmail: null,
      }),
    }).catch((asyncError) => {
      console.error('CRITICAL BACKGROUND AUDIT ASSIGNMENT PIPE REJECTION:', asyncError);
    });

    // 6. Return successful TwiML response block to provide instant status confirmation back to the foreman
    const twimlExecutionSuccess = `
      <Response>
        <Message>Receipt received, ${foremanName}! Logged successfully to the "${projectName}" workspace ledger. Checking unit rates and quantity totals for contract overcharges now.</Message>
      </Response>
    `;
    
    return new NextResponse(twimlExecutionSuccess, {
      headers: { 'Content-Type': 'text/xml' },
      status: 200,
    });

  } catch (globalError: any) {
    console.error('CRITICAL LOGISTIC FAILURE IN TEXT BOT WEBHOOK ENDPOINT:', globalError);
    
    const twimlCriticalError = `
      <Response>
        <Message>AuditorBox Network Error: We encountered an error processing your image stream file. Please resnap and send again shortly.</Message>
      </Response>
    `;
    
    return new NextResponse(twimlCriticalError, {
      headers: { 'Content-Type': 'text/xml' },
      status: 500,
    });
  }
}
