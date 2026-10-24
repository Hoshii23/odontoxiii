/* Supabase HTTP client; session is restricted to this browser tab. */
(() => {
  'use strict';
  const cfg=window.ODONTOXIII_CONFIG||{}, KEY='odontoxiii-account-v1';
  let session=null,refreshing=null,epoch=0;
  const listeners=new Set();
  class StudyError extends Error {constructor(message,status=0,code=''){super(message);this.status=status;this.code=code;}}
  const configured=()=>cfg.accountsEnabled===true&&(cfg.legalReady===true||cfg.accessMode==='closed_beta')&&/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(cfg.supabaseUrl||'')&&/^sb_publishable_/.test(cfg.supabasePublishableKey||'');
  function emit(){for(const f of listeners)f(session?.user||null);}
  function setSession(value){session=value?.access_token&&value?.refresh_token?{access_token:value.access_token,refresh_token:value.refresh_token,expires_at:value.expires_at||Math.floor(Date.now()/1000)+(value.expires_in||3600),user:value.user||null}:null;try{if(session)sessionStorage.setItem(KEY,JSON.stringify(session));else sessionStorage.removeItem(KEY);}catch{}emit();}
  function clear(){epoch++;setSession(null);}
  async function raw(path,{method='GET',body,token,headers={}}={}){
    if(!configured())throw new StudyError('As contas ainda estão em preparação. Suas anotações locais continuam disponíveis.');
    let response;
    try{response=await fetch(cfg.supabaseUrl+path,{method,headers:{apikey:cfg.supabasePublishableKey,...(token?{Authorization:'Bearer '+token}:{}),...(body!==undefined?{'Content-Type':'application/json'}:{}),...headers},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(path.startsWith('/functions/')?70000:25000),cache:'no-store',referrerPolicy:'no-referrer'});}catch{throw new StudyError('Não foi possível conectar. Confira a internet e tente novamente; seu texto permanece no editor.');}
    const value=response.status===204?null:await response.json().catch(()=>null);
    if(!response.ok){const code=value?.code||value?.error_code||'';const messages={invalid_credentials:'E-mail ou senha incorretos.',email_not_confirmed:'Confirme seu e-mail antes de entrar.',weak_password:'Use uma senha mais forte, com pelo menos 12 caracteres.',over_email_send_rate_limit:'Limite de e-mails atingido. Aguarde antes de tentar novamente.',user_already_exists:'Confira seu e-mail ou tente entrar na conta existente.'};throw new StudyError(messages[code]||value?.message?.startsWith('ODONTO:')&&value.message.slice(7)|| (response.status===429?'Limite temporário atingido. Aguarde e tente novamente.':response.status===401?'Sua sessão expirou. Entre novamente.':response.status===409?'Esta anotação mudou em outro aparelho. Recarregue as notas antes de salvar.':'Não foi possível concluir a ação. Tente novamente ou procure o suporte.'),response.status,code);}
    return value;
  }
  async function refresh(){
    if(!session)throw new StudyError('Entre na sua conta para continuar.',401);
    if(!refreshing){const token=session.refresh_token,generation=epoch;refreshing=raw('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:token}}).then(s=>{if(generation!==epoch)throw new StudyError('A sessão foi encerrada.',401);setSession(s);return s;}).catch(e=>{if(generation===epoch)clear();throw e;}).finally(()=>{refreshing=null;});}
    return refreshing;
  }
  async function request(path,options={}){
    if(!session)throw new StudyError('Entre na sua conta para continuar.',401);
    if(session.expires_at*1000<Date.now()+60000)await refresh();
    try{return await raw(path,{...options,token:session.access_token});}catch(e){if(e.status!==401)throw e;await refresh();return raw(path,{...options,token:session.access_token});}
  }
  const redirect=()=>location.origin+location.pathname;
  async function initialize(){
    if(!configured())return;
    const params=new URLSearchParams(location.hash.slice(1));
    if(params.has('access_token')||params.has('error_description')){
      history.replaceState(null,'',location.pathname+location.search+'#conta');
      if(params.has('error_description'))throw new StudyError('O link de e-mail expirou ou não pôde ser confirmado. Peça outro link.');
      setSession({access_token:params.get('access_token'),refresh_token:params.get('refresh_token'),expires_in:Number(params.get('expires_in'))||3600});
      window.ODONTOXIII_RECOVERY=params.get('type')==='recovery';
    }else try{const stored=JSON.parse(sessionStorage.getItem(KEY)||'null');if(stored?.access_token&&stored?.refresh_token)setSession(stored);}catch{clear();}
    if(session){try{const user=await request('/auth/v1/user');setSession({...session,user});}catch(e){clear();throw e;}}
  }
  const api={configured,initialize,get user(){return session?.user||null;},onChange(f){listeners.add(f);return()=>listeners.delete(f);},
    async access(){return await request('/rest/v1/rpc/study_access_allowed',{method:'POST',body:{}})===true;},
    async signIn(email,password){const s=await raw('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password}});epoch++;setSession(s);},
    async signUp(email,password){return raw('/auth/v1/signup?redirect_to='+encodeURIComponent(redirect()),{method:'POST',body:{email,password}});},
    async recover(email){await raw('/auth/v1/recover?redirect_to='+encodeURIComponent(redirect()),{method:'POST',body:{email}});},
    async password(password){await request('/auth/v1/user',{method:'PUT',body:{password}});window.ODONTOXIII_RECOVERY=false;},
    async signOut(){try{if(session)await request('/auth/v1/logout?scope=global',{method:'POST'});}finally{clear();}},
    async profile(){return (await request('/rest/v1/study_profiles?select=terms_version,privacy_version,adult_attested,accepted_at,brazil_attested,ai_consent_version,ai_consent_at&limit=1'))?.[0]||null;},
    async accept({activateAI=false}={}){const body={terms_version:cfg.legalVersion,privacy_version:cfg.legalVersion,adult_attested:true,brazil_attested:activateAI,ai_consent_version:activateAI?cfg.aiConsentVersion:null};const current=await api.profile();if(current)await request('/rest/v1/study_profiles?user_id=eq.'+session.user.id,{method:'PATCH',body});else await request('/rest/v1/study_profiles',{method:'POST',body:{...body,user_id:session.user.id}});},
    async setAI(enabled){await request('/rest/v1/study_profiles?user_id=eq.'+session.user.id,{method:'PATCH',body:{brazil_attested:!!enabled,ai_consent_version:enabled?cfg.aiConsentVersion:null}});},
    async list(){return request('/rest/v1/study_notes?select=id,title,body,subject,kind,version,created_at,updated_at&order=updated_at.desc&limit=500');},
    async save(note){const body={title:note.title,body:note.body,subject:note.subject||'',kind:note.kind||'nota'};if(note.id){const rows=await request('/rest/v1/study_notes?id=eq.'+encodeURIComponent(note.id)+'&version=eq.'+encodeURIComponent(note.version),{method:'PATCH',body,headers:{Prefer:'return=representation'}});if(!rows?.length)throw new StudyError('Esta anotação mudou ou foi excluída em outro aparelho. Seu texto foi mantido. Recarregue as notas para conferir.',409);return rows[0];}const rows=await request('/rest/v1/study_notes',{method:'POST',body:{...body,user_id:session.user.id},headers:{Prefer:'return=representation'}});return rows[0];},
    async remove(id){const rows=await request('/rest/v1/study_notes?id=eq.'+encodeURIComponent(id),{method:'DELETE',headers:{Prefer:'return=representation'}});if(!rows?.length)throw new StudyError('A anotação já foi excluída ou não está acessível. Recarregue a lista.',409);},
    async importLocal(notes){for(const n of notes.slice(0,500)){await request('/rest/v1/study_notes?on_conflict=user_id,source_key',{method:'POST',body:{user_id:session.user.id,title:n.title.slice(0,120),body:n.body.slice(0,20000),subject:'Importado deste aparelho',kind:'nota',source_key:'local:'+n.id},headers:{Prefer:'resolution=ignore-duplicates'}});}},
    async ask(noteIds,question,conversation){
      const history=(Array.isArray(conversation)?conversation:[]).slice(-4).filter(m=>m&&['user','assistant'].includes(m.role)&&typeof m.text==='string').map(m=>({role:m.role,text:m.text.slice(0,2000)}));
      const body={noteIds,question,conversation:history};
      while(history.length&&new TextEncoder().encode(JSON.stringify(body)).byteLength>18000)history.shift();
      return request('/functions/v1/study-assistant',{method:'POST',body});
    },
    async chat({question,context=[],useNotebook=false,conversation=[]}){
      const history=(Array.isArray(conversation)?conversation:[]).slice(-4).filter(m=>m&&['user','assistant'].includes(m.role)&&typeof m.text==='string').map(m=>({role:m.role,text:m.text.slice(0,2000)}));
      const sources=context.filter(c=>c&&['page','draft'].includes(c.kind)).slice(0,2).map(c=>({kind:c.kind,title:String(c.title||'').slice(0,160),body:String(c.body||'').slice(0,6000)}));
      const body={noteIds:[],question,useNotebook,context:sources,conversation:history};
      while(history.length&&new TextEncoder().encode(JSON.stringify(body)).byteLength>58000)history.shift();
      while(sources.length&&new TextEncoder().encode(JSON.stringify(body)).byteLength>58000){const largest=sources.reduce((a,b)=>a.body.length>b.body.length?a:b);largest.body=largest.body.slice(0,Math.floor(largest.body.length*.8));if(!largest.body.length)sources.splice(sources.indexOf(largest),1);}
      return request('/functions/v1/study-assistant',{method:'POST',body});
    },
    async deleteAccount(password){await request('/functions/v1/study-account',{method:'POST',body:{password,confirmation:'EXCLUIR'}});clear();}
  };
  window.StudyAPI=api;
})();
