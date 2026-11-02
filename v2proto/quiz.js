/* Browser-only prototype: answers and contacts are never transmitted or persisted. */
(() => {
  const kinds = [
    ['kitchens','Кухни','category-kitchens'],['wardrobes','Шкафы','category-wardrobes'],
    ['dressing','Гардеробные','category-dressing'],['living','Гостиные','category-living'],
    ['hallways','Прихожие','category-hallways'],['offices','Кабинеты','category-offices'],
    ['other','Другая мебель',null]
  ];
  const choice = (id,title,options,hint='',multi=false) => ({id,title,options,hint,type:multi?'multi':'choice'});
  const finish = choice('finish','Какие фасады вам ближе?',['Лаконичные матовые','С фактурой дерева','Сочетание материалов','Нужна помощь с выбором']);
  const timing = choice('timing','Когда планируете заказать мебель?',['В ближайшее время','Через 1–3 месяца','Позже, пока планирую','Пока не определились'],'Поможет понять, на каком этапе вы находитесь. Срок изготовления обсудим по проекту.');
  const size = {id:'size',type:'size',title:'Какие размеры уже известны?',hint:'Укажите примерные габариты в сантиметрах. Точные размеры проверим на замере.'};
  const storage = choice('storage','Что важно разместить?',['Одежду на плечиках','Полки для вещей','Выдвижные ящики','Обувь и аксессуары','Хозяйственные вещи','Нужна помощь с наполнением'],'Можно выбрать несколько вариантов.',true);
  const routes = {
    kitchens:[choice('style','Какой стиль кухни вам ближе?',['Современный','Неоклассика','Минимализм','Пока выбираю']),choice('layout','Какую планировку рассматриваете?',['Прямая','Угловая','П-образная','С островом','Нужна помощь с планировкой']),size,choice('material','Какие фасады рассматриваете?',['Окрашенные фасады','С древесной фактурой','Шпон','Комбинированные','Нужна помощь с материалами']),choice('equipment','Что учесть в проекте кухни?',['Встроенную технику','Шкафы до потолка','Больше выдвижных ящиков','Витрины и подсветку','Пока не знаю'],'Можно выбрать несколько вариантов. Технику и её стоимость согласуем отдельно.',true),timing],
    wardrobes:[choice('construction','Какой шкаф вам нужен?',['Встроенный в нишу','Отдельно стоящий','Во всю стену','Пока не определились']),choice('doors','Какие двери вам удобнее?',['Распашные','Раздвижные','Комбинированные','Нужна помощь с выбором']),size,storage,finish,timing],
    dressing:[choice('layout','Как расположить гардеробную?',['Вдоль одной стены','Углом','По трём стенам','В отдельной комнате','Нужна помощь с планировкой']),choice('system','Какое хранение вам ближе?',['Открытое','За фасадами','Открытое и закрытое','Пока не определились']),size,storage,timing],
    living:[choice('product','Какую мебель для гостиной планируете?',['Тумбу под ТВ','ТВ-зону со шкафами','Стеллаж или библиотеку','Витрину','Комплект мебели']),size,finish,timing],
    hallways:[choice('product','Что нужно для прихожей?',['Шкаф для одежды','Тумбу и место для сидения','Открытое хранение','Комплект для прихожей']),size,storage,finish,timing],
    offices:[choice('product','Что нужно для рабочего пространства?',['Рабочий стол','Шкафы или библиотеку','Стол с системой хранения','Мебель для всего кабинета']),size,finish,timing],
    other:[{id:'description',type:'text',title:'Что вы хотите изготовить?',hint:'Например, прикроватную тумбу, комод или стеллаж по вашему эскизу.'},size,finish,timing]
  };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let state, dialog, previousFocus;
  const isWireframe = () => !!document.querySelector('link[href*="wireframe.css"]');
  const category = () => kinds.find(k=>k[0]===state.category);
  const steps = () => [...(state.chooseType?[{id:'category',type:'category',title:'Какую мебель вы хотите рассчитать?'}]:[]),...routes[state.category||'kitchens'],{id:'contact',type:'contact',title:'Всё готово для обсуждения проекта'}];
  function ensureDialog(){
    if(dialog)return;
    dialog=document.createElement('dialog');dialog.className='quiz-dialog';dialog.id='quiz-dialog';dialog.setAttribute('aria-labelledby','quiz-title');
    document.getElementById('overlays').append(dialog);
    dialog.addEventListener('close',()=>{document.body.classList.remove('locked');previousFocus?.focus();});
    dialog.addEventListener('click',event=>{
      if(event.target.closest('[data-quiz-close]')){dialog.close();return;}
      const back=event.target.closest('[data-quiz-back]');if(back){saveInputs();if(state.editing){state.index=steps().length-1;state.editing=false;}else state.index--;render();return;}
      const edit=event.target.closest('[data-quiz-edit]');if(edit){saveInputs();state.index=Number(edit.dataset.quizEdit);state.editing=true;render();return;}
      const next=event.target.closest('[data-quiz-next]');if(next)advance();
    });
    dialog.addEventListener('change',event=>{
      const input=event.target;
      if(input.name==='category'){
        if(state.category!==input.value){state.category=input.value;state.answers={};}
      }else if(input.name==='answer'){
        const step=steps()[state.index];
        state.answers[step.id]=step.type==='multi'?[...dialog.querySelectorAll('[name=answer]:checked')].map(x=>x.value):input.value;
      }else saveInputs();
      if(input.name==='answer'&&steps()[state.index].id==='layout'&&input.value==='Прямая'&&state.answers.size)delete state.answers.size.side;
      const next=dialog.querySelector('[data-quiz-next]');if(next)next.disabled=!validStep();
      if(input.name==='unknownSize')dialog.querySelectorAll('[data-size]').forEach(x=>x.disabled=input.checked);
    });
    dialog.addEventListener('input',event=>{if(event.target.name==='phone')event.target.setCustomValidity('');saveInputs();const next=dialog.querySelector('[data-quiz-next]');if(next)next.disabled=!validStep();});
    dialog.addEventListener('submit',event=>{
      event.preventDefault();saveInputs();
      const phone=state.contact.phone.replace(/\D/g,'');
      const phoneInput=dialog.querySelector('[name=phone]');
      phoneInput.setCustomValidity(phone.length>=10&&phone.length<=15?'':'Укажите телефон: от 10 до 15 цифр.');
      if(!event.target.reportValidity())return;
      state.contact={};
      dialog.querySelector('.quiz-body').innerHTML=`<div class="quiz-success"><span class="success-mark" aria-hidden="true">✓</span><h2 id="quiz-title" tabindex="-1">Сценарий расчёта готов</h2><p>В готовом сайте ваши ответы и контакт поступят в Яргу для подготовки расчёта.</p><p class="form-note">Это демонстрация прототипа. Заявка не отправлена, контактные данные не сохраняются.</p><button type="button" class="button button-primary" data-quiz-close>Готово</button></div>`;
      dialog.querySelector('#quiz-title').focus();
    });
  }
  function open(kind){
    ensureDialog();previousFocus=document.activeElement;
    const current=kind||(!document.body.classList.contains('home')?new URLSearchParams(location.search).get('category'):null);
    const known=kinds.some(k=>k[0]===current);
    state={category:known?current:null,chooseType:!known,index:0,answers:{},contact:{}};
    render();closeMenus();dialog.showModal();document.body.classList.add('locked');dialog.querySelector('#quiz-title').focus();
  }
  function dimensionFields(){
    const a=state.answers.size||{};
    const kitchen=state.category==='kitchens';
    const corner=['Угловая','П-образная','С островом'].includes(state.answers.layout);
    const fields=kitchen?[['width','Длина основной линии','Например, 300'],...(corner?[['side','Длина второй стороны / острова','Например, 200']]:[]),['height','Высота помещения','Например, 270']]:[['width','Ширина','Например, 240'],['height','Высота','Например, 260'],['depth','Глубина','Например, 60']];
    return `<div class="quiz-dimensions">${fields.map(([id,label,placeholder])=>`<label>${label}, см<input data-size="${id}" type="number" inputmode="decimal" min="1" max="3000" step="0.1" value="${esc(a[id]||'')}" placeholder="${placeholder}" ${a.unknown?'disabled':''}></label>`).join('')}</div><label class="quiz-unknown"><input type="checkbox" name="unknownSize" ${a.unknown?'checked':''}>Размеров пока нет — нужна помощь с замером</label>`;
  }
  function saveInputs(){
    if(!state)return;
    const step=steps()[state.index];
    if(step.type==='size'){
      const prior=state.answers.size||{};const values={...prior,unknown:!!dialog.querySelector('[name=unknownSize]')?.checked};
      dialog.querySelectorAll('[data-size]').forEach(x=>values[x.dataset.size]=x.value);state.answers.size=values;
    }
    if(step.type==='text')state.answers.description=dialog.querySelector('[name=description]')?.value||'';
    if(step.type==='contact')dialog.querySelectorAll('[data-contact]').forEach(x=>{state.contact[x.name]=x.type==='checkbox'?x.checked:x.value;});
  }
  function validStep(){
    const step=steps()[state.index], answer=state.answers[step.id];
    if(step.type==='category')return !!state.category;
    if(step.type==='size'){
      if(answer?.unknown)return true;
      const fields=[...dialog.querySelectorAll('[data-size]')];
      return fields.some(x=>x.value)&&fields.every(x=>!x.value||x.checkValidity());
    }
    if(step.type==='text')return (answer||'').trim().length>=3;
    return Array.isArray(answer)?answer.length>0:!!answer;
  }
  function advance(){saveInputs();if(!validStep())return;state.index=state.editing?steps().length-1:state.index+1;state.editing=false;render();}
  function summary(){
    const sizeText=a=>a?.unknown?'Уточним на замере':[['width','Ширина / длина'],['side','Вторая сторона / остров'],['height','Высота'],['depth','Глубина']].filter(([key])=>a?.[key]).map(([key,label])=>`${label}: ${a[key]} см`).join(', ');
    return `<div class="quiz-summary"><h3>Ваш проект: ${esc(category()[1].toLowerCase())}</h3><dl>${steps().map((step,i)=>{
      if(['category','contact'].includes(step.id))return '';
      const answer=state.answers[step.id];const text=step.type==='size'?sizeText(answer):Array.isArray(answer)?answer.join(', '):answer;
      return `<div><dt>${esc(step.title)}</dt><dd>${esc(text)} <button type="button" data-quiz-edit="${i}" aria-label="Изменить: ${esc(step.title)}">Изменить</button></dd></div>`;
    }).join('')}</dl></div>`;
  }
  function contactForm(){
    const c=state.contact;
    return `<div class="quiz-contact-layout">${summary()}<form class="quiz-contact"><h3>Куда отправить расчёт?</h3><p>Обсудим комплектацию и подготовим предложение по вашему проекту. Итоговая цена зависит от размеров и материалов.</p><label>Ваше имя<input data-contact name="name" autocomplete="name" value="${esc(c.name)}" placeholder="Как к вам обращаться" maxlength="100"></label><label>Телефон<input data-contact name="phone" type="tel" autocomplete="tel" value="${esc(c.phone)}" placeholder="+7 (___) ___-__-__" required minlength="10" maxlength="25"></label><label>Удобный способ связи<select data-contact name="channel">${['Позвонить','Написать в Telegram','Написать в MAX'].map(x=>`<option ${c.channel===x?'selected':''}>${x}</option>`).join('')}</select></label><label>Комментарий<textarea data-contact name="comment" rows="2" maxlength="1500" placeholder="Пожелания, район, удобное время">${esc(c.comment)}</textarea></label><label class="consent"><input data-contact name="consent" type="checkbox" required ${c.consent?'checked':''}><span>Даю <a href="https://yarga.gallery/soglasie" target="_blank" rel="noopener noreferrer">согласие на обработку персональных данных</a>. <a href="https://yarga.gallery/privacypolicy" target="_blank" rel="noopener noreferrer">Политика</a></span></label><button class="button button-primary" type="submit">Получить расчёт <span aria-hidden="true">↗</span></button><p class="form-note">Демонстрационная форма. Ответы и контакты не отправляются.</p></form></div>`;
  }
  function render(){
    const list=steps(), step=list[state.index], selected=state.answers[step.id];
    let body='';
    if(step.type==='category')body=`<div class="quiz-categories">${kinds.map(([id,name,image])=>`<label class="quiz-category"><input type="radio" name="category" value="${id}" ${state.category===id?'checked':''}>${image?`<img src="assets/${image}.${isWireframe()?'svg':'webp'}" alt="" width="480" height="300">`:'<span class="quiz-other" aria-hidden="true">＋</span>'}<span class="quiz-option-label">${name}<i aria-hidden="true"></i></span></label>`).join('')}</div>`;
    else if(step.type==='size')body=dimensionFields();
    else if(step.type==='text')body=`<label class="quiz-description-label">Предмет и пожелания<textarea name="description" rows="4" maxlength="1500" placeholder="Что изготовить и где будет стоять">${esc(selected)}</textarea></label>`;
    else if(step.type==='contact')body=contactForm();
    else body=`<fieldset class="quiz-options"><legend class="sr-only">${esc(step.title)}</legend>${step.options.map(option=>`<label class="quiz-option"><input type="${step.type==='multi'?'checkbox':'radio'}" name="answer" value="${esc(option)}" ${Array.isArray(selected)?selected.includes(option)?'checked':'':selected===option?'checked':''}><span>${option}</span><i aria-hidden="true"></i></label>`).join('')}</fieldset>`;
    const progress=Math.round(state.index/(list.length-1)*100);
    const backMarkup=state.index?`<button class="text-button" type="button" data-quiz-back>${state.editing?'← К сводке':'← Назад'}</button>`:'<span class="quiz-time">Около 2 минут</span>';
    const nextMarkup=step.type!=='contact'?`<button class="button button-primary" type="button" data-quiz-next>${state.editing?'Сохранить':'Далее'} <span aria-hidden="true">→</span></button>`:'';
    dialog.innerHTML=`<button class="dialog-close" type="button" data-quiz-close aria-label="Закрыть квиз">×</button><div class="quiz-sidebar"><a class="wordmark" href="index.html">ЯРГА<small>Мебель на заказ</small></a><p class="eyebrow">Ваш проект начинается здесь</p><h2>Мебель,<br>которая подходит<br>именно вам.</h2><p>Несколько вопросов о вашем пространстве и пожеланиях — для предметного разговора о стоимости.</p><div class="quiz-sidebar-note">По вашим размерам<br>Напрямую от производителя<br>Москва и Московская область</div></div><div class="quiz-body"><div class="quiz-progress-info"><span>${category()?esc(category()[1]):'Расчёт мебели'}</span><span>Шаг ${state.index+1} из ${list.length}</span></div><div class="quiz-progress" role="progressbar" aria-label="Прогресс квиза" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><span style="width:${progress}%"></span></div><h2 id="quiz-title" tabindex="-1">${step.title}</h2><p class="quiz-hint">${step.hint||(step.type==='category'?'Выберите направление — дальше будут вопросы именно о вашей мебели.':step.type==='contact'?'Проверьте ответы. Любой пункт можно изменить.':'Выберите один вариант.')}</p>${body}<div class="quiz-navigation">${backMarkup}${nextMarkup}</div></div>`;
    const next=dialog.querySelector('[data-quiz-next]');if(next)next.disabled=!validStep();
    dialog.scrollTop=0;dialog.querySelector('.quiz-body').scrollTop=0;
    if(dialog.open)dialog.querySelector('#quiz-title').focus();
  }
  function updateEntry(id){
    const button=document.querySelector('[data-catalog-quiz]');if(!button)return;
    const kind=kinds.find(k=>k[0]===id);button.dataset.quiz=kind?kind[0]:'';
    document.getElementById('catalog-quiz-title').textContent=kind?`Начнём с вашего проекта: ${kind[1].toLowerCase()}`:'Рассчитаем мебель под ваше пространство';
  }
  document.addEventListener('click',event=>{const button=event.target.closest('[data-quiz]');if(button)open(button.dataset.quiz);});
  window.YargaQuiz={open,updateEntry};
  updateEntry(new URLSearchParams(location.search).get('category'));
})();
