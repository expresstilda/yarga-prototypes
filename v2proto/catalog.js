(() => {
  const {sections,solutions}=window.YargaCatalogData;
  const prices = window.YargaCatalogPricing ?? {};
  const rubles = new Intl.NumberFormat('ru-RU', {style:'currency', currency:'RUB', maximumFractionDigits:0});
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const wire=()=>!!document.querySelector('link[href*="wireframe.css"]');
  const image=name=>`assets/${wire()?name.replace(/\.(webp|jpg)$/i,'.svg'):name}`;
  let selected='all',filters={style:'',tone:'',type:''},sort='default',detail,previousFocus;
  const pageSize = 12;
  let visibleCount = pageSize;
  let moreButton, moreObserver;
  const current=()=>solutions.filter(s=>s.category===selected);
  const nav=()=>`<nav class="direction-nav container" aria-label="Разделы каталога"><a href="catalog.html" ${selected==='all'?'aria-current="page"':''}>Все решения</a>${Object.entries(sections).map(([id,s])=>`<a href="catalog.html?category=${id}" ${selected===id?'aria-current="page"':''}>${s.name}</a>`).join('')}</nav>`;
  const quiz=(label='Рассчитать стоимость',className='button button-primary')=>`<button class="${className}" data-quiz="${selected==='all'?'':selected}">${label} <span aria-hidden="true">↗</span></button>`;
  function fastInquiry(label, className, model){
    const category = model?.category || (selected === 'all' ? '' : selected);
    return `<button type="button" class="${className}" data-fast-inquiry data-fast-category="${esc(category)}"${model ? ` data-fast-model="${esc(model.id)}" aria-label="${esc(label)}: ${esc(model.name)}"` : ''}>${label} <span aria-hidden="true">↗</span></button>`;
  }
  function hero(){
    const section=sections[selected];
    return `<section class="catalog-hero ${wire()?'catalog-hero-wire':''}" aria-labelledby="category-title"><img src="${image(section?.image||'hero-kitchen.webp')}" alt="" fetchpriority="high" width="1600" height="650"><div class="container"><div class="catalog-breadcrumbs"><a href="index.html">Главная</a><span>›</span>${section?'<a href="catalog.html">Каталог</a><span>›</span>':'<span>Каталог</span>'}${section?`<span>${section.name}</span>`:''}</div><h1 id="category-title">${section?.title||'Каталог решений'}</h1><p class="catalog-hero-lead">${section?.lead||'Кухни, шкафы, гардеробные и другая мебель на заказ. Выберите модель, чтобы посмотреть цену базовой комплектации.'}</p><div class="catalog-hero-actions">${fastInquiry('Рассчитать по фото','button button-primary')}<a href="${section?'#solutions-heading':'#catalog-directions'}" class="button button-glass">Смотреть модели <span aria-hidden="true">↓</span></a></div><div class="catalog-promises"><span>Собственное производство</span><span>Индивидуальные размеры</span><span>Москва и МО</span></div></div></section>`;
  }
  function overview(){
    return `<section class="container catalog-overview" id="catalog-directions"><div class="catalog-section-heading"><div><h2>Модели по разделам</h2></div><p>В каждом разделе есть модели с ориентировочными ценами. Размеры, фасады и наполнение можно изменить.</p></div><div class="direction-grid">${Object.entries(sections).map(([id,s])=>`<a class="direction-card" href="catalog.html?category=${id}"><div><img src="${image(s.image)}" alt="${s.name}" loading="lazy" width="1448" height="1086"><span aria-hidden="true">↗</span></div><h2>${s.name}</h2><p>${s.lead}</p><span class="direction-more">Смотреть модели →</span></a>`).join('')}</div></section>`;
  }
  function filtersMarkup(){
    const section=sections[selected],items=current();
    const fields=[['style','Стиль'],['tone','Цветовая гамма'],['type',section.typeLabel]];
    const search=new URLSearchParams(location.search);
    for(const [field] of fields){const options=[...new Set(items.map(s=>s[field]))];filters[field]=options.includes(search.get(field))?search.get(field):'';}
    sort=search.get('sort')==='name'?'name':'default';
    return `<section class="container solutions-section" aria-labelledby="solutions-heading"><div class="catalog-tags" aria-label="Популярные подборки">${section.tags.map(tag=>{const field=items.some(s=>s.type===tag)?'type':'tone';return `<button type="button" data-catalog-tag="${esc(tag)}" data-field="${field}" aria-pressed="false">${tag}</button>`;}).join('')}</div><div class="catalog-toolbar"><button class="catalog-filter-toggle" aria-expanded="false" aria-controls="catalog-facets">Фильтры <span aria-hidden="true">☷</span></button><div class="catalog-facets" id="catalog-facets">${fields.map(([field,label])=>`<label>${label}<select data-catalog-facet="${field}" aria-label="${label}"><option value="">Все варианты</option>${[...new Set(items.map(s=>s[field]))].map(value=>`<option value="${esc(value)}" ${filters[field]===value?'selected':''}>${value}</option>`).join('')}</select></label>`).join('')}<button class="catalog-reset" data-catalog-reset type="button">Сбросить</button></div><label class="catalog-sort"><span class="sr-only">Порядок решений</span><select data-catalog-sort aria-label="Порядок решений"><option value="default">По подборке</option><option value="name" ${sort==='name'?'selected':''}>По названию</option></select></label></div><div class="catalog-results-heading"><h2 id="solutions-heading">${selected==='kitchens'?'Модели кухонь':'Модели мебели'}</h2><p id="catalog-result-count" aria-live="polite"></p></div><div class="solutions-grid" id="solutions-grid"></div><div class="catalog-more"><button class="button button-outline" type="button" data-catalog-more aria-controls="solutions-grid" hidden>Показать ещё</button></div></section>`;
  }
  function priceAmount(price){
    return `<strong>от ${rubles.format(price.amount)}</strong>${price.unit ? `<span> / ${esc(price.unit)}</span>` : ''}`;
  }
  function priceDetails(price){
    if(!price)return '';
    return `<section class="solution-pricing-details" aria-labelledby="solution-price-heading" tabindex="-1">
      <h3 id="solution-price-heading">Базовая комплектация</h3>
      <p class="solution-price-amount">${priceAmount(price)}</p>
      <p class="solution-pricing-basis">${esc(price.basis)}</p>
      <dl class="solution-pricing-terms">
        <div><dt>Что входит</dt><dd>${esc(price.includes)}</dd></div>
        <div><dt>Считается отдельно</dt><dd>${esc(price.separate)}</dd></div>
        <div><dt>От чего зависит цена</dt><dd>${esc(price.factors)}</dd></div>
      </dl>
      ${price.note ? `<p class="solution-pricing-note">${esc(price.note)}</p>` : ''}
      <p class="solution-pricing-note">Стоимость ориентировочная. Итог уточним по размерам, материалам и наполнению.</p>
    </section>`;
  }
  function card(s){
    const price = prices[s.id];
    const summary = price ? `<div class="solution-price">
      <p class="solution-price-status">Базовая комплектация</p>
      <p class="solution-price-amount">${priceAmount(price)}</p>
      <button class="solution-price-link" type="button" data-solution="${esc(s.id)}" data-solution-price aria-label="Что входит в цену: ${esc(s.name)}">Что входит в цену</button>
    </div>` : '<span>Индивидуальный расчёт</span>';
    return `<article class="solution-card"><button class="solution-picture" data-solution="${s.id}" aria-label="Подробнее: ${esc(s.name)}"><img src="${image(s.image)}" alt="${esc(s.name)}" loading="lazy" width="1448" height="1086"><span class="solution-expand" aria-hidden="true">↗</span></button><div class="solution-meta"><span>${s.code?esc(s.code)+" · ":""}${s.style}</span><span>${s.type}</span></div><h3><button data-solution="${s.id}">${s.name}</button></h3><p class="solution-description">${s.description}</p><div class="solution-bottom">${summary}<div class="solution-card-actions">${fastInquiry('Рассчитать по фото','text-button model-fast-link',s)}<button class="text-button model-quiz-link" data-quiz="${s.category}" data-quiz-model="${esc(s.id)}" aria-label="Рассчитать: ${esc(s.name)}">Ответить на вопросы</button></div></div></article>`;
  }
  function quizBanner(){
    const s=sections[selected];
    return `<section class="catalog-quiz-banner container"><div class="catalog-quiz-picture"><img src="${image(s?.image||'hero-kitchen.webp')}" alt="" loading="lazy" width="1448" height="1086"></div><div class="catalog-quiz-copy"><h2>Расчёт мебели по вашим размерам</h2><p>Ответьте на вопросы о размерах, планировке и материалах. В конце оставьте имя и телефон. При желании приложите фото или план.</p>${quiz()}<span class="catalog-quiz-time">Около 2 минут · Можно без точных размеров</span></div></section>`;
  }
  function approach(){
    return `<section class="catalog-approach container"><div class="catalog-section-heading"><div><h2>Как заказать мебель</h2></div><p>${sections[selected]?.note||'Можно заказать отдельную тумбу или мебель для нескольких комнат.'}</p></div><div class="catalog-steps">${[['Обсуждаем задачу','Пришлите фото, эскиз или модель из каталога, которая вам нравится.'],['Уточняем размеры','На замере проверяем размеры помещения и условия для установки.'],['Согласуем проект','Согласуем материалы, наполнение и стоимость до начала изготовления.'],['Изготавливаем и устанавливаем','Заранее согласуем доставку и монтаж. После установки вместе проверим мебель.']].map(([title,text],i)=>`<article><span>0${i+1}</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div></section>`;
  }
  function faq(){
    const noun=sections[selected]?.name.toLowerCase()||'мебель';
    return `<section class="catalog-faq container"><div><h2>Вопросы о заказе</h2><button class="text-button" data-form="consult">Задать вопрос <span aria-hidden="true">↗</span></button></div><div class="faq-list">${[[selected==='all'?'Как рассчитать стоимость мебели?':`Сколько стоят ${noun}?`,'Цена зависит от габаритов, конструкции, материалов, фурнитуры и наполнения. Начнём с ваших размеров и пожеланий, затем согласуем состав проекта и стоимость.'],['Можно начать без точных размеров?','Да. Для первого обсуждения подойдут приблизительные размеры или план помещения. Точные габариты проверим на замере, возможность и время выезда согласуем заранее.'],['Можно изменить модель из каталога?','Да. Подберём размеры под вашу комнату. Отделку, полки, ящики и другие детали можно изменить.'],['Сколько занимает изготовление?','Срок зависит от проекта, материалов и текущей загрузки. Конкретную дату и этапы согласуем до заказа и зафиксируем в договоре.'],['Как устроены доставка и установка?','Доставку и монтаж в Москве и Московской области согласуем для вашего заказа. Адрес, подъём, условия доступа и стоимость работ обсудим заранее.']].map(([q,a],i)=>`<details ${i===0?'open':''}><summary>${q}</summary><div>${a}</div></details>`).join('')}</div></section>`;
  }
  function help(){
    return `<section class="catalog-help"><div class="container"><div><h2>Рассчитать мебель по фото</h2><p>Пришлите фото понравившейся мебели, эскиз или план комнаты. Если знаете примерные размеры, укажите их в комментарии к заявке.</p></div><div class="catalog-help-actions">${fastInquiry('Рассчитать по фото','button button-primary')}<button class="button button-outline" data-form="measure">Бесплатный замер <span aria-hidden="true">↗</span></button></div></div></section>`;
  }
  function render(){
    const id=new URLSearchParams(location.search).get('category');selected=sections[id]?id:'all';
    document.body.classList.add('catalog-page');
    document.title=`${sections[selected]?.title||'Каталог решений'} — ЯРГА`;
    document.querySelector('meta[name=description]')?.setAttribute('content',sections[selected]?.lead||'Кухни, шкафы, гардеробные и корпусная мебель Ярга на заказ в Москве и МО.');
    const reviews=document.getElementById('catalog-reviews-template')?.innerHTML||'';
    return `${hero()}${nav()}${selected==='all'?overview():filtersMarkup()}${quizBanner()}${approach()}${reviews}${faq()}${help()}`;
  }
  function observeMore(){
    if (!moreObserver) return;
    moreObserver.unobserve(moreButton);
    moreObserver.takeRecords();
    if (!moreButton.hidden) moreObserver.observe(moreButton);
  }
  function loadMore({ focusNew = false } = {}){
    if (moreButton.hidden) return;
    visibleCount += pageSize;
    refresh({ append: true, focusNew });
  }
  function refresh({ append = false, focusNew = false } = {}){
    const grid=document.getElementById('solutions-grid');if(!grid)return;
    const items=current().filter(s=>Object.entries(filters).every(([key,value])=>!value||s[key]===value));
    if(sort==='name')items.sort((a,b)=>a.name.localeCompare(b.name,'ru'));
    if (!append) visibleCount = pageSize;
    const before = append ? grid.children.length : 0;
    const result = items.slice(before, visibleCount);
    if (append) {
      grid.insertAdjacentHTML('beforeend', result.map(card).join(''));
      if (focusNew) grid.children[before]?.querySelector('.solution-picture')?.focus();
    } else {
      grid.innerHTML = result.length ? result.map(card).join('') : `<div class="catalog-empty"><h3>Модели не найдены</h3><p>Измените фильтры или сбросьте их, чтобы увидеть все модели раздела.</p><button class="button button-outline" data-catalog-reset>Сбросить фильтры</button></div>`;
    }
    const shown = Math.min(visibleCount, items.length);
    document.getElementById('catalog-result-count').textContent = shown < items.length
      ? `Показано ${shown} из ${items.length}`
      : `Найдено: ${items.length}`;
    moreButton.hidden = shown >= items.length;
    if (!moreButton.hidden) moreButton.textContent = `Показать ещё ${Math.min(pageSize, items.length - shown)}`;
    observeMore();
    if (append) return;
    document.querySelectorAll('[data-catalog-tag]').forEach(button=>button.setAttribute('aria-pressed',String(filters[button.dataset.field]===button.dataset.catalogTag)));
    document.querySelectorAll('[data-catalog-facet]').forEach(select=>select.value=filters[select.dataset.catalogFacet]);
    const active=Object.values(filters).some(Boolean);document.querySelectorAll('.catalog-reset').forEach(button=>button.hidden=!active);
    const url=new URL(location.href);for(const [key,value] of Object.entries(filters))value?url.searchParams.set(key,value):url.searchParams.delete(key);
    sort==='name'?url.searchParams.set('sort',sort):url.searchParams.delete('sort');if(location.protocol!=='file:')history.replaceState({},'',url);
  }
  function openSolution(id, showPrice){
    const s=solutions.find(item=>item.id===id);if(!s)return;
    previousFocus=document.activeElement;
    if(!detail){
      detail=document.createElement('dialog');detail.id='solution-dialog';detail.className='solution-dialog';detail.setAttribute('aria-labelledby','solution-title');document.getElementById('overlays').append(detail);
      detail.addEventListener('close',()=>{if(!document.querySelector('dialog[open]')){document.body.classList.remove('locked');previousFocus?.focus();}});
    }
    detail.innerHTML=`<button type="button" class="dialog-close" data-solution-close aria-label="Закрыть решение">×</button><div class="solution-dialog-layout"><div class="solution-dialog-image"><img src="${image(s.image)}" alt="${esc(s.name)}"></div><div class="solution-dialog-copy"><p class="eyebrow">${sections[s.category].name} · ${s.code?esc(s.code):"По вашим размерам"}</p><h2 id="solution-title">${s.name}</h2><p>${s.description}</p><dl><div><dt>Стиль</dt><dd>${s.style}</dd></div><div><dt>Цветовая гамма</dt><dd>${s.tone}</dd></div><div><dt>${sections[s.category].typeLabel}</dt><dd>${s.type}</dd></div></dl>${priceDetails(prices[s.id])}${window.YargaProjects?.relatedModel(s) ?? ''}${fastInquiry('Рассчитать по фото','button button-primary',s)}<button class="button button-outline" data-solution-quote="${s.category}" data-quiz-model="${esc(s.id)}">Ответить на вопросы <span aria-hidden="true">↗</span></button></div></div>`;
    closeMenus();detail.showModal();document.body.classList.add('locked');
    if(showPrice)detail.querySelector('.solution-pricing-details')?.focus();
  }
  function init(){
    if(document.body.dataset.page!=='catalog')return;
    const directions = document.querySelector('.direction-nav');
    const activeDirection = directions.querySelector('[aria-current="page"]');
    if (activeDirection && directions.scrollWidth > directions.clientWidth) {
      const nav = directions.getBoundingClientRect();
      const link = activeDirection.getBoundingClientRect();
      if (link.left < nav.left || link.right > nav.right) {
        directions.scrollLeft += link.left - nav.left - (nav.width - link.width) / 2;
      }
    }
    moreButton = document.querySelector('[data-catalog-more]');
    if (moreButton) {
      if ('IntersectionObserver' in window) {
        moreObserver = new IntersectionObserver(entries => {
          if (entries.at(-1).isIntersecting && document.activeElement !== moreButton) loadMore();
        }, { rootMargin: '0px 0px 450px' });
        moreButton.addEventListener('blur', observeMore);
      }
      moreButton.addEventListener('click', () => loadMore({ focusNew: true }));
    }
    refresh();
    document.addEventListener('change',event=>{
      const facet=event.target.closest('[data-catalog-facet]');if(facet){filters[facet.dataset.catalogFacet]=facet.value;refresh();}
      if(event.target.matches('[data-catalog-sort]')){sort=event.target.value;refresh();}
    });
    document.addEventListener('click',event=>{
      const tag=event.target.closest('[data-catalog-tag]');if(tag){const field=tag.dataset.field;filters[field]=filters[field]===tag.dataset.catalogTag?'':tag.dataset.catalogTag;refresh();}
      const reset=event.target.closest('[data-catalog-reset]');
      if(reset){
        filters={style:'',tone:'',type:''};
        refresh();
        const firstFacet=document.querySelector('[data-catalog-facet]');
        const focusTarget=firstFacet.getClientRects().length ? firstFacet : document.querySelector('.catalog-filter-toggle');
        focusTarget.focus();
      }
      const toggle=event.target.closest('.catalog-filter-toggle');if(toggle){const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));document.querySelector('.catalog-toolbar').classList.toggle('filters-open',open);}
      const card=event.target.closest('[data-solution]');if(card)openSolution(card.dataset.solution,card.hasAttribute('data-solution-price'));
      if(event.target.closest('[data-solution-close]'))detail.close();
      const quote=event.target.closest('[data-solution-quote]');if(quote){detail.close();window.YargaQuiz.open(quote.dataset.solutionQuote, quote.dataset.quizModel);}
    });
  }
  window.YargaCatalog={render};document.addEventListener('DOMContentLoaded',init);
})();
