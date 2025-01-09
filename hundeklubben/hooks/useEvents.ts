"use client"

import { useState, useEffect } from 'react'
import { getAllEvents, addEvent as addEventToDb, deleteEvent as deleteEventFromDb } from '@/utils/supabase/events'
import { Event } from '@/types/event'

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

  const addEvent = async (newEvent: Omit<Event, 'id'>) => {
    try {
      const addedEvent = await addEventToDb(newEvent)
      setEvents([...events, { ...addedEvent, start: new Date(addedEvent.start).toLocaleDateString(), end: new Date(addedEvent.end).toLocaleDateString() }])
    } catch (error) {
      console.error('Error adding event:', error)
    }
  }

  const updateEvent = (updatedEvent: Event) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ))
  }

  const deleteEvent = async (eventId: string) => {
    try {
      await deleteEventFromDb(eventId)
      setEvents(events.filter(event => event.id !== eventId))
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  return { events, loading, addEvent, updateEvent, deleteEvent }
}

