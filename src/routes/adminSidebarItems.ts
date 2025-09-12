import { lazy } from "react";
import type { ISidebarItem } from "@/types";


const Profile = lazy(() => import("@/pages/Admin/Profile"));
const Analytics = lazy(() => import("@/pages/Admin/Analytics"));
const Users = lazy(() => import("@/pages/Admin/Users"));
const Rides = lazy(() => import("@/pages/Admin/Rides"));
const UpdateDriverStatus = lazy(() => import("@/pages/Admin/UpdateDriverStatus"));

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      { title: "Profile", url: "/admin/profile", component: Profile },
      { title: "Analytics", url: "/admin/analytics", component: Analytics }
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Users", url: "/admin/users", component: Users },
      { title: "Rides", url: "/admin/rides", component: Rides },
      { title: "UpdateDriverStatus", url: "/admin/update/driver/status", component: UpdateDriverStatus },
    ],
  },
]