/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetUserStatsQuery,
  useGetRideStatsQuery,
  useGetBookingStatsQuery,
  useGetDriverStatsQuery,
  useGetPaymentStatsQuery,
} from "@/redux/features/stats/stats.api";

const PRIMARY_COLOR = "#660B05";
const SECONDARY_COLOR = "#FFC0A0";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BlockChart: React.FC<{
  data: { name: string; value: number }[];
  total?: number;
  blockSize?: number;
}> = ({ data, total, blockSize = 20 }) => {
  const totalValue = total ?? data.reduce((sum, d) => sum + d.value, 0);
  return (
    <div className="flex space-x-4 justify-center">
      {data.map((d, i) => {
        const blocks = Math.round((d.value / totalValue) * 20);
        return (
          <div key={i} className="flex flex-col items-center">
            <div className="grid grid-cols-5 gap-1">
              {[...Array(blocks)].map((_, j) => (
                <div
                  key={j}
                  style={{ width: blockSize, height: blockSize }}
                  className="bg-[#660B05] hover:opacity-80 cursor-pointer"
                  title={`${d.name}: ${d.value}`}
                />
              ))}
            </div>
            <span className="text-xs mt-1">{d.name}</span>
          </div>
        );
      })}
    </div>
  );
};

const CustomShapeBarChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={250}>
    <ComposedChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="_id" />
      <YAxis />
      <Tooltip
        formatter={(value: any, name: string) => [`${value}`, name]}
        cursor={{ fill: "rgba(102,11,5,0.1)" }}
      />
      <Bar dataKey="count" fill={PRIMARY_COLOR} radius={[4, 4, 0, 0]} />
    </ComposedChart>
  </ResponsiveContainer>
);

const RidesBarChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={250}>
    <ComposedChart data={data.map((r) => ({ ...r, value: r.count }))}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="_id" />
      <YAxis />
      <Tooltip formatter={(value: any, name: string) => [`${value}`, name]} />
      <Legend />
      <Bar dataKey="count" fill={PRIMARY_COLOR} radius={[4, 4, 0, 0]} />
    </ComposedChart>
  </ResponsiveContainer>
);

const BookingAreaChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={250}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PRIMARY_COLOR} stopOpacity={0.4} />
          <stop offset="100%" stopColor={PRIMARY_COLOR} stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="_id" />
      <YAxis />
      <Tooltip formatter={(value: any, name: string) => [`${value}`, name]} />
      <Area
        type="monotone"
        dataKey="count"
        stroke={PRIMARY_COLOR}
        fill="url(#gradArea)"
        strokeWidth={2}
        dot={{ r: 4, fill: PRIMARY_COLOR }}
      />
    </AreaChart>
  </ResponsiveContainer>
);

const PaymentsPieChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={data.filter((p) => p._id !== null)}
        dataKey="count"
        nameKey="_id"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label
      >
        {data
          .filter((p) => p._id !== null)
          .map((_, index) => (
            <Cell key={index} fill={PRIMARY_COLOR} />
          ))}
      </Pie>
      <Tooltip formatter={(value: any, name: string) => [`${value}`, name]} />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

export default function Analytics() {
  const { data: userStats } = useGetUserStatsQuery();
  const { data: rideStats } = useGetRideStatsQuery();
  const { data: bookingStats } = useGetBookingStatsQuery();
  const { data: driverStats } = useGetDriverStatsQuery();
  const { data: paymentStats } = useGetPaymentStatsQuery();

  const [driverTab, setDriverTab] = useState<"daily" | "weekly" | "monthly">("daily");

  return (
    <div className="grid gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">

      {/* Total Users */}
      {userStats?.data && (
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around mb-2 text-sm font-medium">
              <div>Active: {userStats.data.activeUsers}</div>
              <div>Inactive: {userStats.data.inactiveUsers}</div>
              <div>New 7 Days: {userStats.data.newUsers7}</div>
            </div>
            <CustomShapeBarChart
              data={userStats.data.usersByRole.map((u) => ({ _id: u._id, count: u.count }))}
            />
          </CardContent>
        </Card>
      )}

      {/* Rides Overview */}
      {rideStats?.data && (
        <Card>
          <CardHeader>
            <CardTitle>Rides Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around mb-2 text-sm font-medium">
              <div>Total: {rideStats.data.totalRides}</div>
              <div>Avg Distance: {rideStats.data.avgDistance.toFixed(2)} km</div>
            </div>
            <RidesBarChart data={rideStats.data.ridesByStatus} />
            {rideStats.data.topRoutes?.length > 0 && (
              <div className="mt-2 text-xs">
                <strong>Top Routes:</strong>
                <ul>
                  {rideStats.data.topRoutes.map((route) => (
                    <li key={route.route}>
                      {route.route}: {route.count}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Booking Overview */}
      {bookingStats?.data && (
        <Card>
          <CardHeader>
            <CardTitle>Booking Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around mb-2 text-sm font-medium">
              <div>Total: {bookingStats.data.totalBookings}</div>
              <div>Unique Users: {bookingStats.data.uniqueUsers}</div>
              <div>Last 7 Days: {bookingStats.data.bookings7}</div>
              <div>Last 30 Days: {bookingStats.data.bookings30}</div>
            </div>
            <BookingAreaChart data={bookingStats.data.bookingsByStatus} />
          </CardContent>
        </Card>
      )}

      {/* Driver Earnings */}
      {driverStats?.data && (
        <Card className="md:col-span-2">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Driver Earnings</CardTitle>
            <div className="space-x-2">
              {["daily", "weekly", "monthly"].map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-1 rounded font-medium text-sm ${driverTab === tab ? "bg-[#660B05] text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  onClick={() => setDriverTab(tab as any)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around mb-2 text-sm font-medium">
              <div>Total Rides: {driverStats.data.totalRides}</div>
              <div>Completed: {driverStats.data.completedRides}</div>
              <div>Total Earnings: ৳{driverStats.data.totalEarnings.toFixed(2)}</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={driverStats.data.charts[driverTab].map((d) => ({
                  ...d,
                  ridesCount: driverStats.data.recentRides.filter(
                    (r) =>
                      r.createdAt &&
                      new Date(r.createdAt).toLocaleDateString() ===
                      new Date(d.date || d.week || d.month || Date.now()).toLocaleDateString()
                  ).length,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={driverTab === "daily" ? "date" : driverTab === "weekly" ? "week" : "month"}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value: any, name: string) => [`${value}`, name]} cursor={{ stroke: PRIMARY_COLOR, strokeWidth: 2 }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="earnings"
                  stroke={PRIMARY_COLOR}
                  strokeWidth={3}
                  dot={{ r: 6, fill: PRIMARY_COLOR }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ridesCount"
                  stroke={SECONDARY_COLOR}
                  strokeWidth={2}
                  dot={{ r: 4, fill: SECONDARY_COLOR }}
                />
              </LineChart>
            </ResponsiveContainer>
            {driverStats.data.recentRides.length > 0 && (
              <div className="mt-2 text-xs">
                <strong>Recent Rides:</strong>
                <ul>
                  {driverStats.data.recentRides.map((ride) => (
                    <li key={ride._id}>
                      {ride.pickupLocation.formattedAddress} → {ride.dropoffLocation.formattedAddress} |{" "}
                      {ride.distanceKm} km | {ride.status} |{" "}
                      {ride.createdAt && new Date(ride.createdAt).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payments Overview */}
      {paymentStats?.data && (
        <Card>
          <CardHeader>
            <CardTitle>Payments by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-sm font-medium">
              Total Payments: <strong>{paymentStats.data.totalPayments}</strong> |
              Revenue: <strong>৳{paymentStats.data.totalRevenue.toFixed(2)}</strong> |
              Avg Amount: <strong>৳{paymentStats.data.avgAmount.toFixed(2)}</strong>
            </p>
            <PaymentsPieChart data={paymentStats.data.paymentsByStatus} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}