import { RegisterForm } from "@/components/register-form"
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Register() {
  const session = await getSession();
  
    if (session.user?.isLoggedIn) {
      redirect("/home");
    }
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <RegisterForm />
          </div>
        </div>
      )
}