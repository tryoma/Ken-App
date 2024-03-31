import { ProductWithPrices } from '@/type';
import PointMain from './components/PointMain';
import logger from '../../../../logger';

interface ApiResponse {
  data: ProductWithPrices[];
}

async function getData() {
  logger.info(`Stripe webhook start! ${process.env.NEXT_PUBLIC_API_BASE_URL}`);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`
  );

  if (!response.ok) {
    // エラーハンドリングを追加
    throw new Error('Failed to fetch data');
  }
  const { data } = (await response.json()) as ApiResponse;

  return data;
}

const Point = async ({ searchParams }: { searchParams: any }) => {
  const data = await getData();
  const isStatus = searchParams['status'];

  return <PointMain pointWithProducts={data} isStatus={isStatus ?? ''} />;
};

export default Point;
