import { ProductWithPrices } from '@/type';
import PointMain from './components/PointMain';

interface ApiResponse {
  data: ProductWithPrices[];
}

async function getData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`
  );
  const { data } = (await response.json()) as ApiResponse;

  return data;
}

const Point = async ({ searchParams }: { searchParams: any }) => {
  const data = await getData();
  const isStatus = searchParams['status'];

  return <PointMain pointWithProducts={data} isStatus={isStatus ?? ''} />;
};

export default Point;
