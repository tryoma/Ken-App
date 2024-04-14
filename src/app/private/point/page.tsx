'use client';
import { ProductWithPrices } from '@/type';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToastContext } from '@/context/ToastContext';

const Point = ({ searchParams }: { searchParams: any }) => {
  const { userId } = useAppContext();
  const showToast = useToastContext();
  const isStatus = searchParams['status'];
  const navigation = useRouter();
  const [pointWithProducts, setPointWithProducts] = useState<
    ProductWithPrices[] | null
  >(null);

  useEffect(() => {
    if (!isStatus) return; // isStatusが未定義の場合は何もしない

    if (isStatus === 'success') {
      setTimeout(() => {
        showToast('購入が完了しました', 'success');
      }, 1000);
    } else if (isStatus === 'failure') {
      setTimeout(() => {
        showToast('購入に失敗しました', 'error');
      }, 1000);
    }
  }, [isStatus, showToast]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/products');
      const data = await response.json();
      setPointWithProducts(data.data);
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="container mx-auto p-8">
        <div className="max-w-md mx-auto bg-white rounded p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-6">ポイントを購入する</h2>
          <div className="grid gap-4">
            {pointWithProducts &&
              pointWithProducts.map(product => (
                <div
                  key={product.id}
                  className="grid gap-4 p-4 border border-gray-300 rounded-md"
                >
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={'64'}
                        height={'64'}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-lg font-semibold">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {product.description}
                        </div>
                      </div>
                    </div>
                    {product.prices.map(price => (
                      <div key={price.id}>
                        <span>
                          {price.unit_amount?.toLocaleString()}
                          {price.currency.toLocaleUpperCase()}
                        </span>
                        <button
                          onClick={async () => {
                            const response = await fetch('/api/checkout', {
                              method: 'post',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                price_id: price.id,
                                user_id: userId,
                                point: product.description,
                              }),
                            }).then(data => data.json());
                            navigation.push(response.checkout_url);
                          }}
                          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
                        >
                          購入する
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Point;
