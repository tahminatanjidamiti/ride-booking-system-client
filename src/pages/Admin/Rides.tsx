/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { CancelConfirmation } from "@/components/CancelConfirmation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Skeleton from "@/components/Skeleton";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAllRidesQuery,
  useCancelRideMutation,
} from "@/redux/features/ride/ride.api";

export default function Rides() {
  // local states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);

  // Build query params dynamically (excluding fare from search)
  const queryParams: any = { page, limit };
  if (search) queryParams.search = search;
  if (status) queryParams.status = status;

  const { data, isLoading } = useGetAllRidesQuery(queryParams);
  const [cancelRide, { isLoading: isCancelling }] = useCancelRideMutation();

  const handleCancel = async (id: string) => {
    try {
      await cancelRide(id).unwrap();
      toast.success("Ride cancelled successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to cancel ride");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchText);
  };

  const clearFilters = () => {
    setSearch("");
    setSearchText("");
    setStatus(undefined);
    setPage(1);
  };

  if (isLoading) return <Skeleton className="h-40 w-full rounded-xl" />;

  const totalPage = data?.meta?.totalPage || 1;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Manage Rides</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search by pickup, dropoff, or status..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="max-w-sm"
            />
            <Button type="submit">Search</Button>
            {(searchText || status) && (
              <Button type="button" variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </form>

          {/* Status filter */}
          <Select
            value={status || "ALL"}
            onValueChange={(val) => {
              setStatus(val === "ALL" ? undefined : val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="REQUESTED">Requested</SelectItem>
              <SelectItem value="ACCEPTED">Accepted</SelectItem>
              <SelectItem value="PICKED_UP">Picked Up</SelectItem>
              <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Page size */}
          <Select
            value={limit.toString()}
            onValueChange={(val) => {
              setLimit(Number(val));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Pickup</th>
                <th className="px-4 py-2 text-left">Dropoff</th>
                <th className="px-4 py-2 text-left">Fare</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.length ? (
                data.data.map((ride: any) => (
                  <tr key={ride._id} className="border-t">
                    <td className="px-4 py-2">
                      {ride.pickupLocation?.formattedAddress || "-"}
                    </td>
                    <td className="px-4 py-2">
                      {ride.dropoffLocation?.formattedAddress || "-"}
                    </td>
                    <td className="px-4 py-2">{ride.fare ?? "-"}</td>
                    <td className="px-4 py-2">{ride.status}</td>
                    <td className="px-4 py-2 text-center">
                      {ride.status !== "CANCELLED" &&
                        ride.status !== "COMPLETED" && (
                          <CancelConfirmation
                            onConfirm={() => handleCancel(ride._id)}
                          >
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={isCancelling}
                            >
                              Cancel Ride
                            </Button>
                          </CancelConfirmation>
                        )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No rides found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.meta && (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of {totalPage}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, totalPage))
              }
              disabled={page === totalPage}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}