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

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

export default function DogClubCalendar() {
	const { toast } = useToast();
	const { events, loading, addEvent, updateEvent } = useEvents();
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

	const handleSelectEvent = (event: Event) => {
		setSelectedEvent(event);
	};

	const handleCreateEvent = (newEvent: Omit<Event, 'id'>) => {
		addEvent(newEvent);
		setShowCreateForm(false);
	};

	const handleJoinEvent = (eventId: string, attendee: string) => {
		const event = events.find((e) => e.id === eventId);
		if (event) {
			if (event.attendees.length < event.attendees_limit) {
				updateEvent({ ...event, attendees: [...event.attendees, attendee] });
				toast({
					title: 'Success',
					description: 'You have successfully joined the event.',
				});
			} else {
				toast({
					title: 'Error',
					description: 'This event is already full.',
					variant: 'destructive',
				});
			}
		}
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
				Create Event
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
							onClose={() => setSelectedEvent(null)}
						/>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
