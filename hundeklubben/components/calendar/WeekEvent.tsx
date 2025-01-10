import { Event } from '@/types/event';
import { Badge } from '@/components/ui/badge';
import { UsersIcon, MapPinIcon, AlignLeft, Calendar } from 'lucide-react';

interface DayEventProps {
	event: Event;
	attendeesCount: number;
}

export function WeekEvent({ event, attendeesCount }: DayEventProps) {
	return (
		<div className='text-sm p-2'>
			<div className='flex items-center justify-between mt-1'>
				<div className='flex items-center'>
					<div className='font-semibold'>{event.title}</div>
				</div>
			</div>
			<div className='flex items-center mt-1'>
				<AlignLeft className='h-4 w-4 mr-1' />
				<span className='text-xs truncate'>{event.description}</span>
			</div>
			<div className='flex items-center mt-1'>
				<MapPinIcon className='h-4 w-4 mr-1' />
				<span className='text-xs truncate'>{event.location}</span>
			</div>
			<div className='flex items-center justify-between mt-1'>
				<div className='flex items-center'>
					<UsersIcon className='h-4 w-4 mr-1' />
					<span className='text-xs truncate'>
						{attendeesCount}/{event.attendees_limit}
					</span>
				</div>
			</div>
		</div>
	);
}
