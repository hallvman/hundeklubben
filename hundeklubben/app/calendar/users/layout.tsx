import { checkAdminRole } from '@/utils/supabase/auth';
import { redirect } from 'next/navigation';

export default async function SignupLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const isAdmin = await checkAdminRole();
	if (!isAdmin.isAdmin) redirect('/calendar');

	return <div>{children}</div>;
}
