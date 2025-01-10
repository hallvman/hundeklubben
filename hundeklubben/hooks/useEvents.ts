"use client"

import { useState, useEffect } from 'react'
import { getAllEvents, addEvent as addEventToDb, deleteEvent as deleteEventFromDb, joinEvent, deleteFromEvent } from '@/utils/supabase/events'
import { Event } from '@/types/event'
import { redirect } from 'next/navigation'

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

  const addEvent = async (newEvent: Omit<Event, 'id' |'attendees'>) => {
    try {
      const addedEvent = await addEventToDb(newEvent)
      setEvents([...events, { ...addedEvent, start: new Date(addedEvent.start), end: new Date(addedEvent.end) }])
    } catch (error) {
      console.error('Error adding event:', error)
    }
  }

  const updateEvent = async (event_id: string, email: string) => {
    try {
      await joinEvent(event_id, email);
    } catch (error) {
      
    }
  }

  const removeFromEvent = async (event_id: string, email:string) => {
    try {
      await deleteFromEvent(event_id, email)
    } catch (error) {
      
    }
  }

  const deleteEvent = async (eventId: string) => {
    try {
      await deleteEventFromDb(eventId)
      setEvents(events.filter(event => event.id !== eventId))
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  return { events, loading, addEvent, updateEvent, removeFromEvent, deleteEvent }
}

