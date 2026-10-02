const state = {
  lang: 'asl',
  word: 'HELLO',
};

const LANGUAGES = {
  asl: {
    label: 'ASL',
    flag: '🇺🇸',
    name: 'American Sign Language',
    file(letter) {
      return `https://commons.wikimedia.org/wiki/Special:Redirect/file/Sign_language_${letter}.svg`;
    },
    source(letter) {
      return `https://commons.wikimedia.org/wiki/File:Sign_language_${letter}.svg`;
    },
  },
  bsl: {
    label: 'BSL',
    flag: '🇬🇧',
    name: 'British Sign Language',
    file(letter) {
      return `https://commons.wikimedia.org/wiki/Special:Redirect/file/BSL_letter_${letter}.svg`;
    },
    source(letter) {
      return `https://commons.wikimedia.org/wiki/File:BSL_letter_${letter}.svg`;
    },
  },
};

const el = {
  form: document.querySelector('#word-form'),
  input: document.querySelector('#word-input'),
  output: document.querySelector('#letter-output'),
  outputMeta: document.querySelector('#output-meta'),
  outputLang: document.querySelector('#output-lang'),
  mobileOutputName: document.querySelector('#mobile-output-name'),
  mobileOutputMeta: document.querySelector('#mobile-output-meta'),
  shareUrl: document.querySelector('#share-url'),
  copy: document.querySelector('#copy-link'),
  whatsapp: document.querySelector('#share-whatsapp'),
  share: document.querySelector('#share-native'),
  qr: document.querySelector('#qr-code'),
  message: document.querySelector('#form-message'),
  languageButtons: [...document.querySelectorAll('[data-language]')],
  exampleButtons: [...document.querySelectorAll('[data-example]')],
  more: document.querySelector('#more-languages'),
  navToggle: document.querySelector('#nav-toggle'),
  nav: document.querySelector('#main-nav'),
  sourceNote: document.querySelector('#source-note'),
};

function cleanWord(value) {
  return value
    .toUpperCase()
    .replace(/[^A-Z\s'-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 32);
}

function letterCount(word) {
  return (word.match(/[A-Z]/g) || []).length;
}

function shareLink() {
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set('lang', state.lang);
  url.searchParams.set('word', state.word);
  return url.toString();
}

function updateUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set('lang', state.lang);
  url.searchParams.set('word', state.word);
  history.replaceState({}, '', url);
}

function renderLanguage() {
  el.languageButtons.forEach((button) => {
    const active = button.dataset.language === state.lang;
    button.classList.toggle('language-pill--active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  const config = LANGUAGES[state.lang];
  el.outputLang.textContent = `${config.flag} ${config.label}`;
  el.sourceNote.innerHTML =
    state.lang === 'asl'
      ? 'ASL artwork is loaded from Wikimedia Commons. Check each source file page for its reuse status.'
      : 'BSL artwork is loaded from Wikimedia Commons. Checked files use CC BY-SA 3.0; attribution is provided below.';
}

function separatorCard(char) {
  const span = document.createElement('div');
  span.className = 'letter-separator';
  span.setAttribute('aria-hidden', 'true');
  span.textContent = char === ' ' ? '·' : char;
  return span;
}

function letterCard(letter) {
  const config = LANGUAGES[state.lang];
  const card = document.createElement('article');
  card.className = 'letter-card';

  const heading = document.createElement('strong');
  heading.className = 'letter-card__letter';
  heading.textContent = letter;

  const imageBox = document.createElement('a');
  imageBox.className = 'letter-card__image';
  imageBox.href = config.source(letter);
  imageBox.target = '_blank';
  imageBox.rel = 'noopener noreferrer';
  imageBox.title = `Open Wikimedia source for ${config.label} letter ${letter}`;

  const image = document.createElement('img');
  image.src = config.file(letter);
  image.alt = `${config.name} fingerspelling for the letter ${letter}`;
  image.loading = 'lazy';
  image.decoding = 'async';

  const fallback = document.createElement('span');
  fallback.className = 'letter-card__fallback';
  fallback.hidden = true;
  fallback.textContent = `${letter} image unavailable`;

  image.addEventListener('error', () => {
    image.hidden = true;
    fallback.hidden = false;
  });

  imageBox.append(image, fallback);
  card.append(heading, imageBox);
  return card;
}

function renderWord() {
  const count = letterCount(state.word);
  el.output.replaceChildren();

  if (!count) {
    el.outputMeta.textContent = 'Type a word to begin';
    return;
  }

  [...state.word].forEach((char) => {
    if (/[A-Z]/.test(char)) {
      el.output.appendChild(letterCard(char));
    } else {
      el.output.appendChild(separatorCard(char));
    }
  });

  el.outputMeta.textContent = `${state.word} · ${count} ${count === 1 ? 'letter' : 'letters'}`;

  if (el.mobileOutputName) {
    el.mobileOutputName.textContent = state.word;
  }

  if (el.mobileOutputMeta) {
    const config = LANGUAGES[state.lang];
    el.mobileOutputMeta.textContent = `${config.flag} ${config.label} · ${count} ${count === 1 ? 'letter' : 'letters'}`;
  }
}

function renderShare() {
  const url = shareLink();
  el.shareUrl.value = url;
  el.whatsapp.href = `https://wa.me/?text=${encodeURIComponent(`SignMyWord: ${state.word} — ${url}`)}`;

  el.qr.replaceChildren();
  if (window.QRCode) {
    new QRCode(el.qr, {
      text: url,
      width: 126,
      height: 126,
      correctLevel: QRCode.CorrectLevel.M,
    });
  } else {
    const fallback = document.createElement('a');
    fallback.href = url;
    fallback.textContent = 'Open share link';
    el.qr.appendChild(fallback);
  }
}

function render() {
  renderLanguage();
  renderWord();
  updateUrl();
  renderShare();
}

function setWord(value) {
  const next = cleanWord(value);
  if (!next) {
    el.message.textContent = 'Please enter at least one letter A–Z.';
    el.input.focus();
    return;
  }
  state.word = next;
  el.input.value = next;
  el.message.textContent = '';
  render();
}

function setLanguage(language) {
  if (!LANGUAGES[language]) return;
  state.lang = language;
  render();
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareLink());
    const previous = el.copy.textContent;
    el.copy.textContent = 'Copied ✓';
    setTimeout(() => (el.copy.textContent = previous), 1600);
  } catch {
    el.shareUrl.focus();
    el.shareUrl.select();
  }
}

async function nativeShare() {
  const data = {
    title: `SignMyWord — ${state.word}`,
    text: `See ${state.word} fingerspelled in ${LANGUAGES[state.lang].label}.`,
    url: shareLink(),
  };

  if (navigator.share) {
    try {
      await navigator.share(data);
      return;
    } catch (error) {
      if (error?.name === 'AbortError') return;
    }
  }
  await copyLink();
}

function loadFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang');
  const word = cleanWord(params.get('word') || '');

  if (LANGUAGES[lang]) state.lang = lang;
  if (word) state.word = word;

  el.input.value = state.word;
}

el.form.addEventListener('submit', (event) => {
  event.preventDefault();
  setWord(el.input.value);
});

el.languageButtons.forEach((button) => {
  button.addEventListener('click', () => setLanguage(button.dataset.language));
});

el.exampleButtons.forEach((button) => {
  button.addEventListener('click', () => setWord(button.dataset.example));
});

el.copy.addEventListener('click', copyLink);
el.share.addEventListener('click', nativeShare);

el.more.addEventListener('click', () => {
  el.message.textContent = 'More fingerspelling alphabets are planned. ASL and BSL are available now.';
});

function setNavigationOpen(open) {
  el.navToggle.setAttribute('aria-expanded', String(open));
  el.navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  el.navToggle.textContent = open ? '×' : '☰';
  el.nav.classList.toggle('nav--open', open);
}

el.navToggle.addEventListener('click', () => {
  const open = el.navToggle.getAttribute('aria-expanded') === 'true';
  setNavigationOpen(!open);
});

el.nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setNavigationOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setNavigationOpen(false);
});

loadFromUrl();
render();
