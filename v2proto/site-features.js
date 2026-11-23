(() => {
  const offers = {
    home: ['Бесплатный дизайн-проект мебели', 'Расскажите, какая мебель нужна. Подберём планировку, фасады и наполнение по размерам вашего помещения.', 'kitchens'],
    catalog: ['Бесплатный дизайн-проект мебели', 'Выберите, что хотите заказать. Поможем подобрать конструкцию, материалы и комплектацию.', 'wardrobes'],
    kitchens: ['Бесплатный дизайн-проект кухни', 'Продумайте с дизайнером рабочую зону, расположение техники и места для хранения. Подберём фасады под ваш интерьер.', 'kitchens'],
    wardrobes: ['Бесплатный дизайн-проект шкафа', 'Подберём двери и наполнение под ваши вещи. Учтём нишу, высоту потолка и место для открывания.', 'wardrobes'],
    dressing: ['Бесплатный дизайн-проект гардеробной', 'Распределим штанги, полки и выдвижные секции так, чтобы обувь, длинная одежда и повседневные вещи были под рукой.', 'dressing'],
    living: ['Бесплатный дизайн-проект мебели для гостиной', 'Спланируем ТВ-зону, стеллаж или витрину с учётом розеток, проходов и того, что нужно хранить.', 'living'],
    hallways: ['Бесплатный дизайн-проект прихожей', 'Найдём место для верхней одежды, обуви и скамьи. Учтём ширину прохода и открывание входной двери.', 'hallways'],
    offices: ['Бесплатный дизайн-проект кабинета', 'Расположим стол, полки и шкафы с учётом света, техники и хранения документов.', 'offices'],
    business: ['Бесплатный дизайн-проект мебели для вашего объекта', 'Обсудим стойку, рабочие места и хранение. Учтём план помещения и задачи команды.', 'offices'],
    designers: ['Поможем с дизайн-проектом мебели', 'Обсудим ваш эскиз и бесплатно подготовим решение по размерам, материалам и конструкции мебели.', 'living'],
    about: ['Начните с бесплатного дизайн-проекта', 'Расскажите о помещении. Подберём материалы и покажем, как мебель будет выглядеть в вашем пространстве.', 'wardrobes'],
    delivery: ['Бесплатный дизайн-проект мебели', 'При проектировании учтём габариты комнаты, проходы и особенности установки.', 'hallways'],
    payment: ['Бесплатный дизайн-проект и предварительный расчёт', 'Согласуем, какие секции, материалы и фурнитура нужны для вашего проекта.', 'kitchens']
  };

  const photos = window.YargaInstallations;
  const wire = () => !!document.querySelector('link[href*="wireframe.css"]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const asset = photo => wire() ? 'assets/work-placeholder.svg' : `assets/installations/${photo.image}`;
  const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));

  function getSelection(page) {
    const groups = Object.values(photos);
    const mixed = Array.from({length:Math.max(...groups.map(group => group.length))}, (_, i) =>
      groups.flatMap(group => group[i] ? [group[i]] : [])
    ).flat();
    if (!photos[page]) return mixed;
    const more = mixed.filter(photo => !photos[page].includes(photo));
    return [...photos[page], ...more];
  }

  function addInstallations(page) {
    const section = document.getElementById('portfolio') ?? document.createElement('section');
    const selection = getSelection(page);
    section.id = 'portfolio';
    section.className = 'section installations';
    section.setAttribute('aria-labelledby','installations-title');
    section.innerHTML = `<div class="container installations-head">
      <div><h2 id="installations-title">Фото с объектов Ярги</h2><p>Посмотрите, как мебель выглядит после установки.</p></div>
      <div class="installations-controls" aria-label="Управление лентой">
        <button type="button" class="round-button" data-installation-step="-1" aria-label="Предыдущие фотографии">←</button>
        <button type="button" class="round-button" data-installation-pause aria-label="Остановить автоматическую прокрутку" aria-pressed="false">Ⅱ</button>
        <button type="button" class="round-button" data-installation-step="1" aria-label="Следующие фотографии">→</button>
      </div>
    </div>
    <div class="installations-track" role="region" aria-label="Мебель на объектах" tabindex="0">${selection.map((photo,i) => `
      <figure class="installation-frame${photo.portrait ? ' installation-portrait' : ''}">
        <button type="button" data-installation-index="${i}" aria-label="Открыть фото: ${esc(photo.alt)}">
          <img src="${asset(photo)}" alt="${esc(photo.alt)}" loading="lazy" decoding="async" width="800" height="600">
        </button>
        <figcaption>${esc(photo.alt)}</figcaption>
      </figure>`).join('')}
    </div>
    <div class="container installations-footer"><a class="text-button" href="projects.html">Кейсы и детали работ <span aria-hidden="true">↗</span></a> <button type="button" class="text-button" data-design-offer>Получить бесплатный дизайн-проект <span aria-hidden="true">↗</span></button></div>`;
    if (!section.isConnected) {
      const before = document.querySelector('#main #reviews, #main .catalog-faq');
      if (before) before.before(section);
      else document.getElementById('main').append(section);
    }
    const track = section.querySelector('.installations-track');
    const frames = [...track.children];
    const pauseButton = section.querySelector('[data-installation-pause]');
    let visible = false;
    let paused = false;
    const move = direction => {
      const start = frames[0].offsetLeft;
      const end = track.scrollWidth - track.clientWidth;
      const offsets = frames.map(frame => frame.offsetLeft - start);
      const left = direction > 0
        ? (track.scrollLeft >= end - 2 ? 0 : offsets.find(offset => offset > track.scrollLeft + 3) ?? end)
        : (track.scrollLeft <= 2 ? end : offsets.findLast(offset => offset < track.scrollLeft - 3) ?? 0);
      track.scrollTo({left, behavior:reduced.matches ? 'instant' : 'smooth'});
    };
    const updatePause = () => {
      pauseButton.hidden = reduced.matches;
      pauseButton.textContent = paused ? '▶' : 'Ⅱ';
      pauseButton.setAttribute('aria-pressed',String(paused));
      pauseButton.setAttribute('aria-label',paused ? 'Включить автоматическую прокрутку' : 'Остановить автоматическую прокрутку');
    };
    updatePause();
    reduced.addEventListener('change',updatePause);
    section.addEventListener('click',event => {
      const step = event.target.closest('[data-installation-step]');
      if (step) move(Number(step.dataset.installationStep));
      if (event.target.closest('[data-installation-pause]')) { paused = !paused; updatePause(); }
      const photo = event.target.closest('[data-installation-index]');
      if (photo) window.YargaGallery.open(selection.map(item => ({src:asset(item),alt:item.alt})), Number(photo.dataset.installationIndex));
    });
    track.addEventListener('pointerdown',() => { paused = true; updatePause(); });
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, {threshold:.2}).observe(section);
    setInterval(() => {
      if (visible && !paused && !reduced.matches && !document.hidden && !section.matches(':hover, :focus-within') && !document.querySelector('dialog[open]')) move(1);
    }, 4300);
  }

  function addOffer(page) {
    const [title, description, picture] = offers[page] || offers.catalog;
    const dialog = document.createElement('dialog');
    dialog.id = 'design-offer';
    dialog.className = 'design-offer';
    dialog.dataset.offerSection = page;
    dialog.setAttribute('aria-labelledby','design-offer-title');
    dialog.innerHTML = `<button type="button" class="dialog-close" data-offer-close aria-label="Закрыть предложение">×</button>
      <div class="design-offer-image"><img src="${wire() ? 'assets/work-placeholder.svg' : `assets/category-${picture}.webp`}" alt="" width="640" height="800" decoding="async" loading="lazy"></div>
      <div class="design-offer-copy"><span class="design-offer-brand">ЯРГА</span><h2 id="design-offer-title" tabindex="-1">${title}</h2><p>${description}</p>
      <button type="button" class="button button-primary" data-offer-start>Получить дизайн-проект <span aria-hidden="true">↗</span></button>
      <button type="button" class="design-offer-dismiss" data-offer-close>Продолжить просмотр</button></div>`;
    document.getElementById('overlays').append(dialog);
    const key = `yarga-design-seen:${page}`;
    let engaged = false;
    let seen = false;
    let previousFocus;
    try { seen = sessionStorage.getItem(key) === '1'; } catch {}
    const interacted = () => engaged || !!document.querySelector('dialog[open], .site-header.menu-open');
    const show = manual => {
      if (dialog.open || document.querySelector('dialog[open]')) return;
      if (!manual && (seen || interacted() || document.hidden || !document.hasFocus())) return;
      seen = true;
      try { sessionStorage.setItem(key,'1'); } catch {}
      previousFocus = document.activeElement;
      dialog.showModal();
      document.body.classList.add('locked');
      dialog.querySelector('h2').focus();
    };
    dialog.addEventListener('close',() => {
      if (!document.querySelector('dialog[open]')) { document.body.classList.remove('locked'); previousFocus?.focus(); }
    });
    dialog.addEventListener('click',event => {
      if (event.target.closest('[data-offer-close]') || event.target === dialog) dialog.close();
      if (!event.target.closest('[data-offer-start]')) return;
      dialog.close();
      if (page === 'business' || page === 'designers') window.YargaContact.open(page === 'designers' ? 'designer' : page, true);
      else window.YargaQuiz.open(photos[page] ? page : undefined, undefined, 'design');
    });
    document.addEventListener('click',event => {
      if (event.target.closest('[data-design-offer]')) show(true);
      if (event.target.closest('[data-form], [data-quiz], [data-solution-quote], [data-fast-inquiry], a[href^="tel:"], a[href*="t.me/"], a[href*="max.ru/"]')) engaged = true;
    });
    const started = performance.now();
    const timer = setInterval(() => {
      if (seen || engaged) { clearInterval(timer); return; }
      if (performance.now() - started >= 14000 && scrollY >= Math.min(500, innerHeight * .55)) show(false);
    }, 1000);
    document.addEventListener('mouseout',event => {
      if (matchMedia('(pointer:fine)').matches && !event.relatedTarget && event.clientY <= 0 && performance.now() - started > 8000) show(false);
    });
  }

  document.addEventListener('yarga:lead-action',event => {
    const {action, category, model, caseId} = event.detail;
    (window.dataLayer ??= []).push({event:'yarga_lead_action', lead_action:action, furniture_category:category, model_id:model, project_id:caseId});
  });

  document.addEventListener('DOMContentLoaded',() => {
    const page = document.body.dataset.page || 'home';
    const category = new URLSearchParams(location.search).get('category');
    const section = page === 'catalog' && Object.hasOwn(window.YargaCatalogData?.sections ?? {}, category) ? category : page;
    addInstallations(section);
    addOffer(section);
  });
})();
