import { redirect } from 'next/navigation';

// The school and the academy are the same section of the site.
export default function SchoolPage() {
  redirect('/academy');
}
