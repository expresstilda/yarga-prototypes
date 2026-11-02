(() => {
  const {sections,solutions}=window.YargaCatalogData;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const wire=()=>!!document.querySelector('link[href*="wireframe.css"]');
  const image=name=>`assets/${wire()?name.replace(/\.(webp|jpg)$/i,'.svg'):name}`;
  let selected='all',filters={style:'',tone:'',type:''},sort='default',detail,previousFocus;
  const current=()=>solutions.filter(s=>s.category===selected);
  const nav=()=>`<nav class="direction-nav container" aria-label="Разделы каталога"><a href="catalog.html" ${selected==='all'?'aria-current="page"':''}>Все решения</a>${Object.entries(sections).map(([id,s])=>`<a href="catalog.html?category=${id}" ${selected===id?'aria-current="page"':''}>${s.name}</a>`).join('')}</nav>`;
  const quiz=(label='Рассчитать стоимость',className='button button-primary')=>`<button class="${className}" data-quiz="${selected==='all'?'':selected}">${label} <span aria-hidden="true">↗</span></button>`;
  function hero(){
    const section=sections[selected];
    return `<section class="catalog-hero ${wire()?'catalog-hero-wire':''}" aria-labelledby="category-title"><img src="${image(section?.image||'hero-kitchen.webp')}" alt="" fetchpriority="high" width="1600" height="650"><div class="container"><div class="catalog-breadcrumbs"><a href="index.html">Главная</a><span>›</span>${section?'<a href="catalog.html">Каталог</a><span>›</span>':'<span>Каталог</span>'}${section?`<span>${section.name}</span>`:''}</div><h1 id="category-title">${section?.title||'Каталог решений'}</h1><p class="catalog-hero-lead">${section?.lead||'Кухни и корпусная мебель для всего дома. По вашим размерам, под ваши привычки.'}</p><div class="catalog-promises"><span>Собственное производство</span><span>Индивидуальные размеры</span><span>Москва и МО</span></div></div></section>`;
  }
  function overview(){
    return `<section class="container catalog-overview"><div class="catalog-section-heading"><div><p class="eyebrow">У каждого пространства — своё решение</p><h2>Что создадим для вас?</h2></div><p>Начните с комнаты или задачи. В каждом разделе — идеи, которые можно адаптировать под ваш дом.</p></div><div class="direction-grid">${Object.entries(sections).map(([id,s])=>`<a class="direction-card" href="catalog.html?category=${id}"><div><img src="${image(s.image)}" alt="${s.name} — интерьерный пример" loading="lazy" width="1448" height="1086"><span aria-hidden="true">↗</span></div><h2>${s.name}</h2><p>${s.lead}</p><span class="direction-more">Смотреть решения →</span></a>`).join('')}</div></section>`;
  }
  function filtersMarkup(){
    const section=sections[selected],items=current();
    const fields=[['style','Стиль'],['tone','Цветовая гамма'],['type',section.typeLabel]];
    const search=new URLSearchParams(location.search);
    for(const [field] of fields){const options=[...new Set(items.map(s=>s[field]))];filters[field]=options.includes(search.get(field))?search.get(field):'';}
    sort=search.get('sort')==='name'?'name':'default';
    return `<section class="container solutions-section" aria-labelledby="solutions-heading"><div class="catalog-tags" aria-label="Популярные подборки">${section.tags.map(tag=>{const field=items.some(s=>s.type===tag)?'type':'tone';return `<button type="button" data-catalog-tag="${esc(tag)}" data-field="${field}" aria-pressed="false">${tag}</button>`;}).join('')}</div><div class="catalog-toolbar"><button class="catalog-filter-toggle" aria-expanded="false" aria-controls="catalog-facets">Фильтры <span aria-hidden="true">☷</span></button><div class="catalog-facets" id="catalog-facets">${fields.map(([field,label])=>`<label>${label}<select data-catalog-facet="${field}" aria-label="${label}"><option value="">Все варианты</option>${[...new Set(items.map(s=>s[field]))].map(value=>`<option value="${esc(value)}" ${filters[field]===value?'selected':''}>${value}</option>`).join('')}</select></label>`).join('')}<button class="catalog-reset" data-catalog-reset type="button">Сбросить</button></div><label class="catalog-sort"><span class="sr-only">Порядок решений</span><select data-catalog-sort aria-label="Порядок решений"><option value="default">По подборке</option><option value="name" ${sort==='name'?'selected':''}>По названию</option></select></label></div><div class="catalog-results-heading"><h2 id="solutions-heading">Идеи для вашего проекта</h2><p id="catalog-result-count" aria-live="polite"></p></div><div class="solutions-grid" id="solutions-grid"></div><p class="catalog-image-note">${wire()?'Все изображения обозначены плейсхолдерами. Карточки показывают структуру будущего каталога. Стоимость рассчитываем индивидуально.':'Интерьерные примеры показывают возможные решения. Карточки с пометкой «Работа Ярги» — фотографии выполненных проектов. Стоимость рассчитываем индивидуально.'}</p></section>`;
  }
  function card(s){
    return `<article class="solution-card"><button class="solution-picture" data-solution="${s.id}" aria-label="Подробнее: ${esc(s.name)}"><img src="${image(s.image)}" alt="${esc(s.name)}${s.real?' — работа Ярги':' — интерьерный пример'}" loading="lazy" width="1448" height="1086"><span class="solution-label">${wire()?'Плейсхолдер':s.real?'Работа Ярги':'Идея для проекта'}</span><span class="solution-expand" aria-hidden="true">↗</span></button><div class="solution-meta"><span>${s.style}</span><span>${s.type}</span></div><h3><button data-solution="${s.id}">${s.name}</button></h3><p class="solution-description">${s.description}</p><div class="solution-bottom"><span>По вашим размерам</span><button class="text-button" data-quiz="${s.category}" aria-label="Рассчитать: ${esc(s.name)}">Рассчитать проект <span aria-hidden="true">↗</span></button></div></article>`;
  }
  function quizBanner(){
    const s=sections[selected];
    return `<section class="catalog-quiz-banner container"><div class="catalog-quiz-picture"><img src="${image(s?.image||'hero-kitchen.webp')}" alt="" loading="lazy" width="1448" height="1086"></div><div class="catalog-quiz-copy"><p class="eyebrow">От идеи — к понятному проекту</p><h2>Какая мебель<br>нужна именно вам?</h2><p>Ответьте на несколько вопросов о размерах, планировке и пожеланиях. Соберём основу для обсуждения стоимости.</p>${quiz('Пройти квиз')}<span class="catalog-quiz-time">Около 2 минут · Можно без точных размеров</span></div></section>`;
  }
  function approach(){
    return `<section class="catalog-approach container"><div class="catalog-section-heading"><div><p class="eyebrow">По вашему сценарию</p><h2>От задумки<br>до мебели дома</h2></div><p>${sections[selected]?.note||'От отдельной тумбы до мебели для нескольких комнат. Продумываем пространство, материалы и комплектацию вместе с вами.'}</p></div><div class="catalog-steps">${[['Обсуждаем задачу','Что изготовить, как использовать и какие решения вам нравятся.'],['Уточняем размеры','Проверяем помещение, конструкцию и особенности установки.'],['Согласуем проект','Материалы, наполнение, смету и условия фиксируем до производства.'],['Изготавливаем и устанавливаем','Обсуждаем доставку, монтаж и приёмку вашего заказа.']].map(([title,text],i)=>`<article><span>0${i+1}</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div></section>`;
  }
  function faq(){
    const noun=sections[selected]?.name.toLowerCase()||'мебель';
    return `<section class="catalog-faq container"><div><p class="eyebrow">Перед заказом</p><h2>Вопросы<br>и ответы</h2><p>Расскажем о материалах и комплектации, поможем разобраться в деталях.</p><button class="text-button" data-form="consult">Задать свой вопрос <span aria-hidden="true">↗</span></button></div><div class="faq-list">${[[selected==='all'?'Как рассчитать стоимость мебели?':`Сколько стоят ${noun}?`,'Цена зависит от габаритов, конструкции, материалов, фурнитуры и наполнения. Начнём с ваших размеров и пожеланий, затем согласуем состав проекта и стоимость.'],['Можно начать без точных размеров?','Да. Для первого обсуждения подойдут приблизительные размеры или план помещения. Точные габариты проверим на замере, возможность и время выезда согласуем заранее.'],['Можно изменить понравившееся решение?','Изготавливаем мебель по индивидуальному проекту. Обсудим размеры, фасады и внутреннее наполнение под ваше помещение и привычки.'],['Сколько занимает изготовление?','Срок зависит от проекта, материалов и текущей загрузки. Конкретную дату и этапы согласуем до заказа и зафиксируем в договоре.'],['Как устроены доставка и установка?','Доставку и монтаж в Москве и Московской области согласуем для вашего заказа. Адрес, подъём, условия доступа и стоимость работ обсудим заранее.']].map(([q,a],i)=>`<details ${i===0?'open':''}><summary>${q}</summary><div>${a}</div></details>`).join('')}</div></section>`;
  }
  function help(){
    return `<section class="catalog-help"><div class="container"><div><p class="eyebrow">Напрямую от производителя</p><h2>Ваше пространство.<br>Ваше решение.</h2><p>Есть эскиз, план или просто идея? Начнём с разговора и подберём следующий шаг.</p></div><div class="catalog-help-actions">${quiz()}<button class="button button-outline" data-form="measure">Бесплатный замер <span aria-hidden="true">↗</span></button></div></div></section>`;
  }
  function render(){
    const id=new URLSearchParams(location.search).get('category');selected=sections[id]?id:'all';
    document.body.classList.add('catalog-page');
    document.title=`${sections[selected]?.title||'Каталог решений'} — ЯРГА`;
    document.querySelector('meta[name=description]')?.setAttribute('content',sections[selected]?.lead||'Кухни, шкафы, гардеробные и корпусная мебель Ярга на заказ в Москве и МО.');
    const reviews=document.getElementById('catalog-reviews-template')?.innerHTML||'';
    return `${hero()}${nav()}${selected==='all'?overview():filtersMarkup()}${quizBanner()}${approach()}${reviews}${faq()}${help()}`;
  }
  function refresh(){
    const grid=document.getElementById('solutions-grid');if(!grid)return;
    const items=current().filter(s=>Object.entries(filters).every(([key,value])=>!value||s[key]===value));
    if(sort==='name')items.sort((a,b)=>a.name.localeCompare(b.name,'ru'));
    grid.innerHTML=items.length?items.map(card).join(''):`<div class="catalog-empty"><h3>Попробуем другое сочетание?</h3><p>В этой подборке пока нет примеров с такими параметрами. Изготовление по вашему проекту можно обсудить отдельно.</p><button class="button button-outline" data-catalog-reset>Сбросить фильтры</button></div>`;
    document.getElementById('catalog-result-count').textContent=`Найдено: ${items.length}`;
    document.querySelectorAll('[data-catalog-tag]').forEach(button=>button.setAttribute('aria-pressed',String(filters[button.dataset.field]===button.dataset.catalogTag)));
    document.querySelectorAll('[data-catalog-facet]').forEach(select=>select.value=filters[select.dataset.catalogFacet]);
    const active=Object.values(filters).some(Boolean);document.querySelectorAll('.catalog-reset').forEach(button=>button.hidden=!active);
    const url=new URL(location.href);for(const [key,value] of Object.entries(filters))value?url.searchParams.set(key,value):url.searchParams.delete(key);
    sort==='name'?url.searchParams.set('sort',sort):url.searchParams.delete('sort');history.replaceState({},'',url);
  }
  function openSolution(id){
    const s=solutions.find(item=>item.id===id);if(!s)return;
    previousFocus=document.activeElement;
    if(!detail){
      detail=document.createElement('dialog');detail.id='solution-dialog';detail.className='solution-dialog';detail.setAttribute('aria-labelledby','solution-title');document.getElementById('overlays').append(detail);
      detail.addEventListener('close',()=>{if(!document.querySelector('dialog[open]')){document.body.classList.remove('locked');previousFocus?.focus();}});
    }
    detail.innerHTML=`<button type="button" class="dialog-close" data-solution-close aria-label="Закрыть решение">×</button><div class="solution-dialog-image"><img src="${image(s.image)}" alt="${esc(s.name)}"><span>${wire()?'Плейсхолдер изображения':s.real?'Фотография работы Ярги':'Интерьерный пример'}</span></div><div class="solution-dialog-copy"><p class="eyebrow">${sections[s.category].name} · По вашим размерам</p><h2 id="solution-title">${s.name}</h2><p>${s.description}</p><dl><div><dt>Стиль</dt><dd>${s.style}</dd></div><div><dt>Цветовая гамма</dt><dd>${s.tone}</dd></div><div><dt>${sections[s.category].typeLabel}</dt><dd>${s.type}</dd></div></dl><p class="solution-dialog-note">${s.real?'Можно обсудить похожий проект для вашего пространства.':'Это идея для индивидуального проекта. Размеры, материалы и комплектацию подберём под вашу задачу.'} Стоимость определим после уточнения деталей.</p><button class="button button-primary" data-solution-quote="${s.category}">Рассчитать похожий проект <span aria-hidden="true">↗</span></button></div>`;
    closeMenus();detail.showModal();document.body.classList.add('locked');
  }
  function init(){
    if(document.body.dataset.page!=='catalog')return;
    refresh();
    document.addEventListener('change',event=>{
      const facet=event.target.closest('[data-catalog-facet]');if(facet){filters[facet.dataset.catalogFacet]=facet.value;refresh();}
      if(event.target.matches('[data-catalog-sort]')){sort=event.target.value;refresh();}
    });
    document.addEventListener('click',event=>{
      const tag=event.target.closest('[data-catalog-tag]');if(tag){const field=tag.dataset.field;filters[field]=filters[field]===tag.dataset.catalogTag?'':tag.dataset.catalogTag;refresh();}
      if(event.target.closest('[data-catalog-reset]')){filters={style:'',tone:'',type:''};refresh();}
      const toggle=event.target.closest('.catalog-filter-toggle');if(toggle){const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));document.querySelector('.catalog-toolbar').classList.toggle('filters-open',open);}
      const card=event.target.closest('[data-solution]');if(card)openSolution(card.dataset.solution);
      if(event.target.closest('[data-solution-close]'))detail.close();
      const quote=event.target.closest('[data-solution-quote]');if(quote){detail.close();window.YargaQuiz.open(quote.dataset.solutionQuote);}
    });
  }
  window.YargaCatalog={render};document.addEventListener('DOMContentLoaded',init);
})();
