import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type {
  IBookingStats,
  IPaymentStats,
  IUserStats,
  IRideStats,
  IDriverStats,
} from "@/types/stats.type";

export const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookingStats: builder.query<IResponse<IBookingStats>, void>({
      query: () => ({ url: "/stats/booking", method: "GET" }),
      providesTags: ["BOOKINGS"],
    }),
    getPaymentStats: builder.query<IResponse<IPaymentStats>, void>({
      query: () => ({ url: "/stats/payment", method: "GET" }),
      providesTags: ["PAYMENTS"],
    }),
    getUserStats: builder.query<IResponse<IUserStats>, void>({
      query: () => ({ url: "/stats/user", method: "GET" }),
      providesTags: ["USER"],
    }),
    getRideStats: builder.query<IResponse<IRideStats>, void>({
      query: () =>({ url: "/stats/ride", method: "GET" }),
      providesTags: ["RIDES"],
    }),
    getDriverStats: builder.query<IResponse<IDriverStats>, void>({
      query: () => ({ url: "/stats/driver", method: "GET" }),
      providesTags: ["DRIVER"],
    }),
  }),
});

export const {
  useGetBookingStatsQuery,
  useGetPaymentStatsQuery,
  useGetRideStatsQuery,
  useGetDriverStatsQuery,
  useGetUserStatsQuery,
} = statsApi;