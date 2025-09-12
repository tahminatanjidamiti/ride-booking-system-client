import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { getSidebarItems } from "@/utils/getSidebarItems";
import Logo from "@/assets/icons/Logo";
import type { TRole } from "@/types";
import Skeleton from "./Skeleton";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userData, isLoading } = useUserInfoQuery(undefined);

   // Show skeleton loader while fetching
  if (isLoading) {
    return (
      <Sidebar {...props}>
        <SidebarHeader className="items-center">
          <Skeleton className="h-8 w-24" />
        </SidebarHeader>
        <SidebarContent>
          <Skeleton className="h-6 w-full my-2" />
          <Skeleton className="h-6 w-full my-2" />
          <Skeleton className="h-6 w-full my-2" />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    );
  }

  const data = {
    navMain: getSidebarItems(
    userData?.data?.role as TRole),
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="items-center">
        <Link to="/">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild>
                      <Link to={subItem.url}>{subItem.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}