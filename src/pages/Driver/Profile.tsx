/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MapSelector from "@/components/MapSelector";
import {
  useUpdateUserMutation,
  useChangePasswordMutation,
  useSetPasswordMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import { toast } from "sonner";
import type { ILocation } from "@/types/user.type";
import Skeleton from "@/components/Skeleton";
import { Badge } from "@/components/ui/badge";
import { useGetDriverMeQuery } from "@/redux/features/driver/driver.api";
import SingleImageUploader from "@/components/SingleImageUploder"; 
import { useForm, FormProvider, Controller } from "react-hook-form";

export default function Profile() {
  const { data, isLoading } = useUserInfoQuery(undefined);
  const user = data?.data;
  const [updateUser] = useUpdateUserMutation();
  const [changePassword] = useChangePasswordMutation();
  const [setPassword] = useSetPasswordMutation();
  const { data: driverData } =
    useGetDriverMeQuery(undefined);
  const id = driverData?.data?._id ?? "";

  // --- Location state ---
  const [location, setLocation] = useState<ILocation>({
    lat: 24.8949,
    lng: 91.8687,
    formattedAddress: "",
  });

  // --- Password fields ---
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [setPwd, setSetPwd] = useState("");

  // --- Image state ---
  const [image, setImage] = useState<File | null>(null);

  // react-hook-form
  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  // --- Sync user data when loaded ---
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      setLocation({
        lat: user.location?.lat || 24.8949,
        lng: user.location?.lng || 91.8687,
        formattedAddress: user.location?.formattedAddress || "",
      });
    }
  }, [user, form]);

  // --- Handlers ---
  const handleUpdateProfile = async (data: any) => {
    try {
      const formData = new FormData();

      // attach JSON data
      formData.append(
        "data",
        JSON.stringify({
          userId: user._id,
          ...data,
          location,
        })
      );

      // attach file if uploaded
      if (image) {
        formData.append("file", image);
      }

      await updateUser(formData).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };


  const handleChangePassword = async () => {
    try {
      await changePassword({ oldPassword, newPassword }).unwrap();
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to change password");
    }
  };

  const handleSetPassword = async () => {
    try {
      await setPassword({ userId: user._id, password: setPwd }).unwrap();
      toast.success("Password set successfully!");
      setSetPwd("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to set password");
    }
  };

  // --- Manual lat/lng update ---
  const handleManualLatLngChange = (latStr: string, lngStr: string) => {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (!isNaN(lat) && !isNaN(lng)) {
      setLocation({ ...location, lat, lng });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <Card className="shadow-md">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-60" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[400px] w-full mt-4" />
            <Skeleton className="h-10 w-full mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 p-6 space-y-6">
      {/* Left section */}
      <div className="space-y-6 lg:col-span-5">
        {/* User Info Display */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <img
                src={user?.picture ?? null}
                alt={user?.name}
                className="w-24 h-24 rounded-full object-cover border"
              />
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="font-medium text-sm text-red-800">{user.role}</p>
                <p className="text-sm">{user.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge
                    variant={user.isActive ? "default" : "destructive"}
                    className="px-3 py-1 bg-green-500 text-white dark:bg-green-600"
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge
                    variant={user.isVerified ? "default" : "secondary"}
                    className="px-3 py-1 bg-blue-500 text-white dark:bg-blue-600"
                  >
                    {user.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
                <p className="text-sm">Phone: {user.phone || "N/A"}</p>
                <p className="text-sm">Address: {user.address || "N/A"}</p>
                <p className="text-sm">
                  Location:{" "}
                  {user.location
                    ? `${user.location.lat.toFixed(4)}, ${user.location.lng.toFixed(4)}, ${user.location.formattedAddress}.`
                    : "Not set"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Driver Info Card */}
        {driverData?.data && (
          <Card className="shadow-md">
            <CardContent className="p-6 space-y-3">
              <h2 className="text-xl font-semibold">Driver & Vehicle Info</h2>
              <p className="text-sm">Driver ID: {id}</p>
              <p className="text-sm">
                Vehicle:{" "}
                {driverData?.data?.driverProfile
                  ?.vehicleInfo?.model
                  ? `${driverData.data?.driverProfile
                    ?.vehicleInfo.model} (${driverData?.data?.driverProfile
                      ?.vehicleInfo?.type})`
                  : "N/A"}
              </p>
              <p className="text-sm">
                License: {driverData?.data?.driverProfile
                  ?.vehicleInfo?.licensePlate || "N/A"}
              </p>
              <div className="mt-2">
                <h3 className="font-medium">Contact Info</h3>
                <p className="text-sm">
                  Phone: {driverData.data.phone || "Not available"}
                </p>
                <p className="text-sm">
                  Email: {driverData.data.email || "Not available"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}


        {/* Change Password */}
        <Card className="shadow-md">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Change Password</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Old Password</label>
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter old password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">New Password</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
            </div>
            <Button className="mt-4 w-full" onClick={handleChangePassword}>
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Set Password (Google login users without password) */}
        <Card className="shadow-md">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">
              Set Password (Google login users without password)
            </h2>
            <div>
              <label className="block text-sm font-medium">New Password</label>
              <Input
                type="password"
                value={setPwd}
                onChange={(e) => setSetPwd(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <Button className="mt-4 w-full" onClick={handleSetPassword}>
              Set Password
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right section - Profile Update */}
            <div className="lg:col-span-7">
              <Card className="shadow-md">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Update Profile</h2>
      
                  <FormProvider {...form}>
                    <form
                      className="space-y-3"
                      onSubmit={form.handleSubmit(handleUpdateProfile)}
                    >
                      {/* Name */}
                      <label className="block text-sm font-medium mb-0">Name</label>
                      <Controller
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                          <Input placeholder="Your name" {...field} />
                        )}
                      />
      
                      {/* Phone */}
                      <label className="block text-sm font-medium mb-0">Phone</label>
                      <Controller
                        name="phone"
                        control={form.control}
                        render={({ field }) => (
                          <Input placeholder="+8801XXXXXXXXX" {...field} />
                        )}
                      />
      
                      {/* Picture uploader */}
                      <label className="block text-sm font-medium mb-0">Picture</label>
                      <SingleImageUploader onChange={setImage} />
      
                      {/* Address */}
                      <label className="block text-sm font-medium mb-0">Address</label>
                      <Controller
                        name="address"
                        control={form.control}
                        render={({ field }) => (
                          <Input placeholder="Your address" {...field} />
                        )}
                      />
      
                      {/* Lat/Lng */}
                      <p className="text-xs">
                      Tip: Select location(lat, lng) using the map and add formatted address manually!
                    </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium">Latitude</label>
                        <Input
                          type="number"
                          value={location.lat}
                          onChange={(e) =>
                            handleManualLatLngChange(e.target.value, String(location.lng))
                          }
                          placeholder="Latitude"
                        />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Longitude</label>
                        <Input
                          type="number"
                          value={location.lng}
                          onChange={(e) =>
                            handleManualLatLngChange(String(location.lat), e.target.value)
                          }
                          placeholder="Longitude"
                        />
                        </div>
                      </div>
      
                      {/* Formatted Address */}
                      <div>
                        <label className="block text-sm font-medium">Formatted Address</label>
                      <Input
                        value={location.formattedAddress}
                        onChange={(e) =>
                          setLocation({ ...location, formattedAddress: e.target.value })
                        }
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
      
                      <Button className="mt-4 w-full" type="submit">
                        Save Changes
                      </Button>
                    </form>
                  </FormProvider>
                </CardContent>
              </Card>
            </div>
    </div>
  );
}