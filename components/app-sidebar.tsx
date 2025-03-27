'use client';

import * as React from "react";
import { House, HardDrive, Users } from "lucide-react";
import { NavUser } from "./nav-user";
import { usePathname, useRouter } from "next/navigation";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

// Définition des routes principales de l'application
const navItems = [
    {
        title: "Accueil",
        url: "/home",
        icon: House,
        description: "Tableau de bord principal"
    },
    {
        title: "Groupes",
        url: "/groups",
        icon: Users,
    },
    {
        title: "Documents partagés",
        url: "/docs",
        icon: HardDrive,
    }
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const router = useRouter();
    const pathname = usePathname();
    const { setOpen } = useSidebar();
    
    // Détermine l'élément actif en fonction de l'URL actuelle
    const getActiveItem = () => {
        return navItems.find(item => pathname.startsWith(item.url)) || navItems[0];
    };

    const activeItem = getActiveItem();

    // Gère la navigation entre les pages
    const handleNavigation = (item: typeof navItems[0]) => {
        router.push(item.url);
        setOpen(true); // Garde la sidebar ouverte après navigation
    };

    return (

            <Sidebar
            collapsible="icon">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                size="lg" 
                                asChild 
                                className="md:h-8 md:p-0" 
                            >
                                <a>
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <span className="text-lg font-bold">P</span>
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">PolyShare</span>
                                        <span className="truncate text-xs">Plateforme collaborative</span>
                                    </div>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent className="px-1.5 md:px-0">
                            <SidebarMenu>
                                {navItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            tooltip={{
                                                children: item.title,
                                                hidden: false,
                                            }}
                                            onClick={() => handleNavigation(item)}
                                            isActive={pathname.startsWith(item.url)}
                                            className="px-2.5 md:px-2"
                                        >
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <NavUser />
                </SidebarFooter>
        </Sidebar>
    );
}
