"use client";
import { Provider, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import store from "@/store";
import {
  hydrateAuth,
  setAuth,
  clearAuth,
  readAuthFromStorage,
  writeAuthToStorage,
} from "@/store/authSlice";

// Тихий рефреш один раз на монт
function useSilentRefreshOnce() {
  const [done, setDone] = useState(false);
  const started = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      try {
        const { accessToken, user } = readAuthFromStorage();
        // 1) локальная гидрация
        dispatch(hydrateAuth({ accessToken, user }));

        // 2) если токена нет — пробуем refresh по httpOnly cookie
        if (!accessToken) {
          const res = await fetch(
            process.env.NEXT_PUBLIC_API_AUTH + "/auth/refresh",
            { method: "POST", credentials: "include" }
          );

          if (res.ok) {
            const data = await res.json(); // { accessToken }
            if (data?.accessToken) {
              dispatch(setAuth({ accessToken: data.accessToken, user: user || null }));
              writeAuthToStorage({ accessToken: data.accessToken, user: user || null });
            }
          } else if (res.status === 401) {
            // refresh невалиден — чистим локальные следы
            dispatch(clearAuth());
            writeAuthToStorage({ accessToken: null, user: null });
          }
        }
      } catch {
        // на всякий случай — не ломаем рендер
      } finally {
        setDone(true);
      }
    })();
  }, [dispatch]);

  return done;
}

function AuthHydrator() {
  useSilentRefreshOnce();
  return null;
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthHydrator />
      {children}
    </Provider>
  );
}
