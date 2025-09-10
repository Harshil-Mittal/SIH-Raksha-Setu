import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  
  return {
    t,
    i18n,
    // Helper function for nested keys
    tNested: (key: string, options?: any) => t(key, options),
    // Helper function for common translations
    tCommon: (key: string) => t(`common.${key}`),
    // Helper function for app-specific translations
    tApp: (key: string) => t(`app.${key}`),
    // Helper function for auth translations
    tAuth: (key: string) => t(`login.${key}`),
    // Helper function for signup translations
    tSignup: (key: string) => t(`signup.${key}`),
    // Helper function for tourist translations
    tTourist: (key: string) => t(`tourist.${key}`),
    // Helper function for topbar translations
    tTopbar: (key: string) => t(`topbar.${key}`),
    // Helper function for error translations
    tError: (key: string) => t(`errors.${key}`),
    // Helper function for SOS translations
    tSOS: (key: string) => t(`sos.${key}`),
    // Helper function for cards translations
    tCards: (key: string) => t(`cards.${key}`),
    // Helper function for app translations
    tApp: (key: string) => t(`app.${key}`),
  };
};

export default useTranslation;
