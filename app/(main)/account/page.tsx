"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserSession } from "@/lib/useUserSession";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile, updatePassword } from "@/actions/profile";
import { Loader2 } from "lucide-react";

// Définir le type de retour des actions
type ProfileResult = {
    success: boolean;
    error?: string;
};

export default function AccountPage() {
    const router = useRouter();
    const { user, loading } = useUserSession();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!loading && !user?.isLoggedIn) {
            router.push('/login');
        }

        if (user) {
            setUsername(user.username || "");
            setEmail(user.email || "");
        }
    }, [user, loading, router]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);

        try {
            // Mise à jour du profil (nom d'utilisateur et email)
            const profileResult = await updateProfile(username, email) as ProfileResult;

            // Si le mot de passe est spécifié, on le met à jour aussi
            let passwordResult = { success: true } as ProfileResult;
            if (password.trim()) {
                passwordResult = await updatePassword(password) as ProfileResult;
            }

            if (profileResult.success && passwordResult.success) {
                toast.success("Profil mis à jour avec succès");
                setPassword(""); // Réinitialiser le champ mot de passe
            } else {
                const errorMsg = profileResult.error || passwordResult.error || "La mise à jour a échoué";
                toast.error(errorMsg);
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil:", error);
            toast.error("Une erreur est survenue");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">Mon compte</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Informations du profil</CardTitle>
                    <CardDescription>
                        Modifiez votre nom d'utilisateur, votre adresse e-mail et votre mot de passe
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="profile-form" onSubmit={handleUpdateProfile}>
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="username">Nom d'utilisateur</Label>
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    disabled={isUpdating}
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isUpdating}
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="password">Nouveau mot de passe</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Laisser vide pour ne pas changer"
                                    disabled={isUpdating}
                                    minLength={6}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Minimum 6 caractères. Laisser vide pour conserver le mot de passe actuel.
                                </p>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        form="profile-form"
                        disabled={isUpdating}
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Mise à jour...
                            </>
                        ) : (
                            "Enregistrer les modifications"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}