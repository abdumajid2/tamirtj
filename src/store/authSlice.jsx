// src/store/authSlice.jsx
import { createSlice } from "@reduxjs/toolkit";

/** Безопасное чтение из LS */
export function readAuthFromStorage() {
  try {
    // прямой ключ
    const direct = localStorage.getItem("accessToken");
    let accessToken = direct && direct !== "null" && direct !== "undefined" ? direct : null;
    let user = null;

    // объектом
    const authRaw = localStorage.getItem("auth");
    if (authRaw) {
      try {
        const p = JSON.parse(authRaw);
        accessToken = p?.accessToken ?? accessToken;
        user = p?.user ?? user;
      } catch {}
    }

    // persist:root (если есть)
    const rootRaw = localStorage.getItem("persist:root");
    if (rootRaw) {
      try {
        const root = JSON.parse(rootRaw);
        const slice = root?.auth;
        if (typeof slice === "string") {
          const p = JSON.parse(slice);
          accessToken = p?.accessToken ?? accessToken;
          user = p?.user ?? user;
        } else if (slice && typeof slice === "object") {
          accessToken = slice?.accessToken ?? accessToken;
          user = slice?.user ?? user;
        }
      } catch {}
    }

    return { accessToken: accessToken || null, user: user || null };
  } catch {
    return { accessToken: null, user: null };
  }
}

/** Запись в LS (в 2 формата, чтобы точно перекрыть все места) */
export function writeAuthToStorage({ accessToken, user }) {
  try {
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    else localStorage.removeItem("accessToken");

    localStorage.setItem("auth", JSON.stringify({ accessToken: accessToken || null, user: user || null }));

    // если где-то используется redux-persist
    const rootRaw = localStorage.getItem("persist:root");
    if (rootRaw) {
      try {
        const root = JSON.parse(rootRaw);
        root.auth = JSON.stringify({ accessToken: accessToken || null, user: user || null });
        localStorage.setItem("persist:root", JSON.stringify(root));
      } catch {}
    }
  } catch {}
}

/** Полная очистка всех возможных ключей */
export function nukeAuthStorage() {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("auth");

    const rootRaw = localStorage.getItem("persist:root");
    if (rootRaw) {
      try {
        const root = JSON.parse(rootRaw);
        // Вариант 1: занулить слайс
        root.auth = JSON.stringify({ accessToken: null, user: null });
        localStorage.setItem("persist:root", JSON.stringify(root));
      } catch {
        // если не получилось — просто убрать полностью
        localStorage.removeItem("persist:root");
      }
    }
  } catch {}
}

const initial = {
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initial,
  reducers: {
    setCredentials(state, action) {
      state.accessToken = action.payload?.accessToken || null;
      state.user = action.payload?.user || null;
    },
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
    },
    // удобный экшен для гидрации при старте
    hydrateAuth(state, action) {
      state.accessToken = action.payload?.accessToken || null;
      state.user = action.payload?.user || null;
    },
  },
});

export const { setCredentials, clearAuth, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
