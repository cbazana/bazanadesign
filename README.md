# Diagnóstico — Bazana Digital

Formulário de diagnóstico (nicho jurídico), estático (HTML/CSS/JS), tema dark, identidade Bazana Digital. Envia leads para Supabase.

## Estrutura
- `index.html` — página única, form multi-etapa (uma pergunta por tela)
- `css/styles.css` — tokens do design system + componentes
- `js/form.js` — navegação entre perguntas, validação, coleta de respostas
- `js/supabase-client.js` — envio para Supabase (preencher credenciais)
- `supabase/schema.sql` — schema da tabela `leads` + policy de RLS

## Setup do Supabase
1. Criar projeto em supabase.com
2. Rodar `supabase/schema.sql` no SQL Editor do projeto
3. Em Project Settings → API, copiar `Project URL` e `anon public key`
4. Colar em `js/supabase-client.js` (`SUPABASE_URL` e `SUPABASE_ANON_KEY`)

## Deploy (Vercel)
Projeto estático — sem build step. Import direto do repositório GitHub na Vercel, framework preset "Other".

## Setup do Cal.com
1. Em `js/cal-embed.js`, trocar `CAL_LINK` pelo seu link (formato `seu-usuario/nome-do-evento`, sem `https://cal.com/`)
2. O embed aparece automaticamente na tela final, após o envio do formulário

## Pendente
- [x] Perguntas do diagnóstico (10, com campos condicionais em "Área de atuação" e "Possui site")
- [ ] Credenciais do Supabase (`js/supabase-client.js`)
- [ ] Link do Cal.com (`js/cal-embed.js`)
- [ ] Repositório GitHub + deploy Vercel
