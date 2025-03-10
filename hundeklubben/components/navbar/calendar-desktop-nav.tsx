import Link from 'next/link';
import { Calendar, PawPrintIcon as Paw, Settings, Users2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import NavItem from './nav-item';
import { checkAdminRole } from '@/utils/supabase/auth';

export default async function DesktopNav() {
	const isAdmin = await checkAdminRole();
	return (
		<aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex'>
			<nav className='flex flex-col items-center gap-4 px-2 sm:py-5'>
				<Link
					href='/'
					className='group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base'
				>
					<Paw className='h-8 w-8 bg-white stroke-black' />
					<span className='sr-only'>Hundeklubben</span>
				</Link>

				<NavItem href='/calendar' label='Kalender'>
					<Calendar className='h-5 w-5' />
				</NavItem>

				{isAdmin.isAdmin && (
					<NavItem href='/calendar/users' label='Medlemmer'>
						<Users2 className='h-5 w-5' />
					</NavItem>
				)}
			</nav>
			<nav className='mt-auto flex flex-col items-center gap-4 px-2 sm:py-5'>
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							href='#'
							className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8'
						>
							<Settings className='h-5 w-5' />
							<span className='sr-only'>Settings</span>
						</Link>
					</TooltipTrigger>
					<TooltipContent side='right'>Settings</TooltipContent>
				</Tooltip>
			</nav>
		</aside>
	);
}
