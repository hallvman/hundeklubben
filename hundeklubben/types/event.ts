export interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  creator: string;
  description: string;
  attendees_limit: number;
  attendees: string[];
  isPublic: boolean;
  location: string;
}