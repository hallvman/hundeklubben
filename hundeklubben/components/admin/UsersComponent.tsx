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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
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
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState<User | null>(null);

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

	function openDeleteDialog(user: User) {
		setUserToDelete(user);
		setDeleteDialogOpen(true);
	}

	async function confirmDeleteUser() {
		if (!userToDelete) return;

		try {
			await deleteUser(userToDelete.id);
			setUsers(users.filter((user) => user.id !== userToDelete.id));
			setDeleteDialogOpen(false);
			setUserToDelete(null);
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

	const name =
		userToDelete?.name !== 'N/A' ? userToDelete?.name : userToDelete?.email;

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Administrer brukere</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Navn</TableHead>
						<TableHead>E-post</TableHead>
						<TableHead>Telefon</TableHead>
						<TableHead>Handling</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user) => (
						<TableRow key={user.id}>
							<TableCell>{user.name}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>{user.phone}</TableCell>
							<TableCell>
								<Button
									variant='destructive'
									onClick={() => openDeleteDialog(user)}
								>
									Slett
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Bekreft sletting av bruker</DialogTitle>
						<DialogDescription>
							Er du sikker på at du vil slette brukeren {name}? Denne handlingen
							kan ikke angres.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setDeleteDialogOpen(false)}
						>
							Avbryt
						</Button>
						<Button variant='destructive' onClick={confirmDeleteUser}>
							Slett bruker
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
