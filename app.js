// ─── Counter Animation ───────────────────────────────────────────────────────
function animateCounter(el, target, duration = 1800, prefix = '', suffix = '') {
  const start = performance.now();
  const startVal = 0;
  const isFloat = target % 1 !== 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = startVal + (target - startVal) * ease;
    el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ─── Intersection Observer for scroll reveals ────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Trigger counters
        const counters = entry.target.querySelectorAll('[data-count]');
        counters.forEach(el => {
          const target = parseFloat(el.dataset.count);
          const prefix = el.dataset.prefix || '';
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, 1800, prefix, suffix);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ─── Nav scroll style ────────────────────────────────────────────────────────
function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.borderBottomColor = window.scrollY > 10
      ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.07)';
  });
}

// ─── Live feed ticker ────────────────────────────────────────────────────────
const feedEvents = [
  { company: 'Motionlab', amount: '$420', type: 'recovered', time: 'just now' },
  { company: 'Stackio',   amount: '$1,200', type: 'recovered', time: '1m ago' },
  { company: 'Driftbase', amount: '$340', type: 'retrying', time: '2m ago' },
  { company: 'Vaultly',   amount: '$890', type: 'recovered', time: '4m ago' },
  { company: 'Funnelry',  amount: '$215', type: 'recovered', time: '5m ago' },
  { company: 'Clearnode', amount: '$760', type: 'retrying', time: '7m ago' },
  { company: 'Prismatic', amount: '$1,540', type: 'recovered', time: '9m ago' },
  { company: 'Loopform',  amount: '$330', type: 'recovered', time: '11m ago' },
];

function initLiveFeed(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let index = 0;
  function addEvent() {
    const event = feedEvents[index % feedEvents.length];
    const row = document.createElement('div');
    row.className = 'feed-row feed-row-new';
    row.innerHTML = `
      <span class="feed-company">${event.company}</span>
      <span class="feed-amount ${event.type === 'recovered' ? 'accent' : 'yellow'} mono">${event.amount}</span>
      <span class="feed-status tag ${event.type === 'recovered' ? 'tag-green' : 'tag-yellow'}">${event.type}</span>
      <span class="feed-time muted mono">${event.time}</span>
    `;
    container.prepend(row);
    setTimeout(() => row.classList.remove('feed-row-new'), 50);
    if (container.children.length > 6) container.lastElementChild.remove();
    index++;
  }

  feedEvents.forEach((_, i) => {
    setTimeout(() => {
      const event = feedEvents[i];
      const row = document.createElement('div');
      row.className = 'feed-row';
      row.innerHTML = `
        <span class="feed-company">${event.company}</span>
        <span class="feed-amount ${event.type === 'recovered' ? 'accent' : 'yellow'} mono">${event.amount}</span>
        <span class="feed-status tag ${event.type === 'recovered' ? 'tag-green' : 'tag-yellow'}">${event.type}</span>
        <span class="feed-time muted mono">${event.time}</span>
      `;
      container.appendChild(row);
    }, i * 100);
  });

  setInterval(addEvent, 3200);
}

// ─── Init ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavScroll();

  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.55s ease, transform 0.55s ease; }
    .reveal.revealed { opacity: 1; transform: none; }
    .reveal:nth-child(2) { transition-delay: 0.08s; }
    .reveal:nth-child(3) { transition-delay: 0.16s; }
    .reveal:nth-child(4) { transition-delay: 0.24s; }
    .reveal:nth-child(5) { transition-delay: 0.32s; }
    .feed-row {
      display: grid; grid-template-columns: 1fr auto auto auto; align-items: center;
      gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border);
      font-size: 13px; transition: opacity 0.3s, transform 0.3s;
    }
    .feed-row-new { animation: feedSlide 0.3s ease both; }
    @keyframes feedSlide { from { opacity:0; transform: translateY(-12px); } to { opacity:1; transform:none; } }
    .feed-company { font-weight: 500; }
    .feed-time { font-size: 11px; }
    .yellow { color: var(--yellow); }
  `;
  document.head.appendChild(style);
});
