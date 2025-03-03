
import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createClient()
  try {
    const { email, eventId } = await request.json()

    const { data: event } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single()

    if (!event) {
      throw new Error("Event not found")
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "events@yourdomain.com",
        to: email,
        subject: `You're confirmed for ${event.title}!`,
        html: `A spot has opened up and you've been moved from the waitlist to the confirmed attendees list.`,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to send email")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Notification error:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}

