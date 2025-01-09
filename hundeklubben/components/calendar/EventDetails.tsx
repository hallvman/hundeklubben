import { Event } from '@/types/event';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getUserEmail } from '@/utils/supabase/auth';
import { useState, useEffect } from 'react';

interface EventDetailsProps {
	event: Event;
	onJoin: (eventId: string) => void;
	onLeave: (eventId: string) => void;
	onDelete: (eventId: string) => void;
	onClose: () => void;
}

export function EventDetails({
	event,
	onJoin,
	onLeave,
	onDelete,
	onClose,
}: EventDetailsProps) {
	const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

	useEffect(() => {
		async function fetchUserEmail() {
			const email = await getUserEmail();
			setCurrentUserEmail(email as string);
		}
		fetchUserEmail();
	}, []);

	const handleJoin = () => {
		onJoin(event.id);
	};

	const handleLeave = () => {
		onLeave(event.id);
	};

	const handleDelete = () => {
		onDelete(event.id);
	};

	const attendeeCount = event.attendees.length;
	const isFull = attendeeCount >= event.attendees_limit;
	const attendeePercentage = (attendeeCount / event.attendees_limit) * 100;
	const isAttending =
		currentUserEmail && event.attendees.includes(currentUserEmail);
	const isCreator = currentUserEmail === event.creator;

	return (
		<div className='space-y-4'>
			<h2 className='text-2xl font-bold'>{event.title}</h2>
			<p>Starttidspunkt: {event.start.toLocaleString()}</p>
			<p>Sluttidspunkt: {event.end.toLocaleString()}</p>
			<p>{event.description}</p>
			<p>{event.location}</p>
			<div>
				<h3 className='text-lg font-semibold'>Deltagere:</h3>
				<ul>
					{event.attendees.map((attendee, index) => (
						<li key={index}>{attendee}</li>
					))}
				</ul>
			</div>
			<div>
				<p className='text-sm text-muted-foreground'>
					{attendeeCount} / {event.attendees_limit} deltagere
				</p>
				<Progress value={attendeePercentage} className='mt-2' />
			</div>
			<div className='flex justify-end space-x-2'>
				{!isAttending && (
					<Button onClick={handleJoin} disabled={isFull} aria-disabled={isFull}>
						{isFull ? 'Event Full' : 'Join Event'}
					</Button>
				)}
				{isAttending && !isCreator && (
					<Button onClick={handleLeave} variant='destructive'>
						Forlat Event
					</Button>
				)}
				{isCreator && (
					<Button onClick={handleDelete} variant='destructive'>
						Slett Event
					</Button>
				)}
				<Button variant='outline' onClick={onClose}>
					Lukk
				</Button>
			</div>
			{isFull && (
				<p className='text-sm text-red-500' role='alert'>
					Dette eventet har nådd max antall.
				</p>
			)}
		</div>
	);
}
