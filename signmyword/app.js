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
  openImageMaker: document.querySelector('#open-image-maker'),
  imageModal: document.querySelector('#image-modal'),
  closeImageModal: document.querySelector('#close-image-modal'),
  imageModalBackdrop: document.querySelector('[data-close-image-modal]'),
  imageStyleButtons: [...document.querySelectorAll('[data-card-style]')],
  imagePreview: document.querySelector('#share-image-preview'),
  imageLoading: document.querySelector('#share-image-loading'),
  imageModalStatus: document.querySelector('#image-modal-status'),
  downloadShareImage: document.querySelector('#download-share-image'),
  shareImageFile: document.querySelector('#share-image-file'),
  shareCard: document.querySelector('#share-card'),
  shareCardWord: document.querySelector('#share-card-word'),
  shareCardLanguage: document.querySelector('#share-card-language'),
  shareCardLetters: document.querySelector('#share-card-letters'),
  shareCardQr: document.querySelector('#share-card-qr'),
};

const shareImageState = {
  style: 'light',
  blob: null,
  previewUrl: null,
};

function revokeShareImagePreview() {
  if (shareImageState.previewUrl) {
    URL.revokeObjectURL(shareImageState.previewUrl);
    shareImageState.previewUrl = null;
  }
}

function invalidateShareImage() {
  shareImageState.blob = null;
  revokeShareImagePreview();

  if (el.imagePreview) {
    el.imagePreview.removeAttribute('src');
    el.imagePreview.hidden = true;
  }

  if (el.imageLoading) {
    el.imageLoading.hidden = false;
    el.imageLoading.textContent = 'Creating preview…';
  }
}

function imageFileName() {
  const safeWord = state.word
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'word';

  return `signmyword-${state.lang}-${safeWord}.png`;
}

function setImageModalStatus(message = '') {
  if (el.imageModalStatus) el.imageModalStatus.textContent = message;
}

function shareCardLetter(letter) {
  const config = LANGUAGES[state.lang];

  const card = document.createElement('div');
  card.className = 'share-card__letter';

  const label = document.createElement('p');
  label.className = 'share-card__letter-name';
  label.textContent = letter;

  const box = document.createElement('div');
  box.className = 'share-card__letter-box';

  const image = document.createElement('img');
  image.crossOrigin = 'anonymous';
  image.src = config.file(letter);
  image.alt = `${config.name} fingerspelling for the letter ${letter}`;

  image.addEventListener('error', () => {
    box.replaceChildren();
    const fallback = document.createElement('strong');
    fallback.textContent = letter;
    fallback.style.fontSize = '54px';
    fallback.style.lineHeight = '1';
    box.appendChild(fallback);
  });

  box.appendChild(image);
  card.append(label, box);
  return card;
}

function renderShareCard() {
  if (!el.shareCard) return;

  const config = LANGUAGES[state.lang];
  const count = letterCount(state.word);

  el.shareCard.className = `share-card share-card--${shareImageState.style}`;
  if (count > 12) {
    el.shareCard.classList.add('share-card--very-dense');
  } else if (count > 6) {
    el.shareCard.classList.add('share-card--dense');
  }

  el.shareCardWord.textContent = state.word;
  el.shareCardLanguage.textContent = `in ${config.label} ${config.flag}`;
  el.shareCardLetters.replaceChildren();

  [...state.word].forEach((char) => {
    if (/[A-Z]/.test(char)) {
      el.shareCardLetters.appendChild(shareCardLetter(char));
    }
  });

  el.shareCardQr.replaceChildren();

  if (window.QRCode) {
    new QRCode(el.shareCardQr, {
      text: shareLink(),
      width: 126,
      height: 126,
      correctLevel: QRCode.CorrectLevel.M,
    });
  }
}

async function waitForShareCardImages() {
  if (!el.shareCard) return;

  const images = [...el.shareCard.querySelectorAll('img')];
  await Promise.all(
    images.map(
      (image) =>
        new Promise((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }

          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', resolve, { once: true });
        })
    )
  );
}

async function generateShareImageBlob() {
  if (!window.html2canvas) {
    throw new Error('Image generator is still loading. Please try again.');
  }

  if (el.imageLoading) {
    el.imageLoading.hidden = false;
    el.imageLoading.textContent = 'Creating preview…';
  }
  if (el.imagePreview) el.imagePreview.hidden = true;
  setImageModalStatus('');

  renderShareCard();

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  await waitForShareCardImages();
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  const canvas = await html2canvas(el.shareCard, {
    backgroundColor: null,
    scale: 1,
    useCORS: true,
    allowTaint: false,
    logging: false,
    width: 1080,
    height: 1350,
  });

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) resolve(result);
      else reject(new Error('Could not create the image.'));
    }, 'image/png');
  });

  shareImageState.blob = blob;
  revokeShareImagePreview();
  shareImageState.previewUrl = URL.createObjectURL(blob);

  if (el.imagePreview) {
    el.imagePreview.src = shareImageState.previewUrl;
    el.imagePreview.hidden = false;
  }
  if (el.imageLoading) el.imageLoading.hidden = true;

  return blob;
}

async function ensureShareImageBlob() {
  return shareImageState.blob || generateShareImageBlob();
}

async function openImageMaker() {
  if (!el.imageModal) return;

  el.imageModal.hidden = false;
  document.body.classList.add('modal-open');
  setImageModalStatus('');
  invalidateShareImage();

  try {
    await generateShareImageBlob();
  } catch (error) {
    if (el.imageLoading) {
      el.imageLoading.hidden = false;
      el.imageLoading.textContent = 'Preview unavailable';
    }
    setImageModalStatus(error?.message || 'Could not create the share image.');
  }
}

function closeImageMaker() {
  if (!el.imageModal) return;

  el.imageModal.hidden = true;
  document.body.classList.remove('modal-open');
  setImageModalStatus('');
  el.openImageMaker?.focus();
}

async function downloadShareImage() {
  try {
    const blob = await ensureShareImageBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = imageFileName();
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setImageModalStatus('Image downloaded ✓');
  } catch (error) {
    setImageModalStatus(error?.message || 'Could not download the image.');
  }
}

async function shareGeneratedImage() {
  try {
    const blob = await ensureShareImageBlob();
    const file = new File([blob], imageFileName(), { type: 'image/png' });
    const data = {
      title: `How to fingerspell ${state.word}`,
      text: `How to fingerspell ${state.word} in ${LANGUAGES[state.lang].label}.`,
      files: [file],
    };

    if (navigator.canShare?.({ files: [file] }) && navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
        throw error;
      }
    }

    await downloadShareImage();
    setImageModalStatus('Your browser cannot share image files directly, so the image was downloaded instead.');
  } catch (error) {
    setImageModalStatus(error?.message || 'Could not share the image.');
  }
}

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
  invalidateShareImage();
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

el.openImageMaker?.addEventListener('click', openImageMaker);
el.closeImageModal?.addEventListener('click', closeImageMaker);
el.imageModalBackdrop?.addEventListener('click', closeImageMaker);
el.downloadShareImage?.addEventListener('click', downloadShareImage);
el.shareImageFile?.addEventListener('click', shareGeneratedImage);

el.imageStyleButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    shareImageState.style = button.dataset.cardStyle || 'light';

    el.imageStyleButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('image-style-pill--active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    invalidateShareImage();

    try {
      await generateShareImageBlob();
    } catch (error) {
      setImageModalStatus(error?.message || 'Could not create this image style.');
    }
  });
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
  if (event.key !== 'Escape') return;
  setNavigationOpen(false);
  if (!el.imageModal?.hidden) closeImageMaker();
});

loadFromUrl();
render();
