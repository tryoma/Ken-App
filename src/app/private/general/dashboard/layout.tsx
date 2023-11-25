import type { Metadata } from 'next';
import Sidebar from '@/app/components/Sidebar';

export const metadata: Metadata = {
  title: 'Ken-app',
  description: '剣道コミュニティサービスです。',
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto my-8">
      <div className="md:flex md:space-x-4">
        <div className="md:w-1/4 h-full bg-white shadow-md p-4">
          <Sidebar />
        </div>

        <div className="mt-4 sm:mt-0 md:w-3/4 bg-white shadow-md p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
