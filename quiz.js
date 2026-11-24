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
    kitchens:[choice('style','Какой стиль кухни вам ближе?',['Современный','Неоклассика','Минимализм','Пока выбираю']),choice('layout','Какую планировку рассматриваете?',['Прямая','Угловая','П-образная','С островом','С полуостровом','Параллельная','Нужна помощь с планировкой']),size,choice('material','Какие фасады рассматриваете?',['Окрашенные фасады','С древесной фактурой','Шпон','Комбинированные','Нужна помощь с материалами']),choice('equipment','Что учесть в проекте кухни?',['Встроенную технику','Шкафы до потолка','Больше выдвижных ящиков','Витрины и подсветку','Пока не знаю'],'Можно выбрать несколько вариантов. Технику и её стоимость согласуем отдельно.',true),timing],
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
  const steps = () => [...(state.chooseType?[{id:'category',type:'category',title:state.purpose==='design'?'Для какой мебели нужен дизайн-проект?':'Какую мебель вы хотите рассчитать?'}]:[]),...routes[state.category||'kitchens'],{id:'contact',type:'contact',title:state.purpose==='design'?'Заявка на дизайн-проект':'Заявка на расчёт мебели'}];
  function ensureDialog(){
    if(dialog)return;
    dialog=document.createElement('dialog');dialog.className='quiz-dialog';dialog.id='quiz-dialog';dialog.setAttribute('aria-labelledby','quiz-title');
    document.getElementById('overlays').append(dialog);
    dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('locked');previousFocus?.focus();});
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
    dialog.addEventListener('input',()=>{
      saveInputs();const next=dialog.querySelector('[data-quiz-next]');if(next)next.disabled=!validStep();
    });
  }
  function open(kind, modelId, purpose){
    ensureDialog();previousFocus=document.activeElement;
    const current=kind||(!document.body.classList.contains('home')?new URLSearchParams(location.search).get('category'):null);
    const known=kinds.some(k=>k[0]===current);
    const model = window.YargaCatalogData?.solutions.find(item => item.id === modelId && item.category === current);
    const answers = {};
    if (model && current === 'kitchens') {
      if (routes.kitchens[0].options.includes(model.style)) answers.style = model.style;
      if (routes.kitchens[1].options.includes(model.type)) answers.layout = model.type;
    }
    state={category:known?current:null,chooseType:!known,index:0,answers,model,purpose,contact:{name:'',phone:''}};
    render();closeMenus();dialog.showModal();document.body.classList.add('locked');dialog.querySelector('#quiz-title').focus();
  }
  function dimensionFields(){
    const a=state.answers.size||{};
    const kitchen=state.category==='kitchens';
    const corner=['Угловая','П-образная','С островом','С полуостровом','Параллельная'].includes(state.answers.layout);
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
    if(step.type==='contact')dialog.querySelectorAll('[data-lead-contact]').forEach(field=>{state.contact[field.name]=field.value;});
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
  function answerText(step){
    const answer = state.answers[step.id];
    if(step.type==='size'){
      if(answer?.unknown)return 'Уточним на замере';
      return [['width','Ширина / длина'],['side','Вторая сторона / остров'],['height','Высота'],['depth','Глубина']].filter(([key])=>answer?.[key]).map(([key,label])=>`${label}: ${answer[key]} см`).join(', ');
    }
    return Array.isArray(answer) ? answer.join(', ') : answer;
  }
  function summary(){
    const model = state.model;
    const modelRow = model ? `<div><dt>Модель</dt><dd>${esc(model.code ? model.code + ' · ' + model.name : model.name)}</dd></div>` : '';
    return `<div class="quiz-summary"><h3>Ваш проект: ${esc(category()[1].toLowerCase())}</h3><dl>${modelRow}${steps().map((step,i)=>{
      if(['category','contact'].includes(step.id))return '';
      return `<div><dt>${esc(step.title)}</dt><dd>${esc(answerText(step))} <button type="button" data-quiz-edit="${i}" aria-label="Изменить: ${esc(step.title)}">Изменить</button></dd></div>`;
    }).join('')}</dl></div>`;
  }
  function requestText(){
    const request = state.purpose==='design' ? 'Хотелось бы заказать бесплатный дизайн-проект.' : 'Хотелось бы получить расчёт мебели.';
    const model = state.model;
    const lines = ['Здравствуйте! ' + request, 'Направление: ' + category()[1]];
    if(model)lines.push('Модель: ' + [model.code, model.name].filter(Boolean).join(' · '));
    for(const step of routes[state.category]){
      const answer=answerText(step);
      if(answer)lines.push(`${step.title} ${answer}`);
    }
    return lines.join('\n');
  }
  function contactStep(){
    return `<div class="quiz-contact-layout"><div class="quiz-contact">
      <h3>Как с вами связаться</h3>
      ${window.YargaLeadForm.markup(state.contact)}
    </div>${summary()}</div>`;
  }
  function render(){
    const list=steps(), step=list[state.index], selected=state.answers[step.id];
    let body='';
    if(step.type==='category')body=`<div class="quiz-categories">${kinds.map(([id,name,image])=>`<label class="quiz-category"><input type="radio" name="category" value="${id}" ${state.category===id?'checked':''}>${image?`<img src="assets/${image}.${isWireframe()?'svg':'webp'}" alt="" width="480" height="300">`:'<span class="quiz-other" aria-hidden="true">＋</span>'}<span class="quiz-option-label">${name}<i aria-hidden="true"></i></span></label>`).join('')}</div>`;
    else if(step.type==='size')body=dimensionFields();
    else if(step.type==='text')body=`<label class="quiz-description-label">Что нужно изготовить<textarea name="description" rows="4" maxlength="1500" placeholder="Что изготовить и где будет стоять">${esc(selected)}</textarea></label>`;
    else if(step.type==='contact')body=contactStep();
    else body=`<fieldset class="quiz-options"><legend class="sr-only">${esc(step.title)}</legend>${step.options.map(option=>`<label class="quiz-option"><input type="${step.type==='multi'?'checkbox':'radio'}" name="answer" value="${esc(option)}" ${Array.isArray(selected)?selected.includes(option)?'checked':'':selected===option?'checked':''}><span>${option}</span><i aria-hidden="true"></i></label>`).join('')}</fieldset>`;
    const progress=Math.round(state.index/(list.length-1)*100);
    const backMarkup=state.index?`<button class="text-button" type="button" data-quiz-back>${state.editing?'← К ответам':'← Назад'}</button>`:'<span class="quiz-time">Около 2 минут</span>';
    const nextMarkup=step.type!=='contact'?`<button class="button button-primary" type="button" data-quiz-next>${state.editing?'Сохранить':'Далее'} <span aria-hidden="true">→</span></button>`:'';
    dialog.innerHTML=`<button class="dialog-close" type="button" data-quiz-close aria-label="Закрыть квиз">×</button><div class="quiz-sidebar"><a class="wordmark" href="index.html">ЯРГА<small>Мебель на заказ</small></a><h2>${state.purpose==='design'?'Дизайн-проект мебели':'Расчёт стоимости мебели'}</h2><p>Укажите, какую мебель хотите заказать, и ответьте на вопросы о размерах и материалах.</p></div><div class="quiz-body"><div class="quiz-progress-info"><span>${category()?esc(category()[1]):state.purpose==='design'?'Дизайн-проект':'Расчёт мебели'}</span><span>Шаг ${state.index+1} из ${list.length}</span></div><div class="quiz-progress" role="progressbar" aria-label="Прогресс квиза" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><span style="width:${progress}%"></span></div><h2 id="quiz-title" tabindex="-1">${step.title}</h2><p class="quiz-hint">${step.hint||(step.type==='category'?'Выберите мебель, которую хотите заказать.':step.type==='contact'?'Проверьте ответы. Любой пункт можно изменить.':'Выберите один вариант.')}</p>${body}<div class="quiz-navigation">${backMarkup}${nextMarkup}</div></div>`;
    const form=dialog.querySelector('[data-lead-form]');
    if(form)window.YargaLeadForm.bind(form,{subject:step.title,message:requestText});
    const next=dialog.querySelector('[data-quiz-next]');if(next)next.disabled=!validStep();
    dialog.scrollTop=0;dialog.querySelector('.quiz-body').scrollTop=0;
    if(dialog.open)dialog.querySelector('#quiz-title').focus();
  }
  function updateEntry(id){
    const button=document.querySelector('[data-catalog-quiz]');if(!button)return;
    const kind=kinds.find(k=>k[0]===id);button.dataset.quiz=kind?kind[0]:'';
    document.getElementById('catalog-quiz-title').textContent=kind?`Вы выбрали: ${kind[1].toLowerCase()}`:'Рассчитать стоимость мебели';
  }
  document.addEventListener('click',event=>{const button=event.target.closest('[data-quiz]');if(button)open(button.dataset.quiz, button.dataset.quizModel);});
  window.YargaQuiz={open,updateEntry};
  updateEntry(new URLSearchParams(location.search).get('category'));
})();
