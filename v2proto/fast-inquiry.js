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

  let dialog;
  let opener;
  let inquiry;

  function requestDetails(trigger) {
    const {fastModel, fastCategory, fastCase, fastCaseTitle, fastDetail} = trigger.dataset;
    const catalog = window.YargaCatalogData;
    const model = catalog?.solutions?.find(item => item.id === fastModel);
    const categoryId = model?.category ?? fastCategory;
    const categoryName = Object.hasOwn(categoryNames, categoryId) ? categoryNames[categoryId] : '';
    const modelName = [model?.code, model?.name].filter(Boolean).join(' · ');
    const caseName = fastCaseTitle || fastCase;
    const draft = ['Здравствуйте! Хочу получить предварительный расчёт мебели.'];

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
      <h2 id="fast-inquiry-title" tabindex="-1">Расчёт по фото</h2>
      <p class="fast-inquiry-selection" data-fast-selection hidden></p>
      <p class="dialog-description" id="fast-inquiry-description">Прикрепите в чате фото, эскиз или ссылку на понравившуюся мебель. Если знаете примерные размеры, добавьте их к сообщению.</p>
      <div class="fast-inquiry-actions">
        <a class="button button-primary" data-fast-telegram target="_blank" rel="noopener noreferrer">Написать в Telegram <span aria-hidden="true">↗</span></a>
        <a class="button button-outline" data-fast-max target="_blank" rel="noopener noreferrer">Написать в MAX <span aria-hidden="true">↗</span></a>
      </div>
      <button class="text-button fast-inquiry-copy" type="button" data-fast-copy>Скопировать текст для MAX</button>
      <p class="fast-inquiry-status" role="status" hidden></p>
      <label class="fast-inquiry-fallback" hidden>Текст запроса<textarea rows="4" readonly></textarea></label>`;

    modal.addEventListener('click', event => {
      if (event.target.closest('[data-fast-telegram]')) reportAction('fast_telegram');
      if (event.target.closest('[data-fast-max]')) reportAction('fast_max');
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

    const fallback = modal.querySelector('.fast-inquiry-fallback');
    const input = fallback.querySelector('textarea');
    const status = modal.querySelector('[role="status"]');
    modal.querySelector('[data-fast-copy]').addEventListener('click', async () => {
      const currentInquiry = inquiry;
      const text = input.value;
      try {
        await navigator.clipboard.writeText(text);
        if (!modal.open || inquiry !== currentInquiry) return;
        status.textContent = 'Текст скопирован. Вставьте его в чат MAX.';
        status.hidden = false;
      } catch {
        if (!modal.open || inquiry !== currentInquiry) return;
        fallback.hidden = false;
        input.focus();
        input.select();
      }
    });

    (document.getElementById('overlays') || document.body).append(modal);
    return modal;
  }

  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-fast-inquiry]');
    const contact = window.YargaContact;
    if (!trigger || !contact) return;
    event.preventDefault();

    dialog ??= createDialog();
    if (dialog.open) return;
    opener = trigger;

    inquiry = requestDetails(trigger);
    const {summary, draft} = inquiry;
    const selection = dialog.querySelector('[data-fast-selection]');
    selection.textContent = summary;
    selection.hidden = !summary;
    dialog.querySelector('[data-fast-telegram]').href = contact.telegramDraft(draft);
    dialog.querySelector('[data-fast-max]').href = contact.maxUrl;
    dialog.querySelector('[role="status"]').hidden = true;
    dialog.querySelector('.fast-inquiry-fallback').hidden = true;
    dialog.querySelector('textarea').value = draft;

    dialog.showModal();
    document.body.classList.add('locked');
    dialog.querySelector('h2').focus({preventScroll: true});
    reportAction('fast_open');
  });
})();
