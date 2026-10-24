# Backend do Caderno e Xii — v12

O backend usa Supabase Auth, Postgres e Edge Functions para notas privadas, recuperação controlada de artigos via Europe PMC e perguntas ao Gemini. GitHub Pages serve a interface estática; publicar esta pasta não executa SQL nem funções. Esta pasta contém código e instruções, sem credenciais.

## Estado em 24/10/2026

- Projeto dedicado no plano gratuito em `enricodev`, região São Paulo, referência `wmbkfxpnwzdtljmfqorn`, status `ACTIVE_HEALTHY`.
- `schema.sql` foi aplicado ao projeto inicialmente vazio na v9. `closed-beta.sql` é a extensão incremental da v10 e já foi aplicada: convites privados por e-mail verificado e configuração privada da IA.
- `ai-account-consent.sql` já foi aplicado ao banco existente: Brasil começa `false`, consentimento de IA começa nulo e só aceita a versão `2026-10-24`. Trigger atribui o horário no servidor; grants por coluna impedem o cliente de escrever o horário. Contas existentes não receberam consentimento implícito.
- A primeira transição alterou temporariamente o helper de quota; a migração posterior `preserve_existing_quota_during_consent_transition` restaurou o helper anterior para preservar a compatibilidade v11 durante a preparação. O SQL final desta pasta altera somente campos, trigger e grants do perfil; a autorização nova é conferida no handler.
- `study-assistant` principal v12 está implantada com a nova dependência `shared/literature.mjs`; `study-account` v9 não mudou. Ambas mantêm `verify_jwt: true`. A implantação principal foi confirmada pelo serviço após o ensaio em checker temporário. **Em novas liberações, implante o handler e suas dependências antes do cliente**, que não envia o payload antigo de consentimento. O teste HTTP registrado foi do handler no checker, sem nova alegação de teste funcional no URL principal.
- URL e chave publishable estão preenchidas no cliente; `accountsEnabled: true`, `aiEnabled: true`, `accessMode: 'closed_beta'` e `legalReady: false`. Login, notas e IA funcionam para convidados; cadastro público e recuperação por e-mail estão ocultos na interface.
- O dono criou sua conta com senha pelo Supabase Dashboard. SMTP não está configurado. Não há senha, e-mail de convidado ou segredo de provedor nesta documentação.
- A IA está habilitada na configuração privada com `gemini-3.5-flash-lite`, usado nos ensaios HTTP reais v11/v12. Há novas tentativas limitadas e alternativo gratuito `gemini-3.6-flash`. A modalidade gratuita foi conferida na [tabela oficial de preços](https://ai.google.dev/gemini-api/docs/pricing); nenhuma cobrança paga foi ativada.
- Privacidade e termos continuam como minutas não vigentes, versão `2026-10-23`. Nome do controlador e contato foram explicitamente adiados pelo usuário até o lançamento público; essa pendência não bloqueia o teste fechado autorizado.

## Arquivos e contratos

| Arquivo | Função |
| --- | --- |
| `schema.sql` | Bootstrap v9 de um projeto novo: perfil de aceite, notas, RLS, sessão ativa, versão, limites e contador de IA. |
| `closed-beta.sql` | Extensão incremental para o banco v9: lista privada de convidados, bloqueio de novas escritas/IA sem convite e configuração privada de modelo/ativação. |
| `ai-account-consent.sql` | Extensão incremental v12 já aplicada: Brasil, versão opcional de consentimento de IA, horário do servidor e grants por coluna. Não altera o helper de quota. |
| `verify-rls.sql` | Verificação transacional com usuários sintéticos e rollback: PASS v9; tentativas v10 expiradas/canceladas, sem nova execução integral v11/v12. |
| `functions/shared/handler.mjs` | Autenticação, autorização armazenada antes de notas/artigos/provedor, limites, contexto, Gemini com retries e exclusão. |
| `functions/shared/literature.mjs` | Vocabulário controlado, busca Europe PMC, filtros, metadados/abstracts e cache de temas públicos. Dependência nova da função v12. |
| `functions/study-assistant/index.ts` | Entrada Deno da função de perguntas. |
| `functions/study-account/index.ts` | Entrada Deno da função de exclusão de conta. |

Os três scripts de configuração já foram aplicados e contêm operações não repetíveis; não os reaplique no projeto atual. `schema.sql` é bootstrap, não migração incremental. Não foi produzido histórico de migrações via CLI. Para outro banco, inspecione estado e histórico antes de preparar a migração; use o fluxo oficial da versão instalada do Supabase CLI, consultando `--help`, e preserve objetos e dados não relacionados.

Notas e perfis exigem proprietário autenticado com sessão ativa em `auth.sessions`; clientes não podem trocar o dono. Novos perfis, criações e edições de notas e uso da IA exigem convite habilitado em `private.study_beta_invites` para o e-mail confirmado do usuário. A lista é gerida somente por operador confiável e não é acessível aos clientes. Revogar um convite interrompe novas escritas e IA, mas preserva leitura, exportação e exclusão dos dados próprios e exclusão da conta.

Salvar uma edição filtra `id` e `version`; uma versão antiga mantém o texto no editor e pede recarga da lista. O contador de IA é atômico, deriva o dono da sessão, exige convite e aceite da versão registrada no perfil e fica no schema privado, com wrapper público `SECURITY INVOKER`. Esse aceite experimental não torna as minutas vigentes. Não há bucket ou upload dos arquivos originais.

A função v12 autentica usuário e sessão, confirma e-mail, convite, condições da conta, maioridade, Brasil e consentimento de IA `2026-10-24` com horário. Faz essa conferência antes de buscar notas, artigos ou chamar o provedor; consentimento no corpo antigo não autoriza o envio. Sem autorização armazenada, responde HTTP 403 com `ai_consent_required`. A ativação é opcional em Minha conta e pode ser revogada; o caderno continua disponível. A revogação não retira material já enviado ao provedor.

A função pode responder sem notas; quando a busca no caderno está ligada, consulta somente notas do dono autenticado. O assistente não modifica notas nem navega livremente na web. A função de conta confirma a senha atual, encerra sessões globalmente e exclui o usuário; as chaves estrangeiras removem perfil, notas e contadores ativos. Isso não promete eliminação imediata de backups ou registros mantidos por fornecedores.

## Operar o teste fechado

1. Confirme o projeto no Dashboard. Preserve `verify_jwt: true` nas duas funções e confira políticas, grants e advisors após alterações.
2. Para autorizar alguém, confirme por canal confiável que a pessoa controla o e-mail, prepare sua conta com senha em **Authentication → Users** e gerencie o e-mail normalizado em `private.study_beta_invites` pelo SQL Editor restrito. A linha precisa estar com `enabled = true` e a conta com e-mail confirmado. Não publique a lista nem credenciais. O formulário do app oferece somente entrada; sem SMTP, definição ou recuperação de senha deve ser tratada pelo operador no Dashboard seguro.
3. O cliente usa `dist/study-config.js` no projeto local, ou `study-config.js` na raiz publicada. Apenas URL do projeto e chave **publishable** (`sb_publishable_…`) pertencem ao cliente. Mantenha os quatro flags atuais do estado acima durante esta fase. Nunca coloque chave `service_role`, chave secreta ou chave Gemini no frontend.
4. A IA lê `ai_enabled` e `model` da linha única em `private.study_runtime_config`, por RPC autenticada e restrita a convidados. O estado atual é `true` e `gemini-3.5-flash-lite`; `GEMINI_MODEL` não é lida. Para pausar a IA, defina `ai_enabled = false`. O handler permite somente `gemini-3.5-flash-lite`, `gemini-3.6-flash` e `gemini-3.8-flash`; confira disponibilidade e modalidade gratuita antes de mudar o principal. O alternativo é 3.6 quando o principal é 3.5-lite, e 3.5-lite quando o principal é 3.6/3.8. Não há fallback pago.
5. Segredos são geridos em **Edge Functions → Secrets** no Dashboard, nunca em chat, README, commit ou GitHub Pages.
6. Na liberação v12, implante primeiro `functions/study-assistant/index.ts`, `functions/shared/handler.mjs` e **`functions/shared/literature.mjs`**, preservando `verify_jwt: true`; só depois publique o cliente. A migração de consentimento já está aplicada e `study-account` v9 permanece igual. O pacote GitHub Pages v12 tem 43 arquivos; publicar fontes não comprova deploy da função.

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
- [ ] Conferir termos, suboperadores, cotas e custos de GitHub Pages, Supabase, SMTP, Google/Gemini, Europe PMC e jsDelivr; manter envio somente de material educacional não pessoal por adultos no Brasil. Não habilitar cobrança ou fallback pago automaticamente.
- [ ] Conferir licenças do conteúdo e leitores, inclusive 3Dentes **CC BY-NC 4.0**, PDF.js e JSZip. Preserve `dist/assets/STUDY-DEPENDENCIES.md` no projeto local, `assets/STUDY-DEPENDENCIES.md` no pacote e `vendor/JSZIP-LICENSE.txt`.
- [ ] Configurar SMTP próprio e homologar confirmação/recuperação. Manter confirmação de e-mail obrigatória. Conferir **Site URL** e **Redirect URLs** para `https://hoshii23.github.io/odontoxiii/`, incluindo barra final; o cliente retorna a `location.origin + location.pathname`.
- [ ] Tratar o advisor de proteção contra senhas vazadas desabilitada conforme plano e controles disponíveis, sem assumir alteração paga já autorizada. [Documentação Supabase](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
- [ ] Completar a homologação abaixo e revisar a abertura pública. Revisar a restrição de convites por migração antes de qualquer abertura geral; alterar só o cliente não libera novas escritas no banco.
- [ ] Preservar o alinhamento separado: `legalVersion`/`VERSION` e aceite experimental continuam `2026-10-23`; `aiConsentVersion`/`AI_VERSION` e constraint de consentimento de IA são `2026-10-24`. Uma mudança requer alteração revisada e novo aceite quando aplicável. Só declarar os documentos vigentes com `legalReady: true` após concluir a revisão e os dados obrigatórios; não basta mudar o texto ou o flag.

## Homologação ainda pendente

| Fluxo | Evidência que falta |
| --- | --- |
| Cadastro e e-mails | SMTP real, confirmação, redirects exatos, mensagens e limites de reenvio. |
| Recuperação | Links válidos/expirados, nova senha e retorno à conta, depois de habilitar SMTP e o fluxo público. |
| Dois navegadores | Sincronização por recarga, conflito sem perda de texto, exportação e cópia de notas locais sem apagar originais. Não há atualização em tempo real. |
| Banco | Nova execução integral de `verify-rls.sql`; o último PASS é v9, as tentativas v10 expiraram/foram canceladas e não houve execução integral v11/v12. |
| IA, artigos e limites | Deploy principal v12 e verificação após publicação; ampliar cotas/concorrência e relevância científica. O ensaio HTTP v12 foi no checker temporário; filtros e cautelas foram refinados depois. |
| PDF e DOCX no navegador | PDF com texto, digitalizado, com senha, limites, falha de CDN e Word real; revisão sem salvamento automático. |
| Notebook, iPad e acessibilidade | Layout, teclado, foco, toque, seletor de arquivos, download, sessão e avisos com tecnologia assistiva em navegador real. |

## Limites e retenção implementados

Até 500 notas por conta; título de 120 caracteres, assunto de 80 e texto de 100 mil. Importação de até 10 MB, PDF com até 100 páginas; DOCX tem verificações adicionais de ZIP, tamanho expandido, macros e XML. Sem OCR ou preservação de imagens, tabelas, fórmulas e layout.

Uma pergunta tem até 2 mil caracteres. No fluxo integrado, `noteIds` pode estar vazio: `useNotebook: false` faz uma pergunta geral ou usa somente o contexto autorizado. Com `useNotebook: true`, a busca filtra `user_id` pelo usuário autenticado e usa OR de palavras sanitizadas da pergunta nos campos título, assunto e corpo, limitando a cinco notas por atualização mais recente. Sem correspondência, usa as cinco notas mais recentes do mesmo dono. O fluxo legado aceita seleção explícita de uma a cinco notas por UUID, verificando disponibilidade e propriedade; essa seleção prevalece sobre a busca.

A seleção textual produz até oito trechos de 1.600 caracteres, com sobreposição de 200 e no máximo quatro por nota. `context` aceita no máximo uma fonte `page` e uma `draft`, cada uma com título de até 160 caracteres e corpo de até 6 mil. Há até dez fontes numeradas de notas/contexto no total; trechos podem deixar partes das fontes fora do envio. O contexto inclui conteúdo visível, perguntas e alternativas, sem respostas ainda não reveladas. O rascunho e sua prévia acompanham operações do editor e mudanças de página; nada é enviado durante a digitação. A autorização é conferida na conta, sem checkbox por pergunta.

Seguem no máximo quatro mensagens anteriores válidas de até 2 mil caracteres. O cliente `chat` mantém a requisição em até 58 mil bytes UTF-8, removendo primeiro as mensagens mais antigas e depois reduzindo contexto se necessário, sem alterar o histórico exibido ou a pergunta. O servidor lê o corpo em streaming e rejeita mais de 60 mil bytes. O cliente legado `ask` conserva o orçamento de 18 mil bytes. Conversas ficam somente na memória da aba, não no backend: fechar o painel as preserva; recarregar, sair ou mudar de conta as limpa.

Para falhas de rede ou HTTP 404, 408, 500, 502, 503 e 504, o provedor recebe no máximo duas tentativas no principal e uma no alternativo gratuito. Há backoff de 700/1.400 ms com jitter de até 249 ms, prazo de 43 segundos para o conjunto de chamadas ao provedor e limite de 18 segundos por chamada. HTTP 429, 400, 401 e 403 encerram sem retry. Esses limites abrangem a etapa Gemini; autenticação, banco, busca científica e rede também afetam o tempo total. O cliente espera até 70 segundos pela Edge Function.

São até 20 tentativas por conta e 200 globais por dia, contadas antes da chamada ao provedor; uma falha posterior pode consumir tentativa. Esses limites não substituem as cotas do Gemini. Contadores guardam usuário, dia e quantidade; linhas anteriores a sete dias são removidas na próxima execução do contador. Conversas não são persistidas pelo backend; logs e backups dos provedores ainda exigem política de retenção para o lançamento público.

## Fontes científicas

`literature.mjs` reconhece no máximo dois assuntos por vocabulário controlado em inglês. O serviço Europe PMC recebe somente esses termos; pergunta bruta, notas, histórico e dados da conta nunca são enviados a ele. A seleção pode usar o contexto local quando a pergunta não reconhece um assunto. Assuntos fora do vocabulário retornam `not_needed`, sem chamada externa. Não há scraping sistemático de sites.

A consulta exige `SRC:MED` (registros de origem PubMed), PMID numérico e abstract, prioriza revisões, revisões sistemáticas, meta-análises e diretrizes e depois admite outros artigos. Filtra retratações, preprints, editoriais, comentários, cartas e erratas conforme os campos indexados disponíveis; não garante detectar todas as retratações. O prazo total é 6,5 segundos, com até 4,5 segundos por busca e até três referências. O cache em memória usa somente temas públicos, guarda até 40 entradas e dura seis horas para resultados e dez minutos para ausência; falhas não são armazenadas.

O servidor usa metadados e até 3.600 caracteres de cada resumo na resposta; não lê o artigo completo. O prompt distingue notas/contexto `[1]` e artigos `[E1]`, proíbe inventar referências e pede cautela para hipóteses, animais e in vitro. A API retorna `references` com metadados e `referencesStatus` (`available`, `none`, `unavailable` ou `not_needed`), sem abstracts. Os links são construídos de PMID recuperado como `https://pubmed.ncbi.nlm.nih.gov/<PMID>/`; `dist/study-sources.js` aceita somente caminhos canônicos NIH permitidos e escapa metadados. URLs escritas pelo modelo não viram links. Registros citados aparecem como **Fontes científicas**; sem citação específica, **Artigos para conferir**. Ausência/indisponibilidade é explícita.

Indexação PubMed não é selo de qualidade, endosso nem garantia de pertinência ou verdade clínica. Artigos e abstracts mantêm os direitos de autores/editoras; confira o texto completo e sua licença na fonte. Documentação oficial: [REST](https://europepmc.org/RestfulWebService), [referência de campos e consultas](https://dev.europepmc.org/docs/EBI_Europe_PMC_Web_Service_Reference.pdf) e [copyright](https://dev.europepmc.org/Copyright).

## Evidência disponível

O handler v12 executou dentro de checker Edge temporário protegido por nonce, com Auth, PostgREST, Europe PMC e Gemini reais. `.impeccable/review/v12-runtime-evidence.json` registra bloqueio antes do consentimento sem chamar o serviço científico ou Gemini, Brasil obrigatório, horário atribuído pelo servidor, escrita de horário negada por HTTP 403, busca científica HTTP 200, resposta real com `[E2]`, revogação negando IA sem chamada ao provedor e nota salva após revogação. Título e link PubMed citados foram abertos e confirmados independentemente. O ensaio precede refinamentos dos filtros de tipo de publicação e das cautelas do prompt; os testes locais atuais passaram. Isso não é verificação da função principal v12, ainda pendente de deploy.

O checker está inerte, HTTP 410, v12, `verify_jwt: true`. A limpeza confirmou zero usuários e convites sintéticos e ausência de tabelas/RPCs temporárias e `pg_net`. A v11 permanece evidência histórica de login, salvamento, perguntas gerais e contexto conjunto de nota/rascunho/página com `gemini-3.5-flash-lite`, em `.impeccable/review/v11-runtime-evidence.json`.

A integração HTTP real v10 permanece evidência histórica de convites e negação a não convidados, criação/leitura/edição de notas, versão/conflito, isolamento entre donos, renovação de sessão e exclusão de conta. A execução completa de `verify-rls.sql` passou na v9 com dados sintéticos e rollback. As tentativas v10 expiraram no conector (`requestState expired`) ou foram canceladas: **não são PASS**. Não houve nova execução integral na v11/v12. As integrações HTTP são evidência distinta e não comprovam todos os limites sob concorrência.

Os advisors registrados têm três INFO de tabelas privadas com RLS sem políticas e sem grants aos clientes, compatíveis com negação por padrão, e um WARN de proteção contra senhas vazadas desabilitada. Nenhuma configuração paga foi alterada.

Na v12 passaram `study-literature.mjs`, `study-sources.cjs`, `study-assistant.mjs`, `study-account.cjs`, `assistant-ui.cjs`, `study-space.cjs`, `study-flows.cjs` e `simulation-ui.cjs`. HTTP/provedores simulados e harness DOM cobrem consentimento armazenado/revogação, consultas controladas, filtros, links canônicos escapados, fontes citadas versus sugestões, ausência/indisponibilidade, busca do dono, limites/retries e Atlas sem visualizador. Testes dos nove casos e rasterização de 34 SVGs em 700px/350px são evidência histórica v11; importação v9 usou ZIP real via JSZip e XML DOM simulado.

A revisão independente v12 repetiu seis suítes e emitiu **SHIP**, sem bloqueadores materiais no escopo estático, sintético, unitário e de HTTP registrado. `v12-markup/` contém somente HTML sintético. O detector não executou por ausência do lançador, sem captura substituta. Layout em navegador real, dois navegadores, iPad, tecnologia assistiva, SMTP/recuperação e PDF.js real seguem sem homologação. O SHIP não amplia esse escopo nem comprova deploy principal ou publicação.

Referências: [Supabase Auth SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [redirects](https://supabase.com/docs/guides/auth/redirect-urls), [API keys](https://supabase.com/docs/guides/api/api-keys), [Edge Function secrets](https://supabase.com/docs/guides/functions/secrets), [termos do Gemini](https://ai.google.dev/gemini-api/terms) e [preços/cotas](https://ai.google.dev/gemini-api/docs/pricing).
