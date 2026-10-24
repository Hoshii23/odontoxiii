/* State-driven clinical diagrams for fictional teaching cases. No measured anatomy. */
(()=>{
'use strict';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const colors={enamel:'#f5f0df',edge:'#8b8170',gum:'#e9a69c',inflamed:'#bb4e55',margin:'#ac3c46',plaque:'#e4ce89',calculus:'#b48a39',cavity:'#594638',dentin:'#d9b77d',repair:'#dbe5df',dam:'#b5d3bc',ink:'#203e34'};
const upper=[17,16,15,14,13,12,11,21,22,23,24,25,26,27];
const lower=[47,46,45,44,43,42,41,31,32,33,34,35,36,37];
const positions=[84,119,156,194,234,277,325,375,423,466,506,544,581,616];
const widths=[28,34,34,35,38,40,46,46,40,38,35,34,34,28];
const isPeriodontal=id=>id==='periodonto'||id==='aparelho';
const incisorTilt=(s,up,fdi)=>s.id==='aparelho'&&!up&&fdi%10<=2?([41,32].includes(fdi)?-9:8):0;

function state(session){
 const id=session.case.id,records=session.records||[],used=new Set(records.map(r=>r.instrument));
 const periodontal=isPeriodontal(id),instrumented=used.has('cureta');
 return {id,focus:['prevencao','trauma','sensibilidade'].includes(id)?11:16,periodontal,inspected:used.has('espelho'),charted:used.has('sonda'),
  calculus:id==='periodonto'&&!instrumented,inflammation:periodontal,plaque:periodontal&&!instrumented,
  hygiene:used.has('escova'),instrumented,isolated:!!session.isolated,
  prepared:used.has('escavador'),restored:used.has('resina'),checked:used.has('carbono'),
  trauma:id==='trauma',cervical:id==='sensibilidade',fissure:id==='odontopediatria',sealed:used.has('selante'),whiteSpot:id==='prevencao',fluoride:used.has('fluor'),bracketDemo:used.has('bracket'),
  comfort:used.has('anestesia'),lastAction:records.at(-1)?.instrument||null};
}

function description(s){
 if(s.trauma)return s.restored?'Borda do 11 reconstruída; dentina protegida. O trauma precisa de acompanhamento pulpar e da integridade da restauração.':'Fratura incisal de esmalte e dentina no 11, sem exposição pulpar neste cenário. O desenho não determina lesões associadas.';
 if(s.cervical)return 'Pequena faixa cervical de dentina exposta no 11. Orientação de higiene não recobre a área nem elimina a sensibilidade imediatamente.';
 if(s.fissure)return s.sealed?'Fissuras do 16 seladas; campo removido e retenção inicial conferida. O retorno avalia retenção e atividade da lesão.':'Fissura oclusal do 16 com alteração inicial não cavitada. O desenho é esquemático; a cor sozinha não define o diagnóstico.';
 if(s.id==='periodonto')return s.instrumented?'Depósitos removidos nos sítios tratados. Gengiva ainda inflamada; a resposta será avaliada no retorno.':s.charted?'Depósitos mineralizados e margem gengival avermelhada. Os pontos assinalados correspondem aos sítios de sondagem do caso.':'Depósitos amarelados junto à margem gengival, sobretudo nos incisivos inferiores, e gengiva avermelhada.';
 if(s.id==='aparelho')return 'Incisivos inferiores desalinhados, biofilme junto à margem e gengiva avermelhada. A orientação de higiene não representa cicatrização imediata.';
 if(s.id==='prevencao')return s.fluoride?'Verniz aplicado no 11. A área branca continua visível; atividade e aspecto serão reavaliados.':'Área branca junto à gengiva do 11, sem perda de continuidade da superfície.';
 if(s.restored)return s.checked?'Restauração do 16 concluída e isolamento removido. Marcas representam os contatos registrados no caso.':'Restauração do 16 concluída. O campo permanece isolado até a verificação oclusal.';
 if(s.prepared)return 'Remoção seletiva no 16: periferia preparada para selamento, com tecido próximo à polpa preservado neste cenário.';
 if(s.id==='restauracao')return 'Restauração do 16 com pequena perda na margem. A inspeção amplia a região distopalatina.';
 return s.id==='dor'?'Cavitação oclusal no 16. A imagem, sozinha, não determina o estado pulpar.':'Área escurecida e cavitada na superfície oclusal do 16. A extensão é interpretada com os demais exames do caso.';
}

function status(s){
 if(s.trauma&&s.restored)return 'Dentina protegida · borda restaurada';
 if(s.sealed)return 'Selante conferido · acompanhamento por risco';
 if(s.isolated)return 'Campo isolado · dente 16';
 if(s.checked)return 'Isolamento removido · contatos registrados';
 if(s.instrumented)return 'Depósitos removidos · aguarde a cicatrização';
 if(s.fluoride)return 'Verniz aplicado · lesão em acompanhamento';
 if(s.bracketDemo)return 'Componente demonstrado · aparelho não instalado';
 if(s.hygiene)return 'Higiene orientada · reavaliação necessária';
 if(s.charted)return 'Sondagem registrada no prontuário';
 if(s.inspected)return 'Inspeção realizada · veja a região ampliada';
 if(s.comfort)return 'Conforto verificado antes do procedimento';
 return 'Aspecto inicial · observe antes de decidir';
}

function toothPath(w,h,type){
 if(type===3)return `M${-w/2} 0 Q0 -5 ${w/2} 0 L${w*.43} ${h*.65} Q${w*.28} ${h*.88} 0 ${h} Q${-w*.28} ${h*.88} ${-w*.43} ${h*.65}Z`;
 return `M${-w/2} 2 Q${-w*.46} -5 0 -3 Q${w*.46} -5 ${w/2} 2 L${w*.44} ${h-9} Q${w*.39} ${h+1} 0 ${h} Q${-w*.39} ${h+1} ${-w*.44} ${h-9}Z`;
}

function tooth(fdi,i,up,s){
 const x=positions[i],distance=Math.abs(i-6.5),w=widths[i],type=fdi%10;
 const h=(up?66:58)-(distance>4?14:distance>2?4:0);
 const y=up?114+distance*2.4:308-distance*2.4;
 const tilt=incisorTilt(s,up,fdi);
 const active=!s.periodontal&&fdi===s.focus;
 const deposit=s.calculus&&!up&&type<=3;
 const plaque=s.plaque&&(type<=3||type===6);
 const sign=up?1:-1;
 const shape=active&&s.trauma&&!s.restored?`M${-w/2} 0Q0 -5 ${w/2} 0L${w*.43} ${h*.65}Q${w*.28} ${h*.88} 0 ${h}L${-w*.12} ${h*.78}L${-w*.4} ${h*.72}L${-w*.43} ${h*.65}Z`:toothPath(w,h,type);
 const cervical=`M${-w*.44} 3 Q0 -3 ${w*.44} 3`;
 let marks='';
 if(active&&s.trauma)marks+=s.restored?`<path d="M${-w*.4} ${h*.7}L${-w*.1} ${h*.76}L0 ${h}Q${-w*.28} ${h*.88} ${-w*.4} ${h*.7}Z" fill="${colors.repair}" stroke="#77988a" data-sign="restoration"/>`:`<path d="M${-w*.35} ${h*.63}L${-w*.08} ${h*.72}L${-w*.12} ${h*.78}L${-w*.4} ${h*.72}Z" fill="${colors.dentin}" data-sign="fracture"/>`;
 if(active&&s.cervical)marks+='<path d="M-16 6Q0 12 16 6L15 17Q0 22-15 17Z" fill="#d9b77d" stroke="#ac905f" stroke-width=".7" data-sign="cervical-dentin"/>';
 if(active&&s.fissure)marks+=`<path d="M-9 20L0 31 8 22M0 31L-3 41" fill="none" stroke="${s.sealed?'#77988a':'#a99c82'}" stroke-width="${s.sealed?4:2}" data-sign="${s.sealed?'sealant':'noncavitated-fissure'}"/>`;
 if(plaque)marks+=`<path d="M${-w*.43} 6 Q0 0 ${w*.43} 6 L${w*.42} 15 Q0 9 ${-w*.42} 15Z" fill="${colors.plaque}" data-sign="biofilm"/>`;
 if(deposit)marks+=`<path d="M${-w*.43} 2 L${-w*.2} 7 L0 1 L${w*.2} 6 L${w*.43} 2 L${w*.43} 20 L${w*.18} 15 L0 21 L${-w*.18} 15 L${-w*.43} 20Z" fill="${colors.calculus}" stroke="#8d6b2e" stroke-width="1" data-sign="calculus"/>`;
 if(s.inflammation)marks+=`<path d="${cervical}" fill="none" stroke="${colors.margin}" stroke-width="5" stroke-linecap="round" data-sign="inflamed-margin"/>`;
 if(s.whiteSpot&&fdi===11)marks+='<path d="M-15 9Q0 4 15 9L14 23Q0 18-14 23Z" fill="#fffef8" stroke="#d2ccb8" stroke-width="1.2" data-sign="white-spot"/>';
 if(s.fluoride&&fdi===11)marks+='<path d="M-17 7Q0 1 17 7L16 27Q0 21-16 27Z" fill="#e8be68" fill-opacity=".35" stroke="#9a712e" stroke-dasharray="3 3" stroke-width="1.3" data-sign="fluoride"/>';
 if(s.charted&&[16,26].includes(fdi))marks+=`<circle cx="${w*.39}" cy="-5" r="4" fill="${colors.margin}" data-sign="bleeding"/>`;
 return `<g transform="translate(${x} ${y}) rotate(${tilt}) scale(1 ${sign})" data-tooth="${fdi}"><title>Dente ${fdi}${deposit?' · cálculo':''}${active?' · região do caso':''}</title><path d="${shape}" fill="${colors.enamel}" stroke="${colors.edge}" stroke-width="1.4"/>${type>3?`<path d="M0 ${h*.48}v${h*.35}" stroke="#c2b9a2" stroke-width="1"/>`:''}${marks}${active?`<path d="${toothPath(w+9,h+5,type)}" fill="none" stroke="${colors.ink}" stroke-width="2" stroke-dasharray="4 4"/>`:''}</g>`;
}

function overview(s){
 const gum=s.inflammation?'#dd8a86':colors.gum;
 const labels=(arr,up)=>arr.map(fdi=>{const i=(up?upper:lower).indexOf(fdi);return `<text x="${positions[i]}" y="${up?76:352}" text-anchor="middle" font-size="14" fill="#52675b">${fdi}</text>`;}).join('');
 const deposits=s.calculus&&!s.charted?'<path d="M284 331H420" stroke="#b48a39" stroke-width="3"/><text x="352" y="390" text-anchor="middle" font-size="15" fill="#70551f">Depósitos nos incisivos inferiores</text>':'';
 const probe=s.charted?'<g fill="#8b303b" font-size="14" text-anchor="middle"><text x="119" y="54">16 · 6 mm</text><text x="581" y="54">26 · 5 mm</text><text x="400" y="390">31 · 3 mm, sem sangramento</text></g>':'';
 return `<path d="M57 98Q350 50 643 98L642 148Q350 115 58 148Z" fill="${gum}"/><path d="M58 274Q350 299 642 274L643 326Q350 373 57 326Z" fill="${gum}"/>
  <path d="M62 211Q350 229 638 211" fill="none" stroke="#e6ddcf" stroke-width="1"/>
  ${upper.map((fdi,i)=>tooth(fdi,i,true,s)).join('')}${lower.map((fdi,i)=>tooth(fdi,i,false,s)).join('')}
  ${labels([16,13,11,21,23,26],true)}${labels([46,43,41,31,33,36],false)}${deposits}${probe}
  ${s.hygiene?(s.cervical?'<path d="M298 105Q325 89 352 105"':'<path d="M252 285Q350 310 448 285"')+' fill="none" stroke="#2e624e" stroke-width="2" stroke-dasharray="5 5"/><text x="350" y="421" text-anchor="middle" font-size="14" fill="#2e624e">Região de higiene orientada</text>':''}`;
}

function posterior(s){
 const outline='M-80-94C-46-115-13-93 8-99C53-113 96-80 98-35C114 0 92 38 94 64C87 108 42 110 9 98C-32 114-83 101-92 60C-106 23-99-2-101-36C-108-66-99-84-80-94Z';
 const fissure='<path d="M-63-32Q-25-51-7-9L28-33M-7-9L-13 28 29 57M-13 28L-49 53M28-33L50-65" fill="none" stroke="#a99c82" stroke-width="2.5" stroke-linecap="round"/>';
 let condition='';
 if(s.fissure)condition=s.sealed?'<path d="M-63-32Q-25-51-7-9L28-33M-7-9L-13 28 29 57M-13 28L-49 53M28-33L50-65" fill="none" stroke="#a8c7b8" stroke-width="12" stroke-linecap="round" data-sign="sealant"/>':'<path d="M-14-15L-6 2 2 10" fill="none" stroke="#c3ab77" stroke-width="6" data-sign="noncavitated-fissure"/>';
 else if(s.restored)condition='<path d="M-28-38Q1-54 30-28L24 3 40 34Q11 53-15 30L-31 10Z" fill="#dbe5df" stroke="#77988a" stroke-width="2" data-sign="restoration"/>';
 else if(s.id==='restauracao')condition='<path d="M-28-38Q1-54 30-28L24 3 40 34Q11 53-15 30L-31 10Z" fill="#bdc9c7" stroke="#819590" stroke-width="2"/><path d="M26-28L46-11 33 8 23 1Z" fill="#fffdf7" stroke="#705746" stroke-width="2" data-sign="fracture"/>';
 else if(s.prepared)condition='<path d="M-30-39Q3-59 31-26L26 5 36 35Q5 49-18 29L-34 4Z" fill="#d9b77d" stroke="#a17b45" stroke-width="2"/><path d="M-7-15Q10-24 16-7L12 14-5 18-15 4Z" fill="#9e754e" data-sign="selective-removal"/>';
 else condition='<path d="M-22-38L-4-43 10-28 28-22 24-1 36 19 17 34-4 25-22 32-29 9-39-4-29-19Z" fill="#594638" stroke="#917044" stroke-width="2" data-sign="cavity"/><path d="M-11-24L4-21 10-7 1 9-13 5-18-7Z" fill="#322b27"/>';
 const contacts=s.checked?'<g fill="#66518c" data-sign="occlusal-marks"><ellipse cx="-47" cy="-55" rx="9" ry="4" transform="rotate(-30)"/><ellipse cx="51" cy="48" rx="7" ry="4"/></g>':'';
 return `<g transform="translate(350 218) scale(1.36)"><path d="${outline}" fill="${colors.enamel}" stroke="${colors.edge}" stroke-width="2"/>${fissure}${condition}${contacts}</g>`;
}

function anterior(s){
 return `<path d="M210 62Q350 27 490 62V168Q350 129 210 168Z" fill="${colors.gum}"/>
  <g transform="translate(350 125) scale(2.8)"><path d="${toothPath(60,74,1)}" fill="${colors.enamel}" stroke="${colors.edge}" stroke-width="1.2"/>
  <path d="M-23 12Q0 6 23 12L21 29Q0 23-21 29Z" fill="#fffef8" stroke="#d0c9b5" stroke-width=".7" data-sign="white-spot"/>
  ${s.fluoride?'<path d="M-25 9Q0 2 25 9L23 33Q0 27-23 33Z" fill="#e8be68" fill-opacity=".35" stroke="#9a712e" stroke-width=".7" stroke-dasharray="2 2" data-sign="fluoride"/>':''}</g>
  <path d="M418 180H468" stroke="#8c846f" fill="none"/><text x="488" y="185" font-size="15" fill="#52675b">Superfície contínua</text>`;
}


function incisor(s){
 const broken='M-30 0Q0-5 30 0L26 48Q17 65 0 74L-7 58-24 53-26 48Z';
 const shape=s.trauma&&!s.restored?broken:toothPath(60,74,1);
 const mark=s.cervical?'<path d="M-24 5Q0 14 24 5L23 21Q0 28-23 21Z" fill="#d9b77d" stroke="#a17b45" stroke-width=".7" data-sign="cervical-dentin"/>':s.restored?'<path d="M-24 52L-7 58 0 74Q-17 65-24 52Z" fill="#dbe5df" stroke="#77988a" stroke-width=".7" data-sign="restoration"/>':'<path d="M-22 46L-4 54-7 58-24 53Z" fill="#d9b77d" stroke="#a17b45" stroke-width=".7" data-sign="fracture"/>';
 return `<path d="M210 62Q350 27 490 62V168Q350 129 210 168Z" fill="${colors.gum}"/><g transform="translate(350 125) scale(2.8)"><path d="${shape}" fill="${colors.enamel}" stroke="${colors.edge}" stroke-width="1.2"/>${mark}</g><text x="350" y="402" text-anchor="middle" font-size="15" fill="#52675b">${s.cervical?'Dentina cervical exposta':s.restored?'Borda reconstruída · retorno programado':'Esmalte e dentina fraturados · sem exposição pulpar'}</text>`;
}

function periodontal(s){
 let teeth='';
 for(let i=0;i<6;i++){
  const fdi=[43,42,41,31,32,33][i],x=195+i*62;
  teeth+=`<g transform="translate(${x} 242) rotate(${incisorTilt(s,false,fdi)}) scale(1.5 -1)" data-tooth="${fdi}"><path d="${toothPath(37,75,fdi%10)}" fill="${colors.enamel}" stroke="${colors.edge}" stroke-width="1.3"/>${s.plaque?'<path d="M-17 4Q0-1 17 4V17Q0 10-17 17Z" fill="#e4ce89" data-sign="biofilm"/>':''}${s.calculus?'<path d="M-17 1L-8 8 0 1 8 7 17 2V27L7 21-2 29-10 21-17 27Z" fill="#b48a39" stroke="#8d6b2e" stroke-width=".8" data-sign="calculus"/>':''}<path d="M-17 3Q0-3 17 3" fill="none" stroke="#ac3c46" stroke-width="5" data-sign="inflamed-margin"/></g><text x="${x}" y="335" text-anchor="middle" font-size="15" fill="#52675b">${fdi}</text>`;
 }
 const gums='<path d="M151 234Q350 258 549 234V306Q350 345 151 306Z" fill="#dd8a86"/>';
 return `${gums}${teeth}<text x="350" y="64" text-anchor="middle" font-size="16" fill="#52675b">Faces linguais · incisivos inferiores</text><text x="350" y="391" text-anchor="middle" font-size="15" fill="${s.calculus?'#70551f':'#8b303b'}">${s.calculus?'Depósitos mineralizados aderidos à superfície':s.instrumented?'Depósitos removidos; margem ainda avermelhada':'Biofilme junto à margem gengival'}</text>`;
}

function diagram(s,view){
 const detail=view==='detail'||s.isolated,title=s.isolated?'Dente 16 com isolamento absoluto':detail?s.periodontal?'Região anterior inferior ampliada':s.trauma||s.cervical?'Região vestibular do incisivo 11':s.whiteSpot?'Região cervical vestibular do dente 11':'Superfície oclusal do dente 16':'Vista frontal das duas arcadas';
 const content=detail?(s.periodontal?periodontal(s):s.trauma||s.cervical?incisor(s):s.whiteSpot?anterior(s):posterior(s)):overview(s);
 const dam=s.isolated?`<rect x="90" y="46" width="520" height="345" rx="10" fill="${colors.dam}" stroke="#629377" stroke-width="2" data-sign="rubber-dam"/><path d="M128 65v307m444-307v307M110 85h480M110 352h480" stroke="#82ad8f" stroke-width="1" fill="none"/>`:'';
 return `<svg class="sim-mouth-diagram" font-family="sans-serif" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 450" role="img" aria-labelledby="sim-mouth-title sim-mouth-desc"><title id="sim-mouth-title">${esc(title)}</title><desc id="sim-mouth-desc">${esc(description(s))} Diagrama didático de um caso fictício, sem escala clínica.</desc><rect width="700" height="450" fill="#fffdf7"/>${dam}${content}<text x="25" y="28" font-size="13" fill="#607269" font-family="sans-serif">${esc(title)}</text>${!detail?'<text x="25" y="432" font-size="12" fill="#607269">Direita da paciente</text><text x="675" y="432" text-anchor="end" font-size="12" fill="#607269">Esquerda da paciente</text>':''}</svg>`;
}

function legend(s){
 const items=[];
 if(s.cervical)items.push(['#d9b77d','Dentina cervical exposta']);
 if(s.trauma&&!s.restored)items.push(['#d9b77d','Dentina na borda fraturada']);
 if(s.fissure)items.push([s.sealed?'#a8c7b8':'#c3ab77',s.sealed?'Fissuras seladas':'Alteração não cavitada']);
 if(s.plaque)items.push(['#e4ce89','Biofilme']);
 if(s.calculus)items.push(['#b48a39','Cálculo dental']);
 if(s.inflammation)items.push(['#ac3c46','Margem inflamada']);
 if(s.whiteSpot)items.push(['#fffef8','Área branca sem cavitação']);
 if(s.fluoride)items.push(['#dfb65b','Verniz aplicado']);
 if(s.restored)items.push(['#dbe5df','Material restaurador']);
 else if(!s.periodontal&&!s.whiteSpot&&!s.trauma&&!s.cervical&&!s.fissure)items.push([s.prepared?'#d9b77d':'#594638',s.prepared?'Remoção seletiva':'Cavitação / defeito']);
 if(s.checked)items.push(['#66518c','Contatos registrados']);
 return items.map(([color,label])=>`<span><i style="background:${color}" aria-hidden="true"></i>${label}</span>`).join('');
}

function render(session,view='overview'){
 const s=state(session),detail=view==='detail'||s.isolated;
 const focus=s.periodontal?'Ver região inferior':`Ver dente ${s.focus}`;
 return `<div class="sim-mouth-top"><strong>Aspecto da boca</strong><span>Ilustração clínica 2D</span></div><div class="sim-mouth-views" role="group" aria-label="Vista da boca"><button class="text-link" data-sim="mouth-view" data-view="overview" aria-pressed="${!detail}" ${s.isolated?'disabled':''}>Boca completa</button><button class="text-link" data-sim="mouth-view" data-view="detail" aria-pressed="${detail}">${s.isolated?'Campo isolado':focus}</button></div><figure class="sim-mouth-figure">${diagram(s,view)}<figcaption>${esc(description(s))}</figcaption></figure><div class="sim-mouth-legend" aria-label="Sinais representados">${legend(s)}</div><p class="sim-field-status" role="status">${esc(status(s))}</p>${s.bracketDemo?'<div class="sim-component-demo"><svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="12" y="12" width="24" height="24" rx="3"/><path d="M4 22h40M4 26h40M18 12v8m12-8v8M18 28v8m12-8v8"/></svg><p><strong>Bráquete na bancada</strong><br>Componente demonstrado. Não foi instalado na boca.</p></div>':''}<p class="sim-mouth-note">Caso fictício. Cores e proporções destacam sinais clínicos; não representam uma fotografia nem permitem medidas.</p>`;
}
window.ClinicalMouth2D={state,render,diagram,description};
})();
