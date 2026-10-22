# odontoxiii — v7

Web app em português para a graduação em odontologia. O consultório agora usa uma boca em 2D: os sinais de cada caso e os efeitos das ações aparecem em diagramas clínicos. O Atlas 3D mantém seus modelos e controles.

**Consultório 2D:** https://hoshii23.github.io/odontoxiii/?v=7.0#simulacao

**Atlas 3D:** https://hoshii23.github.io/odontoxiii/?v=7.0#atlas

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

O último atendimento é salvo no navegador pela chave `odontoxiii-simulation-v6`, com `version: 6`, separado da jornada e de sua exportação. A v7 mantém a sequência dos casos e a compatibilidade com históricos v6 válidos, usados para reconstruir a boca em 2D. Só a sequência válida de etapas concluídas e avançadas é retomada; sair antes de continuar refaz a etapa atual. Registros anteriores à versão 6 não são migrados; jornada, anotações e revisões são preservadas. Não há contas, backend ou sincronização entre dispositivos.

## Atlas 3D e referências clínicas

O Atlas mostra um modelo nativo com 28 dentes distintos: 14 superiores, 14 inferiores e as duas gengivas. É possível girar, ampliar, observar cada arcada e ajustar a abertura. As superfícies externas vêm de 3Dentes, com recorte cervical aproximado pelos envelopes de coroa da fonte e transformação comum às duas arcadas. Não há duplicação ou espelhamento de dentes superiores para criar os inferiores. O Atlas não foi alterado na v7; seu aperfeiçoamento fica para uma próxima etapa.

Os dentes 36 e 46 possuem coroas protéticas, e não há terceiros molares. A abertura inferior é ilustrativa; 0° mantém a posição do exame, com afastamento entre as arcadas, e não representa oclusão clínica. O modelo não inclui lábios, língua ou palato completo. Resolução, segmentação e recorte limitam a fidelidade; não há validação clínica, alegação de fotorrealismo ou garantia de ausência de defeitos. Os modelos de referência não são exames de Lia.

Abaixo das duas arcadas, uma seção expansível reúne modelos da Faculdade de Odontologia da Universidade de Dundee: primeiro molar superior esquerdo, dentição permanente e incisivo com anatomia endodôntica. O Sketchfab abre após ação explícita, requer internet e oferece link direto à fonte. O laboratório local preserva dentes isolados, arco superior, cortes e camadas didáticas.

A biblioteca de referências inclui três fotografias clínicas com autoria, licença, ampliação, perguntas e comentários. São imagens sem alterações, carregadas dos arquivos originais do Wikimedia Commons, independentes da paciente fictícia. A descrição escrita pelo estudante fica apenas na tela.

## Conteúdo e licenças

10 trilhas, 20 aulas, flashcards, questões, casos breves, favoritos, anotações, plano e jornada com exportação/importação.

**Anatomy from 3Dentes by Nate Saindon, CC BY-NC 4.0.**

As malhas nativas têm restrição não comercial, atribuição e limites de resolução. Consulte `assets/MOUTH-SOURCE.md`, `assets/ANATOMY-LICENSE.md` e `assets/REFERENCE-SOURCES.md` no pacote publicado; no projeto local, esses arquivos ficam em `dist/assets/`. Modelos e fotos mantêm suas próprias licenças; a licença do código não as substitui.

Os diagramas clínicos são SVGs gerados em tempo de execução. A v7 não acrescenta imagens rasterizadas ao pacote; o retrato existente mantém sua proveniência.

## Executar e publicar

Na raiz do projeto local, sirva `dist/` por HTTP:

```sh
python3 -m http.server 8000 --directory dist
```

Abra `http://localhost:8000/#simulacao` ou `http://localhost:8000/#atlas`. Não há dependências de build. O uso do servidor depende das permissões de rede do ambiente.

GitHub Pages publica `main` na raiz de `Hoshii23/odontoxiii`. Esse repositório contém o conteúdo de `dist/`, README e `.nojekyll`, enquanto o projeto local também contém fontes de preparação e testes. Para servir uma cópia do repositório publicado, execute `python3 -m http.server 8000` na sua raiz. Para publicar, crie um commit baseado no HEAD remoto e preserve arquivos não relacionados; o histórico local é diferente. Consulte `CHECKPOINT.md` no projeto local.

## Evidência de verificação

Os testes abaixo passaram na v7. Execute-os na raiz do projeto local, onde existe `tests/`:

```sh
node tests/simulation-ui.cjs
node tests/clinical-mouth-2d.cjs
python3 tests/render-mouth-2d.py
node tests/simulation-flows.cjs
node tests/study-flows.cjs
```

- `simulation-ui`: controladores reais em DOM mínimo, seis casos completos, nenhuma alocação 3D na consulta, ações de um clique, vistas, estabilidade da imagem após recurso incorreto e linhas periodontais no prontuário e resumo.
- `clinical-mouth-2d`: 24 estados SVG, invariantes das ações, retomada em cada etapa e regressão dos ângulos dos incisivos no caso de aparelho.
- `render-mouth-2d`: rasterização dos diagramas SVG reais em 700px e 350px via librsvg/Cairo. São imagens do renderizador, sem captura de layout em navegador.
- `simulation-flows`: seis casos, quatro alternativas e feedback, ação única, bloqueio de repetição, achados, isolamento, retomada e fronteira de versão 6.
- `study-flows`: rotas, Atlas, jornada, notas, revisões e cópias de dados.

Verificações de sintaxe e diff também passaram. A revisão independente emitiu **SHIP** para esse escopo após as correções do fallback sálvia do visualizador, da representação do desalinhamento nas duas vistas e do achado desatualizado. Essa conclusão cobre controladores, DOM mínimo e diagramas renderizados. Chromium/Playwright não iniciou neste ambiente; layout em navegador, voz nativa, iPad real, leitor de tela e abertura efetiva dos iframes externos não foram validados. A referência Instagram não pôde ser acessada; não se afirma fidelidade ao vídeo.
