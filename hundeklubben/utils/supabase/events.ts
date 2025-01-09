"use server"

import { revalidatePath } from 'next/cache';
import { createClient } from './server';
import { Event } from '@/types/event'

export async function getAllEvents() {
  const supabase = createClient()
  
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('*')

  if (eventsError) {
    console.error('Error fetching events:', eventsError)
    return []
  }

  const eventsWithAttendees = await Promise.all(events.map(async (event) => {
    const { data: attendees, error: attendeesError } = await supabase
      .from('event_attendees')
      .select('attendees_email')
      .eq('event_id', event.id)

    if (attendeesError) {
      console.error(`Error fetching attendees for event ${event.id}:`, attendeesError)
      return { ...event, attendees: [] }
    }

    return { ...event, attendees: attendees.map(a => a.attendees_email) }
  }))

  return eventsWithAttendees
}

export async function getAllPublicEvents(): Promise<Event[]> {
    const supabase = createClient()

  const { data: publicEvents, error: eventsError } = await supabase
    .from('events')
    .select(`
      *,
      attendee_count:event_attendees(count)
    `)
    .eq('isPublic', true)
    .order('created_at', { ascending: false })

  if (eventsError) {
    console.error('Error fetching public events:', eventsError)
    return []
  }

  return publicEvents || []
}

export async function getLatestPublicEvents(limit: number = 3): Promise<Event[]> {
    const supabase = createClient()

  const { data: latestEvents, error: eventsError } = await supabase
    .from('events')
    .select(`
      *,
      attendee_count:event_attendees(count)
    `)
    .eq('isPublic', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (eventsError) {
    console.error('Error fetching latest public events:', eventsError)
    return []
  }

  return latestEvents || []
}

export async function addEvent(event: Omit<Event, 'id'>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select()
  
  if (error) {
    console.error('Error adding event:', error)
    throw error
  }
  
  revalidatePath('/calendar')
  return data[0] as Event
}

export async function deleteEvent(eventId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath('/calendar')
  return { success: true, message: `Event ble slettet!` }
}

export async function updateEventAttendees(eventId: string, attendees: string[]) {
  const supabase = createClient()
  const { error } = await supabase
    .from('events')
    .update({ attendees })
    .eq('id', eventId)

  if (error) {
    console.error('Error updating event attendees:', error)
    throw error
  }

  revalidatePath('/calendar')
}

export async function getAllMyEvents(page = 1, itemsPerPage = 9): Promise<Event[]> {
  const supabase = createClient();
  
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error fetching user:', userError);
      throw new Error('Failed to authenticate user');
    }

    if (!user) {
      console.error('No authenticated user found');
      throw new Error('No authenticated user found');
    }

    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .range(from, to)
      .order('start', { ascending: true });

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      throw new Error('Failed to fetch events');
    }

    const eventsWithAttendees = await Promise.all(
      events.map(async (event: Event) => {
        const { data: attendees, error: attendeesError } = await supabase
          .from('event_attendees')
          .select('attendees_email')
          .eq('event_id', event.id);

        if (attendeesError) {
          console.error(`Error fetching attendees for event ${event.id}:`, attendeesError);
          return { ...event, attendees: [] };
        }

        return { ...event, attendees: attendees.map((a: { attendees_email: string }) => a.attendees_email) };
      })
    );

    return eventsWithAttendees;
  } catch (error) {
    console.error('Unexpected error in getAllMyEvents:', error);
    throw error;
  }
}

