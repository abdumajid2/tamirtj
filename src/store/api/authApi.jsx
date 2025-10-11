// src/store/api/authApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/store/baseQuery";
import { setCredentials, clearAuth, writeAuthToStorage } from "@/store/authSlice";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: ["Auth","Users"],
  endpoints: (build) => ({
    register: build.mutation({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ accessToken: data.accessToken, user: data.user }));
          writeAuthToStorage({ accessToken: data.accessToken, user: data.user });
        } catch {}
      },
      invalidatesTags: ["Auth","Users"],
    }),
    login: build.mutation({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ accessToken: data.accessToken, user: data.user }));
          writeAuthToStorage({ accessToken: data.accessToken, user: data.user });
        } catch {}
      },
      invalidatesTags: ["Auth","Users"],
    }),
    me: build.query({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
    logout: build.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try { await queryFulfilled; } catch {}
        dispatch(clearAuth());
        writeAuthToStorage({ accessToken: null, user: null });
      },
      invalidatesTags: ["Auth","Users"],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useMeQuery, useLogoutMutation } = authApi;
