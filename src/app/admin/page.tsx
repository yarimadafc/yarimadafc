import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminDashboard from './AdminDashboard';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/adminAuth';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!(await verifySessionToken(token))) {
    redirect('/admin/login');
  }

  return <AdminDashboard />;
}
