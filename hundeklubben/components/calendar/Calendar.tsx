"use client";

import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CreateEventForm } from "../events/CreateEventForm";
import { EventDetails } from "../events/EventDetails";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);
// Mock event type
type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  attendees: string[];
};

// Mock initial events
const initialEvents: Event[] = [
  {
    id: "1",
    title: "Team Meeting",
    start: new Date(2025, 0, 8, 10, 0),
    end: new Date(2025, 0, 8, 11, 0),
    description: "Weekly team sync",
    attendees: ["alice@example.com", "bob@example.com"],
  },
  {
    id: "2",
    title: "Project Kickoff",
    start: new Date(2025, 0, 10, 14, 0),
    end: new Date(2025, 0, 10, 16, 0),
    description: "Kickoff meeting for new project",
    attendees: ["alice@example.com", "charlie@example.com"],
  },
];

export default function DogClubCalendar() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCreateEvent = (newEvent: Event) => {
    setEvents([...events, { ...newEvent, id: String(events.length + 1) }]);
    setShowCreateForm(false);
  };

  const handleJoinEvent = (eventId: string, attendee: string) => {
    setEvents(
      events.map((event) =>
        event.id === eventId
          ? { ...event, attendees: [...event.attendees, attendee] }
          : event
      )
    );
    setSelectedEvent(null);
  };

  return (
    <div style={{ height: "500px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleSelectEvent}
        style={{ height: "100%" }}
      />
      {showCreateForm && (
        <CreateEventForm
          onCreateEvent={handleCreateEvent}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onJoin={handleJoinEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
