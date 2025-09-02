import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API = process.env.NEXT_PUBLIC_API_AUTH || "http://localhost:4000"; // или 4010

export const baseQuery = fetchBaseQuery({
  baseUrl: API,
  credentials: "omit", // ВАЖНО: без cookies
  prepareHeaders: (h, { getState }) => {
    const token = getState()?.auth?.accessToken;
    if (token) h.set("Authorization", `Bearer ${token}`);
    h.set("Content-Type", "application/json");
    return h;
  },
});
