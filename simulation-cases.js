/* Original fictional teaching cases. Four parallel options and individual rationales. */
(()=>{
'use strict';
const ADA='https://www.ada.org/resources/research/science/evidence-based-dental-research/caries-management-clinical-practice-guidelines/';
const EFP='https://www.efp.org/education/continuing-education/clinical-guidelines/';
const AAO='https://aaoinfo.org/treatments/braces/';
const AAE='https://www.aae.org/specialty/clinical-resources/';
const choice=(title,speech,stem,options,answer,reasons)=>({kind:'choice',title,speech,stem,options,answer,reasons,why:reasons[answer]});
const tool=(title,speech,instrument,target,why,visual)=>({kind:'tool',title,speech,instrument,target,why,visual});
const intake=(caseId)=>{
 const bank={
 carie:choice('Acolhimento e história','Sinto uma fisgada com gelado. Precisa anestesiar logo?','A queixa é sensibilidade ao frio. Antes de planejar anestesia, qual conjunto de informações precisa ser esclarecido?',[
 'Frequência de escovação, consumo de açúcar e uso de dentifrício.',
 'História médica, medicamentos atuais e reações anteriores a anestésicos locais.',
 'Última radiografia, restaurações presentes e quantidade de dentes previamente tratados.',
 'Intensidade da dor, localização percebida e duração de cada episódio.'
 ],1,['Esses fatores ajudam a avaliar o risco de cárie, mas não esclarecem a segurança do plano anestésico.','A revisão médica antecede o plano anestésico. Neste caso, Lia nega doenças relevantes, medicamentos e reações prévias; esses dados precisam ser confirmados em cada atendimento.','Os registros odontológicos ajudam no diagnóstico, mas não substituem a revisão médica antes da anestesia.','Caracterizar a dor é necessário ao diagnóstico; a pergunta pede os dados de segurança antes do plano anestésico.']),
 restauracao:choice('Entenda a queixa','A ponta quebrou ontem. Não sei se o dente também trincou.','Qual pergunta ajuda mais a investigar comprometimento além do pequeno defeito visível?',[
 'Quando foi feita a restauração e qual profissional realizou o atendimento?',
 'Qual cor foi escolhida e quanto tempo durou o atendimento anterior?',
 'Há dor ao morder ou soltar, sensibilidade persistente ou trauma recente?',
 'Qual dentifrício utiliza e quantas vezes realiza higiene durante o dia?'
 ],2,['Idade e histórico da restauração são úteis, mas os sintomas mecânicos e térmicos orientam a investigação de comprometimento adicional.','Cor e duração da consulta anterior não esclarecem sintomas compatíveis com trinca ou envolvimento pulpar.','Dor à carga ou à liberação, sintomas térmicos persistentes e trauma orientam a investigação de trinca e comprometimento pulpar; nenhum achado isolado fecha o diagnóstico.','Higiene integra a avaliação de risco, mas não é a informação mais discriminativa para a pergunta apresentada.']),
 aparelho:choice('Conheça a expectativa','Quero alinhar os dentes, mas às vezes a gengiva sangra.','Qual informação acrescenta mais ao planejamento inicial diante dessa queixa?',[
 'Histórico de sangramento, rotina diária de higiene e tratamentos periodontais anteriores.',
 'Preferência por alinhadores, material dos acessórios e disponibilidade para fotografias clínicas.',
 'Tempo desejado de tratamento, expectativa estética e material de contenção preferido.',
 'Experiência de familiares, indicação de amigos e tipo de escova utilizado.'
 ],0,['O histórico periodontal e a higiene ajudam a definir a avaliação e o preparo antes da movimentação dentária.','Preferências devem ser escutadas, mas não resolvem a suspeita de inflamação periodontal que interfere no planejamento.','Expectativas são relevantes; tipo de contenção e prazo não podem ser definidos antes de avaliar a saúde bucal.','Há informação de higiene nessa opção, mas história periodontal e sangramento são mais diretamente relevantes ao caso.']),
 periodonto:choice('Investigue fatores de risco','Quase não sinto dor, mas vejo sangue ao escovar.','Além do exame periodontal, qual informação mais ajuda a estimar risco e progressão?',[
 'Rotina de higiene, experiência com escovas e consumo diário de alimentos açucarados.',
 'Frequência de sangramento, uso de bochechos e tempo gasto na higiene diária.',
 'Retenção local de biofilme, restaurações desadaptadas e uso de aparelhos durante anos.',
 'Uso de tabaco, diabetes e dentes perdidos por doença periodontal.'
 ],3,['A higiene importa para o controle de biofilme, mas esses dados não substituem fatores associados ao risco e à progressão.','Sangramento e hábitos de higiene são relevantes à avaliação, mas este conjunto não esclarece os modificadores de risco sistêmicos e comportamentais solicitados.','Retenção de biofilme e restaurações desadaptadas são fatores locais relevantes. A pergunta destaca dados que acrescentem informação sobre risco e progressão além do exame periodontal.','Tabagismo, diabetes e histórico de perda por periodontite são informações relevantes à avaliação. Neste caso fictício, Lia nega tabagismo e diabetes; a avaliação completa ainda é necessária.']),
 dor:choice('Faça a triagem','A dor me acordou. Estou preocupada de estar infeccionado.','Qual combinação de sinais exige atenção imediata para possível disseminação da infecção?',[
 'Dor ao frio persistente, sensibilidade ao doce e desconforto ao mastigar.',
 'Escurecimento dental, fratura de restauração e resposta aumentada ao teste térmico.',
 'Edema em progressão, febre e dificuldade para engolir ou para respirar.',
 'Dor espontânea à noite, irradiação para ouvido e resposta ao calor.'
 ],2,['Esses sintomas exigem avaliação odontológica, mas não caracterizam por si sós disseminação com risco sistêmico.','Esses achados ajudam no diagnóstico local; não têm a prioridade dos sinais de comprometimento sistêmico ou via aérea.','Dificuldade para respirar ou engolir com edema progressivo exige avaliação urgente. Lia nega esses sinais neste caso, permitindo prosseguir com a investigação local.','Sintomas pulpares podem ser intensos e requerem cuidado, mas não equivalem aos sinais de disseminação perguntados.']),
 prevencao:choice('Investigue o contexto','A mancha apareceu perto da gengiva e não está doendo.','Qual dado comportamental acrescenta mais à avaliação de risco de cárie?',[
 'Açúcar entre refeições e uso de flúor na rotina de higiene.',
 'Uso de alimentos frios, percepção de dor e histórico de sensibilidade.',
 'Tempo desde o último clareamento e tonalidade desejada para os dentes.',
 'Uso de escova elétrica, rotina de bochecho e preferência por dentifrícios.'
 ],0,['Frequência de açúcares e exposição a fluoretos ajudam a compor o risco, junto de história de doença, saliva e exame.','Temperatura dos alimentos pode provocar sintomas, mas não é o dado mais relevante ao risco de cárie.','Clareamento entra no histórico e no diagnóstico diferencial; não é o principal dado de risco solicitado.','O equipamento e a marca não dizem, sozinhos, se há remoção eficaz de biofilme ou exposição adequada a fluoretos.'])
 };return bank[caseId];
};
const anesthesia=()=>tool('Garanta o conforto antes de intervir','Podemos combinar que eu levanto a mão se incomodar?','anestesia','campo','A ação condensa planejamento, administração e verificação do conforto no caso fictício. Escolha do fármaco, dose, técnica e confirmação clínica do efeito exigem avaliação individual e treinamento supervisionado.','comfort');
const isolation=()=>tool('Prepare o campo','Entendi. Pode continuar.','isolamento','dente','O isolamento controla umidade e protege o campo. A instalação e a técnica foram condensadas neste exercício.','isolated');
const finish=()=>choice('Acompanhamento','Quando eu devo voltar?','O procedimento foi concluído e não há sintomas novos. Qual proposta melhor conecta o atendimento ao controle da doença?',[
 'Programar retorno anual, repetir a radiografia e substituir restaurações com pigmentação.',
 'Agendar polimento mensal, manter a dieta e renovar o material de rotina.',
 'Reavaliar a adaptação em seis meses e concentrar orientações no material utilizado.',
 'Individualizar o retorno por risco, reforçar autocuidado e reavaliar sinais e sintomas.'
 ],3,['Intervalo e exames precisam de indicação; pigmentação isolada não determina substituição.','Polimento frequente e troca de material não controlam os fatores que mantêm a doença.','Reavaliar a restauração é parte do cuidado, mas falta integrar risco e controle dos fatores causais.','O retorno deve considerar risco e resposta ao cuidado. Higiene, dieta e sinais de alerta são discutidos conforme o caso.']);
const cases=[
{id:'carie',name:'Cárie profunda',area:'Dentística',desc:'Interprete os achados e decida a extensão da intervenção.',time:'8–12 min',focus:'molar',complaint:'O gelado provoca uma fisgada que passa rápido.',finding:'Dente 16: lesão cavitada profunda. Resposta ao frio breve e semelhante ao controle; percussão e palpação negativas. Sem dor espontânea. Imagem indicada sem alteração periapical. Há estrutura suficiente para restauração e possibilidade de selamento.',start:'caries',steps:[intake('carie'),
choice('Interprete os testes','A dor passa logo que paro de beber. Isso indica canal?','Com os achados fornecidos, qual interpretação pulpar é mais sustentada?',[
 'Necrose pulpar provável, porque a profundidade indica perda de vitalidade.',
 'Polpa responsiva, com resposta breve e sem sinais suficientes de irreversibilidade.',
 'Pulpite irreversível provável, pela lesão profunda e relato de sensibilidade térmica.',
 'Periodontite apical sintomática, porque a cavitação explica os sinais periapicais.'
],1,['Profundidade não estabelece necrose, e há resposta ao frio. Testes de sensibilidade não medem diretamente a circulação pulpar.','A resposta breve, ausência de dor espontânea e exames periapicais negativos não sustentam pulpite irreversível no cenário descrito; a interpretação integra história, testes e exame.','Uma resposta ao frio não implica dano irreversível. Duração e comparação com controles são essenciais.','O caso informa percussão negativa e ausência de alteração periapical; não fornece os sinais que sustentariam essa hipótese.']),
tool('Inspecione a superfície','Pode olhar. Eu aviso se incomodar.','espelho','dente','O espelho permite explorar uma vista indireta. Relacione a superfície ao prontuário; a malha e a lesão são referências visuais, não exames da paciente.','examined'),
choice('Defina a conduta','É preciso remover toda a dentina alterada?','Lesão profunda, dente vital, restaurável e com selamento viável. Qual estratégia é mais conservadora e coerente com o caso?',[
 'Remoção não seletiva até dentina dura, incluindo a parede pulpar.',
 'Abertura coronária e tratamento endodôntico antes da execução da restauração.',
 'Remoção seletiva próxima à polpa, com periferia apta ao selamento.',
 'Aplicação de fluoreto na cavidade, adiando a restauração por rotina.'
],2,['A busca de dentina dura junto à polpa em uma lesão profunda pode aumentar o risco de exposição pulpar.','Os achados não estabelecem indicação endodôntica. A profundidade isolada não justifica remover uma polpa responsiva.','Em casos selecionados como este, a remoção seletiva preserva tecido próximo à polpa e pode reduzir exposições; a periferia precisa permitir selamento adequado.','A cavitação e a necessidade de selamento diferenciam este caso de uma lesão inicial manejável apenas por medidas não restauradoras.']),anesthesia(),isolation(),
tool('Trabalhe na região da lesão','Vou levantar a mão se sentir desconforto.','escavador','dente','A etapa representa remoção seletiva. A geometria não ensina força, extensão ou consistência tátil da escavação; a decisão de quanto remover depende de avaliação clínica.','prepared'),
tool('Complete a etapa restauradora','Esse material fecha a cavidade?','resina','dente','Adesão, inserção, fotopolimerização, acabamento e avaliação oclusal foram condensados. Siga o protocolo do material e o treinamento da instituição.','restored'),finish()],sources:[['ADA · manejo de cárie',ADA]]},
{id:'restauracao',name:'Restauração fraturada',area:'Dentística',desc:'Compare reparo, substituição e acompanhamento.',time:'7–10 min',focus:'molar',complaint:'Uma pequena borda da restauração quebrou.',finding:'Dente 16: defeito marginal localizado em resina, acessível e retentivo para biofilme. Restante íntegro, sem cárie ativa identificada, sem sintomas pulpares. A avaliação não encontrou trinca dental ou comprometimento generalizado.',start:'fracture',steps:[intake('restauracao'),
tool('Observe o defeito','Percebo uma ponta áspera com a língua.','espelho','dente','Examine margens e extensão. A presença de um defeito não define automaticamente substituição completa.','examined'),
choice('Escolha a intervenção','Será preciso trocar a restauração inteira?','O defeito é localizado, retentivo e acessível; o restante da restauração está adequado. Qual conduta melhor preserva estrutura?',[
 'Reparar o defeito local e preservar a porção clinicamente adequada.',
 'Substituir toda a restauração para obter uniformidade entre os materiais.',
 'Acompanhar sem intervenção local, já que não há sintomas pulpares.',
 'Planejar cobertura total, para reduzir a chance de novas fraturas.'
],0,['Um reparo indicado após avaliação preserva estrutura e a porção adequada da restauração. Técnica e compatibilidade dos materiais devem ser verificadas.','A uniformidade do material, sozinha, não justifica remover uma restauração majoritariamente adequada.','Ausência de dor não resolve um defeito retentivo. O cenário fornece indicação para correção local.','Não há informação de perda estrutural extensa que justifique cobertura total como primeira opção.']),isolation(),
tool('Repare a região indicada','Prefiro preservar o que estiver bom.','resina','dente','O reparo pressupõe preparo de superfície e protocolo adesivo compatíveis; a ação condensa essas etapas.','restored'),
tool('Confira o contato oclusal','Posso fechar a boca?','carbono','dente','A marca é um registro ilustrativo de contato. Sua intensidade isolada não define carga ou quantidade de desgaste.','checked'),finish()],sources:[['FDI · reparo de restaurações','https://www.fdiworlddental.org/repair-restorations'],['ADA · materiais restauradores','https://www.ada.org/resources/ada-library/oral-health-topics/materials-for-direct-restorations']]},
{id:'aparelho',name:'Avaliação para aparelho',area:'Ortodontia',desc:'Relacione saúde periodontal e planejamento ortodôntico.',time:'6–9 min',focus:'arcada',complaint:'Quero alinhar meus dentes. Posso colocar aparelho hoje?',finding:'Apinhamento relatado, biofilme visível e sangramento gengival. Faltam periograma completo, registros e diagnóstico ortodôntico. A arcada exibida é uma referência anatômica e não reproduz o apinhamento fictício.',start:'plaque',steps:[intake('aparelho'),
tool('Examine o arco','Quero entender o que precisa avaliar.','espelho','dente','Avalie dentes, periodonto, oclusão e função e obtenha os registros indicados. O espelho complementa, não substitui, essa avaliação.','examined'),
choice('Estabeleça a sequência','O aparelho pode ajudar a limpar os dentes?','Com inflamação gengival e avaliação periodontal incompleta, qual sequência é mais adequada?',[
 'Instalar bráquetes e corrigir o apinhamento antes de controlar a inflamação.',
 'Avaliar o periodonto, controlar a inflamação e completar o planejamento ortodôntico.',
 'Escolher alinhadores removíveis e iniciar forças leves durante a investigação periodontal.',
 'Solicitar apenas modelos de estudo e instalar contenção até obter alinhamento.'
],1,['A movimentação não substitui controle do biofilme e avaliação periodontal; iniciar sem esses dados antecipa uma etapa.','Saúde periodontal, diagnóstico e planejamento devem orientar o início da movimentação; o caso ainda não preenche essas condições.','Ser removível pode favorecer higiene em algumas situações, mas não elimina a necessidade de avaliação e controle da inflamação.','Modelos não fornecem todos os dados necessários; contenção tem função diferente de um plano de movimentação ativa.']),
tool('Demonstre a higiene','Evito a região que sangra porque fico com medo.','escova','gengiva','Oriente limpeza eficaz e suave, adaptada ao caso, com avaliação do sangramento e reavaliação.','clean'),
choice('Discuta as opções','Alinhador é sempre melhor para mim?','Depois do controle da inflamação, qual informação orienta melhor a escolha do aparelho?',[
 'Preferência estética da paciente e disponibilidade de acessórios da clínica.',
 'Idade cronológica da paciente e intervalo desejado entre as consultas.',
 'Diagnóstico, movimentos necessários e capacidade da paciente de seguir o plano.',
 'Quantidade de dentes apinhados e tipo de contenção escolhido previamente.'
],2,['Preferências importam, mas devem ser combinadas com diagnóstico, necessidades biomecânicas e viabilidade.','Idade e logística não substituem os dados que determinam os movimentos necessários.','A seleção deve integrar necessidades do caso, limites do sistema, colaboração e consentimento; não decorre de uma promessa universal de superioridade.','A contagem isolada de dentes e uma contenção escolhida antes do plano não resolvem o diagnóstico.']),
tool('Explore o componente','Quero conhecer a peça antes de decidir.','bracket','bancada','Bráquete demonstrado na bancada; nenhuma instalação foi realizada. O caso permanece em avaliação e preparo.','planned'),finish()],sources:[['AAO · aparelhos e preparo',AAO]]},
{id:'periodonto',name:'Gengiva e periodonto',area:'Periodontia',desc:'Diferencie os achados e organize uma sequência de cuidado.',time:'7–10 min',focus:'arcada',complaint:'Minha gengiva sangra quando escovo.',finding:'Sangramento à sondagem, perda de inserção interdental em dentes não adjacentes, bolsas de 5–6 mm em alguns sítios e perda óssea correspondente. Outras causas locais de perda de inserção foram investigadas. Medidas são fornecidas no caso; não são obtidas da malha.',start:'plaque',steps:[intake('periodonto'),
tool('Explore o exame periodontal','Não sinto muita dor. Isso pode acontecer mesmo assim?','sonda','gengiva','O exercício apresenta sítios de sondagem e registros fictícios. Não mede resistência, pressão ou profundidade real em tecido.','charted'),
choice('Integre os achados','É só uma gengivite?','Qual achado fornecido distingue este quadro de gengivite em periodonto íntegro?',[
 'Perda de inserção interdental compatível, junto a perda óssea na região.',
 'Sangramento à sondagem em vários sítios, acompanhado de acúmulo de biofilme.',
 'Aumento do volume gengival localizado, associado à dificuldade de higiene interdental.',
 'Ausência de dor durante mastigação, associada à presença de halitose persistente.'
],0,['Perda de inserção e óssea compatíveis, excluindo outras causas, sustentam periodontite. Estágio e grau exigem o conjunto completo de dados.','Sangramento e biofilme também podem ocorrer na gengivite, sem perda de inserção.','Aumento de volume pode ocorrer em inflamação gengival e não estabelece perda de suporte.','Dor e halitose não são os critérios que distinguem perda de suporte periodontal.']),
tool('Trabalhe o controle de biofilme','Quero aprender a limpar essa área.','escova','gengiva','O controle de biofilme e fatores de risco integra a primeira etapa do cuidado periodontal.','hygiene'),
tool('Selecione a instrumentação','O que será feito nos locais mais profundos?','cureta','gengiva','A instrumentação subgengival é parte do tratamento quando indicada. Adaptação, pressão e movimentos precisam de treinamento supervisionado.','clean'),
choice('Reavalie a resposta','Ainda pode sangrar depois do tratamento?','Na reavaliação, persistem bolsas profundas com sangramento, apesar da melhora de higiene. Qual é o próximo raciocínio?',[
 'Manter o mesmo intervalo de suporte sem investigar os sítios residuais.',
 'Prescrever antibiótico sistêmico e adiar intervenção local até a próxima manutenção.',
 'Avaliar os sítios residuais e os fatores associados antes da terapia adicional.',
 'Repetir somente orientação de higiene e considerar a perda de inserção estável.'
],2,['O suporte é necessário, mas sítios residuais ativos exigem reavaliação específica.','Antibiótico não substitui a avaliação e o tratamento local, nem é rotina indiscriminada na periodontite.','A resposta é avaliada por sítio; achados residuais, anatomia e fatores de risco orientam as etapas adicionais e o suporte.','Reforço de higiene é útil, porém não permite presumir estabilidade diante dos achados apresentados.'])],sources:[['EFP · diretrizes periodontais',EFP]]},
{id:'dor',name:'Dor de origem dental',area:'Endodontia',desc:'Compare hipóteses sem se apoiar em um sintoma isolado.',time:'6–9 min',focus:'molar',complaint:'A dor aparece sozinha e me acordou durante a noite.',finding:'Dente 16: dor espontânea, resposta ao frio que persiste por cerca de 40 segundos, controle com resposta breve, percussão negativa. Sem febre, edema ou sinais de disseminação. Diagnóstico depende da integração da história, exames e imagens indicadas.',start:'caries',steps:[intake('dor'),
choice('Localize a origem','Às vezes parece que a dor é no ouvido.','A localização referida é imprecisa. Qual estratégia acrescenta mais segurança à identificação do dente envolvido?',[
 'Integrar história e testes comparativos dos dentes suspeitos, adjacentes e controles.',
 'Priorizar a intensidade relatada e escolher o dente com maior restauração.',
 'Basear a seleção na área apontada e na profundidade radiográfica aparente.',
 'Usar a resposta ao analgésico para identificar o dente responsável pela dor.'
],0,['Comparações e integração dos achados ajudam a evitar tratar o dente errado em casos de dor referida.','Intensidade e tamanho de restauração não localizam a origem com segurança.','Localização apontada e profundidade radiográfica, isoladamente, podem induzir erro de identificação.','Alívio com analgésico não funciona como teste localizador do dente causal.']),
tool('Complete a inspeção','O gelado continua doendo depois que eu paro de beber.','espelho','dente','A inspeção complementa testes e imagem; não substitui avaliação pulpar e periapical.','examined'),
choice('Formule a hipótese','Qual é a interpretação desses testes?','Dor espontânea e resposta térmica prolongada, com percussão negativa e sem edema: qual hipótese é mais compatível?',[
 'Necrose pulpar com abscesso apical agudo e comprometimento dos tecidos adjacentes.',
 'Polpa normal com periodontite apical sintomática associada a trauma oclusal.',
 'Pulpite reversível com tecidos apicais normais e sensibilidade dentinária transitória.',
 'Pulpite irreversível sintomática, sem sinais clínicos de comprometimento apical neste caso.'
],3,['Resposta térmica prolongada e ausência de edema não sustentam a combinação proposta; o diagnóstico não se baseia apenas na intensidade da dor.','Dor espontânea e resposta térmica prolongada não correspondem a polpa normal; a percussão negativa também contraria o quadro apical proposto.','A persistência após o estímulo e a dor espontânea tornam essa hipótese menos compatível com o cenário fornecido.','É a hipótese mais compatível com a combinação descrita. Deve ser confirmada com avaliação completa e diagnóstico diferencial; testes de sensibilidade não são histologia.']),
choice('Planeje o cuidado','O que fazemos a partir daqui?','A hipótese foi confirmada e não há sinais sistêmicos. Qual proposta atende melhor ao quadro?',[
 'Iniciar antibiótico e adiar a intervenção local até cessarem os sintomas.',
 'Avaliar restaurabilidade e discutir tratamento local, analgesia e encaminhamento quando necessário.',
 'Acompanhar apenas a resposta térmica, mantendo o retorno anual de rotina.',
 'Indicar exodontia inicial, considerando a dor espontânea como sinal de irrestaurabilidade.'
],1,['Em dor pulpar sem disseminação, antibiótico não substitui o tratamento odontológico indicado.','O plano integra diagnóstico, restaurabilidade, alternativas de tratamento local, alívio da dor e competência/encaminhamento. Modalidades terapêuticas dependem da avaliação individual.','A intensidade e persistência do quadro exigem plano oportuno; não cabe retorno anual como única conduta.','Dor espontânea não determina irrestaurabilidade nem indica exodontia por si só.'])],sources:[['AAE · recursos clínicos',AAE],['ADA · dor e antibióticos','https://www.ada.org/resources/research/science/evidence-based-dental-research/antibiotics-for-dental-pain-and-swelling']]},
{id:'prevencao',name:'Lesão inicial e prevenção',area:'Cariologia',desc:'Avalie atividade e a indicação de manejo não restaurador.',time:'6–9 min',focus:'incisivo',complaint:'Essa mancha branca precisa de restauração?',finding:'Dente 11: lesão opaca em área de estagnação de biofilme, superfície sem cavitação, aspecto e contexto compatíveis com atividade após limpeza e secagem. Diagnósticos diferenciais de alterações de esmalte foram considerados.',start:'white',steps:[intake('prevencao'),
tool('Observe a superfície','Não dói. Só percebi a cor diferente.','espelho','dente','Explore a superfície; o diagnóstico de atividade exige exame clínico limpo e seco, textura, localização e contexto.','examined'),
choice('Escolha o manejo','Dá para tratar sem restaurar?','A superfície é contínua e a área permite controle de biofilme. Qual conduta inicial é mais coerente?',[
 'Preparar a superfície e restaurar a área para reduzir a opacidade.',
 'Observar a aparência sem mudar fatores locais, já que não há cavidade.',
 'Controlar biofilme e risco, usar fluoretos indicados e acompanhar a atividade.',
 'Clarear o esmalte e reavaliar a necessidade de preparo após uniformizar a cor.'
],2,['A ausência de cavitação e a possibilidade de controle favorecem manejo não restaurador; opacidade não é indicação automática de preparo.','Uma lesão ativa pede controle de fatores causais e acompanhamento, mesmo sem cavidade.','O manejo não restaurador pode controlar lesões iniciais. A escolha de medidas depende do risco, atividade e localização.','Uniformizar a cor não aborda o processo de cárie ativo descrito.']),
tool('Pratique a higiene da região','O que eu posso mudar em casa?','escova','dente','Construa uma rotina com higiene eficaz e dentifrício fluoretado, além de discutir frequência de açúcares e fatores de risco.','hygiene'),
tool('Aplique o manejo indicado','A mancha vai sumir imediatamente?','fluor','dente','O verniz representa uma opção profissional quando indicada. A lesão não desaparece em um gesto: atividade e aparência precisam ser acompanhadas ao longo do tempo.','protected'),finish()],sources:[['ADA · manejo não restaurador',ADA]]}
];
// Findings below belong to the fictional case, never to the reference mesh.
const outcomes={
 carie:{
  espelho:{finding:'Pela visão indireta, foi identificada uma área escurecida e cavitada na face oclusal do 16, junto ao sulco distal, antes encoberta na vista direta. A cor sozinha não determina atividade ou profundidade da lesão.',response:'Agora entendi qual parte você estava olhando.'},
  escavador:{finding:'Remoção seletiva simulada: periferia preparada para selamento e tecido próximo à polpa preservado. Nenhuma exposição pulpar ocorreu neste cenário.',response:'Não senti dor durante essa etapa.'},
  resina:{finding:'Cavidade do 16 selada com restauração em resina. Protocolo adesivo, inserção, cura e acabamento foram concluídos na simulação. A verificação oclusal será realizada após a remoção do isolamento.',response:'A região ficou lisa. Vou seguir as orientações.'}
 },
 restauracao:{
  espelho:{finding:'A vista indireta revelou um defeito localizado na margem distopalatina da restauração do 16, com retenção de biofilme. O restante está íntegro. A avaliação complementar não identificou cárie ativa ou trinca dental.',response:'É essa a pontinha áspera que eu sentia.'},
  resina:{finding:'Defeito marginal do 16 reparado. A porção adequada da restauração foi preservada e o contorno local foi refeito após o preparo de superfície e a adesão simulados.',response:'A ponta áspera desapareceu.'},
  carbono:{finding:'Isolamento removido e contatos oclusais registrados no 16. Neste cenário, os contatos estão compatíveis com os dentes vizinhos e não há interferência detectada na avaliação; a intensidade da marca, isoladamente, não mede carga.',response:'Não sinto esse dente tocar antes dos outros.',effect:'checked'}
 },
 aparelho:{
  espelho:{finding:'A inspeção indireta evidenciou biofilme nas faces linguais dos incisivos inferiores e na margem gengival posterior. O sangramento relatado pede avaliação periodontal antes de planejar movimentação.',response:'Eu realmente tenho dificuldade para limpar atrás dos dentes.'},
  escova:{finding:'Higiene demonstrada nas margens gengivais e regiões de difícil acesso. Lia repetiu a orientação com o modelo. A inflamação não desaparece na mesma consulta; foi programada reavaliação.',response:'Vou limpar também a região que sangra, com cuidado.'},
  bracket:{finding:'Bráquete apresentado e sua função no aparelho fixo explicada. Nenhum componente foi instalado: o caso ainda exige avaliação completa e controle periodontal.',response:'Entendi por que precisamos avaliar antes de colocar.',effect:'planned'}
 },
 periodonto:{
  sonda:{finding:'A sondagem registrou bolsas de 5–6 mm e sangramento em sítios selecionados. Há perda de inserção interdental em dentes não adjacentes, compatível com a perda óssea fornecida no caso. O recorte abaixo não é um periograma completo.',response:'Eu não tinha percebido que poderia haver perda de suporte sem dor.',effect:'charted',rows:[['16 · mesiovestibular','6 mm','Sim'],['26 · distovestibular','5 mm','Sim'],['31 · vestibular','3 mm','Não']]},
  escova:{finding:'Biofilme e áreas de difícil higiene discutidos com Lia; escovação e limpeza interdental demonstradas conforme as necessidades do caso. O plano de autocuidado ficou registrado.',response:'Agora sei quais regiões preciso cuidar melhor.'},
  cureta:{finding:'Instrumentação subgengival simulada nos sítios indicados após o exame e o planejamento. Depósitos foram removidos. Cicatrização, bolsas residuais e sangramento serão avaliados no retorno, sem presumir cura imediata.',response:'Vou continuar os cuidados e voltar para reavaliar.'}
 },
 dor:{
  espelho:{finding:'A inspeção indireta do 16 mostrou cavitação oclusal. O espelho não determina o estado da polpa: neste caso, a dor espontânea e a resposta ao frio por cerca de 40 segundos precisam ser integradas aos testes comparativos e aos exames indicados.',response:'A dor continua por um tempo depois do gelado.'}
 },
 prevencao:{
  espelho:{finding:'Após limpeza e secagem simuladas, a vista indireta mostrou área branca opaca na região cervical vestibular do 11, com superfície contínua e sem cavitação. Localização e contexto são compatíveis com atividade; cor isolada não fecha o diagnóstico.',response:'Então a mancha não significa que já existe um buraco?'},
  escova:{finding:'Higiene da margem gengival do 11 demonstrada e rotina com dentifrício fluoretado discutida, junto à frequência de açúcares. Lia identificou a região onde acumulava biofilme.',response:'Vou incluir essa região na minha rotina.'},
  fluor:{finding:'Verniz fluoretado aplicado na lesão inicial do 11 conforme a indicação do caso. A mancha permanece visível; controle da atividade e mudanças de aspecto serão acompanhados nos retornos.',response:'Entendi que a resposta será acompanhada ao longo do tempo.',effect:'protected'}
 }
};
const shared={
 anestesia:{finding:'História médica, consentimento e plano anestésico conferidos. A anestesia local foi realizada na simulação e o conforto foi verificado antes de iniciar o procedimento. Não houve intercorrência no cenário.',response:'A região está anestesiada e estou confortável.',effect:'comfort'},
 isolamento:{finding:'Isolamento absoluto instalado no campo do dente 16. Umidade controlada, tecidos protegidos e acesso ao dente mantido; a integridade do isolamento foi conferida.',response:'Estou confortável. Pode continuar.',effect:'isolated'}
};
const cariesCase=cases.find(c=>c.id==='carie');
cariesCase.steps.splice(cariesCase.steps.length-1,0,tool('Confira os contatos oclusais','Posso fechar a boca agora?','carbono','dente','Após remover o isolamento, os contatos são avaliados com registros e exame clínico. Tamanho ou intensidade da marca não medem a força isoladamente.','checked'));
outcomes.carie.carbono=outcomes.restauracao.carbono;
const initial={
 carie:'Dente 16: sensibilidade breve ao frio, semelhante ao controle, sem dor espontânea. Percussão e palpação negativas. Imagem indicada sugere lesão profunda, sem alteração periapical. Restaurabilidade e possibilidade de selamento foram confirmadas.',
 restauracao:'Dente 16: relato de pequena fratura na restauração, sem sintomas pulpares. O exame de margens será registrado na inspeção.',
 periodonto:'Sangramento gengival relatado e biofilme visível. Os dados de sondagem serão registrados com o instrumento adequado. O exame complementar informa perda óssea e exclui outras causas locais de perda de inserção.'
};
for(const c of cases){
 c.initialFinding=initial[c.id]||c.finding;
 for(const s of c.steps)if(s.kind==='tool'){
  s.outcome={...((outcomes[c.id]||{})[s.instrument]||shared[s.instrument]),effect:s.visual,...((outcomes[c.id]||{})[s.instrument]||shared[s.instrument])};
  if(!s.outcome.finding||!s.outcome.response)throw Error('Resultado ausente: '+c.id+'/'+s.instrument);
 }
}
window.CLINICAL_CASES=cases;
})();
