import { Event } from '@/types/event';
import { Badge } from '@/components/ui/badge';

interface MonthEventProps {
	event: Event;
	attendeesCount: number;
}

export function MonthEvent({ event, attendeesCount }: MonthEventProps) {
	return (
		<div className='text-xs p-1 flex justify-between items-center'>
			<div className='font-semibold truncate flex-grow'>{event.title}</div>
			<Badge
				variant={
					attendeesCount >= event.attendees_limit ? 'secondary' : 'default'
				}
				className='text-[10px] px-1 py-0 ml-1 flex-shrink-0'
			>
				{attendeesCount >= event.attendees_limit ? 'Fullt' : 'Åpent'}
			</Badge>
		</div>
	);
}
