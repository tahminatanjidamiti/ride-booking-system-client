import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGetRideHistoryQuery } from "@/redux/features/ride/ride.api";
import type { IRide } from "@/types";
import { Link } from "react-router";
import Skeleton from "@/components/Skeleton";

export default function RideHistory() {
    const { data, isLoading } = useGetRideHistoryQuery();
    const rides = data?.data || [];

    // Local states
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [createdAt, setCreatedAt] = useState<string | undefined>(undefined);
    const [fareRange, setFareRange] = useState<[number, number]>([0, 1000]);
    const [fareInput, setFareInput] = useState("");
    const [page, setPage] = useState(1);
    const limit = 5;

    // Reset filters handler
    const handleClearFilters = () => {
        setSearch("");
        setStatus(undefined);
        setCreatedAt(undefined);
        setFareRange([0, 1000]);
        setPage(1);
    };

    // Filter + Search + Pagination
    const filteredRides = useMemo(() => {
        return rides
            .filter((ride: IRide) => {
                const pickup = ride.pickupLocation?.formattedAddress || "";
                const dropoff = ride.dropoffLocation?.formattedAddress || "";

                const matchSearch =
                    search === "" ||
                    pickup.toLowerCase().includes(search.toLowerCase()) ||
                    dropoff.toLowerCase().includes(search.toLowerCase());

                const matchStatus = !status || ride.status === status;

                const matchCreatedAt =
                    !createdAt ||
                    (ride.createdAt &&
                        new Date(ride.createdAt).toLocaleDateString("en-CA") === createdAt);

                const matchFare =
                    ride.fare >= fareRange[0] && ride.fare <= fareRange[1];

                return matchSearch && matchStatus && matchCreatedAt && matchFare;
            })
            .slice((page - 1) * limit, page * limit);
    }, [rides, search, status, createdAt, fareRange, page]);

    const totalPages = Math.ceil(
        rides.filter((ride: IRide) => {
            const pickup = ride.pickupLocation?.formattedAddress || "";
            const dropoff = ride.dropoffLocation?.formattedAddress || "";

            const matchSearch =
                search === "" ||
                pickup.toLowerCase().includes(search.toLowerCase()) ||
                dropoff.toLowerCase().includes(search.toLowerCase());

            const matchStatus = !status || ride.status === status;

            const matchCreatedAt =
                !createdAt ||
                (ride.createdAt &&
                    new Date(ride.createdAt).toLocaleDateString("en-CA") === createdAt);

            const matchFare = ride.fare >= fareRange[0] && ride.fare <= fareRange[1];

            return matchSearch && matchStatus && matchCreatedAt && matchFare;
        }).length / limit
    );

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-8 w-40" />
                <div className="space-y-4">
                    {Array.from({ length: limit }).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Ride History</h1>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <Input
                    placeholder="Search by address..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <Select
                    value={status || "ALL"}
                    onValueChange={(value) =>
                        setStatus(value === "ALL" ? undefined : value)
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                        <SelectItem value="REQUESTED">Requested</SelectItem>
                    </SelectContent>
                </Select>

                <Input
                    type="date"
                    value={createdAt || ""}
                    onChange={(e) => setCreatedAt(e.target.value)}
                />

                <Input
                    type="text"
                    placeholder="Fare Range (e.g. 50-500)"
                    value={fareInput}
                    onChange={(e) => {
                        setFareInput(e.target.value);
                        const [min, max] = e.target.value.split("-").map(Number);
                        if (!isNaN(min) && !isNaN(max)) setFareRange([min, max]);
                    }}
                />

                <Button
                    variant="destructive"
                    className="w-full border-2 border-black "
                    onClick={handleClearFilters}
                >
                    Clear Filters
                </Button>
            </div>

            {/* Ride List */}
            {filteredRides.length === 0 ? (
                <p className="text-gray-500">No rides found.</p>
            ) : (
                <div className="space-y-4">
                    {filteredRides.map((ride: IRide) => {
                        const pickup =
                            ride?.pickupLocation?.formattedAddress ||
                            "Selected pickup lat lng from Map";
                        const dropoff =
                            ride?.dropoffLocation?.formattedAddress ||
                            "Selected dropoff lat lng from Map";
                        const rideDate = ride.createdAt
                            ? new Date(ride.createdAt).toLocaleDateString()
                            : "N/A";

                        return (
                            <Card key={ride._id} className="shadow-md">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">
                                            {pickup} → {dropoff}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Date: {rideDate} | Fare: ৳{ride.fare} | Status:{" "}
                                            <span className="capitalize">{ride.status}</span>
                                        </p>
                                    </div>
                                    <Button asChild variant="outline" size="sm">
                                        <Link to={`/details/${ride._id}`}>View Details</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-4">
                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Prev
                    </Button>
                    <span>
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}