import { baseApi } from "@/redux/baseApi";
import type { IPaymentResponse, IResponse, TPaymentActionPayload, TPaymentActionResponse } from "@/types";


export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    initPayment: builder.mutation<IPaymentResponse, { bookingId: string }>({
      query: ({ bookingId }) => ({
        url: `/payment/init-payment/${bookingId}`,
        method: "POST",
      }),
      invalidatesTags: ["PAYMENTS"],
    }),

    successPayment: builder.mutation<IResponse<TPaymentActionResponse>, TPaymentActionPayload>({
      query: (data) => ({ url: "/payment/success", method: "POST", data: data }),
      invalidatesTags: ["PAYMENTS"],
    }),

    failPayment: builder.mutation<IResponse<TPaymentActionResponse>, TPaymentActionPayload>({
      query: (data) => ({ url: "/payment/fail", method: "POST", data: data }),
      invalidatesTags: ["PAYMENTS"],
    }),

    cancelPayment: builder.mutation<IResponse<TPaymentActionResponse>, TPaymentActionPayload>({
      query: (data) => ({ url: "/payment/cancel", method: "POST", data: data }),
      invalidatesTags: ["PAYMENTS"],
    }),

    getInvoice: builder.query<IResponse<{ url: string }>, string>({
      query: (paymentId) => ({
        url: `/payment/invoice/${paymentId}`,
        method: "GET",
      }),
      providesTags: ["PAYMENTS"],
    }),
  }),
});

export const {
  useInitPaymentMutation,
  useSuccessPaymentMutation,
  useFailPaymentMutation,
  useCancelPaymentMutation,
  useGetInvoiceQuery,
} = paymentApi;