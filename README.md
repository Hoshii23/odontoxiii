# odontoxiii — v9

Web app em português para a graduação em odontologia. A v9 acrescenta uma prévia do Caderno e IA: escreva, importe documentos e baixe seu rascunho. Contas e Gemini estão implementados, mas permanecem desativados até concluir a configuração e os documentos de lançamento. O Atlas nativo, o consultório em 2D e a jornada local foram preservados.

**Caderno e IA:** https://hoshii23.github.io/odontoxiii/?v=9.0#caderno

**Consultório 2D:** https://hoshii23.github.io/odontoxiii/?v=9.0#simulacao

**Atlas 3D:** https://hoshii23.github.io/odontoxiii/?v=9.0#atlas

## Caderno pessoal e documentos

Abra **Minha jornada → Abrir caderno e IA**. Na prévia sem conta, você pode escrever uma anotação, iniciar um caso fictício, importar **PDF, DOCX, TXT ou MD** e baixar o rascunho em texto. O rascunho fica nesta aba em `sessionStorage`; baixe uma cópia antes de fechá-la. A importação preenche o editor para revisão, sem salvar automaticamente. O arquivo original e suas imagens não são enviados ao armazenamento.

Limites de importação: **10 MB**, **100 páginas por PDF** e **100 mil caracteres por nota**. Não há OCR: um PDF digitalizado precisa de extração externa. Tabelas, fórmulas, imagens e diagramação podem se perder. O leitor PDF.js 6.4.299 carrega do jsDelivr sob demanda e requer conexão e navegador compatível; DOCX usa JSZip 3.10.1 distribuído localmente. O formato DOC antigo não é aceito. Confira [dependências e licenças](dist/assets/STUDY-DEPENDENCIES.md) no projeto local; no pacote publicado, consulte `assets/STUDY-DEPENDENCIES.md` e `vendor/JSZIP-LICENSE.txt`.

O fluxo preparado para lançamento inclui confirmação de e-mail, login, recuperação de senha, até 500 notas privadas por conta, exportação JSON, cópia explícita das notas locais anteriores, detecção de conflito entre versões e exclusão da conta com senha atual. A jornada anterior e as simulações permanecem no navegador, separadas da conta; a cópia de notas locais mantém as originais. Sessão e rascunhos da conta ficam na aba. Sair limpa a sessão, o rascunho da conta e a conversa; excluir a conta não apaga os arquivos baixados ou dados locais.

A integração Gemini preparada permite escolher de uma a cinco notas e fazer uma pergunta de até 2 mil caracteres. O servidor envia até oito trechos de 1.600 caracteres classificados por relevância e até quatro mensagens anteriores; a resposta mostra os trechos enviados. A IA pode errar e não lê necessariamente os documentos inteiros. Cada envio exige confirmação, e trocar fontes inicia outra conversa. Conversas não são salvas pelo backend; há download em texto. Não há geração de novas simulações nesta entrega.

O público inicial da integração é de **adultos no Brasil**, em uso educacional. Não registre dados identificáveis de pacientes. O Gemini gratuito pode usar entradas e respostas para melhoria de produtos e revisão humana; não envie informações pessoais, confidenciais ou sensíveis. As cotas iniciais são 20 tentativas por conta e 200 no site por dia, além dos limites do provedor. Falhas posteriores podem consumir tentativas. Não há contratação automática de plano pago nem promessa de gratuidade ilimitada.

O projeto Supabase dedicado gratuito em São Paulo está ativo, com esquema e funções implantados. A configuração pública mantém URL e chave vazias e `accountsEnabled`, `aiEnabled`, `legalReady` em `false`. SMTP, redirects e segredo Gemini ainda precisam ser configurados. As páginas **Privacidade** e **Termos de uso** são minutas não vigentes, versão `2026-10-23`; o usuário adiou identificação do controlador e contato até o lançamento. Consulte o [checklist de configuração e abertura](backend/README.md). A existência do backend não torna contas ou IA públicas nesta prévia.

## Consultório simulado em 2D

Em **Praticar → Consultório**, escolha ou sorteie entre seis casos: cárie profunda, restauração fraturada, avaliação para aparelho, periodonto, dor dental e prevenção. Lia apresenta as queixas em texto e, quando disponível, voz do navegador. As 18 decisões clínicas têm quatro alternativas equilibradas e explicações específicas. A ordem varia por percurso e permanece estável ao tentar novamente a mesma etapa.

O diagrama SVG acompanha os registros das ações e mostra cálculo, biofilme, margens inflamadas, cavitação, fratura, reparo ou lesão branca conforme o caso. Há rótulos FDI, legenda e descrição textual. Alterne entre **Boca completa** e a região afetada: os quatro casos focais começam ampliados; periodonto e aparelho começam pela boca completa. O desalinhamento dos incisivos no caso de aparelho permanece nas duas vistas. A consulta não carrega o visualizador 3D.

- Nas etapas de procedimento, clique uma vez no instrumento ou material. A ação correta ocorre no local previsto e apresenta o achado, a resposta de Lia e a explicação.
- Uma escolha inadequada explica a função do recurso e permite tentar novamente, sem alterar a boca, executar o procedimento ou avançar o caso.
- O espelho registra achados de uma superfície identificada; a sonda apresenta medidas e sangramento fictícios, sem limpar depósitos. Prontuário e resumo conservam os resultados, incluindo as linhas do recorte periodontal.
- A orientação de higiene mantém o cálculo. A cureta remove depósitos, mas a margem permanece inflamada para reavaliação. O verniz não apaga a mancha branca; o bráquete aparece apenas como componente na bancada.
- O isolamento mostra o campo do dente 16 e impede a troca para a boca completa até a etapa de papel articular, presente nos casos de cárie e restauração, que o remove para avaliar contatos oclusais.
- Não há instrumentos arrastáveis, seleção de alvo, botão adicional de aplicar ou objeto de espelho manipulável.

Cada etapa precisa ser concluída antes de continuar, e uma ação concluída não pode ser repetida nessa etapa. Os procedimentos são condensados: dose, punção, força e técnica manual exigem avaliação individual e prática supervisionada. O retrato de Lia é gerado por IA; casos, diagramas e medidas são fictícios e não permitem medidas clínicas.

O último atendimento é salvo no navegador pela chave `odontoxiii-simulation-v6`, com `version: 6`, separado da jornada, de sua exportação e do novo caderno. A v9 mantém a sequência dos casos e a compatibilidade com históricos v6 válidos, usados para reconstruir a boca em 2D. Só a sequência válida de etapas concluídas e avançadas é retomada; sair antes de continuar refaz a etapa atual. Registros anteriores à versão 6 não são migrados; jornada, anotações e revisões são preservadas. Jornada e simulações não têm sincronização automática entre dispositivos.

## Atlas 3D e referências clínicas

O Atlas começa pelo molar superior 16 em corte longitudinal. Escolha também o incisivo central 11 ou o arco superior. Gire por arraste ou setas; amplie por pinça, botões, teclas +/− ou roda com foco no canvas. Use Home ou **Restaurar** para voltar à vista inicial.

Clique ou toque em um tecido visível, ou use os quatro botões nomeados — **Esmalte**, **Dentina**, **Polpa** e **Cemento** — para ler sua função no painel ao lado. Os botões oferecem a mesma seleção por teclado e revelam a camada escolhida; para tecidos internos, abrem o corte se necessário. Arrastar, ampliar com dois dedos ou cancelar o gesto não seleciona. A seleção respeita o corte, as camadas ocultas e a posição dos tecidos separados.

Alterne **Corte longitudinal**, **Separar tecidos** e os controles de mostrar ou ocultar para comparar as camadas. As vistas inteira, em corte e separada conservam a mesma forma externa derivada de tomografia e a mesma polpa segmentada. Selecionar novamente o dente ativo desfaz a separação. Corte e separação ficam desabilitados no arco. WebGL dispõe de alternativa Canvas 2D; se a visualização falhar, as explicações e o acesso às aulas permanecem disponíveis.

A dentina interna é um volume fechado didático. A divisão cervical e os limites entre esmalte, dentina e cemento são aproximações: não são histologia medida nem segmentação clinicamente validada. A ilustração de cárie usa geometria esquemática separada, identificada na tela, sem cronologia de evolução ou finalidade diagnóstica. Fonte e unidades normalizadas não permitem medidas clínicas.

O link [Interior do dente, do Manual MSD](https://www.msdmanuals.com/pt/casa/multimedia/3dmodel/interior-do-dente) mantém a referência BioDigital original disponível. O estudo nativo não é idêntico a ela. A publicação pela BioDigital exige plano School ou Business segundo sua documentação oficial; nenhuma conexão ou licença correspondente está disponível. Não foram copiados o modelo, o widget ou imagens da BioDigital. O método nativo e os links oficiais estão em `dist/assets/ANATOMY-LICENSE.md`.

Abaixo do estudo, abra **Arcadas completas e modelos universitários** para observar o modelo nativo com 28 dentes distintos: 14 superiores, 14 inferiores e as duas gengivas. É possível girar, ampliar, observar cada arcada e ajustar a abertura. As superfícies externas vêm de 3Dentes, com recorte cervical aproximado pelos envelopes de coroa da fonte e transformação comum às duas arcadas. Não há duplicação ou espelhamento de dentes superiores para criar os inferiores.

Os dentes 36 e 46 possuem coroas protéticas, e não há terceiros molares. A abertura inferior é ilustrativa; 0° mantém a posição do exame, com afastamento entre as arcadas, e não representa oclusão clínica. O modelo não inclui lábios, língua ou palato completo. Resolução, segmentação e recorte limitam a fidelidade; não há validação clínica, alegação de fotorrealismo ou garantia de ausência de defeitos. Os modelos de referência não são exames de Lia.

A mesma seção reúne modelos da Faculdade de Odontologia da Universidade de Dundee: primeiro molar superior esquerdo, dentição permanente e incisivo com anatomia endodôntica. O Sketchfab abre após ação explícita, requer internet e oferece link direto à fonte.

A biblioteca de referências inclui três fotografias clínicas com autoria, licença, ampliação, perguntas e comentários. São imagens sem alterações, carregadas dos arquivos originais do Wikimedia Commons, independentes da paciente fictícia. A descrição escrita pelo estudante fica apenas na tela.

## Conteúdo e licenças

10 trilhas, 20 aulas, flashcards, questões, casos breves, favoritos, anotações, plano e jornada com exportação/importação.

**Anatomy from 3Dentes by Nate Saindon, CC BY-NC 4.0.**

As malhas nativas têm restrição não comercial, atribuição e limites de resolução. Consulte `assets/MOUTH-SOURCE.md`, `assets/ANATOMY-LICENSE.md` e `assets/REFERENCE-SOURCES.md` no pacote publicado; no projeto local, esses arquivos ficam em `dist/assets/`. Modelos e fotos mantêm suas próprias licenças; a licença do código não as substitui.

O estudo nativo usa núcleos fechados pré-gerados em `dist/study-core-assets.js`, ativados pelo modo opcional `DentalAtlas.studyMode`. A preparação em `tools/pack-study-core.py` usa voxelização do interior da fonte em grade de 0,045 unidades de exibição, distância para dentro, marching tetrahedra e oito passes de suavização restrita; verifica vértices dentro da fonte e exatamente duas faces por aresta. Esses controles geométricos não validam a anatomia clinicamente.

Os diagramas clínicos são SVGs gerados em tempo de execução. A v9 não acrescenta imagens rasterizadas ao pacote; o retrato existente mantém sua proveniência. `DESIGN.md` e `.impeccable/design.json` foram preservados, sem mudança de sistema visual.

## Executar e publicar

Na raiz do projeto local, sirva `dist/` por HTTP:

```sh
python3 -m http.server 8000 --directory dist
```

Abra `http://localhost:8000/#caderno`, `#simulacao` ou `#atlas`. Não há dependências de build. O uso do servidor depende das permissões de rede do ambiente. A configuração padrão mantém a prévia sem conta e sem IA.

GitHub Pages publica `main` na raiz de `Hoshii23/odontoxiii`. O pacote v9 inclui o conteúdo de `dist/` na raiz, README, `.nojekyll` e `backend/` com código, SQL e instruções sem segredos. No projeto local, há também fontes de preparação e testes. GitHub Pages serve a interface estática; as funções e o banco executam no Supabase. Para servir uma cópia do repositório publicado, execute `python3 -m http.server 8000` na sua raiz. Para publicar, crie um commit baseado no HEAD remoto e preserve arquivos não relacionados; o histórico local é diferente. Consulte `CHECKPOINT.md` no projeto local. A publicação precisa de confirmação separada; este README não é evidência de deploy.

## Evidência de verificação

Na v9 passaram, na raiz do projeto local:

```sh
node tests/study-assistant.mjs
node tests/study-account.cjs
node tests/study-space.cjs
node tests/study-import.cjs
node tests/study-flows.cjs
node tests/simulation-flows.cjs
```

`study-assistant` usa HTTP/provedores simulados; `study-account` simula HTTP; `study-space` usa harness DOM. `study-import` decodifica ZIP real com JSZip, mas simula o DOM XML. PDF.js e importação em navegador não foram testados. As regressões de jornada, Atlas e consultório passaram nos dois testes de fluxo.

`backend/verify-rls.sql` passou no Supabase real com usuários sintéticos, transação e rollback: isolamento por proprietário, falsificação/reatribuição de dono, negação a anônimos, sessão revogada, limite de texto, versão, cota por conta e cascata de exclusão. As funções `study-assistant` v1 e `study-account` v1 estão ACTIVE com `verify_jwt: true`. Advisors finais sem WARN/ERROR; o INFO de RLS sem políticas em `private.study_ai_usage` corresponde à negação direta aos clientes, sem privilégios de acesso à tabela.

A revisão independente da v9 emitiu **SHIP** somente para markup/CSS estático, controladores, semântica dos dados e prévia com serviços inativos. O acabamento visual não foi avaliado. `.impeccable/review/v9-markup/` contém snapshots de markup, sem screenshots. O proxy de rede do runtime estava indisponível; `cua_repl.js` e o lançador de contexto/detector estavam ausentes. Login e recuperação reais, entrega de e-mail, sincronização/conflitos em dois navegadores, exclusão de conta real, Gemini, PDF, layout no navegador e iPad precisam de homologação antes da ativação.

Os testes abaixo são evidência histórica da v8, sem nova alegação de execução na v9:

```sh
node tests/capture-interior.cjs
RENDER_DIR=.impeccable/review/interior-webgl RENDER_PREFIX=v8-gl- python3 tests/render-webgl.py
node tests/render-interior.cjs
node tests/study-flows.cjs
node tests/render-models.cjs
node tests/capture-webgl.cjs
node tests/simulation-ui.cjs
node tests/simulation-flows.cjs
node tests/clinical-mouth-2d.cjs
```

- `capture-interior`: oito cenas WebGL; seleção real de tecidos, camadas ocultas, corte, deslocamentos separados e gestos de toque, arraste e cancelamento.
- `render-webgl`: compilação, rasterização e profundidade reais com Mesa. Imagens e duas folhas de comparação em `.impeccable/review/interior-webgl/`.
- `render-interior`: cinco cenas Canvas, incluindo 354 × 380, em `.impeccable/review/interior-canvas/`.
- `study-flows`: 12 rotas, jornada, notas, revisões e cópias de dados; seleção de tecido pelo botão e callback do visualizador, revelação da camada, corte inicial e desativação da separação.
- `render-models` e `capture-webgl`: regressão dos modelos e renderizadores existentes.
- `simulation-ui`, `simulation-flows` e `clinical-mouth-2d`: seis casos completos, ações, feedback, vistas, isolamento, retomada e fronteira de versão 6; 24 estados SVG e invariantes do diagrama.

As capturas são imagens dos renderizadores, sem captura de layout em navegador. A rasterização anterior dos SVGs reais em 700px e 350px via `python3 tests/render-mouth-2d.py` pertence à verificação da v7.

A revisão independente da v8 emitiu **SHIP** após substituir a geometria interna que se intersectava por núcleos fechados, manter o painel responsivo explicitamente vertical e desativar a separação ao selecionar novamente o modelo ativo. Verificou os dois núcleos fechados, ausência de cruzamentos nas seções, triângulos e áreas das tampas, renderizações, CSS estático e controladores. O veredito cobre geometria, renderizador, controlador e CSS estático.

Chromium/Playwright não iniciou na verificação anterior; não houve nova tentativa sem mudança de ambiente. Layout em navegador, voz nativa, iPad real, leitor de tela e abertura efetiva dos iframes externos não foram validados. O lançador de contexto/detector estava ausente; a tentativa do detector não produziu saída de hook. A referência Instagram anterior não pôde ser acessada; não se afirma fidelidade ao vídeo.
