/* Extract text locally. Original files are never uploaded by this module. */
(() => {
  'use strict';
  const LIMIT=100000, PDF_VERSION='6.4.299';
  let zipLoader,pdfLoader;
  function loadZip(){return zipLoader||=new Promise((resolve,reject)=>{if(window.JSZip)return resolve(window.JSZip);const s=document.createElement('script');s.src='vendor/jszip-3.10.1.min.js';s.onload=()=>resolve(window.JSZip);s.onerror=()=>{zipLoader=null;reject(Error('Não foi possível carregar o leitor DOCX. Tente novamente.'));};document.head.append(s);});}
  function validateZip(bytes){
    const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);let end=-1;
    for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--)if(v.getUint32(i,true)===0x06054b50){end=i;break;}
    if(end<0)throw Error('Este arquivo não é um DOCX válido.');
    const count=v.getUint16(end+10,true),offset=v.getUint32(end+16,true);if(count>2000||count===65535)throw Error('DOCX muito complexo. Exporte uma versão em texto.');
    let pos=offset,total=0,main=false;
    for(let i=0;i<count;i++){
      if(pos+46>bytes.length||v.getUint32(pos,true)!==0x02014b50)throw Error('A estrutura do DOCX está danificada.');
      const flags=v.getUint16(pos+8,true),compressed=v.getUint32(pos+20,true),size=v.getUint32(pos+24,true),n=v.getUint16(pos+28,true),extra=v.getUint16(pos+30,true),comment=v.getUint16(pos+32,true);
      if(flags&1||size>20*1024*1024||size>Math.max(1024*1024,compressed*150))throw Error('DOCX protegido ou com conteúdo expandido demais. Exporte como texto.');
      total+=size;if(total>30*1024*1024||pos+46+n+extra+comment>bytes.length)throw Error('DOCX muito grande após a extração.');
      const name=new TextDecoder().decode(bytes.subarray(pos+46,pos+46+n));if(name==='word/document.xml')main=true;
      if(name.includes('..')||/vbaProject\.bin$/i.test(name))throw Error('Use um DOCX sem macros ou caminhos externos.');
      pos+=46+n+extra+comment;
    }
    if(!main)throw Error('Não foi encontrado texto de um documento Word neste arquivo.');
  }
  async function docx(bytes){
    validateZip(bytes);const Zip=await loadZip(),archive=await Zip.loadAsync(bytes,{checkCRC32:true});
    const xml=await archive.file('word/document.xml').async('string');if(/<!DOCTYPE|<!ENTITY/i.test(xml))throw Error('DOCX com estrutura XML não aceita.');
    const doc=new DOMParser().parseFromString(xml,'application/xml');if(doc.getElementsByTagName('parsererror').length)throw Error('O texto do DOCX está danificado.');
    const ns='http://schemas.openxmlformats.org/wordprocessingml/2006/main';
    return [...doc.getElementsByTagNameNS(ns,'p')].map(p=>[...p.getElementsByTagNameNS(ns,'t')].map(n=>n.textContent).join('')).join('\n\n');
  }
  async function pdf(bytes,onProgress){
    const lib=await (pdfLoader||=import('https://cdn.jsdelivr.net/npm/pdfjs-dist@'+PDF_VERSION+'/legacy/build/pdf.mjs').catch(()=>{pdfLoader=null;throw Error('Não foi possível carregar o leitor PDF. Confira a internet e use Safari ou Chrome atualizado.');}));
    lib.GlobalWorkerOptions.workerSrc='https://cdn.jsdelivr.net/npm/pdfjs-dist@'+PDF_VERSION+'/legacy/build/pdf.worker.mjs';
    let document,task;
    try{
      task=lib.getDocument({data:bytes,isEvalSupported:false,enableScripting:false,enableXfa:false,disableFontFace:true,useSystemFonts:true,useWorkerFetch:false,stopAtErrors:true});
      document=await task.promise;if(document.numPages>100)throw Error('Limite de 100 páginas por importação. Divida a apostila em partes.');
      const text=[];let size=0;
      for(let i=1;i<=document.numPages;i++){onProgress?.('Lendo página '+i+' de '+document.numPages+'…');const page=await document.getPage(i),content=await page.getTextContent();const value=content.items.map(item=>typeof item.str==='string'?item.str+(item.hasEOL?'\n':' '):'').join('');size+=value.length;if(size>LIMIT)throw Error('O texto ultrapassa 100 mil caracteres. Divida o PDF em partes.');text.push(value);page.cleanup();}
      const value=text.join('\n\n').trim();if(value.length<20)throw Error('Este PDF não tem texto extraível. Se for uma digitalização, use OCR antes de importar.');return value;
    }catch(e){if(e.name==='PasswordException')throw Error('Remova a senha do PDF antes de importar.');throw e;}finally{if(document)await document.destroy();else if(task)await task.destroy();}
  }
  async function extract(file,onProgress){
    const ext=file.name.split('.').pop().toLowerCase();if(!['txt','md','pdf','docx'].includes(ext))throw Error('Escolha PDF, DOCX, TXT ou MD. O formato DOC antigo não é aceito.');
    if(file.size>10*1024*1024)throw Error('Use um arquivo de até 10 MB.');
    onProgress?.('Lendo o arquivo no seu aparelho…');let body;
    if(ext==='pdf'||ext==='docx'){const bytes=new Uint8Array(await file.arrayBuffer());if(ext==='pdf'&&new TextDecoder().decode(bytes.subarray(0,5))!=='%PDF-')throw Error('Este arquivo não parece ser um PDF válido.');body=ext==='pdf'?await pdf(bytes,onProgress):await docx(bytes);}else body=await file.text();
    body=body.replace(/\u0000/g,'').trim();if(!body)throw Error('O arquivo não contém texto para estudar.');if(body.length>LIMIT)throw Error('O texto ultrapassa 100 mil caracteres. Divida o documento antes de importar.');
    return {title:file.name.replace(/\.[^.]+$/,'').slice(0,120),body,subject:'',kind:'nota'};
  }
  window.StudyImport={extract,validateZip,limit:LIMIT};
})();
