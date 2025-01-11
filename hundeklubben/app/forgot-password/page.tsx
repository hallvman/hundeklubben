import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { encodedRedirect } from '@/utils/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ForgotPassword() {
	const forgotPassword = async (formData: FormData) => {
		'use server';

		const email = formData.get('email')?.toString();
		const supabase = createClient();
		const origin = (await headers()).get('origin');
		const callbackUrl = formData.get('callbackUrl')?.toString();

		if (!email) {
			return encodedRedirect('error', '/forgot-password', 'Email is required');
		}

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
		});

		if (error) {
			console.error(error.message);
			return encodedRedirect(
				'error',
				'/forgot-password',
				'Could not reset password'
			);
		}

		if (callbackUrl) {
			return redirect(callbackUrl);
		}

		return encodedRedirect(
			'success',
			'/forgot-password',
			'Check your email for a link to reset your password.'
		);
	};

	return (
		<div className='h-full flex items-center justify-center py-16 md:py-24 lg:py-60 bg-gradient-to-r'>
			<form className='w-full max-w-md mx-auto border rounded-lg p-6 [&>input]:mb-6 max-w-md p-4'>
				<h1 className='text-2xl font-medium'>Endre Password</h1>
				<p className='text-sm'>
					Har allered en bruker?{' '}
					<Link className='text-blue-600 font-medium underline' href='/signin'>
						Logg inn
					</Link>
				</p>
				<div className='flex flex-col gap-2 [&>input]:mb-3 mt-8'>
					<Label htmlFor='email'>E-post</Label>
					<Input
						name='email'
						className='text-black'
						placeholder='you@example.com'
						required
					/>
					<Button className='' formAction={forgotPassword}>
						Endre passord
					</Button>
				</div>
			</form>
		</div>
	);
}
