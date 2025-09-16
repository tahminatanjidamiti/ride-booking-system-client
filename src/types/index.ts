import type { ComponentType } from "react";

export type { ISendOtp, IVerifyOtp, ILogin } from "./auth.type";
export type { IUser, TRole, IsActive, ILocation } from "./user.type"
export type { RideStatus, IRide } from "./ride.type"
export type { IRideBooking, BOOKING_STATUS } from "./booking.type"
export type { IPayment, PAYMENT_STATUS, TPaymentActionPayload, TPaymentActionResponse, IPaymentResponse } from "./payment.type"
export type { IUserStats, IRideStats, IDriverStats, IBookingStats, IPaymentStats } from "./stats.type"
export type { TRideRequest, TRideHistory, TProfile, TProfileResponse, TRideResponse, TRideHistoryResponse } from "./rider.type"
export type { TDriverProfile, IDriverProfile } from "./driver.type"
export type { EmergencyContact, ISOSPayload, ISOSResponse } from "./sos.type"

// Pagination & filtering params
export type TQueryParams = { _id?: string; page?: number; total?: number; totalPage?: number; limit?: number; sort?: string; search?: string; role?: string; status?: string };

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta: TQueryParams;
}

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
  }[];
}



type ZodIssue = {
  code: string;
  expected: string;
  received: string;
  path: string[];
  message: string;
};

type ErrorSource = {
  path: string;
  message: string;
};

export interface IErrorResponse {
  success: boolean;
  message: string;
  errorSources?: ErrorSource[];
  err?: {
    issues: ZodIssue[];
    name: string;
  };
  stack?: string;
}