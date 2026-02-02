import { AppDispatch } from "@/store";
import { initI18n } from "@/store/slices/appSlice";
import { setIsOnboarded } from "@/store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

const useInitApp = () => {
  const dispatch = useDispatch<AppDispatch>();

  const initOnboardedStatus = useCallback(async () => {
    const onboarded = await AsyncStorage.getItem("isOnboarded");
    console.log("initOnboardedStatus", onboarded, typeof onboarded);
    if (onboarded === "true") {
      dispatch(setIsOnboarded(true));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(initI18n());
    initOnboardedStatus();
  }, [dispatch, initOnboardedStatus]);
};

export default useInitApp;
