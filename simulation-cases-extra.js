/* Original fictional teaching cases. Sources checked on 2026-10-23.
 * Research deliverable only: append after the existing clinical case bank.
 * The 2D mouth needs trauma11, fissure16, cervical11 and the selante resource.
 */
(()=>{
'use strict';
const choice=(title,speech,stem,options,answer,reasons)=>({kind:'choice',title,speech,stem,options,answer,reasons,why:reasons[answer]});
const tool=(title,speech,instrument,target,why,visual)=>({kind:'tool',title,speech,instrument,target,why,visual});
const newCases=[
 {
  id:'trauma',name:'Fratura após trauma',area:'Traumatologia',
  desc:'Faça a triagem e proteja a estrutura de um incisivo permanente.',time:'6–9 min',focus:'incisivo',
  complaint:'Bati o dente da frente e uma ponta quebrou.',
  finding:'Caso fictício. Lia, 28 anos, bateu o incisivo superior direito hoje. O 11 permanece no alvéolo, sem deslocamento ou mobilidade aumentada. Fratura de esmalte e dentina, sem exposição pulpar. Resposta breve ao frio; percussão e palpação negativas. Exame dos tecidos moles e radiografia indicada sem outras lesões identificadas. Não há fragmento disponível para colagem.',
  start:'trauma11',
  steps:[
   choice('Priorize a segurança','Foi uma batida pequena. Podemos olhar o dente primeiro?',
    'Qual relato mudaria a prioridade para avaliação médica de emergência após a batida?',[
     'Ponta áspera na língua e incômodo breve ao beber água fria após a batida.',
     'Receio de sorrir em público e preocupação com a aparência da futura restauração.',
     'Perda de consciência, vômito ou visão dupla após uma batida na cabeça ou face.',
     'Fragmento ausente e sensibilidade localizada na borda fraturada durante a ingestão de bebidas e alimentos frios.'
    ],2,[
     'Essas queixas pedem avaliação odontológica, mas não têm a prioridade dos sinais de possível lesão craniana.',
     'A preocupação estética merece acolhimento; primeiro é necessário excluir lesões de maior gravidade.',
     'Esses sinais após trauma de cabeça ou face exigem avaliação médica de emergência. Lia nega esses sinais; também não apresenta dificuldade respiratória ou sangramento persistente.',
     'É necessário investigar o fragmento e possíveis lesões associadas, mas o relato apresentado não tem a prioridade dos sinais neurológicos.'
    ]),
   tool('Inspecione a fratura','A parte amarelada é o nervo?','espelho','dente',
    'O espelho ajuda a visualizar a fratura e as faces palatinas. A avaliação de exposição pulpar, mobilidade, oclusão e lesões associadas depende do exame completo; os testes e a imagem são dados fornecidos pelo caso.','examined'),
   choice('Planeje o cuidado local','Como o gelado incomoda, vou precisar tratar o canal?',
    'Com os exames fornecidos, qual conduta é mais coerente para o 11?',[
     'Proteger a dentina exposta e restaurar a borda, preservando a polpa responsiva deste incisivo.',
     'Tratar o canal antes de restaurar a borda, pela sensibilidade após o trauma.',
     'Desgastar a dentina exposta e observar por alguns dias, aguardando a redução espontânea da sensibilidade.',
     'Estabilizar o incisivo com contenção por precaução, antes de considerar a proteção da dentina exposta.'
    ],0,[
     'O cenário apresenta fratura coronária de esmalte e dentina sem exposição pulpar ou luxação identificada. A dentina precisa de proteção e selamento.',
     'Sensibilidade breve após a fratura não estabelece indicação endodôntica. A decisão depende da avaliação pulpar e do acompanhamento.',
     'A dentina exposta pede proteção; desgaste e espera não são o plano indicado neste cenário.',
     'Não há deslocamento ou mobilidade aumentada que sustentem contenção neste caso. Uma lesão associada mudaria o plano.'
    ]),
   tool('Proteja e reconstrua a borda','Quero recuperar a ponta sem tirar mais dente.','resina','dente',
    'A ação condensa isolamento do campo, proteção da dentina, adesão, restauração, acabamento e avaliação após retirar o isolamento. Não simula técnica manual ou confirma sucesso a longo prazo.','restored'),
   choice('Organize a revisão','Depois de restaurado, já posso esquecer a batida?',
    'A restauração foi concluída e Lia está sem sintomas novos. Qual acompanhamento é adequado?',[
     'Rever apenas se a restauração fraturar ou se surgir novo incômodo na região.',
     'Reavaliar em 6–8 semanas e em um ano, antecipando o retorno diante de alterações.',
     'Encerrar o acompanhamento após confirmar resposta ao frio e adaptação adequada da restauração nesta consulta.',
     'Realizar controles semanais durante um mês e dispensar avaliações posteriores se a restauração permanecer íntegra.'
    ],1,[
     'Acompanhamento após trauma inclui o dente e os tecidos, mesmo quando a restauração parece adequada.',
     'Para esta fratura isolada, a IADT prevê avaliações clínicas e radiográficas em 6–8 semanas e um ano. Dor nova ou persistente, edema, mudança de cor ou mobilidade pedem contato antecipado; lesões associadas exigem outro seguimento.',
     'A resposta atual fornece uma referência, mas não garante estabilidade futura da polpa.',
     'Esse esquema não corresponde ao seguimento da fratura isolada apresentada.'
    ])
  ],
  sources:[
   ['IADT · fraturas e luxações','https://onlinelibrary.wiley.com/doi/full/10.1111/edt.12578'],
   ['NHS · sinais de emergência após trauma','https://www.nhs.uk/nhs-services/dentists/how-to-find-an-nhs-dentist-in-an-emergency/']
  ]
 },
 {
  id:'odontopediatria',name:'Selamento de fissuras',area:'Odontopediatria',
  desc:'Integre risco de cárie, superfície oclusal e controle de umidade.',time:'6–9 min',focus:'molar',
  patientLabel:'Nina · 13 anos',companionLabel:'Lia · 28 anos · responsável acompanhante',
  complaint:'Nina: esse sulco escuro precisa de broca?',
  finding:'Caso fictício. Nina, 13 anos, comparece com Lia, sua responsável acompanhante. O avatar representa Lia. O esquema mostra 28 dentes permanentes e não é uma previsão individual de erupção. Nina tem experiência recente de cárie e dificuldade de higiene nas fissuras do 16. O exame limpo e seco informa alteração inicial não cavitada na superfície oclusal, sem sinais de comprometimento dentinário. A indicação será integrada ao risco e à possibilidade de isolamento.',
  start:'fissure16',
  steps:[
   choice('Planeje com Nina e Lia','Lia: ela já tem idade para receber um selante?',
    'Além do risco de cárie, qual avaliação orienta diretamente o material e a execução do selamento?',[
     'Idade cronológica, troca dos dentes e tempo desde a última aplicação profissional de flúor.',
     'Estágio de erupção, acesso à superfície e possibilidade de manter o campo isolado e seco.',
     'Cor do sulco, formato da fissura e semelhança com os molares do lado oposto.',
     'Preferência pela cor do material, aceitação da adolescente e tempo disponível para realizar a consulta agendada.'
    ],1,[
     'Idade e histórico de flúor contribuem para o contexto; não substituem examinar acesso e controle de umidade.',
     'Erupção, acesso e umidade influenciam a escolha do material e a retenção. A idade, sozinha, não decide se o selamento é possível.',
     'Pigmentação exige interpretação clínica; sua cor não determina profundidade nem a viabilidade do procedimento.',
     'Preferências e tempo são discutidos, mas precisam respeitar as condições clínicas necessárias.'
    ]),
   tool('Examine o primeiro molar','Nina: eu sinto esse sulco com a língua.','espelho','dente',
    'A inspeção da superfície limpa e seca ajuda a avaliar continuidade e acesso. Não pressione uma sonda pontiaguda para tentar prender na fissura; os achados diagnósticos são fornecidos pelo caso.','examined'),
   choice('Escolha a intervenção','Lia: é melhor abrir o sulco para ver o que tem dentro?',
    'O 16 está plenamente erupcionado; o campo pode permanecer seco. Há lesão oclusal inicial não cavitada e risco aumentado. Qual proposta melhor se ajusta ao caso?',[
     'Abrir o sulco escuro e restaurar para confirmar a profundidade da alteração presente.',
     'Usar somente verniz profissional e reservar o selamento para quando a superfície desenvolver uma cavitação.',
     'Aplicar o selante indicado, integrar medidas preventivas e acompanhar a superfície e a retenção.',
     'Acompanhar inicialmente a cor do sulco e manter os hábitos atuais até aparecer dor ou cavitação.'
    ],2,[
     'Pigmentação sem cavitação não justifica abertura diagnóstica automática neste cenário.',
     'Fluoretos integram a prevenção, mas não é necessário esperar cavitação para indicar selante nesta superfície.',
     'Selantes podem prevenir e limitar a progressão de lesões oclusais não cavitadas. Aqui, acesso e isolamento permitem o selante resinoso previsto no plano.',
     'O risco e a lesão inicial pedem um plano ativo de prevenção e acompanhamento; observar apenas a cor é insuficiente.'
    ]),
   tool('Controle a umidade','Nina: posso levantar a mão se ficar desconfortável?','isolamento','dente',
    'Prepare um campo seco e seguro, confirme conforto e acesso. A instalação foi condensada; a escolha da técnica depende da situação clínica.','isolated'),
   tool('Sele as fissuras indicadas','Lia: o material vai curar a cárie na hora?','selante','dente',
    'A ação condensa limpeza, condicionamento, aplicação, cura conforme o material e conferência após remover o isolamento. Selamento não substitui autocuidado ou acompanhamento.','sealed'),
   choice('Combine o acompanhamento','Nina: então não preciso mais cuidar desse dente?',
    'Qual retorno e orientação melhor acompanham o selamento do 16?',[
     'Rever conforme o risco, conferir retenção e manter higiene, flúor e orientação sobre alimentação.',
     'Retornar se o selante escurecer e manter a rotina, considerando suficiente a proteção.',
     'Substituir o selante em cada revisão, mesmo quando o material permanecer íntegro e retido na superfície.',
     'Rever anualmente e considerar a ausência de dor suficiente para manter o material sem avaliação específica.'
    ],0,[
     'O seguimento considera risco, retenção e atividade da lesão. Perdas ou defeitos são avaliados para manutenção quando indicada.',
     'Cor isolada não define falha, e esperar somente mudança estética deixa de avaliar retenção e risco.',
     'Material íntegro não exige substituição automática. A revisão procura necessidade concreta de manutenção.',
     'Intervalo precisa ser individualizado; ausência de dor não avalia retenção nem atividade de cárie.'
    ])
  ],
  sources:[
   ['ADA/AAPD · diretriz de selantes','https://www.aapd.org/research/oral-health-policies--recommendations/pit_and_fissure_sealants'],
   ['ADA · selantes e controle de cárie','https://www.ada.org/resources/ada-library/oral-health-topics/dental-sealants']
  ]
 },
 {
  id:'sensibilidade',name:'Sensibilidade cervical',area:'Dentística',
  desc:'Diferencie a dor breve e investigue fatores associados à dentina exposta.',time:'5–8 min',focus:'incisivo',
  complaint:'O gelado dá uma fisgada perto da gengiva e passa logo.',
  finding:'Caso fictício. Lia, 28 anos, relata dor breve ao frio na região cervical do 11, que cessa ao retirar o estímulo. Sem dor espontânea ou noturna. Exame clínico completo informa pequena exposição cervical de dentina, sem cárie, trinca ou restauração defeituosa identificada; sem perda estrutural que exija restauração. Testes comparativos e exame periodontal não apontam outra origem neste cenário. A imagem esquemática, isoladamente, não permite diagnóstico.',
  start:'cervical11',
  steps:[
   choice('Caracterize a dor','É uma fisgada. Isso é sempre sensibilidade?',
    'Qual mudança no relato exige ampliar a investigação antes de manter a hipótese de hipersensibilidade dentinária?',[
     'Fisgada que termina quando a bebida fria deixa de tocar a área cervical exposta.',
     'Incômodo breve ao toque, percebido na mesma área cervical exposta, que cessa após retirar o estímulo.',
     'Sensação localizada no colo do dente que aparece apenas durante a exposição ao ar frio.',
     'Dor que surge espontaneamente ou que continua depois de retirar o estímulo frio da região.'
    ],3,[
     'Esse padrão pode ser compatível com hipersensibilidade, após excluir outras causas de dor.',
     'Dor breve provocada também pode ocorrer na dentina exposta; o exame e o diagnóstico diferencial continuam necessários.',
     'Um estímulo evaporativo pode provocar a dor breve; isso não determina o diagnóstico isoladamente.',
     'Persistência após o estímulo ou dor espontânea mudam o diagnóstico diferencial e pedem nova avaliação pulpar e de outras causas.'
    ]),
   tool('Inspecione a região cervical','Consigo ver uma faixa perto da gengiva.','espelho','dente',
    'O espelho ajuda a localizar e registrar a área. Não mede intensidade de dor nem exclui doença pulpar; os exames complementares descritos pertencem ao caso fictício.','examined'),
   choice('Investigue os fatores associados','Então a causa foi escovar com força?',
    'Qual abordagem evita atribuir toda a exposição cervical a um único hábito?',[
     'Relacionar ácidos e refluxo, técnica de higiene, recessão gengival e histórico de desgaste dental.',
     'Priorizar a força de escovação e atribuir as alterações restantes à idade cronológica.',
     'Relacionar a localização cervical à sobrecarga oclusal e dispensar a investigação dos hábitos alimentares da paciente.',
     'Priorizar o histórico de clareamento anterior e excluir os demais fatores se esse procedimento tiver ocorrido.'
    ],0,[
     'O quadro pode envolver vários fatores. A história e o exame orientam o que realmente está contribuindo em Lia, sem concluir pela aparência.',
     'A técnica merece avaliação, mas esse raciocínio não examina outros fatores relevantes.',
     'Localização cervical não demonstra, sozinha, uma causa oclusal e não dispensa investigar exposição a ácidos.',
     'Clareamento entra na história quando presente; não exclui outros fatores ou diagnósticos.'
    ]),
   tool('Adapte a higiene','Tenho medo de limpar a parte que dói.','escova','dente',
    'Demonstre higiene eficaz e suave, com escova macia e técnica adaptada. A ação registra orientação; não faz a gengiva recobrir a dentina nem elimina a dor imediatamente.','hygiene'),
   choice('Defina o manejo inicial','É preciso cobrir essa faixa com uma restauração?',
    'Outras causas foram avaliadas e a área não exige restauração estrutural. Qual plano inicial é mais proporcional?',[
     'Restaurar toda a dentina exposta antes de observar a resposta aos novos hábitos.',
     'Rever os fatores associados, orientar dessensibilizante indicado e comparar os sintomas na consulta de retorno.',
     'Indicar tratamento endodôntico caso a primeira utilização do dentifrício não elimine os episódios de sensibilidade ao frio.',
     'Evitar os estímulos frios e manter os hábitos atuais até surgir dor espontânea na região.'
    ],1,[
     'Restauração pode ter indicação em situações específicas, mas não é a primeira etapa obrigatória deste cenário.',
     'O manejo começa com medidas conservadoras e revisão dos fatores associados. Resposta é acompanhada; piora, dor persistente ou espontânea exigem reavaliação.',
     'Ausência de alívio imediato não estabelece doença pulpar ou indicação endodôntica.',
     'Evitar o estímulo pode reduzir episódios, mas não substitui investigação, cuidado dos fatores e acompanhamento.'
    ])
  ],
  sources:[
   ['FDI · hipersensibilidade dentinária','https://fdiworldental.org/dentin-hypersensitivity'],
   ['UAB Dentistry · causas e avaliação da sensibilidade','https://www.uab.edu/dentistry/home/patients/education/patient-education/why-are-my-teeth-suddenly-sensitive']
  ]
 }
];
const outcomes={
 trauma:{
  espelho:{
   finding:'A inspeção mostrou perda incisal de esmalte e dentina no 11, sem ponto de exposição pulpar visível. A face palatina e os tecidos moles foram inspecionados. Os exames complementares fornecidos não identificaram luxação ou fratura radicular.',
   response:'Entendi: a dentina exposta não é a mesma coisa que o nervo exposto.',effect:'examined'
  },
  resina:{
   finding:'Dentina do 11 protegida e borda reconstruída em resina no cenário. Isolamento, adesão, acabamento e avaliação oclusal após a retirada do isolamento foram condensados. O retorno foi planejado para acompanhar sintomas, resposta pulpar e integridade da restauração.',
   response:'A borda ficou lisa. Vou observar os sinais e voltar para a revisão.',effect:'restored'
  }
 },
 odontopediatria:{
  espelho:{
   finding:'Após limpeza e secagem simuladas, o 16 apresenta fissura oclusal retentiva e alteração inicial com superfície contínua. Está plenamente erupcionado, sem tecido recobrindo a área; o isolamento seco é viável. A cor não foi usada isoladamente para definir cárie.',
   response:'Nina: entendi por que olhar só a mancha não resolve.',effect:'examined'
  },
  isolamento:{
   finding:'Campo do 16 isolado, com acesso e controle de umidade conferidos. Nina foi orientada sobre o sinal de pausa e permaneceu confortável.',
   response:'Nina: está confortável. Pode continuar.',effect:'isolated'
  },
  selante:{
   finding:'Fissuras indicadas do 16 seladas conforme o protocolo simulado. Após retirar o isolamento, cobertura, retenção inicial e contatos foram conferidos. A lesão não foi declarada curada; avaliação de retenção e atividade integra o retorno por risco.',
   response:'Lia, acompanhante: vamos manter os cuidados e voltar para conferir o selante.',effect:'sealed'
  }
 },
 sensibilidade:{
  espelho:{
   finding:'A inspeção registrou pequena faixa cervical de dentina exposta no 11. Os exames complementares fornecidos não identificaram cárie, trinca ou defeito restaurador; a resposta provocada relatada é breve. A imagem não confirma, sozinha, hipersensibilidade.',
   response:'Entendi por que você perguntou quanto tempo a dor dura.',effect:'examined'
  },
  escova:{
   finding:'Higiene suave demonstrada para a região cervical do 11. Lia praticou a orientação no modelo. Foram registrados os fatores a investigar, o plano conservador e a necessidade de comparar sintomas no retorno. A exposição permanece visível.',
   response:'Vou limpar com cuidado e avisar se a dor mudar ou continuar depois do gelado.',effect:'hygiene'
  }
 }
};
for(const c of newCases){
 c.initialFinding=c.finding;
 for(const s of c.steps)if(s.kind==='tool')s.outcome={...outcomes[c.id][s.instrument]};
}
window.CLINICAL_CASES.push(...newCases);
})();
