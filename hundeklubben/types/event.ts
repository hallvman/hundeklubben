export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  creator: string;
  user_id: string;
  description: string;
  attendees_limit: number;
  attendees: string[];
  isPublic: boolean;
  location: string;
}