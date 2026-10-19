/* Original fictional teaching cases. Sources are linked in each debrief. */
(()=>{
'use strict';
const ADA='https://www.ada.org/resources/research/science/evidence-based-dental-research/caries-management-clinical-practice-guidelines/';
const EFP='https://www.efp.org/education/continuing-education/clinical-guidelines/';
const AAO='https://aaoinfo.org/treatments/braces/';
const AAE='https://www.aae.org/specialty/clinical-resources/';
const choice=(title,speech,options,answer,why)=>({kind:'choice',title,speech,options,answer,why});
const tool=(title,speech,instrument,target,why,visual)=>({kind:'tool',title,speech,instrument,target,why,visual});
const intake=()=>choice('Comece pela pessoa','Antes de começar, você pode me explicar o que vai fazer? Fico um pouco ansiosa na cadeira.',[
 'Escutar a queixa, revisar saúde, medicamentos, alergias e combinar um sinal de pausa.',
 'Escolher o material e iniciar para terminar mais rápido.',
 'Pedir que espere em silêncio até acabar o exame.'
],0,'A anamnese e a comunicação vêm antes da intervenção. Neste caso fictício, Lia nega alergias e uso de medicamentos, não relata condições sistêmicas relevantes e concorda com o exame. Isso não dispensa avaliação individual na clínica.');
const anesthesia=()=>tool('Planeje o conforto antes de intervir','Podemos combinar que eu levanto a mão se sentir alguma coisa?','anestesia','campo','História revisada, consentimento e plano de anestesia conferidos. Na clínica, escolha do fármaco, dose, técnica e confirmação do efeito dependem de avaliação e supervisão. Aqui você apenas reconhece a etapa; não há treino de punção.','comfort');
const isolation=()=>tool('Prepare o campo operatório','Tudo bem. Já entendi o que vamos fazer.','isolamento','dente','O isolamento favorece controle de umidade, visibilidade e proteção. A simulação resume a instalação; a técnica real requer treinamento.','isolated');
const finish=()=>choice('Combine o acompanhamento','E o que eu preciso fazer depois da consulta?',[
 'Dizer que nunca mais haverá problema nesse dente.',
 'Orientar higiene e dieta conforme o risco, explicar sinais de alerta e combinar reavaliação.',
 'Orientar retorno apenas se a dor ficar insuportável.'
],1,'O atendimento inclui prevenção, orientação e acompanhamento individualizado. Uma restauração não elimina os fatores que mantêm a doença.');
const cases=[
 {id:'carie',name:'Cárie profunda',area:'Dentística',desc:'Investigue sensibilidade e preserve tecido em uma lesão cavitada.',time:'8–12 min',focus:'molar',complaint:'Sinto uma fisgada quando tomo algo gelado.',finding:'Dente 16: cavidade oclusal com dentina amolecida. Dor provocada breve, sem dor espontânea. Exame e imagem indicados sugerem lesão profunda; testes pulpares e periapicais precisam ser interpretados em conjunto.',start:'caries',steps:[intake(),
 choice('Investigue antes de diagnosticar','A dor passa logo que paro de beber. Isso quer dizer que preciso fazer canal?',[
 'Indicar canal somente pela profundidade aparente.',
 'Investigar duração da dor, examinar, testar sensibilidade e avaliar imagem quando indicada.',
 'Prescrever antibiótico para qualquer sensibilidade.'
 ],1,'Sintomas, testes e exame orientam o diagnóstico pulpar. Profundidade da lesão, isoladamente, não indica tratamento endodôntico.'),
 tool('Examine o dente 16','Pode olhar. Eu aviso se incomodar.','espelho','dente','Observe a cavitação e integre os achados à anamnese. A imagem 3D é uma ilustração do caso, não um exame diagnóstico.','examined'),
 choice('Escolha a abordagem','Você vai precisar tirar muita parte do meu dente?',[
 'Remover dentina até obter superfície dura em toda a região, mesmo junto à polpa.',
 'Restaurar sem discutir controle da doença ou possibilidade de acompanhamento.',
 'Planejar remoção seletiva de tecido cariado e restauração, preservando a polpa quando indicada.'
 ],2,'Para lesões profundas em dentes vitais selecionados, a remoção seletiva pode reduzir a exposição pulpar. As margens e o selamento devem permitir uma restauração adequada. O diagnóstico e a restaurabilidade determinam a conduta.'),anesthesia(),isolation(),
 tool('Faça a etapa de remoção seletiva','Obrigada por explicar. Pode continuar.','escavador','dente','Etapa conceitual concluída: preservar tecido próximo à polpa pode fazer parte do plano. Este gesto não ensina força, extensão ou técnica de escavação.','prepared'),
 tool('Restaure o selamento','Esse material vai fechar a cavidade?','resina','dente','A resina representa a etapa restauradora. Condicionamento, adesão, inserção, fotopolimerização, acabamento e checagem oclusal foram condensados para este exercício; devem ser estudados e executados conforme protocolo.','restored'),finish()],sources:[['ADA · manejo de lesões de cárie',ADA]]},
 {id:'restauracao',name:'Restauração fraturada',area:'Dentística',desc:'Decida entre acompanhamento, reparo e substituição.',time:'7–10 min',focus:'molar',complaint:'Quebrou uma pontinha da minha restauração.',finding:'Dente 16: pequeno defeito localizado em restauração de resina. Restante da restauração íntegro, sem evidência de cárie ativa no caso; sem sintomas pulpares. O exame permite um reparo localizado.',start:'fracture',steps:[intake(),
 tool('Observe a extensão do defeito','Percebi uma pontinha áspera quando passo a língua.','espelho','dente','Avalie margens, extensão do defeito, cárie, contato e oclusão. Nem todo defeito exige substituir toda a restauração.','examined'),
 choice('Quanto intervir?','Vai precisar trocar tudo?',[
 'Considerar reparo localizado após avaliar a restauração e discutir as alternativas.',
 'Remover toda a restauração automaticamente.',
 'Ignorar a fratura sem examinar.'
 ],0,'Neste cenário, o defeito é localizado e o restante está adequado. O reparo preserva estrutura; substituição completa depende de outros achados.'),isolation(),
 tool('Selecione o material para reparo','Se der para preservar o restante, eu prefiro.','resina','dente','Representa um reparo após preparo e adesão apropriados. Compatibilidade de materiais, protocolo adesivo e fotopolimerização precisam ser conferidos na prática.','restored'),
 tool('Verifique o contato oclusal','Posso fechar a boca normalmente?','carbono','dente','A verificação oclusal faz parte da avaliação final. A marcação, sozinha, não define a quantidade de ajuste.','checked'),finish()],sources:[['ADA · reparo de restaurações','https://adanews.ada.org/ada-news/2021/april/ace-panel-report-finds-4-out-of-5-respondents-repair-defective-restorations'],['ADA · materiais restauradores','https://www.ada.org/resources/ada-library/oral-health-topics/materials-for-direct-restorations']]},
 {id:'aparelho',name:'Avaliação para aparelho',area:'Ortodontia',desc:'Conheça a queixa, avalie a saúde bucal e organize o planejamento.',time:'5–8 min',focus:'arcada',complaint:'Quero alinhar os dentes. Já posso colocar aparelho?',finding:'Lia relata dificuldade de higiene entre dentes apinhados. O exame fictício mostra biofilme e sangramento gengival. Ainda faltam registros e avaliação ortodôntica completa.',start:'plaque',steps:[intake(),
 tool('Examine antes de planejar','Queria entender como seria o tratamento.','espelho','dente','A avaliação envolve dentes, periodonto, oclusão, função, expectativas e registros indicados. O arco ilustrado não reproduz o apinhamento desse caso.','examined'),
 choice('Qual é a prioridade?','Dá para colocar o aparelho hoje?',[
 'Colar bráquetes sem avaliar a gengiva ou obter registros.',
 'Controlar a inflamação e completar o diagnóstico e planejamento antes da instalação.',
 'Prometer um prazo exato só olhando o sorriso.'
 ],1,'A saúde bucal e periodontal deve ser avaliada e estabilizada. A escolha do aparelho, biomecânica e duração depende do diagnóstico e planejamento individualizados.'),
 tool('Oriente a higiene','Às vezes sangra e por isso eu evito escovar nessa parte.','escova','gengiva','O sangramento pede avaliação e controle de biofilme. Demonstre higiene suave e eficaz, adapte a limpeza interdental e combine reavaliação.','clean'),
 choice('Explique o aparelho','Depois de cuidar da gengiva, como vamos decidir o aparelho?',[
 'Escolher apenas pela cor dos elásticos.',
 'Escolher a maior força para terminar rapidamente.',
 'Discutir opções a partir do diagnóstico, dos registros e dos objetivos, com consentimento.'
 ],2,'O tratamento movimenta dentes em um sistema biológico. A simulação permite conhecer componentes, mas não prescreve forças, extrações ou um plano ortodôntico.'),
 tool('Conheça o bráquete na bancada','Entendi. Quero conhecer as peças antes de decidir.','bracket','bancada','Bráquete selecionado para demonstração na bancada. Não foi instalado na paciente: o caso permanece na fase de avaliação e preparo.','planned'),finish()],sources:[['AAO · avaliação e preparo para aparelhos',AAO]]},
 {id:'periodonto',name:'Gengiva e periodonto',area:'Periodontia',desc:'Investigue sangramento, registre achados e planeje o controle.',time:'6–9 min',focus:'arcada',complaint:'Minha gengiva sangra quando escovo.',finding:'O periograma fictício registra sangramento à sondagem, perda de inserção e bolsas de 5–6 mm em alguns sítios. A avaliação radiográfica indicada mostra perda óssea correspondente. O conjunto sustenta periodontite; o modelo não reproduz essas medidas.',start:'plaque',steps:[intake(),
 tool('Registre o exame periodontal','Não dói, mas vejo sangue quase todos os dias.','sonda','gengiva','Sondagem, sangramento, recessão e inserção são registrados por sítio. Sangramento isolado não diferencia gengivite de periodontite. As medidas do caso são fornecidas, não obtidas do modelo.','charted'),
 choice('Integre os achados','Isso é só uma gengiva sensível?',[
 'Diferenciar gengivite e periodontite pelos achados de inserção, sondagem e imagem, além do histórico.',
 'Diagnosticar periodontite apenas pela cor da gengiva.',
 'Considerar que ausência de dor significa ausência de doença.'
 ],0,'Perda de inserção e de osso, interpretadas no contexto clínico e excluindo outras causas, sustentam periodontite. Estadiamento e graduação exigem avaliação completa.'),
 tool('Comece pelo controle de biofilme','Quero aprender a limpar sem machucar.','escova','gengiva','Higiene individualizada, controle de fatores de risco e participação da paciente integram a primeira etapa do tratamento periodontal.','hygiene'),
 tool('Selecione a instrumentação indicada','E o que fica por baixo da gengiva?','cureta','gengiva','A instrumentação subgengival integra o tratamento da periodontite quando indicada. A seleção aqui é conceitual: adaptação, pressão, movimentos e analgesia requerem treinamento clínico.','clean'),
 choice('Planeje a reavaliação','Depois da limpeza está resolvido para sempre?',[
 'Garantir cura permanente sem retorno.',
 'Prescrever antibiótico sistêmico para todo caso.',
 'Reavaliar a resposta, os sítios residuais e a higiene; organizar cuidado periodontal de suporte.'
 ],2,'O tratamento periodontal é sequencial e depende da resposta. Instrumentação, reavaliação e manutenção se conectam; antibióticos sistêmicos não são rotina para todos os casos.')],sources:[['EFP · diretrizes de tratamento periodontal',EFP]]},
 {id:'dor',name:'Dor de origem dental',area:'Endodontia',desc:'Escute a história e construa o diagnóstico antes de intervir.',time:'5–7 min',focus:'molar',complaint:'A dor aparece sozinha e me acordou esta noite.',finding:'Dente 16: dor espontânea e resposta persistente ao frio no caso fictício. Sem edema facial, febre ou dificuldade respiratória. Diagnóstico depende da integração de exame, testes, imagem e diagnóstico diferencial.',start:'caries',steps:[intake(),
 choice('Caracterize a dor','Às vezes nem sei dizer qual dente dói.',[
 'Escolher o dente apenas pelo local apontado.',
 'Investigar início, duração, fatores desencadeantes, dor referida e sinais de urgência.',
 'Afirmar que todo dente dolorido precisa ser extraído.'
 ],1,'Dor referida pode dificultar a localização. Edema progressivo, febre e sinais sistêmicos mudam a avaliação; dificuldade para respirar ou engolir exige atendimento de urgência.'),
 tool('Examine com cuidado','O gelado fica doendo por bastante tempo.','espelho','dente','Inspeção não substitui testes de sensibilidade, percussão, palpação e imagem quando indicada. Compare achados e controle a dor conforme avaliação profissional.','examined'),
 choice('Formule uma hipótese, sem atalhos','Então o que pode estar acontecendo?',[
 'Integrar os achados para avaliar inflamação pulpar e discutir tratamento endodôntico quando indicado.',
 'Dar antibiótico como solução para toda dor pulpar sem sinais de disseminação.',
 'Concluir necrose só porque a dor é forte.'
 ],0,'Dor espontânea e persistente provocada podem ser compatíveis com pulpite irreversível sintomática no contexto adequado. O diagnóstico não é feito por um sintoma isolado. Antibiótico não substitui tratamento local quando indicado.'),
 choice('Decida o próximo passo','Eu só quero resolver isso com segurança.',[
 'Abrir o dente sem diagnóstico, consentimento ou isolamento.',
 'Confirmar diagnóstico, restaurabilidade e plano; discutir alternativas e realizar ou encaminhar o tratamento.',
 'Adiar indefinidamente sem orientar sobre piora.'
 ],1,'O exercício termina no planejamento. O procedimento endodôntico depende de diagnóstico completo, consentimento e treinamento supervisionado.')],sources:[['AAE · recursos clínicos de diagnóstico',AAE],['ADA · antibióticos em dor e edema','https://www.ada.org/resources/research/science/evidence-based-dental-research/antibiotics-for-dental-pain-and-swelling']]},
 {id:'prevencao',name:'Lesão inicial e prevenção',area:'Cariologia',desc:'Reconheça quando controlar a doença sem restaurar.',time:'5–7 min',focus:'incisivo',complaint:'Vi uma manchinha branca. Vai precisar de broca?',finding:'Dente 11: mancha branca opaca, superfície contínua sem cavitação, em área de retenção de biofilme. Diagnóstico diferencial e atividade são avaliados clinicamente. No caso, o conjunto é compatível com lesão de cárie inicial ativa.',start:'white',steps:[intake(),
 tool('Observe a superfície','Não dói, só fiquei preocupada com a cor.','espelho','dente','O exame de superfície limpa e seca ajuda a avaliar características da lesão. Cor isolada não estabelece atividade; outras alterações de esmalte entram no diagnóstico diferencial.','examined'),
 choice('A lesão precisa ser restaurada?', 'Dá para cuidar sem furar o dente?',[
 'Restaurar toda mancha branca, mesmo sem cavitação.',
 'Ignorar a lesão porque não há dor.',
 'Priorizar controle do biofilme, orientação alimentar e fluoretos conforme risco e indicação.'
 ],2,'Lesões não cavitadas podem receber manejo não restaurador. A decisão depende da atividade, localização, risco e possibilidade de controle e acompanhamento.'),
 tool('Construa uma rotina de higiene','O que eu posso mudar em casa?','escova','dente','Combine uma rotina viável com dentifrício fluoretado e higiene eficaz. Frequência de açúcares e fatores de risco também precisam ser discutidos.','hygiene'),
 tool('Reconheça uma opção de manejo','E essa mancha vai sumir na hora?','fluor','dente','O verniz fluoretado é uma das opções profissionais em situações indicadas. A imagem não apaga a lesão: controle e remineralização exigem tempo e reavaliação, e a aparência pode persistir.','protected'),finish()],sources:[['ADA · manejo não restaurador de cárie',ADA]]}
];
window.CLINICAL_CASES=cases;
})();
