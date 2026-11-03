(() => {
  const phases = [...document.querySelectorAll('.phase')];
  const expand = document.querySelector('[data-expand]');
  const sync = () => {
    const allOpen = phases.every(phase => phase.open);
    expand.textContent = allOpen ? 'Свернуть все этапы' : 'Развернуть все этапы';
    expand.setAttribute('aria-expanded', String(allOpen));
  };
  const showTarget = hash => {
    const target = document.getElementById(hash.slice(1));
    if (target?.matches('details')) target.open = true;
  };
  document.querySelectorAll('.overview a').forEach(link => {
    link.addEventListener('click', () => showTarget(link.hash));
  });
  expand.addEventListener('click', () => {
    const open = !phases.every(phase => phase.open);
    phases.forEach(phase => { phase.open = open; });
    sync();
  });
  phases.forEach(phase => phase.addEventListener('toggle', sync));
  window.addEventListener('hashchange', () => showTarget(location.hash));
  showTarget(location.hash);
  document.querySelector('[data-print]').addEventListener('click', () => window.print());
  let printState = null;
  window.addEventListener('beforeprint', () => {
    const details = [...document.querySelectorAll('details:not(.matrix-details)')];
    printState = details.map(detail => [detail, detail.open]);
    details.forEach(detail => { detail.open = true; });
  });
  window.addEventListener('afterprint', () => {
    printState?.forEach(([detail, open]) => { detail.open = open; });
    printState = null;
    sync();
  });
  sync();
})();
