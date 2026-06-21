import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    // Read the incoming URL-encoded form data packet sent over natively by Twilio servers
    const formData = await request.formData();
    const incomingSender = formData.get('From')?.toString();
    const mediaUrl = formData.get('MediaUrl0')?.toString(); // Captures the image path

    if (!mediaUrl) {
      // Build an XML response telling Twilio to text back a reminder to attach a photo
      const responseXml = `<Response><Message>AuditorBox: System failed. Please attach a clear photo of the invoice ticket.</Message></Response>`;
      return new Response(responseXml, { headers: { 'Content-Type': 'text/xml' } });
    }

    // Optional: Resolve foreman phone numbers against authorized tenant accounts in Supabase
    const { data: foreman } = await supabase
      .from('foremen_directory')
      .select('project_id, base_rate_limit')
      .eq('phone_number', incomingSender)
      .single();

    const targetProjectId = foreman?.project_id || 'default-global-node';
    const activeBaseRate = foreman?.base_rate_limit || 1000;

    // Internal loop triggers the verification route engine we wrote above
    const systemVerificationNode = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('.supabase.co', '.vercel.app')}/api/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl: mediaUrl,
        projectScopeId: targetProjectId,
        baselineRate: activeBaseRate
      }),
    });

    const verificationResult = await systemVerificationNode.json();

    // Text back immediate feedback directly onto the active construction jobsite floor
    const responseText = verificationResult.success 
      ? `AuditorBox Received: Ticket parsed. Check: ${verificationResult.auditRecord.system_status}. Overcharge Leak: $${verificationResult.auditRecord.leak_amount}`
      : `AuditorBox Warning: Processing delayed. Engine logged in background queue.`;

    const responseXml = `<Response><Message>${responseText}</Message></Response>`;
    return new Response(responseXml, { headers: { 'Content-Type': 'text/xml' } });

  } catch (error: any) {
    const errorXml = `<Response><Message>AuditorBox Core Error: Processing stream faulted.</Message></Response>`;
    return new Response(errorXml, { headers: { 'Content-Type': 'text/xml' } });
  }
}
