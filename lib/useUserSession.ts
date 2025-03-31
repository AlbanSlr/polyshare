"use client";

import { useEffect, useState } from "react";
import { SessionUser } from "./userSession";

// fonction pour récupérer l'utilisateur connecté coté client
export function useUserSession() {
    const [user, setUser] = useState<SessionUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            const response = await fetch('/api/sessionUser');
            if (response.ok) {
                const data = await response.json();
                setUser(data as SessionUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        }
        fetchUser();
    }, []);
    return { user, loading };
}