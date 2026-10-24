# odontoxiii — v11

Web app em português para a graduação em odontologia. A v11 acrescenta **Xii**, assistente integrado por um ícone de dente sorridente, e amplia o consultório 2D para nove casos. Login, notas privadas e Gemini real continuam disponíveis para **contas convidadas em teste fechado**. O caderno sem conta permite escrever, importar e baixar rascunhos; o Atlas nativo e a jornada local foram preservados.

**Entrar no teste fechado:** https://hoshii23.github.io/odontoxiii/?v=11.0#conta

**Caderno e IA:** https://hoshii23.github.io/odontoxiii/?v=11.0#caderno

**Consultório 2D:** https://hoshii23.github.io/odontoxiii/?v=11.0#simulacao

**Atlas 3D:** https://hoshii23.github.io/odontoxiii/?v=11.0#atlas

## Caderno pessoal e documentos

Abra **Minha conta** e entre com o e-mail convidado e a senha da sua conta. O acesso exige conta com e-mail confirmado e convite habilitado pelo operador. Cadastro público e recuperação por e-mail estão ocultos; SMTP ainda não foi configurado. O dono criou sua conta com senha pelo Supabase Dashboard. Para definir ou recuperar uma senha nesta fase, fale com quem liberou o acesso; não compartilhe credenciais.

Após entrar, aceite as condições experimentais para salvar até 500 notas privadas, editar com detecção de conflito de versão, exportar o caderno em JSON, copiar explicitamente notas locais anteriores e excluir a conta com senha atual. A jornada e as simulações anteriores permanecem no navegador, separadas da conta; copiar notas locais mantém as originais. Revogar um convite bloqueia novas escritas e IA, mas mantém leitura, exportação e exclusão dos dados próprios. Sessão e rascunhos da conta ficam na aba. Sair limpa a sessão, o rascunho da conta e a conversa; excluir a conta não apaga arquivos baixados ou dados locais.

Em **Minha jornada → Abrir caderno e IA**, também é possível experimentar sem conta: escrever uma anotação, iniciar um caso fictício, importar **PDF, DOCX, TXT ou MD** e baixar o rascunho em texto. O rascunho fica nesta aba em `sessionStorage`; baixe uma cópia antes de fechá-la. A importação preenche o editor para revisão, sem salvar automaticamente. O arquivo original e suas imagens não são enviados ao armazenamento.

Limites de importação: **10 MB**, **100 páginas por PDF** e **100 mil caracteres por nota**. Não há OCR: um PDF digitalizado precisa de extração externa. Tabelas, fórmulas, imagens e diagramação podem se perder. O leitor PDF.js 6.4.299 carrega do jsDelivr sob demanda e requer conexão e navegador compatível; DOCX usa JSZip 3.10.1 distribuído localmente. O formato DOC antigo não é aceito. Confira [dependências e licenças](dist/assets/STUDY-DEPENDENCIES.md) no projeto local; no pacote publicado, consulte `assets/STUDY-DEPENDENCIES.md` e `vendor/JSZIP-LICENSE.txt`.

## Xii — assistente integrado

Abra **Xii** pelo dente sorridente em qualquer página. O painel não modal permite estudar, escrever e conversar lado a lado. Faça perguntas gerais sem notas ou controle separadamente **Página ou caso atual**, **Texto aberto no caderno** e **Buscar no meu caderno**. A página fornece o conteúdo de estudo disponível: aulas, tecido selecionado no Atlas, caso em andamento, casos breves, questões e flashcards. O contexto inclui perguntas e alternativas visíveis, sem respostas ainda não reveladas. A IA não pesquisa na internet nem altera suas notas.

Confira o contexto antes de cada envio. A prévia acompanha a digitação e as operações de abrir, criar, restaurar, importar ou excluir uma anotação, além das mudanças de página; nada é enviado enquanto você digita. Alterar o contexto desmarca a confirmação de envio. Mudar os controles de fontes também reinicia a conversa. Fechar Xii conserva a conversa na memória desta aba; recarregar a página, sair ou mudar de conta a limpa. O backend não salva conversas.

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

O último atendimento é salvo no navegador pela chave `odontoxiii-simulation-v6`, com `version: 6`, separado da jornada, de sua exportação e do novo caderno. A v11 mantém a sequência dos seis casos anteriores e a compatibilidade com históricos v6 válidos, usados para reconstruir a boca em 2D; os três novos casos usam o mesmo contrato de sessão. Só a sequência válida de etapas concluídas e avançadas é retomada; sair antes de continuar refaz a etapa atual. Registros anteriores à versão 6 não são migrados; jornada, anotações e revisões são preservadas. Jornada e simulações não têm sincronização automática entre dispositivos.

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

Os três novos casos são ficção educacional autoral; suas fontes primárias IADT, NHS, ADA/AAPD, FDI e UAB estão em `dist/simulation-cases-extra.js` e nos resumos. Os diagramas clínicos são SVGs gerados em tempo de execução, e o dente sorridente de Xii é um SVG autoral. A v11 não acrescenta imagens rasterizadas ao pacote; o retrato existente mantém sua proveniência. `DESIGN.md` e `.impeccable/design.json` foram preservados byte a byte, sem mudança de sistema visual.

## Executar e publicar

Na raiz do projeto local, sirva `dist/` por HTTP:

```sh
python3 -m http.server 8000 --directory dist
```

Abra `http://localhost:8000/#conta`, `#caderno`, `#simulacao` ou `#atlas`. Não há dependências de build. A configuração atual aponta para o backend do teste fechado; a origem local precisa ser autorizada explicitamente no servidor para chamadas às Edge Functions. A experiência sem conta continua disponível. O uso do servidor depende das permissões de rede do ambiente.

GitHub Pages publica `main` na raiz de `Hoshii23/odontoxiii`. O pacote v11 inclui o conteúdo de `dist/` na raiz, README, `.nojekyll` e `backend/` com código, SQL e instruções sem segredos. No projeto local, há também fontes de preparação e testes. GitHub Pages serve a interface estática; as funções e o banco executam no Supabase. Para servir uma cópia do repositório publicado, execute `python3 -m http.server 8000` na sua raiz. Para publicar, crie um commit baseado no HEAD remoto e preserve arquivos não relacionados; o histórico local é diferente. Consulte `CHECKPOINT.md` no projeto local. Este README não é evidência de deploy.

## Evidência de verificação

Na v11 passaram, na raiz do projeto local:

```sh
node tests/study-assistant.mjs
node tests/study-account.cjs
node tests/assistant-ui.cjs
node tests/study-space.cjs
node tests/simulation-flows.cjs
node tests/clinical-mouth-2d.cjs
node tests/simulation-ui.cjs
node tests/study-flows.cjs
python3 tests/render-mouth-2d.py
```

Os testes de conta/servidor usam HTTP e provedores simulados; os controladores usam harness DOM. A cobertura inclui perguntas sem notas, busca restrita ao dono, fontes de página/rascunho, limites UTF-8, novas tentativas e modelo alternativo, atualização da prévia e os nove casos. Foram rasterizados 34 estados SVG exatos em 700px e 350px com librsvg/Cairo. `.impeccable/review/v11-new-case-diagrams.png` é uma folha de diagramas, **não uma captura do app**; `.impeccable/review/v11-markup/` contém somente HTML sintético.

A integração HTTP real v11 passou em login, salvamento de nota, pergunta geral sem notas e pergunta com nota, rascunho e página. O Gemini identificou o fato exclusivo do rascunho lilás e o conceito da nota com citações; ambas as respostas usaram `gemini-3.5-flash-lite`. A evidência sanitizada está em `.impeccable/review/v11-runtime-evidence.json`. A limpeza confirmou zero usuários e convites sintéticos, sem tabelas/RPCs temporárias ou `pg_net`. O checker temporário está inerte, retorna HTTP 410, v10, com `verify_jwt: true`. `study-assistant` v11 e `study-account` v9 mantêm `verify_jwt: true`.

A integração HTTP v10 permanece como evidência histórica de convite e negação a não convidados, edição e conflito de notas, isolamento entre donos, renovação de sessão e exclusão de conta. `backend/verify-rls.sql` passou integralmente na v9 com usuários sintéticos e rollback. As tentativas do script completo na v10 expiraram no conector (`requestState expired`) ou foram canceladas: **não são PASS**, e não houve nova execução integral na v11. Os testes HTTP são evidência distinta, sem cobrir todos os limites sob concorrência. Os advisors registrados têm três INFO de tabelas privadas com negação por padrão e um WARN de proteção contra senhas vazadas desabilitada; veja a [documentação de correção](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). Não houve alteração paga.

A primeira revisão independente v11 pediu correção da prévia de rascunho desatualizada e do contexto ausente em casos breves, questões e flashcards. Após as correções, a revisão focada emitiu **SHIP**, com ambos resolvidos; esse veredito cobre as duas correções. A revisão inicial examinou código estático, markup, diagramas e evidência HTTP. Lançador/detector foram tentados uma vez e estavam ausentes; não havia ferramentas de controle de navegador JavaScript/cua. Não houve screenshots do app nem homologação em navegador, dois navegadores, iPad real, tecnologia assistiva, SMTP/recuperação ou PDF.js real. Os resultados v9 de importação permanecem históricos: ZIP real com JSZip e DOM XML simulado.

A evidência do Atlas abaixo é histórica da v8; não representa nova execução na v11:

```sh
node tests/capture-interior.cjs
RENDER_DIR=.impeccable/review/interior-webgl RENDER_PREFIX=v8-gl- python3 tests/render-webgl.py
node tests/render-interior.cjs
node tests/render-models.cjs
node tests/capture-webgl.cjs
```

`capture-interior` verificou oito cenas WebGL, seleção real de tecidos, camadas ocultas, corte, deslocamentos separados e gestos. `render-webgl` usou compilação, rasterização e profundidade reais com Mesa; `render-interior` cobriu cinco cenas Canvas, incluindo 354 × 380. `render-models` e `capture-webgl` verificaram a regressão dos modelos e renderizadores. As imagens em `.impeccable/review/interior-webgl/` e `interior-canvas/` são capturas dos renderizadores, sem captura de layout em navegador.

A revisão independente v8 emitiu **SHIP** para geometria, renderizador, controlador e CSS estático após corrigir os núcleos internos, o painel responsivo e a separação de tecidos. Chromium/Playwright não iniciou na verificação anterior; voz nativa e abertura efetiva dos iframes externos não foram validadas. A referência Instagram anterior não pôde ser acessada; não se afirma fidelidade ao vídeo.
