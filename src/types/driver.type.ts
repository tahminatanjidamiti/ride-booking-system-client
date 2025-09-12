import type { IUser } from ".";

export interface IVehicleInfo {
  type: string; 
  model: string;
  licensePlate: string;
}

export interface IDriverProfile {
  approved?: boolean;
  isOnline?: boolean;
  vehicleInfo: IVehicleInfo;
  earnings?: number;
  rating?: number;
  totalRides?: number;
  cancelAttempts?: number;
}

export interface IGeoLocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
  formattedAddress?: string;
}


export type TDriverProfile = IUser & {
  _id?: string;
  riderId: string;
  location: IGeoLocation;
  driverProfile: IDriverProfile;
};

