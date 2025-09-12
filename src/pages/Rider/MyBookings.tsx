import { Card, CardContent } from "@/components/ui/card";
import { MapPin, User, Car, Users } from "lucide-react";
import { toast } from "sonner";
import type { IRideBooking, BOOKING_STATUS, ILocation } from "@/types";
import { useGetMyBookingsQuery } from "@/redux/features/booking/booking.api";
import { useInitPaymentMutation } from "@/redux/features/payment/payment.api";
import Skeleton from "@/components/Skeleton";

// Map booking status to colors
const statusColors: Record<BOOKING_STATUS, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CANCEL: "bg-red-100 text-red-700",
  COMPLETE: "bg-green-100 text-green-700",
  FAILED: "bg-gray-100 text-gray-700",
};

export default function MyBookings() {
  const { data, isLoading, isError } = useGetMyBookingsQuery();
  const [initPayment, { isLoading: isPaying }] = useInitPaymentMutation();

  const handlePay = async (bookingId: string) => {
    try {
      const res = await initPayment({ bookingId }).unwrap();
      // Redirect to payment gateway
      window.location.href = res.data.paymentUrl;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Payment failed");
    }
  };

  
  if (isLoading) {
    const skeletonCount = 3; // Show 3 placeholders
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-8 w-40" />
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-2 lg:gap-5">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <Card key={i} className="shadow-md rounded-2xl">
              <CardContent className="p-4 space-y-3">
                {/* Status + Fare */}
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-16" />
                </div>

                {/* Pickup & Dropoff */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                </div>

                {/* Rider & Driver */}
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>

                {/* Date */}
                <Skeleton className="h-3 w-32" />

                {/* Button */}
                <Skeleton className="h-9 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }


  if (isError) return <p>Something went wrong...!!</p>;

  const bookings: IRideBooking[] = data?.data || [];

  const formatLocation = (loc?: ILocation) => loc?.formattedAddress || "N/A";

  return (
    <div className="container mx-auto p-3 lg:p-6">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center">No bookings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-2 lg:gap-5">
        {
        bookings.map((booking) => {
          const ride = booking.ride;
          return (
            <Card key={booking._id} className="shadow-md rounded-2xl">
              <CardContent className="p-4 space-y-3">
                {/* Status + Fare */}
                <div className="flex justify-between items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                  <span className="text-lg font-semibold">৳{ride?.fare * booking.riderCount}</span>
                </div>

                {/* Pickup & Dropoff */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span>{formatLocation(ride?.pickupLocation)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span>{formatLocation(ride?.dropoffLocation)}</span>
                  </div>
                </div>

                {/* Rider & Driver Info */}
                <div className="flex justify-between text-sm text-gray-600 pt-2">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>
                      Rider: {booking?.rider?.name ?? booking.rider ?? "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center ml-2 gap-1">
                    <Car className="w-4 h-4" />
                    <span>
                      Driver: {booking.driver?.name ?? booking.driver ?? "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-700 gap-1">
                  <Users className="w-4 h-4" />
                  <span>
                    RiderCount: {booking.riderCount}
                  </span>
                </div>

                {/* Created Date */}
                <div className="text-xs text-gray-500">
                  {booking.createdAt
                    ? new Date(booking.createdAt).toLocaleString()
                    : "N/A"}
                </div>

                {/* Pay Now button for CANCEL & FAILED bookings */}
                {(booking.status === "FAILED" || booking.status === "CANCEL") && booking._id && (
                  <div className="pt-3">
                    <button
                      onClick={() => handlePay(booking._id!)}
                      disabled={isPaying}
                      className="border-2 border-black px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 disabled:opacity-50"
                    >
                      {isPaying ? "Processing..." : "Pay Now"}
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        </div>
      )}
    </div>
  );
};

