/**
 * Bazana Digital — Diagnóstico
 * Integração com Supabase (leads).
 *
 * Preencher com as credenciais do projeto Supabase antes do deploy.
 * A anon key é segura para uso no client DESDE QUE exista uma policy de
 * Row Level Security que permita apenas INSERT na tabela `leads`
 * (ver supabase/schema.sql — a policy já vem pronta lá).
 */

const SUPABASE_URL = 'COLOQUE_AQUI_A_URL_DO_PROJETO'; // ex: https://xxxx.supabase.co
const SUPABASE_ANON_KEY = 'COLOQUE_AQUI_A_ANON_KEY';

/**
 * Envia as respostas do diagnóstico para a tabela `leads` no Supabase
 * via REST (PostgREST), sem precisar do SDK completo.
 *
 * @param {Object} answers - respostas coletadas do formulário (chave = name do campo)
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
async function submitDiagnostico(answers) {
  const payload = {
    nome: answers.nome ?? null,
    email: answers.email ?? null,
    whatsapp: answers.whatsapp ?? null,
    nome_escritorio: answers.nome_escritorio ?? null,
    porte: answers.porte ?? null,
    area_atuacao: answers.area_atuacao === 'outra' ? answers.area_atuacao_outra : answers.area_atuacao,
    respostas: answers, // jsonb com todas as respostas, inclusive campos futuros
    origem: 'diagnostico-form',
    criado_em: new Date().toISOString(),
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
