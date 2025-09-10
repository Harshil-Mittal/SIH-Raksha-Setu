import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language files
import en from './en.json';
import hi from './hi.json';
import as from './as.json';
import bn from './bn.json';
import mni from './mni.json';
import kha from './kha.json';
import nsm from './nsm.json';
import brx from './brx.json';
import ta from './ta.json';
import te from './te.json';
import mr from './mr.json';
import gu from './gu.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  as: { translation: as },
  bn: { translation: bn },
  mni: { translation: mni },
  kha: { translation: kha },
  nsm: { translation: nsm },
  brx: { translation: brx },
  ta: { translation: ta },
  te: { translation: te },
  mr: { translation: mr },
  gu: { translation: gu },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('raksha_language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;