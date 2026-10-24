/* Clinical study simulator. Local fictional cases; no patient data. */
(()=>{
'use strict';
const cases=window.CLINICAL_CASES;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const instruments={
 espelho:['Espelho','Inspeção e visão indireta','mirror'],
 sonda:['Sonda periodontal','Registro do periodonto','probe'],
 anestesia:['Seringa carpule','Planejamento anestésico','syringe'],
 isolamento:['Isolamento','Controle do campo','isolation'],
 escavador:['Escavador','Remoção seletiva','excavator'],
 resina:['Resina composta','Etapa restauradora','composite'],
 carbono:['Papel articular','Verificação oclusal','paper'],
 escova:['Escova dental','Orientação de higiene','brush'],
 cureta:['Cureta periodontal','Instrumentação','curette'],
 selante:['Selante','Selamento de fóssulas e fissuras','composite'],
 fluor:['Verniz fluoretado','Manejo não restaurador','varnish'],
 bracket:['Bráquete','Conhecer o componente','bracket']
};
const symbols={
 mirror:'<path d="m10 31 10-19"/><ellipse cx="24" cy="8" rx="6" ry="4" transform="rotate(-35 24 8)"/><path d="m7 32 3 2 8-15-3-2z"/>',
 probe:'<path d="m10 32 12-21-2-5 4-3m-7 14 3 2m-5 1 3 2m-5 1 3 2"/>',
 syringe:'<path d="m8 29 5-5m-6 2 4 4m4-7 9-12 5 4-9 12zm9-12 3-4m-2-2 5 4m-1 6 6-8m-6 10-5-4"/>',
 isolation:'<rect x="5" y="5" width="27" height="27" rx="3"/><path d="M18 12c-7 0-7 9-4 13 2 3 2-4 4-4s2 7 4 4c3-4 3-13-4-13Z"/>',
 excavator:'<path d="m8 32 16-22 2-4"/><ellipse cx="28" cy="5" rx="3" ry="2"/><path d="m14 21 3 2m-6 2 3 2"/>',
 composite:'<path d="m7 30 5-5m-3-3 7 7m-3-8 10-13 6 5-10 13zm10-13 4-5 6 5-4 5"/>',
 paper:'<path d="M5 10h27v14H5zM8 14h21M8 18h14M24 24l6 8"/>',
 brush:'<path d="m9 32 16-22m-4-3 6 5 6-8-6-3zm3-3 6 5m-3-8 6 5"/>',
 curette:'<path d="m8 32 15-20 1-5c1-5 7-5 7-1m-15 14 3 2m-6 2 3 2"/>',
 varnish:'<path d="M6 18h16v14H6zM8 13h12v5H8zM26 29l6-19m-3-5 5 2-2 7-5-2z"/>',
 bracket:'<rect x="8" y="8" width="22" height="22" rx="3"/><path d="M3 17h32M3 21h32M13 8v7m12-7v7M13 23v7m12-7v7"/>'
};
const instrumentIcon=id=>`<svg viewBox="0 0 38 38" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${symbols[instruments[id][2]]}</svg>`;

const functions={
 espelho:'Permite iluminação, afastamento e visão indireta de superfícies de difícil acesso.',
 sonda:'Registra profundidades de sondagem e sangramento e ajuda na avaliação do nível de inserção; não deve ser usada para perfurar lesões de esmalte.',
 anestesia:'A seringa carpule administra o anestésico local após avaliação, planejamento e consentimento.',
 isolamento:'O isolamento controla a umidade e protege o campo operatório durante o procedimento.',
 escavador:'Remove tecido cariado conforme a estratégia definida; não substitui o diagnóstico nem o selamento.',
 resina:'É um material restaurador que exige indicação, controle do campo e protocolo adesivo.',
 carbono:'Registra contatos oclusais; uma marca isolada não mede a força de mordida.',
 escova:'Permite demonstrar higiene e controle do biofilme, adaptados à pessoa.',
 cureta:'É utilizada para instrumentação periodontal quando indicada, após o exame.',
 selante:'Protege fóssulas e fissuras quando indicado, com controle de umidade e acompanhamento da retenção.',
 fluor:'O verniz fluoretado pode integrar o manejo de cárie conforme risco e atividade.',
 bracket:'Integra aparelhos fixos; sua instalação depende de diagnóstico e planejamento ortodôntico.'
};
class ClinicalSession{
 constructor(id,saved){this.case=cases.find(c=>c.id===id);if(!this.case)throw Error('Caso inexistente');this.step=0;this.solved=false;this.mistakes=0;this.totalMistakes=0;this.history=[];this.visual=this.case.start;this.lastChoice=null;this.seed=Number.isInteger(saved?.seed)?saved.seed:Math.floor(Math.random()*2147483646)+1;
  if(saved?.version===6&&saved.id===id&&Array.isArray(saved.history)){
   // Restore only a valid consecutive prefix of completed steps.
   for(const [i,record]of saved.history.entries()){
    if(i>=this.case.steps.length||!record||record.step!==i||!Number.isInteger(record.mistakes)||record.mistakes<0||record.mistakes>1000)break;
    this.history.push({step:i,mistakes:record.mistakes});this.totalMistakes+=record.mistakes;this.step=i+1;
    this.visual=this.case.steps[i].visual||this.visual;
   }
  }
 }
 get order(){const ids=this.current?.options?.map((_,i)=>i)||[];let seed=(this.seed+this.step*7919)>>>0;for(let i=ids.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[ids[i],ids[j]]=[ids[j],ids[i]];}return ids;}
 get current(){return this.case.steps[this.step];}
 get done(){return this.step>=this.case.steps.length;}
 answer(index){if(this.done||this.solved||this.current.kind!=='choice'||!Number.isInteger(index)||!this.current.options[index])return null;this.lastChoice=index;return this.evaluate(index===this.current.answer);}
 apply(instrument){
  if(this.done||this.solved||this.current.kind!=='tool'||!instruments[instrument])return null;
  const correct=instrument===this.current.instrument,result=this.evaluate(correct);
  return {...result,instrument,outcome:correct?this.current.outcome:null,why:correct?result.why:`${instruments[instrument][0]}: ${functions[instrument]} Nesta etapa, o objetivo é “${this.current.title.toLowerCase()}”. A ação não foi executada; escolha um recurso compatível com esse objetivo.`};
 }
 get records(){const ids=this.history.map(r=>r.step);if(this.solved)ids.push(this.step);return ids.map(i=>this.case.steps[i]).filter(s=>s.kind==='tool').map(s=>({instrument:s.instrument,...s.outcome}));}
 get isolated(){return this.records.some(r=>r.effect==='isolated')&&!this.records.some(r=>['checked','sealed'].includes(r.effect));}
 evaluate(correct){if(correct){this.solved=true;this.visual=this.current.visual||this.visual;}else{this.mistakes++;this.totalMistakes++;}return {correct,why:correct?this.current.why:this.current.kind==='tool'?'Reveja o objetivo desta etapa e a função do instrumento. A ação não foi executada.':this.current.reasons?.[this.lastChoice]||'Releia os achados antes de decidir.'};}
 advance(){if(!this.solved)return false;this.history.push({step:this.step,mistakes:this.mistakes});this.step++;this.solved=false;this.mistakes=0;this.lastChoice=null;return true;}
 serialize(){return {version:6,seed:this.seed,id:this.case.id,history:this.history};}
}
let root=null,session=null,mouthView='overview',feedback=null,listen=null,speaking=false,storageOK=true;
const KEY='odontoxiii-simulation-v6';
function readSaved(){try{const saved=JSON.parse(localStorage.getItem(KEY)||'{}');return saved&&typeof saved==='object'?saved:{};}catch{return {};}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(session.serialize()));storageOK=true;}catch{storageOK=false;}}
function lobby(){const saved=readSaved(),resume=cases.find(c=>c.id===saved.id);return `<div class="sim-lobby"><section class="sim-intro"><div><h1>Entre no consultório.</h1><p>Escute a paciente, investigue os sinais e escolha o próximo passo. Cada decisão tem uma explicação.</p><div class="button-row"><button class="btn" data-sim="random">Sortear um caso ${icon('arrow')}</button>${resume?`<a class="btn secondary" href="#simulacao/${resume.id}">Retomar ${esc(resume.name.toLowerCase())}</a>`:''}</div><p class="sim-small">Casos fictícios para a graduação · sem cronômetro</p></div><img src="assets/paciente.webp" width="1086" height="1448" alt="Lia, personagem virtual da simulação, sentada na cadeira odontológica" class="sim-intro-photo"></section><div class="section-heading"><h2>Qual atendimento você quer praticar?</h2><span class="date-label">${cases.length} situações clínicas</span></div><div class="sim-case-list">${cases.map(c=>`<a href="#simulacao/${c.id}" class="sim-case-row"><span class="sim-case-icon">${icon(c.id==='aparelho'?'tooth':c.id==='prevencao'?'sparkles':'clipboard')}</span><span><strong>${c.name}</strong><span>${c.desc}</span></span><span class="sim-case-meta">${c.area}<small>${c.time}</small></span>${icon('arrow')}</a>`).join('')}</div><p class="sim-small">Você acompanha Lia em cenários independentes. A personagem é gerada por IA; dentes e achados ilustrativos não são exames dela. O simulador exercita raciocínio e sequência de cuidado; técnicas manuais exigem prática supervisionada.</p></div>`;}
function patient(){const step=session.current,c=session.case;return `<section class="sim-patient" aria-label="Conversa com a paciente"><img src="assets/paciente.webp" width="1086" height="1448" alt="${esc(c.companionLabel?'Lia, responsável fictícia de Nina':'Lia, paciente fictícia')}"/><div><div class="sim-patient-name"><strong>${esc(c.patientLabel||'Lia, 28 anos')}</strong><span>${esc(c.companionLabel||'Paciente fictícia')}</span></div><blockquote class="sim-speech">${esc(step.speech)}</blockquote><button class="text-link sim-voice" data-sim="speak" aria-pressed="${speaking}">${speaking?'Parar fala':'Ouvir a paciente'} ${icon('arrow')}</button><span class="sim-voice-status" role="status"></span></div></section>`;}
function periogramHTML(o){return o?.rows?`<table class="sim-periogram"><caption>Recorte do periograma fictício</caption><thead><tr><th scope="col">Sítio</th><th scope="col">Profundidade</th><th scope="col">Sangramento</th></tr></thead><tbody>${o.rows.map(r=>`<tr>${r.map((v,i)=>i?`<td>${esc(v)}</td>`:`<th scope="row">${esc(v)}</th>`).join('')}</tr>`).join('')}</tbody></table>`:'';}
function feedbackHTML(){
 if(!feedback)return '';
 const o=feedback.outcome;
 return `<div class="sim-feedback ${feedback.correct?'is-correct':'needs-review'}" role="status" aria-live="polite" aria-atomic="true" tabindex="-1" id="sim-action-result"><strong>${o?esc(instruments[feedback.instrument][0])+' · ação realizada':feedback.correct?'Etapa concluída.':feedback.instrument?'Reveja a escolha do recurso.':'Reveja sua decisão.'}</strong>${o?`<p class="sim-result-finding">${esc(o.finding)}</p>${periogramHTML(o)}<p class="sim-patient-reply">${session.case.companionLabel?'Resposta':'Lia'}: “${esc(o.response)}”</p>`:''}<p>${esc(feedback.why)}</p></div>`;
}
function trayHTML(){return `<section class="sim-tray" aria-label="Escolha do instrumento"><h3>Qual recurso você usaria agora?</h3><p class="sim-small">Toque uma vez para realizar a ação e receber os achados.</p><div class="sim-instruments">${Object.keys(instruments).map(id=>`<button class="sim-instrument" data-sim="instrument" data-instrument="${id}" ${session.solved?'disabled':''}>${instrumentIcon(id)}<span>${instruments[id][0]}</span></button>`).join('')}</div></section>`;}
function decisionHTML(){const c=session.case,s=session.current;return `<h2 id="sim-step-title" tabindex="-1">${s.title}</h2>${s.kind==='choice'?`<p class="sim-instruction">${esc(s.stem)}</p><div class="sim-answers">${session.order.map(i=>`<button data-sim="answer" data-answer="${i}" class="answer-option ${session.lastChoice===i?(session.solved?'correct':'wrong'):''}" ${session.solved?'disabled':''}>${esc(s.options[i])}</button>`).join('')}</div>`:`<p class="sim-instruction">${esc(s.task||'Escolha o instrumento ou material adequado ao objetivo. A ação será realizada automaticamente no local indicado pelo caso.')}</p>${trayHTML()}`}${feedbackHTML()}${session.solved?`<button class="btn sim-next" data-sim="next">${session.step===c.steps.length-1?'Ver resumo do atendimento':'Continuar atendimento'} ${icon('arrow')}</button>`:''}<details class="sim-chart" ${session.step>0?'open':''}><summary>Prontuário do caso</summary><dl><dt>Queixa principal</dt><dd>“${esc(c.complaint)}”</dd><dt>História e exames prévios</dt><dd>${session.step===0?'Complete o acolhimento para acessar os achados.':esc(c.initialFinding||c.finding)}</dd></dl>${session.records.length?`<h3>Ações e achados registrados</h3><ol class="sim-records">${session.records.map(r=>`<li><strong>${esc(instruments[r.instrument][0])}</strong><p>${esc(r.finding)}</p>${periogramHTML(r)}</li>`).join('')}</ol>`:'<p class="sim-small">Os resultados dos instrumentos aparecerão aqui durante o atendimento.</p>'}</details><a class="sim-reference-link" href="#referencias/${['periodonto','aparelho'].includes(c.id)?'gengiva':c.id==='restauracao'?'restauracao':'carie'}">Consultar fotografias e modelos de referência ↗</a><details class="sim-guide"><summary>Como jogar</summary><p>Responda às decisões clínicas. Nas etapas de procedimento, toque no recurso escolhido: a ação acontece no local previsto e o resultado aparece abaixo da bancada e no prontuário. Uma escolha inadequada recebe uma explicação e permite nova tentativa.</p><p>A boca em 2D mostra os sinais deste caso. Alterne entre a boca completa e a região ampliada. As ações atualizam a imagem: depósitos mineralizados só são removidos com a instrumentação indicada; inflamação e mancha branca precisam de acompanhamento.</p><p>Casos e medidas são fictícios. Ações condensam procedimentos; força, doses e técnica manual exigem prática supervisionada.</p></details><button class="text-link sim-restart" data-sim="restart-prompt">Recomeçar este caso</button><div id="sim-restart-confirm"></div>`;}
function caseHTML(){const c=session.case;return `<a class="text-link back-link" href="#simulacao">${icon('back')} Trocar de caso</a><div class="sim-heading"><div><h1>${c.name}</h1><p>${c.area} · atendimento fictício ${c.patientLabel?'de Nina · retrato da acompanhante':'de Lia'}</p></div><span class="sim-step-count">Etapa ${session.step+1} de ${c.steps.length}</span></div><progress class="sim-progress" value="${session.step}" max="${c.steps.length}" aria-label="Etapas concluídas"></progress><p id="sim-save-status" class="notice" hidden></p><div class="sim-room"><div class="sim-clinical-area"><div id="sim-patient-content">${patient()}</div><section class="sim-mouth" id="sim-mouth-content" aria-label="Representação em duas dimensões da boca do caso">${window.ClinicalMouth2D.render(session,mouthView)}</section></div><aside class="sim-decision" id="sim-decision-content">${decisionHTML()}</aside></div>`;}
function summary(){const c=session.case,first=session.history.filter(r=>r.mistakes===0).length;return `<a class="text-link back-link" href="#simulacao">${icon('back')} Todos os casos</a><section class="sim-summary"><h1>Atendimento revisado.</h1><p>Você concluiu ${c.name.toLowerCase()} ${c.patientLabel?'com Nina e sua acompanhante':'com Lia'}. ${first} de ${c.steps.length} etapas resolvidas na primeira tentativa.</p><p class="sim-summary-response">“Obrigada por me ouvir e explicar cada decisão.”</p><div class="button-row"><button class="btn" data-sim="random">Praticar outro caso ${icon('arrow')}</button><button class="btn secondary" data-sim="restart">Refazer este atendimento</button></div><h2>Seu percurso clínico</h2><ol class="sim-debrief">${c.steps.map((s,i)=>`<li><strong>${s.title}</strong><span>${session.history[i]?.mistakes?'Revista após feedback':'Resolvida na primeira tentativa'}</span><p>${s.outcome?esc(s.outcome.finding):esc(s.why)}</p>${periogramHTML(s.outcome)}</li>`).join('')}</ol><h2>Para aprofundar</h2><ul>${c.sources.map(([name,url])=>`<li><a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a></li>`).join('')}</ul><p class="sim-small">Resultado de uma atividade educacional, sem avaliação de habilidade clínica. Progresso deste atendimento salvo apenas neste navegador.</p></section>`;}
function stopSpeech(){if(window.speechSynthesis)window.speechSynthesis.cancel();speaking=false;}
function speak(){if(speaking){stopSpeech();updateVoice();return;}if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){const status=root.querySelector('.sim-voice-status');if(status)status.textContent='Voz indisponível neste navegador. A fala está no balão.';return;}const utterance=new window.SpeechSynthesisUtterance(session.current.speech);utterance.lang='pt-BR';utterance.rate=.92;const voices=window.speechSynthesis.getVoices();const pt=voices.find(v=>v.lang==='pt-BR')||voices.find(v=>v.lang.startsWith('pt'));if(pt)utterance.voice=pt;utterance.onend=utterance.onerror=()=>{speaking=false;updateVoice();};speaking=true;window.speechSynthesis.speak(utterance);updateVoice();}
function updateVoice(){const el=root?.querySelector('[data-sim="speak"]');if(el){el.textContent=speaking?'Parar fala':'Ouvir a paciente';el.setAttribute('aria-pressed',String(speaking));}}
function refresh(focus=false,stepChanged=false){
 if(session.done){paint();return;}
 root.querySelector('#sim-decision-content').innerHTML=decisionHTML();
 if(stepChanged)root.querySelector('#sim-patient-content').innerHTML=patient();
 root.querySelector('.sim-step-count').textContent=`Etapa ${session.step+1} de ${session.case.steps.length}`;
 root.querySelector('.sim-progress').value=session.step;
 const status=root.querySelector('#sim-save-status');status.hidden=storageOK;status.textContent=storageOK?'':'O navegador não permitiu salvar. O percurso será perdido ao sair.';
 root.querySelector('#sim-mouth-content').innerHTML=window.ClinicalMouth2D.render(session,mouthView);window.OdontoAssistant?.contextChanged();
 if(focus)root.querySelector('#sim-step-title')?.focus({preventScroll:true});
}
function paint(focus=false){
 if(!root)return;
 root.innerHTML=session?(session.done?summary():caseHTML()):lobby();
 if(focus)root.querySelector('#sim-step-title')?.focus({preventScroll:true});
}
function randomCase(){const pool=cases.filter(c=>c.id!==session?.case.id);const c=pool[Math.floor(Math.random()*pool.length)];location.hash='simulacao/'+c.id;}
function click(e){const el=e.target.closest('[data-sim]');if(!el||el.disabled||!root.contains(el))return;const action=el.dataset.sim;
 if(action==='random'){randomCase();return;}if(!session)return;
 if(action==='answer'){feedback=session.answer(Number(el.dataset.answer));refresh();root.querySelector(session.solved?'[data-sim="next"]':`[data-answer="${session.lastChoice}"]`)?.focus({preventScroll:true});}
 if(action==='instrument'){feedback=session.apply(el.dataset.instrument);if(feedback?.correct&&['espelho','isolamento','escavador','resina','fluor'].includes(el.dataset.instrument))mouthView='detail';refresh();const result=root.querySelector('#sim-action-result');result?.focus({preventScroll:true});result?.scrollIntoView?.({block:'nearest',behavior:'auto'});}
 if(action==='next'&&session.advance()){stopSpeech();feedback=null;save();refresh(true,true);if(session.done){const h=root.querySelector('h1');if(h){h.tabIndex=-1;h.focus();}}}
 if(action==='mouth-view'&&['overview','detail'].includes(el.dataset.view)){mouthView=el.dataset.view;root.querySelector('#sim-mouth-content').innerHTML=window.ClinicalMouth2D.render(session,mouthView);root.querySelector(`[data-view="${mouthView}"]`)?.focus({preventScroll:true});}
 if(action==='speak')speak();
 if(action==='restart-prompt'){root.querySelector('#sim-restart-confirm').innerHTML='<p>Apagar o percurso deste caso e voltar ao acolhimento?</p><div class="button-row"><button class="btn danger" data-sim="restart">Recomeçar</button><button class="btn secondary" data-sim="cancel-restart">Continuar aqui</button></div>';root.querySelector('[data-sim="cancel-restart"]')?.focus();}
 if(action==='cancel-restart'){root.querySelector('#sim-restart-confirm').innerHTML='';root.querySelector('[data-sim="restart-prompt"]')?.focus();}
 if(action==='restart'){stopSpeech();session=new ClinicalSession(session.case.id);mouthView=['periodonto','aparelho'].includes(session.case.id)?'overview':'detail';feedback=null;save();paint(true);}
}
window.ClinicalSimulator={
 html:()=>'<div id="clinical-simulator"></div>',
 mount(container,id){this.destroy();root=container;const c=cases.find(c=>c.id===id);session=c?new ClinicalSession(c.id,readSaved()):null;mouthView=c&&!['periodonto','aparelho'].includes(c.id)?'detail':'overview';feedback=null;listen=click;root.addEventListener('click',listen);paint();},
 destroy(){stopSpeech();if(root&&listen){root.removeEventListener('click',listen);}root=null;listen=null;session=null;},
 context(){if(!session)return null;const c=session.case,s=session.current;return {kind:'page',title:'Caso fictício · '+c.name,body:['Paciente: '+(c.patientLabel||'Lia · 28 anos'),c.companionLabel||'','Queixa: '+c.complaint,session.step>0?'Dados fornecidos: '+c.initialFinding:'Anamnese inicial; exames posteriores ainda não liberados.',session.done?'Atendimento concluído.':'Etapa: '+s.title+'\nFala: '+s.speech+'\nObjetivo: '+(s.stem||s.task||s.title),s?.kind==='choice'?'Alternativas visíveis: '+s.options.join(' | '):'',...session.records.map(r=>'Achado registrado: '+r.finding)].filter(Boolean).join('\n').slice(0,6000)};},
 Session:ClinicalSession,instruments
};
})();
