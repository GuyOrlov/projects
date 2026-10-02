const CLASSROOM_LANGUAGES = {
  bsl: {
    label: 'BSL',
    name: 'British Sign Language',
    local(letter) { return `./assets/bsl/${letter}.svg`; },
    remote(letter) { return `https://commons.wikimedia.org/wiki/Special:Redirect/file/BSL_letter_${letter}.svg`; },
  },
  asl: {
    label: 'ASL',
    name: 'American Sign Language',
    local(letter) { return `./assets/asl/${letter}.svg`; },
    remote(letter) { return `https://commons.wikimedia.org/wiki/Special:Redirect/file/Sign_language_${letter}.svg`; },
  },
};

let classroomLanguage = 'bsl';

const wordsInput = document.querySelector('#classroom-words');
const preview = document.querySelector('#classroom-preview');
const generate = document.querySelector('#classroom-generate');
const printButton = document.querySelector('#classroom-print');
const quiz = document.querySelector('#classroom-quiz');
const languageButtons = [...document.querySelectorAll('[data-classroom-language]')];

function cleanClassroomText(value) {
  return value
    .toUpperCase()
    .replace(/[^A-Z\s'\-\n]/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function classroomItems() {
  return cleanClassroomText(wordsInput.value)
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 10);
}

function classroomImage(letter) {
  const config = CLASSROOM_LANGUAGES[classroomLanguage];
  const image = document.createElement('img');
  image.src = config.local(letter);
  image.alt = `${config.name} fingerspelling for ${letter}`;
  image.loading = 'eager';
  image.dataset.source = 'local';

  image.addEventListener('error', () => {
    if (image.dataset.source === 'local') {
      image.dataset.source = 'remote';
      image.src = config.remote(letter);
    }
  });

  return image;
}

function letterCard(letter) {
  const card = document.createElement('div');
  card.className = 'classroom-letter';

  const label = document.createElement('strong');
  label.textContent = letter;

  card.append(label, classroomImage(letter));
  return card;
}

function phraseBlock(value) {
  const section = document.createElement('article');
  section.className = 'classroom-word';

  const title = document.createElement('h2');
  title.textContent = value;

  const letters = document.createElement('div');
  letters.className = 'classroom-word__letters';

  [...value].forEach((char) => {
    if (/[A-Z]/.test(char)) letters.appendChild(letterCard(char));
  });

  section.append(title, letters);
  return section;
}

function renderClassroom() {
  const items = classroomItems();
  preview.replaceChildren(...items.map(phraseBlock));
}

function setClassroomLanguage(language) {
  if (!CLASSROOM_LANGUAGES[language]) return;
  classroomLanguage = language;

  languageButtons.forEach((button) => {
    const active = button.dataset.classroomLanguage === language;
    button.classList.toggle('language-pill--active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  renderClassroom();
}

const params = new URLSearchParams(window.location.search);
const initialLanguage = params.get('lang');
const initialWords = params.get('words');

if (CLASSROOM_LANGUAGES[initialLanguage]) classroomLanguage = initialLanguage;
if (initialWords) wordsInput.value = cleanClassroomText(initialWords);

languageButtons.forEach((button) => {
  button.addEventListener('click', () => setClassroomLanguage(button.dataset.classroomLanguage));
});

generate.addEventListener('click', renderClassroom);
printButton.addEventListener('click', () => window.print());
quiz.addEventListener('change', () => {
  document.body.classList.toggle('quiz-mode', quiz.checked);
});

setClassroomLanguage(classroomLanguage);
