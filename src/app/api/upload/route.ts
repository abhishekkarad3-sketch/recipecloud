import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
    const apiKey = process.env.CLOUDINARY_API_KEY!;
    const apiSecret = process.env.CLOUDINARY_API_SECRET!;
    const timestamp = Math.round(Date.now() / 1000);

    const signature = crypto
      .createHash('sha1')
      .update(`folder=recipecloud&timestamp=${timestamp}${apiSecret}`)
      .digest('hex');

    const upload = new FormData();
    upload.append('file', file);
    upload.append('api_key', apiKey);
    upload.append('timestamp', String(timestamp));
    upload.append('signature', signature);
    upload.append('folder', 'recipecloud');

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: upload }
    );
    const data = await res.json();
    return NextResponse.json({ url: data.secure_url });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
