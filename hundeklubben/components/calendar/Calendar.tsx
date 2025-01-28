'use client';

import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CreateEventForm } from './CreateEventForm';
import { EventDetails } from './EventDetails';
import { useEvents } from '@/hooks/useEvents';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Event } from '@/types/event';
import { getUser, getUserEmail } from '@/utils/supabase/auth';

import './index.css';
import { GetAllAttendees } from '@/utils/supabase/events';
import { CalendarEvent } from './CalendarEvent';
import { MonthEvent } from './MonthEvent';
import { WeekEvent } from './WeekEvent';
import { DayEvent } from './DayEvent';
import { Loader2 } from 'lucide-react';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

export default function DogClubCalendar() {
	const { toast } = useToast();
	const {
		events,
		loading,
		addEvent,
		updateEvent,
		removeFromEvent,
		deleteEvent,
	} = useEvents();
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [attendeesCount, setAttendeesCount] = useState<Record<string, number>>(
		{}
	);
	const [currentView, setCurrentView] = useState<View>('month');

	useEffect(() => {
		const fetchAttendeesCount = async () => {
			const counts: Record<string, number> = {};
			for (const event of events) {
				const attendees = await GetAllAttendees(event.id);
				counts[event.id] = attendees?.length || 0;
			}
			setAttendeesCount(counts);
		};

		fetchAttendeesCount();
	}, [events]);

	const handleSelectEvent = (event: Event) => {
		setSelectedEvent(event);
	};

	const handleCreateEvent = async (
		newEvent: Omit<Event, 'id' | 'creator' | 'user_id' | 'attendees'>
	) => {
		try {
			const user = await getUser();
			if (!user) {
				throw new Error('User not found');
			}
			const email = user?.email as string;
			const id = user?.id as string;
			const eventWithCreator = { ...newEvent, user_id: id, creator: email };
			await addEvent(eventWithCreator);
			setShowCreateForm(false);
			toast({
				title: 'Success',
				description: 'Event ble laget.',
			});
		} catch (error) {
			console.error('Error creating event:', error);
			toast({
				title: 'Error',
				description: 'Det oppstod en feil ved opprettelse av eventet.',
				variant: 'destructive',
			});
		}
	};

	const handleJoinEvent = async (eventId: string) => {
		const attendeeEmail = await getUserEmail();
		const event = events.find((e) => e.id === eventId);
		if (event) {
			const allAttendees = await GetAllAttendees(event.id);
			if (allAttendees?.length < event.attendees_limit) {
				updateEvent(event.id, attendeeEmail as string);
				toast({
					title: 'Success',
					description: 'Du er nå lagt til i eventet.',
				});
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
		const attendeeEmail = await getUserEmail();
		const event = events.find((e) => e.id === eventId);
		if (event) {
			removeFromEvent(eventId, attendeeEmail as string);
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

	const components = {
		event: ({ event }: { event: Event }) => {
			const attendeesCountForEvent = attendeesCount[event.id] || 0;

			switch (currentView) {
				case 'month':
					return (
						<MonthEvent event={event} attendeesCount={attendeesCountForEvent} />
					);
				case 'week':
					return (
						<WeekEvent event={event} attendeesCount={attendeesCountForEvent} />
					);
				case 'day':
					return (
						<DayEvent event={event} attendeesCount={attendeesCountForEvent} />
					);
				default:
					return (
						<CalendarEvent
							event={event}
							attendeesCount={attendeesCountForEvent}
						/>
					);
			}
		},
	};

	if (loading) {
		return <Loader2 className='h-8 w-8 animate-spin' />;
	}

	return (
		<div className='h-[700px] p-4'>
			<Calendar
				localizer={localizer}
				events={events}
				startAccessor='start'
				endAccessor='end'
				onSelectEvent={handleSelectEvent}
				onView={(view) => setCurrentView(view)}
				view={currentView}
				components={components}
				className='h-full'
				views={['month', 'week', 'day', 'agenda']}
			/>
			<Button onClick={() => setShowCreateForm(true)} className='mt-4'>
				Lag Event
			</Button>
			<Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Lag Event</DialogTitle>
					</DialogHeader>
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
					<DialogHeader>
						<DialogTitle>Event Detaljer</DialogTitle>
					</DialogHeader>
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
