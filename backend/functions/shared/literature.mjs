/* Public scientific abstracts. Only controlled subject terms leave this server. */
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const topics=[
 [['carie','caries'],'"dental caries"'],[['periodontit','periodontite'],'periodontitis'],
 [['gengivit','gingivitis'],'gingivitis'],[['dentina','dentin'],'dentin'],[['odontoblast'],'odontoblasts'],
 [['esmalte','enamel'],'"dental enamel"'],[['polpa','pulpite','pulpitis','dental pulp'],'"dental pulp"'],
 [['selante','sealant'],'"dental sealants"'],[['trauma','avulsao','fratura dental','fratura coronaria'],'"dental trauma"'],
 [['sensibilidade','hipersensib','hypersensitivity'],'"dentin hypersensitivity"'],
 [['bruxismo','bruxism'],'bruxism'],[['disfuncao temporomandibular','dtm','temporomandibular'],'"temporomandibular disorders"'],
 [['ortodont','aparelho','orthodont'],'orthodontics'],[['fluor','fluoride'],'fluoride'],
 [['biofilme','placa bacteriana','biofilm'],'"dental plaque"'],[['endodont','canal radicular','root canal'],'"root canal treatment"'],
 [['anestesi','anesthetic'],'"dental local anesthesia"'],[['implante','implant'],'"dental implants"'],
 [['restauracao','restorative','resina composta'],'"dental restoration"'],[['saliva','xerostomia'],'saliva'],
 [['crianca','odontopedi','pediatric dent'],'"pediatric dentistry"'],[['radiograf','radiograph'],'"dental radiography"'],
 [['biosseguranca','esterilizacao','infection control'],'"dental infection control"'],
 [['cicatrizacao','extracao','exodontia'],'"tooth extraction"'],[['mucosa','lesao oral','oral lesion'],'"oral mucosal diseases"'],
 [['anatomia','anatomy'],'"tooth anatomy"'],[['revisao ativa','memoriz','organizar uma revisao','revisao espacada'],'"retrieval practice"']
];
const cache=new Map();
export function scientificSubjects(question,context=''){
 const match=text=>{const s=normalize(text);return topics.filter(([terms])=>terms.some(term=>s.includes(term))).map(([,query])=>query);};
 const direct=match(question);return [...new Set(direct.length?direct:match(context))].slice(0,2);
}
const plain=s=>String(s||'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').replace(/\s+([.,;:!?])/g,'$1').trim();
export async function findLiterature(question,context,{fetcher=fetch,useCache=true}={}){
 const subjects=scientificSubjects(question,context);if(!subjects.length)return {status:'not_needed',references:[]};
 const key=subjects.join(' AND '),cached=cache.get(key);
 if(useCache&&cached&&cached.until>Date.now())return cached.value;
 const deadline=Date.now()+6500;
 try{
  let records=[];
  for(const reviews of [true,false]){
   const query='('+key+') AND SRC:MED AND HAS_ABSTRACT:Y NOT PUB_TYPE:"Retracted Publication" NOT PUB_TYPE:"Retraction of Publication"'+(reviews?' AND (PUB_TYPE:Review OR PUB_TYPE:"Meta-Analysis" OR PUB_TYPE:"Practice Guideline" OR PUB_TYPE:"Systematic Review")':'');
   const params=new URLSearchParams({query,format:'json',resultType:'core',pageSize:'8'});
   const response=await fetcher('https://www.ebi.ac.uk/europepmc/webservices/rest/search?'+params,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(Math.max(1,Math.min(4500,deadline-Date.now())))});
   if(!response.ok)throw Error('literature unavailable');
   const text=await response.text();if(text.length>1200000)throw Error('literature size');
   const data=JSON.parse(text);
   records=(data.resultList?.result||[]).filter(p=>p.source==='MED'&&/^\d+$/.test(String(p.id))&&p.abstractText&&p.title&&/review|article|trial|guideline|meta-analysis/i.test((p.pubTypeList?.pubType||[]).join(' '))&&!['Y',true,'true'].includes(p.isRetracted)&&!/(retract|preprint|editorial|comment|letter|erratum)/i.test((p.pubTypeList?.pubType||[]).join(' ')));
   if(records.length||Date.now()>=deadline)break;
  }
  const priority=p=>{const type=(p.pubTypeList?.pubType||[]).join(' ').toLowerCase();return /systematic review|meta-analysis|practice guideline/.test(type)?0:/review/.test(type)?1:2;};
  records.sort((a,b)=>priority(a)-priority(b));
  const references=records.slice(0,3).map((p,i)=>({label:'E'+(i+1),kind:'article',title:plain(p.title).slice(0,350),authors:plain(p.authorString).slice(0,220),year:String(p.pubYear||''),journal:plain(p.journalInfo?.journal?.title||p.journalTitle||''),publicationType:(p.pubTypeList?.pubType||[]).join(', ').slice(0,200),url:'https://pubmed.ncbi.nlm.nih.gov/'+p.id+'/',excerpt:plain(p.abstractText).slice(0,3600),retrievedAt:new Date().toISOString()}));
  const value={status:references.length?'available':'none',references};
  if(useCache){if(cache.size>=40)cache.delete(cache.keys().next().value);cache.set(key,{until:Date.now()+(references.length?21600000:600000),value});}
  return value;
 }catch{return {status:'unavailable',references:[]};}
}
