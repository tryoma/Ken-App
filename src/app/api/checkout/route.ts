import { stripe } from '@/app/stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: Request) {
  const bodyBuffer = await req.arrayBuffer(); // リクエスト本文をバッファとして取得
  const requestBody = new TextDecoder().decode(bodyBuffer); // バッファを文字列に変換

  const requestBodyJSON = JSON.parse(requestBody); // JSONとして解析

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: requestBodyJSON.price_id,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/private/point?status=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/private/point?status=failure`,
    metadata: {
      userId: requestBodyJSON.user_id,
      point: requestBodyJSON.point,
    },
  });
  return NextResponse.json({
    checkout_url: session.url,
  });
}
