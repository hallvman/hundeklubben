import AddMemberForm from "@/components/members/AddMembersForm";
import MemberList from "@/components/members/MemberList";
import { getMembers } from "@/utils/supabase/members";

export default async function AdminMembersPage() {
  const members = await getMembers();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Medlemmer</h1>
      <div className="space-y-8">
        <div className="max-w-md">
          <h2 className="text-xl font-semibold mb-2">Legg til nytt medlem</h2>
          <AddMemberForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Medlemsliste</h2>
          <MemberList members={members} />
        </div>
      </div>
    </div>
  );
}
