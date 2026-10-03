export const MAIN_SITE = 'https://guyorlov.com/projects/signmyword/';

export function cleanLang(value = '') {
  return String(value).toLowerCase() === 'asl' ? 'asl' : 'bsl';
}

export function cleanWord(value = '') {
  return String(value)
    .toUpperCase()
    .replace(/[^A-Z\s'-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 32) || 'HELLO';
}

export function languageConfig(lang) {
  return cleanLang(lang) === 'asl'
    ? {
        code: 'asl',
        label: 'ASL',
        flag: '🇺🇸',
        name: 'American Sign Language',
      }
    : {
        code: 'bsl',
        label: 'BSL',
        flag: '🇬🇧',
        name: 'British Sign Language',
      };
}

export function destinationUrl(lang, word) {
  const url = new URL(MAIN_SITE);
  url.searchParams.set('lang', cleanLang(lang));
  url.searchParams.set('word', cleanWord(word));
  return url.toString();
}

export function shareTitle(lang, word) {
  const config = languageConfig(lang);
  return `How to fingerspell “${cleanWord(word)}” in ${config.label}`;
}

export function shareDescription(lang) {
  const config = languageConfig(lang);
  return `See every letter clearly in ${config.name} (${config.label}) with SignMyWord.`;
}

export function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
