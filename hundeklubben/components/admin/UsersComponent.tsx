'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { deleteUser, getUsers } from '@/utils/supabase/admin';

interface User {
	id: string;
	email: string;
	created_at: string;
	name: string;
	phone: string;
}

export default function AdminUsersPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchUsers();
	}, []);

	async function fetchUsers() {
		setLoading(true);
		try {
			const fetchedUsers = await getUsers();
			setUsers(fetchedUsers);
		} catch (error) {
			setError(
				error instanceof Error ? error.message : 'Failed to fetch users'
			);
		}
		setLoading(false);
	}

	async function handleDeleteUser(userId: string) {
		try {
			await deleteUser(userId);
			setUsers(users.filter((user) => user.id !== userId));
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: 'An error occurred while deleting the user'
			);
		}
	}

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Admin User Management</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Phone</TableHead>
						<TableHead>Created At</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user) => (
						<TableRow key={user.id}>
							<TableCell>{user.name}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>{user.phone}</TableCell>
							<TableCell>
								{new Date(user.created_at).toLocaleString()}
							</TableCell>
							<TableCell>
								<Button
									variant='destructive'
									onClick={() => handleDeleteUser(user.id)}
								>
									Delete
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
