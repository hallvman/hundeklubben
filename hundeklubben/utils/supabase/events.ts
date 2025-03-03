"use server"

import { createClient } from './server';
import { Event } from '@/types/event'
import { redirect } from 'next/navigation';

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

export async function GetAllAttendees(event_id: string) {
    const supabase = createClient()

  const { data: latestEvents, error: eventsError } = await supabase
    .from('event_attendees')
    .select('*')
    .eq('event_id', event_id)

  if (eventsError) {
    console.error('Error fetching latest public events:', eventsError)
    return []
  }

  return latestEvents || []
}

export async function addEvent(event: Omit<Event, 'id' | 'attendees'>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select()
  
  if (error) {
    console.error('Error adding event:', error)
    throw error
  }
  
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

  redirect('/calendar')
}

export async function joinEvent(eventId: string, email: string) {
  const supabase = createClient()

  // Get current attendee count
  const { count } = await supabase
    .from("event_attendees")
    .select("*", { count: "exact" })
    .eq("event_id", eventId)
    .eq("status", "confirmed")
    .single()

  // Get event details
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single()

  if (!event) {
    throw new Error("Event not found")
  }

  // Determine if user should go to waitlist
  const status = count && count >= event.attendees_limit ? "waitlist" : "confirmed"

  // Add attendee
  const { error } = await supabase
    .from("event_attendees")
    .upsert({
      event_id: eventId,
      attendees_email: email,
      status,
    })

  if (error) throw error

  // if (status === "waitlist") {
  //   await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/waitlist`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       email,
  //       eventId,
  //       event: event.title,
  //     }),
  //   })
  // }
}

export async function deleteFromEvent(event_id: string, attendees_email: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('event_attendees')
    .delete()
    .eq('event_id', event_id)
    .eq('attendees_email', attendees_email)

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, message: `Event ble slettet!` }
}

export async function leaveEvent(eventId: string, userEmail: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('event_attendees')
    .delete()
    .match({ event_id: eventId, attendees_email: userEmail })

  if (error) {
    console.error('Error leaving event:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
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

export async function getAttendeeDataForUser(email:string){
	const supabase = createClient();
	
  const { data: attendeeData, error: attendeeError } = await supabase
    .from('event_attendees')
		.select('event_id')
		.eq('attendees_email', email);

  if (attendeeError) {
    console.error('Error fetching events:', attendeeError);
    return [];
  }

  return attendeeData;
}

export async function getEventsDataForEventIds(eventIds: string[]) {
  const supabase = createClient()
  
  const { data: eventsData, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .in('id', eventIds)

  if (eventsError) {
    console.error('Error fetching events:', eventsError)
    return []
  }

  return eventsData
}

export async function processWaitlist(eventId: string) {
  console.log("Vi er her")
  const supabase = createClient()

  const { data: nextAttendee } = await supabase
    .from("event_attendees")
    .select("*")
    .eq("event_id", eventId)
    .eq("status", "waitlist")
    .order("waitlist_position", { ascending: true })
    .limit(1)
    .single();

  console.log("nextAttendee", nextAttendee)

  if (nextAttendee) {
    await supabase
      .from("event_attendees")
      .update({ status: "confirmed", waitlist_position: null })
      .eq("id", nextAttendee.id);

    // await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/notifications/confirmed`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     email: nextAttendee.attendees_email,
    //     eventId,
    //   }),
    // })
  }
}
