import { baseApi } from "@/redux/baseApi";
import type { IDriverStats, IResponse, TDriverProfile, TQueryParams } from "@/types";

export const driverApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createDriver: builder.mutation<IResponse<TDriverProfile>, TDriverProfile>({
            query: (data) => ({ url: "/drivers/create", method: "POST", data: data }),
            invalidatesTags: ["USER"],
        }),
        // Drivers
        getAllDrivers: builder.query<IResponse<TDriverProfile[]>, TQueryParams | void>({
            query: (params) => ({
                url: "/drivers",
                params,
            }),
            providesTags: ["DRIVER"],
        }),
        getDriverMe: builder.query({
            query: () => ({ url: "/drivers/me", method: "GET" }),
            providesTags: ["DRIVER"],
        }),
        getDriverStatsMe: builder.query<IResponse<IDriverStats>, void>({
            query: () => ({ url: "/drivers/stats/me", method: "GET" }),
            providesTags: ["DRIVER"],
        }),
        updateDriverStatus: builder.mutation<IResponse<TDriverProfile>, { driverId: string; isOnline?: boolean; approved?: boolean }>({
            query: ({ driverId, ...payload }) => ({
                url: `/drivers/${driverId}/status`,
                method: "PATCH",
                data: payload,
            }),
            invalidatesTags: ["DRIVER"],
        }),
        getNearestDrivers: builder.query<
            IResponse<TDriverProfile[]>,
            { lat: number; lng: number; radius?: number }
        >({
            query: ({ lat, lng, radius = 5 }) => ({
                url: "/drivers/nearest",
                method: "GET",
                params: { lat, lng, radius },
            }),
            providesTags: ["DRIVER"],
        }),
    }),
});

export const {
    useCreateDriverMutation,
    useUpdateDriverStatusMutation,
    useGetDriverStatsMeQuery,
    useGetAllDriversQuery,
    useGetNearestDriversQuery,
    useGetDriverMeQuery,
} = driverApi;