/* Render only verified bibliography URLs; model-written URLs never become links. */
(() => {
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function safe(url){try{const u=new URL(url);if(u.protocol!=='https:'||u.username||u.password||u.port||u.search||u.hash)return '';if(u.hostname==='pubmed.ncbi.nlm.nih.gov'&&/^\/\d+\/?$/.test(u.pathname))return u.href;if(u.hostname==='pmc.ncbi.nlm.nih.gov'&&/^\/articles\/PMC\d+\/?$/.test(u.pathname))return u.href;return '';}catch{return '';}}
 window.StudySourceLinks={render(references=[],status='',answer=''){
  const valid=references.filter(r=>r&&/^E\d+$/.test(r.label)&&safe(r.url)).slice(0,3),cited=valid.filter(r=>answer.includes('['+r.label+']')),shown=cited.length?cited:valid;
  if(shown.length)return `<section class="xii-sources"><h4>${cited.length?'Fontes científicas':'Artigos para conferir'}</h4><ul>${shown.map(r=>`<li><a href="${esc(safe(r.url))}" target="_blank" rel="noopener noreferrer">[${esc(r.label)}] ${esc(r.title)}</a><small>${esc([r.journal,r.year].filter(Boolean).join(' · '))}</small></li>`).join('')}</ul><p>Resumos recuperados do PubMed via Europe PMC. ${cited.length?'Confira a aplicabilidade e o texto completo.':'A resposta não indicou um artigo específico.'}</p></section>`;
  return ['none','unavailable'].includes(status)?`<p class="xii-evidence-note">${status==='unavailable'?'A busca de artigos está indisponível nesta resposta.':'Não foi localizado um artigo para fundamentar esta resposta.'} Confira as afirmações antes de usar.</p>`:'';
 }};
})();
