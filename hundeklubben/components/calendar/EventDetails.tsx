import { Event } from '@/hooks/useEvents';
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
			<p>Start: {event.start.toLocaleString()}</p>
			<p>End: {event.end.toLocaleString()}</p>
			<p>{event.description}</p>
			<div>
				<h3 className='text-lg font-semibold'>Attendees:</h3>
				<ul>
					{event.attendees.map((attendee, index) => (
						<li key={index}>{attendee}</li>
					))}
				</ul>
			</div>
			<div>
				<p className='text-sm text-muted-foreground'>
					{attendeeCount} / {event.attendees_limit} attendees
				</p>
				<Progress value={attendeePercentage} className='mt-2' />
			</div>
			<div className='flex justify-end space-x-2'>
				<Button onClick={handleJoin} disabled={isFull} aria-disabled={isFull}>
					{isFull ? 'Event Full' : 'Join Event'}
				</Button>
				<Button variant='outline' onClick={onClose}>
					Close
				</Button>
			</div>
			{isFull && (
				<p className='text-sm text-red-500' role='alert'>
					This event has reached its attendee limit.
				</p>
			)}
		</div>
	);
}
