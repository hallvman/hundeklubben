import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';

function hero() {
	return (
		<section className='text-secondary-foreground py-20'>
			<div className='container mx-auto px-4 text-center'>
				<h2 className='text-4xl font-bold mb-4'>
					Velkommen til Tønsberg Hundeklubb's kalender
				</h2>
				<p className='text-xl mb-8'>
					Meld deg opp og hold deg oppdatert på hva som skjer!
				</p>
				<Button size='lg'>
					<Link href='/events'>Se Alle Eventer</Link>
				</Button>
			</div>
		</section>
	);
}

export default hero;
