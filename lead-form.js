(() => {
  const consentPage = 'personal-data-consent.html';
  const consentVersion = '24.11.2026';
  const email = 'yarga4@yandex.ru';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  function markup(contact = {}) {
    return `<form class="lead-form" data-lead-form method="dialog">
      <div class="lead-fields">
        <label>Ваше имя<input data-lead-contact name="name" type="text" autocomplete="name" placeholder="Как к вам обращаться" maxlength="80" value="${esc(contact.name)}" required></label>
        <label>Телефон<input data-lead-contact name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="+7 900 000-00-00" maxlength="32" value="${esc(contact.phone)}" required></label>
      </div>
      <div class="lead-consent">
        <label><input type="checkbox" name="consent" required><span>Я даю <a href="${consentPage}" target="_blank" rel="noopener">согласие на обработку персональных данных</a> ООО «ЯРГА» для ответа на мою заявку.</span></label>
        <a class="lead-policy" href="personal-data-policy.html" target="_blank" rel="noopener">Политика обработки персональных данных</a>
      </div>
      <div class="lead-actions">
        <button class="button button-primary" type="submit" name="channel" value="email">Открыть заявку в почте <span aria-hidden="true">↗</span></button>
        <button class="text-button" type="submit" name="channel" value="chat">Подготовить для Telegram или MAX</button>
      </div>
      <p class="lead-note">Отправьте готовую заявку в почтовом приложении или в чате.</p>
      <p class="lead-note" data-lead-email-status hidden><a data-lead-email-link>Открыть письмо ещё раз</a></p>
      <div class="lead-chat" data-lead-chat-ready hidden>
        <label data-lead-fallback hidden>Текст заявки<textarea rows="4" readonly></textarea></label>
        <div class="contact-actions">
          <a class="button button-outline" data-lead-chat="telegram" target="_blank" rel="noopener noreferrer">Открыть Telegram <span aria-hidden="true">↗</span></a>
          <a class="button button-outline" data-lead-chat="max" target="_blank" rel="noopener noreferrer">Открыть MAX <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <p class="lead-note" data-lead-chat-status role="status"></p>
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

  function bind(form, { subject, message }) {
    const name = form.elements.namedItem('name');
    const phone = form.elements.namedItem('phone');
    const consent = form.elements.namedItem('consent');
    const emailLink = form.querySelector('[data-lead-email-link]');
    const emailStatus = form.querySelector('[data-lead-email-status]');
    const chat = form.querySelector('[data-lead-chat-ready]');
    const chatStatus = form.querySelector('[data-lead-chat-status]');
    const fallback = form.querySelector('[data-lead-fallback]');
    const draftInput = fallback.querySelector('textarea');
    const links = window.YargaContact;
    form.querySelector('[data-lead-chat="telegram"]').href = links.telegramUrl;
    form.querySelector('[data-lead-chat="max"]').href = links.maxUrl;
    let revision = 0;

    function clearPrepared() {
      revision++;
      emailStatus.hidden = chat.hidden = fallback.hidden = true;
      emailLink.removeAttribute('href');
      draftInput.value = '';
      chatStatus.textContent = '';
    }

    form.addEventListener('input', event => {
      if (![name, phone, consent].includes(event.target)) return;
      event.target.setCustomValidity('');
      clearPrepared();
    });

    form.addEventListener('submit', async event => {
      event.preventDefault();
      name.setCustomValidity(name.value.trim() ? '' : 'Введите ваше имя.');
      const number = normalizePhone(phone.value);
      phone.setCustomValidity(number ? '' : 'Введите телефон с кодом страны или 10 цифр российского номера.');
      if (!form.reportValidity()) return;

      clearPrepared();
      const current = revision;
      const consentUrl = new URL(consentPage, location.href).href;
      const body = [
        message(),
        `Имя — ${name.value.trim()}`,
        `Телефон — ${number}`,
        '',
        `Даю согласие ООО «ЯРГА» на обработку персональных данных для ответа на заявку. Редакция от ${consentVersion}, ${consentUrl}. Отметка формы: ${new Date().toISOString()}.`
      ].join('\n');

      if (event.submitter?.value !== 'chat') {
        emailLink.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        emailStatus.hidden = false;
        emailLink.click();
        return;
      }

      let copied = false;
      try {
        await navigator.clipboard.writeText(body);
        copied = true;
      } catch {}
      if (current !== revision || !form.isConnected || !form.closest('dialog')?.open) return;
      chat.hidden = false;
      if (copied) {
        chatStatus.textContent = 'Заявка скопирована. Откройте чат и вставьте текст.';
      } else {
        fallback.hidden = false;
        draftInput.value = body;
        draftInput.focus();
        draftInput.select();
        chatStatus.textContent = 'Скопируйте выделенный текст и вставьте его в чат.';
      }
    });
  }

  window.YargaLeadForm = { markup, bind };
})();
