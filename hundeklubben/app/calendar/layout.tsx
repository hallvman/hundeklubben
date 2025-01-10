import Providers from '@/components/providers/providers';
import DesktopNav from '@/components/navbar/calendar-desktop-nav';
import MobileNav from '@/components/navbar/calendar-mobile-nav';
import { User } from '@/components/navbar/user';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { SearchInput } from '@/components/calendar/search';
import { DashboardBreadcrumb } from '@/components/navbar/Breadcrumb';

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const userId = user?.id as string;

	if (!user) redirect('/');

	return (
		<Providers>
			<main className='flex min-h-screen w-full flex-col'>
				<DesktopNav />
				<div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
					<header className='sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
						<MobileNav />
						<DashboardBreadcrumb />
						<User userId={userId} />
					</header>
					<main className='grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4'>
						{children}
					</main>
				</div>
			</main>
		</Providers>
	);
}
