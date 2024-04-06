import Stripe from 'stripe';
import { stripe } from '@/app/stripe';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { PointHistory } from '@/type';
import { UserService } from '@/service/useCase/user.service';
import { PointHistoryService } from '@/service/useCase/point-history.service';

export async function POST(request: Request) {
  console.log({ request });
  return NextResponse.json({
    message: `Hello Stripe end!`,
  });
  // const body = await request.text();
  // const signature = headers().get('stripe-signature') as string;
  // const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
  // if (!signature) {
  //   return NextResponse.json(
  //     {
  //       message: 'Bad request',
  //     },
  //     {
  //       status: 400,
  //     }
  //   );
  // }
  // let event: Stripe.Event;
  // try {
  //   event = stripe.webhooks.constructEvent(body, signature, secret);
  //   if (
  //     event.type !== 'checkout.session.completed' &&
  //     event.type !== 'checkout.session.async_payment_succeeded'
  //   ) {
  //     return NextResponse.json({
  //       message: `Hello Stripe end!`,
  //     });
  //   }
  //   if (event.data.object.payment_status === 'paid') {
  //     const item = await stripe.checkout.sessions.listLineItems(
  //       event.data.object.id
  //     );
  //     const userId = event.data.object.metadata?.userId;
  //     const point = event.data.object.metadata?.point;

  //     if (!userId || !point) {
  //       return NextResponse.json({
  //         message: `Hello Stripe end!`,
  //       });
  //     }

  //     const user = await UserService.fetchUser(userId);

  //     if (!user) {
  //       return NextResponse.json({
  //         message: `Hello Stripe end!`,
  //       });
  //     }

  //     const newPoint = (user?.point || 0) + +point;
  //     await UserService.updateUser(user.id, { point: newPoint });

  //     const pointHistory: Omit<PointHistory, 'id'> = {
  //       userId,
  //       historyType: 'purchase',
  //       point: +point,
  //       item,
  //     };
  //     await PointHistoryService.createPointHistory(pointHistory);

  //   }
  //   return NextResponse.json({
  //     message: `Hello Stripe webhook!`,
  //   });
  // } catch (err) {
  //   const errorMessage = `⚠️  Webhook signature verification failed. ${
  //     (err as Error).message
  //   }`;

  //   return new Response(errorMessage, {
  //     status: 400,
  //   });
  // }
}
