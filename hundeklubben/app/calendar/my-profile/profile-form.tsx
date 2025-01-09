'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from '@/utils/supabase/profile';

interface ProfileFormProps {
	user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
	const { toast } = useToast();
	const [name, setName] = useState(user.user_metadata?.name || '');
	const [phone, setPhone] = useState(user.user_metadata?.phone || '');

	async function handleSubmit(event: React.FormEvent) {
		event.preventDefault();
		try {
			await updateProfile(name, phone);
			toast({
				title: 'Profil oppdatert',
				description: `Din profile har blitt oppdatert. Navn: ${name} og Telefon: ${phone}`,
			});
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error instanceof Error
						? error.message
						: 'Klarte ikke å oppdatere din profile',
				variant: 'destructive',
			});
		}
	}

	return (
		<form onSubmit={handleSubmit} className='space-y-4'>
			<div>
				<Label htmlFor='name'>Navn</Label>
				<Input
					id='name'
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder='Skriv ditt navn her...'
				/>
			</div>
			<div>
				<Label htmlFor='phone'>Telefon</Label>
				<Input
					id='phone'
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
					placeholder='Skriv ditt telefonnummer her...'
				/>
			</div>
			<Button type='submit'>Oppdater profile</Button>
		</form>
	);
}
