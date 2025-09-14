import { useNavigate, useParams } from "react-router";
import { useCancelRideMutation, useGetAllRidesQuery } from "@/redux/features/ride/ride.api";
import type { TQueryParams } from "@/types";
import Skeleton from "@/components/Skeleton";
import { CancelConfirmation } from "@/components/CancelConfirmation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function RideDetails() {
  const { id } = useParams();

  const { data, isLoading } = useGetAllRidesQuery({ _id: id } as TQueryParams);
  const ride = data?.data?.[0];

  const [cancelRide] = useCancelRideMutation();
  const navigate = useNavigate();

  const handleCancelRide = async (rideId: string) => {
    const toastId = toast.loading("Cancelling...");
    try {
      const res = await cancelRide(rideId).unwrap();

      if (res.success) {
        toast.success("Removed", { id: toastId });
        navigate(-1)
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="space-y-3 border rounded-lg p-4 shadow-sm bg-white">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-52" />
        </div>
      </div>
    );
  }


  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Ride Details</h1>

      <div className="space-y-3 border rounded-lg p-4 shadow-sm bg-white">
        <p><strong>Pickup:</strong> {ride?.pickupLocation?.formattedAddress}</p>
        <p><strong>Dropoff:</strong> {ride?.dropoffLocation?.formattedAddress}</p>
        <p><strong>Fare:</strong> ৳{ride?.fare}</p>
        <p><strong>Status:</strong> {ride?.status}</p>
        <p><strong>Driver:</strong> {ride?.driverId}</p>
        <p><strong>DistanceKm:</strong> {ride?.distanceKm}</p>
        <p><strong>EstimatedTime:</strong> {ride?.estimatedTime}</p>
        <p><strong>Date:</strong> {ride?.createdAt ? new Date(ride?.createdAt).toLocaleString() : "N/A"}</p>
        {/* CANCEL Ride */}
      {ride && ride._id && ride.status !== "COMPLETED" && ride.status !== "CANCELLED" && (
        <CancelConfirmation onConfirm={() => handleCancelRide(ride._id!)}>
          <Button size="sm" variant="destructive">
            Cancel Ride <Trash2 />
          </Button>
        </CancelConfirmation>
      )}
      </div>
    </div>
  );
}