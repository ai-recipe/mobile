import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openPurchaseSuccess } from "@/store/slices/modalSlice";
import { Analytics } from "@/analytics";
import {
  activateAppleIAPPurchase,
  activateGooglePlayPurchase,
  clearSubscriptionError,
  fetchSubscriptionStatus,
  selectIsProActive,
  selectShouldShowPaywallBanners,
  setIsPurchasing,
} from "@/store/slices/subscriptionSlice";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";
import * as RNIap from "react-native-iap";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PlanId = "monthly" | "yearly";

export const PLANS: { MONTHLY: PlanId; YEARLY: PlanId } = {
  MONTHLY: "monthly",
  YEARLY: "yearly",
};

export interface PlanInfo {
  displayPrice: string;
  price: number;
  currency: string;
  offerToken: string | null;
  hasFreeTrial: boolean;
  trialDescription: string | null;
}

const EMPTY_PLAN: PlanInfo = {
  displayPrice: "...",
  price: 0,
  currency: "",
  offerToken: null,
  hasFreeTrial: false,
  trialDescription: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseProducts(products: RNIap.Product[]): Record<PlanId, PlanInfo> {
  const result: Record<PlanId, PlanInfo> = {
    monthly: { ...EMPTY_PLAN },
    yearly: { ...EMPTY_PLAN },
  };

  if (Platform.OS === "ios") {
    const monthly = products.find((p) => p.id === "pro_monthly") as any;
    const yearly = products.find((p) => p.id === "pro_yearly") as any;

    if (monthly) {
      const hasFreeTrial = !!monthly.introductoryPriceIOS;
      result.monthly = {
        displayPrice: monthly.displayPrice,
        price: monthly.price,
        currency: monthly.currency,
        offerToken: null,
        hasFreeTrial,
        trialDescription: hasFreeTrial
          ? `${monthly.introductoryPriceNumberOfPeriodsIOS} ${monthly.introductoryPriceSubscriptionPeriodIOS} free`
          : null,
      };
    }

    if (yearly) {
      const hasFreeTrial = !!yearly.introductoryPriceIOS;
      result.yearly = {
        displayPrice: yearly.displayPrice,
        price: yearly.price,
        currency: yearly.currency,
        offerToken: null,
        hasFreeTrial,
        trialDescription: hasFreeTrial
          ? `${yearly.introductoryPriceNumberOfPeriodsIOS} ${yearly.introductoryPriceSubscriptionPeriodIOS} free`
          : null,
      };
    }

    return result;
  }

  // Android
  const proProduct = products.find((p) => p.id === "pro") as any;
  if (!proProduct) return result;

  const offers: any[] = proProduct.subscriptionOffers ?? [];

  // Monthly
  const monthlyOffer = offers.find((o) => o.id === "monthly");
  if (monthlyOffer) {
    result.monthly = {
      displayPrice: monthlyOffer.displayPrice,
      price: monthlyOffer.price,
      currency: monthlyOffer.currency,
      offerToken: monthlyOffer.offerTokenAndroid ?? null,
      hasFreeTrial: false,
      trialDescription: null,
    };
  }

  // Yearly — prefer the trial offer when available
  const trialOffer = offers.find((o) => o.id === "trial-yearly");
  const plainYearlyOffer = offers.find(
    (o) => o.id === "yearly" && o.paymentMode !== "free-trial",
  );
  const bestYearly = trialOffer ?? plainYearlyOffer;

  if (bestYearly) {
    const phases: any[] =
      bestYearly.pricingPhasesAndroid?.pricingPhaseList ?? [];
    const yearlyPhase = phases.find((p) => p.billingPeriod === "P1Y");
    const trialPhase = phases.find((p) => p.priceAmountMicros === "0");

    const displayPrice = yearlyPhase?.formattedPrice ?? bestYearly.displayPrice;
    const price = yearlyPhase
      ? Number(yearlyPhase.priceAmountMicros) / 1_000_000
      : bestYearly.price;

    result.yearly = {
      displayPrice,
      price,
      currency: yearlyPhase?.priceCurrencyCode ?? bestYearly.currency,
      offerToken: bestYearly.offerTokenAndroid ?? null,
      hasFreeTrial: !!trialOffer,
      trialDescription: trialPhase ? "1 month free" : null,
    };
  }

  return result;
}

const SKUS_BY_PLATFORM = {
  android: ["pro"],
  ios: ["pro_monthly", "pro_yearly"],
};
// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useSubscription = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading, isPurchasing, error } = useAppSelector(
    (s) => s.subscription,
  );
  const isProOrTrial = useAppSelector(selectIsProActive);
  const shouldShowPaywallBanners = useAppSelector(
    selectShouldShowPaywallBanners,
  );

  const [products, setProducts] = useState<RNIap.Product[]>([]);
  const [isRestoring, setIsRestoring] = useState(false);
  const [planInfo, setPlanInfo] = useState<Record<PlanId, PlanInfo>>({
    monthly: { ...EMPTY_PLAN },
    yearly: { ...EMPTY_PLAN },
  });

  // Keep a ref so the purchase listener can read the current plan without
  // needing to be recreated every time selectedPlan changes.
  const currentPlanRef = useRef<PlanId>(PLANS.YEARLY);

  // ─── Fetch products ──────────────────────────────────────────────────────

  const initConnection = useCallback(async () => {
    try {
      await RNIap.initConnection();
      fetchProducts();
    } catch (e) {
      console.warn("[useSubscription] initConnection error", e);
    }
  }, []);

  useEffect(() => {
    initConnection();
  }, [initConnection]);

  const fetchProducts = useCallback(async () => {
    try {
      const fetched = await RNIap.fetchProducts({
        skus: SKUS_BY_PLATFORM[Platform.OS],
        type: "subs",
      });
      console.log("fetched", JSON.stringify(fetched, null, 2));
      setProducts(fetched as any);
      setPlanInfo(parseProducts(fetched as any));
    } catch (e) {
      console.warn("[useSubscription] fetchProducts error", e);
    }
  }, []);

  // ─── Purchase listener ───────────────────────────────────────────────────

  useEffect(() => {
    const purchaseListener = RNIap.purchaseUpdatedListener(async (purchase) => {
      try {
        if (Platform.OS === "android" && purchase.purchaseToken) {
          await RNIap.finishTransaction({ purchase, isConsumable: false });
          await dispatch(
            activateGooglePlayPurchase({
              purchaseToken: purchase.purchaseToken,
              basePlanId: currentPlanRef.current,
            }),
          );
          await dispatch(fetchSubscriptionStatus() as any);
          router.push("/(protected)/(tabs)/");
          dispatch(openPurchaseSuccess());
        } else if (Platform.OS === "ios" && purchase.purchaseToken) {
          await RNIap.finishTransaction({ purchase, isConsumable: false });
          await dispatch(
            activateAppleIAPPurchase({
              productId: purchase.productId,
              purchaseToken: purchase.purchaseToken,
            }),
          );
          await dispatch(fetchSubscriptionStatus() as any);
          router.push("/(protected)/(tabs)/");
          dispatch(openPurchaseSuccess());
        }
      } catch (e) {
        console.warn("[useSubscription] finishTransaction error", e);
        dispatch(setIsPurchasing(false));
      }
    });

    const errorListener = RNIap.purchaseErrorListener((e) => {
      if ((e as any)?.code !== "E_USER_CANCELLED") {
        console.warn("[useSubscription] purchaseError", e);
      }
      dispatch(setIsPurchasing(false));
    });

    return () => {
      purchaseListener.remove();
      errorListener.remove();
    };
  }, [dispatch]);

  // ─── Actions ─────────────────────────────────────────────────────────────

  const getPlanPrice = useCallback(
    (planId: PlanId) => planInfo[planId]?.displayPrice ?? "...",
    [planInfo],
  );

  const getPlanInfo = useCallback(
    (planId: PlanId): PlanInfo => planInfo[planId] ?? EMPTY_PLAN,
    [planInfo],
  );

  const purchase = useCallback(
    async (planId: PlanId) => {
      const info = planInfo[planId];
      if (!info) return;

      currentPlanRef.current = planId;
      dispatch(setIsPurchasing(true));
      dispatch(clearSubscriptionError());

      try {
        if (Platform.OS === "android") {
          if (!info.offerToken) throw new Error("No offer token available");
          await RNIap.requestPurchase({
            request: {
              android: {
                skus: ["pro"],
                subscriptionOffers: [
                  { sku: "pro", offerToken: info.offerToken },
                ],
              },
            },
            type: "subs",
          });
        } else {
          const sku = planId === "monthly" ? "pro_monthly" : "pro_yearly";
          await RNIap.requestPurchase({
            request: { ios: { sku } },
            type: "subs",
          });
        }
      } catch (e: any) {
        if (e?.code !== "E_USER_CANCELLED") {
          console.warn("[useSubscription] requestSubscription error", e);
        }
        dispatch(setIsPurchasing(false));
      }
    },
    [dispatch, planInfo],
  );

  const restore = useCallback(async () => {
    Analytics.iapRestoreStarted();
    setIsRestoring(true);
    dispatch(clearSubscriptionError());
    try {
      await RNIap.restorePurchases();
      const result = await dispatch(fetchSubscriptionStatus() as any);
      const status = result?.payload;
      const isActive =
        status &&
        (status.tier === "pro" || status.tier === "trial") &&
        status.isActive &&
        (!status.currentPeriodEnd ||
          new Date(status.currentPeriodEnd) > new Date());

      Analytics.iapRestoreCompleted(!!isActive);

      if (isActive) {
        router.push("/(protected)/(tabs)/");
        dispatch(openPurchaseSuccess());
      } else {
        Alert.alert(
          "No Subscription Found",
          "No active subscription found. Please contact support if you believe this is an error.",
        );
      }
    } catch (e) {
      console.warn("[useSubscription] restorePurchases error", e);
      Analytics.iapRestoreCompleted(false);
      Alert.alert(
        "Restore Failed",
        "Failed to restore purchases. Please try again.",
      );
    } finally {
      setIsRestoring(false);
    }
  }, [dispatch]);

  return {
    PLANS,
    data,
    isLoading,
    isPurchasing,
    isRestoring,
    error,
    products,
    planInfo,
    isProOrTrial,
    shouldShowPaywallBanners,
    getPlanPrice,
    getPlanInfo,
    purchase,
    restore,
    fetchProducts,
  };
};
