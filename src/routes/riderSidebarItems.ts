import { lazy } from "react";
import type { ISidebarItem } from "@/types";

const RiderProfile = lazy(() => import("@/pages/Rider/Profile"));
const MyBookings = lazy(() => import("@/pages/Rider/MyBookings"));
const RequestRide = lazy(() => import("@/pages/Rider/RequestRide")); 
const RideHistory = lazy(() => import("@/pages/Rider/RideHistory"));

export const riderSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      { title: "Profile", url: "/rider/profile", component: RiderProfile },
      { title: "MyBookings", url: "/rider/bookings/my-bookings", component: MyBookings },
       { title: "Request Ride", url: "/rider/request", component: RequestRide },
      { title: "Ride History", url: "/rider/history", component: RideHistory },
    ],
  },
];