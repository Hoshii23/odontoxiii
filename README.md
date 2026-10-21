# odontoxiii — v6

Web app em português para a graduação em odontologia.

**Atlas:** https://hoshii23.github.io/odontoxiii/?v=6.0#atlas

**Consultório:** https://hoshii23.github.io/odontoxiii/?v=6.0#simulacao

## Anatomia e referências clínicas

O Atlas e o consultório mostram um modelo nativo com 28 dentes distintos: 14 superiores, 14 inferiores e as duas gengivas. É possível girar, ampliar, observar cada arcada e ajustar a abertura. As superfícies externas vêm de 3Dentes, com recorte cervical aproximado pelos envelopes de coroa da fonte e transformação comum às duas arcadas. Não há duplicação ou espelhamento de dentes superiores para criar os inferiores.

Os dentes 36 e 46 possuem coroas protéticas, e não há terceiros molares. A abertura inferior é ilustrativa; 0° mantém a posição do exame, com afastamento entre as arcadas, e não representa oclusão clínica. O modelo não inclui lábios, língua ou palato completo. Resolução, segmentação e recorte limitam a fidelidade; não há validação clínica, alegação de fotorrealismo ou garantia de ausência de defeitos.

Abaixo das duas arcadas, uma seção expansível reúne modelos da Faculdade de Odontologia da Universidade de Dundee: primeiro molar superior esquerdo, dentição permanente e incisivo com anatomia endodôntica. O Sketchfab abre após ação explícita, requer internet e oferece link direto à fonte. O laboratório local preserva dentes isolados, arco superior, cortes e camadas didáticas.

A biblioteca de referências inclui três fotografias clínicas com autoria, licença, ampliação, perguntas e comentários. São imagens sem alterações, carregadas dos arquivos originais do Wikimedia Commons, independentes da paciente fictícia. A descrição escrita pelo estudante fica apenas na tela.

## Consultório simulado

Em **Praticar → Consultório**, escolha ou sorteie entre seis casos: cárie profunda, restauração fraturada, avaliação para aparelho, periodonto, dor dental e prevenção. Lia apresenta as queixas em texto e, quando disponível, voz do navegador. As 18 decisões clínicas têm quatro alternativas equilibradas e explicações específicas. A ordem varia por percurso e permanece estável ao tentar novamente a mesma etapa.

- Nas etapas de procedimento, clique uma vez no instrumento ou material. A ação correta ocorre no local previsto e apresenta o achado, a resposta de Lia e a explicação.
- Uma escolha inadequada explica a função do recurso e permite tentar novamente, sem executar o procedimento ou avançar o caso.
- O espelho registra achados de uma superfície identificada; a sonda apresenta medidas e sangramento fictícios. Prontuário e resumo conservam os resultados, incluindo as linhas do recorte periodontal.
- O isolamento mostra o campo do dente 16 e persiste até a etapa de papel articular, presente nos casos de cárie e restauração, que o remove para avaliar contatos oclusais.
- O modelo permite observar a boca. Não há instrumentos arrastáveis, seleção de alvo, botão adicional de aplicar ou objeto de espelho manipulável. As ações funcionam mesmo se o 3D não abrir.

Cada etapa precisa ser concluída antes de continuar, e uma ação concluída não pode ser repetida nessa etapa. O canvas persiste durante respostas e ações. Os procedimentos são condensados: dose, punção, força e técnica manual exigem avaliação individual e prática supervisionada. O retrato é gerado por IA, os casos e medidas são fictícios, e o modelo de referência não é exame de Lia.

O último atendimento é salvo no navegador pela chave `odontoxiii-simulation-v6`, com `version: 6`, separado da jornada e de sua exportação. Só a sequência válida de etapas concluídas e avançadas é retomada; sair antes de continuar refaz a etapa atual. A v6 inicia um novo percurso de simulação para registros anteriores e preserva jornada, anotações e revisões. Não há contas, backend ou sincronização entre dispositivos.

## Conteúdo e licenças

10 trilhas, 20 aulas, flashcards, questões, casos breves, favoritos, anotações, plano e jornada com exportação/importação.

**Anatomy from 3Dentes by Nate Saindon, CC BY-NC 4.0.**

As malhas nativas têm restrição não comercial, atribuição e limites de resolução. Consulte `assets/MOUTH-SOURCE.md`, `assets/ANATOMY-LICENSE.md` e `assets/REFERENCE-SOURCES.md` no pacote publicado; no projeto local, esses arquivos ficam em `dist/assets/`. Modelos e fotos mantêm suas próprias licenças; a licença do código não as substitui.

## Executar e publicar

Na raiz do projeto local, sirva `dist/` por HTTP:

```sh
python3 -m http.server 8000 --directory dist
```

Abra `http://localhost:8000/#atlas` ou `http://localhost:8000/#simulacao`. Não há dependências de build. O uso do servidor depende das permissões de rede do ambiente.

GitHub Pages publica `main` na raiz de `Hoshii23/odontoxiii`. Esse repositório contém o conteúdo de `dist/`, README e `.nojekyll`, enquanto o projeto local também contém fontes de preparação e testes. Para servir uma cópia do repositório publicado, execute `python3 -m http.server 8000` na sua raiz. Para publicar, crie um commit baseado no HEAD remoto e preserve arquivos não relacionados; o histórico local é diferente. Consulte `CHECKPOINT.md` no projeto local.

## Evidência de verificação

Os testes abaixo passaram na v6. Execute-os na raiz do projeto local, onde existe `tests/`:

```sh
node tests/simulation-flows.cjs
node tests/simulation-ui.cjs
node tests/study-flows.cjs
node tests/render-models.cjs
node tests/capture-mouth.cjs
python3 tests/render-webgl.py
```

- `simulation-flows`: seis casos, quatro alternativas e feedback, ação única, bloqueio de repetição, achados, isolamento, retomada e rejeição de registros de versões anteriores.
- `simulation-ui`: controladores reais em DOM mínimo, ações de um clique, canvas persistente, casos completos, linhas periodontais no prontuário e resumo, painel nativo das duas arcadas e referências.
- `study-flows`: rotas, Atlas, jornada, notas, revisões e cópias de dados.
- `render-models`: alternativa Canvas 2D, geometria, profundidade, enquadramento, controles e descarte.
- `capture-mouth` seguido de `render-webgl`: 28 FDI distintos, duas arcadas, geometria finita e campo isolado; compilação e rasterização dos shaders reais em EGL/Mesa GLES. As seis vistas são gravadas em `.impeccable/review/webgl/`. O replay requer as bibliotecas de sistema EGL/Mesa e Pillow.

A revisão independente confirmou as correções de persistência do periograma e da fronteira de versão 6, repetiu os testes de fluxo e UI e liberou a entrega no escopo dos controladores, DOM mínimo e imagens GLES. As capturas são dos renderizadores, não screenshots do app em navegador. Layout completo, voz nativa, iPad real e abertura efetiva dos iframes externos não foram testados neste ambiente. A referência Instagram não pôde ser acessada; não se afirma fidelidade ao vídeo.
