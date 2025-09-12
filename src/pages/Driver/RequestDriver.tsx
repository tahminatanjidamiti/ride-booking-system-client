/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MapSelector from "@/components/MapSelector";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useCreateDriverMutation } from "@/redux/features/driver/driver.api";
import type { TDriverProfile, ILocation } from "@/types";
import Skeleton from "@/components/Skeleton";
import { toast } from "sonner";
import type { IGeoLocation } from "@/types/driver.type";

// ---- FormValues: keep simple form-friendly shape ----
type FormValues = {
  name: string;
  email: string;
  phone: string;
  role: string;
  riderId?: string;
  vehicleType: string;
  vehicleModel: string;
  licensePlate: string;
  location: IGeoLocation;
};

export default function RequestDriver() {
  const { data: userData, isLoading: userLoading } = useUserInfoQuery(undefined);
  const user = userData?.data;

  const [createDriver, { isLoading: creating }] = useCreateDriverMutation();

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "DRIVER",
      riderId: undefined,
      vehicleType: "",
      vehicleModel: "",
      licensePlate: "",
      location: {
        type: "Point",
        coordinates: [91.8687, 24.8949],
        formattedAddress: "Sylhet, Bangladesh",
      },
    },
  });

  const { control, handleSubmit, reset, formState } = form;
  const { errors } = formState;

  const [location, setLocation] = useState<ILocation>({
    lat: 24.8949,
    lng: 91.8687,
    formattedAddress: "Sylhet, Bangladesh",
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        role: "DRIVER",
        riderId: user._id,
        vehicleType: "",
        vehicleModel: "",
        licensePlate: "",
        location: {
          type: "Point",
          coordinates: [
            user.location?.lng ?? 91.8687,
            user.location?.lat ?? 24.8949,
          ],
          formattedAddress:
            user.location?.formattedAddress ?? "Sylhet, Bangladesh",
        },
      });

      setLocation({
        lat: user.location?.lat ?? 24.8949,
        lng: user.location?.lng ?? 91.8687,
        formattedAddress: user.location?.formattedAddress ?? "Sylhet, Bangladesh",
      });
    }
  }, [user, reset]);

  const handleManualLatLngChange = (lat: string, lng: string) => {
    setLocation({ ...location, lat: Number(lat), lng: Number(lng) });
  };

  const onSubmit = async (values: FormValues) => {
    const geoLocation: IGeoLocation = {
      type: "Point",
      coordinates: [location.lng, location.lat],
      formattedAddress: location.formattedAddress,
    };

    const payload: TDriverProfile = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      role: values.role as any,
      riderId: user?._id,
      location: geoLocation as any, // cast to bypass TS error
      driverProfile: {
        vehicleInfo: {
          type: values.vehicleType,
          model: values.vehicleModel,
          licensePlate: values.licensePlate,
        },
      },
    };

    try {
      await createDriver(payload).unwrap();
      toast.success("Driver request submitted successfully.");
      reset({
        ...values,
        vehicleType: "",
        vehicleModel: "",
        licensePlate: "",
      });
    } catch (err: any) {
      console.error(err);
      const message =
        err?.data?.message ?? err?.message ?? "Failed to submit request.";
      toast.error(message);
    }
  };

  if (userLoading) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">
            Request Driver Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* --- Basic info --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-0">Name</label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Name is required" }}
                  render={({ field }) => <Input {...field} readOnly />}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-0">Email</label>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" },
                  }}
                  render={({ field }) => <Input {...field} readOnly />}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-0">Phone</label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    required: "Phone is required",
                    minLength: { value: 8, message: "Enter a valid phone" },
                  }}
                  render={({ field }) => <Input {...field} readOnly />}
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-0">Role</label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => <Input {...field} readOnly />}
                />
              </div>
            </div>

            <Controller
              name="riderId"
              control={control}
              render={({ field }) => <Input type="hidden" {...field} readOnly />}
            />

            {/* --- Vehicle info --- */}
            <div className="space-y-2">
              <h3 className="font-medium">Vehicle information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-0">Vehicle Type</label>
                  <Controller
                    name="vehicleType"
                    control={control}
                    rules={{ required: "Vehicle type is required" }}
                    render={({ field }) => <Input {...field} />}
                  />
                  {errors.vehicleType && (
                    <p className="text-red-600 text-sm mt-1">{errors.vehicleType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-0">Model</label>
                  <Controller
                    name="vehicleModel"
                    control={control}
                    rules={{ required: "Model is required" }}
                    render={({ field }) => <Input {...field} />}
                  />
                  {errors.vehicleModel && (
                    <p className="text-red-600 text-sm mt-1">{errors.vehicleModel.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-0">License Plate</label>
                  <Controller
                    name="licensePlate"
                    control={control}
                    rules={{ required: "License plate is required" }}
                    render={({ field }) => <Input {...field} />}
                  />
                  {errors.licensePlate && (
                    <p className="text-red-600 text-sm mt-1">{errors.licensePlate.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* --- Location --- */}
            <div className="space-y-2">
              <h3 className="font-medium">Location</h3>
              <p className="text-xs text-muted-foreground">
                Tip: Select location (lat, lng) using the map and add formatted address manually!
              </p>

              {/* Lat/Lng */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Latitude</label>
                  <Input
                    type="number"
                    value={location.lat}
                    onChange={(e) => handleManualLatLngChange(e.target.value, String(location.lng))}
                    placeholder="Latitude"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Longitude</label>
                  <Input
                    type="number"
                    value={location.lng}
                    onChange={(e) => handleManualLatLngChange(String(location.lat), e.target.value)}
                    placeholder="Longitude"
                  />
                </div>
              </div>

              {/* Formatted Address */}
              <div>
                <label className="block text-sm font-medium">Formatted Address</label>
                <Input
                  value={location.formattedAddress}
                  onChange={(e) => setLocation({ ...location, formattedAddress: e.target.value })}
                  placeholder="Add location address manually"
                />
              </div>

              {/* Map Selector */}
              <MapSelector
                mode="single"
                location={location}
                onSetLocation={setLocation}
                height={400}
              />
            </div>

            {/* --- Submit --- */}
            <div className="pt-4">
              <Button type="submit" disabled={creating} className="w-full">
                {creating ? "Submitting..." : "Request Driver"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}