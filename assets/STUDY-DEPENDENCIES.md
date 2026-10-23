# Leitores de documentos do Caderno

## JSZip 3.10.1

Arquivo local `vendor/jszip-3.10.1.min.js`, sem modificações funcionais.
Origem: https://github.com/Stuk/jszip/blob/v3.10.1/dist/jszip.min.js
Licença escolhida para esta distribuição: MIT, entre as opções da fonte.
Texto integral e atribuição em `vendor/JSZIP-LICENSE.txt`; o cabeçalho original
permanece no arquivo. Usado apenas para ler a estrutura ZIP de DOCX no aparelho.

## Mozilla PDF.js 6.4.299

Versão fixada e carregada sob demanda do jsDelivr, apenas ao importar PDF:
https://cdn.jsdelivr.net/npm/pdfjs-dist@6.4.299/legacy/build/pdf.mjs
e seu `pdf.worker.mjs` da mesma versão.
Release oficial conferida: https://github.com/mozilla/pdf.js/releases/tag/v6.4.299
Projeto/licença Apache-2.0: https://github.com/mozilla/pdf.js/blob/master/LICENSE

O leitor extrai texto localmente, com execução de scripts/eval/XFA desabilitada.
Requer internet para carregar a biblioteca e navegador compatível. O arquivo
original não é enviado ao armazenamento ou ao Gemini pelo importador. O CDN
recebe os dados técnicos da requisição de código. PDF.js não faz OCR nesta
integração. Extração PDF real, Safari/iPad e layout ainda não foram testados no
ambiente de desenvolvimento; isso é item de verificação antes do lançamento.
