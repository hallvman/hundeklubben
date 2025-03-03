'use client';

import type { Event } from '@/types/event';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getUserEmail } from '@/utils/supabase/auth';
import { useState, useEffect } from 'react';
import { AlignLeft, Calendar, MapPin } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { GetAllAttendees } from '@/utils/supabase/events';

interface EventDetailsProps {
	event: Event;
	onJoin: (eventId: string) => void;
	onLeave: (eventId: string) => void;
	onDelete: (eventId: string) => void;
	onClose: () => void;
}

export function EventDetails({
	event,
	onJoin,
	onLeave,
	onDelete,
	onClose,
}: EventDetailsProps) {
	const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [attendees, setAttendees] = useState<{
		confirmed: string[];
		waitlist: string[];
	}>({
		confirmed: [],
		waitlist: [],
	});

	useEffect(() => {
		async function fetchData() {
			const email = await getUserEmail();
			setCurrentUserEmail(email as string);

			const eventAttendees = await GetAllAttendees(event.id);
			setAttendees({
				confirmed: eventAttendees
					.filter((a) => a.status === 'confirmed')
					.map((a) => a.attendees_email),
				waitlist: eventAttendees
					.filter((a) => a.status === 'waitlist')
					.map((a) => a.attendees_email),
			});
		}
		fetchData();
	}, [event.id]);

	const handleJoin = () => {
		onJoin(event.id);
	};

	const handleLeave = () => {
		onLeave(event.id);
	};

	const handleDelete = () => {
		onDelete(event.id);
		setIsDeleteDialogOpen(false);
	};

	const confirmedCount = attendees.confirmed.length;
	const waitlistCount = attendees.waitlist.length;
	const hasAttendeeLimit =
		event.attendees_limit !== null && event.attendees_limit > 0;
	const isFull =
		hasAttendeeLimit && confirmedCount >= (event.attendees_limit ?? 0);
	const attendeePercentage = hasAttendeeLimit
		? Math.min((confirmedCount / (event.attendees_limit ?? 1)) * 100, 100)
		: 0;
	const isAttending =
		currentUserEmail && attendees.confirmed.includes(currentUserEmail);
	const isOnWaitlist =
		currentUserEmail && attendees.waitlist.includes(currentUserEmail);
	const isCreator = currentUserEmail === event.creator;

	return (
		<div className='space-y-4'>
			<h2 className='text-2xl font-bold'>{event.title}</h2>
			<p className='flex items-center mb-2'>
				<Calendar className='mr-2 h-4 w-4' />
				Starttidspunkt: {new Date(event.start).toLocaleDateString(
					'no-NB'
				)} - {new Date(event.start).toLocaleTimeString('no-NB')}
			</p>
			<p className='flex items-center mb-2'>
				<Calendar className='mr-2 h-4 w-4' />
				Sluttidspunkt: {new Date(event.end).toLocaleDateString('no-NB')} -{' '}
				{new Date(event.end).toLocaleTimeString('no-NB')}
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
			{hasAttendeeLimit && (
				<div>
					<p className='text-sm text-muted-foreground'>
						{confirmedCount} / {event.attendees_limit} deltagere
					</p>
					<Progress value={attendeePercentage} className='mt-2' />
				</div>
			)}
			{waitlistCount > 0 && (
				<p className='text-sm text-muted-foreground'>
					{waitlistCount} {waitlistCount === 1 ? 'person' : 'personer'} på
					venteliste
				</p>
			)}
			<div className='flex justify-end space-x-2'>
				{!isAttending && !isOnWaitlist && (
					<Button onClick={handleJoin}>
						{isFull ? 'Bli med på venteliste' : 'Bli med på event'}
					</Button>
				)}
				{(isAttending || isOnWaitlist) && (
					<Button onClick={handleLeave} variant='destructive'>
						{isAttending ? 'Forlat Event' : 'Forlat venteliste'}
					</Button>
				)}
				{isCreator && (
					<Dialog
						open={isDeleteDialogOpen}
						onOpenChange={setIsDeleteDialogOpen}
					>
						<DialogTrigger asChild>
							<Button variant='destructive'>Slett Event</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>
									Er du sikker på at du vil slette dette eventet?
								</DialogTitle>
								<DialogDescription>
									Denne handlingen kan ikke angres. Dette vil permanent slette
									eventet og fjerne alle tilknyttede data.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<Button
									variant='outline'
									onClick={() => setIsDeleteDialogOpen(false)}
								>
									Avbryt
								</Button>
								<Button variant='destructive' onClick={handleDelete}>
									Slett Event
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				)}
				<Button variant='outline' onClick={onClose}>
					Lukk
				</Button>
			</div>
			{isFull && !isOnWaitlist && !isAttending && (
				<p className='text-sm text-yellow-500' role='alert'>
					Dette eventet har nådd maks antall deltakere. Du blir lagt til på
					ventelisten.
				</p>
			)}
		</div>
	);
}
