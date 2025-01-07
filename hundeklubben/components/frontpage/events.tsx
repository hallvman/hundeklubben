import { Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
const upcomingEvents = [
  {
    id: 1,
    title: "Puppy Playtime",
    date: "2025-01-15",
    time: "14:00",
    location: "Central Park",
  },
  {
    id: 2,
    title: "Dog Training Workshop",
    date: "2025-01-20",
    time: "10:00",
    location: "Community Center",
  },
  {
    id: 3,
    title: "Canine Costume Contest",
    date: "2025-01-25",
    time: "16:00",
    location: "Town Square",
  },
];

export default function Events() {
  return (
    <section id="events" className="py-16">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold mb-8 text-center">
          Kommende Eventer
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="flex items-center mb-2">
                  <Calendar className="mr-2 h-4 w-4" />
                  {event.date} at {event.time}
                </p>
                <p className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  {event.location}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
