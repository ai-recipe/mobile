import { createListenerMiddleware } from "@reduxjs/toolkit";
import { Analytics } from "@/analytics";
import {
  initDeviceAsync,
  loginWithEmailAsync,
  loginWithGoogleAsync,
  loginWithAppleAsync,
  registerWithEmailAsync,
  submitSurveyAsync,
} from "@/store/slices/authSlice";
import {
  activateAppleIAPPurchase,
  activateGooglePlayPurchase,
  fetchSubscriptionStatus,
} from "@/store/slices/subscriptionSlice";

export const analyticsListenerMiddleware = createListenerMiddleware();

const listen = analyticsListenerMiddleware.startListening.bind(
  analyticsListenerMiddleware,
);

// ── Bootstrap ────────────────────────────────────────────────────────────────

listen({
  actionCreator: initDeviceAsync.fulfilled,
  effect: (action) => {
    const had_stored_tokens = !!(action.payload?.refreshToken);
    Analytics.deviceInitSucceeded(had_stored_tokens);
    if (action.payload?.user?.id) {
      Analytics.setUserId(action.payload.user.id);
    }
    Analytics.setUserProperties({
      auth_status: action.payload?.refreshToken ? "registered" : "anonymous",
    });
  },
});

listen({
  actionCreator: initDeviceAsync.rejected,
  effect: (action) => {
    Analytics.deviceInitFailed(String(action.payload ?? "unknown"));
  },
});

// ── Auth: login ──────────────────────────────────────────────────────────────

listen({
  actionCreator: loginWithEmailAsync.fulfilled,
  effect: (action) => {
    Analytics.loginSucceeded("email");
    if (action.payload?.user?.id) {
      Analytics.setUserId(action.payload.user.id);
      Analytics.setUserProperties({ auth_status: "registered" });
    }
  },
});

listen({
  actionCreator: loginWithEmailAsync.rejected,
  effect: (action) => {
    Analytics.loginFailed("email", String(action.payload ?? "unknown"));
  },
});

listen({
  actionCreator: loginWithGoogleAsync.fulfilled,
  effect: (action) => {
    Analytics.loginSucceeded("google");
    if ((action.payload as any)?.user?.id) {
      Analytics.setUserId((action.payload as any).user.id);
      Analytics.setUserProperties({ auth_status: "registered" });
    }
  },
});

listen({
  actionCreator: loginWithGoogleAsync.rejected,
  effect: (action) => {
    if (action.payload !== "cancelled") {
      Analytics.loginFailed("google", String(action.payload ?? "unknown"));
    }
  },
});

listen({
  actionCreator: loginWithAppleAsync.fulfilled,
  effect: (action) => {
    Analytics.loginSucceeded("apple");
    if (action.payload?.user?.id) {
      Analytics.setUserId(action.payload.user.id);
      Analytics.setUserProperties({ auth_status: "registered" });
    }
  },
});

listen({
  actionCreator: loginWithAppleAsync.rejected,
  effect: (action) => {
    if (action.payload !== "cancelled") {
      Analytics.loginFailed("apple", String(action.payload ?? "unknown"));
    }
  },
});

// ── Auth: register ───────────────────────────────────────────────────────────

listen({
  actionCreator: registerWithEmailAsync.fulfilled,
  effect: (action) => {
    Analytics.signUpCompleted("email");
    if (action.payload?.user?.id) {
      Analytics.setUserId(action.payload.user.id);
      Analytics.setUserProperties({ auth_status: "registered" });
    }
  },
});

// ── Survey ───────────────────────────────────────────────────────────────────

listen({
  actionCreator: submitSurveyAsync.fulfilled,
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as any;
    const isFirstTime = state.auth.preferences === null;
    Analytics.surveySubmitted(0, isFirstTime);
    Analytics.setUserProperties({ survey_completed: "true" });
  },
});

listen({
  actionCreator: submitSurveyAsync.rejected,
  effect: (action) => {
    Analytics.surveySubmitFailed(String(action.payload ?? "unknown"));
  },
});

// ── Subscription ─────────────────────────────────────────────────────────────

listen({
  actionCreator: fetchSubscriptionStatus.fulfilled,
  effect: (action) => {
    const payload = action.payload as any;
    if (!payload) return;
    Analytics.subscriptionStatusUpdated(
      payload.tier ?? "free",
      payload.willRenew ?? false,
    );
    Analytics.setUserProperties({
      subscription_tier: payload.tier ?? "free",
    });
  },
});

listen({
  actionCreator: activateAppleIAPPurchase.fulfilled,
  effect: (action) => {
    const arg = action.meta.arg as any;
    const plan_id = String(arg?.productId ?? "").includes("monthly")
      ? "monthly"
      : "yearly";
    Analytics.iapPurchaseSucceeded(plan_id, "paywall");
  },
});

listen({
  actionCreator: activateAppleIAPPurchase.rejected,
  effect: (action) => {
    const arg = action.meta.arg as any;
    const plan_id = String(arg?.productId ?? "").includes("monthly")
      ? "monthly"
      : "yearly";
    Analytics.iapPurchaseFailed(plan_id, String(action.payload ?? "unknown"));
  },
});

listen({
  actionCreator: activateGooglePlayPurchase.fulfilled,
  effect: (action) => {
    const arg = action.meta.arg as any;
    Analytics.iapPurchaseSucceeded(arg?.basePlanId ?? "unknown", "paywall");
  },
});

listen({
  actionCreator: activateGooglePlayPurchase.rejected,
  effect: (action) => {
    const arg = action.meta.arg as any;
    Analytics.iapPurchaseFailed(
      arg?.basePlanId ?? "unknown",
      String(action.payload ?? "unknown"),
    );
  },
});
