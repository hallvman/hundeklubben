import { useEffect, useState } from 'react';
import type { Event } from '@/types/event';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CreateEventFormProps {
	isAdmin: boolean;
	onCreateEvent: (
		event: Omit<Event, 'id' | 'creator' | 'user_id' | 'attendees'>
	) => void;
	onCancel: () => void;
}

export function getNextWednesdayNoon(date: Date) {
	const nextWednesday = new Date(date);
	nextWednesday.setDate(date.getDate() + ((3 - date.getDay() + 7) % 7));
	nextWednesday.setHours(12, 0, 0, 0);
	return nextWednesday;
}

export function getNextSunday(date: Date) {
	const nextSunday = new Date(date);
	nextSunday.setDate(date.getDate() + ((7 - date.getDay()) % 7));
	nextSunday.setHours(23, 59, 59, 0);
	return nextSunday;
}

export function getSundayAfterNext(date: Date) {
	const nextSunday = getNextSunday(date);
	nextSunday.setDate(nextSunday.getDate() + 7);
	return nextSunday;
}

export function CreateEventForm({
	isAdmin,
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
	const [minAllowedDate, setMinAllowedDate] = useState<string>('');
	const [maxAllowedDate, setMaxAllowedDate] = useState<string>('');
	const [isOutsideNormalRange, setIsOutsideNormalRange] = useState(false);

	useEffect(() => {
		const updateAllowedDates = () => {
			const now = new Date();
			const nextWednesdayNoon = getNextWednesdayNoon(now);
			const nextSunday = getNextSunday(now);
			const sundayAfterNext = getSundayAfterNext(now);

			let minDate: Date;
			let maxDate: Date;

			if (now < nextWednesdayNoon) {
				// Before Wednesday noon
				minDate = now;
				maxDate = nextSunday;
			} else {
				// After Wednesday noon
				minDate = now;
				maxDate = sundayAfterNext;
			}

			setMinAllowedDate(minDate.toISOString().slice(0, 16));
			setMaxAllowedDate(maxDate.toISOString().slice(0, 16));
		};

		updateAllowedDates();
		// Update every minute to ensure accurate restrictions
		const intervalId = setInterval(updateAllowedDates, 60000);

		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		if (isAdmin && (start || end)) {
			const startDate = new Date(start);
			const endDate = new Date(end);
			const minDate = new Date(minAllowedDate);
			const maxDate = new Date(maxAllowedDate);

			setIsOutsideNormalRange(
				startDate < minDate ||
					startDate > maxDate ||
					endDate < minDate ||
					endDate > maxDate
			);
		} else {
			setIsOutsideNormalRange(false);
		}
	}, [isAdmin, start, end, minAllowedDate, maxAllowedDate]);

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
					min={isAdmin ? undefined : minAllowedDate}
					max={isAdmin ? undefined : maxAllowedDate}
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
					min={isAdmin ? undefined : minAllowedDate}
					max={isAdmin ? undefined : maxAllowedDate}
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
			{isAdmin && isOutsideNormalRange && (
				<Alert>
					<AlertDescription>
						Du oppretter et arrangement utenfor det normale tidsrommet. Vær
						sikker på at dette er tilsiktet.
					</AlertDescription>
				</Alert>
			)}
			<div className='flex justify-end space-x-2'>
				<Button type='button' variant='outline' onClick={onCancel}>
					Avslutt
				</Button>
				<Button type='submit'>Lag Event</Button>
			</div>
		</form>
	);
}
