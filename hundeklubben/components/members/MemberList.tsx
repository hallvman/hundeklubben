"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteMember } from "@/utils/supabase/members";

interface Member {
  email: string;
}

interface MemberListProps {
  members: Member[];
}

export default function MemberList({ members }: MemberListProps) {
  const [memberList, setMemberList] = useState(members);
  const { toast } = useToast();

  const handleDelete = async (email: string) => {
    const formData = new FormData();
    formData.append("email", email);
    const result = await deleteMember(formData);
    if (result.success) {
      setMemberList(memberList.filter((member) => member.email !== email));
      toast({
        title: "Success",
        description: result.message,
      });
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {memberList.map((member) => (
        <div
          key={member.email}
          className="flex flex-col justify-between bg-gray-100 p-2 rounded"
        >
          <span className="mb-2 break-all">{member.email}</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(member.email)}
          >
            Slett
          </Button>
        </div>
      ))}
    </div>
  );
}
