// src/store/api/baseApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||      // основной
  process.env.NEXT_PUBLIC_API_PUBLIC ||   // если ты так называл
  "http://localhost:4000";                // фолбэк

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include", // чтобы refresh-cookie ходила
    fetchFn: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.accessToken;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  keepUnusedDataFor: 60,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  tagTypes: [
    "Cities","Categories","Masters","Companies","Orders","Offers",
    "Reviews","Comments","Services","Users","Threads","Messages",
  ],
  endpoints: (build) => ({
    // справочники
    getCities: build.query({ query: () => "/cities", providesTags: ["Cities"] }),
    getCategories: build.query({ query: () => "/categories", providesTags: ["Categories"] }),
    getServices: build.query({
      query: (p = {}) => {
        const s = new URLSearchParams();
        if (p.categoryId != null && p.categoryId !== "") s.set("categoryId", String(p.categoryId));
        if (p.subCategoryId != null && p.subCategoryId !== "") s.set("subCategoryId", String(p.subCategoryId));
        const qs = s.toString();
        return qs ? `/services?${qs}` : "/services";
      },
      providesTags: ["Services"],
    }),

    // мастера (совместимо с нашим сервером)
    getMasters: build.query({
      query: (p = {}) => {
        const s = new URLSearchParams();
        if (p.cityId != null && p.cityId !== "") s.set("cityId", String(p.cityId));
        if (p.categoryId != null && p.categoryId !== "") s.set("categoryId", String(p.categoryId));
        if (p.subCategoryId != null && p.subCategoryId !== "") s.set("subCategoryIds_like", String(p.subCategoryId));
        if (p.q) s.set("q", String(p.q));
        const qs = s.toString();
        return qs ? `/masters?${qs}` : "/masters";
      },
      providesTags: ["Masters"],
    }),
    getMasterById: build.query({
      query: (id) => `/masters/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Masters", id }],
    }),
    getMasterReviews: build.query({
      query: (masterId) =>
        `/reviews?targetType=master&targetId=${masterId}`,
      providesTags: (_r, _e, masterId) => [{ type: "Reviews", id: masterId }],
    }),

    // компании/заказы/офферы
    getCompanies: build.query({ query: () => "/companies", providesTags: ["Companies"] }),
    getOrders: build.query({ query: () => "/orders", providesTags: ["Orders"] }),
    getOffersByOrder: build.query({
      query: (orderId) => ({ url: "/offers", params: { orderId } }),
      providesTags: ["Offers"],
    }),

    // отзывы/комменты
    getReviews: build.query({ query: () => "/reviews", providesTags: ["Reviews"] }),
    getComments: build.query({ query: () => "/comments", providesTags: ["Comments"] }),

    // пользователи
    getUsers: build.query({ query: () => "/users", providesTags: ["Users"] }),

    // чат (пока бэк не нужен — можно моки позже добавить)
    getThreads: build.query({
      query: ({ userId }) => ({ url: "/threads", params: { userId, _sort: "lastTs", _order: "desc" } }),
      providesTags: ["Threads"],
    }),
    getThreadById: build.query({
      query: (threadId) => `/threads/${threadId}`,
      providesTags: (_r, _e, id) => [{ type: "Threads", id }],
    }),
    getMessages: build.query({
      query: (threadId) => ({ url: "/messages", params: { threadId, _sort: "createdAt", _order: "asc" } }),
      providesTags: (_r, _e, id) => [{ type: "Messages", id }],
    }),
    sendMessage: build.mutation({
      query: ({ threadId, from, text }) => ({
        url: "/messages",
        method: "POST",
        body: { threadId, from, text, createdAt: new Date().toISOString() },
      }),
      invalidatesTags: (_r, _e, { threadId }) => [
        { type: "Messages", id: threadId },
        { type: "Threads", id: threadId },
      ],
    }),
    createThread: build.mutation({
      query: ({ userId, peerId }) => ({
        url: "/threads",
        method: "POST",
        body: { userId, peerId, lastTs: new Date().toISOString() },
      }),
      invalidatesTags: ["Threads"],
    }),
  }),
});

export const {
  useGetCitiesQuery,
  useGetCategoriesQuery,
  useGetMastersQuery,
  useGetCompaniesQuery,
  useGetOrdersQuery,
  useGetOffersByOrderQuery,
  useGetReviewsQuery,
  useGetCommentsQuery,
  useGetServicesQuery,
  useGetUsersQuery,
  useGetMasterByIdQuery,
  useGetMasterReviewsQuery,
  useGetThreadsQuery,
  useGetThreadByIdQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useCreateThreadMutation,
} = baseApi;
