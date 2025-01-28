'use client';
import Link from 'next/link';
import { PawPrintIcon as Paw } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { User } from '../navbar/user';
import { useUser } from '@/hooks/useUser';

export default function Header() {
	const pathname = usePathname();

	const user = useUser();
	const userId = user?.user?.id as string;
	if (pathname.startsWith('/calendar')) {
		return null;
	}
	return (
		<header className='bg-primary text-primary-foreground'>
			<div className='container mx-auto px-4 py-6'>
				<div className='flex items-center justify-between'>
					<Link href='/' className='flex items-center space-x-2'>
						<Paw className='h-8 w-8' />
						<span className='text-2xl font-bold'>
							Tønsberg Hundeklubb sin Kalender
						</span>
					</Link>
					<nav className='hidden md:flex space-x-8'></nav>
					<User userId={userId} />
				</div>
			</div>
		</header>
	);
}
