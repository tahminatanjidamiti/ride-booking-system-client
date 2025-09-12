import type { ILocation } from "./user.type";


export type RideStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "COMPLETED"
  | "CANCELLED";

export interface IRide {
  _id?: string;
  riderId: string;
  driverId: string;
  pickupLocation: ILocation;
  dropoffLocation: ILocation;
  status: RideStatus;
  fare: number;
  distanceKm?: number;
  estimatedTime?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
