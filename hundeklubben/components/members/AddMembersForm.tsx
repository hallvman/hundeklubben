"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addMember } from "@/utils/supabase/members";
import { useToast } from "@/hooks/use-toast";

export default function AddMemberForm() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    const result = await addMember(formData);
    if (result.success) {
      setEmail("");
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
    <form action={handleSubmit} className="space-y-4">
      <Input
        type="email"
        name="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit">Legg til medlem</Button>
    </form>
  );
}
