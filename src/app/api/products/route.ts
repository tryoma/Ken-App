import { stripe } from '@/app/stripe';
import { ProductWithPrices } from '@/type';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  if (req.method !== 'GET') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const products = await stripe.products.list();

  const productsWithPrices: ProductWithPrices[] = await Promise.all(
    products.data.map(async product => {
      const prices = await stripe.prices.list({
        product: product.id,
      });

      return {
        id: product.id,
        description: product.description,
        name: product.name,
        images: product.images,
        unit_label: product.unit_label,
        prices: prices.data.map(price => {
          return {
            id: price.id,
            currency: price.currency,
            unit_amount: price.unit_amount,
          };
        }),
      };
    })
  );

  return NextResponse.json({ data: productsWithPrices }, { status: 200 });
}
