import i18n from "i18next";

import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
/**
 *     {
      "_id": "69c95edf545f8ad668494747",
      "key": "addOptions.aiChef",
      "__v": 0,
      "createdAt": "2026-03-29T17:18:22.905Z",
      "en": "AI Chef",
      "tr": "AI Şef",
      "updatedAt": "2026-03-29T17:18:22.905Z"
    },
 */

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: Localization.getLocales()[0].languageCode ?? "en", // fallback language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false, // IMPORTANT for React Native
    },
    backend: {
      loadPath: `${"http://10.0.2.2:3001/api/v1"}/cms/translations`,
      parse: (data: any, languages: string | string[]) => {
        const parsedJSON = JSON.parse(data);

        const lng = Array.isArray(languages) ? languages[0] : languages;

        const result = parsedJSON.data.reduce(
          (acc: Record<string, string>, curr: any) => {
            acc[curr.key] = curr[lng] || curr.en; // fallback to en
            return acc;
          },
          {},
        );

        return result;
      },
    },
  });
export default i18n;
