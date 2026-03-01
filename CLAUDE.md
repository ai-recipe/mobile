# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start Expo dev server (then press 'i' iOS, 'a' Android, 'w' web)
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run web version
npm run lint       # Run ESLint
npm run reset-project  # Reset to clean state
```

No test suite is configured.

## Architecture

This is a React Native / Expo nutrition and recipe tracking app using:
- **Expo Router** for file-based routing (similar to Next.js)
- **Redux Toolkit** for state management (14 slices)
- **NativeWind** (Tailwind CSS) for styling with dark/light mode
- **Axios** for API calls to `https://api.recipetrack.tech/api/v1/`
- **i18next** for internationalization (Turkish primary, English fallback)

### Navigation Flow

```
/app/index.tsx         → checks onboarding/auth, redirects accordingly
/app/(public)/         → onboarding and auth screens (login, register, survey)
/app/(protected)/      → requires auth; fetches active goal plan on mount
/app/(protected)/(tabs)/  → 5-tab bottom nav (Home, Progress, Add, Explore, Profile)
/app/screens/          → modal/overlay screens (meal entry, scanning, etc.)
```

The root `_layout.tsx` wraps everything in `<Provider>` (Redux), `GestureHandlerRootView`, and `CopilotProvider`. App initialization happens via `useInitApp` hook which handles device init, user preferences, and i18n.

### Redux Store (`/store/`)

Typed hooks are in `/store/hooks.ts` — always use `useAppDispatch` and `useAppSelector` instead of raw Redux hooks.

Key slices and their domains:
- `authSlice` — authentication, onboarding status, survey, user preferences
- `dailyLogsSlice` — food log entries with `startDate`/`endDate` for range filtering
- `goalPlansSlice` — active nutrition goals (calories, protein, carbs, fat, water)
- `progressSlice` — weight tracking and calorie trend data
- `waterLogsSlice` — water intake tracking
- `modalSlice` — modal visibility state
- `recipeListSlice` / `recipeSlice` / `favoritesListSlice` / `exploreListSlice` — recipe browsing

All async operations use `createAsyncThunk` with automatic pending/fulfilled/rejected state.

### API Layer (`/api/`)

`/api/axios.ts` configures an Axios instance with interceptors that inject:
- `Authorization: Bearer {token}`
- `Accept-Language: {language}`
- `idempotency-key: {uuid}`
- `X-Timezone: UTC`

401 responses trigger logout automatically.

### Styling

Use NativeWind Tailwind classes. Custom theme colors/fonts are in `/constants/theme.ts`. Dark mode is class-based. Avoid inline styles — prefer Tailwind utilities.

### Path Aliases

`@/*` maps to the repo root (e.g., `@/store`, `@/components`, `@/api`).
