import { NextRequest, NextResponse } from 'next/server';
import { extractInvoiceData } from '@/lib/fuel';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fuelData = await extractInvoiceData(buffer);
    
    return NextResponse.json(fuelData);
  } catch (error) {
    console.error('Error processing fuel invoice:', error);
    return NextResponse.json(
      { error: 'Failed to process fuel invoice' }, 
      { status: 500 }
    );
  }
}