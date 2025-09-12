import { baseApi } from "@/redux/baseApi";
import type { IResponse, ISendOtp, IUser, IVerifyOtp, TQueryParams } from "@/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        data: userInfo,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["USER"],
    }),
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/user/register",
        method: "POST",
        data: userInfo,
      }),
      invalidatesTags: ["USER"],
    }),
    sendOtp: builder.mutation<IResponse<null>, ISendOtp>({
      query: (userInfo) => ({
        url: "/otp/send",
        method: "POST",
        data: userInfo,
      }),
    }),
    verifyOtp: builder.mutation<IResponse<null>, IVerifyOtp>({
      query: (userInfo) => ({
        url: "/otp/verify",
        method: "POST",
        data: userInfo,
      }),
    }),
    userInfo: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    // Users
    getUsers: builder.query<IResponse<IUser[]>, TQueryParams>({
      query: (params) => ({
        url: "/user/all-users",
        params,
      }),
      providesTags: ["USER"],
    }),

    // Update user 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateUser: builder.mutation({
      query: (updatedData) => ({
        url: "/user/update",
        method: "PATCH",
        data: updatedData, // send as FormData
      }),
      invalidatesTags: ["USER"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["USER"],
    }),

    changePassword: builder.mutation<IResponse<null>, { oldPassword: string; newPassword: string }>({
      query: (payload) => ({
        url: "/auth/change-password",
        method: "POST",
        data: payload,
      }),
    }),

    resetPassword: builder.mutation<IResponse<null>, { token: string; newPassword: string }>({
      query: (payload) => ({
        url: "/auth/reset-password",
        method: "POST",
        data: payload,
      }),
    }),

    forgotPassword: builder.mutation<IResponse<null>, { email: string }>({
      query: (payload) => ({
        url: "/auth/forgot-password",
        method: "POST",
        data: payload,
      }),
    }),

    setPassword: builder.mutation<IResponse<null>, { userId: string; password: string }>({
      query: (payload) => ({
        url: "/auth/set-password",
        method: "POST",
        data: payload,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useUserInfoQuery,
  useLogoutMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,
  useForgotPasswordMutation,
  useSetPasswordMutation,
} = authApi;