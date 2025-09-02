"use client";
import { Provider, useDispatch } from "react-redux";
import store from "@/store";
import { useEffect, useRef, useState } from "react";
import {
  hydrateAuth,
  setAuth,
  clearAuth,
  readAuthFromStorage,
  writeAuthToStorage,
} from "@/store/authSlice";

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
        dispatch(hydrateAuth({ accessToken, user }));

        if (!accessToken) {
          const res = await fetch(
            (process.env.NEXT_PUBLIC_API_AUTH || "http://localhost:4000") + "/auth/refresh",
            { method: "POST", credentials: "include" }
          );
          if (res.ok) {
            const data = await res.json();
            if (data?.accessToken) {
              dispatch(setAuth({ accessToken: data.accessToken, user: user || null }));
              writeAuthToStorage({ accessToken: data.accessToken, user: user || null });
            }
          } else if (res.status === 401) {
            dispatch(clearAuth());
            writeAuthToStorage({ accessToken: null, user: null });
          }
        }
      } catch {}
      finally { setDone(true); }
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
