const categories = [
  {id:'kitchens',name:'Кухни',image:'category-kitchens',sub:'Для ваших привычек и любимых рецептов'},
  {id:'wardrobes',name:'Шкафы',image:'category-wardrobes',sub:'Хранение, которое вписывается в пространство'},
  {id:'dressing',name:'Гардеробные',image:'category-dressing',sub:'Всё на своём месте — и всегда под рукой'},
  {id:'living',name:'Гостиные',image:'category-living',sub:'Тумбы, стеллажи и мебельные композиции'},
  {id:'hallways',name:'Прихожие',image:'category-hallways',sub:'Продуманный порядок с порога'},
  {id:'offices',name:'Кабинеты',image:'category-offices',sub:'Место, где удобно сосредоточиться'}
];
const telegram = 'https://t.me/yarga_chief';
const maxUrl = 'https://max.ru/u/f9LHodD0cOLbUmBjDs8A0MR_iyZcGbrA6vWLMLdq6W8uahVcjLbw-Eb_QpU';
const heartIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>';
const telegramIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m21.6 3.4-3.3 16c-.2 1.1-.9 1.3-1.8.8l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.3-.1-.5-.6-.2L5.7 13l-4.9-1.5c-1.1-.4-1.1-1.1.2-1.6L20.1 2.5c.9-.3 1.7.2 1.5.9Z"/></svg>';
const maxIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M12 1.6a10.3 10.3 0 0 0-10.4 10.1c0 2.7 1.1 5.2 2.9 7L4 22l3.8-.9c1.3.5 2.7.8 4.2.8 5.8 0 10.4-4.6 10.4-10.2S17.8 1.6 12 1.6Zm-5.3 10a5.3 5.3 0 1 1 10.6 0 5.3 5.3 0 0 1-10.6 0Z" clip-rule="evenodd"/></svg>';
const socialLinks = `<a class="icon-link" href="${telegram}" target="_blank" rel="noopener noreferrer" aria-label="Написать Ярге в Telegram">${telegramIcon}</a><a class="icon-link" href="${maxUrl}" target="_blank" rel="noopener noreferrer" aria-label="Написать Ярге в MAX">${maxIcon}</a>`;
let favorites = [];
try {favorites=JSON.parse(localStorage.getItem('yarga-favorite-solutions')||'[]').filter(id=>categories.some(c=>c.id===id));}catch{}

function renderHeader(){
  document.getElementById('site-header').innerHTML = `<div class="header-inner"><a class="wordmark" href="index.html" aria-label="Ярга, главная">ЯРГА<small>Мебель на заказ</small></a><nav class="desktop-nav" aria-label="Основная навигация"><div class="nav-dropdown"><button class="nav-toggle" aria-expanded="false" aria-controls="catalog-menu">Каталог <span class="nav-chevron" aria-hidden="true">⌄</span></button><div class="dropdown-panel" id="catalog-menu">${categories.map(c=>`<a href="catalog.html?category=${c.id}">${c.name}</a>`).join('')}</div></div><div class="nav-dropdown"><button class="nav-toggle" aria-expanded="false" aria-controls="buyer-menu">Покупателю <span class="nav-chevron" aria-hidden="true">⌄</span></button><div class="dropdown-panel" id="buyer-menu"><a href="payment.html">Оплата</a><a href="delivery.html">Доставка</a><a href="index.html#portfolio">Портфолио</a></div></div><a class="nav-link" href="about.html">О компании</a><a class="nav-link" href="designers.html">Сотрудничество</a><a class="nav-link" href="business.html">Бизнесу</a></nav><div class="header-contact"><a class="header-phone" href="tel:+79803400340">+7 (980) 340-0-340</a>${socialLinks}<button class="icon-link favorites-header" data-favorites aria-label="Избранные решения">${heartIcon}<span class="fav-count"></span></button><button class="mobile-toggle" aria-label="Открыть меню" aria-expanded="false" aria-controls="mobile-menu"><i></i><i></i></button></div></div><nav class="mobile-menu" id="mobile-menu" aria-label="Мобильная навигация"><details><summary>Каталог</summary>${categories.map(c=>`<a href="catalog.html?category=${c.id}">${c.name}</a>`).join('')}</details><details><summary>Покупателю</summary><a href="payment.html">Оплата</a><a href="delivery.html">Доставка</a><a href="index.html#portfolio">Портфолио</a></details><a href="about.html">О компании</a><a href="designers.html">Сотрудничество</a><a href="business.html">Бизнесу</a><div class="mobile-contact"><a href="tel:+79803400340">+7 (980) 340-0-340</a><p>Москва и Московская область</p></div></nav>`;
}
function renderFooter(){
  document.getElementById('site-footer').innerHTML=`<div class="footer"><div class="container"><div class="footer-top"><div class="footer-brand"><a class="wordmark" href="index.html">ЯРГА<small>Мебель на заказ</small></a><div><a class="footer-phone" href="tel:+79803400340">+7 (980) 340-0-340</a><p>Москва и Московская область<br>Производство в Воронеже<br><a href="mailto:yarga4@yandex.ru">yarga4@yandex.ru</a></p><div class="footer-socials">${socialLinks}<a class="icon-link" href="https://vk.ru/yargadesign" target="_blank" rel="noopener noreferrer" aria-label="Ярга ВКонтакте"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.9 17.6c-6 0-9.4-4.1-9.5-11h3c.1 5 2.3 7.1 4 7.5V6.6h2.9v4.3c1.7-.2 3.4-2.2 4-4.3h2.9c-.5 2.7-2.4 4.7-3.7 5.5 1.3.7 3.5 2.5 4.3 5.5h-3.2c-.7-2-2.3-3.6-4.3-3.8v3.8h-.4Z"/></svg></a></div></div></div><div class="newsletter"><h3>Идеи для вашего дома</h3><p>Новые работы, материалы и решения для хранения.</p><form class="prototype-form" data-form-kind="newsletter"><input type="email" name="email" aria-label="Email для подписки" placeholder="Ваш email" required><button type="submit" aria-label="Посмотреть сценарий подписки">↗</button></form><p class="form-note">Демонстрация подписки. Email не сохраняется и не отправляется.</p></div></div><div class="footer-links"><div><h3>Каталог</h3>${categories.map(c=>`<a href="catalog.html?category=${c.id}">${c.name}</a>`).join('')}</div><div><h3>Покупателю</h3><a href="payment.html">Оплата</a><a href="delivery.html">Доставка</a><a href="index.html#portfolio">Портфолио</a><a href="index.html#faq">Вопросы и ответы</a><a href="about.html#guarantee">Гарантия</a></div><div><h3>Компания</h3><a href="about.html">О Ярге</a><a href="index.html#production">Производство</a><a href="index.html#reviews">Отзывы клиентов</a><a href="index.html#contact">Контакты</a></div><div><h3>Сотрудничество</h3><a href="designers.html">Дизайнерам</a><a href="business.html">Бизнесу</a><a href="${telegram}" target="_blank" rel="noopener noreferrer">Обсудить проект в Telegram ↗</a></div></div><div class="footer-bottom"><span class="copyright">© 2026 ЯРГА. Мебель по вашим размерам.</span><div class="footer-legal-links"><a href="https://yarga.gallery/privacypolicy" target="_blank" rel="noopener noreferrer">Политика конфиденциальности</a><a href="https://yarga.gallery/soglasie" target="_blank" rel="noopener noreferrer">Обработка персональных данных</a></div><span class="legal">Прототип новой главной. Изображения каталога — интерьерные иллюстрации. Фотографии портфолио — работы Ярги.</span></div></div></div>`;
}
function categoryCard(c){return `<article class="catalog-card"><a href="catalog.html?category=${c.id}"><div class="catalog-image"><img src="assets/${c.image}.webp" alt="${c.name} по индивидуальным размерам — интерьерная иллюстрация" loading="lazy" width="1448" height="1086"></div><div class="catalog-label"><span>${c.name}</span><span aria-hidden="true">↗</span></div><p class="catalog-subtitle">${c.sub}</p></a><button class="save-button ${favorites.includes(c.id)?'saved':''}" data-save="${c.id}" aria-label="${favorites.includes(c.id)?'Убрать':'Сохранить'}: ${c.name}" aria-pressed="${favorites.includes(c.id)}">${heartIcon}</button></article>`;}
function renderCatalog(filter='all'){
  const grid=document.getElementById('catalog-grid');
  if(grid){grid.classList.toggle('single-result',filter!=='all');grid.innerHTML=categories.filter(c=>filter==='all'||c.id===filter).map(categoryCard).join('');}
  updateFavoritesCount();
}
const portfolio=[
  {number:8,alt:'Светлая угловая кухня Ярги с колонной встроенной техники'},
  {number:1,alt:'Светлая кухня Ярги с витринами и подсветкой'},
  {number:3,alt:'Компактная кухня Ярги с деревянным акцентом'},
  {number:5,alt:'Кухня Ярги с тёмно-синими фасадами'},
  {number:6,alt:'Белая кухня Ярги с деревянной столешницей'},
  {number:7,alt:'Кухня Ярги с синими верхними фасадами и подсветкой'},
  {number:9,alt:'Кухня Ярги с выразительной фактурой дерева'},
  {number:10,alt:'Кухня Ярги в светлых древесных оттенках'},
  {number:2,alt:'Классическая кухня Ярги в загородном доме'}
];
function portfolioPath(index){return `assets/portfolio-${String(portfolio[index].number).padStart(2,'0')}.jpg`;}
function renderPortfolio(){const grid=document.getElementById('portfolio-grid');if(grid)grid.innerHTML=portfolio.map((p,i)=>`<figure class="portfolio-tile"><button data-gallery="${i}" aria-label="Увеличить: ${p.alt}"><img src="${portfolioPath(i)}" alt="${p.alt}" loading="lazy"><span class="portfolio-zoom" aria-hidden="true">+</span></button></figure>`).join('');}

function createDialogs(){
  document.getElementById('overlays').innerHTML=`<dialog class="form-dialog" id="request-dialog" aria-labelledby="dialog-title"><button class="dialog-close" data-close aria-label="Закрыть окно">×</button><div id="request-content"></div></dialog><dialog class="gallery-dialog" id="gallery-dialog" aria-label="Фотографии выполненных работ Ярги"><button class="dialog-close" data-close aria-label="Закрыть фотографию">×</button><div class="gallery-image-wrap"><img id="gallery-image" alt=""></div><div class="gallery-caption"><button class="round-button" data-gallery-step="-1" aria-label="Предыдущая работа">←</button><b id="gallery-counter"></b><button class="round-button" data-gallery-step="1" aria-label="Следующая работа">→</button><span>Реальные работы Ярги</span></div></dialog><dialog class="favorites-dialog" id="favorites-dialog" aria-labelledby="favorites-title"><button class="dialog-close" data-close aria-label="Закрыть избранное">×</button><p class="eyebrow">Ваше вдохновение</p><h2 id="favorites-title">Избранные решения</h2><div class="favorites-body"></div></dialog>`;
  document.querySelectorAll('dialog').forEach(dialog=>{
    dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
    dialog.addEventListener('close',()=>document.body.classList.remove('locked'));
  });
}
function showDialog(id){closeMenus();const dialog=document.getElementById(id);dialog.showModal();document.body.classList.add('locked');}
const formCopy={measure:{title:'Начнём с замера',description:'Оставьте контакт — обсудим ваш проект и удобное время встречи. Замер бесплатный.',button:'Записаться на замер'},calculate:{title:'Рассчитаем вашу мебель',description:'Расскажите, что хотите изготовить. Размеры и пожелания помогут обсудить предварительный бюджет.',button:'Получить расчёт'},consult:{title:'Обсудим вашу идею',description:'Задайте вопрос о материалах, проекте или комплектации. Выберите удобный способ связи.',button:'Обсудить проект'},business:{title:'Обсудим ваш объект',description:'Расскажите о помещении, количестве изделий и сроках. Обсудим техническое задание и состав предложения.',button:'Обсудить объект'},designer:{title:'Давайте работать вместе',description:'Расскажите о проекте. Обсудим материалы, конструкцию и формат взаимодействия.',button:'Обсудить сотрудничество'}};
function openForm(kind='consult'){
  const copy=formCopy[kind]||formCopy.consult;
  const currentCategory=new URLSearchParams(location.search).get('category');
  const detail=kind==='calculate'?`<label>Тип мебели<select name="category">${categories.map(c=>`<option${c.id===currentCategory?' selected':''}>${c.name}</option>`).join('')}<option>Комплект для квартиры</option><option>Другое</option></select></label><label>Примерные размеры<input name="dimensions" placeholder="Например, кухня 3 × 2 м"></label>`:kind==='measure'?'<label>Район или населённый пункт<input name="location" placeholder="Москва или Московская область"></label>':'';
  document.getElementById('request-content').innerHTML=`<p class="dialog-kicker">Ярга · индивидуальная мебель</p><h2 id="dialog-title">${copy.title}</h2><p class="dialog-description">${copy.description}</p><form class="prototype-form" data-form-kind="${kind}">${detail}<label>Ваше имя<input name="name" placeholder="Как к вам обращаться" autocomplete="name"></label><label>Телефон<input name="phone" type="tel" placeholder="+7 (___) ___-__-__" autocomplete="tel" required minlength="10"></label><label>Комментарий<textarea name="comment" rows="2" placeholder="Пожелания, удобное время и способ связи"></textarea></label><label class="consent"><input type="checkbox" required><span>Даю <a href="https://yarga.gallery/soglasie" target="_blank" rel="noopener noreferrer">согласие на обработку персональных данных</a>. <a href="https://yarga.gallery/privacypolicy" target="_blank" rel="noopener noreferrer">Политика</a></span></label><button class="button button-primary" type="submit">${copy.button} <span aria-hidden="true">↗</span></button><p class="form-note">Демонстрационная форма прототипа. Данные не отправляются.</p></form>`;
  showDialog('request-dialog');
}
function showDemoSuccess(isNewsletter=false){
  const dialog=document.getElementById('request-dialog');
  document.getElementById('request-content').innerHTML=`<div class="form-success"><div class="success-mark" aria-hidden="true">✓</div><h2 id="dialog-title">${isNewsletter?'Сценарий подписки':'Сценарий заявки'}</h2><p>Это прототип: ${isNewsletter?'email':'контактные данные'} не сохраняются и не отправляются. В готовом сайте на этом шаге ${isNewsletter?'будет оформляться подписка':'появится подтверждение получения заявки'}.</p><a class="button button-primary" href="${telegram}" target="_blank" rel="noopener noreferrer">Написать Ярге в Telegram <span aria-hidden="true">↗</span></a></div>`;
  if(!dialog.open)showDialog('request-dialog');
}
let galleryIndex=0;
function updateGallery(index){galleryIndex=(index+portfolio.length)%portfolio.length;document.getElementById('gallery-image').src=portfolioPath(galleryIndex);document.getElementById('gallery-image').alt=portfolio[galleryIndex].alt;document.getElementById('gallery-counter').textContent=`${String(galleryIndex+1).padStart(2,'0')} / ${String(portfolio.length).padStart(2,'0')}`;}
function updateFavoritesCount(){document.querySelectorAll('.fav-count').forEach(c=>c.textContent=favorites.length||'');}
function saveFavorite(id){
  favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];
  try{localStorage.setItem('yarga-favorite-solutions',JSON.stringify(favorites));}catch{}
  document.querySelectorAll(`[data-save="${id}"]`).forEach(b=>{b.classList.toggle('saved',favorites.includes(id));b.setAttribute('aria-pressed',String(favorites.includes(id)));b.setAttribute('aria-label',`${favorites.includes(id)?'Убрать':'Сохранить'}: ${categories.find(c=>c.id===id).name}`);});
  updateFavoritesCount();
  if(document.getElementById('favorites-dialog').open)renderFavorites();
}
function renderFavorites(){document.querySelector('.favorites-body').innerHTML=favorites.length?favorites.map(id=>{const c=categories.find(x=>x.id===id);return `<div class="favorite-item"><img src="assets/${c.image}.webp" alt="${c.name}"><a href="catalog.html?category=${c.id}">${c.name}</a><button data-remove-favorite="${c.id}" aria-label="Удалить ${c.name} из избранного">×</button></div>`;}).join(''):'<p>Нажмите на сердечко в каталоге, чтобы сохранить понравившееся направление. Избранное хранится только в вашем браузере.</p>';}
function closeMenus(){document.querySelectorAll('.nav-dropdown.open').forEach(d=>{d.classList.remove('open');d.querySelector('button').setAttribute('aria-expanded','false');});document.querySelector('.mobile-menu')?.classList.remove('is-open');document.querySelector('.mobile-toggle')?.setAttribute('aria-expanded','false');document.querySelector('.site-header')?.classList.remove('menu-open');}
function wireNavigation(){
  document.querySelectorAll('.nav-toggle').forEach(b=>b.addEventListener('click',()=>{const d=b.closest('.nav-dropdown');const next=!d.classList.contains('open');closeMenus();d.classList.toggle('open',next);b.setAttribute('aria-expanded',String(next));document.querySelector('.site-header').classList.toggle('menu-open',next);}));
  document.querySelector('.mobile-toggle').addEventListener('click',e=>{const b=e.currentTarget;const next=b.getAttribute('aria-expanded')!=='true';closeMenus();document.getElementById('mobile-menu').classList.toggle('is-open',next);b.setAttribute('aria-expanded',String(next));b.setAttribute('aria-label',next?'Закрыть меню':'Открыть меню');document.querySelector('.site-header').classList.toggle('menu-open',next);});
  document.querySelectorAll('.mobile-menu a').forEach(a=>a.addEventListener('click',closeMenus));
  const setHeader=()=>document.getElementById('site-header').classList.toggle('scrolled',scrollY>30||document.body.classList.contains('inner-page'));
  window.addEventListener('scroll',setHeader,{passive:true});setHeader();
  document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenus();});
}
function wireActions(){
  document.addEventListener('click',e=>{
    const form=e.target.closest('[data-form]');if(form){openForm(form.dataset.form);return;}
    const closer=e.target.closest('[data-close]');if(closer){closer.closest('dialog').close();return;}
    const gallery=e.target.closest('[data-gallery]');if(gallery){updateGallery(Number(gallery.dataset.gallery));showDialog('gallery-dialog');return;}
    const step=e.target.closest('[data-gallery-step]');if(step){updateGallery(galleryIndex+Number(step.dataset.galleryStep));return;}
    const save=e.target.closest('[data-save]');if(save){saveFavorite(save.dataset.save);return;}
    const remove=e.target.closest('[data-remove-favorite]');if(remove){saveFavorite(remove.dataset.removeFavorite);return;}
    if(e.target.closest('[data-favorites]')){renderFavorites();showDialog('favorites-dialog');return;}
    const filter=e.target.closest('[data-filter]');if(filter){document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b===filter));renderCatalog(filter.dataset.filter);history.replaceState({},'',`catalog.html${filter.dataset.filter==='all'?'':`?category=${filter.dataset.filter}`}`);}
  });
  document.addEventListener('submit',e=>{const form=e.target.closest('.prototype-form');if(!form)return;e.preventDefault();showDemoSuccess(form.dataset.formKind==='newsletter');});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenus();if(document.getElementById('gallery-dialog').open&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();updateGallery(galleryIndex+(e.key==='ArrowRight'?1:-1));}});
  document.querySelectorAll('[data-scroll]').forEach(b=>b.addEventListener('click',()=>{const track=document.getElementById(b.dataset.scroll);track.scrollBy({left:(track.firstElementChild.getBoundingClientRect().width+22)*Number(b.dataset.direction),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}));
  const benefits=document.getElementById('benefits');if(benefits){const count=()=>{const w=benefits.firstElementChild.getBoundingClientRect().width+parseFloat(getComputedStyle(benefits).gap);const first=Math.round(benefits.scrollLeft/w)+1;const shown=Math.max(1,Math.round(benefits.clientWidth/w));document.getElementById('benefit-count').textContent=`${String(first).padStart(2,'0')}–${String(Math.min(4,first+shown-1)).padStart(2,'0')} / 04`;};benefits.addEventListener('scroll',count,{passive:true});window.addEventListener('resize',count);count();}
}
const factorySlides=[
  {src:'production-01.jpg',title:'Работа рук,<br>внимание к материалу',description:'Обрабатываем детали и уделяем внимание тем местам, которые вы будете видеть и трогать каждый день.',alt:'Ручная обработка мебельной детали в мастерской Ярги'},
  {src:'production-02.jpg',title:'Деталь за деталью —<br>единое целое',description:'Работаем с отдельными деревянными элементами: подгоняем, соединяем и собираем будущую конструкцию.',alt:'Склейка деревянных элементов в мастерской Ярги'},
  {src:'production-03.jpg',title:'Характер мебели —<br>в её деталях',description:'Форма, кромка и отделка имеют значение. Кадры мастерской показывают работу мастеров крупным планом.',alt:'Фрезеровка мебельной детали крупным планом'},
  {src:'production-04.jpg',title:'Живая фактура<br>натурального шпона',description:'Работа с древесной фактурой начинается с заготовок. Подбираем материал под характер будущего изделия.',alt:'Заготовки шпона на верстаке в мастерской Ярги'}
];
function wireFactory(){
  const image=document.getElementById('factory-image');if(!image)return;let index=0,visible=false,paused=false;
  const update=step=>{index=(index+step+factorySlides.length)%factorySlides.length;const slide=factorySlides[index];image.src=`assets/${slide.src}`;image.alt=slide.alt;document.getElementById('factory-title').innerHTML=slide.title;document.getElementById('factory-description').textContent=slide.description;document.getElementById('factory-counter').textContent=`${String(index+1).padStart(2,'0')} / 04`;};
  document.querySelectorAll('[data-factory]').forEach(b=>b.addEventListener('click',()=>{paused=true;update(Number(b.dataset.factory));}));
  const box=image.closest('.factory-slideshow');box.addEventListener('mouseenter',()=>paused=true);box.addEventListener('mouseleave',()=>paused=false);box.addEventListener('focusin',()=>paused=true);box.addEventListener('focusout',()=>paused=false);
  new IntersectionObserver(entries=>visible=entries[0].isIntersecting,{threshold:.25}).observe(box);
  if(!matchMedia('(prefers-reduced-motion:reduce)').matches)setInterval(()=>{if(visible&&!paused&&!document.hidden)update(1);},6500);
}
renderHeader();renderFooter();
if(document.body.dataset.page&&window.YargaPages)document.getElementById('main').innerHTML=window.YargaPages.render(document.body.dataset.page,categories);
const selected=new URLSearchParams(location.search).get('category');renderCatalog(categories.some(c=>c.id===selected)?selected:'all');
renderPortfolio();createDialogs();wireNavigation();wireActions();wireFactory();
