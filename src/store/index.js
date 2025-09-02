import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/store/api/authApi";
import { baseApi } from "@/store/api/baseApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, baseApi.middleware),
});

// экспорт по умолчанию и по имени — чтобы любой импорт сработал
export default store;
