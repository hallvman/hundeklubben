'use client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
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
					<TabsTrigger value='eventer'>Dine Eventer</TabsTrigger>
				</TabsList>
				<div className='ml-auto flex items-center gap-2'></div>
			</div>
			<TabsContent value='calendar'>
				<DogClubCalendar />
			</TabsContent>
			<TabsContent value='eventer'></TabsContent>
		</Tabs>
	);
}
