import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/utils/supabase/server';
import { encodedRedirect } from '@/utils/utils';

export default async function ResetPassword() {
	const resetPassword = async (formData: FormData) => {
		'use server';
		const supabase = createClient();

		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!password || !confirmPassword) {
			encodedRedirect(
				'error',
				'/reset-password',
				'Password and confirm password are required'
			);
		}

		if (password !== confirmPassword) {
			encodedRedirect('error', '/reset-password', 'Passwords do not match');
		}

		const { error } = await supabase.auth.updateUser({
			password: password,
		});

		if (error) {
			encodedRedirect('error', '/reset-password', 'Password update failed');
		}

		encodedRedirect('success', '/reset-password', 'Password updated');
	};

	return (
		<div className='h-full flex items-center justify-center py-16 md:py-24 lg:py-60 bg-gradient-to-r'>
			<form className='w-full max-w-md mx-auto border rounded-lg p-6 [&>input]:mb-6 max-w-md p-4'>
				<h1 className='text-2xl font-medium'>Endre passord</h1>
				<p className='text-sm'>Vennligst oppgi ditt nye passord nedenfor.</p>

				<Label htmlFor='password'>Nytt passord</Label>
				<Input
					className='text-black'
					type='password'
					name='password'
					placeholder='New password'
					required
				/>
				<Label htmlFor='confirmPassword'>Bekreft passord</Label>
				<Input
					className='text-black'
					type='password'
					name='confirmPassword'
					placeholder='Confirm password'
					required
				/>
				<Button formAction={resetPassword}>Endre passord</Button>
			</form>
		</div>
	);
}
