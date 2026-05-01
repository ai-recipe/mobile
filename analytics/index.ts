import analytics from "@react-native-firebase/analytics";
import { Platform } from "react-native";

const IS_WEB = Platform.OS === "web";

async function log(
  event: string,
  params?: Record<string, string | number | boolean | null>,
) {
  if (IS_WEB) return;
  if (__DEV__) console.log("[Analytics]", event, params ?? "");
  try {
    await analytics().logEvent(event, params as any);
  } catch (e) {
    if (__DEV__) console.warn("[Analytics] logEvent failed:", event, e);
  }
}

export const Analytics = {
  // ── Identity ────────────────────────────────────────────────────────────────
  setUserId: async (userId: string | null) => {
    if (IS_WEB) return;
    try {
      await analytics().setUserId(userId);
    } catch {}
  },
  setUserProperties: async (props: Record<string, string | null>) => {
    if (IS_WEB) return;
    try {
      await analytics().setUserProperties(props);
    } catch {}
  },
  screenView: async (screen_name: string) => {
    if (IS_WEB) return;
    if (__DEV__) console.log("[Analytics] screen_view", screen_name);
    try {
      await analytics().logScreenView({ screen_name, screen_class: screen_name });
    } catch {}
  },

  // ── Phase A: Bootstrap ──────────────────────────────────────────────────────
  deviceInitSucceeded: (had_stored_tokens: boolean) =>
    log("device_init_succeeded", { had_stored_tokens }),
  deviceInitFailed: (error_code: string) =>
    log("device_init_failed", { error_code }),
  attPromptResult: (status: string) =>
    log("att_prompt_result", { status }),

  // ── Phase B: Onboarding ─────────────────────────────────────────────────────
  onboardingStarted: () =>
    log("onboarding_started", { total_steps: 4 }),
  onboardingStepViewed: (step_index: number, step_id: string) =>
    log("onboarding_step_viewed", { step_index, step_id }),
  onboardingStepCompleted: (step_index: number, step_id: string) =>
    log("onboarding_step_completed", { step_index, step_id }),
  onboardingCompleted: (language: string) =>
    log("onboarding_completed", { language }),

  // ── Phase C: Auth ───────────────────────────────────────────────────────────
  loginStarted: (method: string) =>
    log("login_started", { method }),
  loginSucceeded: (method: string) =>
    log("login_succeeded", { method }),
  loginFailed: (method: string, error_code: string) =>
    log("login_failed", { method, error_code }),
  signUpCompleted: (method: string) =>
    log("sign_up_completed", { method }),

  // ── Phase D: Survey ─────────────────────────────────────────────────────────
  surveyStarted: (question_count: number, is_first_time: boolean) =>
    log("survey_started", { question_count, is_first_time }),
  surveyStepViewed: (step_index: number, question_key: string) =>
    log("survey_step_viewed", { step_index, question_key }),
  surveyStepCompleted: (question_key: string, answer_count: number) =>
    log("survey_step_completed", { question_key, answer_count }),
  surveySubmitted: (submission_ms: number, is_first_time: boolean) =>
    log("survey_submitted", { submission_ms, is_first_time }),
  surveySubmitFailed: (error_code: string) =>
    log("survey_submit_failed", { error_code }),
  surveyOutcomeRouted: (destination: string) =>
    log("survey_outcome_routed", { destination }),

  // ── Phase E: Post-survey ────────────────────────────────────────────────────
  postSurveyStarted: () =>
    log("post_survey_started"),
  ratePromptShown: (placement: string) =>
    log("rate_prompt_shown", { placement }),
  ratePromptAction: (action: string) =>
    log("rate_prompt_action", { action }),

  // ── Phase F: Main app / tabs ────────────────────────────────────────────────
  mainAppEntered: (from: string) =>
    log("main_app_entered", { from }),
  tabSelected: (tab_id: string) =>
    log("tab_selected", { tab_id }),

  // ── Phase G: Add menu / diary ───────────────────────────────────────────────
  addMenuOpened: (from_tab: string) =>
    log("add_menu_opened", { from_tab }),
  addMenuAction: (action: string) =>
    log("add_menu_action", { action }),
  mealLogModalOpened: (source: string) =>
    log("meal_log_modal_opened", { source }),
  mealLogSaved: (entry_source: string, meal_type?: string) =>
    log("meal_log_saved", { entry_source, meal_type: meal_type ?? "unknown" }),
  waterLogged: (amount_ml: number, source: string) =>
    log("water_logged", { amount_ml, source }),
  goalCelebrationShown: (goal_type: string) =>
    log("goal_celebration_shown", { goal_type }),

  // ── Phase I: Scans ──────────────────────────────────────────────────────────
  scanFlowStarted: (scan_type: string) =>
    log("scan_flow_started", { scan_type }),
  scanCaptureTapped: (scan_type: string) =>
    log("scan_capture_tapped", { scan_type }),
  scanUploadStarted: (scan_type: string) =>
    log("scan_upload_started", { scan_type }),
  scanUploadSucceeded: (scan_type: string, latency_ms: number) =>
    log("scan_upload_succeeded", { scan_type, latency_ms }),
  scanUploadFailed: (scan_type: string, error_code: string) =>
    log("scan_upload_failed", { scan_type, error_code }),
  scanResultAppliedToLog: (scan_type: string) =>
    log("scan_result_applied_to_log", { scan_type }),
  scanFlowAbandoned: (scan_type: string, last_step_id: string) =>
    log("scan_flow_abandoned", { scan_type, last_step_id }),

  // ── Phase J: AI Chef ────────────────────────────────────────────────────────
  aiChefOpened: () =>
    log("ai_chef_opened"),
  aiChefRequestStarted: () =>
    log("ai_chef_request_started"),
  aiChefRequestSucceeded: (latency_ms: number) =>
    log("ai_chef_request_succeeded", { latency_ms }),
  aiChefRequestFailed: (error_code: string) =>
    log("ai_chef_request_failed", { error_code }),

  // ── Phase K: Monetization ───────────────────────────────────────────────────
  paywallViewed: (placement: string) =>
    log("paywall_viewed", { placement }),
  paywallCtaTapped: (placement: string, plan_id: string) =>
    log("paywall_cta_tapped", { placement, plan_id }),
  paywallDismissed: (placement: string, dismiss_method: string) =>
    log("paywall_dismissed", { placement, dismiss_method }),
  iapPurchaseStarted: (plan_id: string, placement: string) =>
    log("iap_purchase_started", { plan_id, placement }),
  iapPurchaseSucceeded: (plan_id: string, placement: string) =>
    log("iap_purchase_succeeded", { plan_id, placement }),
  iapPurchaseFailed: (plan_id: string, error_code: string) =>
    log("iap_purchase_failed", { plan_id, error_code }),
  iapRestoreStarted: () =>
    log("iap_restore_started"),
  iapRestoreCompleted: (success: boolean) =>
    log("iap_restore_completed", { success }),
  subscriptionStatusUpdated: (tier: string, will_renew: boolean) =>
    log("subscription_status_updated", { tier, will_renew }),

  // ── Phase L: Quota ──────────────────────────────────────────────────────────
  quotaExhaustedShown: (feature: string) =>
    log("quota_exhausted_shown", { feature }),

  // ── Phase M: Errors ─────────────────────────────────────────────────────────
  apiError: (
    endpoint_group: string,
    http_status: number,
    error_code?: string,
  ) =>
    log("api_error", {
      endpoint_group,
      http_status,
      error_code: error_code ?? "unknown",
    }),
  appError: (component: string, error_code: string) =>
    log("app_error", { component, error_code }),
};
