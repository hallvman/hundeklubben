export interface Event {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  attendees_limit: number;
  attendees: string[];
  isPulic: boolean;
}

