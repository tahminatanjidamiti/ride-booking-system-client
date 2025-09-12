export interface IUserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  blockedUsers: number;
  newUsers7: number;
  newUsers30: number;
  usersByRole: {
    _id: "ADMIN" | "RIDER" | "DRIVER";
    count: number;
  }[];
}

// Ride Stats
export interface IRideStats {
  totalRides: number;
  ridesByStatus: {
    _id: "PENDING" | "ONGOING" | "COMPLETED" | "CANCELLED";
    count: number;
  }[];
  topRoutes: {
    route: string;
    count: number;
  }[];
  avgDistance: number;
}

export interface IChartPoint {
  earnings: number;
  date?: string;   // for daily
  week?: string;   // for weekly
  month?: string;  // for monthly
}

// Driver Stats
export interface IDriverStats {
  totalRides: number;
  completedRides: number;
  totalEarnings: number;
  totalDrivers: number;
  charts: {
    daily: IChartPoint[];
    weekly: IChartPoint[];
    monthly: IChartPoint[];
  };
  recentRides: {
    _id: string;
    status: "PENDING" | "ONGOING" | "COMPLETED" | "CANCELLED";
    distanceKm: number;
    createdAt: string;
    pickupLocation: {
      lat: number;
      lng: number;
      formattedAddress: string;
    };
    dropoffLocation: {
      lat: number;
      lng: number;
      formattedAddress: string;
    };
  }[];
}

// Booking Stats
export interface IBookingStats {
  totalBookings: number;
  bookingsByStatus: {
    _id: "PENDING" | "ONGOING" | "COMPLETE" | "CANCELLED";
    count: number;
  }[];
  uniqueUsers: number;
  bookings7: number;
  bookings30: number;
}

// Payment Stats
export interface IPaymentStats {
  totalPayments: number;
  paymentsByStatus: {
    _id: "PAID" | "UNPAID" | "CANCELLED" | "FAILED" | "REFUNDED" | null;
    count: number;
  }[];
  totalRevenue: number;
  avgAmount: number;
  gateways: {
    _id: string | null;
    count: number;
  }[];
}