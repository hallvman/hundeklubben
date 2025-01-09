'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { requestPasswordReset } from '@/utils/supabase/profile';

interface PasswordResetFormProps {
	email: string;
}

export function PasswordResetForm({ email }: PasswordResetFormProps) {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);

	async function handlePasswordReset() {
		setIsLoading(true);
		try {
			await requestPasswordReset(email);
			toast({
				title: 'En e-post med muligheter for å endre passord er blitt sendt.',
				description: `Vær så snill og sjekk din e-post ${email} for en reset-passord lenke.`,
			});
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error instanceof Error
						? error.message
						: 'Failed to request password reset',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div>
			<h2 className='text-xl font-semibold mb-2'>Resett Passord</h2>
			<p className='mb-4'>
				Klipp knappen nedenfor for å få en e-post med mulighet for å endre
				passord.
			</p>
			<Button onClick={handlePasswordReset} disabled={isLoading}>
				{isLoading ? 'Sender...' : 'Resett Passord'}
			</Button>
		</div>
	);
}
