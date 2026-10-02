const METRICS_STORAGE_KEY = 'signmyword-metrics-v1';

const LABELS = {
  word_generated: 'Words generated',
  image_maker_opened: 'Image maker opened',
  image_downloaded: 'Images downloaded',
  image_shared: 'Images shared',
  image_copied: 'Images copied',
  link_copied: 'Links copied',
  whatsapp_clicked: 'WhatsApp clicks',
  native_shared: 'Native shares',
  practice_started: 'Practice starts',
  practice_revealed: 'Practice reveals',
  surprise_used: 'Surprise me uses',
  embed_copied: 'Embeds copied',
  language_selected: 'Language switches',
};

function readMetrics() {
  try {
    const data = JSON.parse(localStorage.getItem(METRICS_STORAGE_KEY) || '{}');
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

function pct(part, whole) {
  if (!whole) return '0%';
  return `${Math.round((part / whole) * 100)}%`;
}

function render() {
  const metrics = readMetrics();
  const grid = document.querySelector('#insights-grid');
  const funnel = document.querySelector('#insights-funnel');
  const generated = Number(metrics.word_generated) || 0;

  grid.replaceChildren();

  Object.entries(LABELS).forEach(([key, label]) => {
    const card = document.createElement('article');
    card.className = 'insight-card';

    const value = document.createElement('strong');
    value.textContent = (Number(metrics[key]) || 0).toLocaleString();

    const name = document.createElement('span');
    name.textContent = label;

    card.append(value, name);
    grid.appendChild(card);
  });

  const rows = [
    ['Image maker opened', Number(metrics.image_maker_opened) || 0],
    ['Image downloaded', Number(metrics.image_downloaded) || 0],
    ['Image shared', Number(metrics.image_shared) || 0],
    ['WhatsApp clicked', Number(metrics.whatsapp_clicked) || 0],
    ['Link copied', Number(metrics.link_copied) || 0],
  ];

  funnel.innerHTML = rows.map(([label, value]) =>
    `<div class="funnel-row"><span>${label}</span><strong>${value.toLocaleString()}</strong><span>${pct(value, generated)} of generated words</span></div>`
  ).join('');
}

document.querySelector('#reset-insights').addEventListener('click', () => {
  if (!confirm('Reset SignMyWord analytics stored in this browser?')) return;
  localStorage.removeItem(METRICS_STORAGE_KEY);
  render();
});

render();
