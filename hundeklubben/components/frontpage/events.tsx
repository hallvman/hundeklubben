import { useState, useEffect } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
	getAllPublicEvents,
	getLatestPublicEvents,
} from '@/utils/supabase/events';
import { Event } from '@/types/event';

export default function Events() {
	const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
	const [latestEvents, setLatestEvents] = useState<Event[]>([]);

	useEffect(() => {
		async function fetchEvents() {
			const allEvents = await getAllPublicEvents();
			const now = new Date();
			const futureEvents = allEvents.filter(
				(event) => new Date(event.start) > now
			);
			setUpcomingEvents(futureEvents);

			const latest = await getLatestPublicEvents(3);
			setLatestEvents(latest);
		}

		fetchEvents();
	}, []);

	return (
		<section id='events' className='py-16'>
			<div className='container mx-auto px-4'>
				<h3 className='text-3xl font-bold mb-8 text-center'>
					Kommende Eventer
				</h3>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{upcomingEvents.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
				</div>

				<h3 className='text-3xl font-bold my-8 text-center'>
					Seneste Tilføjede Eventer
				</h3>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{latestEvents.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
				</div>
			</div>
		</section>
	);
}

function EventCard({ event }: { event: Event }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{event.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<p className='flex items-center mb-2'>
					<Calendar className='mr-2 h-4 w-4' />
					{new Date(event.start).toLocaleDateString()}
				</p>
				<p className='flex items-center'>
					<MapPin className='mr-2 h-4 w-4' />
					{event.location}
				</p>
			</CardContent>
		</Card>
	);
}
