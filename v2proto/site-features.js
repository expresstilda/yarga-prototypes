(() => {
  const offers = {
    home: ['Бесплатный дизайн-проект мебели', 'Расскажите, какая мебель нужна. Подберём планировку, фасады и наполнение по размерам вашего помещения.', 'kitchens'],
    catalog: ['Бесплатный дизайн-проект мебели', 'Выберите тип мебели и расскажите о размерах комнаты. Обсудим материалы и наполнение.', 'wardrobes'],
    kitchens: ['Бесплатный дизайн-проект кухни', 'Продумайте с дизайнером рабочую зону, расположение техники и места для хранения. Подберём фасады под ваш интерьер.', 'kitchens'],
    wardrobes: ['Бесплатный дизайн-проект шкафа', 'Подберём двери и наполнение под ваши вещи. Учтём нишу, высоту потолка и место для открывания.', 'wardrobes'],
    dressing: ['Бесплатный дизайн-проект гардеробной', 'Распределим штанги, полки и выдвижные секции так, чтобы обувь, длинная одежда и повседневные вещи были под рукой.', 'dressing'],
    living: ['Бесплатный дизайн-проект мебели для гостиной', 'Спланируем ТВ-зону, стеллаж или витрину с учётом розеток, проходов и того, что нужно хранить.', 'living'],
    hallways: ['Бесплатный дизайн-проект прихожей', 'Найдём место для верхней одежды, обуви и скамьи. Учтём ширину прохода и открывание входной двери.', 'hallways'],
    offices: ['Бесплатный дизайн-проект кабинета', 'Расположим стол, полки и шкафы с учётом света, техники и хранения документов.', 'offices'],
    business: ['Бесплатный дизайн-проект мебели для вашего объекта', 'Обсудим стойку, рабочие места и хранение. Учтём план помещения и задачи команды.', 'offices'],
    about: ['Бесплатный дизайн-проект мебели', 'Расскажите о комнате и мебели, которую хотите заказать. Подберём материалы и покажем, как будет выглядеть мебель.', 'wardrobes'],
    delivery: ['Бесплатный дизайн-проект мебели', 'При проектировании учтём габариты комнаты, проходы и особенности установки.', 'hallways'],
    payment: ['Бесплатный дизайн-проект и предварительный расчёт', 'По вашим размерам подберём материалы, фурнитуру и наполнение, чтобы рассчитать стоимость.', 'kitchens']
  };

  const photos = window.YargaInstallations;
  const wire = () => !!document.querySelector('link[href*="wireframe.css"]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const asset = photo => wire() ? 'assets/work-placeholder.svg' : `assets/installations/${photo.image}`;
  const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));

  function getSelection() {
    const groups = Object.values(photos);
    return Array.from({length:Math.max(...groups.map(group => group.length))}, (_, i) =>
      groups.flatMap(group => group[i] ? [group[i]] : [])
    ).flat();
  }

  function addInstallations() {
    const section = document.getElementById('portfolio');
    const selection = getSelection();
    section.className = 'section installations';
    section.setAttribute('aria-labelledby','installations-title');
    section.innerHTML = `<div class="container installations-head">
      <div><h2 id="installations-title">Фото с последних объектов</h2><p>Кухни, шкафы и другая мебель Ярги после установки.</p></div>
      <div class="installations-controls" aria-label="Управление лентой">
        <button type="button" class="round-button" data-installation-step="-1" aria-controls="installation-track" aria-label="Предыдущие фотографии">←</button>
        <button type="button" class="round-button" data-installation-step="1" aria-controls="installation-track" aria-label="Следующие фотографии">→</button>
      </div>
    </div>
    <div id="installation-track" class="installations-track" role="region" aria-label="Мебель на объектах" tabindex="0">${selection.map((photo,i) => `
      <figure class="installation-frame${photo.portrait ? ' installation-portrait' : ''}">
        <button type="button" data-installation-index="${i}" aria-label="Открыть фото: ${esc(photo.alt)}">
          <img src="${asset(photo)}" alt="${esc(photo.alt)}" loading="lazy" decoding="async" draggable="false" width="800" height="600">
        </button>
        <figcaption>${esc(photo.alt)}</figcaption>
      </figure>`).join('')}
    </div>
    <div class="container installations-footer"><a class="text-button" href="projects.html">Посмотреть проекты с описанием <span aria-hidden="true">↗</span></a></div>`;
    const track = section.querySelector('.installations-track');
    const frames = [...track.children];
    const move = direction => {
      track.classList.remove('is-autoplay-paused');
      const current = track.scrollLeft;
      const end = track.scrollWidth - track.clientWidth;
      const start = frames[0].offsetLeft;
      const offsets = frames.map(frame => frame.offsetLeft - start);
      const wrap = direction > 0 ? current >= end - 2 : current <= 2;
      const left = wrap ? (direction > 0 ? 0 : end) : direction > 0
        ? offsets.find(offset => offset > current + 3) ?? end
        : offsets.findLast(offset => offset < current - 3) ?? 0;
      track.scrollTo({left, behavior:reduced.matches || wrap ? 'instant' : 'smooth'});
    };

    const autoplayDelay = 1250;
    let visible = false;
    let hovered = false;
    let heldPointer;
    let autoplay;
    let automaticMove = false;

    function scheduleAutoplay() {
      clearTimeout(autoplay);
      if (!visible || document.hidden || reduced.matches || hovered || heldPointer !== undefined) return;
      autoplay = setTimeout(() => {
        if (!section.querySelector(':focus-visible') && !document.querySelector('dialog[open]')) {
          move(1);
          automaticMove = true;
        }
        scheduleAutoplay();
      }, autoplayDelay);
    }

    function pauseAutoplay() {
      if (automaticMove) {
        const left = track.scrollLeft;
        track.classList.add('is-autoplay-paused');
        track.scrollTo({left, behavior:'instant'});
        automaticMove = false;
      }
      scheduleAutoplay();
    }

    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      pauseAutoplay();
    }, {threshold:.25}).observe(section);
    section.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      hovered = true;
      pauseAutoplay();
    });
    section.addEventListener('pointerleave', event => {
      if (event.pointerType === 'touch') return;
      hovered = false;
      scheduleAutoplay();
    });
    section.addEventListener('focusin', event => {
      if (event.target.matches(':focus-visible')) pauseAutoplay();
    });
    document.addEventListener('visibilitychange', pauseAutoplay);
    reduced.addEventListener('change', pauseAutoplay);

    section.addEventListener('click',event => {
      const step = event.target.closest('[data-installation-step]');
      if (step) {
        pauseAutoplay();
        move(Number(step.dataset.installationStep));
      }
      const photo = event.target.closest('[data-installation-index]');
      if (photo) window.YargaGallery.open(selection.map(item => ({src:asset(item),alt:item.alt})), Number(photo.dataset.installationIndex));
    });
    track.addEventListener('keydown',event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      pauseAutoplay();
      move(event.key === 'ArrowRight' ? 1 : -1);
    });
    track.addEventListener('wheel',event => {
      if (event.deltaX || event.shiftKey) pauseAutoplay();
    }, {passive:true});

    let drag;
    let suppressClick = false;
    track.addEventListener('pointerdown',event => {
      if (!event.isPrimary || event.button !== 0) return;
      heldPointer = event.pointerId;
      pauseAutoplay();
      suppressClick = false;
      if (event.pointerType !== 'mouse') return;
      const left = track.scrollLeft;
      track.scrollTo({left, behavior:'instant'});
      drag = {id:event.pointerId, x:event.clientX, left};
    });
    window.addEventListener('pointermove',event => {
      if (drag?.id !== event.pointerId) return;
      const delta = event.clientX - drag.x;
      if (!suppressClick) {
        if (Math.abs(delta) < 7) return;
        suppressClick = true;
        track.classList.add('is-dragging');
        track.setPointerCapture(event.pointerId);
      }
      event.preventDefault();
      track.scrollLeft = drag.left - delta;
    });
    const finishDrag = event => {
      if (heldPointer !== event.pointerId) return;
      track.classList.remove('is-dragging');
      heldPointer = undefined;
      drag = undefined;
      scheduleAutoplay();
    };
    window.addEventListener('pointerup',finishDrag);
    window.addEventListener('pointercancel',finishDrag);
    track.addEventListener('click',event => {
      if (!suppressClick || event.detail === 0) return;
      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    }, true);
  }

  const offerHistoryCookie = 'yarga_design_offer';
  const offerSitePath = new URL('.',location.href).pathname.replace(/v2proto\/$/,'');
  const offerStorageKey = `${offerHistoryCookie}:${offerSitePath}`;
  const day = 24 * 60 * 60 * 1000;
  const offerCooldown = 7 * day;
  const offerWindow = 90 * day;
  const offerLimit = 2;

  function offerHistory(now){
    let value;
    try{
      value=document.cookie.split('; ').find(part=>part.startsWith(`${offerHistoryCookie}=`))?.split('=')[1];
    }catch{}
    if(!value){
      try{ value=localStorage.getItem(offerStorageKey); }catch{}
    }
    const parsed=typeof value==='string' && /^[0-2]\.\d+\.\d+$/.test(value);
    if(parsed){
      const [count,first,last]=value.split('.').map(Number);
      if(first>0 && last>=first && now-first<offerWindow)return {count,first,last};
    }
    return {count:0,first:now,last:0};
  }

  function rememberOffer(history, now, manual){
    const record=`${history.count+(manual?0:1)}.${history.first}.${now}`;
    const expires=Math.ceil((history.first+offerWindow-now)/1000);
    const secure=location.protocol==='https:'?'; Secure':'';
    try{ document.cookie=`${offerHistoryCookie}=${record}; Path=${offerSitePath}; Max-Age=${expires}; SameSite=Lax${secure}`; }catch{}
    try{ localStorage.setItem(offerStorageKey,record); }catch{}
  }

  function addOffer(page) {
    const partnerPage = page === 'business';
    const startDesign = () => {
      if (partnerPage) window.YargaContact.open('business', true);
      else window.YargaQuiz.open(photos[page] ? page : undefined, undefined, 'design');
    };
    const [title, description, picture] = offers[page] || offers.catalog;
    const dialog = document.createElement('dialog');
    dialog.id = 'design-offer';
    dialog.className = 'design-offer';
    dialog.dataset.offerSection = page;
    dialog.setAttribute('aria-labelledby','design-offer-title');
    dialog.innerHTML = `<button type="button" class="dialog-close" data-offer-close aria-label="Закрыть предложение">×</button>
      <div class="design-offer-image"><img src="${wire() ? 'assets/work-placeholder.svg' : `assets/category-${picture}.webp`}" alt="" width="640" height="800" decoding="async" loading="lazy"></div>
      <div class="design-offer-copy"><span class="design-offer-brand">ЯРГА</span><h2 id="design-offer-title" tabindex="-1">${title}</h2><p>${description}</p>
      <button type="button" class="button button-primary" data-offer-start>${partnerPage ? 'Заполнить заявку' : 'Ответить на вопросы'} <span aria-hidden="true">↗</span></button>
      <button type="button" class="design-offer-dismiss" data-offer-close>Закрыть</button></div>`;
    document.getElementById('overlays').append(dialog);
    let engaged = false;
    let shownOnPage = false;
    let legacySeen = false;
    let previousFocus;
    try{ legacySeen=Object.keys(sessionStorage).some(key=>key.startsWith('yarga-design-seen:') && sessionStorage.getItem(key)==='1'); }catch{}
    const interacted = () => engaged || !!document.querySelector('dialog[open], .site-header.menu-open');
    const show = () => {
      if (dialog.open || document.querySelector('dialog[open]')) return;
      if(shownOnPage || legacySeen || interacted() || document.hidden || !document.hasFocus())return;
      const now=Date.now();
      const history=offerHistory(now);
      if(history.count>=offerLimit || (history.last>0 && now-history.last<offerCooldown))return;
      previousFocus = document.activeElement;
      dialog.showModal();
      shownOnPage=true;
      rememberOffer(history,now,false);
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
      startDesign();
    });
    document.addEventListener('click',event => {
      if (event.target.closest('[data-design-start]')) {
        engaged = true;
        const now = Date.now();
        rememberOffer(offerHistory(now), now, true);
        startDesign();
        return;
      }
      if (event.target.closest('[data-form], [data-quiz], [data-solution-quote], [data-fast-inquiry], a[href^="tel:"], a[href*="t.me/"], a[href*="max.ru/"]')) engaged = true;
    });
    const started = performance.now();
    const timer = setInterval(() => {
      if (shownOnPage || legacySeen || engaged) { clearInterval(timer); return; }
      if (performance.now() - started >= 22000 && scrollY >= Math.min(500, innerHeight * .55)) show();
    }, 1000);
    document.addEventListener('mouseout',event => {
      if (matchMedia('(pointer:fine)').matches && !event.relatedTarget && event.clientY <= 0 && performance.now() - started >= 14000) show();
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
    if (page === 'home') addInstallations();
    if (page !== 'designers') addOffer(section);
  });
})();
