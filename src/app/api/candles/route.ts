import { NextRequest } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol');
  const interval = searchParams.get('interval');
  if (!symbol || !interval) {
    return new Response(JSON.stringify({ error: 'Missing symbol or interval' }), { status: 400 });
  }
  try {
    const response = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=1000`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VercelBot/1.0)' } }
    );
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || 'Failed to fetch data', detail: error?.response?.data }), { status: 500 });
  }
}
