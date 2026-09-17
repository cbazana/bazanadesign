/**
 * Bazana Digital — Diagnóstico
 * Integração com Supabase (leads).
 *
 * Projeto: bazanadesign-crm (mesmo banco usado pelo painel CRM).
 * A anon key é segura para uso no client DESDE QUE exista uma policy de
 * Row Level Security que permita apenas INSERT na tabela `leads`
 * (ver schema do CRM — a policy leads_insert_anon já cobre isso).
 */

const SUPABASE_URL = 'https://pjigojibygnrlivkipgm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqaWdvamlieWducmxpdmtpcGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0OTUwMjgsImV4cCI6MjEwNTA3MTAyOH0.Zg0QbbuFPIWjxcvPMzzBdNBwzQbNQM-vaZ1poyejoZU';

/**
 * Envia as respostas do diagnóstico para a tabela `leads` no Supabase
 * via REST (PostgREST), sem precisar do SDK completo.
 *
 * @param {Object} answers - respostas coletadas do formulário (chave = name do campo)
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
async function submitDiagnostico(answers) {
  const payload = {
    origem: 'diagnostico-juridico',
    nome: answers.nome ?? null,
    email: answers.email ?? null,
    whatsapp: answers.whatsapp ?? null,
    empresa: answers.nome_escritorio ?? null,
    respostas: answers, // jsonb com todas as respostas, inclusive porte/área de atuação
  };

  if (SUPABASE_URL.startsWith('COLOQUE_AQUI') || SUPABASE_ANON_KEY.startsWith('COLOQUE_AQUI')) {
    console.warn('[supabase-client] Credenciais não configuradas — resposta não foi enviada.', payload);
    return { ok: false, error: 'not_configured' };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[supabase-client] Falha ao enviar:', res.status, text);
      return { ok: false, error: text };
    }

    return { ok: true };
  } catch (err) {
    console.error('[supabase-client] Erro de rede:', err);
    return { ok: false, error: String(err) };
  }
}
