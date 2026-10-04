import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      "welcome": "مِجهَر المعلومات - منصة الفحص والتدريب",
      "subtitle": "برنامج تدريبي ومساعد رقمي ذكي للتحقق من الأخبار والتصدّي للتزييف العميق",
      "toggle_theme": "تبديل المظهر",
      "toggle_lang": "English",
      "notifications": "الإشعارات الذكية",
      "sync_status": "المزامنة السحابية تعمل",
      "two_factor": "تفعيل التحقق بخطوتين (2FA)"
    }
  },
  en: {
    translation: {
      "welcome": "Info-Scope - Analysis & Training Platform",
      "subtitle": "Smart Digital Assistant & Training Program for News Verification & Deepfake Detection",
      "toggle_theme": "Toggle Theme",
      "toggle_lang": "العربية",
      "notifications": "Smart Notifications",
      "sync_status": "Cloud Sync Active",
      "two_factor": "Enable 2FA"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'ar',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
