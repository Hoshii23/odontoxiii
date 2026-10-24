# odontoxiii — v12

Web app em português para a graduação em odontologia. A v12 simplifica **Xii**, acrescenta referências científicas recuperadas e registra a autorização opcional da IA na conta. Login e notas privadas continuam para **contas convidadas em teste fechado**; o caderno sem conta permite escrever, importar e baixar rascunhos. Os nove casos do consultório 2D e a jornada local permanecem disponíveis. O Atlas 3D está **Em breve**.

**Entrar e ativar Xii na conta existente:** https://hoshii23.github.io/odontoxiii/?v=12.0#conta

**Caderno e IA:** https://hoshii23.github.io/odontoxiii/?v=12.0#caderno

**Consultório 2D:** https://hoshii23.github.io/odontoxiii/?v=12.0#simulacao

**Atlas 3D — Em breve:** https://hoshii23.github.io/odontoxiii/?v=12.0#atlas

## Caderno pessoal e documentos

Abra **Minha conta** e entre com o e-mail convidado e a senha da sua conta. O acesso exige conta com e-mail confirmado e convite habilitado pelo operador. Cadastro público e recuperação por e-mail estão ocultos; SMTP ainda não foi configurado. O dono criou sua conta com senha pelo Supabase Dashboard. Para definir ou recuperar uma senha nesta fase, fale com quem liberou o acesso; não compartilhe credenciais.

Após entrar, aceite as condições experimentais para salvar até 500 notas privadas, editar com detecção de conflito de versão, exportar o caderno em JSON, copiar explicitamente notas locais anteriores e excluir a conta com senha atual. A jornada e as simulações anteriores permanecem no navegador, separadas da conta; copiar notas locais mantém as originais. Revogar um convite bloqueia novas escritas e IA, mas mantém leitura, exportação e exclusão dos dados próprios. Sessão e rascunhos da conta ficam na aba. Sair limpa a sessão, o rascunho da conta e a conversa; excluir a conta não apaga arquivos baixados ou dados locais.

Para usar Xii, abra **Minha conta** e ative a autorização opcional uma vez: confirme que está no Brasil e que permite o envio de material educacional não pessoal ao Google/Gemini gratuito, com possível melhoria de produtos e revisão humana. A declaração de maioridade da conta continua exigida. Contas anteriores precisam fazer essa escolha; nenhum aceite antigo foi convertido em autorização de IA. O registro usa a versão `2026-10-24` e horário atribuído pelo servidor. Você pode desativar Xii na conta a qualquer momento e continuar usando o caderno. Não há caixa de aceite a cada pergunta.

Em **Minha jornada → Abrir caderno e IA**, também é possível experimentar sem conta: escrever uma anotação, iniciar um caso fictício, importar **PDF, DOCX, TXT ou MD** e baixar o rascunho em texto. O rascunho fica nesta aba em `sessionStorage`; baixe uma cópia antes de fechá-la. A importação preenche o editor para revisão, sem salvar automaticamente. O arquivo original e suas imagens não são enviados ao armazenamento.

Limites de importação: **10 MB**, **100 páginas por PDF** e **100 mil caracteres por nota**. Não há OCR: um PDF digitalizado precisa de extração externa. Tabelas, fórmulas, imagens e diagramação podem se perder. O leitor PDF.js 6.4.299 carrega do jsDelivr sob demanda e requer conexão e navegador compatível; DOCX usa JSZip 3.10.1 distribuído localmente. O formato DOC antigo não é aceito. Confira [dependências e licenças](dist/assets/STUDY-DEPENDENCIES.md) no projeto local; no pacote publicado, consulte `assets/STUDY-DEPENDENCIES.md` e `vendor/JSZIP-LICENSE.txt`.

## Xii — assistente integrado

Abra **Xii** pelo dente sorridente em qualquer página. O painel não modal permite estudar, escrever e conversar lado a lado; a resposta se identifica apenas como **Xii**. Os controles de contexto ficam recolhidos: **Página ou caso atual**, **Texto aberto no caderno** e **Buscar no meu caderno**. Aulas, caso em andamento, casos breves, questões e flashcards fornecem conteúdo visível, sem respostas ainda não reveladas. Você também pode perguntar sem notas. O assistente não altera suas anotações.

Confira o contexto antes de cada envio. A prévia acompanha a digitação e as operações de abrir, criar, restaurar, importar ou excluir uma anotação, além das mudanças de página; nada é enviado enquanto você digita. Mudar os controles de fontes reinicia a conversa. Fechar Xii conserva a conversa na memória desta aba; recarregar a página, sair ou mudar de conta a limpa. O backend não salva conversas.

Para assuntos reconhecidos, o servidor procura artigos no Europe PMC, priorizando revisões, revisões sistemáticas, meta-análises e diretrizes. Só termos controlados em inglês saem nessa busca: texto bruto da pergunta, notas e dados da conta não são enviados ao serviço científico. São recuperados até três registros `SRC:MED` (origem PubMed) com PMID numérico e resumo. Retratações, preprints, editoriais, comentários e cartas são filtrados conforme a indexação disponível, sem garantia de detecção completa. A busca tem prazo total de 6,5 segundos e cache por tema público por até seis horas, com no máximo 40 entradas. Assuntos fora do vocabulário podem não gerar busca.

Os resumos são usados no servidor e podem fundamentar a resposta com `[E1]`, `[E2]` ou `[E3]`, separados das notas e do contexto `[1]`, `[2]`. O cliente recebe metadados e links, sem abstracts. A interface mostra **Fontes científicas** quando a resposta cita esses registros; sem citação específica, mostra **Artigos para conferir**. Os links PubMed vêm dos metadados recuperados, nunca de URLs inventadas pelo modelo. Ausência de artigo ou indisponibilidade da busca é informada. Isso não equivale à leitura integral: confira texto completo, pertinência e limitações de estudos em animais, in vitro ou mecanismos propostos. Indexação no PubMed não garante verdade clínica nem relevância. Direitos dos artigos e resumos permanecem com autores/editoras; os detalhes e a documentação oficial estão em [backend/README.md](backend/README.md).

Cada pergunta tem até 2 mil caracteres. Página e texto aberto contribuem com até 6 mil caracteres cada. Quando a busca no caderno está ligada, o servidor procura até cinco notas próprias por palavras da pergunta; sem correspondência, usa as cinco mais recentes. Seleciona até oito trechos de 1.600 caracteres, com no máximo quatro por nota, e pode acrescentar as duas fontes de página/rascunho: até dez fontes numeradas para conferir. Isso não garante exatidão nem leitura integral dos documentos. Seguem no máximo quatro mensagens anteriores de 2 mil caracteres; o cliente reduz histórico e, se necessário, contexto para caber em 58 mil bytes UTF-8, abaixo do limite de 60 mil bytes do servidor.

O fluxo anterior **Caderno → Perguntar à IA** continua disponível com seleção explícita de uma a cinco notas, download da conversa e orçamento de 18 mil bytes no cliente. Salvar respostas como notas exige cópia manual. Não há geração de novas simulações nesta entrega.

O público inicial é de **adultos no Brasil**, em uso educacional. Não registre dados identificáveis de pacientes. O Gemini gratuito pode usar entradas e respostas para melhoria de produtos e revisão humana; não envie informações pessoais, confidenciais ou sensíveis. As cotas iniciais são 20 tentativas por conta e 200 no site por dia, além dos limites do provedor. Falhas posteriores podem consumir tentativas. O modelo atual é `gemini-3.5-flash-lite`, verificado com respostas reais. Em falhas transitórias, há até duas tentativas no modelo principal e uma no alternativo `gemini-3.6-flash`, com espera curta e prazo limitado. A modalidade gratuita foi conferida na [tabela oficial](https://ai.google.dev/gemini-api/docs/pricing); nenhuma cobrança paga foi ativada. Não há promessa de gratuidade ilimitada ou disponibilidade contínua. Os limites e códigos de falha estão em [backend/README.md](backend/README.md).

O projeto Supabase gratuito dedicado em São Paulo está ativo. A configuração pública tem URL e chave publishable preenchidas, `accountsEnabled: true`, `aiEnabled: true`, `accessMode: 'closed_beta'` e `legalReady: false`. As páginas **Privacidade** e **Termos de uso** continuam como minutas não vigentes, versão `2026-10-23`; o usuário adiou identificação do controlador e contato até o lançamento público. Essa pendência não bloqueia o teste fechado autorizado. A operação, os controles de convite e os requisitos para abertura pública estão em [backend/README.md](backend/README.md).

## Consultório simulado em 2D

Em **Praticar → Consultório**, escolha ou sorteie entre nove casos: cárie profunda, restauração fraturada, avaliação para aparelho, periodonto, dor dental, prevenção, fratura após trauma, selamento de fissuras e sensibilidade cervical. As 27 questões distintas têm quatro alternativas equilibradas e explicações específicas. A ordem varia por percurso e permanece estável ao tentar novamente a mesma etapa. Lia, 28 anos, apresenta as queixas em texto e, quando disponível, voz do navegador. No caso de selamento do 16, a paciente é Nina, 13 anos, acompanhada por Lia; o retrato existente representa a acompanhante.

O diagrama SVG acompanha os registros das ações e mostra cálculo, biofilme, margens inflamadas, cavitação, fratura, reparo, lesão branca, fissura selada ou exposição cervical conforme o caso. Há rótulos FDI, legenda e descrição textual. Alterne entre **Boca completa** e a região afetada: os sete casos focais começam ampliados; periodonto e aparelho começam pela boca completa. O desalinhamento dos incisivos no caso de aparelho permanece nas duas vistas. A consulta não carrega o visualizador 3D.

- Nas etapas de procedimento, escolha entre 12 instrumentos e materiais, incluindo selante. Clique uma vez no recurso: a ação correta ocorre no local previsto e apresenta o achado, a resposta da personagem e a explicação.
- Uma escolha inadequada explica a função do recurso e permite tentar novamente, sem alterar a boca, executar o procedimento ou avançar o caso.
- O espelho registra achados de uma superfície identificada; a sonda apresenta medidas e sangramento fictícios, sem limpar depósitos. Prontuário e resumo conservam os resultados, incluindo as linhas do recorte periodontal.
- A orientação de higiene mantém o cálculo. A cureta remove depósitos, mas a margem permanece inflamada para reavaliação. O verniz não apaga a mancha branca; o bráquete aparece apenas como componente na bancada.
- O isolamento mostra o campo do dente 16 e impede a troca para a boca completa até a retirada prevista no caso. Papel articular remove o isolamento nos casos de cárie e restauração; o selamento também inclui a retirada e a conferência final. Orientação de higiene não elimina a exposição cervical, e o selante não declara a lesão curada.
- Não há instrumentos arrastáveis, seleção de alvo, botão adicional de aplicar ou objeto de espelho manipulável.

Cada etapa precisa ser concluída antes de continuar, e uma ação concluída não pode ser repetida nessa etapa. Os procedimentos são condensados: dose, punção, força e técnica manual exigem avaliação individual e prática supervisionada. O retrato de Lia é gerado por IA; casos, diagramas e medidas são fictícios e não permitem medidas clínicas.

O último atendimento é salvo no navegador pela chave `odontoxiii-simulation-v6`, com `version: 6`, separado da jornada, de sua exportação e do novo caderno. A v12 mantém a sequência dos seis casos anteriores e a compatibilidade com históricos v6 válidos, usados para reconstruir a boca em 2D; os três casos acrescentados na v11 usam o mesmo contrato de sessão. Só a sequência válida de etapas concluídas e avançadas é retomada; sair antes de continuar refaz a etapa atual. Registros anteriores à versão 6 não são migrados; jornada, anotações e revisões são preservadas. Jornada e simulações não têm sincronização automática entre dispositivos.

## Atlas 3D e referências clínicas

A rota **Atlas 3D** exibe **Em breve**, com acesso às aulas de anatomia e ao consultório. A v12 remove os quatro scripts pesados de 3D do carregamento inicial e não instancia o visualizador nativo. Seu código, malhas e documentos de origem ficam arquivados para trabalho futuro; os controles de corte, tecidos e arcadas descritos nas versões anteriores estão suspensos.

A biblioteca `#referencias` mantém três fotografias clínicas com autoria, licença, ampliação, perguntas e comentários. São imagens sem alterações, carregadas dos arquivos originais do Wikimedia Commons, independentes da paciente fictícia. A descrição escrita pelo estudante fica apenas na tela. As referências universitárias de Dundee e seus links originais permanecem na biblioteca; embeds externos dependem de ação explícita, internet e disponibilidade do provedor.

O material 3D arquivado deriva de 3Dentes e tem aproximações didáticas, sem escala ou validação clínica. O [Interior do dente, do Manual MSD](https://www.msdmanuals.com/pt/casa/multimedia/3dmodel/interior-do-dente) permanece referência histórica; nenhum modelo, widget ou imagem da BioDigital foi copiado. Publicação pela BioDigital exige plano School ou Business segundo sua documentação oficial, sem conexão ou licença correspondente disponível. Origem, método e limites estão em `dist/assets/ANATOMY-LICENSE.md` e `dist/assets/MOUTH-SOURCE.md`.

## Conteúdo e licenças

10 trilhas, 20 aulas, flashcards, questões, casos breves, favoritos, anotações, plano e jornada com exportação/importação.

**Anatomy from 3Dentes by Nate Saindon, CC BY-NC 4.0.**

As malhas nativas têm restrição não comercial, atribuição e limites de resolução. Consulte `assets/MOUTH-SOURCE.md`, `assets/ANATOMY-LICENSE.md` e `assets/REFERENCE-SOURCES.md` no pacote publicado; no projeto local, esses arquivos ficam em `dist/assets/`. Modelos e fotos mantêm suas próprias licenças; a licença do código não as substitui.

O estudo nativo arquivado conserva núcleos fechados pré-gerados em `dist/study-core-assets.js` e o preparador `tools/pack-study-core.py`: voxelização em grade de 0,045 unidades de exibição, distância para dentro, marching tetrahedra e oito passes de suavização restrita, com verificações de interior e duas faces por aresta. Esses controles geométricos não validam a anatomia clinicamente e o estudo não é carregado na v12.

Os três casos acrescentados na v11 são ficção educacional autoral; suas fontes primárias IADT, NHS, ADA/AAPD, FDI e UAB estão em `dist/simulation-cases-extra.js` e nos resumos. Os diagramas clínicos são SVGs gerados em tempo de execução, e o dente sorridente de Xii é um SVG autoral. A v12 não acrescenta imagens rasterizadas ou novo sistema visual; o retrato existente mantém sua proveniência. `DESIGN.md` e `.impeccable/design.json` foram comparados ao HEAD e preservados byte a byte.

## Executar e publicar

Na raiz do projeto local, sirva `dist/` por HTTP:

```sh
python3 -m http.server 8000 --directory dist
```

Abra `http://localhost:8000/#conta`, `#caderno`, `#simulacao` ou `#atlas`. Não há dependências de build. A configuração atual aponta para o backend do teste fechado; a origem local precisa ser autorizada explicitamente no servidor para chamadas às Edge Functions. A experiência sem conta continua disponível. O uso do servidor depende das permissões de rede do ambiente.

GitHub Pages publica `main` na raiz de `Hoshii23/odontoxiii`. O pacote v12 tem 43 arquivos: conteúdo de `dist/` na raiz, README, `.nojekyll` e `backend/` com código, SQL e instruções sem segredos. No projeto local, há também fontes de preparação e testes. GitHub Pages serve a interface estática; funções e banco executam no Supabase. A migração de consentimento já foi aplicada. O handler v12 de `study-assistant` já foi implantado com a entrada, `shared/handler.mjs` e `shared/literature.mjs`, antes da publicação do cliente que remove o payload antigo de consentimento. `study-account` v9 não mudou. Preserve `verify_jwt: true`.

Para servir uma cópia do repositório publicado, execute `python3 -m http.server 8000` na raiz. A publicação deve partir do HEAD remoto e preservar arquivos não relacionados; o histórico local é diferente. O pacote v12 é conferido por SHA antes da publicação. Consulte `CHECKPOINT.md` no projeto local. Este README não é evidência de deploy.

## Evidência de verificação

Na v12 passaram, na raiz do projeto local:

```sh
node tests/study-literature.mjs
node tests/study-sources.cjs
node tests/study-assistant.mjs
node tests/study-account.cjs
node tests/assistant-ui.cjs
node tests/study-space.cjs
node tests/simulation-ui.cjs
node tests/study-flows.cjs
```

Os testes de conta/servidor usam HTTP e provedores simulados; os controladores usam harness DOM. Cobrem consentimento armazenado e revogação, consultas científicas controladas, filtros e links canônicos, fontes citadas versus sugestões, ausência/indisponibilidade, perguntas sem notas, busca do dono, limites, retries e o Atlas sem alocar visualizador. A revisão independente v12 repetiu seis suítes e emitiu **SHIP**, sem bloqueadores materiais no escopo estático, sintético, unitário e de HTTP registrado. `.impeccable/review/v12-markup/` contém somente HTML sintético. Não houve nova imagem raster ou captura do app.

O novo handler executou dentro de um checker Edge temporário protegido por nonce, com Auth, PostgREST, Europe PMC e Gemini reais. A evidência sanitizada em `.impeccable/review/v12-runtime-evidence.json` registra bloqueio antes do consentimento sem chamar o serviço científico ou Gemini, exigência de Brasil, horário do servidor e tentativa de escrita negada, busca HTTP 200, resposta com `[E2]`, revogação com IA negada e caderno ainda utilizável. O título e o link PubMed citado foram abertos e confirmados independentemente. Depois do ensaio, filtros de publicação e cautelas do prompt foram refinados e os testes locais passaram; o ensaio não foi repetido na função principal. O checker agora retorna HTTP 410, v12, com `verify_jwt: true`; usuários, convites, RPCs e tabelas temporárias e `pg_net` foram removidos, com ausência confirmada.

A v11 permanece evidência histórica de login, nota, pergunta geral e envio de nota/rascunho/página com `gemini-3.5-flash-lite`, em `.impeccable/review/v11-runtime-evidence.json`. Também passaram nela os testes dos nove casos e a rasterização de 34 estados SVG em 700px e 350px; `v11-new-case-diagrams.png` é uma folha de diagramas, não uma captura do app.

A integração HTTP v10 permanece como evidência histórica de convite e negação a não convidados, edição e conflito de notas, isolamento entre donos, renovação de sessão e exclusão de conta. `backend/verify-rls.sql` passou integralmente na v9 com usuários sintéticos e rollback. As tentativas do script completo na v10 expiraram no conector (`requestState expired`) ou foram canceladas: **não são PASS**, e não houve nova execução integral na v11/v12. Os testes HTTP são evidência distinta, sem cobrir todos os limites sob concorrência. Os advisors registrados têm três INFO de tabelas privadas com negação por padrão e um WARN de proteção contra senhas vazadas desabilitada; veja a [documentação de correção](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). Não houve alteração paga.

A revisão v11 corrigiu a prévia de rascunho e o contexto de casos breves, questões e flashcards. Na v12, a tentativa de detector falhou por ausência do lançador; não houve captura substituta. Navegador real, dois navegadores, iPad, tecnologia assistiva, SMTP/recuperação e PDF.js real seguem sem homologação. Os resultados v9 de importação permanecem históricos: ZIP real com JSZip e DOM XML simulado.

A evidência do Atlas abaixo é histórica da v8; o visualizador está suspenso na v12:

```sh
node tests/capture-interior.cjs
RENDER_DIR=.impeccable/review/interior-webgl RENDER_PREFIX=v8-gl- python3 tests/render-webgl.py
node tests/render-interior.cjs
node tests/render-models.cjs
node tests/capture-webgl.cjs
```

`capture-interior` verificou oito cenas WebGL, seleção real de tecidos, camadas ocultas, corte, deslocamentos separados e gestos. `render-webgl` usou compilação, rasterização e profundidade reais com Mesa; `render-interior` cobriu cinco cenas Canvas, incluindo 354 × 380. `render-models` e `capture-webgl` verificaram a regressão dos modelos e renderizadores. As imagens em `.impeccable/review/interior-webgl/` e `interior-canvas/` são capturas dos renderizadores, sem captura de layout em navegador.

A revisão independente v8 emitiu **SHIP** para geometria, renderizador, controlador e CSS estático após corrigir os núcleos internos, o painel responsivo e a separação de tecidos. Chromium/Playwright não iniciou na verificação anterior; voz nativa e abertura efetiva dos iframes externos não foram validadas. A referência Instagram anterior não pôde ser acessada; não se afirma fidelidade ao vídeo.
