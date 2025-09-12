/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { useCreateBookingMutation } from "@/redux/features/booking/booking.api";
import { useState } from "react";
import { useParams } from "react-router";
import { useGetAllRidesQuery } from "@/redux/features/ride/ride.api";
import Skeleton from "@/components/Skeleton";

export default function Bookings() {
 const [riderCount, setRiderCount] = useState(1);
  

  const { id } = useParams(); // rideId from URL
  const { data, isLoading, isError } = useGetAllRidesQuery({ _id: id });
  const [createBooking] = useCreateBookingMutation();
  const rideData = data?.data?.[0];
  // console.log(rideData)
  const totalFare = riderCount * (rideData?.fare ?? 0);

  const incrementRider = () => {
    setRiderCount((prev) => prev + 1);
  };

  const decrementRider = () => {
    setRiderCount((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleBooking = async () => {
    let bookingData;

    if (data) {
      bookingData = {
        rider: rideData?.riderId, 
        driver: rideData?.driverId, 
        ride: id,
        riderCount: riderCount,
      };
    }

    try {
      const res = await createBooking(bookingData).unwrap();
      if (res.success) {
        if (res.data.paymentUrl) {
          window.open(res.data.paymentUrl, "_blank");
        }
      }
    } catch (err) {
      // console.error("Booking failed:", err);
    }
  };

   if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-5 p-6 container mx-auto">
        <div className="flex-1 space-y-6">
          <Skeleton className="h-8 w-40" /> 
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="w-full lg:w-96">
          <div className="border border-muted p-6 rounded-lg shadow-md sticky top-6 space-y-4">
            <Skeleton className="h-6 w-48 mb-6" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) return <p>Something went wrong...!!</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-5 p-6 container mx-auto">
      {/* Ride Summary */}
       <div className="flex-1 space-y-6">
        <h1 className="text-3xl font-bold">Ride Summary</h1>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Ride:</strong> {rideData?._id}
          </div>
          <div>
            <strong>Rider:</strong> {rideData?.riderId}
          </div>
          <div>
            <strong>Driver:</strong> {rideData?.driverId}
          </div>
          <div>
            <strong>RiderCount:</strong> {riderCount}
          </div>
        </div>
      </div>
      {/* Booking Details */}
      <div className="w-full lg:w-96">
        <div className="border border-muted p-6 rounded-lg shadow-md sticky top-6">
          <h2 className="text-2xl font-bold mb-6">Booking Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Riders
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={decrementRider}
                  disabled={riderCount <= 1}
                  className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50"
                >
                  -
                </button>
                <span className="text-lg font-medium w-8 text-center">
                  {riderCount}
                </span>
                <button
                  onClick={incrementRider}
                  className="w-8 h-8 rounded-full border flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Fare per rider:</span>
                <span>৳{rideData?.fare}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>RiderCount:</span>
                <span>{riderCount}</span>
              </div>
               <div className="flex justify-between text-lg font-bold">
                <span>Total Fare:</span>
                <span>৳{totalFare}</span>
              </div>
            </div>

            <Button onClick={handleBooking} className="w-full border-2 border-black" size="lg">
              Book Ride
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}