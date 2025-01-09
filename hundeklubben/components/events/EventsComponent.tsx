'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllMyEvents, deleteEvent } from '@/utils/supabase/events';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { EventCard } from './EventCard';
import { Event } from '@/types/event';
import { useToast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 9;

export default function EventsComponent() {
	const [events, setEvents] = useState<Event[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const router = useRouter();
	const { toast } = useToast();

	useEffect(() => {
		fetchEvents();
	}, []);

	const fetchEvents = async () => {
		console.log('events', events);
		setIsLoading(true);
		setError(null);
		try {
			const fetchedEvents = await getAllMyEvents(page, ITEMS_PER_PAGE);
			setEvents((prevEvents) => [...prevEvents, ...fetchedEvents]);
			setPage((prevPage) => prevPage + 1);
		} catch (err) {
			setError('Failed to fetch events. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleRefresh = () => {
		setEvents([]);
		setPage(1);
		fetchEvents();
		router.refresh();
	};

	const handleDeleteEvent = async (eventId: string) => {
		try {
			await deleteEvent(eventId);
			setEvents((prevEvents) =>
				prevEvents.filter((event) => event.id !== eventId)
			);
			toast({
				title: 'Suksess',
				description: 'Arrangementet ble slettet.',
			});
		} catch (err) {
			toast({
				title: 'Feil',
				description: 'Kunne ikke slette arrangementet. Vennligst prøv igjen.',
				variant: 'destructive',
			});
		}
	};

	const handleEditEvent = (eventId: string) => {
		router.push(`/events/edit/${eventId}`);
	};

	if (isLoading && events.length === 0) {
		return <Loader2 className='h-8 w-8 animate-spin' />;
	}

	if (error) {
		return (
			<div className='text-center'>
				<p className='text-red-500 mb-4'>{error}</p>
				<Button onClick={handleRefresh}>Prøv igjen</Button>
			</div>
		);
	}

	return (
		<div className='container mx-auto p-4'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold'>Mine arrangementer</h1>
			</div>
			{events.length === 0 ? (
				<p className='text-muted-foreground'>
					Du har ikke laget noen arrangementer.
				</p>
			) : (
				<>
					<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
						{events.map((event) => (
							<EventCard
								key={event.id}
								event={event}
								onDelete={handleDeleteEvent}
								onEdit={handleEditEvent}
							/>
						))}
					</div>
					{isLoading ? (
						<div className='text-center mt-4'>
							<Loader2 className='h-8 w-8 animate-spin inline-block' />
						</div>
					) : (
						<div className='text-center mt-4'>
							<Button onClick={fetchEvents} disabled={isLoading}>
								Last inn mer
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
}
