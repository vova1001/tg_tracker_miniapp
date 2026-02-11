import { useEffect, useState } from "react";
import { getInitData } from "../telegram/telegram";
import { api } from "../api/client";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function authenticate() {
      try {
        const initData = getInitData();
        if (!initData) throw new Error("Not opened in Telegram");

        const data = await api("/auth", {
          method: "POST",
          body: JSON.stringify({ initData }),
        });

        setUser(data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    authenticate();
  }, []);

  return { user, loading };
}
