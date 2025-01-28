import { Event } from '@/types/event';
import { UsersIcon, MapPinIcon, AlignLeft } from 'lucide-react';

interface DayEventProps {
	event: Event;
	attendeesCount: number;
}

export function DayEvent({ event, attendeesCount }: DayEventProps) {
	return (
		<div className='text-sm p-2'>
			<div className='flex items-center justify-between mt-1'>
				<div className='flex items-center'>
					<div className='font-semibold'>{event.title}</div>
				</div>
			</div>
			{event.description && (
				<div className='flex items-center mt-1'>
					<AlignLeft className='h-4 w-4 mr-1' />
					<span className='text-xs truncate'>{event.description}</span>
				</div>
			)}
			{event.location && (
				<div className='flex items-center mt-1'>
					<MapPinIcon className='h-4 w-4 mr-1' />
					<span className='text-xs truncate'>{event.location}</span>
				</div>
			)}
			{event.attendees_limit !== 0 && (
				<div className='flex items-center justify-between mt-1'>
					<div className='flex items-center'>
						<UsersIcon className='h-4 w-4 mr-1' />
						<span className='text-xs truncate'>
							{attendeesCount}/{event.attendees_limit}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
