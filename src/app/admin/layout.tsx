import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel | Yarımada FK',
  robots: { index: false, follow: false },
};

// The admin area always uses the dark navy palette, independent of the public site's theme toggle.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="dark admin-theme">{children}</div>;
}
