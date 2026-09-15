-- Bazana Digital — Diagnóstico
-- Tabela de leads capturados pelo formulário de diagnóstico.
--
-- `respostas` guarda TODAS as respostas em jsonb — assim, quando as
-- perguntas finais forem definidas (e puderem mudar depois), não é
-- preciso alterar o schema. Os campos soltos (nome_escritorio, porte)
-- ficam também como colunas normais só para facilitar filtro/busca no
-- Supabase Studio; ajustar depois que a lista de perguntas fechar.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  nome text,
  email text,
  whatsapp text,
  nome_escritorio text,
  porte text,
  area_atuacao text,
  respostas jsonb not null default '{}'::jsonb,
  origem text default 'diagnostico-form',
  criado_em timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Permite apenas INSERT via anon key (o form nunca lê nem edita leads existentes)
create policy "leads_insert_anon"
  on public.leads
  for insert
  to anon
  with check (true);

-- Nenhuma policy de select/update/delete para anon — leitura fica restrita
-- ao dashboard do Supabase (ou a um usuário autenticado, se um CRM externo
-- for plugado depois).
