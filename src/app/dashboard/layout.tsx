import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { MainNav } from '@/components/main-nav';
import { Search } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 p-2 rounded-md transition-colors">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://placehold.co/100x100" alt="User Avatar" data-ai-hint="profile photo"/>
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
              <span className="font-medium text-sm truncate">Eco Warrior</span>
              <span className="text-xs text-muted-foreground truncate">
                user@upyclex.com
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b bg-card md:justify-end">
            <SidebarTrigger className="md:hidden"/>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <Search className="h-5 w-5"/>
                    <span className="sr-only">Search</span>
                </Button>
                <Avatar>
                    <AvatarImage src="https://placehold.co/100x100" alt="User Avatar" data-ai-hint="profile photo"/>
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background/95">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
