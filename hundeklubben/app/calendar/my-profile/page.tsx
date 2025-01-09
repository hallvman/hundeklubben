import { getUser } from '@/utils/supabase/auth';
import { ProfileForm } from './profile-form';
import { PasswordResetForm } from './password-reset-form';

export default async function MyProfilePage() {
	const user = await getUser();

	if (!user) {
		return <div>Please log in to view your profile.</div>;
	}

	const email = user?.email as string;

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Min Profile</h1>
			<div className='grid gap-6'>
				<ProfileForm user={user} />
				<PasswordResetForm email={email} />
			</div>
		</div>
	);
}
