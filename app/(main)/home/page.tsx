import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import AuthGuard from "@/components/auth-guard";


export default async function HomePage() {
  return (
    <>
        <div className="flex flex-1 flex-col gap-4 p-4">
            {Array.from({ length: 24 }).map((_, index) => (
                <div
                    key={index}
                    className="aspect-video h-12 w-full rounded-lg bg-muted/50"
                />
            ))}
        </div>
    </>
  );
}