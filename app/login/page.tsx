"use client"

import React, { useEffect } from "react";
import { LoginForm } from "@/components/login-form";
import { useSearchParams, useRouter } from "next/navigation";
import { useUserSession } from "@/lib/useUserSession";


//Fonction de redirection si besoin
export default function Login() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, loading } = useUserSession();

    // On récupère le "from" qui contient l'url à rediriger
    const redirectPath = searchParams?.get('from');

    
    // Si l'utilisateur est déjà connecté, on le redirige
    useEffect(() => {
        if (!loading && user?.isLoggedIn) {
            // On redirige sur l'url de base, avec /groups par défaut
            const redirectTo = redirectPath || '/groups';
            router.replace(redirectTo);
        }
    }, [user, loading, redirectPath, router]);

    //On affiche soit loading soit le form de connexion
    return (
        <div className="flex min-h-screen items-center justify-center">
            {loading ? (
                <p>Loading...</p>
            ) : !user?.isLoggedIn && (
                <LoginForm redirectPath={redirectPath} />
            )}
        </div>
    );
}