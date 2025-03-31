'use client';

import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { login } from "@/actions/login";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from 'react';
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

export function LoginForm({ redirectPath, className, ...props }: { redirectPath?: string | null; className?: string;[key: string]: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const form = event.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const res = await login(email, password);
      if (res.success) {
        toast.success("Connexion réussie !");
        router.replace(redirectPath || '/groups');
      }
      else {
        console.log("connection échouée", res.error);
        toast.error(res.error);
      }
    }
    catch (error) {
      toast.error("Une erreur est survenue lors de la connexion.");
      console.error("Login error:", error);
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Se connecter</CardTitle>
          <CardDescription>
            Entrez votre email ci-dessous pour vous connecter à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                </div>
                <Input id="password" type="password" required disabled={isLoading} />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Vous n&apos;avez pas de compte ?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Créer un compte
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}