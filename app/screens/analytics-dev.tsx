import { Analytics } from "@/analytics";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ── Types ─────────────────────────────────────────────────────────────────────

interface EventDef {
  label: string;
  fire: () => void;
}

interface Section {
  title: string;
  color: string;
  events: EventDef[];
}

// ── Event catalogue (mirrors analytics/index.ts) ──────────────────────────────

const SECTIONS: Section[] = [
  {
    title: "Phase A — Bootstrap",
    color: "#6366f1",
    events: [
      {
        label: "device_init_succeeded (returning)",
        fire: () => Analytics.deviceInitSucceeded(true),
      },
      {
        label: "device_init_succeeded (new)",
        fire: () => Analytics.deviceInitSucceeded(false),
      },
      {
        label: "device_init_failed",
        fire: () => Analytics.deviceInitFailed("network_timeout"),
      },
      {
        label: "att_prompt_result (authorized)",
        fire: () => Analytics.attPromptResult("authorized"),
      },
      {
        label: "att_prompt_result (denied)",
        fire: () => Analytics.attPromptResult("denied"),
      },
    ],
  },
  {
    title: "Phase B — Onboarding",
    color: "#8b5cf6",
    events: [
      { label: "onboarding_started", fire: () => Analytics.onboardingStarted() },
      {
        label: "onboarding_step_viewed (0 welcome)",
        fire: () => Analytics.onboardingStepViewed(0, "welcome"),
      },
      {
        label: "onboarding_step_completed (0 welcome)",
        fire: () => Analytics.onboardingStepCompleted(0, "welcome"),
      },
      {
        label: "onboarding_step_viewed (3 finish)",
        fire: () => Analytics.onboardingStepViewed(3, "finish"),
      },
      {
        label: "onboarding_completed",
        fire: () => Analytics.onboardingCompleted("en"),
      },
    ],
  },
  {
    title: "Phase C — Auth",
    color: "#0ea5e9",
    events: [
      {
        label: "login_started (email)",
        fire: () => Analytics.loginStarted("email"),
      },
      {
        label: "login_succeeded (email)",
        fire: () => Analytics.loginSucceeded("email"),
      },
      {
        label: "login_failed (email)",
        fire: () => Analytics.loginFailed("email", "invalid_credentials"),
      },
      {
        label: "login_started (google)",
        fire: () => Analytics.loginStarted("google"),
      },
      {
        label: "login_succeeded (google)",
        fire: () => Analytics.loginSucceeded("google"),
      },
      {
        label: "login_started (apple)",
        fire: () => Analytics.loginStarted("apple"),
      },
      {
        label: "login_succeeded (apple)",
        fire: () => Analytics.loginSucceeded("apple"),
      },
      {
        label: "sign_up_completed (email)",
        fire: () => Analytics.signUpCompleted("email"),
      },
    ],
  },
  {
    title: "Phase D — Survey",
    color: "#10b981",
    events: [
      {
        label: "survey_started (first time)",
        fire: () => Analytics.surveyStarted(8, true),
      },
      {
        label: "survey_started (returning)",
        fire: () => Analytics.surveyStarted(8, false),
      },
      {
        label: "survey_step_viewed",
        fire: () => Analytics.surveyStepViewed(0, "diet_type"),
      },
      {
        label: "survey_step_completed",
        fire: () => Analytics.surveyStepCompleted("diet_type", 1),
      },
      {
        label: "survey_submitted (first time)",
        fire: () => Analytics.surveySubmitted(14200, true),
      },
      {
        label: "survey_submitted (returning)",
        fire: () => Analytics.surveySubmitted(9800, false),
      },
      {
        label: "survey_submit_failed",
        fire: () => Analytics.surveySubmitFailed("network_error"),
      },
      {
        label: "survey_outcome_routed (post_survey)",
        fire: () => Analytics.surveyOutcomeRouted("post_survey"),
      },
      {
        label: "survey_outcome_routed (progress_tab)",
        fire: () => Analytics.surveyOutcomeRouted("progress_tab"),
      },
    ],
  },
  {
    title: "Phase E — Post-Survey",
    color: "#f59e0b",
    events: [
      { label: "post_survey_started", fire: () => Analytics.postSurveyStarted() },
      {
        label: "rate_prompt_shown",
        fire: () => Analytics.ratePromptShown("post_survey"),
      },
      {
        label: "rate_prompt_action (rated)",
        fire: () => Analytics.ratePromptAction("rated"),
      },
      {
        label: "rate_prompt_action (skipped)",
        fire: () => Analytics.ratePromptAction("skipped"),
      },
    ],
  },
  {
    title: "Phase F — Main App / Tabs",
    color: "#f39849",
    events: [
      {
        label: "main_app_entered (survey)",
        fire: () => Analytics.mainAppEntered("survey"),
      },
      {
        label: "main_app_entered (login)",
        fire: () => Analytics.mainAppEntered("login"),
      },
      {
        label: "tab_selected (home)",
        fire: () => Analytics.tabSelected("home"),
      },
      {
        label: "tab_selected (explore)",
        fire: () => Analytics.tabSelected("explore"),
      },
      {
        label: "tab_selected (add)",
        fire: () => Analytics.tabSelected("add"),
      },
      {
        label: "tab_selected (progress)",
        fire: () => Analytics.tabSelected("progress"),
      },
      {
        label: "tab_selected (profile)",
        fire: () => Analytics.tabSelected("profile"),
      },
    ],
  },
  {
    title: "Phase G — Add Menu / Diary",
    color: "#ec4899",
    events: [
      {
        label: "add_menu_opened",
        fire: () => Analytics.addMenuOpened("add"),
      },
      {
        label: "add_menu_action (scan_ingredients)",
        fire: () => Analytics.addMenuAction("navigate_scan_ingredients"),
      },
      {
        label: "add_menu_action (scan_meal)",
        fire: () => Analytics.addMenuAction("navigate_scan_meal"),
      },
      {
        label: "meal_log_modal_opened (home_plus)",
        fire: () => Analytics.mealLogModalOpened("home_plus"),
      },
      {
        label: "meal_log_saved (manual)",
        fire: () => Analytics.mealLogSaved("manual", "lunch"),
      },
      {
        label: "meal_log_saved (scan)",
        fire: () => Analytics.mealLogSaved("scan", "dinner"),
      },
      {
        label: "water_logged",
        fire: () => Analytics.waterLogged(250, "quick"),
      },
      {
        label: "goal_celebration_shown",
        fire: () => Analytics.goalCelebrationShown("calories"),
      },
    ],
  },
  {
    title: "Phase I — Meal Scan",
    color: "#ef4444",
    events: [
      {
        label: "scan_flow_started (meal)",
        fire: () => Analytics.scanFlowStarted("meal"),
      },
      {
        label: "scan_capture_tapped (meal)",
        fire: () => Analytics.scanCaptureTapped("meal"),
      },
      {
        label: "scan_upload_started (meal)",
        fire: () => Analytics.scanUploadStarted("meal"),
      },
      {
        label: "scan_upload_succeeded (meal)",
        fire: () => Analytics.scanUploadSucceeded("meal", 2340),
      },
      {
        label: "scan_upload_failed (meal)",
        fire: () => Analytics.scanUploadFailed("meal", "upload_timeout"),
      },
      {
        label: "scan_result_applied_to_log",
        fire: () => Analytics.scanResultAppliedToLog("meal"),
      },
      {
        label: "scan_flow_abandoned (idle)",
        fire: () => Analytics.scanFlowAbandoned("meal", "idle"),
      },
      {
        label: "scan_flow_started (ingredients)",
        fire: () => Analytics.scanFlowStarted("ingredients"),
      },
      {
        label: "scan_capture_tapped (ingredients)",
        fire: () => Analytics.scanCaptureTapped("ingredients"),
      },
      {
        label: "scan_upload_started (ingredients)",
        fire: () => Analytics.scanUploadStarted("ingredients"),
      },
      {
        label: "quota_exhausted_shown",
        fire: () => Analytics.quotaExhaustedShown("meal_scan"),
      },
    ],
  },
  {
    title: "Phase J — AI Chef",
    color: "#14b8a6",
    events: [
      { label: "ai_chef_opened", fire: () => Analytics.aiChefOpened() },
      {
        label: "ai_chef_request_started",
        fire: () => Analytics.aiChefRequestStarted(),
      },
      {
        label: "ai_chef_request_succeeded",
        fire: () => Analytics.aiChefRequestSucceeded(3100),
      },
      {
        label: "ai_chef_request_failed",
        fire: () => Analytics.aiChefRequestFailed("rate_limit"),
      },
    ],
  },
  {
    title: "Phase K — Paywall / IAP",
    color: "#f97316",
    events: [
      {
        label: "paywall_viewed (post_survey)",
        fire: () => Analytics.paywallViewed("post_survey"),
      },
      {
        label: "paywall_viewed (full_screen)",
        fire: () => Analytics.paywallViewed("full_screen"),
      },
      {
        label: "paywall_cta_tapped (yearly)",
        fire: () => Analytics.paywallCtaTapped("full_screen", "yearly"),
      },
      {
        label: "paywall_cta_tapped (monthly)",
        fire: () => Analytics.paywallCtaTapped("full_screen", "monthly"),
      },
      {
        label: "paywall_dismissed (skip)",
        fire: () => Analytics.paywallDismissed("full_screen", "skip"),
      },
      {
        label: "paywall_dismissed (close)",
        fire: () => Analytics.paywallDismissed("full_screen", "close"),
      },
      {
        label: "iap_purchase_started (yearly)",
        fire: () => Analytics.iapPurchaseStarted("yearly", "full_screen"),
      },
      {
        label: "iap_purchase_succeeded (yearly)",
        fire: () => Analytics.iapPurchaseSucceeded("yearly", "full_screen"),
      },
      {
        label: "iap_purchase_failed (yearly)",
        fire: () => Analytics.iapPurchaseFailed("yearly", "payment_declined"),
      },
      {
        label: "iap_restore_started",
        fire: () => Analytics.iapRestoreStarted(),
      },
      {
        label: "iap_restore_completed (success)",
        fire: () => Analytics.iapRestoreCompleted(true),
      },
      {
        label: "iap_restore_completed (fail)",
        fire: () => Analytics.iapRestoreCompleted(false),
      },
      {
        label: "subscription_status_updated (pro)",
        fire: () => Analytics.subscriptionStatusUpdated("pro", true),
      },
      {
        label: "subscription_status_updated (free)",
        fire: () => Analytics.subscriptionStatusUpdated("free", false),
      },
    ],
  },
  {
    title: "Phase M — Errors",
    color: "#dc2626",
    events: [
      {
        label: "api_error (auth 401)",
        fire: () => Analytics.apiError("auth", 401, "unauthorized"),
      },
      {
        label: "api_error (scan 500)",
        fire: () => Analytics.apiError("scan", 500, "internal_error"),
      },
      {
        label: "app_error (crash)",
        fire: () => Analytics.appError("MealScannerScreen", "unhandled_exception"),
      },
    ],
  },
];

// ── Screen ────────────────────────────────────────────────────────────────────

export default function AnalyticsDevScreen() {
  const [lastFired, setLastFired] = useState<string | null>(null);

  const handleFire = (event: EventDef) => {
    event.fire();
    setLastFired(event.label);
    Alert.alert("Fired", event.label, [{ text: "OK" }]);
  };

  return (
    <ScreenWrapper withTabBar={false} withTabNavigation={false} showBackButton>
      <View className="px-4 pt-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <Text className="text-xl font-extrabold text-zinc-900 dark:text-white">
          Analytics Dev
        </Text>
        <Text className="text-xs text-zinc-400 mt-0.5">
          Events fire to Firebase + print to console. Tap any row to trigger.
        </Text>
        {lastFired && (
          <View className="mt-2 bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-xl">
            <Text className="text-green-700 dark:text-green-400 text-xs font-semibold" numberOfLines={1}>
              Last: {lastFired}
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {SECTIONS.map((section) => (
          <View key={section.title} className="mb-4">
            <View
              className="mx-4 mb-1 px-3 py-1 rounded-lg self-start"
              style={{ backgroundColor: `${section.color}20` }}
            >
              <Text
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: section.color }}
              >
                {section.title}
              </Text>
            </View>

            <View className="mx-4 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
              {section.events.map((event, idx) => (
                <TouchableOpacity
                  key={event.label}
                  onPress={() => handleFire(event)}
                  activeOpacity={0.7}
                  className={`flex-row items-center px-4 py-3 bg-white dark:bg-zinc-900 ${
                    idx < section.events.length - 1
                      ? "border-b border-zinc-100 dark:border-zinc-800"
                      : ""
                  }`}
                >
                  <View
                    className="w-2 h-2 rounded-full mr-3 flex-shrink-0"
                    style={{ backgroundColor: section.color }}
                  />
                  <Text
                    className="flex-1 text-sm text-zinc-700 dark:text-zinc-300 font-mono"
                    numberOfLines={2}
                  >
                    {event.label}
                  </Text>
                  <MaterialIcons
                    name="play-arrow"
                    size={18}
                    color={section.color}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}
