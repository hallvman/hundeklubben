import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { encodedRedirect } from '@/utils/utils';
import { Button } from '@/components/ui/button';

export default function SignIn() {
	const signIn = async (formData: FormData) => {
		'use server';

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const supabase = createClient();

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			return encodedRedirect('error', '/signin', 'Could not authenticate user');
		}

		return redirect('/');
	};

	return (
		<section className='w-full flex items-center justify-center py-12 md:py-24 lg:py-40 bg-gradient-to-r border'>
			<div className='mx-auto max-w-sm space-y-6 border rounded-lg p-6'>
				<div className='space-y-2 text-center'>
					<h1 className='text-3xl font-bold'>Logg inn.</h1>
					<p className='text-muted-foreground'>
						Skriv inn e-post og passord for å logge inn.
					</p>
				</div>
				<div className='space-y-4'>
					<form>
						<div className='flex flex-col gap-2 [&>input]:mb-3 mt-8'>
							<Label htmlFor='email'>E-post</Label>
							<Input name='email' placeholder='eksempel@eksempel.no' required />
							<div className='flex justify-between items-center'>
								<Label htmlFor='password'>Passord</Label>

								<Link
									className='text-blue-600 underline'
									href='/forgot-password'
								>
									Glemt passord?
								</Link>
							</div>
							<Input
								type='password'
								name='password'
								placeholder='••••••••'
								required
							/>
							<Button formAction={signIn}>Logg inn</Button>
						</div>
					</form>
					<div className='flex items-center'>
						<div className='flex-1 border-t' />
						<span className='mx-4 text-muted-foreground'>or</span>
						<div className='flex-1 border-t' />
					</div>
					<Link
						href='/forgot-password'
						className='inline-block w-full text-center underline'
						prefetch={false}
					>
						Glemt passord?
					</Link>
				</div>
			</div>
		</section>
	);
}
