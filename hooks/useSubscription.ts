import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  activateGooglePlayPurchase,
  clearSubscriptionError,
  setIsPurchasing,
} from "@/store/slices/subscriptionSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
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

function parseProducts(
  products: RNIap.Product[],
): Record<PlanId, PlanInfo> {
  const result: Record<PlanId, PlanInfo> = {
    monthly: { ...EMPTY_PLAN },
    yearly: { ...EMPTY_PLAN },
  };

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

    const displayPrice =
      yearlyPhase?.formattedPrice ?? bestYearly.displayPrice;
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

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useSubscription = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading, isPurchasing, error } = useAppSelector(
    (s) => s.subscription,
  );

  const [products, setProducts] = useState<RNIap.Product[]>([]);
  const [planInfo, setPlanInfo] = useState<Record<PlanId, PlanInfo>>({
    monthly: { ...EMPTY_PLAN },
    yearly: { ...EMPTY_PLAN },
  });

  // Keep a ref so the purchase listener can read the current plan without
  // needing to be recreated every time selectedPlan changes.
  const currentPlanRef = useRef<PlanId>(PLANS.YEARLY);

  // ─── Fetch products ──────────────────────────────────────────────────────

  const fetchProducts = useCallback(async () => {
    try {
      const fetched = await RNIap.fetchProducts({
        skus: ["pro"],
        type: "subs",
      });
      setProducts(fetched);
      setPlanInfo(parseProducts(fetched));
    } catch (e) {
      console.warn("[useSubscription] fetchProducts error", e);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ─── Purchase listener ───────────────────────────────────────────────────

  useEffect(() => {
    const purchaseListener = RNIap.purchaseUpdatedListener(
      async (purchase) => {
        try {
          if (purchase.purchaseToken) {
            await RNIap.finishTransaction({
              purchase,
              isConsumable: false,
            });
            dispatch(
              activateGooglePlayPurchase({
                purchaseToken: purchase.purchaseToken,
                basePlanId: currentPlanRef.current,
              }),
            );
          }
        } catch (e) {
          console.warn("[useSubscription] finishTransaction error", e);
          dispatch(setIsPurchasing(false));
        }
      },
    );

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
          await RNIap.requestPurchase({ sku: planId, type: "subs" });
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
    try {
      await RNIap.restorePurchases();
    } catch (e) {
      console.warn("[useSubscription] restorePurchases error", e);
    }
  }, []);

  return {
    PLANS,
    data,
    isLoading,
    isPurchasing,
    error,
    products,
    planInfo,
    getPlanPrice,
    getPlanInfo,
    purchase,
    restore,
    fetchProducts,
  };
};
