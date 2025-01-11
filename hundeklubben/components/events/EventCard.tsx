import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, UsersIcon, MapPinIcon, ClockIcon } from 'lucide-react';
import { Event } from '@/types/event';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

interface EventCardProps {
	event: Event;
	onDelete: (eventId: string) => Promise<void>;
	onEdit: (eventId: string) => void;
}

export function EventCard({ event, onDelete, onEdit }: EventCardProps) {
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await onDelete(event.id);
		} catch (error) {
			console.error('Failed to delete event:', error);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<Card className='h-full flex flex-col'>
			<CardHeader>
				<CardTitle className='flex justify-between items-center'>
					<span>{event.title}</span>
					{event.attendees_limit !== 0 && (
						<Badge
							variant={
								event.attendees.length >= event.attendees_limit
									? 'secondary'
									: 'default'
							}
						>
							{event.attendees.length >= event.attendees_limit
								? 'Fullt'
								: 'Åpent'}
						</Badge>
					)}
				</CardTitle>
				<CardDescription>
					<div className='flex items-center space-x-2'>
						<CalendarIcon className='h-4 w-4' />
						<span>{new Date(event.start).toLocaleDateString()}</span>
					</div>
				</CardDescription>
			</CardHeader>
			<CardContent className='flex-grow'>
				<p className='text-sm text-muted-foreground mb-4'>
					{event.description}
				</p>
				<div className='space-y-2'>
					<div className='flex items-center space-x-2'>
						<MapPinIcon className='h-4 w-4' />
						<span className='text-sm'>{event.location}</span>
					</div>
					<div className='flex items-center space-x-2'>
						<ClockIcon className='h-4 w-4' />
						<span className='text-sm'>
							{new Date(event.start).toLocaleDateString()} -{' '}
							{new Date(event.start).toLocaleTimeString()}
						</span>
					</div>
					<div className='flex items-center space-x-2'>
						<ClockIcon className='h-4 w-4' />
						<span className='text-sm'>
							{new Date(event.end).toLocaleDateString()} -{' '}
							{new Date(event.end).toLocaleTimeString()}
						</span>
					</div>
					<div className='flex items-center space-x-2'>
						<UsersIcon className='h-4 w-4' />
						<span className='text-sm'>
							{event.attendees.length} / {event.attendees_limit} deltakere
						</span>
					</div>
				</div>
			</CardContent>
			<CardFooter className='flex justify-between'>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant='outline'>Deltagere</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{event.title}</DialogTitle>
							<DialogDescription>
								Arrangert av: {event.creator}
							</DialogDescription>
						</DialogHeader>
						<div className='space-y-4'>
							<h4 className='font-semibold'>
								Deltakere ({event.attendees.length}/{event.attendees_limit}):
							</h4>
							<ul className='list-disc list-inside'>
								{event.attendees.map((attendee, index) => (
									<li key={index}>{attendee}</li>
								))}
							</ul>
						</div>
					</DialogContent>
				</Dialog>
				<div className='space-x-2'>
					<Button variant='outline' onClick={() => onEdit(event.id)}>
						Rediger
					</Button>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant='destructive' disabled={isDeleting}>
								{isDeleting ? 'Sletter...' : 'Slett'}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Er du sikker?</AlertDialogTitle>
								<AlertDialogDescription>
									Denne handlingen kan ikke angres. Dette vil permanent slette
									arrangementet.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Avbryt</AlertDialogCancel>
								<AlertDialogAction onClick={handleDelete}>
									Slett
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</CardFooter>
		</Card>
	);
}
