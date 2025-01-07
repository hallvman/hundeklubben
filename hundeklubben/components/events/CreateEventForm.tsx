import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CreateEventFormProps = {
  onCreateEvent: (event: any) => void;
  onCancel: () => void;
};

export function CreateEventForm({
  onCreateEvent,
  onCancel,
}: CreateEventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    onCreateEvent({ title, description, start, end, attendees: [] });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Create Event</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
