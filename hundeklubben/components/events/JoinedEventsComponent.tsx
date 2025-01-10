'use client';

import { useToast } from '@/hooks/use-toast';
import { getUser } from '@/utils/supabase/auth';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { leaveEvent } from '@/utils/supabase/events';

interface JoinedEvent {
	id: string;
	title: string;
	description: string;
	date: string;
	location: string;
}

export default function JoinedEventsComponent() {
	const [userEmail, setUserEmail] = useState('');
	const [joinedEvents, setJoinedEvents] = useState<JoinedEvent[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
	const router = useRouter();
	const { toast } = useToast();
	const supabase = createClient();

	useEffect(() => {
		fetchEvents();
	}, []);

	const fetchEvents = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const user = await getUser();
			if (!user) {
				setError('User not found. Please log in.');
				return;
			}
			setUserEmail(user.email as string);

			const { data: attendeeData, error: attendeeError } = await supabase
				.from('event_attendees')
				.select('event_id')
				.eq('attendees_email', user.email);

			if (attendeeError) throw attendeeError;

			if (!attendeeData || attendeeData.length === 0) {
				setJoinedEvents([]);
				return;
			}

			const eventIds = attendeeData.map((item) => item.event_id);
			const { data: eventsData, error: eventsError } = await supabase
				.from('events')
				.select('*')
				.in('id', eventIds);

			if (eventsError) throw eventsError;

			const formattedEvents = eventsData.map((event) => ({
				id: event.id,
				title: event.title,
				description: event.description,
				date: new Date(event.start).toLocaleDateString(),
				location: event.location,
			}));

			setJoinedEvents(formattedEvents);
		} catch (err) {
			setError('Failed to fetch events. Please try again.');
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleLeaveEvent = async () => {
		if (!selectedEventId) return;

		const result = await leaveEvent(selectedEventId, userEmail);
		if (result.success) {
			toast({
				title: 'Success',
				description: 'You have left the event.',
			});
			fetchEvents(); // Refresh the list of joined events
		} else {
			toast({
				title: 'Error',
				description:
					result.error || 'Failed to leave the event. Please try again.',
				variant: 'destructive',
			});
		}
		setIsDialogOpen(false);
		setSelectedEventId(null);
	};

	const handleRefresh = () => {
		fetchEvents();
	};

	const openLeaveDialog = (eventId: string) => {
		setSelectedEventId(eventId);
		setIsDialogOpen(true);
	};

	if (isLoading) {
		return <Loader2 className='h-8 w-8 animate-spin' />;
	}

	if (error) {
		return (
			<div className='text-center'>
				<p className='text-red-500 mb-4'>{error}</p>
				<Button onClick={handleRefresh}>Try again</Button>
			</div>
		);
	}

	return (
		<div className='container mx-auto p-4'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold'>Påmeldte arrangementer</h1>
			</div>
			{joinedEvents.length === 0 ? (
				<p>Du har ikke meldt deg opp i noen arrangementer.</p>
			) : (
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
					{joinedEvents.map((event) => (
						<Card key={event.id}>
							<CardHeader>
								<CardTitle>{event.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-sm text-muted-foreground mb-2'>
									{event.description}
								</p>
								<p className='text-sm font-medium'>Dato: {event.date}</p>
								<p className='text-sm font-medium'>
									Destinasjon: {event.location}
								</p>
							</CardContent>
							<CardFooter>
								<Button
									onClick={() => openLeaveDialog(event.id)}
									variant='destructive'
									className='w-full'
								>
									Forlat Event
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Leave Event</DialogTitle>
						<DialogDescription>
							Are you sure you want to leave this event? This action cannot be
							undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant='secondary' onClick={() => setIsDialogOpen(false)}>
							Cancel
						</Button>
						<Button variant='destructive' onClick={handleLeaveEvent}>
							Leave Event
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
