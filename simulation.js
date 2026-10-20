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
const targets={dente:'Dente em foco',gengiva:'Região gengival',campo:'Plano anestésico',bancada:'Bancada de demonstração'};
class ClinicalSession{
 constructor(id,saved){this.case=cases.find(c=>c.id===id);if(!this.case)throw Error('Caso inexistente');this.step=0;this.solved=false;this.mistakes=0;this.totalMistakes=0;this.history=[];this.visual=this.case.start;this.lastChoice=null;this.seed=Number.isInteger(saved?.seed)?saved.seed:Math.floor(Math.random()*2147483646)+1;
  if(saved?.version===2&&saved.id===id&&Array.isArray(saved.history)){
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
 apply(instrument,target,fdi){if(this.done||this.solved||this.current.kind!=='tool'||!instruments[instrument])return null;return this.evaluate(instrument===this.current.instrument&&target===this.current.target&&(target!=='dente'||!fdi||this.case.focus==='arcada'||fdi===(this.case.focus==='incisivo'?11:16)));}
 evaluate(correct){if(correct){this.solved=true;this.visual=this.current.visual||this.visual;}else{this.mistakes++;this.totalMistakes++;}return {correct,why:correct?this.current.why:this.current.kind==='tool'?'Reveja o objetivo desta etapa e a função do instrumento. A ação não foi executada.':this.current.reasons?.[this.lastChoice]||'Releia os achados antes de decidir.'};}
 advance(){if(!this.solved)return false;this.history.push({step:this.step,mistakes:this.mistakes});this.step++;this.solved=false;this.mistakes=0;this.lastChoice=null;return true;}
 serialize(){return {version:2,seed:this.seed,id:this.case.id,history:this.history};}
}
let root=null,session=null,viewer=null,selected=null,feedback=null,listen=null,speaking=false,storageOK=true,detail=true,region='',interactionMessage='';
const KEY='odontoxiii-simulation-v2';
function readSaved(){try{const saved=JSON.parse(localStorage.getItem(KEY)||'{}');return saved&&typeof saved==='object'?saved:{};}catch{return {};}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(session.serialize()));storageOK=true;}catch{storageOK=false;}}
function controls(){return `<div class="sim-view-controls"><div class="sim-mode" aria-label="Modo de interação"><button data-sim="orbit" aria-pressed="true">Girar modelo</button><button data-sim="use" aria-pressed="false">Usar instrumento</button></div><button class="icon-button" data-sim="zoom-in" aria-label="Aproximar modelo">+</button><button class="icon-button" data-sim="zoom-out" aria-label="Afastar modelo">−</button><button class="text-link" data-sim="view">${detail?'Ver arco':'Ver dente'}</button><button class="text-link" data-sim="reset-view">Restaurar vista</button></div>`;}
function lobby(){const saved=readSaved(),resume=cases.find(c=>c.id===saved.id);return `<div class="sim-lobby"><section class="sim-intro"><div><h1>Entre no consultório.</h1><p>Escute a paciente, investigue os sinais e escolha o próximo passo. Cada decisão tem uma explicação.</p><div class="button-row"><button class="btn" data-sim="random">Sortear um caso ${icon('arrow')}</button>${resume?`<a class="btn secondary" href="#simulacao/${resume.id}">Retomar ${esc(resume.name.toLowerCase())}</a>`:''}</div><p class="sim-small">Casos fictícios para a graduação · sem cronômetro</p></div><img src="assets/paciente.webp" width="1086" height="1448" alt="Lia, personagem virtual da simulação, sentada na cadeira odontológica" class="sim-intro-photo"></section><div class="section-heading"><h2>Qual atendimento você quer praticar?</h2><span class="date-label">6 situações clínicas</span></div><div class="sim-case-list">${cases.map(c=>`<a href="#simulacao/${c.id}" class="sim-case-row"><span class="sim-case-icon">${icon(c.id==='aparelho'?'tooth':c.id==='prevencao'?'sparkles':'clipboard')}</span><span><strong>${c.name}</strong><span>${c.desc}</span></span><span class="sim-case-meta">${c.area}<small>${c.time}</small></span>${icon('arrow')}</a>`).join('')}</div><p class="sim-small">Você acompanha Lia em cenários independentes. A personagem é gerada por IA; dentes e achados ilustrativos não são exames dela. O simulador exercita raciocínio e sequência de cuidado; técnicas manuais exigem prática supervisionada.</p></div>`;}
function patient(){const step=session.current;return `<section class="sim-patient" aria-label="Conversa com a paciente"><img src="assets/paciente.webp" width="1086" height="1448" alt="Lia, paciente fictícia"/><div><div class="sim-patient-name"><strong>Lia, 28 anos</strong><span>Paciente fictícia</span></div><blockquote class="sim-speech">${esc(step.speech)}</blockquote><button class="text-link sim-voice" data-sim="speak" aria-pressed="${speaking}">${speaking?'Parar fala':'Ouvir a paciente'} ${icon('arrow')}</button><span class="sim-voice-status" role="status"></span></div></section>`;}
function feedbackHTML(){return feedback?`<div class="sim-feedback ${feedback.correct?'is-correct':'needs-review'}" role="status"><strong>${feedback.correct?'Etapa concluída.':'Vamos rever essa escolha.'}</strong><p>${esc(feedback.why)}</p></div>`:'';}
function decisionHTML(){const c=session.case,s=session.current;return `<h2 id="sim-step-title" tabindex="-1">${s.title}</h2>${s.kind==='choice'?`<p class="sim-instruction">${esc(s.stem)}</p><div class="sim-answers">${session.order.map(i=>`<button data-sim="answer" data-answer="${i}" class="answer-option ${session.lastChoice===i?(session.solved?'correct':'wrong'):''}" ${session.solved?'disabled':''}>${esc(s.options[i])}</button>`).join('')}</div>`:`<p class="sim-instruction">Selecione um material e use em <strong>${targets[s.target].toLowerCase()}</strong>. Consulte o prontuário para relacionar a ação aos achados.</p>`}${feedbackHTML()}${session.solved?`<button class="btn sim-next" data-sim="next">${session.step===c.steps.length-1?'Ver resumo do atendimento':'Continuar atendimento'} ${icon('arrow')}</button>`:''}<details class="sim-chart" ${session.step>0?'open':''}><summary>Prontuário do caso</summary><dl><dt>Queixa principal</dt><dd>“${esc(c.complaint)}”</dd><dt>Achados fornecidos</dt><dd>${session.step===0?'Complete o acolhimento para acessar os achados.':esc(c.finding)}</dd></dl></details><a class="sim-reference-link" href="#referencias/${['periodonto','aparelho'].includes(c.id)?'gengiva':c.id==='restauracao'?'restauracao':'carie'}">Consultar fotografias e modelos de referência ↗</a><details class="sim-guide"><summary>Como jogar e limites do modelo</summary><p>Pegue um instrumento na bancada. Em “Usar instrumento”, mova a ponta sobre a região e solte para aplicar. Em “Girar modelo”, arraste para mudar a vista. Dois dedos ampliam; Esc devolve o instrumento.</p><p>No teclado, use Tab para escolher a peça; no modelo, mova com as setas e aplique com Enter. Também é possível escolher a região em “Aplicar sem arrastar”. O espelho reflete a cena conforme a posição e a inclinação.</p><p>Dentes de uma tomografia de referência; gengiva derivada e alterações ilustrativas. O exercício treina decisões e seleção de regiões. Não mede força, profundidade, dose anestésica ou habilidade clínica.</p></details><button class="text-link sim-restart" data-sim="restart-prompt">Recomeçar este caso</button><div id="sim-restart-confirm"></div>`;}
function caseHTML(){const c=session.case;return `<a class="text-link back-link" href="#simulacao">${icon('back')} Trocar de caso</a><div class="sim-heading"><div><h1>${c.name}</h1><p>${c.area} · atendimento fictício de Lia</p></div><span class="sim-step-count">Etapa ${session.step+1} de ${c.steps.length}</span></div><progress class="sim-progress" value="${session.step}" max="${c.steps.length}" aria-label="Etapas concluídas"></progress><p id="sim-save-status" class="notice" hidden></p><div class="sim-room"><div class="sim-clinical-area"><div id="sim-patient-content">${patient()}</div><section class="sim-mouth" aria-label="Campo de estudo em três dimensões"><div class="sim-mouth-top"><strong id="sim-model-title">${modelTitle()}</strong><span id="sim-visual-label">${visualLabel()}</span></div><p class="sim-objective"><span>Objetivo atual</span><strong id="sim-objective-title">${session.current.title}</strong></p>${controls()}<div class="sim-canvas-wrap"><canvas id="sim-canvas" tabindex="0" aria-label="Modelo 3D. Escolha girar ou usar instrumento. Setas movem; Enter aplica; Escape devolve."></canvas><span id="sim-contact" class="sim-contact" hidden aria-hidden="true"></span><span id="sim-hit" class="sim-hit" aria-live="off">Explore o modelo</span></div><div id="sim-render-error" class="sim-render-error" hidden>O modelo não abriu neste aparelho. Use o prontuário e a seleção de região para continuar.</div><div class="sim-held"><strong id="sim-held-label">Mãos livres</strong><button class="text-link" data-sim="return" disabled>Devolver instrumento</button></div><p id="sim-interaction" class="sim-interaction" role="status">Arraste para girar. Pegue uma peça na bancada para usar.</p><div id="sim-mirror-controls" class="sim-mirror-controls" hidden><label for="sim-mirror-tilt">Inclinar espelho</label><input id="sim-mirror-tilt" type="range" min="-65" max="65" step="1" value="0"><span id="sim-mirror-value">0°</span><p id="sim-mirror-note">Mova o espelho para a lateral do dente e ajuste o reflexo.</p></div><section class="sim-tray" aria-label="Bancada de instrumentos"><div class="section-heading"><h2>Sua bancada</h2><span class="date-label">Toque para pegar</span></div><div class="sim-instruments">${Object.keys(instruments).map(id=>`<button class="sim-instrument" data-sim="instrument" data-instrument="${id}" aria-pressed="false">${instrumentIcon(id)}<span>${instruments[id][0]}</span></button>`).join('')}</div></section><details class="sim-accessible"><summary>Aplicar sem arrastar · plano anestésico e bancada</summary><div><label for="sim-region">Escolha a região</label><select id="sim-region"><option value="">Selecionar região…</option value="dente">${c.focus==='incisivo'?'Dente 11':c.focus==='arcada'?'Superfície dental':'Dente 16'}</option><option value="gengiva">Região gengival</option><option value="campo">Plano anestésico</option><option value="bancada">Bancada de demonstração</option></select><button class="btn secondary" data-sim="apply" disabled>Aplicar na região</button></div></details></section></div><aside class="sim-decision" id="sim-decision-content">${decisionHTML()}</aside></div><p class="sim-small sim-attribution">Anatomy from <a href="https://github.com/NateSaindon/3Dentes" target="_blank" rel="noopener noreferrer">3Dentes by Nate Saindon</a>, <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC 4.0</a>. Sem escala clínica.</p>`;}
function modelTitle(){return detail?(session.case.focus==='incisivo'?'Dente 11 · incisivo central superior':'Dente 16 · primeiro molar superior'):'Arco superior · 14 dentes distintos';}
function visualLabel(){if(!detail)return 'Anatomia · achados no prontuário';return ({caries:'Lesão ilustrativa',fracture:'Defeito ilustrativo',plaque:'Biofilme ilustrativo',white:'Lesão inicial ilustrativa',examined:'Exame registrado',comfort:'Plano anestésico conferido',isolated:'Campo preparado',prepared:'Etapa seletiva concluída',restored:'Restauração ilustrativa',checked:'Oclusão verificada',clean:'Etapa de controle concluída',hygiene:'Higiene orientada',protected:'Manejo não restaurador',charted:'Periograma registrado',planned:'Componente demonstrado'})[session.visual]||'Anatomia de referência';}
function trayFor(c){return [...new Set(['espelho',...c.steps.filter(s=>s.kind==='tool').map(s=>s.instrument),'sonda','anestesia'])];}
function summary(){const c=session.case,first=session.history.filter(r=>r.mistakes===0).length;return `<a class="text-link back-link" href="#simulacao">${icon('back')} Todos os casos</a><section class="sim-summary"><h1>Atendimento revisado.</h1><p>Você concluiu ${c.name.toLowerCase()} com Lia. ${first} de ${c.steps.length} etapas resolvidas na primeira tentativa.</p><p class="sim-summary-response">“Obrigada por me ouvir e explicar cada decisão.”</p><div class="button-row"><button class="btn" data-sim="random">Praticar outro caso ${icon('arrow')}</button><button class="btn secondary" data-sim="restart">Refazer este atendimento</button></div><h2>Seu percurso clínico</h2><ol class="sim-debrief">${c.steps.map((s,i)=>`<li><strong>${s.title}</strong><span>${session.history[i]?.mistakes?'Revista após feedback':'Resolvida na primeira tentativa'}</span><p>${s.why}</p></li>`).join('')}</ol><h2>Para aprofundar</h2><ul>${c.sources.map(([name,url])=>`<li><a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a></li>`).join('')}</ul><p class="sim-small">Resultado de uma atividade educacional, sem avaliação de habilidade clínica. Progresso deste atendimento salvo apenas neste navegador.</p></section>`;}
function stopSpeech(){if(window.speechSynthesis)window.speechSynthesis.cancel();speaking=false;}
function speak(){if(speaking){stopSpeech();updateVoice();return;}if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){const status=root.querySelector('.sim-voice-status');if(status)status.textContent='Voz indisponível neste navegador. A fala está no balão.';return;}const utterance=new window.SpeechSynthesisUtterance(session.current.speech);utterance.lang='pt-BR';utterance.rate=.92;const voices=window.speechSynthesis.getVoices();const pt=voices.find(v=>v.lang==='pt-BR')||voices.find(v=>v.lang.startsWith('pt'));if(pt)utterance.voice=pt;utterance.onend=utterance.onerror=()=>{speaking=false;updateVoice();};speaking=true;window.speechSynthesis.speak(utterance);updateVoice();}
function updateVoice(){const el=root?.querySelector('[data-sim="speak"]');if(el){el.textContent=speaking?'Parar fala':'Ouvir a paciente';el.setAttribute('aria-pressed',String(speaking));}}
function updateTools(){
 if(!viewer||!root)return;
 for(const b of root.querySelectorAll('[data-sim="instrument"]')){const held=selected===b.dataset.instrument;b.setAttribute('aria-pressed',String(held));b.classList.toggle('selected',held);}
 root.querySelector('[data-sim="return"]').disabled=!selected;
 root.querySelector('[data-sim="use"]').disabled=!selected;
 for(const mode of ['orbit','use'])root.querySelector(`[data-sim="${mode}"]`).setAttribute('aria-pressed',String(viewer.mode===(mode==='orbit'?'orbit':'tool')));
 root.querySelector('#sim-held-label').textContent=selected?instruments[selected][0]+' em mãos':'Mãos livres';
 root.querySelector('#sim-interaction').textContent=interactionMessage||(selected?(viewer.mode==='tool'?'Mova a peça sobre a região e solte para aplicar.':'Arraste para girar. Selecione “Usar instrumento” para voltar à peça.'):'Arraste para girar. Pegue uma peça na bancada para usar.');
 root.querySelector('#sim-mirror-controls').hidden=selected!=='espelho';
 root.querySelector('#sim-mirror-note').textContent=viewer.gl?'Mova o espelho para a lateral do dente e ajuste o reflexo.':'A vista refletida requer WebGL e não está disponível neste aparelho.';
 root.querySelector('[data-sim="apply"]').disabled=!selected||!region;
 root.querySelector('#sim-canvas').classList.toggle('tool-mode',viewer.mode==='tool');const marker=root.querySelector('#sim-contact');marker.hidden=viewer.mode!=='tool';marker.style.left=(viewer.toolPosition?.[0]+1)*50+'%';marker.style.top=(1-viewer.toolPosition?.[1])*50+'%';
}
function refresh(focus=false,stepChanged=false){
 if(session.done){paint();return;}
 root.querySelector('#sim-decision-content').innerHTML=decisionHTML();
 if(stepChanged)root.querySelector('#sim-patient-content').innerHTML=patient();
 root.querySelector('#sim-objective-title').textContent=session.current.title;
 root.querySelector('.sim-step-count').textContent=`Etapa ${session.step+1} de ${session.case.steps.length}`;
 root.querySelector('.sim-progress').value=session.step;
 root.querySelector('#sim-visual-label').textContent=visualLabel();
 const status=root.querySelector('#sim-save-status');status.hidden=storageOK;status.textContent=storageOK?'':'O navegador não permitiu salvar. O percurso será perdido ao sair.';
 viewer.setClinicalState?.(detail?session.case.start:'reference',detail?session.visual:'reference');updateTools();
 if(focus)root.querySelector('#sim-step-title')?.focus({preventScroll:true});
}
function applyAt(hit){
 if(!selected)return;
 if(!hit){interactionMessage='Fora do modelo. Posicione a ponta sobre um dente ou a gengiva; nenhuma ação foi aplicada.';updateTools();return;}
 if(session.current.kind!=='tool'||session.solved){interactionMessage=selected==='espelho'?'Explore e incline o espelho livremente. A decisão clínica continua ao lado.':'Instrumento em mãos. A próxima ação depende da decisão clínica; você pode trocar de peça ou explorar o modelo.';updateTools();return;}
 feedback=session.apply(selected,hit.target,hit.fdi);interactionMessage=feedback?.correct?'Ação registrada. Confira a explicação e continue o atendimento.':`Ação não aplicada. Confira o instrumento, a região e o dente do caso${hit.fdi?' (selecionado: '+hit.fdi+')':''}.`;
 refresh();
}
function paint(focus=false){
 viewer?.destroy();viewer=null;if(!root)return;
 root.innerHTML=session?(session.done?summary():caseHTML()):lobby();
 if(session&&!session.done){const canvas=root.querySelector('#sim-canvas');viewer=new DentalAtlas(canvas,()=>{canvas.hidden=true;root.querySelector('#sim-render-error').hidden=false;});viewer.setModel(detail?(session.case.focus==='incisivo'?'incisivo':'molar'):'arcada');viewer.setView(detail?'perspectiva':'oclusal');if(detail&&session.case.focus!=='incisivo'){viewer.pitch=.8;viewer.yaw=-.3;}
 viewer.setClinicalState?.(detail?session.case.start:'reference',detail?session.visual:'reference');viewer.setInstrument?.(selected);
 viewer.onToolMove=position=>{const marker=root?.querySelector('#sim-contact');if(marker){marker.style.left=(position[0]+1)*50+'%';marker.style.top=(1-position[1])*50+'%';}};viewer.onApply=applyAt;viewer.onHover=hit=>{const label=root?.querySelector('#sim-hit');if(label)label.textContent=hit?(hit.target==='gengiva'?'Região gengival':'Dente '+hit.fdi):'Fora da superfície';};viewer.onCancel=()=>{selected=null;viewer.setInstrument(null);interactionMessage='Instrumento devolvido. Arraste para girar o modelo.';updateTools();};
 updateTools();if(focus)root.querySelector('#sim-step-title')?.focus({preventScroll:true});
 }
}
function randomCase(){const pool=cases.filter(c=>c.id!==session?.case.id);const c=pool[Math.floor(Math.random()*pool.length)];location.hash='simulacao/'+c.id;}
function click(e){const el=e.target.closest('[data-sim]');if(!el||el.disabled||!root.contains(el))return;const action=el.dataset.sim;
 if(action==='random'){randomCase();return;}if(!session)return;
 if(action==='answer'){feedback=session.answer(Number(el.dataset.answer));refresh();root.querySelector(session.solved?'[data-sim="next"]':`[data-answer="${session.lastChoice}"]`)?.focus({preventScroll:true});}
 if(action==='instrument'){selected=el.dataset.instrument;interactionMessage='';viewer.setInstrument(selected);viewer.setMode('tool');updateTools();}
 if(action==='return'){selected=null;viewer.setInstrument(null);interactionMessage='Instrumento devolvido. Arraste para girar o modelo.';updateTools();}
 if(action==='orbit'||action==='use'){viewer.setMode(action==='orbit'?'orbit':'tool');interactionMessage='';updateTools();}
 if(action==='apply')applyAt(region?{target:region,fdi:region==='dente'?(session.case.focus==='incisivo'?11:16):null}:null);
 if(action==='next'&&session.advance()){stopSpeech();feedback=null;interactionMessage='';save();refresh(true,true);if(session.done){const h=root.querySelector('h1');if(h){h.tabIndex=-1;h.focus();}}}
 if(action==='view'){detail=!detail;viewer.setModel(detail?(session.case.focus==='incisivo'?'incisivo':'molar'):'arcada');viewer.setView(detail?'perspectiva':'oclusal');root.querySelector('#sim-model-title').textContent=modelTitle();viewer.setClinicalState?.(detail?session.case.start:'reference',detail?session.visual:'reference');root.querySelector('#sim-visual-label').textContent=visualLabel();el.textContent=detail?'Ver arco':'Ver dente';}
 if(action==='zoom-in')viewer?.changeZoom(-.45);if(action==='zoom-out')viewer?.changeZoom(.45);if(action==='reset-view')viewer?.reset();
 if(action==='speak')speak();
 if(action==='restart-prompt'){root.querySelector('#sim-restart-confirm').innerHTML='<p>Apagar o percurso deste caso e voltar ao acolhimento?</p><div class="button-row"><button class="btn danger" data-sim="restart">Recomeçar</button><button class="btn secondary" data-sim="cancel-restart">Continuar aqui</button></div>';root.querySelector('[data-sim="cancel-restart"]')?.focus();}
 if(action==='cancel-restart'){root.querySelector('#sim-restart-confirm').innerHTML='';root.querySelector('[data-sim="restart-prompt"]')?.focus();}
 if(action==='restart'){stopSpeech();session=new ClinicalSession(session.case.id);selected=null;feedback=null;region='';interactionMessage='';save();paint(true);}
}
function input(e){if(!viewer)return;if(e.target.id==='sim-mirror-tilt'){viewer.setMirrorTilt(Number(e.target.value)*Math.PI/180);root.querySelector('#sim-mirror-value').textContent=e.target.value+'°';}if(e.target.id==='sim-region'){region=e.target.value;updateTools();}}
window.ClinicalSimulator={
 html:()=>'<div id="clinical-simulator"></div>',
 mount(container,id){this.destroy();root=container;const c=cases.find(c=>c.id===id);session=c?new ClinicalSession(c.id,readSaved()):null;selected=null;feedback=null;region='';interactionMessage='';detail=c?.focus!=='arcada';listen=click;root.addEventListener('click',listen);root.addEventListener('input',input);root.addEventListener('change',input);paint();},
 destroy(){stopSpeech();viewer?.destroy();viewer=null;if(root&&listen){root.removeEventListener('click',listen);root.removeEventListener('input',input);root.removeEventListener('change',input);}root=null;listen=null;session=null;},
 Session:ClinicalSession,instruments
};
})();
