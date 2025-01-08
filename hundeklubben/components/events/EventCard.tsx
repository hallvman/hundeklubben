import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, UsersIcon } from 'lucide-react';
import { Event } from '@/types/event';

export function EventCard({ event }: { event: Event }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{event.title}</CardTitle>
				<CardDescription>
					<div className='flex items-center space-x-2'>
						<CalendarIcon className='h-4 w-4' />
						<span>{new Date(event.start).toLocaleString()}</span>
					</div>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p className='text-sm text-muted-foreground mb-4'>
					{event.description}
				</p>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-2'>
						<UsersIcon className='h-4 w-4' />
						<span>
							{event.attendees.length} / {event.attendees_limit}
						</span>
					</div>
					<Badge
						variant={
							event.attendees.length >= event.attendees_limit
								? 'secondary'
								: 'default'
						}
					>
						{event.attendees.length >= event.attendees_limit ? 'Full' : 'Open'}
					</Badge>
				</div>
			</CardContent>
		</Card>
	);
}
