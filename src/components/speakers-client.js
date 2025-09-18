const formatToDot = date => {
  const s = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(date);
  return s.replace(':', '.') + 'h';
};

const getFlagUrl = code =>
  code ? `https://flagcdn.com/w20/${code.toLowerCase()}.png` : '';

let tzMapPromise = null;

const setFallback = el => {
  if (!el) return;
  el.textContent = '🌐';
};

const insertFlagImg = (container, code) => {
  if (!container || !code) return setFallback(container);

  const url = getFlagUrl(code);
  if (!url) return setFallback(container);

  const img = document.createElement('img');
  img.src = url;
  img.srcset = `${url} 1x, https://flagcdn.com/w40/${code.toLowerCase()}.png 2x`;
  img.alt = code;
  img.width = 20;
  img.height = 14;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.className = 'flag-img';
  img.onerror = () => setFallback(container);

  container.replaceChildren(img);
};

const run = () => {
  document.querySelectorAll('li.talk-item').forEach(root => {
    try {
      const tNode = root.querySelector('time.event-local-time[data-event-iso]');
      const flagContainer = root.querySelector('.event-flag');

      // === Hora ===
      if (tNode?.dataset.eventIso) {
        const d = new Date(tNode.dataset.eventIso);
        if (!isNaN(d)) {
          tNode.setAttribute('datetime', d.toISOString());
          tNode.textContent = formatToDot(d);
        }
      }

      // === Bandera ===
      if (!flagContainer) return;

      const explicit = flagContainer.dataset.country?.trim();
      if (explicit) return insertFlagImg(flagContainer, explicit);

      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone?.trim();
      if (!tz) return setFallback(flagContainer);

      if (!tzMapPromise) {
        tzMapPromise = import('/src/lib/tz-to-country.js')
          .then(mod => mod.tzToCountry || {})
          .catch(() => ({}));
      }

      tzMapPromise.then(map => {
        insertFlagImg(flagContainer, map[tz]);
      }).catch(() => setFallback(flagContainer));

    } catch (err) {
      console.error('speakers-client error:', err);
    }
  });
};

const controller = new AbortController();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', run, { signal: controller.signal });
} else {
  run();
}
