"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = { accessToken: null, user: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth(state, action) {
      state.accessToken = action.payload?.accessToken ?? null;
      state.user = action.payload?.user ?? null;
    },
    setAuth(state, action) {
      state.accessToken = action.payload?.accessToken ?? null;
      state.user = action.payload?.user ?? null;
    },
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const { hydrateAuth, setAuth, clearAuth } = authSlice.actions;
// алиас под старый код:
export const setCredentials = authSlice.actions.setAuth;

export default authSlice.reducer;

// helpers (не падают на SSR)
export function readAuthFromStorage() {
  if (typeof window === "undefined") return { accessToken: null, user: null };
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return { accessToken: null, user: null };
    const parsed = JSON.parse(raw);
    return {
      accessToken: parsed?.accessToken ?? null,
      user: parsed?.user ?? null,
    };
  } catch {
    return { accessToken: null, user: null };
  }
}

export function writeAuthToStorage(payload) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("auth", JSON.stringify({
      accessToken: payload?.accessToken ?? null,
      user: payload?.user ?? null,
    }));
  } catch {}
}
