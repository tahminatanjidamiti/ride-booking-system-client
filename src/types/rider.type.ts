import type { IResponse } from ".";
import type { IRide, RideStatus } from "./ride.type";
import type { ILocation, IUser } from "./user.type";


export type TRideRequest = {
  pickupLocation: ILocation;
  dropoffLocation: ILocation;
  status: RideStatus;
  fare: number;
  distanceKm?: number;
  estimatedTime?: number;
  riderId: string;
  driverId: string;
};

export type TRideHistory = IRide[];

export type TProfile = IUser;
export type TProfileResponse = IResponse<TProfile>;
export type TRideResponse = IResponse<IRide>;
export type TRideHistoryResponse = IResponse<TRideHistory>;