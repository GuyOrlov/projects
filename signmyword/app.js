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
  mobileOutputTitle: document.querySelector('#mobile-output-title'),
  mobileOutputMeta: document.querySelector('#mobile-output-meta'),
  shareUrl: document.querySelector('#share-url'),
  copy: document.querySelector('#copy-link'),
  whatsapp: document.querySelector('#share-whatsapp'),
  share: document.querySelector('#share-native'),
  qr: document.querySelector('#qr-code'),
  message: document.querySelector('#form-message'),
  languageButtons: [...document.querySelectorAll('[data-language]')],
  exampleButtons: [...document.querySelectorAll('[data-example]')],
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
  shareCardTitle: document.querySelector('#share-card-title'),
  shareCardLetters: document.querySelector('#share-card-letters'),
  shareCardQr: document.querySelector('#share-card-qr'),
};

const shareImageState = {
  style: 'light',
  blob: null,
  previewUrl: null,
};

const signAssetCache = new Map();

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

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), { once: true });
    reader.addEventListener('error', () => reject(reader.error || new Error('Could not read sign image.')), { once: true });
    reader.readAsDataURL(blob);
  });
}

function commonsFileName(language, letter) {
  return language === 'bsl'
    ? `BSL_letter_${letter}.svg`
    : `Sign_language_${letter}.svg`;
}

async function commonsOriginalFileUrl(language, letter) {
  const filename = commonsFileName(language, letter);
  const apiUrl = new URL('https://commons.wikimedia.org/w/api.php');
  apiUrl.searchParams.set('action', 'query');
  apiUrl.searchParams.set('format', 'json');
  apiUrl.searchParams.set('origin', '*');
  apiUrl.searchParams.set('prop', 'imageinfo');
  apiUrl.searchParams.set('iiprop', 'url');
  apiUrl.searchParams.set('titles', `File:${filename}`);

  const response = await fetch(apiUrl, {
    mode: 'cors',
    credentials: 'omit',
    cache: 'force-cache',
  });

  if (!response.ok) {
    throw new Error(`Could not resolve ${LANGUAGES[language].label} sign for ${letter}.`);
  }

  const data = await response.json();
  const page = Object.values(data?.query?.pages || {})[0];
  const fileUrl = page?.imageinfo?.[0]?.url;

  if (!fileUrl) {
    throw new Error(`No Wikimedia image was found for ${letter}.`);
  }

  return fileUrl;
}

async function signImageDataUrl(language, letter) {
  const cacheKey = `${language}:${letter}`;
  if (signAssetCache.has(cacheKey)) return signAssetCache.get(cacheKey);

  const config = LANGUAGES[language];
  const fileUrl = await commonsOriginalFileUrl(language, letter);
  const response = await fetch(fileUrl, {
    mode: 'cors',
    credentials: 'omit',
    cache: 'force-cache',
  });

  if (!response.ok) {
    throw new Error(`Could not load ${config.label} sign for ${letter}.`);
  }

  const dataUrl = await blobToDataUrl(await response.blob());
  signAssetCache.set(cacheKey, dataUrl);
  return dataUrl;
}

async function shareCardLetter(letter, language) {
  const config = LANGUAGES[language];

  const card = document.createElement('div');
  card.className = 'share-card__letter';

  const label = document.createElement('p');
  label.className = 'share-card__letter-name';
  label.textContent = letter;

  const box = document.createElement('div');
  box.className = 'share-card__letter-box';

  const image = document.createElement('img');
  image.alt = `${config.name} fingerspelling for the letter ${letter}`;

  try {
    image.src = await signImageDataUrl(language, letter);
    box.appendChild(image);
  } catch (error) {
    const visibleImage = [...el.output.querySelectorAll('.letter-card')].find(
      (item) => item.querySelector('.letter-card__letter')?.textContent?.trim() === letter
    )?.querySelector('.letter-card__image img');

    if (visibleImage?.currentSrc || visibleImage?.src) {
      image.src = visibleImage.currentSrc || visibleImage.src;
      box.appendChild(image);
    } else {
      const fallback = document.createElement('strong');
      fallback.textContent = letter;
      fallback.style.fontSize = '54px';
      fallback.style.lineHeight = '1';
      box.appendChild(fallback);
    }
  }

  card.append(label, box);
  return card;
}

async function renderShareCard() {
  if (!el.shareCard) return;

  const language = state.lang;
  const config = LANGUAGES[language];
  const word = state.word;
  const count = letterCount(word);

  el.shareCard.className = `share-card share-card--${shareImageState.style}`;
  if (count > 12) {
    el.shareCard.classList.add('share-card--very-dense');
  } else if (count > 6) {
    el.shareCard.classList.add('share-card--dense');
  }

  el.shareCardTitle.textContent = `How to fingerspell ${word} in ${config.label} ${config.flag}`;
  el.shareCardLetters.replaceChildren();

  const letters = [...word].filter((char) => /[A-Z]/.test(char));
  const cards = await Promise.all(letters.map((letter) => shareCardLetter(letter, language)));
  el.shareCardLetters.append(...cards);

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

  await renderShareCard();

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
      ? 'ASL artwork is loaded from Wikimedia Commons. Open any sign to view its source and reuse information.'
      : 'BSL artwork is loaded from Wikimedia Commons. Open any sign to view its source and licence information.';
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

  const config = LANGUAGES[state.lang];

  if (el.mobileOutputTitle) {
    el.mobileOutputTitle.textContent = `How to fingerspell ${state.word} in ${config.label} ${config.flag}`;
  }

  if (el.mobileOutputMeta) {
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

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !el.imageModal?.hidden) closeImageMaker();
});

loadFromUrl();
render();
