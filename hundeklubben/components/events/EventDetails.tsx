import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type EventDetailsProps = {
  event: {
    id: string;
    title: string;
    description: string;
    start: Date;
    end: Date;
    attendees: string[];
  };
  onJoin: (eventId: string, attendee: string) => void;
  onClose: () => void;
};

export function EventDetails({ event, onJoin, onClose }: EventDetailsProps) {
  const [email, setEmail] = useState("");

  const handleJoin = () => {
    if (email) {
      onJoin(event.id, email);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{event.title}</h2>
        <p className="mb-2">{event.description}</p>
        <p className="mb-2">Start: {event.start.toLocaleString()}</p>
        <p className="mb-2">End: {event.end.toLocaleString()}</p>
        <h3 className="font-bold mt-4 mb-2">Attendees:</h3>
        <ul className="list-disc pl-5 mb-4">
          {event.attendees.map((attendee, index) => (
            <li key={index}>{attendee}</li>
          ))}
        </ul>
        <div className="flex space-x-2 mb-4">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleJoin}>Join Event</Button>
        </div>
        <Button onClick={onClose} variant="outline" className="w-full">
          Close
        </Button>
      </div>
    </div>
  );
}
