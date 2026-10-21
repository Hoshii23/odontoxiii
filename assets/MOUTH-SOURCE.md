# Duas arcadas — fonte do modelo v6

Anatomy from **3Dentes by Nate Saindon, CC BY-NC 4.0**.

- Fonte: https://github.com/NateSaindon/3Dentes
- Arquivos: `assets/cbct/stl/` (28 dentes, coroas de referência e duas gengivas).
- Atribuição original: https://github.com/NateSaindon/3Dentes/blob/main/ATTRIBUTION.md
- Licença: https://creativecommons.org/licenses/by-nc/4.0/
- Uso e redistribuição não comerciais com atribuição. Uso comercial exige permissão do titular.

## O que está representado

Dentição de um adulto, proveniente de uma tomografia de feixe cônico publicada pelo próprio titular com consentimento. São 14 dentes superiores e 14 inferiores, sem terceiros molares. Os primeiros molares inferiores 36 e 46 possuem coroas protéticas; sua forma não deve ser tomada como morfologia natural padrão. A gengiva é uma superfície derivada pelo projeto de origem, não uma segmentação clínica validada de tecido mole.

O modelo mostra dentes e gengiva. Não contém lábios, língua, palato completo ou todas as estruturas da cavidade oral. Não é um exame da paciente fictícia dos casos.

## Adaptações no odontoxiii

`tools/pack-mouth.py` mantém a superfície externa dos dentes do arquivo original. A região radicular foi recortada no limite cervical indicado pelo envelope de coroa do projeto de origem, para exibir os dentes inseridos na gengiva. Esse limite é uma aproximação do modelo, não uma junção histológica medida.

Uma transformação rígida comum e uma escala uniforme preservam as posições relativas entre dentes e arcadas. Os dentes não foram duplicados, espelhados, redimensionados individualmente ou esculpidos pelo app. Vértices coincidentes são reunidos, coordenadas quantizadas e normais de iluminação recalculadas. `mouth-manifest.json` registra fontes, hashes, transformação e contagens.

A abertura da arcada inferior é uma rotação ilustrativa, não uma reprodução da articulação temporomandibular. **0° corresponde à posição do exame**, que apresenta afastamento entre as arcadas; não simula oclusão clínica. O campo de isolamento é uma representação didática própria com o dente 16 e um lençol, sem simular instalação de grampo ou técnica manual.

## Limites de fidelidade

Tomografia, segmentação, redução da malha e recorte cervical limitam detalhes pequenos. Há variação individual e restaurações. A geometria não foi validada clinicamente pelo odontoxiii; não é fotorrealista nem permite medidas, diagnóstico, planejamento ou uma garantia de ausência de defeitos. Use os modelos universitários e a bibliografia para comparar morfologia.

## Pesquisa de alternativas

Foi avaliado `teeth_base`, do MakeHuman, disponibilizado sob CC0, na adaptação de `blechdom/morphazoid`. A renderização tinha as duas arcadas e 32 dentes, mas simplificava demais as superfícies oclusais para este estudo. Esse modelo não está incluído na versão publicada.
