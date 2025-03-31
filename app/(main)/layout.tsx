import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";


//Voici le layout du site.
export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "350px",
                } as React.CSSProperties
            }
            open={false}
        >
            <AppSidebar />
            <header className="flex h-16 shrink-0 items-center gap-2 border-b w-full px-2 bg-background sm:hidden">
                <SidebarTrigger />
            </header>
            {children}
        </SidebarProvider>
    )
}