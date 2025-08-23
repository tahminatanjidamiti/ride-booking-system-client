import Bookings from "@/pages/User/Bookings";
import type { ISidebarItem } from "@/types";

export const riderSidebarItems: ISidebarItem[] = [
  {
    title: "History",
    items: [
      {
        title: "Bookings",
        url: "/rider/bookings",
        component: Bookings,
      },
    ],
  },
];