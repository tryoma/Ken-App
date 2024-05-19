'use client';

import { useToastContext } from "@/context/ToastContext";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin } = useUserContext();
  const showToast = useToastContext();
  const router = useRouter();

  if (!isAdmin) {
    showToast('権限がありません', 'error');
    router.push('/private/general/dashboard');
    return null;
  }

  return <>{children}</>;
}
