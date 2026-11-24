(() => {
  const categoryNames = {
    kitchens: 'Кухни',
    wardrobes: 'Шкафы',
    dressing: 'Гардеробные',
    living: 'Гостиные',
    hallways: 'Прихожие',
    offices: 'Кабинеты',
    business: 'Мебель для бизнеса'
  };

  const inquiryCopy = {
    estimate: {
      title: 'Предварительный расчёт мебели',
      description: 'Пришлите в чат фото, эскиз, план или ссылку на понравившуюся мебель. Если знаете примерные размеры, укажите их в сообщении.',
      opening: 'Хочу получить предварительный расчёт мебели.'
    },
    'two-estimates': {
      title: 'Две сметы на вашу мебель',
      description: 'Выберите мессенджер и пришлите фото, эскиз или примерные размеры. По ним обсудим ваш проект и посчитаем две комплектации.',
      opening: 'Хочу получить две сметы на один проект и сравнить материалы, фурнитуру и стоимость.'
    },
    'compare-estimate': {
      title: 'Сравнение смет',
      description: 'Прикрепите готовую смету в чате. Если есть фото, эскиз или план с размерами, пришлите и его. Посмотрим, что включено в расчёт и какие варианты можно предложить.',
      opening: 'У меня уже есть расчёт мебели. Хочу сравнить комплектацию и узнать, какие варианты вы можете предложить.'
    }
  };

  let dialog;
  let opener;
  let inquiry;

  function requestDetails(trigger) {
    const {fastModel, fastCategory, fastCase, fastCaseTitle, fastDetail, fastPurpose} = trigger.dataset;
    const catalog = window.YargaCatalogData;
    const model = catalog?.solutions?.find(item => item.id === fastModel);
    const categoryId = model?.category ?? fastCategory;
    const categoryName = Object.hasOwn(categoryNames, categoryId) ? categoryNames[categoryId] : '';
    const modelName = [model?.code, model?.name].filter(Boolean).join(' · ');
    const caseName = fastCaseTitle || fastCase;
    const details = Object.hasOwn(inquiryCopy, fastPurpose) ? inquiryCopy[fastPurpose] : inquiryCopy.estimate;
    const draft = [`Здравствуйте! ${details.opening}`];

    if (categoryName) draft.push(`Раздел — ${categoryName}`);
    if (modelName) draft.push(`Модель — ${modelName}${model.code ? '' : ` (${model.id})`}`);
    else if (fastModel) draft.push(`Код модели — ${fastModel}`);
    if (caseName) draft.push(`Похожая работа — ${caseName}${fastCase && fastCase !== caseName ? ` (${fastCase})` : ''}`);
    if (fastDetail) draft.push(`Для расчёта — ${fastDetail}`);

    return {
      category: categoryName ? categoryId : '',
      model: model?.id || fastModel || '',
      caseId: fastCase || '',
      summary: [modelName, caseName, fastDetail].filter(Boolean).join(' · ') || categoryName,
      title: details.title,
      description: details.description,
      draft: draft.join('\n')
    };
  }

  function reportAction(action) {
    const {category, model, caseId} = inquiry;
    document.dispatchEvent(new CustomEvent('yarga:lead-action', {detail:{action, category, model, caseId}}));
  }

  function createDialog() {
    const modal = document.createElement('dialog');
    modal.className = 'form-dialog fast-inquiry-dialog';
    modal.id = 'fast-inquiry-dialog';
    modal.setAttribute('aria-labelledby', 'fast-inquiry-title');
    modal.setAttribute('aria-describedby', 'fast-inquiry-description');
    modal.innerHTML = `
      <button class="dialog-close" type="button" data-fast-close aria-label="Закрыть окно">×</button>
      <h2 id="fast-inquiry-title" tabindex="-1"></h2>
      <p class="fast-inquiry-selection" data-fast-selection hidden></p>
      <p class="dialog-description" id="fast-inquiry-description"></p>
      <div data-fast-form></div>`;

    modal.addEventListener('click', event => {
      const channel = event.target.closest('[data-lead-chat]')?.dataset.leadChat;
      if (channel) reportAction('fast_' + channel);
      if (event.target.closest('[data-fast-close]')) modal.close();
      if (event.target === modal) {
        const bounds = modal.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) modal.close();
      }
    });
    modal.addEventListener('close', () => {
      if (modal.open) return;
      if (!document.querySelector('dialog[open]')) document.body.classList.remove('locked');
      if (opener?.isConnected) opener.focus({preventScroll: true});
    });

    (document.getElementById('overlays') || document.body).append(modal);
    return modal;
  }

  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-fast-inquiry]');
    if (!trigger || !window.YargaContact) return;
    event.preventDefault();

    dialog ??= createDialog();
    if (dialog.open) return;
    opener = trigger;

    inquiry = requestDetails(trigger);
    const {summary, draft, title, description} = inquiry;
    const heading = dialog.querySelector('#fast-inquiry-title');
    heading.textContent = title;
    dialog.querySelector('#fast-inquiry-description').textContent = description;
    const selection = dialog.querySelector('[data-fast-selection]');
    selection.textContent = summary;
    selection.hidden = !summary;
    const formHost = dialog.querySelector('[data-fast-form]');
    formHost.innerHTML = window.YargaLeadForm.markup();
    window.YargaLeadForm.bind(formHost.querySelector('[data-lead-form]'), {subject: title, message: () => draft});

    dialog.showModal();
    document.body.classList.add('locked');
    heading.focus({preventScroll: true});
    reportAction('fast_open');
  });
})();
