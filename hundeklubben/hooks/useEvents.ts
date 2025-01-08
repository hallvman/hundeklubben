"use client"

import { useState, useEffect } from 'react'
import { getAllEvents } from '@/utils/supabase/events'

export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  attendees: string[];
  attendees_limit: number;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const fetchedEvents = await getAllEvents()
        setEvents(fetchedEvents.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        })))
      } catch (error) {
        console.error('Error fetching events:', error)
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const addEvent = (newEvent: Omit<Event, 'id'>) => {
    const eventWithId = { ...newEvent, id: String(events.length + 1) };
    setEvents([...events, eventWithId]);
  }

  const updateEvent = (updatedEvent: Event) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ))
  }

  return { events, loading, addEvent, updateEvent }
}
