/* odontoxiii — CBCT-derived surfaces and separate schematic teaching geometry.
 * Anatomy from 3Dentes by Nate Saindon, CC BY-NC 4.0.
 * Provenance and modifications: assets/ANATOMY-LICENSE.md. */
(()=>{
'use strict';
const TAU=Math.PI*2, clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const mix=(a,b,t)=>a+(b-a)*t;
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const normalize=a=>{const l=Math.hypot(...a)||1;return a.map(v=>v/l);};
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);
const COLORS={esmalte:hex('#f3eee2'),dentina:hex('#d7ac68'),polpa:hex('#bc5354'),cemento:hex('#e6dcc6'),gengiva:hex('#bd7c79')};
COLORS.instrumento=hex('#aab8be');
const TYPES={esmalte:1,dentina:2,polpa:3,cemento:4,gengiva:5,instrumento:6};
const LIGHT=normalize([-.55,.8,1]),FILL=normalize([.8,.05,.6]),HALF=normalize([LIGHT[0],LIGHT[1],LIGHT[2]+1]);
const CACHE=new Map();
const REAL_CACHE=new Map();
function anatomicalArch(){
 if(REAL_CACHE.has('arch'))return REAL_CACHE.get('arch');
 const result=(window.DENTAL_ARCH||[]).map((data,i)=>{window.DENTAL_MESHES['arch-'+i]={[data.layer]:data};const m=anatomicalTooth('arch-'+i)[0];return {...m,fdi:data.fdi};});
 REAL_CACHE.set('arch',result);return result;
}
function completeMouth(opening=24,arch='both'){
 if(!REAL_CACHE.has('mouth')){
  const result=(window.DENTAL_MOUTH||[]).map((data,i)=>{window.DENTAL_MESHES['mouth-'+i]={[data.layer]:data};return {...anatomicalTooth('mouth-'+i)[0],arch:data.arch,fdi:data.fdi,anatomical:false};});
  REAL_CACHE.set('mouth',result);
 }
 const angle=opening*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle),hinge=[0,0,-1.65];
 return REAL_CACHE.get('mouth').filter(m=>arch==='both'||m.arch===arch).map(m=>m.arch==='upper'?m:{...m,vertices:m.vertices.map(([x,y,z])=>[x,hinge[1]+c*(y-hinge[1])-s*(z-hinge[2]),hinge[2]+s*(y-hinge[1])+c*(z-hinge[2])]),normals:m.normals.map(([x,y,z])=>[x,c*y-s*z,s*y+c*z])});
}
function isolatedField(fdi=16){
 const source=completeMouth(0,'upper').find(m=>m.fdi===fdi);if(!source)return[];
 const bounds=[0,1,2].map(i=>[Math.min(...source.vertices.map(p=>p[i])),Math.max(...source.vertices.map(p=>p[i]))]);
 const center=bounds.map(b=>(b[0]+b[1])/2),vertices=source.vertices.map(([x,y,z])=>[(x-center[0])*1.45,-(y-center[1])*1.45,-(z-center[2])*1.45]),normals=source.normals.map(([x,y,z])=>[x,-y,-z]);
 const tooth={...source,vertices,normals};const base=-(bounds[1][1]-center[1])*1.45+.025;
 const dam=surface((u,v)=>{const t=u*TAU,c=Math.cos(t),s=Math.sin(t),outer=Math.min(1.9/Math.max(Math.abs(c),.001),1.65/Math.max(Math.abs(s),.001)),r=mix(.57,outer,v);return[r*c,base-.12*v+.025*Math.sin(t*4)*v,r*s];},96,10);
 return [tooth,{...dam,layer:'gengiva',color:hex('#367f76'),fdi:0}];
}
function anatomicalTooth(type){
 if(REAL_CACHE.has(type))return REAL_CACHE.get(type);
 const source=window.DENTAL_MESHES?.[type];if(!source)return null;
 const decode=(base,signed)=>{const raw=atob(base),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);const view=new DataView(bytes.buffer),a=[];for(let i=0;i<bytes.length;i+=2)a.push(signed?view.getInt16(i,true):view.getUint16(i,true));return a;};
 const result=[];
 for(const [layer,data]of Object.entries(source)){
  const points=decode(data.p,true),ids=decode(data.t,false),vertices=[],tris=[];
  for(let i=0;i<points.length;i+=3)vertices.push(points.slice(i,i+3).map(n=>n/10000));
  for(let i=0;i<ids.length;i+=3)tris.push(ids.slice(i,i+3));
  // A surface mesh represents the external hard tissue, not a measured
  // dentin/cementum boundary. Internal colors remain a teaching convention.
  result.push({vertices,tris,normals:smoothNormals(vertices,tris),layer,anatomical:true});
 }
 REAL_CACHE.set(type,result);return result;
}
const rootsFor=type=>type==='molar'?[
 {x:-.30,z:.22,l:1.87,r:.255,dx:-.22,dz:.13},
 {x:.31,z:.19,l:1.72,r:.235,dx:.22,dz:.10},
 {x:.00,z:-.30,l:2.10,r:.29,dx:.09,dz:-.39}
]:type==='premolar'?[
 {x:0,z:.16,l:1.87,r:.22,dx:.08,dz:.16},
 {x:0,z:-.17,l:1.95,r:.23,dx:.10,dz:-.13}
]:[{x:0,z:0,l:type==='canino'?2.40:2.10,r:type==='canino'?.34:.30,dx:.16,dz:-.06}];
function rootCenter(root,t){return [root.x+root.dx*(.3*t+.7*t*t),.16-root.l*t,root.z+root.dz*(.4*t+.6*t*t)];}

/* Welding the parametric seam also welds collapsed poles. Area-weighted vertex
 * normals remove the sharp lighting bands of the previous finite differences. */
function smoothNormals(vertices,tris){
 const groups=new Map(),normals=vertices.map(()=>[0,0,0]);
 for(const tri of tris){const n=cross(sub(vertices[tri[1]],vertices[tri[0]]),sub(vertices[tri[2]],vertices[tri[0]]));for(const i of tri)for(let k=0;k<3;k++)normals[i][k]+=n[k];}
 const keys=vertices.map(p=>p.map(n=>Math.round(n*1e6)).join(','));
 keys.forEach((key,i)=>{const sum=groups.get(key)||[0,0,0];for(let k=0;k<3;k++)sum[k]+=normals[i][k];groups.set(key,sum);});
 return keys.map(key=>normalize(groups.get(key)));
}
function surface(fn,rows=44,cols=64,reverse=false){
 const vertices=[],tris=[];
 for(let r=0;r<=rows;r++)for(let c=0;c<=cols;c++)vertices.push(fn(r/rows,c/cols));
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
  const a=r*(cols+1)+c,b=a+cols+1;
  tris.push(...(reverse?[[a,a+1,b],[a+1,b+1,b]]:[[a,b,a+1],[a+1,b,b+1]]));
 }
 return {vertices,tris,normals:smoothNormals(vertices,tris)};
}
function crown(type,inner=false,detail=1){
 const posterior=type==='molar'||type==='premolar',molar=type==='molar';
 const crownHeight=posterior?1.13:type==='canino'?1.28:1.65;
 function relief(x,z){
  if(!posterior)return type==='canino'?.43*Math.exp(-((x+.04)**2/.10+z*z/.10)):.035*(1-(x/.65)**2);
  const ax=molar?.78:.50,bz=molar?.72:.48,X=x/ax,Z=z/bz;
  let h=0;
  const cusps=molar?[[-.52,.48,.28],[.52,.43,.24],[-.48,-.48,.35],[.46,-.43,.25]]:[[0,.52,.32],[0,-.50,.26]];
  for(const [cx,cz,height]of cusps)h+=height*Math.exp(-((X-cx)**2/.21+(Z-cz)**2/.20));
  h-=.09*Math.exp(-(X*X/.14+Z*Z/.15));
  h-=.042*Math.exp(-((Z+.08*X)**2)/.004)*Math.exp(-X*X/.45);
  if(molar)h-=.032*Math.exp(-((X-.10*Z)**2)/.005)*Math.exp(-Z*Z/.55);
  return h;
 }
 return surface((u,v)=>{
  const angle=v*TAU,co=Math.cos(angle),si=Math.sin(angle),px=Math.sign(co)*Math.abs(co)**(posterior?.80:.91),pz=Math.sign(si)*Math.abs(si)**(posterior?.84:1.03);
  let x,z,y;
  if(posterior){
   const ax=molar?.78:.50,bz=molar?.72:.48;
   let radius,t=0;
   if(u<.08){radius=.75*Math.sin(u/.08*Math.PI/2);y=.16;}
   else if(u<.59){t=(u-.08)/.51;radius=.75+.27*Math.sin(t*Math.PI/2)-.06*t**4;y=.16+(crownHeight-.16)*t;}
   else{radius=.96*(1-(u-.59)/.41);y=crownHeight;t=1;}
   x=ax*radius*px;z=bz*radius*pz;
   x+=.055*z; // rhomboidal outline, rather than a rectangular prism
   x*=1-.05*Math.max(0,-pz);
   y+=relief(x,z)*smooth((t-.60)/.4);
   y+=.025*Math.cos(angle*2)*(1-t)*(u<.08?u/.08:1);
  }else{
   let t,rad;
   if(u<.07){t=0;rad=Math.sin(u/.07*Math.PI/2);}
   else if(u<.85){t=(u-.07)/.78;rad=1;}
   else{t=1;rad=(1-u)/.15;}
   const canine=type==='canino',width=canine?.34+.16*Math.sin(t*Math.PI*.85):.38+.25*Math.sin(t*Math.PI/2);
   const thickness=canine?.34-.14*t:.32-.225*t**1.7;
   x=width*px*rad;z=thickness*pz*rad;y=.16+(crownHeight-.16)*t;
   // Labial convexity; lingual fossa and cervical cingulum.
   z+=rad*(si>0?.045*Math.sin(t*Math.PI):.08*Math.exp(-(((t-.66)/.21)**2))-.055*Math.exp(-(((t-.16)/.13)**2)))*Math.abs(si);
   if(u>=.85)y+=relief(x,z)*Math.sin((u-.85)/.15*Math.PI/2);
   if(!canine)y-=.045*(Math.abs(x)/.63)**4*t**4;
   y+=.035*Math.cos(angle*2)*(1-t)*rad;
  }
  if(inner){x*=.86;z*=.84;y=.16+(y-.16)*.88;}
  return [x,y,z];
 },Math.round(48*detail),Math.round(64*detail));
}
function smin(a,b,k){const h=Math.max(k-Math.abs(a-b),0)/k;return Math.min(a,b)-h*h*k*.25;}
function rootField(type){
 const roots=rootsFor(type),multi=roots.length>1;
 return (x,y,z)=>{
  let d=100;
  for(const r of roots){
   const t=clamp((.16-y)/r.l),p=rootCenter(r,t);
   const rad=r.r*(.04+.96*(1-t**1.20)**.63);
   const ellipse=Math.hypot((x-p[0])/rad,(z-p[2])/(rad*(multi?.88:.83)))-1;
   const radial=ellipse*rad*.9,vertical=Math.max(y-.16,.16-r.l-y);
   const value=Math.hypot(Math.max(radial,0),Math.max(vertical,0))+Math.min(Math.max(radial,vertical),0);
   d=smin(d,value,multi?.15:.05);
  }
  if(multi){
   const rx=type==='molar'?.58:.37,rz=type==='molar'?.54:.37;
   const t=clamp((.20-y)/.68),scale=1-.52*smooth(t);
   const radial=(Math.hypot(x/(rx*scale),z/(rz*scale))-1)*Math.min(rx,rz)*scale;
   const vertical=Math.max(y-.20,-.48-y);
   const trunk=Math.hypot(Math.max(radial,0),Math.max(vertical,0))+Math.min(Math.max(radial,vertical),0);
   d=smin(d,trunk,.17);
  }
  return d;
 };
}
/* Marching tetrahedra makes one continuous cervical trunk and diverging roots.
 * The field gradient supplies smooth normals independently of tessellation. */
function rootUnion(type,detail){
 const field=rootField(type),step=detail<1?.095:.065;
 const lo=[-.92,-2.30,-1.03],hi=[.98,.26,.78];if(type==='canino')lo[1]=-2.48;
 const size=lo.map((n,i)=>Math.ceil((hi[i]-n)/step)),[nx,ny,nz]=size;
 const points=[],values=[],index=(x,y,z)=>(z*(ny+1)+y)*(nx+1)+x;
 for(let z=0;z<=nz;z++)for(let y=0;y<=ny;y++)for(let x=0;x<=nx;x++){
  const p=[lo[0]+x*step,lo[1]+y*step,lo[2]+z*step];points.push(p);values.push(field(...p));
 }
 const vertices=[],normals=[],tris=[],edgeCache=new Map();
 const vertex=(a,b)=>{
  const key=a<b?a+':'+b:b+':'+a;if(edgeCache.has(key))return edgeCache.get(key);
  const f=values[a]/(values[a]-values[b]),p=points[a].map((v,i)=>mix(v,points[b][i],f)),e=.001;
  const n=normalize([field(p[0]+e,p[1],p[2])-field(p[0]-e,p[1],p[2]),field(p[0],p[1]+e,p[2])-field(p[0],p[1]-e,p[2]),field(p[0],p[1],p[2]+e)-field(p[0],p[1],p[2]-e)]);
  const id=vertices.length;vertices.push(p);normals.push(n);edgeCache.set(key,id);return id;
 };
 function triangle(a,b,c){const n=cross(sub(vertices[b],vertices[a]),sub(vertices[c],vertices[a]));tris.push(dot(n,normals[a])>0?[a,b,c]:[a,c,b]);}
 const tetra=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
 for(let z=0;z<nz;z++)for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){
  const cube=[index(x,y,z),index(x+1,y,z),index(x+1,y+1,z),index(x,y+1,z),index(x,y,z+1),index(x+1,y,z+1),index(x+1,y+1,z+1),index(x,y+1,z+1)];
  if(cube.every(i=>values[i]>=0)||cube.every(i=>values[i]<0))continue;
  for(const t of tetra){const inside=t.map(i=>cube[i]).filter(i=>values[i]<0),outside=t.map(i=>cube[i]).filter(i=>values[i]>=0);
   if(inside.length===1){const a=inside[0];triangle(...outside.map(b=>vertex(a,b)));}
   else if(inside.length===3){const a=outside[0];triangle(...inside.map(b=>vertex(a,b)));}
   else if(inside.length===2){const [a,b]=inside,[c,d]=outside,ac=vertex(a,c),ad=vertex(a,d),bc=vertex(b,c),bd=vertex(b,d);triangle(ac,ad,bc);triangle(ad,bd,bc);}
  }
 }
 return {vertices,normals,tris};
}
function tube(path,radius,rows=36,cols=20){
 return surface((u,v)=>{
  const p=path(u),a=path(Math.max(0,u-.001)),b=path(Math.min(1,u+.001)),axis=normalize(sub(b,a));
  const e1=normalize(cross(axis,Math.abs(axis[0])<.8?[1,0,0]:[0,0,1])),e2=cross(axis,e1);
  const r=radius(u)*Math.min(1,Math.sin(Math.PI*u)*12);
  return p.map((n,i)=>n+r*(Math.cos(v*TAU)*e1[i]+Math.sin(v*TAU)*e2[i]));
 },rows,cols,true);
}
function ellipsoid(center,radii){return surface((u,v)=>{const r=Math.sin(u*Math.PI);return[center[0]+Math.cos(v*TAU)*r*radii[0],center[1]-Math.cos(u*Math.PI)*radii[1],center[2]+Math.sin(v*TAU)*r*radii[2]];},24,40);}
function tooth(type,detail){
 const key=type+':'+detail;if(CACHE.has(key))return CACHE.get(key);
 const result=[],add=(mesh,layer)=>result.push({...mesh,layer});
 add(crown(type,false,detail),'esmalte');add(crown(type,true,detail),'dentina');
 const root=rootUnion(type,detail);add(root,'cemento');
 add({...root,vertices:root.vertices.map(([x,y,z])=>[x*.93,.16+(y-.16)*.985,z*.93])},'dentina');
 const posterior=type==='molar'||type==='premolar',molar=type==='molar';
 const chamberCenter=[0,posterior?.53:.63,0],chamberRadius=posterior?[molar?.30:.18,.29,molar?.28:.19]:[.145,.47,.105];
 if(posterior){const chamber=crown(type,false,detail);add({...chamber,vertices:chamber.vertices.map(([x,y,z])=>[x*.43,.27+(y-.16)*.55,z*.43])},'polpa');}else add(ellipsoid(chamberCenter,chamberRadius),'polpa');
 if(posterior){const horns=molar?[[-.32,.27],[-.31,-.29],[.32,.26],[.29,-.25]]:[[0,.22],[0,-.21]];
  for(const [x,z]of horns)add(tube(t=>[x*(.5+.5*t),.64+.36*t,z*(.5+.5*t)],t=>.08*(1-.8*t),20,16),'polpa');
 }
 for(const r of rootsFor(type)){
  add(tube(t=>{const p=rootCenter(r,t*.97);return[p[0],p[1],p[2]];},t=>.057*(1-.85*t),36,16),'polpa');
  add(tube(t=>{const p=rootCenter(r,0),s=smooth(t);return[mix(0,p[0],s),mix(.48,p[1],t),mix(0,p[2],s)];},()=>.063,18,16),'polpa');
 }
 CACHE.set(key,result);return result;
}
function transform(mesh,scale,pos,angle=0){
 const co=Math.cos(angle),si=Math.sin(angle),rotate=([x,y,z])=>[x*co+z*si,y,-x*si+z*co];
 return {...mesh,vertices:mesh.vertices.map(p=>rotate(p).map((v,i)=>v*scale+pos[i])),normals:mesh.normals.map(rotate)};
}
function gum(){return {...surface((u,v)=>{const a=-1.44+u*2.88,t=v*TAU,end=Math.sqrt(smooth(Math.min(u,1-u)/.035)),r=.39*Math.cos(t)*end;return[Math.sin(a)*(2.50+r),-.64+.84*Math.sin(t)*end,Math.cos(a)*(3.08+r)-1.65];},84,32,true),layer:'gengiva'};}
/* Illustrative tool geometry. The per-tool contact anchor follows the pointer
 * in the camera plane; ray picking selects the surface, not a puncture depth. */
function instrumentMeshes(id){
 if(!id)return[];
 const out=[],steel=hex('#aab7bc'),dark=hex('#42565d'),teal=hex('#398a81'),white=hex('#f4f5eb');
 const add=(m,color=steel)=>out.push({...m,layer:'instrumento',color});
 const rod=(a,b,r,color=steel)=>add(tube(t=>a.map((n,i)=>mix(n,b[i],t)),()=>r,18,20),color);
 const start=[1.32,-1.18,1.1],end=[.78,-.15,1.1],tip=[.50,.40,1.1];
 if(id==='bracket'){
  add(ellipsoid([1.08,-.5,1.3],[.26,.23,.09]));
  for(const y of[-.66,-.34])for(const x of[.94,1.22])add(ellipsoid([x,y,1.37],[.06,.08,.065]));
  rod([.55,-.5,1.42],[1.60,-.5,1.42],.025);return out;
 }
 if(id==='isolamento'){
  add(surface((u,v)=>[.5+u*1.1,-1.05+v*.9,1.1+.06*Math.sin(u*Math.PI)*Math.sin(v*Math.PI)],8,8),teal);
  add(ellipsoid([1.04,-.58,1.2],[.19,.17,.04]),white);return out;
 }
 if(id==='carbono'){add(surface((u,v)=>[.55+u*1.15,-.7+v*.35,1.1],2,2),hex('#38558a'));rod(start,[1.3,-.55,1.08],.035);return out;}
 rod(start,end,id==='anestesia'||id==='resina'?.105:.055,id==='escova'?teal:id==='resina'?white:steel);
 if(id==='anestesia'){
  rod(start,[1.53,-1.57,1.1],.035);
  rod([1.25,-1.57,1.1],[1.78,-1.31,1.1],.045);
  rod([.54,-.25,1.1],[1.00,-.02,1.1],.04);
  rod(end,tip,.013);rod([1.17,-.9,1.19],[.91,-.39,1.19],.037,hex('#91b8bd'));return out;
 }
 for(let i=0;i<7;i++){const t=.12+i*.09,p=start.map((n,k)=>mix(n,end[k],t));add(ellipsoid(p,[.062,.024,.062]),dark);}
 rod(end,tip,.025);
 if(id==='espelho'){
  add(ellipsoid([.43,.51,1.1],[.49,.49,.04]));
  const vertices=[[.43,.51,1.145]],tris=[],normals=[[0,0,1]];
  for(let i=0;i<=64;i++){const a=i*TAU/64;vertices.push([.43+.455*Math.cos(a),.51+.455*Math.sin(a),1.145]);normals.push([0,0,1]);if(i)tris.push([0,i,i+1]);}
  out.push({vertices,tris,normals,layer:'instrumento',color:hex('#d9e6e8'),mirror:true});
 }
 else if(id==='escova'){
  add(ellipsoid([.46,.45,1.10],[.11,.24,.065]),teal);
  for(let i=0;i<4;i++)for(let j=0;j<3;j++)rod([.40+j*.055,.31+i*.085,1.14],[.40+j*.055,.31+i*.085,1.27],.018,white);
 }else if(id==='resina'||id==='fluor'){
  rod(tip,[.38,.57,1.1],.034,id==='fluor'?hex('#d4b87b'):white);
 }else if(id==='sonda'){
  rod(tip,[.37,.58,1.1],.014);for(let i=0;i<3;i++)rod([.47-i*.03,.44+i*.04,1.1],[.45-i*.03,.47+i*.04,1.1],.019,dark);
 }else add(ellipsoid([.46,.46,1.1],[.064,.10,.028]));
 return out;
}

/* Cut faces are triangulated as ordered boundary loops. A centre fan is invalid
 * for concave outlines (especially root furcations) and creates visible spikes. */
function capTriangles(points){
 const area=points.reduce((sum,p,i)=>{const q=points[(i+1)%points.length];return sum+p[1]*q[2]-q[1]*p[2];},0);
 let ids=points.map((_,i)=>i);if(area<0)ids.reverse();const triangles=[];
 const orient=(a,b,c)=>(b[1]-a[1])*(c[2]-a[2])-(b[2]-a[2])*(c[1]-a[1]);
 let attempts=0;
 while(ids.length>3&&attempts++<points.length*points.length){
  let found=false;
  for(let j=0;j<ids.length;j++){
   const a=ids[(j+ids.length-1)%ids.length],b=ids[j],c=ids[(j+1)%ids.length];
   if(orient(points[a],points[b],points[c])<=1e-10)continue;
   if(ids.some(i=>i!==a&&i!==b&&i!==c&&orient(points[a],points[b],points[i])>=-1e-9&&orient(points[b],points[c],points[i])>=-1e-9&&orient(points[c],points[a],points[i])>=-1e-9))continue;
   triangles.push([points[a],points[b],points[c]]);ids.splice(j,1);found=true;break;
  }
  if(!found){ // Remove collinear samples rather than invent a crossing fan.
   const j=ids.findIndex((b,k)=>Math.abs(orient(points[ids[(k+ids.length-1)%ids.length]],points[b],points[ids[(k+1)%ids.length]]))<1e-8);
   if(j<0)break;ids.splice(j,1);
  }
 }
 if(ids.length===3)triangles.push(ids.map(i=>points[i]));return triangles;
}
function clip(mesh,cut,plane=.00137){
 const output=[],edges=[],push=(p,n)=>output.push(...p,...n);
 for(const tri of mesh.tris){
  const vs=tri.map(i=>({p:mesh.vertices[i],n:mesh.normals[i]}));
  if(!cut){for(const v of vs)push(v.p,v.n);continue;}
  const polygon=[],crossings=[];
  for(let j=0;j<3;j++){
   const a=vs[j],b=vs[(j+1)%3],inside=a.p[0]<=plane,other=b.p[0]<=plane;
   if(inside)polygon.push(a);
   if(inside!==other){const t=(plane-a.p[0])/(b.p[0]-a.p[0]),p=a.p.map((v,i)=>mix(v,b.p[i],t)),n=normalize(a.n.map((v,i)=>mix(v,b.n[i],t)));polygon.push({p,n});crossings.push(p);}
  }
  for(let j=1;j<polygon.length-1;j++)for(const v of [polygon[0],polygon[j],polygon[j+1]])push(v.p,v.n);
  if(crossings.length===2)edges.push(crossings);
 }
 if(edges.length){
  const key=p=>Math.round(p[1]*1e5)+','+Math.round(p[2]*1e5),nodes=new Map();
  const link=(p,q)=>{const k=key(p);if(!nodes.has(k))nodes.set(k,{p,neighbors:new Set()});nodes.get(k).neighbors.add(key(q));};
  for(const [a,b]of edges)if(key(a)!==key(b)){link(a,b);link(b,a);}
  const used=new Set(),offset=plane+({esmalte:0,cemento:.001,dentina:.003,polpa:.006}[mesh.layer]||0);
  for(const [start]of nodes){
   if(used.has(start))continue;const loop=[];let current=start,previous=null,closed=false;
   for(let i=0;i<=nodes.size;i++){
    const node=nodes.get(current);if(!node)break;
    loop.push([offset,node.p[1],node.p[2]]);used.add(current);
    const next=[...node.neighbors].find(k=>k!==previous&&(!used.has(k)||k===start));
    if(next===start){closed=true;break;}if(!next)break;previous=current;current=next;
   }
   if(closed&&loop.length>2)for(const tri of capTriangles(loop))for(const p of tri)push(p,[1,0,0]);
  }
 }
 return new Float32Array(output);
}
function indexTriangles(data){
 const vertices=[],normals=[],tris=[],ids=[],map=new Map();
 for(let i=0;i<data.length;i+=6){
  const key=Array.from(data.subarray(i,i+6)).map(n=>Math.round(n*1e6)).join(',');let id=map.get(key);
  if(id===undefined){id=vertices.length;map.set(key,id);vertices.push(Array.from(data.subarray(i,i+3)));normals.push(Array.from(data.subarray(i+3,i+6)));}
  ids.push(id);if(ids.length===3){tris.push(ids.slice());ids.length=0;}
 }
 return {vertices,normals,tris};
}
/* The teaching interior retains the same CBCT tooth and segmented pulp in all
 * views. Cervical division and the inset dentin core are display approximations,
 * not measured tissue boundaries. See assets/ANATOMY-LICENSE.md. */
function studyTooth(type){
 const key='study-'+type;if(REAL_CACHE.has(key))return REAL_CACHE.get(key);
 const source=anatomicalTooth(type);if(!source)return tooth(type,1);
 const whole=source.find(m=>m.layer==='dentina'),enamel=source.find(m=>m.layer==='esmalte'),pulp=source.find(m=>m.layer==='polpa');
 const cervical=Math.min(...(enamel||whole).vertices.map(p=>p[1]));
 const crop=above=>{
  const direction=above?-1:1;
  const rotate=p=>[direction*(p[1]-cervical),-direction*p[0],p[2]];
  const rotated={...whole,layer:'boundary',vertices:whole.vertices.map(rotate),normals:whole.normals.map(p=>[direction*p[1],-direction*p[0],p[2]])};
  const mesh=indexTriangles(clip(rotated,true,0));
  return {vertices:mesh.vertices.map(p=>[-direction*p[1],cervical+direction*p[0],p[2]]),normals:mesh.normals.map(p=>[-direction*p[1],direction*p[0],p[2]]),tris:mesh.tris};
 };
 const packed=window.DENTAL_STUDY_CORES?.[type];
 if(!packed)throw Error('O estudo por tecidos não foi carregado. Recarregue a página.');
 window.DENTAL_MESHES[key+'-core']={dentina:packed};
 const core=anatomicalTooth(key+'-core')[0];
 const result=[{...crop(true),layer:'esmalte'},{...crop(false),layer:'cemento'},
  {...core,layer:'dentina'},
  ...(pulp?[{...pulp,layer:'polpa'}]:[])].map(m=>({...m,anatomical:false,study:true}));
 REAL_CACHE.set(key,result);return result;
}
const TOOL_ANCHORS={espelho:[.43,.51,1.145],bracket:[1.08,-.5,1.42],isolamento:[1.04,-.58,1.2],carbono:[1.125,-.525,1.1],anestesia:[.5,.4,1.1],sonda:[.37,.58,1.1],resina:[.38,.57,1.1],fluor:[.38,.57,1.1],escova:[.455,.48,1.27],escavador:[.46,.56,1.1],cureta:[.46,.56,1.1]};
const multiply=(a,b)=>{const c=new Float32Array(16);for(let j=0;j<4;j++)for(let i=0;i<4;i++)for(let k=0;k<4;k++)c[j*4+i]+=a[k*4+i]*b[j*4+k];return c;};
class DentalAtlas{
 constructor(canvas,onError){
  Object.assign(this,{canvas,onError,yaw:-.90,pitch:.28,zoom:5.4,model:'molar',cut:false,stage:0,exploded:false,anatomical:true,ctx:null,gl:null,buffers:[],pointers:new Map(),frame:null,disposed:false});
  this.mouthOpening=24;this.mouthArch='both';this.visible={esmalte:true,dentina:true,polpa:true,cemento:true,gengiva:true,instrumento:true};this.clinical=0;this.instrument=null;this.mode='orbit';this.toolPosition=[.65,.2];this.mirrorTilt=0;this.mirrorPitch=0;this.hit=null;this.gestureCancelled=false;
  this.studyMode=false;this.selectedLayer=null;
  try{
   this.gl=canvas.getContext('webgl',{antialias:true,alpha:false});
   if(this.gl)this.init();else{this.ctx=canvas.getContext('2d',{alpha:false});if(!this.ctx)throw Error('Visualização indisponível');}
   this.rebuild();this.bind();this.observer=new ResizeObserver(()=>this.request());this.observer.observe(canvas);
  }catch(error){this.onError?.(error);}
 }
 init(){
  const gl=this.gl;
  const vs=`attribute vec3 position;attribute vec3 normal;uniform mat4 projection;uniform mat4 modelView;uniform float offset;varying vec3 n;varying vec3 object;void main(){object=position;n=mat3(modelView)*normal;gl_Position=projection*modelView*vec4(position+vec3(offset,0.,0.),1.);}`;
  const fs=`precision mediump float;uniform vec3 color;uniform float stage;uniform float layerType;uniform float clinical;uniform float crownTop;uniform float rootCut;uniform float reflectionPass;uniform float mirrorSurface;uniform sampler2D reflection;uniform vec2 viewportSize;varying vec3 n;varying vec3 object;
   void main(){if(mirrorSurface>.5){gl_FragColor=vec4(texture2D(reflection,gl_FragCoord.xy/viewportSize).rgb*.97,1.);return;}if(rootCut>.5&&layerType<5.&&object.y<0.)discard;vec3 N=normalize(n);if((reflectionPass<.5&&!gl_FrontFacing)||(reflectionPass>.5&&gl_FrontFacing))N=-N;vec3 light=normalize(vec3(-.55,.8,1.));vec3 fill=normalize(vec3(.8,.05,.6));vec3 halfLight=normalize(light+vec3(0.,0.,1.));
   float diffuse=max(dot(N,light),0.);float lighting=.55+.32*diffuse+.08*(N.y*.5+.5)+.08*max(dot(N,fill),0.);
   float gloss=layerType==6.?.45:layerType==1.? .14:layerType==3.? .10:.045;float spec=pow(max(dot(N,halfLight),0.),layerType==6.?64.:layerType==1.?30.:22.)*gloss;
   vec3 base=color;if(layerType==1.)base*=.96+.04*clamp((object.y-.1)/1.1,0.,1.);
   if(stage>.5){float depth=stage<1.5?.10:stage<2.5?.38:.70;float h=1.16-object.y;float r=.20*(1.-.42*clamp(h/depth,0.,1.));
    if(h>-.035&&h<depth&&length(object.xz)<r&&(layerType!=3.||stage>2.5))base=stage<1.5?vec3(.99,.99,.96):mix(base,vec3(.28,.13,.065),.86);}
   if(clinical>3.5&&layerType<5.&&object.y>.15&&object.y<.28)base=mix(base,vec3(.74,.57,.31),.6);if(clinical>2.5&&clinical<3.5&&layerType<5.&&object.y>.45&&object.y<1.10&&abs(object.x)<.22&&object.z>.10)base=vec3(.99,.99,.96);if(clinical>.5&&clinical<2.5&&layerType<5.){float radius=length(object.xz);float edge=.25+.035*sin(object.x*45.)*cos(object.z*37.);if(object.y>crownTop-.33&&radius<edge){if(clinical<1.5)base=mix(base,vec3(.24,.12,.055),.88);else if(clinical<2.5)base=vec3(.95,.93,.84);else if(clinical<3.5)base=vec3(.99,.99,.96);else base=vec3(.74,.57,.31);}}
   gl_FragColor=vec4(base*lighting+vec3(spec),1.);}`;
  const shader=(kind,source)=>{const s=gl.createShader(kind);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
  const vert=shader(gl.VERTEX_SHADER,vs),frag=shader(gl.FRAGMENT_SHADER,fs);this.program=gl.createProgram();gl.attachShader(this.program,vert);gl.attachShader(this.program,frag);gl.linkProgram(this.program);gl.deleteShader(vert);gl.deleteShader(frag);
  if(!gl.getProgramParameter(this.program,gl.LINK_STATUS))throw Error('Não foi possível iniciar o renderizador');
  gl.useProgram(this.program);this.loc={};for(const name of ['projection','modelView','color','stage','layerType','offset','clinical','crownTop','rootCut','reflectionPass','mirrorSurface','reflection','viewportSize'])this.loc[name]=gl.getUniformLocation(this.program,name);
  for(const name of ['position','normal'])this.loc[name]=gl.getAttribLocation(this.program,name);
  gl.enable(gl.DEPTH_TEST);gl.clearColor(237/255,241/255,227/255,1);
 }
 rebuild(){
  if(!this.gl&&!this.ctx)return;
  for(const b of this.buffers)if(this.gl)this.gl.deleteBuffer(b.buffer);
  this.buffers=[];const detail=this.model==='arcada'?.63:1;let meshes=[];
  this.usingAnatomy=this.model!=='boca'&&this.anatomical&&!this.stage&&!(this.cut&&this.model!=='arcada')&&!this.exploded&&!!window.DENTAL_MESHES;
  this.usingStudy=this.studyMode&&['molar','incisivo'].includes(this.model)&&!this.stage;
  const getTooth=type=>this.usingStudy?studyTooth(type):this.usingAnatomy?anatomicalTooth(type)||tooth(type,detail):tooth(type,detail);
  if(this.model==='boca'){meshes=this.isolated?isolatedField(this.isolationFDI):completeMouth(this.mouthOpening,this.mouthArch);}
  else if(this.model==='arcada'&&this.usingAnatomy&&window.DENTAL_ARCH){meshes=anatomicalArch();}
  else if(this.model==='arcada'){
   for(let i=0;i<14;i++){
    const theta=-1.36+i*2.72/13,d=Math.abs(i-6.5),type=d<2?'incisivo':d<3?'canino':d<5?'premolar':'molar',scale=d<1?.48:d<2?.40:d<3?.47:d<5?.50:.47;
    const pos=[Math.sin(theta)*2.5,0,Math.cos(theta)*3.08-1.65];
    meshes.push(...getTooth(type).map(m=>transform(m,scale,pos,theta)));
   }
   meshes.push(gum());
  }else meshes=[...getTooth(this.model)];
  this.crownTop=meshes.reduce((top,m)=>m.layer==='gengiva'?top:m.vertices.reduce((v,p)=>Math.max(v,p[1]),top),-Infinity);
  const crownPoints=meshes.filter(m=>m.layer==='dentina').flatMap(m=>m.vertices.filter(p=>p[1]>this.crownTop-.35));this.crownCenter=crownPoints.length?[0,1,2].map(i=>crownPoints.reduce((n,p)=>n+p[i],0)/crownPoints.length):[0,0,0];
  meshes.push(...instrumentMeshes(this.instrument));
  for(const mesh of meshes){
   const data=clip(mesh,this.cut&&this.model!=='arcada');let buffer=null;
   if(this.gl){buffer=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,buffer);this.gl.bufferData(this.gl.ARRAY_BUFFER,data,this.gl.STATIC_DRAW);}
   const geometry=this.cut&&this.model!=='arcada'?indexTriangles(data):mesh;
   this.buffers.push({buffer,data,count:data.length/6,layer:mesh.layer,geometry,anatomical:mesh.anatomical,color:mesh.color,mirror:mesh.mirror,fdi:mesh.fdi,bounds:[0,1,2].map(i=>[Math.min(...geometry.vertices.map(p=>p[i])),Math.max(...geometry.vertices.map(p=>p[i]))])});
  }
  this.onRebuild?.();this.request();
 }
 setModel(model){if(!['molar','incisivo','arcada','boca'].includes(model))return;const changed=this.model!==model;this.model=model;if(changed){this.exploded=false;this.reset();this.rebuild();}else this.request();}
 setStudyMode(value){if(value&&!window.DENTAL_STUDY_CORES){this.onError?.(Error('O estudo por tecidos não foi carregado. Recarregue a página.'));return;}this.studyMode=!!value;this.rebuild();}
 selectLayer(layer){this.selectedLayer=layer in COLORS?layer:null;this.request();}
 meshColor(mesh){const base=mesh.color||(mesh.anatomical&&mesh.layer==='dentina'?COLORS.esmalte:COLORS[mesh.layer]);return this.studyMode&&this.selectedLayer&&mesh.layer!==this.selectedLayer?base.map(v=>mix(v,.92,.18)):base;}
 setIsolation(value,fdi=16){if(this.isolated===!!value)return;this.isolated=!!value;this.isolationFDI=fdi;if(this.model==='boca'){if(value){this.yaw=-.18;this.pitch=1.15;this.zoom=6.4;}else this.reset();this.rebuild();}}
 setMouth(opening=24,arch='both'){this.mouthOpening=clamp(Number(opening)||0,0,34);this.mouthArch=['upper','lower'].includes(arch)?arch:'both';this.rebuild();}
 setCut(cut){cut=!!cut;if(this.cut===cut)return;this.cut=cut;if(cut&&this.model!=='arcada'){this.yaw=-1.12;this.pitch=.10;}this.rebuild();}
 setStage(stage){const next=clamp(Number(stage)||0,0,3);if(this.stage===next)return;this.stage=next;this.rebuild();}
 setAnatomical(value){if(this.anatomical===!!value)return;this.anatomical=!!value;this.rebuild();}
 setInstrument(id){
  if(this.instrument===id)return;this.instrument=id;this.mode=id?'tool':'orbit';
  this.toolPosition=id==='espelho'?[.55,.25]:[.25,-.15];this.hit=null;
  // Keep the anatomy buffers and WebGL context when swapping a tool.
  const old=this.buffers.filter(b=>b.layer==='instrumento');for(const b of old)if(this.gl)this.gl.deleteBuffer(b.buffer);
  this.buffers=this.buffers.filter(b=>b.layer!=='instrumento');
  for(const mesh of instrumentMeshes(id)){const data=clip(mesh,false);let buffer=null;if(this.gl){buffer=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,buffer);this.gl.bufferData(this.gl.ARRAY_BUFFER,data,this.gl.STATIC_DRAW);}this.buffers.push({buffer,data,count:data.length/6,layer:mesh.layer,geometry:mesh,color:mesh.color,mirror:mesh.mirror});}
  this.request();
 }
 setMode(mode){this.mode=mode==='tool'&&this.instrument?'tool':'orbit';this.pointers.clear();this.request();}
 setMirrorTilt(value){this.mirrorTilt=clamp(Number(value)||0,-1.2,1.2);this.request();}
 cameraMatrix(){const cy=Math.cos(this.yaw),sy=Math.sin(this.yaw),cx=Math.cos(this.pitch),sx=Math.sin(this.pitch);return multiply([1,0,0,0,0,cx,sx,0,0,-sx,cx,0,0,.1,-this.zoom,1],[cy,0,-sy,0,0,1,0,0,sy,0,cy,0,0,0,0,1]);}
 toolMatrix(){
  const mirror=this.instrument==='espelho',anchor=TOOL_ANCHORS[this.instrument]||[.5,.4,1.1],d=mirror?this.zoom+1.1:3.8,f=1/Math.tan(Math.PI/8),aspect=this.canvas.clientWidth/Math.max(1,this.canvas.clientHeight);
  const center=[this.toolPosition[0]*d*aspect/f,this.toolPosition[1]*d/f,-d];let rotation=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
  if(mirror){
   // The normal bisects eye and crown directions. The slider offsets this
   // physical mirror orientation; reflection is still a planar scene render.
   const cm=this.cameraMatrix(),point=this.model==='arcada'?[0,0,0]:this.crownCenter||[0,this.crownTop-.3,0],focus=[0,1,2].map(i=>cm[i]*point[0]+cm[4+i]*point[1]+cm[8+i]*point[2]+cm[12+i]),eye=normalize(center.map(v=>-v)),tooth=normalize(sub(focus,center)),normal=normalize(eye.map((v,i)=>v+tooth[i]));
   const right=normalize(cross([0,1,0],normal)),up=cross(normal,right),a=this.mirrorTilt,c=Math.cos(a),sn=Math.sin(a);
   rotation=multiply([...right,0,...up,0,...normal,0,0,0,0,1],[c,0,-sn,0,0,1,0,0,sn,0,c,0,0,0,0,1]);
  }
  for(let i=0;i<3;i++)rotation[12+i]=center[i]-dot([rotation[i],rotation[4+i],rotation[8+i]],anchor);
  return rotation;
 }
 reflectionMatrix(){const m=this.toolMatrix(),anchor=[.43,.51,1.145],center=[0,1,2].map(i=>m[i]*anchor[0]+m[4+i]*anchor[1]+m[8+i]*anchor[2]+m[12+i]),n=normalize([m[8],m[9],m[10]]),r=new Float32Array(16);for(let j=0;j<3;j++)for(let i=0;i<3;i++)r[j*4+i]=(i===j?1:0)-2*n[i]*n[j];for(let i=0;i<3;i++)r[12+i]=2*dot(n,center)*n[i];r[15]=1;return r;}
 pick(clientX,clientY){
  const rect=this.canvas.getBoundingClientRect();if(clientX<rect.left||clientY<rect.top||clientX>rect.left+rect.width||clientY>rect.top+rect.height)return null;
  const x=(clientX-rect.left)/rect.width*2-1,y=1-(clientY-rect.top)/rect.height*2,f=1/Math.tan(Math.PI/8),m=this.cameraMatrix();
  const inverse=v=>[dot([m[0],m[1],m[2]],v),dot([m[4],m[5],m[6]],v),dot([m[8],m[9],m[10]],v)];
  const origin=inverse([-m[12],-m[13],-m[14]]),dir=normalize(inverse([x*(rect.width/rect.height)/f,y/f,-1]));let nearest=Infinity,hit=null;
  for(const mesh of this.buffers){if(mesh.layer==='instrumento'||!this.visible[mesh.layer]||this.occluded(mesh.layer))continue;
   const meshOrigin=origin.map((v,k)=>v-(k===0?this.offset(mesh.layer):0));
   let enter=0,leave=nearest;for(let k=0;k<3;k++){const range=mesh.bounds?.[k];if(!range)continue;if(Math.abs(dir[k])<1e-10){if(meshOrigin[k]<range[0]||meshOrigin[k]>range[1]){leave=-1;break;}}else{const a=(range[0]-meshOrigin[k])/dir[k],b=(range[1]-meshOrigin[k])/dir[k];enter=Math.max(enter,Math.min(a,b));leave=Math.min(leave,Math.max(a,b));}}if(leave<enter)continue;
   const {vertices,tris}=mesh.geometry;
   for(const tri of tris){const a=vertices[tri[0]],b=vertices[tri[1]],c=vertices[tri[2]],e1=sub(b,a),e2=sub(c,a),h=cross(dir,e2),det=dot(e1,h);if(Math.abs(det)<1e-8)continue;const inv=1/det,tv=sub(meshOrigin,a),u=inv*dot(tv,h);if(u<0||u>1)continue;const q=cross(tv,e1),v=inv*dot(dir,q);if(v<0||u+v>1)continue;const t=inv*dot(e2,q);if(t>.01&&t<nearest){nearest=t;hit={target:mesh.layer==='gengiva'?'gengiva':'dente',layer:mesh.layer,fdi:mesh.fdi||(this.model==='incisivo'?11:16),point:origin.map((n,i)=>n+t*dir[i])};}}
  }return hit;
 }
 moveTool(clientX,clientY,pick=true){const r=this.canvas.getBoundingClientRect();this.toolPosition=[clamp((clientX-r.left)/r.width*2-1,-1,1),clamp(1-(clientY-r.top)/r.height*2,-1,1)];if(pick){this.hit=this.pick(clientX,clientY);this.onHover?.(this.hit);}this.request();}
 prepareReflection(w,h){
  const gl=this.gl;if(this.reflectionTarget?.w===w&&this.reflectionTarget?.h===h)return;
  this.releaseReflection();const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  const depth=gl.createRenderbuffer();gl.bindRenderbuffer(gl.RENDERBUFFER,depth);gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,w,h);const framebuffer=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,depth);
  if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw Error('Vista indireta indisponível');
  this.reflectionTarget={texture,depth,framebuffer,w,h};gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.bindTexture(gl.TEXTURE_2D,null);
 }
 releaseReflection(){if(!this.reflectionTarget||!this.gl)return;const gl=this.gl,r=this.reflectionTarget;gl.deleteFramebuffer(r.framebuffer);gl.deleteTexture(r.texture);gl.deleteRenderbuffer(r.depth);this.reflectionTarget=null;}

 setClinicalState(start,state){this.clinical=['restored','checked'].includes(state)?2:start==='white'?3:['clean','protected','hygiene'].includes(state)?0:start==='caries'||start==='fracture'?1:start==='plaque'?4:0;this.request();}
 setVisible(layer,value){if(layer in this.visible){this.visible[layer]=!!value;this.request();}}
 setExploded(value){this.exploded=!!value&&this.model!=='arcada';this.zoom=this.model==='arcada'?7.8:this.exploded?8.4:5.4;this.yaw=this.exploded?-.28:this.cut?-1.12:-.90;this.pitch=.14;this.rebuild();}
 setView(view){const preset={perspectiva:[this.exploded?-.28:this.cut?-1.12:-.90,.28],frontal:[0,0],oclusal:[0,1.48],lateral:[-Math.PI/2,.02]};if(preset[view]){[this.yaw,this.pitch]=preset[view];this.request();}}
 reset(){if(this.model==='boca'){this.yaw=this.isolated?-.18:-.32;this.pitch=this.isolated?1.15:.08;this.zoom=this.isolated?6.4:9.7;this.request();return;}this.yaw=this.model==='arcada'?0:this.exploded?-.28:this.cut?-1.12:-.90;this.pitch=this.model==='arcada'?.92:.28;this.zoom=this.model==='arcada'?7.8:this.exploded?8.4:5.4;this.request();}
 changeZoom(delta){this.zoom=clamp(this.zoom+delta,this.model==='arcada'?6:this.exploded?6.2:3.8,16);this.request();}
 occluded(layer){if(this.usingStudy)return false;if(this.usingAnatomy)return (layer==='polpa'||layer==='esmalte')&&this.visible.dentina;if(this.cut&&this.model!=='arcada'||this.exploded)return false;return layer==='polpa'&&this.visible.dentina||layer==='dentina'&&this.visible.esmalte&&this.visible.cemento;}
 offset(layer){return this.exploded?({esmalte:-1.65,cemento:-1.65,dentina:0,polpa:1.65}[layer]||0):0;}
 request(){this.onToolMove?.(this.toolPosition);if(!this.disposed&&this.frame===null)this.frame=requestAnimationFrame(()=>{this.frame=null;this.draw();});}
 size(software=false){const c=this.canvas,ratio=software?Math.min(devicePixelRatio||1,1.25,850/Math.max(c.clientWidth,1)):Math.min(devicePixelRatio||1,2);const w=Math.max(1,Math.round(c.clientWidth*ratio)),h=Math.max(1,Math.round(c.clientHeight*ratio));if(c.width!==w||c.height!==h){c.width=w;c.height=h;}return [w,h];}
 draw(){
  if(this.disposed)return;if(this.ctx){this.drawSoftware();return;}if(!this.gl)return;
  const gl=this.gl,[w,h]=this.size(),f=1/Math.tan(Math.PI/8),near=.1,far=100;
  const projection=new Float32Array([f/(w/h),0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0]);
  gl.viewport(0,0,w,h);gl.useProgram(this.program);
  gl.uniformMatrix4fv(this.loc.projection,false,projection);gl.uniform1f(this.loc.stage,this.model==='molar'?this.stage:0);gl.uniform1f(this.loc.clinical,this.clinical);gl.uniform1f(this.loc.crownTop,this.crownTop);gl.uniform1f(this.loc.rootCut,this.model==='arcada'&&!this.usingAnatomy&&this.visible.gengiva?1:0);gl.uniform2f(this.loc.viewportSize,w,h);gl.uniform1i(this.loc.reflection,0);
  const camera=this.cameraMatrix(),toolMatrix=this.toolMatrix();
  const render=(matrix,tools=false)=>{for(const mesh of this.buffers){const tool=mesh.layer==='instrumento';if(tool!==tools||!this.visible[mesh.layer]||this.occluded(mesh.layer))continue;
   gl.bindBuffer(gl.ARRAY_BUFFER,mesh.buffer);gl.enableVertexAttribArray(this.loc.position);gl.enableVertexAttribArray(this.loc.normal);gl.vertexAttribPointer(this.loc.position,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(this.loc.normal,3,gl.FLOAT,false,24,12);
   gl.uniformMatrix4fv(this.loc.modelView,false,tool?toolMatrix:matrix);gl.uniform3fv(this.loc.color,this.meshColor(mesh));gl.uniform1f(this.loc.layerType,TYPES[mesh.layer]);gl.uniform1f(this.loc.offset,this.offset(mesh.layer));gl.uniform1f(this.loc.mirrorSurface,mesh.mirror?1:0);gl.drawArrays(gl.TRIANGLES,0,mesh.count);
  }};
  if(this.instrument==='espelho'){
   this.prepareReflection(w,h);gl.bindTexture(gl.TEXTURE_2D,null);gl.bindFramebuffer(gl.FRAMEBUFFER,this.reflectionTarget.framebuffer);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform1f(this.loc.reflectionPass,1);render(multiply(this.reflectionMatrix(),camera));gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.reflectionTarget.texture);
  }
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform1f(this.loc.reflectionPass,0);render(camera);render(camera,true);
 }

 /* Per-pixel depth replaces painter sorting: inner dentin can never show through
  * an intact crown just because a long triangle has a different average depth. */
 drawSoftware(){
  const [w,h]=this.size(true),ctx=this.ctx;
  if(!this.pixels||this.pixels.width!==w||this.pixels.height!==h){this.pixels=ctx.createImageData(w,h);this.depth=new Float32Array(w*h);}
  const rgba=this.pixels.data,depth=this.depth;depth.fill(-Infinity);
  for(let i=0;i<rgba.length;i+=4){rgba[i]=237;rgba[i+1]=241;rgba[i+2]=227;rgba[i+3]=255;}
  const cy=Math.cos(this.yaw),sy=Math.sin(this.yaw),cx=Math.cos(this.pitch),sx=Math.sin(this.pitch),f=h/(2*Math.tan(Math.PI/8));
  const rotate=(x,y,z)=>{const X=cy*x+sy*z,Z=-sy*x+cy*z;return[X,cx*y-sx*Z,sx*y+cx*Z];};
  const stage=this.model==='molar'?this.stage:0;
  for(const mesh of this.buffers){
   if(!this.visible[mesh.layer]||this.occluded(mesh.layer))continue;
   const base=this.meshColor(mesh),offset=this.offset(mesh.layer),enamel=mesh.layer==='esmalte',tool=mesh.layer==='instrumento',gloss=tool?.45:enamel?.14:mesh.layer==='polpa'?.10:.045;
   const geometry=mesh.geometry,projected=geometry.vertices.map((point,i)=>{
    const tm=tool?this.toolMatrix():null,p=tool?[0,1,2].map(k=>tm[k]*point[0]+tm[k+4]*point[1]+tm[k+8]*point[2]+tm[k+12]):rotate(point[0]+offset,point[1],point[2]),distance=tool?-p[2]:this.zoom-p[2];
    if(distance<=.1)return null;
    const n=normalize(tool?geometry.normals[i]:rotate(...geometry.normals[i]));
    return {x:w/2+p[0]*f/distance,y:h/2-(p[1]+(tool?0:.1))*f/distance,z:1/distance,n,ox:point[0],oy:point[1],oz:point[2]};
   });
   for(const tri of geometry.tris){
    const v=tri.map(i=>projected[i]);if(v.some(p=>!p))continue;
    const [A,B,C]=v,area=(B.x-A.x)*(C.y-A.y)-(B.y-A.y)*(C.x-A.x);if(Math.abs(area)<.000001)continue;
    const sign=area<0?1:-1;
    for(const p of v){const n=p.n.map(c=>c*sign);p.shade=.55+.32*Math.max(dot(n,LIGHT),0)+.08*(n[1]*.5+.5)+.08*Math.max(dot(n,FILL),0);p.spec=Math.max(dot(n,HALF),0)**(enamel?30:22)*gloss;}
    const minX=Math.max(0,Math.floor(Math.min(A.x,B.x,C.x))),maxX=Math.min(w-1,Math.ceil(Math.max(A.x,B.x,C.x))),minY=Math.max(0,Math.floor(Math.min(A.y,B.y,C.y))),maxY=Math.min(h-1,Math.ceil(Math.max(A.y,B.y,C.y)));
    const inv=1/area;
    for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){
     const px=x+.5,py=y+.5,b1=((px-A.x)*(C.y-A.y)-(py-A.y)*(C.x-A.x))*inv,b2=((B.x-A.x)*(py-A.y)-(B.y-A.y)*(px-A.x))*inv,b0=1-b1-b2;
     if(b0<-.00001||b1<-.00001||b2<-.00001)continue;
     const z=b0*A.z+b1*B.z+b2*C.z,index=y*w+x;if(z<=depth[index])continue;
     const q0=b0*A.z/z,q1=b1*B.z/z,q2=b2*C.z/z,shade=q0*A.shade+q1*B.shade+q2*C.shade,spec=q0*A.spec+q1*B.spec+q2*C.spec;
     const oy=q0*A.oy+q1*B.oy+q2*C.oy,iv=enamel?.96+.04*clamp((oy-.1)/1.1):1;
     if(this.model==='arcada'&&!this.usingAnatomy&&this.visible.gengiva&&TYPES[mesh.layer]<5&&oy<0)continue;
     depth[index]=z;
     let lesion=0;
     if(stage){const h0=1.16-oy,extent=[0,.10,.38,.70][stage],radius=.20*(1-.42*clamp(h0/extent));if(h0>-.035&&h0<extent&&(mesh.layer!=='polpa'||stage===3)){const ox=q0*A.ox+q1*B.ox+q2*C.ox,oz=q0*A.oz+q1*B.oz+q2*C.oz;if(ox*ox+oz*oz<radius*radius)lesion=stage;}}
     const ox=q0*A.ox+q1*B.ox+q2*C.ox,oz=q0*A.oz+q1*B.oz+q2*C.oz,clinical=this.clinical&&TYPES[mesh.layer]<5&&(this.clinical===4?oy>.15&&oy<.28:this.clinical===3?oy>.45&&oy<1.10&&Math.abs(ox)<.22&&oz>.10:oy>this.crownTop-.33&&Math.hypot(ox,oz)<.25+.035*Math.sin(ox*45)*Math.cos(oz*37));
     for(let c=0;c<3;c++){let color=base[c]*iv;if(lesion)color=lesion===1?[.99,.99,.96][c]:mix(color,[.28,.13,.065][c],.86);if(clinical)color=this.clinical===1?mix(color,[.24,.12,.055][c],.88):this.clinical===2?[.95,.93,.84][c]:this.clinical===3?[.99,.99,.96][c]:[.74,.57,.31][c];rgba[index*4+c]=Math.min(255,Math.round((color*shade+spec)*255));}
    }
   }
  }
  ctx.putImageData(this.pixels,0,0);
 }
 bind(){
  const c=this.canvas;this.listeners=[];
  const on=(name,fn,options)=>{c.addEventListener(name,fn,options);this.listeners.push([name,fn,options]);};
  on('pointerdown',e=>{if(this.pointers.size===0){this.gestureCancelled=false;this.tapStart={x:e.clientX,y:e.clientY};this.tapMoved=false;}else this.gestureCancelled=true;this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});c.setPointerCapture(e.pointerId);c.focus({preventScroll:true});c.classList.add('dragging');if(this.mode==='tool')this.moveTool(e.clientX,e.clientY);});
  on('pointermove',e=>{const previous=this.pointers.get(e.pointerId);if(previous&&this.tapStart&&Math.hypot(e.clientX-this.tapStart.x,e.clientY-this.tapStart.y)>8)this.tapMoved=true;
   if(this.mode==='tool'&&this.pointers.size<2){this.moveTool(e.clientX,e.clientY);if(previous)this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});return;}
   if(!previous)return;
   if(this.pointers.size===1){this.yaw+=(e.clientX-previous.x)*.009;this.pitch=clamp(this.pitch+(e.clientY-previous.y)*.009,-1.52,1.52);}
   else{const other=[...this.pointers.entries()].find(([id])=>id!==e.pointerId)?.[1];if(other){const before=Math.hypot(previous.x-other.x,previous.y-other.y),after=Math.hypot(e.clientX-other.x,e.clientY-other.y);this.changeZoom((before-after)*.02);}}
   this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});this.request();
  });
  const end=e=>{const held=this.pointers.has(e.pointerId);if(e.type==='pointerup'&&held&&this.mode==='orbit'&&!this.gestureCancelled&&!this.tapMoved&&this.tapStart&&Math.hypot(e.clientX-this.tapStart.x,e.clientY-this.tapStart.y)<=8){const hit=this.pick(e.clientX,e.clientY);if(hit)this.onSelect?.(hit);}if(e.type==='pointerup'&&held&&this.mode==='tool'&&!this.gestureCancelled){this.hit=this.pick(e.clientX,e.clientY);this.onApply?.(this.hit);}else if(e.type!=='pointerup')this.gestureCancelled=true;this.pointers.delete(e.pointerId);if(!this.pointers.size)c.classList.remove('dragging');};
  on('pointerup',end);on('pointercancel',end);on('lostpointercapture',end);
  on('wheel',e=>{if(document.activeElement!==c)return;e.preventDefault();this.changeZoom(e.deltaY*.004);},{passive:false});
  on('keydown',e=>{if(e.key==='Escape'){this.setMode('orbit');this.onCancel?.();return;}if(this.mode==='tool'&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' '].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft')this.toolPosition[0]-=.05;if(e.key==='ArrowRight')this.toolPosition[0]+=.05;if(e.key==='ArrowUp')this.toolPosition[1]+=.05;if(e.key==='ArrowDown')this.toolPosition[1]-=.05;this.toolPosition=this.toolPosition.map(n=>clamp(n,-1,1));const r=c.getBoundingClientRect(),x=r.left+(this.toolPosition[0]+1)*r.width/2,y=r.top+(1-this.toolPosition[1])*r.height/2;this.hit=this.pick(x,y);this.onHover?.(this.hit);if(e.key==='Enter'||e.key===' ')this.onApply?.(this.hit);this.request();return;}if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','=','Home'].includes(e.key))return;e.preventDefault();
   if(e.key==='ArrowLeft')this.yaw-=.12;if(e.key==='ArrowRight')this.yaw+=.12;if(e.key==='ArrowUp')this.pitch-=.12;if(e.key==='ArrowDown')this.pitch+=.12;
   this.pitch=clamp(this.pitch,-1.52,1.52);if(e.key==='+'||e.key==='=')this.changeZoom(-.4);if(e.key==='-')this.changeZoom(.4);if(e.key==='Home')this.reset();this.request();
  });
  on('webglcontextlost',e=>{e.preventDefault();this.onError?.(Error('Contexto gráfico interrompido'));});
 }
 destroy(){
  this.disposed=true;this.observer?.disconnect();if(this.frame!==null)cancelAnimationFrame(this.frame);
  for(const [name,fn,options]of this.listeners||[])this.canvas.removeEventListener(name,fn,options);
  if(this.gl){this.releaseReflection();for(const b of this.buffers)this.gl.deleteBuffer(b.buffer);this.gl.deleteProgram(this.program);this.gl.getExtension('WEBGL_lose_context')?.loseContext();}
  this.buffers=[];this.gl=null;this.ctx=null;this.pixels=null;this.depth=null;this.pointers.clear();
 }
}
window.DentalAtlas=DentalAtlas;
})();
