import { Event } from '@/types/event';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface EventDetailsProps {
	event: Event;
	onJoin: (eventId: string, attendee: string) => void;
	onClose: () => void;
}

export function EventDetails({ event, onJoin, onClose }: EventDetailsProps) {
	const handleJoin = () => {
		const attendee = 'New Attendee';
		onJoin(event.id, attendee);
	};

	const attendeeCount = event.attendees.length;
	const isFull = attendeeCount >= event.attendees_limit;
	const attendeePercentage = (attendeeCount / event.attendees_limit) * 100;

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
				<Button onClick={handleJoin} disabled={isFull} aria-disabled={isFull}>
					{isFull ? 'Event Full' : 'Join Event'}
				</Button>
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
