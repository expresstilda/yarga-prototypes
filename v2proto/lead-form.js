(() => {
  const consentPage = 'personal-data-consent.html';
  const attachmentTypes = /\.(?:jpe?g|png|webp|heic|heif|pdf)$/i;
  const maxFiles = 3;
  const maxBytes = 10 * 1024 * 1024;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  function markup(contact = {}, {callback = false} = {}) {
    return `<form class="lead-form" data-lead-form method="dialog" enctype="multipart/form-data"${callback ? ' aria-label="Заявка на обратный звонок"' : ''}>
      <div data-lead-fields>
        <div class="lead-fields">
          <label>Ваше имя<input name="name" type="text" autocomplete="name" placeholder="Как к вам обращаться" maxlength="80" value="${esc(contact.name)}" required></label>
          <label>Телефон<input name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="+7 900 000-00-00" maxlength="32" value="${esc(contact.phone)}" required></label>
          ${callback ? '' : `<label>Комментарий <small>необязательно</small><textarea name="comment" rows="2" maxlength="1500" placeholder="Например, размеры или ссылка на понравившуюся мебель">${esc(contact.comment)}</textarea></label>
          <label>Фото или документы <small>необязательно</small>
            <input name="attachments" type="file" multiple accept=".jpg,.jpeg,.png,.webp,.heic,.heif,.pdf">
            <small>До 3 файлов JPG, PNG, WebP, HEIC или PDF. Общий размер — до 10 МБ.</small>
          </label>
          <div class="lead-attachments" data-lead-attachments hidden>
            <ul aria-label="Выбранные файлы"></ul>
            <button class="text-button" type="button" data-lead-clear>Убрать файлы</button>
          </div>`}
        </div>
        <div class="lead-consent">
          <label><input type="checkbox" name="consent" ${contact.consent ? 'checked' : ''} required><span>Я даю <a href="${consentPage}" target="_blank" rel="noopener">согласие на обработку персональных данных</a> ООО «ЯРГА» для ответа на мою заявку.</span></label>
          <a class="lead-policy" href="personal-data-policy.html" target="_blank" rel="noopener">Политика обработки персональных данных</a>
        </div>
        <button class="button button-primary lead-submit" type="submit">Отправить заявку</button>
        <p class="lead-note">${callback ? 'Демонстрация. Данные остаются в браузере.' : 'Демонстрация. Данные и файлы остаются в браузере.'}</p>
      </div>
      <div class="lead-preview" data-lead-preview tabindex="-1" hidden>
        <strong>Заявка готова</strong>
        <p>${callback ? 'В рабочей версии сайта мы перезвоним по указанному номеру.' : 'В рабочей версии сайта она отправится в Яргу.'}</p>
      </div>
      <p class="lead-chat">Предпочитаете написать? <a data-lead-chat="telegram" target="_blank" rel="noopener noreferrer">Telegram</a> или <a data-lead-chat="max" target="_blank" rel="noopener noreferrer">MAX</a>.</p>
    </form>`;
  }

  function normalizePhone(value) {
    const raw = value.trim();
    if (!/^\+?[\d\s().-]+$/.test(raw)) return '';
    let digits = raw.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15 || /^([0-9])\1+$/.test(digits)) return '';
    if (!raw.startsWith('+') && digits.length === 10) digits = `7${digits}`;
    if (!raw.startsWith('+') && digits.length === 11 && digits.startsWith('8')) digits = `7${digits.slice(1)}`;
    return `+${digits}`;
  }

  function attachmentError(files) {
    if (files.length > maxFiles) return 'Выберите не больше трёх файлов.';
    if (files.some(file => !attachmentTypes.test(file.name))) return 'Выберите фото или PDF в одном из указанных форматов.';
    if (files.some(file => file.size === 0)) return 'В списке есть пустой файл. Выберите другой файл.';
    if (files.reduce((total, file) => total + file.size, 0) > maxBytes) return 'Общий размер файлов превышает 10 МБ.';
    return '';
  }

  function bind(form, {files = [], onPreview} = {}) {
    const {name, phone, attachments} = form.elements;
    const selection = form.querySelector('[data-lead-attachments]');
    const list = selection?.querySelector('ul');
    const preview = form.querySelector('[data-lead-preview]');
    form.querySelector('[data-lead-chat="telegram"]').href = window.YargaContact.telegramUrl;
    form.querySelector('[data-lead-chat="max"]').href = window.YargaContact.maxUrl;

    function updateAttachments() {
      if (!attachments) return;
      const chosen = Array.from(attachments.files);
      attachments.setCustomValidity(attachmentError(chosen));
      list.replaceChildren(...chosen.map(file => {
        const item = document.createElement('li');
        item.textContent = file.name;
        return item;
      }));
      list.hidden = chosen.length < 2;
      selection.hidden = chosen.length === 0;
    }

    if (attachments && files.length) {
      const transfer = new DataTransfer();
      files.forEach(file => transfer.items.add(file));
      attachments.files = transfer.files;
      updateAttachments();
    }

    name.addEventListener('input', () => name.setCustomValidity(''));
    phone.addEventListener('input', () => phone.setCustomValidity(''));
    attachments?.addEventListener('change', () => {
      updateAttachments();
      attachments.reportValidity();
    });
    form.querySelector('[data-lead-clear]')?.addEventListener('click', () => {
      attachments.value = '';
      updateAttachments();
      attachments.focus();
    });

    form.addEventListener('submit', event => {
      event.preventDefault();
      name.setCustomValidity(name.value.trim() ? '' : 'Введите ваше имя.');
      phone.setCustomValidity(normalizePhone(phone.value) ? '' : 'Введите телефон с кодом страны или 10 цифр российского номера.');
      updateAttachments();
      if (!form.reportValidity()) return;

      onPreview?.();
      form.reset();
      if (attachments) attachments.value = '';
      updateAttachments();
      form.querySelector('[data-lead-fields]').hidden = true;
      preview.hidden = false;
      preview.focus();
    });
  }

  window.YargaLeadForm = { markup, bind };
})();
