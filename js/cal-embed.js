/**
 * Bazana Digital — Diagnóstico
 * Embed do Cal.com, exibido na tela final após envio do formulário.
 *
 * Preencher CAL_LINK com o seu link do Cal.com antes do deploy.
 * Formato: "seu-usuario/nome-do-evento" (sem https://cal.com/)
 */

const CAL_LINK = 'cassio-bazana-bts9y3/30min'; // ex: "cassio-bazana/diagnostico-45min"

function initCalEmbed() {
  const container = document.getElementById('calEmbed');
  if (!container) return;

  if (CAL_LINK.startsWith('COLOQUE_AQUI')) {
    container.innerHTML =
      '<p class="cal-embed-placeholder">Agendamento ainda não configurado — defina CAL_LINK em js/cal-embed.js.</p>';
    return;
  }

  (function (C, A, L) {
    let p = function (a, ar) { a.q.push(ar); };
    let d = C.document;
    C.Cal = C.Cal || function () {
      let cal = C.Cal;
      let ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        d.head.appendChild(d.createElement('script')).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ['initNamespace', namespace]);
        } else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, 'https://app.cal.com/embed/embed.js', 'init');

  Cal('init', { origin: 'https://cal.com' });

  Cal('inline', {
    elementOrSelector: '#calEmbed',
    calLink: CAL_LINK,
    layout: 'month_view',
  });

  Cal('ui', {
    theme: 'dark',
    cssVarsPerTheme: {
      dark: { 'cal-brand': '#319871' },
    },
    hideEventTypeDetails: false,
    layout: 'month_view',
  });
}
