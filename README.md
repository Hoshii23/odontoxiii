# odontoxiii — v5

Web app em português para a graduação em odontologia.

**Site:** https://hoshii23.github.io/odontoxiii/

## Anatomia e referências clínicas

O Atlas começa com modelos publicados pela Faculdade de Odontologia da Universidade de Dundee, abertos no visualizador original do Sketchfab. Há primeiro molar superior esquerdo, dentição permanente e incisivo com anatomia endodôntica. O visualizador externo precisa de internet e oferece link direto à fonte.

A biblioteca de referências inclui três fotografias clínicas com autoria, licença, ampliação, perguntas de observação e comentários. São referências independentes da paciente fictícia da simulação. As imagens permanecem sem alterações e vêm dos arquivos originais do Wikimedia Commons.

O laboratório local mantém cortes e camadas esquemáticos. Seus dentes externos vêm de 3Dentes (um indivíduo, CBCT); a arcada conserva 14 dentes distintos em suas posições de origem, e o dente isolado tem orientação aproximada pelo eixo principal. Gengiva e lesões são representações derivadas/ilustrativas. Não há alegação de fotorrealismo ou validação clínica desses modelos.

## Consultório simulado

Em **Praticar → Consultório**, escolha ou sorteie seis casos. Lia apresenta as queixas em texto e, quando disponível, voz do navegador. As decisões têm quatro alternativas, ordem variável por tentativa e explicações específicas. As opções foram revisadas para reduzir pistas de extensão.

- A bancada fica disponível durante todo o atendimento: pegar, trocar e devolver.
- “Girar modelo” controla a vista; “Usar instrumento” move a peça com mouse, toque ou teclado.
- O ponto de contato identifica dente/FDI ou gengiva por interseção com a malha. Soltar fora da superfície não aplica a ação; pinça e cancelamento também não.
- O espelho usa uma reflexão planar da cena, ligada à posição e inclinação, com WebGL. No Canvas 2D alternativo, a ausência de reflexão é informada.
- Há seleção explícita de região para aplicar sem arrastar, além de plano anestésico e bancada de demonstração.
- O modelo e o contexto gráfico persistem ao trocar peças e responder questões.

Anestesia representa planejamento; não há simulação física de dose, punção, resistência ou habilidade manual. O retrato é gerado por IA, os casos são fictícios e a prática supervisionada continua necessária.

O último atendimento é salvo no navegador em registro separado da jornada. A v5 inicia um novo percurso, pois as questões e a interação foram substituídas. Jornada, anotações e revisões anteriores são preservadas. Sem contas, backend ou sincronização entre dispositivos.

## Conteúdo e licenças

10 trilhas, 20 aulas, flashcards, questões, casos breves, favoritos, anotações, plano e jornada com exportação/importação.

**Anatomy from 3Dentes by Nate Saindon, CC BY-NC 4.0.**

As malhas nativas têm restrição não comercial, atribuição e limites de resolução. Veja `assets/ANATOMY-LICENSE.md` e `assets/REFERENCE-SOURCES.md` no pacote publicado (em `dist/assets/` no projeto local). Modelos e fotos mantêm suas próprias licenças; a licença do código não as substitui.

## Executar e publicar

Sirva `dist/` por HTTP; não há dependências de build. GitHub Pages publica `main` na raiz de `Hoshii23/odontoxiii`. O remoto contém o conteúdo de `dist/`, README e `.nojekyll`; seu histórico difere do repositório local. Atualize com commit baseado no HEAD remoto e preserve arquivos não relacionados. Veja `CHECKPOINT.md` no projeto local.

## Evidência de verificação

- `node tests/simulation-flows.cjs`: seis percursos, alternativas/feedback, pistas de tamanho, ordem estável, FDI incorreto, regiões, retomada e dados inválidos.
- `node tests/simulation-ui.cjs`: controladores reais em DOM mínimo, canvas persistente, troca livre de instrumentos, modos, casos completos, referências, zoom de fotos e fallback.
- `node tests/study-flows.cjs`: rotas, atlas, jornada, notas, revisões e cópias de dados.
- `node tests/capture-webgl.cjs` + `python tests/render-webgl.py`: shaders reais, 11 cenas em EGL/Mesa GLES, reflexão, picking, cancelamento, pinça, alinhamento do ponto de contato e 14 dentes distintos.
- `node tests/render-models.cjs`: Canvas 2D, geometria, profundidade, enquadramento, controles e descarte.

As capturas são dos renderizadores, não screenshots do app em navegador. Layout completo, voz nativa, iPad real e abertura efetiva dos iframes externos não foram testados neste ambiente. A revisão independente confirmou os ajustes do código/controladores/renderização. A referência Instagram não pôde ser acessada; não se afirma fidelidade ao vídeo.
