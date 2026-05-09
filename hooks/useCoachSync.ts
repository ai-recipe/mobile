import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setInsight, setActiveUserCount } from "@/store/slices/coachSlice";
import type { CoachInsight } from "@/api/coach";
import { postHeartbeat } from "@/api/coach";

const HEARTBEAT_INTERVAL_MS = 30_000;

/**
 * useCoachSync
 *
 * Call this once inside the Coach tab screen (or its parent layout).
 * It:
 *   1. Opens a Socket.IO connection to the /coach namespace with JWT auth.
 *   2. Listens for `community:active_count` → dispatches setActiveUserCount.
 *   3. Listens for `coach:insight_updated`  → dispatches setInsight.
 *   4. Fires an immediate heartbeat on mount, then every 30 s.
 *   5. Cleans up the socket and interval when the component unmounts or
 *      the auth token changes (e.g. logout).
 */
export function useCoachSync() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.accessToken);
  // Keep a stable ref to the socket so the cleanup closure always sees it
  const socketRef = useRef<ReturnType<
    typeof import("socket.io-client").io
  > | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Don't connect until we have a valid token (guards anonymous users too)
    if (!token) return;

    const { io } =
      require("socket.io-client") as typeof import("socket.io-client");

    const socket = io(`${process.env.EXPO_PUBLIC_BASE_URL}/coach`, {
      transports: ["websocket", "polling"],
      auth: { token },
    });

    socketRef.current = socket;

    socket.on("community:active_count", ({ count }: { count: number }) => {
      dispatch(setActiveUserCount(count));
    });

    socket.on("coach:insight_updated", (insight: CoachInsight) => {
      dispatch(setInsight(insight));
    });

    // Register this user as "active now" immediately on connect,
    // then repeat every 30 s so the community counter stays current.
    const sendHeartbeat = () => {
      postHeartbeat().catch(() => {
        // Non-critical — next interval will retry
      });
    };

    sendHeartbeat();
    heartbeatRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

    return () => {
      socket.disconnect();
      socketRef.current = null;
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    };
  }, [token, dispatch]);
}
