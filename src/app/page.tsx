// 'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center">
          <Image 
            src={'/images/logo/logo.jpg'}
            alt="logo"
            width={75}
            height={50}
            className='ml-1'
          />
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  ホーム
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  機能
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  価格
                </a>
              </li>
              <li>
                <Link
                  href={'/auth/login'}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  ログイン
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="bg-gray-100 text-center py-20">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4">剣道稽古を革新する</h1>
          <p className="text-gray-600 mb-8">あなたの剣道の技術を次のレベルへ</p>
          <a
            href="#"
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
          >
            今すぐ始める
          </a>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">主な機能</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-2xl text-blue-500 mb-4">📹</div>
              <h3 className="text-xl font-bold mb-2">動画アップロード</h3>
              <p className="text-gray-600">稽古の動画を簡単にアップロード</p>
            </div>
            <div className="text-center">
              <div className="text-2xl text-blue-500 mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">プライバシー保護</h3>
              <p className="text-gray-600">公開・非公開の設定が可能</p>
            </div>
            <div className="text-center">
              <div className="text-2xl text-blue-500 mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">コミュニティ</h3>
              <p className="text-gray-600">他のユーザーと交流</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>© 2023 あなたのサービス名. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
