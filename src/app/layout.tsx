import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ken-App',
  description:
    '剣道の稽古管理アプリです。熟練者と初心者が繋がり、稽古を共有し合うことができます。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
