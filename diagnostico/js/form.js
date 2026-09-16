/**
 * Bazana Digital — Diagnóstico
 * Navegação do formulário multi-etapa (uma pergunta por tela).
 */

(function () {
  const views = {
    intro: document.getElementById('intro'),
    form: document.getElementById('diagForm'),
    final: document.getElementById('finalStep'),
  };

  const steps = Array.from(document.querySelectorAll('.step'));
  const total = steps.length;
  let current = 0;

  const progressFill = document.getElementById('progressFill');
  const progressStepLabel = document.getElementById('progressStepLabel');
  const progressPercentLabel = document.getElementById('progressPercentLabel');
  const totalStepsLabel = document.getElementById('totalStepsLabel');

  if (totalStepsLabel) totalStepsLabel.textContent = total;

  function showView(name) {
    Object.entries(views).forEach(([key, el]) => {
      if (!el) return;
      el.classList.toggle('is-active', key === name);
    });
  }

  function renderStep() {
    steps.forEach((step, i) => step.classList.toggle('is-active', i === current));
    const pct = Math.round(((current + 1) / total) * 100);
    progressFill.style.width = pct + '%';
    progressStepLabel.textContent = `Pergunta ${current + 1} de ${total}`;
    progressPercentLabel.textContent = pct + '%';
  }

  // ---------- Campos condicionais (ex: "Outra" área, link do site) ----------
  document.querySelectorAll('.option-list[data-field]').forEach((list) => {
    const fieldName = list.dataset.field;
    const conditionals = document.querySelectorAll(
      `.conditional-field[data-conditional-group="${fieldName}"]`
    );
    if (!conditionals.length) return;

    list.addEventListener('change', () => {
      const checked = list.querySelector(`input[name="${fieldName}"]:checked`);
      const value = checked ? checked.value : null;

      conditionals.forEach((block) => {
        const show = block.dataset.conditionalValue === value;
        block.hidden = !show;
        const input = block.querySelector('input');
        if (input) {
          if (show) {
            input.focus();
          } else {
            input.value = '';
          }
        }
      });
    });
  });

  function stepIsValid(step) {
    // Campo de texto obrigatório
    const textFields = step.querySelectorAll('.field-text[required]');
    for (const field of textFields) {
      const wrapper = field.closest('.conditional-field');
      if (wrapper && wrapper.hidden) continue; // condicional escondido não bloqueia
      if (!field.value.trim()) return false;
    }

    // Opção obrigatória
    const optionList = step.querySelector('.option-list[data-field]');
    if (optionList) {
      const fieldName = optionList.dataset.field;
      const checked = step.querySelector(`input[name="${fieldName}"]:checked`);
      if (!checked) return false;

      // Se a opção marcada revela um campo condicional, ele passa a ser obrigatório
      const visibleConditional = step.querySelector(
        `.conditional-field[data-conditional-group="${fieldName}"]:not([hidden])`
      );
      if (visibleConditional) {
        const input = visibleConditional.querySelector('input');
        if (input && !input.value.trim()) return false;
      }
    }

    return true;
  }

  function goNext() {
    const step = steps[current];
    if (!stepIsValid(step)) {
      step.classList.add('shake');
      setTimeout(() => step.classList.remove('shake'), 300);
      return;
    }
    if (current < total - 1) {
      current += 1;
      renderStep();
    }
  }

  function goBack() {
    if (current > 0) {
      current -= 1;
      renderStep();
    }
  }

  function collectAnswers() {
    const data = new FormData(views.form);
    const answers = {};
    for (const [key, value] of data.entries()) {
      answers[key] = value;
    }
    return answers;
  }

  document.getElementById('startBtn').addEventListener('click', () => {
    showView('form');
    renderStep();
  });

  document.querySelectorAll('[data-next]').forEach((btn) => {
    btn.addEventListener('click', goNext);
  });

  document.querySelectorAll('[data-back]').forEach((btn) => {
    btn.addEventListener('click', goBack);
  });

  views.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const step = steps[current];
    if (!stepIsValid(step)) return;

    const submitBtn = views.form.querySelector('[data-submit]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    const answers = collectAnswers();
    const result = await submitDiagnostico(answers);

    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar diagnóstico';

    if (result.ok || result.error === 'not_configured') {
      // Mostra tela final mesmo sem Supabase configurado ainda (modo dev)
      showView('final');
      initCalEmbed();
    } else {
      alert('Não foi possível enviar agora. Tente novamente em instantes.');
    }
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
