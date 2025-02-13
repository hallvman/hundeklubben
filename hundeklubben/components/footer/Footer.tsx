'use client';
import { usePathname } from 'next/navigation';

export default function Footer() {
	const pathname = usePathname();

	if (pathname.startsWith('/calendar')) {
		return null;
	}

	return (
		<footer className='bg-primary text-primary-foreground py-6'>
			<div className='container mx-auto px-4 text-center'>
				<p>&copy; 2025 Dog Club Calendar. Alle rettigheter reservert.</p>
				<p className='mt-2'>
					Laget av <strong>Pharus Development</strong> | Org. number:{' '}
					<strong>XXXXXX-XXXX</strong>
				</p>
			</div>
		</footer>
	);
}
