import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o';

const SYSTEM_PROMPT = `You are a document text extraction service for a scholarship expense reporting app. Your only job is to read printed text from receipt or invoice images and return that text exactly as it appears. You do not analyze, summarize, or refuse—you only output the visible text, line by line, preserving order and line breaks. Output in the same language as the receipt (Korean, English, or mixed).`;

const USER_TEXT = `Extract every line of text visible in this receipt image. Return only the raw text, one line per line in the image. No explanation, no headings, no "here is the text"—just the extracted lines.`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY is not configured' },
      { status: 500 }
    );
  }

  let file: File;
  try {
    const formData = await request.formData();
    const image = formData.get('image');
    if (!image || !(image instanceof File)) {
      return NextResponse.json(
        { error: 'Missing or invalid image file (use form field "image")' },
        { status: 400 }
      );
    }
    file = image;
  } catch {
    return NextResponse.json(
      { error: 'Failed to parse form data' },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString('base64');
  const mime = file.type || 'image/jpeg';
  const dataUrl = `data:${mime};base64,${base64}`;

  const body = {
    model: MODEL,
    max_tokens: 4096,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: dataUrl } },
          { type: 'text', text: USER_TEXT },
        ],
      },
    ],
  };

  const res = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('OpenAI OCR error:', res.status, err);
    return NextResponse.json(
      { error: 'OCR request failed', details: err },
      { status: res.status === 402 ? 402 : 502 }
    );
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  let text = data.choices?.[0]?.message?.content?.trim() ?? '';

  // Treat refusals / safety responses as no output so client can fall back or retry
  const refusalPhrases = [
    "i'm sorry",
    "i can't assist",
    "i cannot assist",
    "i am unable",
    "cannot help",
    "can't help",
  ];
  if (refusalPhrases.some((p) => text.toLowerCase().includes(p))) {
    text = '';
  }

  return NextResponse.json({ text });
}
