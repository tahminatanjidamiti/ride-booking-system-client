/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  useGetAllDriversQuery,
  useUpdateDriverStatusMutation,
} from "@/redux/features/driver/driver.api";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Skeleton from "@/components/Skeleton";

export default function UpdateDriverStatus() {
  const { data: driversData, isLoading, isError } = useGetAllDriversQuery();
  const [updateDriverStatus] = useUpdateDriverStatusMutation();

  // Keep local states for all drivers
  const [driverStates, setDriverStates] = useState<
    Record<string, { isOnline: boolean; approved: boolean }>
  >({});

  const [updatingDriverId, setUpdatingDriverId] = useState<string | null>(null);

  useEffect(() => {
    if (driversData?.data) {
      const initialStates: Record<string, { isOnline: boolean; approved: boolean }> = {};
      driversData.data.forEach((driver: any) => {
        initialStates[driver._id] = {
          isOnline: !!driver.driverProfile?.isOnline,
          approved: !!driver.driverProfile?.approved,
        };
      });
      setDriverStates(initialStates);
    }
  }, [driversData]);

  const handleToggle = (driverId: string, field: "isOnline" | "approved", value: boolean) => {
    setDriverStates((prev) => ({
      ...prev,
      [driverId]: {
        ...prev[driverId],
        [field]: value,
      },
    }));
  };

  const handleUpdate = async (driverId: string) => {
    setUpdatingDriverId(driverId);
    try {
      const { isOnline, approved } = driverStates[driverId];
      await updateDriverStatus({ driverId, isOnline, approved }).unwrap();
      toast.success("Driver status updated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    } finally {
      setUpdatingDriverId(null); 
    }
  };

  if (isLoading) return <Skeleton className="h-40 w-full rounded-xl" />;
  if (isError) return <p>Something went wrong...!!</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2 p-6">
      {driversData?.data?.map((driver: any) => {
        const state = driverStates[driver._id] || { isOnline: false, approved: false };

        return (
          <Card key={driver._id} className="w-full shadow-lg">
            <CardHeader>
              <CardTitle>{driver.name || "Unnamed Driver"}</CardTitle>
              <p className="text-sm text-gray-500">
                License: {driver.driverProfile?.vehicleInfo?.licensePlate}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Online toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Online</span>
                <Switch
                  checked={state.isOnline}
                  onCheckedChange={(val) => handleToggle(driver._id, "isOnline", val)}
                  disabled={updatingDriverId === driver._id}
                />
              </div>

              {/* Approved toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Approved</span>
                <Switch
                  checked={state.approved}
                  onCheckedChange={(val) => handleToggle(driver._id, "approved", val)}
                  disabled={updatingDriverId === driver._id}
                />
              </div>

              <Button
                onClick={() => handleUpdate(driver._id)}
                disabled={updatingDriverId === driver._id}
                className="w-full"
              >
                {updatingDriverId === driver._id ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Update Status"
                )}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}