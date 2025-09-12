import { useEffect, useState } from "react";
import {
  useGetDriverMeQuery,
  useUpdateDriverStatusMutation,
} from "@/redux/features/driver/driver.api";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Skeleton from "@/components/Skeleton";


export default function UpdateStatus() {

  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [approved, setApproved] = useState<boolean>(true);

  const { data: driverData, isLoading: isFetching, isError } = useGetDriverMeQuery(undefined);

  const id = driverData?.data?._id ?? "";

  const [updateDriverStatus, { isLoading: isUpdating }] = useUpdateDriverStatusMutation();

  // Prefill switches when backend data loads
  useEffect(() => {
    if (driverData) {
      const profile = driverData.data; // driver object
      setIsOnline(!!profile.driverProfile?.isOnline);
      setApproved(!!profile.driverProfile?.approved);
    }
  }, [driverData]);

  const handleUpdate = async () => {
    if (!id) return;
    try {
      await updateDriverStatus({ driverId: id, isOnline, approved }).unwrap();
      toast.success("Driver status updated successfully!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  if (isFetching) return <Skeleton className="h-40 w-full max-w-md rounded-xl" />;
  if (isError) return <div className="text-center text-red-500 p-6">Failed to load driver profile.</div>;

  const driverProfile = driverData?.data.driverProfile;

  return (
    <div className="flex flex-col md:flex-row gap-6 justify-center p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Update Driver Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Online</span>
            <Switch
              checked={isOnline}
              onCheckedChange={setIsOnline}
              disabled={isUpdating}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Approved</span>
            <Switch
              checked={approved}
              onCheckedChange={setApproved}
              disabled={isUpdating}
            />
          </div>

          <Button onClick={handleUpdate} disabled={isUpdating} className="w-full">
            {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update Status"}
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>My Driver Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Earnings</span>
            <span className="text-sm">৳{driverProfile?.earnings?.toFixed(2) ?? "0.00"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Rides</span>
            <span className="text-sm">{driverProfile?.totalRides ?? 0}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Cancel Attempts</span>
            <span className="text-sm">{driverProfile?.cancelAttempts ?? 0}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Rating</span>
            <span className="text-sm">{driverProfile?.rating?.toFixed(1) ?? "N/A"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}