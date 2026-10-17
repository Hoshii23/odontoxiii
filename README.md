# odontoxiii

Web app de estudo para a graduação em odontologia: aulas, atlas 3D manipulável, questões comentadas, flashcards e anotações.

## GitHub Pages

Os arquivos do aplicativo ficam na raiz do repositório. Em **Settings → Pages**, selecione **Deploy from a branch**, branch **main**, pasta **/ (root)** e salve.

Não há instalação ou etapa de build. As rotas usam fragmentos (#atlas, #estudar); os arquivos usam caminhos relativos, compatíveis com um site de projeto do GitHub Pages. O arquivo `.nojekyll` mantém a publicação estática.

A publicação pelo Pages torna o site acessível pela internet. Em um repositório público, o código também fica visível. Anotações e progresso ficam no navegador de cada pessoa, sem envio ao repositório.

## Uso e limites

Abra a página no navegador. No atlas: arraste para girar, use pinça ou botões para ampliar, selecione vistas, corte ou separação de tecidos. As formas anatômicas são esquemáticas e não substituem um atlas de referência ou supervisão clínica. Modelos e conteúdo funcionam sem bibliotecas externas; a fonte web é opcional, com fallback local.

## Verificação da versão

Código de origem local: 1f79c1507fbb9cb5233beb5d842e71d597625b72. Os testes de fluxos, gestos e geometria passaram. Os shaders exatos foram compilados e cinco cenas foram renderizadas em Mesa GLES. Validação em Safari/iPad real permanece pendente.
