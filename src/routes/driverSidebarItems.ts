import { lazy } from "react";
import type { ISidebarItem,  } from "@/types";

const Profile = lazy(() => import("@/pages/Driver/Profile"));
const MyBookings = lazy(() => import("@/pages/Driver/MyBookings"));
const RideHistory = lazy(() => import("@/pages/Driver/RideHistory"));
const UpdateStatus = lazy(() => import("@/pages/Driver/UpdateStatus"));
const Earnings = lazy(() => import("@/pages/Driver/Earnings"));


export const driverSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      { title: "Profile", url: "/driver/profile", component: Profile },
    { title: "MyBookings", url: "/driver/bookings/my-bookings", component: MyBookings },
    { title: "Ride History", url: "/driver/history", component: RideHistory },
    { title: "Update Status", url: "/driver/update/status", component: UpdateStatus },
    { title: "Earnings", url: "/driver/earnings", component: Earnings },
    ],
  },
]
 