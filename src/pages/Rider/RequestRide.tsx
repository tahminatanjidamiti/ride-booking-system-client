/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

import MapSelector from "@/components/MapSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import Skeleton from "@/components/Skeleton";
import L from "leaflet";
import { useRequestRideMutation } from "@/redux/features/ride/ride.api";
import { useGetAllDriversQuery } from "@/redux/features/driver/driver.api";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { ILocation } from "@/types/user.type";
import type { TDriverProfile, TQueryParams } from "@/types";

// ---------- Zod schema for validation ----------
const rideZod = z.object({
  riderId: z.string().nonempty(),
  driverId: z.string(),
  pickupLocation: z.object({
    lat: z.number(),
    lng: z.number(),
    formattedAddress: z.string().optional(),
  }),
  dropoffLocation: z.object({
    lat: z.number(),
    lng: z.number(),
    formattedAddress: z.string().optional(),
  }),
  fare: z.number().min(0),
  status: z.enum(["REQUESTED", "ACCEPTED", "PICKED_UP", "IN_TRANSIT", "COMPLETED", "CANCELLED"]),
  distanceKm: z.number().optional(),
  estimatedTime: z.number().optional(),
});

type RideForm = z.infer<typeof rideZod>;

const SYLHET_DEFAULT: ILocation = { lat: 24.8949, lng: 91.8687, formattedAddress: "Sylhet" };


function haversineKm(a: ILocation, b: ILocation) {
  const R = 6371; // km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sa = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(sa), Math.sqrt(1 - sa));
  return R * c;
}

export default function RequestRide() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const riderId = userInfo?.data?._id ?? "";

  const navigate = useNavigate();



  const [searchParams, setSearchParams] = useSearchParams();
  const initialDriverId = searchParams.get("driverId") || "";

  const { data: driversResponse, isLoading: driversLoading } = useGetAllDriversQuery({} as TQueryParams);

  // Memoize drivers array to avoid re-renders
  const drivers = useMemo(() => driversResponse?.data ?? [], [driversResponse]);

  const [requestRide, { isLoading: isSubmitting }] = useRequestRideMutation();

  // react-hook-form
  const { handleSubmit, setValue, watch, reset } = useForm<RideForm>({
    resolver: zodResolver(rideZod),
    defaultValues: {
      riderId,
      driverId: initialDriverId,
      pickupLocation: SYLHET_DEFAULT,
      dropoffLocation: SYLHET_DEFAULT,
      fare: 0,
      status: "REQUESTED",
      distanceKm: 0,
      estimatedTime: 0,
    },
  });


  // local marker state synced to form
  const pickup = watch("pickupLocation");
  const dropoff = watch("dropoffLocation");
  const watchedDriverId = watch("driverId");

  // active marker toggle
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeMarker, setActiveMarker] = useState<"pickup" | "dropoff">("pickup");

  // sync riderId if user logs in later
  useEffect(() => {
    if (riderId) setValue("riderId", riderId);
  }, [riderId, setValue]);

  // sync initial driverId from url
  useEffect(() => {
    if (initialDriverId) setValue("driverId", initialDriverId);
  }, [initialDriverId, setValue]);

  // calculate fare when pickup/dropoff change
  const calculateFare = useCallback(() => {
    if (!pickup || !dropoff) {
      setValue("fare", 0);
      setValue("distanceKm", 0);
      setValue("estimatedTime", 0);
      return;
    }

    const distanceKm = haversineKm(pickup as ILocation, dropoff as ILocation);
    const baseFare = 50;
    const perKm = 15;
    const fare = baseFare + distanceKm * perKm;

    setValue("fare", parseFloat(fare.toFixed()));
    setValue("distanceKm", parseFloat(distanceKm.toFixed(2)));

    // assume ~40 km/h average = 0.67 km/min
    const estimatedTime = distanceKm / 0.67;
    setValue("estimatedTime", Math.round(estimatedTime));
  }, [pickup, dropoff, setValue]);

  useEffect(() => {
    calculateFare();
  }, [pickup, dropoff, calculateFare]);

  // handlers for MapSelector
  const handleSetPickup = useCallback((loc: ILocation) => {
    setValue("pickupLocation", loc, { shouldDirty: true, shouldTouch: true });
  }, [setValue]);

  const handleSetDropoff = useCallback((loc: ILocation) => {
    setValue("dropoffLocation", loc, { shouldDirty: true, shouldTouch: true });
  }, [setValue]);


  // manual lat/lng edits
  const manualReverseGeocode = async (lat: number, lng: number) => {
    try {
      const geocoder = (L as any).Control.Geocoder.nominatim();
      return await new Promise<string>((resolve) => {
        geocoder.reverse({ lat, lng }, 1, (results: any) => resolve(results?.[0]?.name || ""));
      });
    } catch {
      return "";
    }
  };

  const onManualLatLngChange = async (type: "pickup" | "dropoff", latStr: string, lngStr: string) => {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;
    const formattedAddress = await manualReverseGeocode(lat, lng);
    const loc: ILocation = { lat, lng, formattedAddress };
    if (type === "pickup") handleSetPickup(loc);
    else handleSetDropoff(loc);
  };

  const handleDriverChange = (driverId: string) => {
    const params = new URLSearchParams(searchParams);
    if (driverId) params.set("driverId", driverId);
    else params.delete("driverId");
    setSearchParams(params);
    setValue("driverId", driverId);
  };

  const clearDriver = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("driverId");
    setSearchParams(params);
    setValue("driverId", "");
  };

  const clearPickup = () => handleSetPickup(SYLHET_DEFAULT);
  const clearDropoff = () => handleSetDropoff(SYLHET_DEFAULT);
  const onSubmit = async (data: RideForm) => {
    if (!data.driverId) {
      toast.error("Please select a driver from the list.");
      return;
    }
    try {
      const res = await requestRide({
        riderId: data.riderId,
        driverId: data.driverId,
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        fare: data.fare,
        status: data.status,
        distanceKm: data.distanceKm,
        estimatedTime: data.estimatedTime,
      }).unwrap();
      toast.success("Ride requested successfully");
      navigate(`/booking/${res.data?._id}`)
      reset({
        riderId,
        driverId: "",
        pickupLocation: SYLHET_DEFAULT,
        dropoffLocation: SYLHET_DEFAULT,
        fare: 0,
        status: "REQUESTED",
        distanceKm: 0,
        estimatedTime: 0,
      });

      const params = new URLSearchParams(searchParams);
      params.delete("driverId");
      setSearchParams(params);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Request failed");
    }
  };

  // for driver
  const driverOptions = useMemo(
    () =>
      drivers.map((d: TDriverProfile) => ({
        value: d._id!,
        label: d.name + (d.driverProfile.isOnline ? " (Online)" : " (Offline)"),
      })),
    [drivers]
  );

  return (
    <div className="container mx-auto px-5 py-8">
      <div className="grid grid-cols-12 gap-5">
        {/* Left: driver filter */}
        <div className="col-span-12 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Driver Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {driversLoading ? (
                <Skeleton className="h-12 w-full" />
              ) : (
                <>
                  <Select
                    onValueChange={(v) => handleDriverChange(v)}
                    value={watchedDriverId || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Drivers</SelectLabel>
                        {driverOptions.map((opt: any) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <div>
                    <Button variant="outline" onClick={clearDriver} className="w-full">
                      Clear driver
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: form + map */}
        <div className="col-span-12 lg:col-span-9">
          <Card>
            <CardHeader>
              <CardTitle>Request Ride</CardTitle>
              <CardDescription>Tip: Select locations(lat, lng) from below map using Set Pickup and Set Dropoff and address add manually!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pickup</label>
                  <div className="flex gap-2">
                    <Input
                      value={String(pickup?.lat ?? "")}
                      onChange={(e) => onManualLatLngChange("pickup", e.target.value, String(pickup?.lng ?? ""))}
                      placeholder="lat"
                    />
                    <Input
                      value={String(pickup?.lng ?? "")}
                      onChange={(e) => onManualLatLngChange("pickup", String(pickup?.lat ?? ""), e.target.value)}
                      placeholder="lng"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={pickup?.formattedAddress ?? ""}
                      onChange={(e) =>
                        setValue("pickupLocation", { ...pickup, formattedAddress: e.target.value })
                      }
                      placeholder="Add Pickup Address Manually"
                    />
                    <Button variant="outline" onClick={clearPickup}>Clear</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Dropoff</label>
                  <div className="flex gap-2">
                    <Input
                      value={String(dropoff?.lat ?? "")}
                      onChange={(e) => onManualLatLngChange("dropoff", e.target.value, String(dropoff?.lng ?? ""))}
                      placeholder="lat"
                    />
                    <Input
                      value={String(dropoff?.lng ?? "")}
                      onChange={(e) => onManualLatLngChange("dropoff", String(dropoff?.lat ?? ""), e.target.value)}
                      placeholder="lng"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={dropoff?.formattedAddress ?? ""}
                      onChange={(e) =>
                        setValue("dropoffLocation", { ...dropoff, formattedAddress: e.target.value })
                      }
                      placeholder="Add Dropoff Address Manually"
                    />
                    <Button variant="outline" onClick={clearDropoff}>Clear</Button>
                  </div>
                </div>
              </div>

              <div>
                <MapSelector
                  mode="ride"
                  pickup={pickup ?? SYLHET_DEFAULT}
                  dropoff={dropoff ?? SYLHET_DEFAULT}
                  active={activeMarker}
                  onSetPickup={handleSetPickup}
                  onSetDropoff={handleSetDropoff}
                  center={pickup ?? SYLHET_DEFAULT}
                  height={420}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Fare</label>
                  <Input value={String(watch("fare") ?? 0)} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Distance (km)</label>
                  <Input value={String(watch("distanceKm") ?? 0)} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Estimated Time (min)</label>
                  <Input value={String(watch("estimatedTime") ?? 0)} readOnly />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="flex-1 border-2 border-black">
                  {isSubmitting ? "Requesting..." : "Request Ride"}
                </Button>
                <Button variant="outline" onClick={() => {
                  reset({
                    riderId,
                    driverId: "",
                    pickupLocation: SYLHET_DEFAULT,
                    dropoffLocation: SYLHET_DEFAULT,
                    fare: 0,
                    status: "REQUESTED",
                    distanceKm: 0,
                    estimatedTime: 0,
                  });
                  const params = new URLSearchParams(searchParams);
                  params.delete("driverId");
                  setSearchParams(params);
                }}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}