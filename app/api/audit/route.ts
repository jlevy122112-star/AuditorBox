import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const { imageUrl, projectScopeId, baselineRate } = await request.json();

    if (!imageUrl || !projectScopeId) {
      return NextResponse.json({ error: 'Missing Required Payload parameters.' }, { status: 400 });
    }

    // 1. Fire up OpenAI Vision analytical node to parse line items out of the photo
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Extract the total invoice dollar amount and individual material quantities from this bill of lading. Return ONLY a clean JSON block containing keys: totalAmount (number) and materialType (string)." },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const parsedData = JSON.parse(visionResponse.choices[0].message.content || '{}');
    const extractedTotal = parsedData.totalAmount || 0;

    // 2. Compute financial variance against your contractual ceiling rates
    const varianceAmount = extractedTotal > baselineRate ? extractedTotal - baselineRate : 0;
    const evaluationStatus = varianceAmount > 0 ? 'Variance Found' : 'Verified Compliant';

    // 3. Log data to your ready Supabase relational table grid
    const { data: loggedRecord, error: dbError } = await supabase
      .from('audit_logs')
      .insert([
        {
          project_id: projectScopeId,
          file_node_url: imageUrl,
          extracted_amount: extractedTotal,
          leak_amount: varianceAmount,
          system_status: evaluationStatus,
        }
      ])
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, auditRecord: loggedRecord });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
