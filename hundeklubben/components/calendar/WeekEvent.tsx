import { Event } from '@/types/event';
import { Badge } from '@/components/ui/badge';
import { UsersIcon } from 'lucide-react';

interface WeekEventProps {
	event: Event;
	attendeesCount: number;
}

export function WeekEvent({ event, attendeesCount }: WeekEventProps) {
	return (
		<div className='text-xs p-1'>
			<div className='font-semibold truncate'>{event.title}</div>

			<div className='flex items-center'>
				<UsersIcon className='h-3 w-3 mr-1' />
				<span>
					{attendeesCount}/{event.attendees_limit}
				</span>
			</div>
		</div>
	);
}
