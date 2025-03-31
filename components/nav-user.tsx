'use client';

import { ChevronsUpDown, CircleUserRound, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserSession } from "@/lib/useUserSession";
import { logout } from "@/actions/logout";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export function NavUser() {
    const { user, loading } = useUserSession();
    const isMobile = useIsMobile();
    const router = useRouter();

    if (loading) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton className="w-full text-left" disabled>
                        <CircleUserRound className="mr-2 h-4 w-4" />
                        Chargement...
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        );
    }

    if (!user) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link href="/login">
                        <SidebarMenuButton size="lg" className="w-full">
                            Se connecter
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
        );
    }

    const handleLogout = async () => {
        try {
            const result = await logout();
            if (result.success) {
                // Rediriger vers la page d'accueil après la déconnexion
                router.push('/');
                router.refresh();
                toast.success("Vous avez été déconnecté avec succès");
            }
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("La déconnexion a échoué");
        }
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarFallback className="rounded-lg">
                                    {user.username?.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{user.username}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarFallback className="rounded-lg">
                                        {user.username?.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{user.username}</span>
                                    <span className="truncate text-xs">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/account">
                                <CircleUserRound className="mr-2 h-4 w-4" />
                                Compte
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Se déconnecter
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
