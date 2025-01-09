'use client';

import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CreateEventForm } from './CreateEventForm';
import { EventDetails } from './EventDetails';
import { useEvents } from '@/hooks/useEvents';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Event } from '@/types/event';
import { getUserEmail } from '@/utils/supabase/auth';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

export default function DogClubCalendar() {
	const { toast } = useToast();
	const { events, loading, addEvent, updateEvent, deleteEvent } = useEvents();
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

	const handleSelectEvent = (event: Event) => {
		setSelectedEvent(event);
	};

	const handleCreateEvent = async (newEvent: Omit<Event, 'id'>) => {
		const creatorEmail = await getUserEmail();
		const eventWithCreator = { ...newEvent, creator: creatorEmail as string };
		addEvent(eventWithCreator);
		setShowCreateForm(false);
		toast({
			title: 'Success',
			description: 'Event ble laget.',
		});
	};

	const handleJoinEvent = async (eventId: string) => {
		const attendee = await getUserEmail();
		const event = events.find((e) => e.id === eventId);
		if (event) {
			if (event.attendees.length < event.attendees_limit) {
				if (!event.attendees.includes(attendee as string)) {
					updateEvent({
						...event,
						attendees: [...event.attendees, attendee as string],
					});
					toast({
						title: 'Success',
						description: 'Du er nå lagt til i eventet.',
					});
				} else {
					toast({
						title: 'Error',
						description: 'Du er allerede lagt til i dette eventet.',
						variant: 'destructive',
					});
				}
			} else {
				toast({
					title: 'Error',
					description: 'Dette eventet er fult.',
					variant: 'destructive',
				});
			}
		}
		setSelectedEvent(null);
	};

	const handleLeaveEvent = async (eventId: string) => {
		const attendee = await getUserEmail();
		const event = events.find((e) => e.id === eventId);
		if (event) {
			const updatedAttendees = event.attendees.filter((a) => a !== attendee);
			updateEvent({ ...event, attendees: updatedAttendees });
			toast({
				title: 'Success',
				description: 'Du er nå fjernet fra eventet',
			});
		}
		setSelectedEvent(null);
	};

	const handleDeleteEvent = async (eventId: string) => {
		await deleteEvent(eventId);
		toast({
			title: 'Success',
			description: 'Eventet ble slettet.',
		});
		setSelectedEvent(null);
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className='h-[700px] p-4'>
			<Calendar
				localizer={localizer}
				events={events}
				startAccessor='start'
				endAccessor='end'
				onSelectEvent={handleSelectEvent}
				className='h-full'
			/>
			<Button onClick={() => setShowCreateForm(true)} className='mt-4'>
				Lag Event
			</Button>
			<Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
				<DialogContent>
					<CreateEventForm
						onCreateEvent={handleCreateEvent}
						onCancel={() => setShowCreateForm(false)}
					/>
				</DialogContent>
			</Dialog>
			<Dialog
				open={!!selectedEvent}
				onOpenChange={() => setSelectedEvent(null)}
			>
				<DialogContent>
					{selectedEvent && (
						<EventDetails
							event={selectedEvent}
							onJoin={handleJoinEvent}
							onLeave={handleLeaveEvent}
							onDelete={handleDeleteEvent}
							onClose={() => setSelectedEvent(null)}
						/>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
