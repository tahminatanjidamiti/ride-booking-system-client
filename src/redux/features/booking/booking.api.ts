import { baseApi } from "@/redux/baseApi";
import type { BOOKING_STATUS, IResponse, IRideBooking } from "@/types";

export const bookingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBooking: builder.mutation({
            query: (data) => ({ url: "/booking", method: "POST", data: data }),
        }),

        getAllBookings: builder.query<IResponse<IRideBooking[]>, void>({
            query: () => ({ url: "/booking", method: "GET" }),
            providesTags: ["BOOKINGS"],
        }),

        getMyBookings: builder.query<IResponse<IRideBooking[]>, void>({
            query: () => ({ url: "/booking/my-bookings", method: "GET" }),
            providesTags: ["BOOKINGS"],
        }),

        getSingleBooking: builder.query<IResponse<IRideBooking>, string>({
            query: (id) => ({ url: `/booking/${id}`, method: "GET" }),
            providesTags: ["BOOKINGS"],
        }),
        updateBookingStatus: builder.mutation<IResponse<IRideBooking>, { bookingId: string; status: BOOKING_STATUS }>({
            query: ({ bookingId, status }) => ({
                url: `/booking/${bookingId}/status`,
                method: "PATCH",
                data: { status },
            }),
            invalidatesTags: ["BOOKINGS"],
        }),
    }),
});

export const {
    useCreateBookingMutation,
    useGetAllBookingsQuery,
    useGetMyBookingsQuery,
    useGetSingleBookingQuery,
    useUpdateBookingStatusMutation,
} = bookingApi;