# odontoxiii — v8

Web app em português para a graduação em odontologia. O Atlas agora abre o interior de um dente em corte, com tecidos selecionáveis e explicações junto ao modelo. O consultório preserva a boca em 2D da v7, com os sinais dos casos e os efeitos das ações em diagramas clínicos.

**Consultório 2D:** https://hoshii23.github.io/odontoxiii/?v=8.0#simulacao

**Atlas 3D:** https://hoshii23.github.io/odontoxiii/?v=8.0#atlas

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

O último atendimento é salvo no navegador pela chave `odontoxiii-simulation-v6`, com `version: 6`, separado da jornada e de sua exportação. A v8 mantém a sequência dos casos e a compatibilidade com históricos v6 válidos, usados para reconstruir a boca em 2D. Só a sequência válida de etapas concluídas e avançadas é retomada; sair antes de continuar refaz a etapa atual. Registros anteriores à versão 6 não são migrados; jornada, anotações e revisões são preservadas. Não há contas, backend ou sincronização entre dispositivos.

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

Os diagramas clínicos são SVGs gerados em tempo de execução. A v8 não acrescenta imagens rasterizadas ao pacote; o retrato existente mantém sua proveniência.

## Executar e publicar

Na raiz do projeto local, sirva `dist/` por HTTP:

```sh
python3 -m http.server 8000 --directory dist
```

Abra `http://localhost:8000/#simulacao` ou `http://localhost:8000/#atlas`. Não há dependências de build. O uso do servidor depende das permissões de rede do ambiente.

GitHub Pages publica `main` na raiz de `Hoshii23/odontoxiii`. Esse repositório contém o conteúdo de `dist/`, README e `.nojekyll`, enquanto o projeto local também contém fontes de preparação e testes. Para servir uma cópia do repositório publicado, execute `python3 -m http.server 8000` na sua raiz. Para publicar, crie um commit baseado no HEAD remoto e preserve arquivos não relacionados; o histórico local é diferente. Consulte `CHECKPOINT.md` no projeto local.

## Evidência de verificação

Os testes abaixo passaram na v8. Execute-os na raiz do projeto local, onde existe `tests/`:

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
