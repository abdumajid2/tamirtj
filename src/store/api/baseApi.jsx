// src/store/api/baseApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_PUBLIC || "http://localhost:4000",
    credentials: "include",

    fetchFn: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    prepareHeaders: (h, { getState }) => {
      const token = getState()?.auth?.accessToken;
      if (token) h.set("Authorization", `Bearer ${token}`);
      return h;
    },
  }),
  keepUnusedDataFor: 60,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  tagTypes: [
    "Cities",
    "Categories",
    "Masters",
    "Companies",
    "Orders",
    "Offers",
    "Reviews",
    "Comments",
    "Services",
    "Users",
  ],
  endpoints: (build) => ({
    // --- справочники
    getCities: build.query({
      query: () => "/cities",
      providesTags: ["Cities"],
    }),

    getCategories: build.query({
      query: () => "/categories",
      providesTags: ["Categories"],
    }),

    getServices: build.query({
      query: () => "/services",
      providesTags: ["Services"],
    }),

     getMasterById: build.query({
  query: (id) => `/masters/${id}`,
  providesTags: (r, e, id) => [{ type: "Masters", id }],
}),

    // src/store/api/baseApi.js (фрагмент)
getMasters: build.query({
  query: (p = {}) => {
    const s = new URLSearchParams();

    // фильтры (ничего лишнего — без _page/_limit/_sort)
    if (p.cityId != null && p.cityId !== "") {
      s.set("cityId", String(p.cityId));
    }
    if (p.categoryId != null && p.categoryId !== "") {
      s.set("categoryId", String(p.categoryId));
    }
    // для массивов json-server обычно ищется через *_like
    if (p.subCategoryId != null && p.subCategoryId !== "") {
      s.set("subCategoryIds_like", String(p.subCategoryId));
    }
    if (p.q) {
      s.set("q", String(p.q));
    }

    const qs = s.toString();
    // если фильтров нет — вернём весь список
    return qs ? `/masters?${qs}` : "/masters";
  },
  providesTags: ["Masters"],
}),


    // --- компании
    getCompanies: build.query({
      query: (()=> "/companies"),
      providesTags: ["Companies"],
    }),

    // --- заказы
    getOrders: build.query({
      query : (()=> "/orders"),
      providesTags: ["Orders"],
    }),

    // --- офферы конкретного заказа
    getOffersByOrder: build.query({
      query: (()=> "/offers"),
      providesTags: ["Offers"],
        
    }),

    // --- отзывы по цели (требует targetType + targetId)
    getReviews: build.query({
      query: (()=> "/reviews"),
      providesTags: ["Reviews"],
    }),

    // --- пользователи (для авторов отзывов)
    getUsers: build.query({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    // --- комментарии к конкретному отзыву
    getComments: build.query({
      query: (()=> "/comments"),
      providesTags: ["Comments"],
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
} = baseApi;
