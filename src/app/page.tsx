import {SidebarProvider, Sidebar, SidebarContent} from '@/components/ui/sidebar';
import {Toaster} from '@/components/ui/toaster';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar />
        <SidebarContent>
          <Dashboard/>
        </SidebarContent>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
