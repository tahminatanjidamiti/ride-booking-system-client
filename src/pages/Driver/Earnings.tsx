import Skeleton from "@/components/Skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { useGetDriverStatsMeQuery } from "@/redux/features/driver/driver.api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function Earnings() {
  const { data, isLoading, isError } = useGetDriverStatsMeQuery();

  
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        {/* Skeleton for summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>

        {/* Skeleton for chart */}
        <Card>
          <CardContent>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !data?.data)
    return (
      <p>
        Something went wrong...!!
      </p>
    );

  const { totalEarnings, completedRides, totalRides, charts } = data.data;

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Total Earnings</h2>
            <p className="text-2xl font-bold">৳{totalEarnings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Completed Rides</h2>
            <p className="text-2xl font-bold">{completedRides}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Total Rides</h2>
            <p className="text-2xl font-bold">{totalRides}</p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Charts */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Earnings Breakdown</h2>

          <Tabs defaultValue="daily">
            <TabsList className="mb-4">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>

            <TabsContent value="daily">
              <EarningsChart data={charts.daily} dataKey="earnings" xKey="date" />
            </TabsContent>

            <TabsContent value="weekly">
              <EarningsChart data={charts.weekly} dataKey="earnings" xKey="week" />
            </TabsContent>

            <TabsContent value="monthly">
              <EarningsChart data={charts.monthly} dataKey="earnings" xKey="month" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Reusable Line Chart component
function EarningsChart({
  data,
  dataKey,
  xKey,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  dataKey: string;
  xKey: string;
}) {
  if (!data || data.length === 0) return <p className="text-center py-10">No data available</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip
          formatter={(value: number) => [`$${value}`, "Earnings"]}
          labelFormatter={(label: string) => `${label}`}
        />
        <Line type="monotone" dataKey={dataKey} stroke="#2563eb" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
