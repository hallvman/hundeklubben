"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signUp } from "@/utils/supabase/auth";

interface SignupStatus {
  success: boolean;
  message?: string;
  email?: string;
}

export default function Signup() {
  const [signupStatus, setSignupStatus] = useState<SignupStatus | null>(null);

  const handleSignUp = async (formData: FormData) => {
    const result = await signUp(formData);
    setSignupStatus(result);
  };

  return (
    <section className="w-full flex items-center justify-center py-12 md:py-24 lg:py-40 bg-gradient-to-r">
      <div className="mx-auto max-w-sm space-y-6 bg-primary border rounded-lg p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-secondary">Registrering</h1>
          <p className="text-muted-foreground">
            Skriv inn din epost og passord for å registrere en bruker. Du må
            være lagt inn som medlem for at du skal kunne registrere bruker.
          </p>
        </div>
        <div className="space-y-4">
          <form>
            <div className="mt-8 flex flex-col gap-2 [&>input]:mb-3">
              <Label className="text-secondary" htmlFor="email">
                Email
              </Label>
              <Input name="email" placeholder="you@example.com" required />
              <Label className="text-secondary" htmlFor="password">
                Passord
              </Label>
              <Input
                type="passord"
                name="passord"
                placeholder="••••••••"
                required
              />
              <Button formAction={handleSignUp}>Registrer deg</Button>
            </div>
          </form>
          {signupStatus && (
            <div>
              {signupStatus.success ? (
                <p>Du er nå registrert med e-post: {signupStatus.email}</p>
              ) : (
                <p>Error: {signupStatus.message}</p>
              )}
            </div>
          )}
          <Link
            href="/forgot-password"
            className="inline-block w-full text-center text-secondary underline"
            prefetch={false}
          >
            Glemt passord?
          </Link>
        </div>
      </div>
    </section>
  );
}
