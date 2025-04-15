/ SidebarContent.tsx
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {Home, Settings, PlusCircle, MessageSquare, Shield} from "lucide-react";

const SidebarContentComponent = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <h4 className="font-semibold text-lg">K8s AutoPilot</h4>
        <p className="text-sm text-muted-foreground">Manage your Kubernetes cluster</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#">
                  <Home className="mr-2 h-4 w-4"/>
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator/>
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#">
                  <PlusCircle className="mr-2 h-4 w-4"/>
                  <span>Deploy Service</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#">
                  <MessageSquare className="mr-2 h-4 w-4"/>
                  <span>Alert Configuration</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#">
                  <Shield className="mr-2 h-4 w-4"/>
                  <span>Automated Healing</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator/>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#">
                  <Settings className="mr-2 h-4 w-4"/>
                  <span>General Settings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} K8s AutoPilot. All rights reserved.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarContentComponent;
