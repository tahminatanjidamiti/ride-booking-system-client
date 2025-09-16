import type { ISOSPayload, ISOSResponse } from "@/types";
import type { ILocation } from "@/hooks/useGeolocation";
import { baseApi } from "@/redux/baseApi";


// ----------------- SOS API -----------------
export const sosApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSOS: builder.mutation<ISOSResponse, ISOSPayload>({
      query: (payload) => ({
        url: "/sos",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["SOS"],
    }),
    updateSOS: builder.mutation<ISOSResponse, { id: string; location: ILocation }>({
      query: ({ id, location }) => ({
        url: `/sos/${id}/update`,
        method: "PATCH",
        data: location,
      }),
    }),
    endSOS: builder.mutation<ISOSResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/sos/${id}/end`,
        method: "PATCH",
      }),
    }),
  }),
});

export const { useCreateSOSMutation, useUpdateSOSMutation, useEndSOSMutation } = sosApi;