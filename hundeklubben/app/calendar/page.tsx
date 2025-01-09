'use client';
import EventsComponent from '@/components/events/EventsComponent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import dynamic from 'next/dynamic';

const DogClubCalendar = dynamic(
	() => import('@/components/calendar/Calendar'),
	{ ssr: false }
);

export default function ProductsPage() {
	return (
		<Tabs defaultValue='calendar'>
			<div className='flex items-center'>
				<TabsList>
					<TabsTrigger value='calendar'>Kalender</TabsTrigger>
					<TabsTrigger value='eventer'>Mine Eventer</TabsTrigger>
					<TabsTrigger value='attendence'>Påmeldt</TabsTrigger>
				</TabsList>
				<div className='ml-auto flex items-center gap-2'></div>
			</div>
			<TabsContent value='calendar'>
				<DogClubCalendar />
			</TabsContent>
			<TabsContent value='eventer'>
				<EventsComponent />
			</TabsContent>
			<TabsContent value='attendence'>
				<EventsComponent />
			</TabsContent>
		</Tabs>
	);
}
