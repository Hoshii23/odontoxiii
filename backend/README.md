# Backend do Caderno e IA — v9

O backend usa Supabase Auth, Postgres e Edge Functions para notas privadas e perguntas ao Gemini. GitHub Pages serve somente a interface estática; publicar esta pasta não executa SQL nem funções. Esta pasta contém código e instruções, sem credenciais.

## Estado em 23/10/2026

- Projeto dedicado aprovado no plano gratuito em `enricodev`, região São Paulo, referência `wmbkfxpnwzdtljmfqorn`, status `ACTIVE_HEALTHY`.
- `schema.sql` aplicado ao projeto inicialmente vazio; depois foi ajustado o contador privilegiado no schema privado, com wrapper público `SECURITY INVOKER`. O arquivo atual reúne esse bootstrap.
- `study-assistant` v1 e `study-account` v1 implantadas e ACTIVE, ambas com `verify_jwt: true`.
- `verify-rls.sql` passou no banco real com dados sintéticos e rollback. Advisors finais sem WARN/ERROR; o INFO da tabela privada de cotas com RLS sem políticas é esperado, pois clientes não têm privilégios sobre ela.
- Configuração pública ainda sem URL/chave, com `accountsEnabled: false`, `aiEnabled: false` e `legalReady: false`. Nenhuma chave Gemini, SMTP ou redirect de lançamento foi configurado. Contas e IA não estão abertas ao público.
- Privacidade e termos são minutas não vigentes, versão `2026-10-23`. O usuário adiou nome do controlador e contato até o lançamento.

## Arquivos e contratos

| Arquivo | Função |
| --- | --- |
| `schema.sql` | Bootstrap de um projeto novo: perfil de aceite, notas, RLS, sessão ativa, versão, limites e contador de IA. |
| `verify-rls.sql` | Verificação transacional com usuários sintéticos; encerra com rollback. Não usa notas de pessoas reais. |
| `functions/shared/handler.mjs` | Handler compartilhado de autenticação, limites, busca de trechos, Gemini e exclusão. |
| `functions/study-assistant/index.ts` | Entrada Deno da função de perguntas. |
| `functions/study-account/index.ts` | Entrada Deno da função de exclusão de conta. |

`schema.sql` não é uma migração incremental ou um script idempotente: contém `CREATE TABLE` e `CREATE FUNCTION`. Não o reaplique ao projeto atual ou a um banco existente. Não foi produzido histórico de migrações via CLI; a CLI não estava disponível nesta etapa. Antes de alterar o esquema existente, inspecione seu estado e histórico e gere uma migração pelo fluxo oficial da versão instalada do Supabase CLI, consultando `--help`; não invente nome ou timestamp de migração. Preserve dados e objetos não relacionados.

Notas e perfis são acessíveis somente ao dono autenticado com sessão ativa em `auth.sessions`; clientes não podem trocar o proprietário. Salvar uma edição filtra `id` e `version`; uma versão antiga mantém o texto no editor e pede recarga da lista. O contador de IA é atômico, deriva o dono da sessão, exige aceite vigente e fica no schema privado, com acesso pelo wrapper público autorizado. Não há bucket ou upload dos arquivos originais.

A função de perguntas autentica o usuário e sua sessão, confirma e-mail, valida consentimento, consulta apenas suas notas e só então envia trechos ao Gemini. A função de conta confirma a senha atual, encerra sessões globalmente e exclui o usuário; as chaves estrangeiras removem perfil, notas e contadores ativos. Isso não promete eliminação imediata de backups ou registros mantidos por fornecedores.

## Configuração para homologação

Mantenha a configuração publicada inativa durante a preparação. Use um ambiente controlado e contas sintéticas para os testes reais abaixo.

1. No Supabase Dashboard, confirme o projeto correto e a saúde do banco. Preserve `verify_jwt: true` nas duas funções e verifique políticas, grants e advisors após qualquer alteração.
2. Em Auth, configure SMTP próprio, remetente e entrega dos e-mails de confirmação e recuperação. Mantenha a confirmação de e-mail habilitada. Confira os limites e custos do serviço SMTP escolhido.
3. Defina **Site URL** como `https://hoshii23.github.io/odontoxiii/` e inclua exatamente essa URL na lista de **Redirect URLs**. O cliente retorna a `location.origin + location.pathname`; confira a barra final. Use redirects adicionais apenas quando necessários ao ambiente de homologação.
4. A configuração do cliente fica em `dist/study-config.js` no projeto local, ou `study-config.js` na raiz do pacote publicado. Somente a URL do projeto e uma chave atual **publishable** (`sb_publishable_…`) podem ser públicas. Nunca coloque chave `service_role`, chave secreta ou chave Gemini nesse arquivo.
5. No **Supabase Dashboard → Edge Functions → Secrets**, configure os valores abaixo. Segredos devem ser inseridos diretamente nesse painel: nunca em chat, JavaScript do cliente, README, commit ou GitHub Pages.

| Variável da função | Configuração |
| --- | --- |
| `GEMINI_API_KEY` | Segredo do projeto Gemini escolhido, somente no servidor. Ainda não configurado. |
| `GEMINI_MODEL` | O código usa `gemini-3.8-flash` como padrão. Confirme disponibilidade, modalidade gratuita e termos atuais para a conta antes de definir ou usar o modelo. |
| `STUDY_LAUNCH_READY` | Mantenha `false` até concluir as condições de lançamento. A função só envia ao Gemini quando o valor é exatamente `true` e há chave. |
| `ALLOWED_ORIGINS` | `https://hoshii23.github.io` — origem sem caminho nem barra final. |
| `SUPABASE_URL` | Injetada pelo ambiente Supabase. |
| `SUPABASE_ANON_KEY` | Injetada pelo ambiente Supabase; usada no servidor para chamadas autenticadas. O handler também aceita `SUPABASE_PUBLISHABLE_KEY` se configurada. |
| `SUPABASE_SERVICE_ROLE_KEY` | Injetada pelo ambiente Supabase; acesso privilegiado restrito à exclusão no servidor. |

As funções encaminham o JWT do usuário nas chamadas normais ao banco. A chave publishable identifica o projeto; não substitui o JWT nem autoriza acessar notas alheias. A presença dos secrets não ativa os flags públicos automaticamente.

## Condições antes de abrir contas ou IA

- [ ] Definir nome do controlador e canal de privacidade/suporte, decisão explicitamente adiada pelo usuário. Preencher `controllerName` e `privacyEmail` antes de tornar as minutas vigentes.
- [ ] Revisar juridicamente termos e privacidade conforme a operação real: papéis, bases legais, retenção e exclusão de notas, backups, logs, atendimento a direitos e incidentes. Documentar os prazos dos fornecedores e mecanismos de transferência internacional exigidos pela LGPD/ANPD. São Paulo é a região do banco, sem garantia de processamento exclusivamente no Brasil.
- [ ] Conferir os termos e suboperadores de GitHub Pages, Supabase, SMTP, Google/Gemini e jsDelivr. Conferir licenças do conteúdo e leitores, inclusive 3Dentes **CC BY-NC 4.0** e sua restrição comercial, PDF.js e JSZip. O inventário dos leitores está em `dist/assets/STUDY-DEPENDENCIES.md` no projeto local e `assets/STUDY-DEPENDENCIES.md` no pacote publicado; preserve `vendor/JSZIP-LICENSE.txt`.
- [ ] Confirmar público inicial de maiores de 18 anos no Brasil e material educacional não pessoal. O Gemini gratuito pode usar entradas e respostas para melhoria de produtos e revisão humana e veda informações pessoais, confidenciais ou sensíveis; o consentimento específico de cada envio deve refletir os termos atuais. Não aceitar dados identificáveis de pacientes.
- [ ] Confirmar plano gratuito, cotas e disponibilidade do modelo e fornecedores. Configurar acompanhamento de uso; não habilitar plano pago ou fallback pago automaticamente. Gratuito não significa ilimitado, e o SMTP escolhido pode ter limites próprios.
- [ ] Executar a homologação real abaixo e registrar seus resultados.
- [ ] Após esses itens, revisar a versão jurídica: `legalVersion` do cliente, `VERSION` do handler e constraints/checagens do banco precisam concordar. Mudança de versão exige alteração de esquema revisada e novo aceite quando aplicável; não basta alterar só o texto da página.
- [ ] Só então preencher URL/chave publishable, tornar os documentos vigentes com `legalReady: true` e habilitar `accountsEnabled: true`. A IA depende ainda de segredo/modelo verificados, `STUDY_LAUNCH_READY=true` no servidor e `aiEnabled: true` no cliente. Esses passos não foram executados nesta entrega.

## Homologação pendente

| Fluxo real | O que verificar antes da ativação |
| --- | --- |
| Cadastro e e-mails | Confirmação obrigatória, entrega via SMTP, links no endereço exato de Pages, entrada após confirmação, mensagens e limites de reenvio. |
| Recuperação | Link válido/expirado, definição de senha, retorno à conta e entrada com a nova senha. |
| Duas contas e dois navegadores | Notas privadas, criar/editar/excluir, exportar, copiar notas locais sem apagar originais, atualização entre aparelhos e conflito sem perda do texto digitado. Não há atualização em tempo real. |
| Sessão e exclusão | Expiração/renovação, saída global, acesso com token de sessão revogada, senha incorreta, exclusão confirmada e cascata no banco ativo. Usar contas descartáveis. |
| Gemini | Modelo e chave reais, gate fechado/aberto, consentimento por pergunta, notas selecionadas, trechos/citações, lacunas, cotas, falhas e ausência de dados identificáveis no envio. |
| PDF e DOCX no navegador | PDF com texto, PDF digitalizado, senha, erro, limites, rede/CDN indisponível e documento Word real; conferir extração e revisão sem salvamento automático. |
| Notebook e iPad | Layout, teclado, foco, toque, seletor de arquivos, download, sessão na aba, retorno por e-mail e avisos acessíveis em navegador real. |

## Limites e retenção implementados

Até 500 notas por conta; título de 120 caracteres, assunto de 80 e texto de 100 mil. Importação de até 10 MB, PDF com até 100 páginas; DOCX tem verificações adicionais de ZIP, tamanho expandido, macros e XML. Sem OCR ou preservação de imagens, tabelas, fórmulas e layout.

Uma pergunta tem até 2 mil caracteres e uma a cinco notas. A seleção textual classifica trechos de 1.600 caracteres, com sobreposição de 200, até oito trechos e no máximo quatro de uma nota; pode deixar partes das fontes fora do envio. Seguem também até quatro mensagens anteriores, com até 2 mil caracteres cada. Não há pesquisa na internet ou acesso automático ao restante do caderno.

São até 20 tentativas por conta e 200 globais por dia, contadas antes da chamada ao provedor; uma falha posterior pode consumir tentativa. Esses limites não substituem as cotas do Gemini. Contadores guardam usuário, dia e quantidade; linhas anteriores a sete dias são removidas na próxima execução do contador. Conversas não são persistidas pelo backend; logs e backups dos provedores exigem política de retenção própria antes do lançamento.

## Evidência disponível

`verify-rls.sql` foi executado com sucesso no Supabase real em transação com rollback: leitura pelo dono, isolamento entre usuários, falsificação e reatribuição de dono, limite de texto, atualização de versão, cota por conta, negação a anônimos, sessão revogada e cascata de exclusão. Não é uma prova de entrega de e-mail, login público, endpoint Gemini real ou todos os limites sob concorrência.

Os testes locais `study-assistant.mjs`, `study-account.cjs`, `study-space.cjs` e `study-import.cjs` passaram. HTTP/provedores são simulados nos dois primeiros, o controlador usa harness DOM e a importação usa ZIP real com JSZip e DOM XML simulado. PDF.js e parsing em navegador não foram testados. `study-flows.cjs` e `simulation-flows.cjs` passaram como regressão.

A revisão independente da v9 deu SHIP no escopo de markup/CSS estático, controlador, semântica dos dados e prévia inativa; não avaliou acabamento visual nem o lançamento dos serviços. Snapshots de markup não são screenshots. O proxy de rede do runtime estava indisponível, e `cua_repl.js` e o lançador de contexto/detector estavam ausentes. Não há evidência de homologação pública ponta a ponta ou de uso em iPad real.

Referências para conferir antes de configurar: [Supabase Auth SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [redirects](https://supabase.com/docs/guides/auth/redirect-urls), [API keys](https://supabase.com/docs/guides/api/api-keys), [Edge Function secrets](https://supabase.com/docs/guides/functions/secrets), [termos do Gemini](https://ai.google.dev/gemini-api/terms) e [preços/cotas](https://ai.google.dev/gemini-api/docs/pricing).
