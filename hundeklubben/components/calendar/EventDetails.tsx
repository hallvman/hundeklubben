import { Event } from '@/types/event';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getUserEmail } from '@/utils/supabase/auth';
import { useState, useEffect } from 'react';
import { AlignLeft, Calendar, MapPin } from 'lucide-react';

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

	const attendeeCount = event.attendees?.length ?? 0;
	const hasAttendeeLimit =
		event.attendees_limit !== null && event.attendees_limit > 0;
	const isFull =
		hasAttendeeLimit && attendeeCount >= (event.attendees_limit ?? 0);
	const attendeePercentage = hasAttendeeLimit
		? Math.min((attendeeCount / (event.attendees_limit ?? 1)) * 100, 100)
		: 0;
	const isAttending =
		currentUserEmail && event.attendees?.includes(currentUserEmail);
	const isCreator = currentUserEmail === event.creator;

	return (
		<div className='space-y-4'>
			<h2 className='text-2xl font-bold'>{event.title}</h2>
			<p className='flex items-center mb-2'>
				<Calendar className='mr-2 h-4 w-4' />
				Starttidspunkt: {new Date(event.start).toLocaleDateString()}
			</p>
			<p className='flex items-center mb-2'>
				<Calendar className='mr-2 h-4 w-4' />
				Sluttidspunkt: {new Date(event.start).toLocaleDateString()}
			</p>
			<p className='flex items-center'>
				<AlignLeft className='mr-2 h-4 w-4' />
				{event.description}
			</p>
			<p className='flex items-center'>
				<MapPin className='mr-2 h-4 w-4' />
				<span>{event.location}</span>
			</p>
			{event.attendees && event.attendees.length > 0 && (
				<div>
					<h3 className='text-lg font-semibold'>Deltagere:</h3>
					<ul>
						{event.attendees.map((attendee, index) => (
							<li key={index}>{attendee}</li>
						))}
					</ul>
				</div>
			)}
			{hasAttendeeLimit && (
				<div>
					<p className='text-sm text-muted-foreground'>
						{attendeeCount} / {event.attendees_limit} deltagere
					</p>
					<Progress value={attendeePercentage} className='mt-2' />
				</div>
			)}
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
