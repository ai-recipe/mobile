import { setIsOnboarded } from "@/store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

const useInitApp = () => {
  const dispatch = useDispatch();

  const initOnboardedStatus = useCallback(async () => {
    const onboarded = await AsyncStorage.getItem("isOnboarded");
    console.log("initOnboardedStatus", onboarded, typeof onboarded);
    if (onboarded == "true") {
      dispatch(setIsOnboarded(true));
    }
  }, [dispatch]);
  useEffect(() => {
    initOnboardedStatus();
  }, [initOnboardedStatus]);
};

export default useInitApp;
