'use client';

import { Calendar, AlignLeft, MapPin } from 'lucide-react';
import { Event } from '@/types/event';

interface CalendarEventProps {
	event: Event;
	attendeesCount: number;
}

export function CalendarEvent({ event, attendeesCount }: CalendarEventProps) {
	return (
		<div>
			<h4>{event.title}</h4>
			<p className='flex items-center mb-2'>
				<Calendar className='mr-2 h-4 w-4' />
				Starttidspunkt: {new Date(event.start).toLocaleDateString()} -{' '}
				{new Date(event.start).toLocaleTimeString()}
			</p>
			<p className='flex items-center mb-2'>
				<Calendar className='mr-2 h-4 w-4' />
				Sluttidspunkt: {new Date(event.start).toLocaleDateString()} -{' '}
				{new Date(event.end).toLocaleTimeString()}
			</p>
			{event.description && (
				<p className='flex items-center'>
					<AlignLeft className='mr-2 h-4 w-4' />
					{event.description}
				</p>
			)}
			{event.location && (
				<p className='flex items-center'>
					<MapPin className='mr-2 h-4 w-4' />
					<span>{event.location}</span>
				</p>
			)}
		</div>
	);
}
