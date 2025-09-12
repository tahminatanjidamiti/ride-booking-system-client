export type TRole = "ADMIN" | "RIDER" | "DRIVER";

export type IsActive = "ACTIVE" | "BLOCKED" | "INACTIVE";

export interface ILocation {
  lat: number;
  lng: number;
  formattedAddress?: string;
}
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  picture?: string;
  address?: string;
  role: TRole;
  password?: string;
  location?: ILocation;
  isActive?: IsActive;
  isVerified?: boolean;
  isDeleted?: boolean;
}