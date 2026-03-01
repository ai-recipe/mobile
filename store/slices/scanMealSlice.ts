import { uploadScanImage } from "@/api/scanMeal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER = "https://api.recipetrack.tech";

export interface ScanResult {
  foodName?: string;
  calories?: number;
  proteinGrams?: number;
  carbsGrams?: number;
  fatGrams?: number;
  quantity?: number;
  unit?: string;
  [key: string]: unknown;
}

export type ScanStatus =
  | "idle"
  | "connecting"
  | "uploading"
  | "scanning"
  | "completed"
  | "error";

interface ScanMealState {
  status: ScanStatus;
  progress: number;
  progressMessage: string;
  scanId: string | null;
  result: ScanResult | null;
  error: string | null;
  capturedPhotoUri: string | null;
}

const initialState: ScanMealState = {
  status: "idle",
  progress: 0,
  progressMessage: "",
  scanId: null,
  result: null,
  error: null,
  capturedPhotoUri: null,
};

// -------------------------------------------------------------------
// Slice — all synchronous state mutations live here
// -------------------------------------------------------------------
const scanMealSlice = createSlice({
  name: "scanMeal",
  initialState,
  reducers: {
    setScanStatus: (state, action: PayloadAction<ScanStatus>) => {
      state.status = action.payload;
    },
    setScanProgress: (
      state,
      action: PayloadAction<{ progress: number; message: string }>,
    ) => {
      state.progress = action.payload.progress;
      state.progressMessage = action.payload.message;
    },
    setScanId: (state, action: PayloadAction<string>) => {
      state.scanId = action.payload;
    },
    setResult: (state, action: PayloadAction<ScanResult>) => {
      state.result = action.payload;
      state.status = "completed";
      state.progress = 100;
      state.progressMessage = "";
    },
    setScanError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = "error";
    },
    setCapturedPhotoUri: (state, action: PayloadAction<string>) => {
      state.capturedPhotoUri = action.payload;
    },
    resetScan: () => initialState,
  },
});

export const {
  setScanStatus,
  setScanProgress,
  setScanId,
  setResult,
  setScanError,
  setCapturedPhotoUri,
  resetScan,
} = scanMealSlice.actions;

// -------------------------------------------------------------------
// Module-level socket — not stored in Redux (not serializable)
// -------------------------------------------------------------------
let _socket: Socket | null = null;

export const disconnectScan = () => {
  _socket?.disconnect();
  _socket = null;
};

// -------------------------------------------------------------------
// Thunk — defined after actions are exported to avoid circular refs
// -------------------------------------------------------------------
export const startScanAsync = createAsyncThunk<void, string>(
  "scanMeal/startScan",
  async (photoUri, { dispatch }) => {
    const token = await AsyncStorage.getItem("token");

    dispatch(setScanStatus("connecting"));
    dispatch(setScanProgress({ progress: 0, message: "Connecting..." }));

    return new Promise<void>((resolve, reject) => {
      const socket = io(`${SOCKET_SERVER}/scan`, {
        transports: ["websocket", "polling"],
        auth: { token },
      });
      _socket = socket;

      socket.on("connect", async () => {
        try {
          dispatch(setScanStatus("uploading"));
          dispatch(
            setScanProgress({ progress: 5, message: "Uploading image..." }),
          );

          const uploadRes = await uploadScanImage(photoUri);
          const scanId = uploadRes.data?.scanId;

          dispatch(setScanId(scanId));
          dispatch(setScanStatus("scanning"));
          dispatch(
            setScanProgress({ progress: 10, message: "Analyzing meal..." }),
          );

          socket.emit("subscribe:scan", { scanId });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Upload failed";
          dispatch(setScanError(message));
          socket.disconnect();
          _socket = null;
          reject(new Error(message));
        }
      });

      socket.on(
        "scan:progress",
        (data: { state: string; progress: number; message: string }) => {
          dispatch(
            setScanProgress({ progress: data.progress, message: data.message }),
          );
        },
      );

      socket.on("scan:completed", (data: { result: ScanResult }) => {
        dispatch(setResult(data.result));
        socket.disconnect();
        _socket = null;
        resolve();
      });

      socket.on("scan:error", (data: { code: string; message: string }) => {
        dispatch(setScanError(data.message));
        socket.disconnect();
        _socket = null;
        reject(new Error(data.message));
      });

      socket.on("connect_error", (err: Error) => {
        dispatch(setScanError(`Connection failed: ${err.message}`));
        socket.disconnect();
        _socket = null;
        reject(err);
      });
    });
  },
);

export default scanMealSlice.reducer;
