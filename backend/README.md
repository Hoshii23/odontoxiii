# Backend do Caderno e IA — v10

O backend usa Supabase Auth, Postgres e Edge Functions para notas privadas e perguntas ao Gemini. GitHub Pages serve a interface estática; publicar esta pasta não executa SQL nem funções. Esta pasta contém código e instruções, sem credenciais.

## Estado em 23/10/2026

- Projeto dedicado no plano gratuito em `enricodev`, região São Paulo, referência `wmbkfxpnwzdtljmfqorn`, status `ACTIVE_HEALTHY`.
- `schema.sql` foi aplicado ao projeto inicialmente vazio na v9. `closed-beta.sql` é a extensão incremental da v10 e já foi aplicada: convites privados por e-mail verificado e configuração privada da IA.
- `study-assistant` v9 e `study-account` v9 estão ACTIVE com `verify_jwt: true`.
- URL e chave publishable estão preenchidas no cliente; `accountsEnabled: true`, `aiEnabled: true`, `accessMode: 'closed_beta'` e `legalReady: false`. Login, notas e IA funcionam para convidados; cadastro público e recuperação por e-mail estão ocultos na interface.
- O dono criou sua conta com senha pelo Supabase Dashboard. SMTP não está configurado. Não há senha, e-mail de convidado ou segredo de provedor nesta documentação.
- A IA está habilitada na configuração privada com `gemini-3.6-flash`. A modalidade gratuita foi conferida na [tabela oficial de preços](https://ai.google.dev/gemini-api/docs/pricing) em 23/10/2026. `gemini-3.8-flash` retornou 503 por alta demanda; não há fallback automático nem cobrança paga ativada.
- Privacidade e termos continuam como minutas não vigentes, versão `2026-10-23`. Nome do controlador e contato foram explicitamente adiados pelo usuário até o lançamento público; essa pendência não bloqueia o teste fechado autorizado.

## Arquivos e contratos

| Arquivo | Função |
| --- | --- |
| `schema.sql` | Bootstrap v9 de um projeto novo: perfil de aceite, notas, RLS, sessão ativa, versão, limites e contador de IA. |
| `closed-beta.sql` | Extensão incremental para o banco v9: lista privada de convidados, bloqueio de novas escritas/IA sem convite e configuração privada de modelo/ativação. |
| `verify-rls.sql` | Verificação transacional com usuários sintéticos e rollback; a nova execução v10 não foi concluída. |
| `functions/shared/handler.mjs` | Handler compartilhado de autenticação, limites, busca de trechos, Gemini e exclusão. |
| `functions/study-assistant/index.ts` | Entrada Deno da função de perguntas. |
| `functions/study-account/index.ts` | Entrada Deno da função de exclusão de conta. |

`schema.sql` não é uma migração incremental ou um script idempotente. `closed-beta.sql` também contém criações e alterações não repetíveis: ambos já foram aplicados ao projeto atual e não devem ser reaplicados. Não foi produzido histórico de migrações via CLI. Para outro banco, inspecione o estado e histórico antes de preparar a migração; use o fluxo oficial da versão instalada do Supabase CLI, consultando `--help`, e preserve objetos e dados não relacionados.

Notas e perfis exigem proprietário autenticado com sessão ativa em `auth.sessions`; clientes não podem trocar o dono. Novos perfis, criações e edições de notas e uso da IA exigem convite habilitado em `private.study_beta_invites` para o e-mail confirmado do usuário. A lista é gerida somente por operador confiável e não é acessível aos clientes. Revogar um convite interrompe novas escritas e IA, mas preserva leitura, exportação e exclusão dos dados próprios e exclusão da conta.

Salvar uma edição filtra `id` e `version`; uma versão antiga mantém o texto no editor e pede recarga da lista. O contador de IA é atômico, deriva o dono da sessão, exige convite e aceite da versão registrada no perfil e fica no schema privado, com wrapper público `SECURITY INVOKER`. Esse aceite experimental não torna as minutas vigentes. Não há bucket ou upload dos arquivos originais.

A função de perguntas autentica usuário e sessão, confirma e-mail e convite, valida consentimento, consulta somente suas notas e envia trechos ao Gemini. A função de conta confirma a senha atual, encerra sessões globalmente e exclui o usuário; as chaves estrangeiras removem perfil, notas e contadores ativos. Isso não promete eliminação imediata de backups ou registros mantidos por fornecedores.

## Operar o teste fechado

1. Confirme o projeto no Dashboard. Preserve `verify_jwt: true` nas duas funções e confira políticas, grants e advisors após alterações.
2. Para autorizar alguém, confirme por canal confiável que a pessoa controla o e-mail, prepare sua conta com senha em **Authentication → Users** e gerencie o e-mail normalizado em `private.study_beta_invites` pelo SQL Editor restrito. A linha precisa estar com `enabled = true` e a conta com e-mail confirmado. Não publique a lista nem credenciais. O formulário do app oferece somente entrada; sem SMTP, definição ou recuperação de senha deve ser tratada pelo operador no Dashboard seguro.
3. O cliente usa `dist/study-config.js` no projeto local, ou `study-config.js` na raiz publicada. Apenas URL do projeto e chave **publishable** (`sb_publishable_…`) pertencem ao cliente. Mantenha os quatro flags atuais do estado acima durante esta fase. Nunca coloque chave `service_role`, chave secreta ou chave Gemini no frontend.
4. A IA lê `ai_enabled` e `model` da linha única em `private.study_runtime_config`, por RPC autenticada e restrita a convidados. O estado atual é `true` e `gemini-3.6-flash`; `GEMINI_MODEL` não é mais lida. Para pausar a IA, defina `ai_enabled = false`; para trocar modelo, confira antes disponibilidade e modalidade gratuita. Não existe fallback automático.
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
| Banco | Concluir a execução integral v10 de `verify-rls.sql`; as tentativas desta etapa expiraram/foram canceladas. |
| Gemini e limites | Ampliar cenários de cotas, concorrência, falhas e lacunas; uma resposta real já foi comprovada por HTTP. |
| PDF e DOCX no navegador | PDF com texto, digitalizado, com senha, limites, falha de CDN e Word real; revisão sem salvamento automático. |
| Notebook, iPad e acessibilidade | Layout, teclado, foco, toque, seletor de arquivos, download, sessão e avisos com tecnologia assistiva em navegador real. |

## Limites e retenção implementados

Até 500 notas por conta; título de 120 caracteres, assunto de 80 e texto de 100 mil. Importação de até 10 MB, PDF com até 100 páginas; DOCX tem verificações adicionais de ZIP, tamanho expandido, macros e XML. Sem OCR ou preservação de imagens, tabelas, fórmulas e layout.

Uma pergunta tem até 2 mil caracteres e uma a cinco notas. A seleção textual classifica trechos de 1.600 caracteres, com sobreposição de 200, até oito trechos e no máximo quatro de uma nota; pode deixar partes das fontes fora do envio. Seguem também no máximo as quatro mensagens anteriores válidas, com até 2 mil caracteres cada. O cliente remove as mais antigas do envio quando necessário para manter a requisição em até 18 mil bytes UTF-8; pergunta e histórico da interface são preservados. Não há pesquisa na internet ou acesso automático ao restante do caderno.

São até 20 tentativas por conta e 200 globais por dia, contadas antes da chamada ao provedor; uma falha posterior pode consumir tentativa. Esses limites não substituem as cotas do Gemini. Contadores guardam usuário, dia e quantidade; linhas anteriores a sete dias são removidas na próxima execução do contador. Conversas não são persistidas pelo backend; logs e backups dos provedores ainda exigem política de retenção para o lançamento público.

## Evidência disponível

A integração HTTP real v10, com contas descartáveis, passou em login por senha, convite e negação a não convidados, criação, leitura e edição de notas, versão e conflito, isolamento entre donos, renovação de sessão, resposta efetiva do Gemini com citação `[1]` e exclusão de conta. A evidência sanitizada está em `.impeccable/review/v10-runtime-evidence.json` no projeto local. Ao final foram confirmados zero usuários e convites sintéticos; tabelas/RPCs temporárias e `pg_net` foram removidos. O checker temporário foi substituído por resposta inerte HTTP 410, v8, com `verify_jwt: true`.

A execução completa de `verify-rls.sql` passou na v9 com dados sintéticos e rollback. As tentativas v10 expiraram no conector (`requestState expired`) ou foram canceladas: **não são PASS**. A integração HTTP v10 é evidência distinta e não comprova todos os limites sob concorrência.

Os advisors atuais registram três INFO de tabelas privadas com RLS sem políticas e sem grants aos clientes, compatíveis com negação por padrão, e um WARN de proteção contra senhas vazadas desabilitada. Nenhuma configuração paga foi alterada.

Na v10 passaram os testes locais `study-assistant.mjs`, `study-account.cjs` e `study-space.cjs`: HTTP/provedores simulados nos dois primeiros e harness DOM no controlador. Há regressão de histórico longo e UTF-8 para o limite de 18 mil bytes, mantendo pergunta e histórico da interface. Os resultados v9 de `study-import.cjs`, `study-flows.cjs` e `simulation-flows.cjs` continuam como evidência histórica; importação usa ZIP real com JSZip e DOM XML simulado. PDF.js e parsing em navegador não foram testados.

A revisão independente final v10 emitiu **SHIP** no escopo de código estático, markup e evidência HTTP, após corrigir o envio de histórico longo; não avaliou acabamento visual em navegador. `.impeccable/review/v10-markup/` contém somente HTML de conta e caderno; não houve screenshots ou novos rasters. A revisão v9 deu SHIP para markup/CSS estático, controladores, semântica dos dados e prévia inativa; esse resultado não cobre a ativação v10. Não há homologação de navegador, iPad real, tecnologia assistiva ou entrega de e-mail nesta etapa.

Referências: [Supabase Auth SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [redirects](https://supabase.com/docs/guides/auth/redirect-urls), [API keys](https://supabase.com/docs/guides/api/api-keys), [Edge Function secrets](https://supabase.com/docs/guides/functions/secrets), [termos do Gemini](https://ai.google.dev/gemini-api/terms) e [preços/cotas](https://ai.google.dev/gemini-api/docs/pricing).
