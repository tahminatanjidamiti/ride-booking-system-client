import type { TDriverProfile } from "./driver.type";
import type { IRide } from "./ride.type";
import type { IUser } from "./user.type";

export type BOOKING_STATUS = "PENDING" | "CANCEL" | "COMPLETE" | "FAILED";


export interface IRideBooking {
  _id?: string;
  rider: IUser;
  driver: TDriverProfile;
  ride: IRide;
  payment?: string;
  riderCount: number;
  status: BOOKING_STATUS;
  createdAt?: Date;
}