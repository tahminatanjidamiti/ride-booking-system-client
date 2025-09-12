import { baseApi } from "@/redux/baseApi";
import type { IResponse, IRide, TQueryParams, TRideRequest } from "@/types";

export const rideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    requestRide: builder.mutation<IResponse<IRide>, TRideRequest>({
      query: (data) => ({ url: "/rides/request", method: "POST", data: data }),
      invalidatesTags: ["RIDES"],
    }),
    getAllRides: builder.query<IResponse<IRide[]>, TQueryParams>({
          query: (params) => ({
            url: "/rides",
            params: params,
          }),
          providesTags: ["RIDES"],
        }),
    getRideHistory: builder.query<IResponse<IRide[]>, void>({
      query: () => ({ url: "/rides/my-rides-history", method: "GET" }),
      providesTags: ["RIDES"],
    }),
    cancelRide: builder.mutation<IResponse<IRide>, string>({
      query: (rideId) => ({ url: `/rides/${rideId}/cancel`, method: "PATCH" }),
      invalidatesTags: ["RIDES"],
    }),
  }),
});

export const {
    useRequestRideMutation,
    useGetRideHistoryQuery,
    useCancelRideMutation,
    useGetAllRidesQuery,
} = rideApi;