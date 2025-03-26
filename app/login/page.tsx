import { LoginForm } from "@/components/login-form";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Login({ searchParams }: { searchParams: { redirect?: string } }) {
  const session = await getSession();

  if (session.user?.isLoggedIn) {
    redirect(searchParams.redirect || "/home"); // Rediriger vers la page demandée ou la page d'accueil
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}