// app/api/klines/route.ts
import { NextRequest } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  // Đảm bảo xử lý đúng URL cả khi chạy server-side
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const { searchParams } = new URL(req.url, baseUrl);

  const symbol = searchParams.get('symbol');
  const interval = searchParams.get('interval');

  if (!symbol || !interval) {
    return new Response(JSON.stringify({ error: 'Missing symbol or interval' }), { status: 400 });
  }

  try {
    // Giảm limit xuống 500 để tránh timeout/serverless limit
    const response = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=500`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; VercelBot/1.0)'
        }
      }
    );
    // Log số lượng nến trả về
    const candles = response.data;
    console.log('Binance candles length:', candles.length);
    return new Response(JSON.stringify(candles), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=60, stale-while-revalidate' // cache CDN 60s
      }
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error?.message || 'Failed to fetch data',
        detail: error?.response?.data || null
      }),
      { status: 500 }
    );
  }
}
