import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18next
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		supportedLngs: ["br", "en", "es"],
		// backend: {
		// 	loadPath: `/locales/{{lng}}.json`
		// },
		fallbackLng: "br",
		debug: false,
		keySeparator: false,
		react: {
			useSuspense: false
		},
		interpolation: {
			escapeValue: false,
			formatSeparator: ","
		},
        resources: {
            en: {
                teste: "Leticia"
            }
        }
	});
