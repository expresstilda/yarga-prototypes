(() => {
  const projects = [
    {
      id: 'light-corner-kitchen', category: 'kitchens', label: 'Кухни', title: 'Светлая угловая кухня',
      lead: 'Встроенная техника собрана в колонне. Рабочая поверхность продолжается вдоль двух стен, под ней — ящики и закрытое хранение.',
      facts: [['Планировка', 'Угловая'], ['Хранение', 'Выдвижные ящики, навесные шкафы и витрина'], ['Рабочая зона', 'Подсветка столешницы, варочная панель и мойка']],
      details: 'На фото видно, как рабочая зона проходит через угол. Колонна с техникой отделяет её от холодильника, а верхние секции используют высоту стены.',
      photos: [['02-081', 'Общий вид угловой кухни'], ['02-093', 'Выдвижные ящики в нижнем ряду'], ['02-110', 'Мойка и подсветка рабочей поверхности']]
    },
    {
      id: 'bedroom-wardrobe', category: 'wardrobes', label: 'Шкафы', title: 'Распашной шкаф до потолка',
      lead: 'Шкаф встроен вдоль стены спальни. За рамочными дверцами — штанги, полки и выдвижные ящики, сверху — отдельные антресоли.',
      facts: [['Конструкция', 'Встроенный распашной шкаф'], ['Наполнение', 'Две штанги, полки и три ящика'], ['Верхний ряд', 'Антресоли с отдельными дверцами']],
      details: 'Внутри предусмотрены секции для одежды на плечиках и отдельные полки для сложенных вещей. Верхнее хранение закрывается отдельно от повседневных секций.',
      photos: [['17-001', 'Белые рамочные фасады и антресоли'], ['17-002', 'Штанги, полки и ящики за открытыми дверцами']]
    },
    {
      id: 'open-niche-dressing', category: 'dressing', label: 'Гардеробные', title: 'Открытая гардеробная в нише',
      lead: 'Вдоль стен разместили полки, штанги и блок выдвижных ящиков, оставив свободный проход.',
      facts: [['Конструкция', 'Открытое хранение в нише'], ['Для одежды', 'Штанги и выдвижные ящики'], ['Для сложенных вещей', 'Открытые полки в нескольких секциях']],
      details: 'Два ракурса показывают, как сочетаются открытые секции и закрытые ящики. Наполнение можно обсудить под свои вещи и габариты ниши.',
      photos: [['04-004', 'Открытые полки и выдвижные ящики'], ['04-001', 'Гардеробная с противоположного ракурса']]
    },
    {
      id: 'living-tv-wall', category: 'living', label: 'Гостиные', title: 'ТВ-зона с подсвеченными полками',
      lead: 'Под экраном разместили длинную тумбу, сбоку — открытый стеллаж с подсветкой.',
      facts: [['Изделия', 'Тумба и встроенный стеллаж'], ['Хранение', 'Открытые полки и закрытая нижняя секция'], ['Деталь', 'Подсветка в стеллаже']],
      details: 'Общий план показывает, как стеллаж примыкает к панели за телевизором. На крупном плане видны полки и нижняя тумба.',
      photos: [['13-027', 'Общий вид ТВ-зоны'], ['13-133', 'Стеллаж с подсветкой и торец тумбы']]
    },
    {
      id: 'hallway-bench-niche', category: 'hallways', label: 'Прихожие', title: 'Прихожая с мягкой скамьёй',
      lead: 'Встроенная ниша с мягкой спинкой оставляет место, чтобы присесть. Хранение разместили сбоку и над сиденьем.',
      facts: [['Конструкция', 'Шкафы вокруг открытой ниши'], ['Сиденье', 'Встроенная скамья с мягкой спинкой'], ['Верхнее хранение', 'Шкафы с дверцами над нишей']],
      details: 'В кадре видны рамочные фасады, спинка в нише и подсветка. Боковые секции закрывают вещи, а сиденье остаётся открытым.',
      photos: [['12-079', 'Светлая прихожая с мягкой скамьёй']]
    },
    {
      id: 'study-window-desk', category: 'offices', label: 'Кабинеты', title: 'Рабочее место у окна',
      lead: 'Столешница занимает нишу у окна. По бокам — секции хранения, под столешницей оставлено место для кресла.',
      facts: [['Расположение', 'В нише у окна'], ['Стол', 'Встроенная столешница'], ['Хранение', 'Боковые секции']],
      details: 'Встроенная конструкция использует ширину ниши. Хранение по краям оставляет центральную часть стола свободной.',
      photos: [['13-091', 'Рабочее место и полки вокруг окна']]
    },
    {
      id: 'office-reception', category: 'business', label: 'Бизнесу', title: 'Стойка ресепшн с закруглённым фасадом',
      lead: 'Стойка разделяет входную зону и рабочее пространство. Со стороны сотрудника — столешница, ящики и открытые полки.',
      facts: [['Изделие', 'Стойка администратора'], ['Фасад', 'Закруглённый внешний угол'], ['Рабочая сторона', 'Полки и выдвижные ящики']],
      details: 'Общий кадр показывает форму стойки в помещении. На втором фото видно, как устроено место сотрудника за фасадом.',
      photos: [['10-001', 'Общий вид стойки со стороны входа'], ['10-003', 'Столешница и хранение с рабочей стороны']]
    },
    {
      id: 'office-kitchen', category: 'business', label: 'Бизнесу', title: 'Кухонная зона и хранение для офиса',
      lead: 'Для офиса изготовили кухонный ряд и отдельный модуль хранения с выдвижными ящиками.',
      facts: [['Изделия', 'Кухонный ряд и отдельный модуль хранения'], ['Хранение', 'Закрытые секции и выдвижные ящики'], ['Отделка', 'Светлые фасады и древесная фактура']],
      details: 'Общий кадр показывает кухонный ряд со встроенной техникой. На втором кадре — отдельный офисный модуль с ящиками.',
      photos: [['07-006', 'Кухонный ряд со светлыми фасадами'], ['07-004', 'Офисный модуль с выдвижными ящиками']]
    }
  ];

  const budgets = {
    kitchens: {
      label:'Кухня', title:'Прямая кухня длиной 3 м',
      shared:'Нижний и верхний ряды, корпуса из ЛДСП, полки и ламинированная столешница. Дополнительные модули и нестандартные размеры влияют на итог.',
      separate:'Техника, мойка, смеситель, фартук, подсветка, пеналы, остров, доставка, подъём и монтаж.',
      variants:[
        {title:'Фасады из ЛДСП', label:'Гладкие фасады', description:'Фасады без фрезеровки, петли, ручки и полки.', profile:'kitchens-series-03', metres:3},
        {title:'Фасады из МДФ', label:'Матовая отделка', description:'Гладкие фасады из МДФ, полки, петли и один базовый выдвижной ящик.', profile:'kitchen-clay-peninsula', metres:3}
      ]
    },
    wardrobes: {
      label:'Шкаф', title:'Шкаф 2 × 2,4 × 0,6 м',
      shared:'Пример с одинаковыми шириной, высотой и глубиной. В обоих вариантах предусмотрены корпус, полки и штанга.',
      separate:'Дополнительные ящики и выдвижные системы, подсветка, доставка, подъём и монтаж.',
      variants:[
        {title:'Распашные двери', label:'Фасады из ЛДСП', description:'Распашные фасады, петли и ручки. При расчёте важно оставить место для открывания.', profile:'wardrobe-wall'},
        {title:'Раздвижные двери', label:'Одна створка с зеркалом', description:'Две створки на направляющих. В этом примере на одной из створок предусмотрено зеркало.', profile:'wardrobe-sliding'}
      ]
    },
    dressing: {
      label:'Гардеробная', title:'Закрытая гардеробная шириной 2 м',
      shared:'Один ряд хранения высотой 2,4 м. В обоих вариантах предусмотрены корпуса, полки и штанга.',
      separate:'Дополнительные ящики и аксессуары, остров, подсветка, отделка помещения, доставка, подъём и монтаж.',
      variants:[
        {title:'Распашные фасады', label:'Базовое закрытое хранение', description:'Глухие дверцы на петлях закрывают отделения с одеждой.', profile:'dressing-series-12'},
        {title:'Дверцы с остеклением', label:'Матовое стекло', description:'Дверцы из матового стекла. Стоимость зависит от типа стекла, профиля и механизма.', profile:'dressing-series-02'}
      ]
    }
  };

  const core = projects.slice(0,3);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
  const url = id => `projects.html?project=${encodeURIComponent(id)}`;
  const wire = () => !!document.querySelector('link[href*="wireframe.css"]');
  const asset = id => wire() ? 'assets/work-placeholder.svg' : `assets/installations/work-${id}.webp`;
  const rubles = new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',maximumFractionDigits:0});
  const find = id => projects.find(project => project.id === id);

  function preview(project) {
    const [photo, alt] = project.photos[0];
    return `<article class="work-preview"><a href="${url(project.id)}" class="work-preview-image" aria-label="Посмотреть проект ${esc(project.title)}"><img src="${asset(photo)}" alt="${esc(alt)}" loading="lazy" decoding="async" width="660" height="495"></a><div class="work-preview-copy"><p class="eyebrow">${project.label}</p><h3><a href="${url(project.id)}">${esc(project.title)}</a></h3><p>${esc(project.lead)}</p><a class="text-button" href="${url(project.id)}">Посмотреть работу <span aria-hidden="true">↗</span></a></div></article>`;
  }

  function workList(items, title) {
    return `<section id="case-studies" class="container section work-list" aria-labelledby="case-studies-title"><div class="section-heading"><div><h2 id="case-studies-title">${title}</h2></div><p class="section-intro">Общие планы и детали мебели на объектах Ярги.</p></div><div class="work-grid${items.length===1?' work-grid-single':''}">${items.map(preview).join('')}</div></section>`;
  }

  function relatedModel(model) {
    const cases = {
      kitchens: ['Угловая', core[0], 'Угловая планировка'],
      wardrobes: ['Распашные двери', core[1], 'Распашные дверцы'],
      dressing: ['Открытая', core[2], 'Открытые секции хранения'],
      living: ['ТВ-зона', find('living-tv-wall'), 'Мебель под телевизор'],
      hallways: ['Со скамьёй', find('hallway-bench-niche'), 'Скамья у входа'],
      offices: ['Рабочее место', find('study-window-desk'), 'Рабочая зона']
    };
    const [type, project, similarity] = cases[model.category] ?? [];
    if (model.type !== type || !project) return '';
    return `<a class="work-related" href="${url(project.id)}"><img src="${asset(project.photos[0][0])}" alt="" loading="lazy" width="104" height="78"><span><small>Похожая работа Ярги</small><strong>${esc(project.title)}</strong><small>${similarity}</small></span><span aria-hidden="true">↗</span></a>`;
  }

  function budgetPanel(category) {
    const budget = budgets[category];
    const prices = window.YargaCatalogPricing;
    const cards = budget.variants.map(variant => {
      const unit = prices?.[variant.profile]?.amount;
      const amount = Number.isFinite(unit) ? rubles.format(unit * (variant.metres ?? 1)) : '';
      return `<article class="budget-option"><p class="eyebrow">${esc(variant.label)}</p><h4>${esc(variant.title)}</h4>${amount ? `<p class="budget-amount">${amount}</p>` : ''}<p>${esc(variant.description)}</p><button class="text-button" type="button" data-fast-inquiry data-fast-category="${category}" data-fast-detail="${esc(`${budget.title}, ${variant.title}`)}">Рассчитать по моим размерам <span aria-hidden="true">↗</span></button></article>`;
    });
    return `<div class="budget-basis"><h3>${esc(budget.title)}</h3><p>${esc(budget.shared)}</p></div><div class="budget-grid">${cards.join('')}</div><p class="budget-exclusions"><strong>Считается отдельно.</strong> ${esc(budget.separate)}</p>`;
  }

  function addBudget(section, category) {
    section.className = 'section budget-section';
    section.setAttribute('aria-labelledby','budget-title');
    section.innerHTML = `<div class="container"><div class="section-heading"><div><h2 id="budget-title">Примеры расчёта</h2></div><p class="section-intro">Сравните, сколько стоят две комплектации мебели одного размера. Итоговую цену посчитаем по вашим размерам и материалам.</p></div><div class="budget-tabs" aria-label="Выбрать пример расчёта">${Object.entries(budgets).map(([key,value])=>`<button type="button" data-budget="${key}" aria-controls="budget-panel" aria-pressed="${key===category}">${value.label}</button>`).join('')}</div><div id="budget-panel" aria-live="polite">${budgetPanel(category)}</div></div>`;
    section.addEventListener('click',event => {
      const button = event.target.closest('[data-budget]');
      if (!button || button.getAttribute('aria-pressed') === 'true') return;
      section.querySelectorAll('[data-budget]').forEach(tab => tab.setAttribute('aria-pressed',String(tab === button)));
      section.querySelector('#budget-panel').innerHTML = budgetPanel(button.dataset.budget);
    });
  }

  function addProcess(section) {
    section.className = 'section container order-steps';
    section.setAttribute('aria-labelledby','order-title');
    section.innerHTML = `<div class="section-heading"><div><h2 id="order-title">Как проходит заказ</h2></div></div><div class="order-grid">
      <article><h3>Фото и размеры</h3><p>Пришлите фото помещения, эскиз или ссылку. Обсудим планировку, материалы и ориентир по цене.</p></article>
      <article><h3>Проект и смета</h3><p>Согласуем состав бесплатного дизайн-проекта и удобное время замера. После уточнения размеров подготовим смету на выбранную комплектацию.</p></article>
      <article><h3>Договор и производство</h3><p>Фиксируем состав мебели, стоимость, сроки и этапы оплаты. Изготавливаем мебель в Воронеже.</p><a href="payment.html">Как устроена оплата</a></article>
      <article><h3>Установка и приёмка</h3><p>Согласуем доставку, подъём и монтаж по Москве и Московской области. Условия гарантии фиксируем в договоре.</p><a href="delivery.html">Доставка и монтаж</a></article>
    </div><div class="order-actions"><button type="button" class="button button-primary" data-fast-inquiry>Рассчитать по фото <span aria-hidden="true">↗</span></button><button type="button" class="button button-outline" data-form="measure">Бесплатный замер <span aria-hidden="true">↗</span></button></div>`;
  }

  function renderProjectPage(main) {
    const project = find(new URLSearchParams(location.search).get('project'));
    if (!project) {
      main.innerHTML = `<div class="container work-page-intro"><h1>Работы Ярги</h1><p>Корпусная мебель, которую мы изготовили для дома и бизнеса.</p></div>${workList(projects,'Выполненные проекты')}`;
      return;
    }
    document.title = `${project.title} — работы Ярги`;
    document.querySelector('meta[name="description"]')?.setAttribute('content',project.lead);
    const gallery = project.photos.map(([id,alt],index) => `<figure class="work-photo${index===0?' work-photo-main':''}"><button type="button" data-project-photo="${index}" aria-label="Увеличить фото ${esc(alt)}"><img src="${asset(id)}" alt="${esc(alt)}" ${index===0?'fetchpriority="high"':'loading="lazy"'} decoding="async" width="1000" height="750"></button><figcaption>${esc(alt)}</figcaption></figure>`).join('');
    const inquiry = `<button type="button" class="button button-primary" data-fast-inquiry data-fast-category="${project.category}" data-fast-case="${project.id}" data-fast-case-title="${esc(project.title)}">Рассчитать похожую мебель <span aria-hidden="true">↗</span></button>`;
    const catalogLink = `catalog.html?category=${project.category}`;
    const more = project.category === 'business' ? ['business.html','Мебель для бизнеса'] : Object.hasOwn(budgets,project.category) ? [catalogLink+'#estimate','Каталог и пример сметы'] : [catalogLink,'Смотреть модели'];
    main.innerHTML = `<section class="container work-page-intro"><nav aria-label="Хлебные крошки"><a href="index.html">Главная</a><span> / </span><a href="projects.html">Работы Ярги</a></nav><p class="eyebrow">${project.label}</p><h1>${esc(project.title)}</h1><p>${esc(project.lead)}</p>${inquiry}</section><section class="container work-page-content" aria-label="Фотографии и детали проекта"><div class="work-photo-grid">${gallery}</div><div class="work-page-details"><h2>Как устроена мебель</h2><dl>${project.facts.map(([key,value])=>`<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl><p>${esc(project.details)}</p>${inquiry}<a href="${more[0]}" class="text-button">${more[1]} <span aria-hidden="true">↗</span></a></div></section>`;
    main.addEventListener('click',event => {
      const button = event.target.closest('[data-project-photo]');
      if (!button) return;
      const photos = project.photos.map(([id,alt])=>({src:asset(id),alt}));
      window.YargaGallery.open(photos,Number(button.dataset.projectPhoto));
    });
    main.insertAdjacentHTML('beforeend',workList(core.filter(item=>item!==project),'Другие работы Ярги'));
  }

  function init() {
    const page = document.body.dataset.page || 'home';
    const main = document.getElementById('main');
    if (page === 'projects') {renderProjectPage(main); return;}
    const category = page === 'catalog' ? new URLSearchParams(location.search).get('category') : page;
    if (page === 'catalog' || page === 'business') {
      const priority = projects.filter(project => project.category === category);
      const anchor = page === 'catalog' ? document.querySelector('.catalog-quiz-banner') : null;
      const heading = page === 'business' ? 'Наши работы в офисах' : 'Примеры выполненных работ';
      const markup = workList(priority.length ? priority : core, heading);
      if (anchor) anchor.insertAdjacentHTML('beforebegin',markup);
      else main.insertAdjacentHTML('beforeend',markup);
    }
    if (page === 'home' || (page === 'catalog' && (!category || Object.hasOwn(budgets,category)))) {
      const section = document.createElement('section');
      section.id = 'estimate';
      addBudget(section,Object.hasOwn(budgets,category) ? category : 'kitchens');
      const anchor = document.getElementById(page === 'home' ? 'portfolio' : 'case-studies');
      anchor.after(section);
    }
    const process = document.querySelector('[data-order-steps]');
    if (process) addProcess(process);
  }

  window.YargaProjects = {find,relatedModel};
  document.addEventListener('DOMContentLoaded',init);
})();
