import { ReactNode } from 'react';
import Header from '../parts/Header';
import Footer from '../parts/Footer';

const PrivateCommonLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow overflow-auto pt-10">{children}</main>
      <Footer />
    </div>
  );
};

export default PrivateCommonLayout;
