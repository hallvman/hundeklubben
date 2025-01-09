import { useState } from 'react';
import { Event } from '@/types/event';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface CreateEventFormProps {
	onCreateEvent: (
		event: Omit<Event, 'id' | 'creator' | 'user_id' | 'attendees'>
	) => void;
	onCancel: () => void;
}

export function CreateEventForm({
	onCreateEvent,
	onCancel,
}: CreateEventFormProps) {
	const [title, setTitle] = useState('');
	const [start, setStart] = useState('');
	const [end, setEnd] = useState('');
	const [attendees_limit, setAttendeesLimit] = useState<number>(0);
	const [description, setDescription] = useState('');
	const [location, setLocation] = useState('');
	const [isPublic, setIsPublic] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		onCreateEvent({
			title,
			start: new Date(start),
			end: new Date(end),
			description,
			attendees_limit,
			isPublic,
			location,
		});
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-4'>
			<div>
				<Label htmlFor='title'>Tittel</Label>
				<Input
					id='title'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>
			</div>
			<div>
				<Label htmlFor='start'>Starttidspunkt</Label>
				<Input
					id='start'
					type='datetime-local'
					value={start}
					onChange={(e) => setStart(e.target.value)}
					required
				/>
			</div>
			<div>
				<Label htmlFor='end'>Slutttidspunkt</Label>
				<Input
					id='end'
					type='datetime-local'
					value={end}
					onChange={(e) => setEnd(e.target.value)}
					required
				/>
			</div>
			<div>
				<Label htmlFor='description'>Beskrivelse</Label>
				<Textarea
					id='description'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</div>
			<div>
				<Label htmlFor='location'>Lokasjon</Label>
				<Textarea
					id='location'
					value={location}
					onChange={(e) => setLocation(e.target.value)}
				/>
			</div>
			<div>
				<Label htmlFor='attendees_limit'>Maksantall</Label>
				<Input
					id='attendees_limit'
					type='number'
					value={attendees_limit}
					onChange={(e) => setAttendeesLimit(Number(e.target.value))}
					required
					min={0}
				/>
			</div>
			<div className='flex items-center space-x-2'>
				<Switch
					id='isPublic'
					checked={isPublic}
					onCheckedChange={setIsPublic}
				/>
				<Label htmlFor='isPublic'>Offentlig event</Label>
			</div>
			<div className='flex justify-end space-x-2'>
				<Button type='button' variant='outline' onClick={onCancel}>
					Avslutt
				</Button>
				<Button type='submit'>Lag Event</Button>
			</div>
		</form>
	);
}
