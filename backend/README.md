# Backend do Caderno e Xii — v11

O backend usa Supabase Auth, Postgres e Edge Functions para notas privadas e perguntas ao Gemini. GitHub Pages serve a interface estática; publicar esta pasta não executa SQL nem funções. Esta pasta contém código e instruções, sem credenciais.

## Estado em 24/10/2026

- Projeto dedicado no plano gratuito em `enricodev`, região São Paulo, referência `wmbkfxpnwzdtljmfqorn`, status `ACTIVE_HEALTHY`.
- `schema.sql` foi aplicado ao projeto inicialmente vazio na v9. `closed-beta.sql` é a extensão incremental da v10 e já foi aplicada: convites privados por e-mail verificado e configuração privada da IA.
- `study-assistant` v11 e `study-account` v9 estão ACTIVE com `verify_jwt: true`. A função de conta não mudou na v11.
- URL e chave publishable estão preenchidas no cliente; `accountsEnabled: true`, `aiEnabled: true`, `accessMode: 'closed_beta'` e `legalReady: false`. Login, notas e IA funcionam para convidados; cadastro público e recuperação por e-mail estão ocultos na interface.
- O dono criou sua conta com senha pelo Supabase Dashboard. SMTP não está configurado. Não há senha, e-mail de convidado ou segredo de provedor nesta documentação.
- A IA está habilitada na configuração privada com `gemini-3.5-flash-lite`, usado nas respostas HTTP reais da v11. Há novas tentativas limitadas e alternativo gratuito `gemini-3.6-flash`. A modalidade gratuita foi conferida na [tabela oficial de preços](https://ai.google.dev/gemini-api/docs/pricing); nenhuma cobrança paga foi ativada.
- Privacidade e termos continuam como minutas não vigentes, versão `2026-10-23`. Nome do controlador e contato foram explicitamente adiados pelo usuário até o lançamento público; essa pendência não bloqueia o teste fechado autorizado.

## Arquivos e contratos

| Arquivo | Função |
| --- | --- |
| `schema.sql` | Bootstrap v9 de um projeto novo: perfil de aceite, notas, RLS, sessão ativa, versão, limites e contador de IA. |
| `closed-beta.sql` | Extensão incremental para o banco v9: lista privada de convidados, bloqueio de novas escritas/IA sem convite e configuração privada de modelo/ativação. |
| `verify-rls.sql` | Verificação transacional com usuários sintéticos e rollback: PASS v9; tentativas v10 expiradas/canceladas, sem nova execução integral v11. |
| `functions/shared/handler.mjs` | Handler compartilhado de autenticação, limites, busca do caderno, fontes de página/rascunho, Gemini com retries e exclusão. |
| `functions/study-assistant/index.ts` | Entrada Deno da função de perguntas. |
| `functions/study-account/index.ts` | Entrada Deno da função de exclusão de conta. |

`schema.sql` não é uma migração incremental ou um script idempotente. `closed-beta.sql` também contém criações e alterações não repetíveis: ambos já foram aplicados ao projeto atual e não devem ser reaplicados. Não foi produzido histórico de migrações via CLI. Para outro banco, inspecione o estado e histórico antes de preparar a migração; use o fluxo oficial da versão instalada do Supabase CLI, consultando `--help`, e preserve objetos e dados não relacionados.

Notas e perfis exigem proprietário autenticado com sessão ativa em `auth.sessions`; clientes não podem trocar o dono. Novos perfis, criações e edições de notas e uso da IA exigem convite habilitado em `private.study_beta_invites` para o e-mail confirmado do usuário. A lista é gerida somente por operador confiável e não é acessível aos clientes. Revogar um convite interrompe novas escritas e IA, mas preserva leitura, exportação e exclusão dos dados próprios e exclusão da conta.

Salvar uma edição filtra `id` e `version`; uma versão antiga mantém o texto no editor e pede recarga da lista. O contador de IA é atômico, deriva o dono da sessão, exige convite e aceite da versão registrada no perfil e fica no schema privado, com wrapper público `SECURITY INVOKER`. Esse aceite experimental não torna as minutas vigentes. Não há bucket ou upload dos arquivos originais.

A função de perguntas autentica usuário e sessão, confirma e-mail, convite e aceite da conta, valida consentimento e envia somente as fontes habilitadas ao Gemini. Pode responder sem notas; quando a busca está ligada, consulta somente notas do dono autenticado. O assistente não modifica notas nem pesquisa na internet. A função de conta confirma a senha atual, encerra sessões globalmente e exclui o usuário; as chaves estrangeiras removem perfil, notas e contadores ativos. Isso não promete eliminação imediata de backups ou registros mantidos por fornecedores.

## Operar o teste fechado

1. Confirme o projeto no Dashboard. Preserve `verify_jwt: true` nas duas funções e confira políticas, grants e advisors após alterações.
2. Para autorizar alguém, confirme por canal confiável que a pessoa controla o e-mail, prepare sua conta com senha em **Authentication → Users** e gerencie o e-mail normalizado em `private.study_beta_invites` pelo SQL Editor restrito. A linha precisa estar com `enabled = true` e a conta com e-mail confirmado. Não publique a lista nem credenciais. O formulário do app oferece somente entrada; sem SMTP, definição ou recuperação de senha deve ser tratada pelo operador no Dashboard seguro.
3. O cliente usa `dist/study-config.js` no projeto local, ou `study-config.js` na raiz publicada. Apenas URL do projeto e chave **publishable** (`sb_publishable_…`) pertencem ao cliente. Mantenha os quatro flags atuais do estado acima durante esta fase. Nunca coloque chave `service_role`, chave secreta ou chave Gemini no frontend.
4. A IA lê `ai_enabled` e `model` da linha única em `private.study_runtime_config`, por RPC autenticada e restrita a convidados. O estado atual é `true` e `gemini-3.5-flash-lite`; `GEMINI_MODEL` não é lida. Para pausar a IA, defina `ai_enabled = false`. O handler permite somente `gemini-3.5-flash-lite`, `gemini-3.6-flash` e `gemini-3.8-flash`; confira disponibilidade e modalidade gratuita antes de mudar o principal. O alternativo é 3.6 quando o principal é 3.5-lite, e 3.5-lite quando o principal é 3.6/3.8. Não há fallback pago.
5. Segredos são geridos em **Edge Functions → Secrets** no Dashboard, nunca em chat, README, commit ou GitHub Pages.

| Variável da função | Contrato atual |
| --- | --- |
| `GEMINI_API_KEY` | Nome canônico do segredo Gemini no servidor. O alias exato fornecido pelo usuário, `GEMINI_API-key`, já é aceito e foi verificado. Compatibilidade adicional: `GEMINI_API-KEY`, `gemini_api_key`, `GOOGLE_API_KEY` e `GEMINI_KEY`, nessa ordem após os dois primeiros. Nenhum valor é exposto aqui. |
| `STUDY_LAUNCH_READY` | Parada de emergência opcional: somente o valor literal `false` bloqueia a IA. Não é necessário definir `true`; convite, configuração privada habilitada, chave e consentimento continuam obrigatórios. |
| `ALLOWED_ORIGINS` | `https://hoshii23.github.io` — origem sem caminho nem barra final. |
| `SUPABASE_URL` | Injetada pelo ambiente Supabase. |
| `SUPABASE_ANON_KEY` | Injetada pelo ambiente; usada no servidor para chamadas autenticadas. O handler prioriza `SUPABASE_PUBLISHABLE_KEY` quando configurada. |
| `SUPABASE_SERVICE_ROLE_KEY` | Injetada pelo ambiente; acesso privilegiado restrito à exclusão no servidor. |

As funções encaminham o JWT do usuário nas chamadas normais ao banco. A chave publishable identifica o projeto; não substitui o JWT nem autoriza acessar notas alheias. Flags do cliente não substituem as restrições do banco e do handler.

## Antes do lançamento público

O teste privado já está habilitado. Os itens abaixo são requisitos para abertura pública e vigência dos documentos:

- [ ] Definir nome do controlador e canal de privacidade/suporte; preencher `controllerName` e `privacyEmail`, conforme a decisão adiada pelo usuário.
- [ ] Revisar juridicamente termos e privacidade conforme a operação real: papéis, bases legais, retenção de notas, backups e logs, atendimento a direitos e incidentes. Documentar prazos de fornecedores e mecanismos de transferência internacional exigidos pela LGPD/ANPD. São Paulo é a região do banco, sem garantia de processamento exclusivamente no Brasil.
- [ ] Conferir termos, suboperadores, cotas e custos de GitHub Pages, Supabase, SMTP, Google/Gemini e jsDelivr; manter envio somente de material educacional não pessoal por adultos no Brasil. Não habilitar cobrança ou fallback pago automaticamente.
- [ ] Conferir licenças do conteúdo e leitores, inclusive 3Dentes **CC BY-NC 4.0**, PDF.js e JSZip. Preserve `dist/assets/STUDY-DEPENDENCIES.md` no projeto local, `assets/STUDY-DEPENDENCIES.md` no pacote e `vendor/JSZIP-LICENSE.txt`.
- [ ] Configurar SMTP próprio e homologar confirmação/recuperação. Manter confirmação de e-mail obrigatória. Conferir **Site URL** e **Redirect URLs** para `https://hoshii23.github.io/odontoxiii/`, incluindo barra final; o cliente retorna a `location.origin + location.pathname`.
- [ ] Tratar o advisor de proteção contra senhas vazadas desabilitada conforme plano e controles disponíveis, sem assumir alteração paga já autorizada. [Documentação Supabase](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
- [ ] Completar a homologação abaixo e revisar a abertura pública. Revisar a restrição de convites por migração antes de qualquer abertura geral; alterar só o cliente não libera novas escritas no banco.
- [ ] Alinhar `legalVersion` do cliente, `VERSION` do handler e constraints/checagens do banco. Uma nova versão requer alteração revisada e novo aceite quando aplicável. Só declarar os documentos vigentes com `legalReady: true` após concluir a revisão e os dados obrigatórios; não basta mudar o texto ou o flag.

## Homologação ainda pendente

| Fluxo | Evidência que falta |
| --- | --- |
| Cadastro e e-mails | SMTP real, confirmação, redirects exatos, mensagens e limites de reenvio. |
| Recuperação | Links válidos/expirados, nova senha e retorno à conta, depois de habilitar SMTP e o fluxo público. |
| Dois navegadores | Sincronização por recarga, conflito sem perda de texto, exportação e cópia de notas locais sem apagar originais. Não há atualização em tempo real. |
| Banco | Nova execução integral de `verify-rls.sql`; o último PASS é v9, as tentativas v10 expiraram/foram canceladas e não houve execução integral v11. |
| Gemini e limites | Ampliar cenários de cotas e concorrência; respostas gerais e com fontes foram comprovadas por HTTP, e falhas/retries por testes locais. |
| PDF e DOCX no navegador | PDF com texto, digitalizado, com senha, limites, falha de CDN e Word real; revisão sem salvamento automático. |
| Notebook, iPad e acessibilidade | Layout, teclado, foco, toque, seletor de arquivos, download, sessão e avisos com tecnologia assistiva em navegador real. |

## Limites e retenção implementados

Até 500 notas por conta; título de 120 caracteres, assunto de 80 e texto de 100 mil. Importação de até 10 MB, PDF com até 100 páginas; DOCX tem verificações adicionais de ZIP, tamanho expandido, macros e XML. Sem OCR ou preservação de imagens, tabelas, fórmulas e layout.

Uma pergunta tem até 2 mil caracteres. No fluxo integrado, `noteIds` pode estar vazio: `useNotebook: false` faz uma pergunta geral ou usa somente o contexto autorizado. Com `useNotebook: true`, a busca filtra `user_id` pelo usuário autenticado e usa OR de palavras sanitizadas da pergunta nos campos título, assunto e corpo, limitando a cinco notas por atualização mais recente. Sem correspondência, usa as cinco notas mais recentes do mesmo dono. O fluxo legado aceita seleção explícita de uma a cinco notas por UUID, verificando disponibilidade e propriedade; essa seleção prevalece sobre a busca.

A seleção textual produz até oito trechos de 1.600 caracteres, com sobreposição de 200 e no máximo quatro por nota. `context` aceita no máximo uma fonte `page` e uma `draft`, cada uma com título de até 160 caracteres e corpo de até 6 mil. Há até dez fontes numeradas no total; trechos podem deixar partes das fontes fora do envio. O contexto da página inclui conteúdo visível, perguntas e alternativas, sem respostas ainda não reveladas. O rascunho e sua prévia acompanham operações do editor e mudanças de página; nada é enviado durante a digitação. Cada envio exige confirmação, desmarcada quando o contexto muda.

Seguem no máximo quatro mensagens anteriores válidas de até 2 mil caracteres. O cliente `chat` mantém a requisição em até 58 mil bytes UTF-8, removendo primeiro as mensagens mais antigas e depois reduzindo contexto se necessário, sem alterar o histórico exibido ou a pergunta. O servidor lê o corpo em streaming e rejeita mais de 60 mil bytes. O cliente legado `ask` conserva o orçamento de 18 mil bytes. Conversas ficam somente na memória da aba, não no backend: fechar o painel as preserva; recarregar, sair ou mudar de conta as limpa.

Para falhas de rede ou HTTP 404, 408, 500, 502, 503 e 504, o provedor recebe no máximo duas tentativas no principal e uma no alternativo gratuito. Há backoff de 700/1.400 ms com jitter de até 249 ms, prazo de 43 segundos para o conjunto de chamadas ao provedor e limite de 18 segundos por chamada. HTTP 429, 400, 401 e 403 encerram sem retry. Os limites abrangem a etapa Gemini; autenticação, banco e rede também afetam o tempo total da requisição. O cliente espera até 55 segundos pela Edge Function. Não há pesquisa externa nem alteração de notas pelo assistente.

São até 20 tentativas por conta e 200 globais por dia, contadas antes da chamada ao provedor; uma falha posterior pode consumir tentativa. Esses limites não substituem as cotas do Gemini. Contadores guardam usuário, dia e quantidade; linhas anteriores a sete dias são removidas na próxima execução do contador. Conversas não são persistidas pelo backend; logs e backups dos provedores ainda exigem política de retenção para o lançamento público.

## Evidência disponível

A integração HTTP real v11 passou em login, salvamento de nota, pergunta geral sem notas e envio conjunto de nota, rascunho e página. O Gemini identificou o fato exclusivo do rascunho lilás e o conceito da nota com citações, usando `gemini-3.5-flash-lite`; a pergunta geral também respondeu com esse modelo. A evidência sanitizada está em `.impeccable/review/v11-runtime-evidence.json` no projeto local. A limpeza confirmou zero usuários e convites sintéticos, sem tabelas/RPCs temporárias ou `pg_net`. O checker temporário está inerte, retorna HTTP 410, v10, com `verify_jwt: true`. `study-assistant` v11 e `study-account` v9 preservam verificação JWT habilitada.

A integração HTTP real v10 permanece evidência histórica de convites e negação a não convidados, criação/leitura/edição de notas, versão/conflito, isolamento entre donos, renovação de sessão e exclusão de conta. A execução completa de `verify-rls.sql` passou na v9 com dados sintéticos e rollback. As tentativas v10 expiraram no conector (`requestState expired`) ou foram canceladas: **não são PASS**. Não houve nova execução integral na v11. As integrações HTTP são evidência distinta e não comprovam todos os limites sob concorrência.

Os advisors registrados têm três INFO de tabelas privadas com RLS sem políticas e sem grants aos clientes, compatíveis com negação por padrão, e um WARN de proteção contra senhas vazadas desabilitada. Nenhuma configuração paga foi alterada.

Na v11 passaram os testes locais `study-assistant.mjs`, `study-account.cjs`, `assistant-ui.cjs`, `study-space.cjs`, `simulation-flows.cjs`, `clinical-mouth-2d.cjs`, `simulation-ui.cjs` e `study-flows.cjs`, além da rasterização de 34 estados SVG exatos em 700px e 350px via `render-mouth-2d.py`. HTTP/provedores simulados e harness DOM cobrem perguntas sem notas, fontes/busca do dono, limites UTF-8, falhas transitórias, alternativo gratuito e atualização de contexto. Os testes de importação v9 são históricos, com ZIP real via JSZip e XML DOM simulado; PDF.js e parsing em navegador não foram testados.

A primeira revisão independente v11 pediu correções da prévia de rascunho desatualizada e do contexto ausente em casos breves, questões e flashcards. Após as correções, a revisão focada emitiu **SHIP** com ambos resolvidos; esse veredito cobre as duas correções. A revisão inicial examinou código estático, markup, diagramas e evidência HTTP. `v11-markup/` contém somente HTML sintético, e `v11-new-case-diagrams.png` é uma folha de diagramas, não uma captura do app. Lançador/detector estavam ausentes após uma tentativa de cada; não havia ferramentas de controle de navegador JavaScript/cua. Layout em navegador, dois navegadores, iPad real, tecnologia assistiva, SMTP/recuperação e PDF.js real seguem sem homologação.

Referências: [Supabase Auth SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [redirects](https://supabase.com/docs/guides/auth/redirect-urls), [API keys](https://supabase.com/docs/guides/api/api-keys), [Edge Function secrets](https://supabase.com/docs/guides/functions/secrets), [termos do Gemini](https://ai.google.dev/gemini-api/terms) e [preços/cotas](https://ai.google.dev/gemini-api/docs/pricing).
