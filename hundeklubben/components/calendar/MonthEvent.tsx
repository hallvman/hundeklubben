import { Event } from '@/types/event';
import { UsersIcon } from 'lucide-react';

interface MonthEventProps {
	event: Event;
	attendeesCount: number;
}

export function MonthEvent({ event, attendeesCount }: MonthEventProps) {
	return (
		<div className='text-xs p-1 flex justify-between items-center'>
			<div className='font-semibold truncate flex-grow'>{event.title}</div>
			<div className='flex items-center justify-between mt-1'>
				{event.attendees_limit !== 0 && (
					<div className='flex items-center'>
						<UsersIcon className='h-4 w-4 mr-1' />
						<span>
							{attendeesCount}/{event.attendees_limit}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
