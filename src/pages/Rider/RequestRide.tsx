/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useGetNearestDriversQuery, useGetAllDriversQuery } from "@/redux/features/driver/driver.api";
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

// ---------- Haversine distance ----------
function haversineKm(a: ILocation, b: ILocation) {
  const R = 6371; // km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sa =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
    Math.cos((b.lat * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(sa), Math.sqrt(1 - sa));
  return R * c;
}

export default function RequestRide() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const riderId = userInfo?.data?._id ?? "";

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDriverId = searchParams.get("driverId") || "";

  // --- Polling nearest drivers ---
  const [pollingEnabled, setPollingEnabled] = useState(true);
  const { data: nearestDriversResp, isLoading: nearestLoading } = useGetNearestDriversQuery(
    { lat: SYLHET_DEFAULT.lat, lng: SYLHET_DEFAULT.lng, radius: 5 },
    { pollingInterval: pollingEnabled ? 10000 : 0, skip: !pollingEnabled }
  );
  const driversNearest: TDriverProfile[] = useMemo(() => {
    const d = nearestDriversResp?.data;
    if (Array.isArray(d)) return d;
    if (d && typeof d === "object") return [d];
    return [];
  }, [nearestDriversResp]);

  // --- All drivers ---
  const { data: allDriversResp, isLoading: allDriversLoading } = useGetAllDriversQuery({} as TQueryParams);
  const driversAll: TDriverProfile[] = useMemo(() => allDriversResp?.data ?? [], [allDriversResp]);

  const [requestRide, { isLoading: isSubmitting }] = useRequestRideMutation();

  // --- Form ---
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

  const pickup = watch("pickupLocation");
  const dropoff = watch("dropoffLocation");
  const watchedDriverId = watch("driverId");

  const [activeMarker, setActiveMarker] = useState<"pickup" | "dropoff">("pickup");

  useEffect(() => {
    if (riderId) setValue("riderId", riderId);
  }, [riderId, setValue]);

  useEffect(() => {
    if (initialDriverId) setValue("driverId", initialDriverId);
  }, [initialDriverId, setValue]);

  // --- Fare calculation ---
  const calculateFare = useCallback(() => {
    if (!pickup || !dropoff) {
      setValue("fare", 0);
      setValue("distanceKm", 0);
      setValue("estimatedTime", 0);
      return;
    }
    const distanceKm = haversineKm(pickup, dropoff);
    const fare = 50 + distanceKm * 15;
    setValue("fare", parseFloat(fare.toFixed()));
    setValue("distanceKm", parseFloat(distanceKm.toFixed(2)));
    setValue("estimatedTime", Math.round(distanceKm / 0.67));
  }, [pickup, dropoff, setValue]);

  useEffect(() => {
    calculateFare();
  }, [pickup, dropoff, calculateFare]);

  const handleSetPickup = useCallback((loc: ILocation) => {
    setValue("pickupLocation", loc, { shouldDirty: true, shouldTouch: true });
  }, [setValue]);

  const handleSetDropoff = useCallback((loc: ILocation) => {
    setValue("dropoffLocation", loc, { shouldDirty: true, shouldTouch: true });
  }, [setValue]);

  const manualReverseGeocode = async (lat: number, lng: number) => {
    try {
      const geocoder = (L as any).Control.Geocoder.nominatim();
      return await new Promise<string>((resolve) => {
        geocoder.reverse({ lat, lng }, 1, (results: any) =>
          resolve(results?.[0]?.name || "")
        );
      });
    } catch {
      return "";
    }
  };

  const onManualLatLngChange = async (
    type: "pickup" | "dropoff",
    latStr: string,
    lngStr: string
  ) => {
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
      navigate(`/booking/${res.data?._id}`);
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
              {nearestLoading && allDriversLoading ? (
                <Skeleton className="h-12 w-full" />
              ) : (
                <>
                  <Select
                    onValueChange={(v) => handleDriverChange(v)}
                    value={watchedDriverId || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select driver">
                        {watchedDriverId
                          ? (() => {
                            // combine nearest + all drivers to find selected
                            const allDriversCombined = [...driversNearest, ...driversAll];
                            const selected = allDriversCombined.find((d) => d._id === watchedDriverId);
                            return selected
                              ? `${selected.name} ${selected.driverProfile.isOnline ? "(Online)" : "(Offline)"}`
                              : "";
                          })()
                          : "Select driver"}
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      {/* Nearest Drivers */}
                      {driversNearest.length > 0 && (
                        <SelectGroup>
                          <SelectLabel>Nearest Driver</SelectLabel>
                          {driversNearest.map((d) => (
                            <SelectItem key={d._id} value={d._id!}>
                              {d.name} {d.driverProfile.isOnline ? "(Online)" : "(Offline)"}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )}

                      {/* All Drivers */}
                      {driversAll.length > 0 && (
                        <SelectGroup>
                          <SelectLabel>All Drivers</SelectLabel>
                          {driversAll.map((d) => (
                            <SelectItem key={d._id} value={d._id!}>
                              {d.name} {d.driverProfile.isOnline ? "(Online)" : "(Offline)"}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )}
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
              <CardDescription>
                Tip: Select locations(lat, lng) from below map using Set Pickup and Set Dropoff and address add manually!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pickup */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pickup</label>
                  <div className="flex gap-2">
                    <Input
                      value={String(pickup?.lat ?? "")}
                      onChange={(e) =>
                        onManualLatLngChange("pickup", e.target.value, String(pickup?.lng ?? ""))
                      }
                      placeholder="lat"
                    />
                    <Input
                      value={String(pickup?.lng ?? "")}
                      onChange={(e) =>
                        onManualLatLngChange("pickup", String(pickup?.lat ?? ""), e.target.value)
                      }
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

                {/* Dropoff */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dropoff</label>
                  <div className="flex gap-2">
                    <Input
                      value={String(dropoff?.lat ?? "")}
                      onChange={(e) =>
                        onManualLatLngChange("dropoff", e.target.value, String(dropoff?.lng ?? ""))
                      }
                      placeholder="lat"
                    />
                    <Input
                      value={String(dropoff?.lng ?? "")}
                      onChange={(e) =>
                        onManualLatLngChange("dropoff", String(dropoff?.lat ?? ""), e.target.value)
                      }
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

              {/* Map */}
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

              {/* Fare / Distance / Time */}
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

              {/* Submit */}
              <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Requesting..." : "Request Ride"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}