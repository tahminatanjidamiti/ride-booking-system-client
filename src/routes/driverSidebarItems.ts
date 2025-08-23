import Bookings from "@/pages/User/Bookings";
import type { ISidebarItem } from "@/types";

export const driverSidebarItems: ISidebarItem[] = [
  {
    title: "History",
    items: [
      {
        title: "Bookings",
        url: "/driver/bookings",
        component: Bookings,
      },
    ],
  },
];