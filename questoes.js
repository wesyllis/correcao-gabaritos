/* Questões: editor (objetiva e discursiva), figuras geométricas e prévia "como fica na prova" */
const FG_FONT='Poppins,system-ui,sans-serif';
const FG_MOD={'Triângulo':{p:[[40,140],[250,140],[130,25]]},'Triângulo retângulo':{p:[[60,140],[250,140],[60,30]]},
  'Paralelogramo':{p:[[30,140],[205,140],[285,30],[110,30]]},'Retângulo':{p:[[40,140],[260,140],[260,40],[40,40]]},
  'Quadrado':{p:[[90,145],[210,145],[210,25],[90,25]]},'Losango':{p:[[40,95],[165,150],[290,95],[165,40]]},
  'Trapézio':{p:[[30,140],[280,140],[215,35],[95,35]]},'Quadrilátero':{p:[[40,135],[250,150],[285,50],[90,25]]}};
function figNova(m){const md=FG_MOD[m]||FG_MOD['Triângulo'],n=md.p.length;
  return{t:'poly',m:m in FG_MOD?m:'Triângulo',p:md.p.map(x=>x.slice()),n:'ABCD'.slice(0,n).split(''),nm:true,l:Array(n).fill(''),a:Array.from({length:n},()=>({txt:''})),c:Array(n).fill(0),d:false}}
const figU=(p,q)=>{const dx=q[0]-p[0],dy=q[1]-p[1],n=Math.hypot(dx,dy)||1;return[dx/n,dy/n]};
function figArco(p,a1,a2,r){let d=a2-a1;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;
  const f=n=>n.toFixed(1);return `M${f(p[0]+r*Math.cos(a1))} ${f(p[1]+r*Math.sin(a1))}A${r} ${r} 0 0 ${d>0?1:0} ${f(p[0]+r*Math.cos(a1+d))} ${f(p[1]+r*Math.sin(a1+d))}`}
/* desenha a figura no padrão do Syntese: traço preto, vértices em negrito, rótulos sem caixa, arcos nos ângulos */
function figInner(f){const P=f.p,N=P.length,T=`font-family:${FG_FONT};fill:#111`,bb=[1e9,1e9,-1e9,-1e9],
  ext=(x,y,w,h)=>{bb[0]=Math.min(bb[0],x-w);bb[1]=Math.min(bb[1],y-h);bb[2]=Math.max(bb[2],x+w);bb[3]=Math.max(bb[3],y+h)},
  c=[P.reduce((s,p)=>s+p[0],0)/N,P.reduce((s,p)=>s+p[1],0)/N],tw=(s,z)=>String(s).length*z*.56,n1=v=>(+v).toFixed(1),
  txt=(x,y,s,z,w)=>{ext(x,y,tw(s,z)/2,z*.6);return `<text x="${n1(x)}" y="${n1(y+z*.36)}" text-anchor="middle" font-size="${z}" font-weight="${w}" style="${T}">${esc(s)}</text>`};
  let o='';
  if(f.d&&N==4)o+=`<line x1="${P[0][0]}" y1="${P[0][1]}" x2="${P[2][0]}" y2="${P[2][1]}" stroke="#111" stroke-width="1.2"/><line x1="${P[1][0]}" y1="${P[1][1]}" x2="${P[3][0]}" y2="${P[3][1]}" stroke="#111" stroke-width="1.2"/>`;
  o+=`<polygon points="${P.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/>`;
  P.forEach(p=>{o+=`<circle cx="${p[0]}" cy="${p[1]}" r="2.8" fill="#111"/>`;ext(p[0],p[1],3,3)});
  if(f.nm)P.forEach((p,i)=>{const dx=p[0]-c[0],dy=p[1]-c[1],n=Math.hypot(dx,dy)||1;o+=txt(p[0]+dx/n*15,p[1]+dy/n*15,f.n[i]||'',15,600)});
  P.forEach((p,i)=>{const q=P[(i+1)%N],s=f.l[i]||'',mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2,L=Math.hypot(q[0]-p[0],q[1]-p[1])||1,dx=(q[0]-p[0])/L,dy=(q[1]-p[1])/L;
    let nx=dy,ny=-dx;if(nx*(mx-c[0])+ny*(my-c[1])<0){nx=-nx;ny=-ny}
    const k=f.c[i]||0;for(let j=0;j<k;j++){const t=(j-(k-1)/2)*4,ax=mx+dx*t,ay=my+dy*t;o+=`<line x1="${n1(ax-nx*4.5)}" y1="${n1(ay-ny*4.5)}" x2="${n1(ax+nx*4.5)}" y2="${n1(ay+ny*4.5)}" stroke="#111" stroke-width="1.4"/>`}
    if(s){const z=12.5,w=tw(s,z),d=(k?13:8)+Math.abs(nx)*w/2+Math.abs(ny)*z*.55;o+=txt(mx+nx*d,my+ny*d,s,z,400)}});
  P.forEach((p,i)=>{const a=f.a[i]||{},u1=figU(p,P[(i+1)%N]),u2=figU(p,P[(i+N-1)%N]),r=20,desenha=a.arco===true||(a.arco!==false&&a.txt);
    if(a.reto){const s=11;o+=`<polyline points="${n1(p[0]+u1[0]*s)},${n1(p[1]+u1[1]*s)} ${n1(p[0]+(u1[0]+u2[0])*s)},${n1(p[1]+(u1[1]+u2[1])*s)} ${n1(p[0]+u2[0]*s)},${n1(p[1]+u2[1]*s)}" fill="none" stroke="#111" stroke-width="1.4"/>`}
    else if(desenha)o+=`<path d="${figArco(p,Math.atan2(u1[1],u1[0]),Math.atan2(u2[1],u2[0]),r)}" fill="none" stroke="#111" stroke-width="1.4"/>`;
    if(a.txt){const bx=u1[0]+u2[0],by=u1[1]+u2[1],bl=Math.hypot(bx,by)||1,X=bx/bl,Y=by/bl,z=12.5,w=tw(a.txt,z),sg=a.fora?-1:1,d=r+5+Math.abs(X)*w/2+Math.abs(Y)*z*.55;o+=txt(p[0]+X*d*sg,p[1]+Y*d*sg,a.txt,z,400)}});
  return{o,bb}}
function figSvg(f,maxW){const{o,bb}=figInner(f),m=6,x=bb[0]-m,y=bb[1]-m,w=bb[2]-bb[0]+2*m,h=bb[3]-bb[1]+2*m;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}" width="${Math.round(w)}" height="${Math.round(h)}" style="max-width:${maxW?maxW+'px':'100%'};width:100%;height:auto;display:block;background:#fff" role="img" aria-label="Figura geométrica">${o}</svg>`}
function figHtml(f,maxW){if(typeof f=='string'){try{f=JSON.parse(f)}catch(e){return ''}}return f&&f.t=='poly'?figSvg(f,maxW):''}

/* ---------- Editor da questão ---------- */
const QK=[['x²','$x^{2}$','2'],['a/b','$\\frac{a}{b}$','a'],['√','$\\sqrt{x}$','x'],['π','$\\pi$',''],['°','°',''],['≤','$\\leq$',''],['≥','$\\geq$',''],['≠','$\\neq$','']];
function qEd(id){const q=id&&Q.L.find(x=>x.id==id);
  Q.e=q?{...q,alts:[...q.alts],itens:[...(q.itens||[])],figura:q.figura||'',tipo:q.tipo||'objetiva'}:{id:'',tipo:'objetiva',serie:Q.f.s||'8',bncc:'',saeb:'',nivel:'',assunto:'',enunciado:'',alts:['','','',''],correta:'',itens:[''],figura:'',obs:''};
  if(!Q.e.itens.length)Q.e.itens=[''];qEdDes()}
function qEdDes(){const e=Q.e,d=e.tipo=='discursiva';
  h(`${cabec(e.id?'Editar '+esc(e.id):'Nova questão','Banco de questões','qTela()')}
  <div class=qx><div class=qf>
  <div class=fg><button class="tg ${d?'':'on'}" type=button onclick="qTipo('objetiva')">Objetiva</button><button class="tg ${d?'on':''}" type=button onclick="qTipo('discursiva')">Discursiva</button></div>
  <div class=fg id=qch></div>
  <label class=f1>Enunciado (fórmulas entre $ e $)</label><textarea id=qen rows=4 oninput="Q.e.enunciado=this.value;qPrev()">${esc(e.enunciado)}</textarea>
  <div class=fg>${QK.map(([t],i)=>`<button class=tg type=button onclick="qTecla(${i})">${t}</button>`).join('')}</div>
  <label class=f1>Figura</label><div id=qfig></div>
  <label class=f1 id=qlb></label><div id=qit></div>
  <label class=f1>Observações</label><input class=fi value="${esc(e.obs)}" oninput="Q.e.obs=this.value">
  </div><div class=qp><label class=f1>Como fica na prova</label><div class=prv id=qp></div></div></div>
  ${e.id?`<div class=fg><button class=tg type=button onclick=qDup()>Duplicar</button><button class=tg type=button onclick="qStatus('${e.id}','${(Q.L.find(x=>x.id==e.id)||{}).status=='arquivada'?'ativa':'arquivada'}')">${(Q.L.find(x=>x.id==e.id)||{}).status=='arquivada'?'Restaurar':'Arquivar'}</button></div>`:''}
  <div class="ebt qbt"><button type=button onclick=qSalva()>Salvar questão</button><button class=g type=button onclick=qTela()>Voltar</button></div>`,'gab');
  $('#app').classList.add('wide');qChips();qFig();qIt();qPrev(1)}
function qTipo(t){Q.e.tipo=t;if(t=='discursiva'&&!Q.e.itens.length)Q.e.itens=[''];qEdDes()}
function qChips(){const e=Q.e,p=$('#qch');if(!p)return;const nv={'1':'Fácil','2':'Média','3':'Difícil'},c=(t,k,on)=>`<button class="tg ${on?'on':''}" type=button onclick="qCh('${k}')">${esc(t)}</button>`;
  p.innerHTML=c(e.serie?e.serie+'º ano':'Série','serie',e.serie)+c(e.nivel?nv[e.nivel]:'Nível','nivel',e.nivel)+c(e.bncc||'BNCC','bncc',e.bncc)+c(e.saeb||'Saeb','saeb',e.saeb)+c(e.assunto||'Assunto','assunto',e.assunto)}
function qCh(k){const e=Q.e;
  if(k=='serie'||k=='nivel'){const s=document.createElement('select'),op=k=='serie'?[1,2,3,4,5,6,7,8,9].map(n=>[n,n+'º ano']):[['','Sem nível'],['1','Fácil'],['2','Média'],['3','Difícil']];
    op.forEach(([v,t])=>{const o=document.createElement('option');o.value=v;o.textContent=t;o.selected=e[k]==v;s.appendChild(o)});s.onchange=()=>{e[k]=s.value;qChips()};abreSel(s,()=>{})}
  else if(k=='assunto')abreTexto('Assunto',e.assunto,v=>{e.assunto=v;qChips()});
  else abreBusca(k=='bncc'?'Habilidade da BNCC':'Matriz do Saeb',Q.H.filter(x=>x.ref==(k=='bncc'?'BNCC':'SAEB9')).map(x=>({v:x.codigo,t:x.codigo+' – '+x.descricao})),e[k],v=>{e[k]=v;qChips()})}
function abreTexto(titulo,valor,cb){const ov=document.createElement('div'),sh=document.createElement('div');ov.className='ov';sh.className='sh';ov.onclick=x=>{if(x.target==ov)ov.remove()};
  sh.innerHTML=`<label class=f1>${esc(titulo)}</label><input class=fi value="${esc(valor)}" id=atx><div class=br2><button class=g type=button>Cancelar</button><button type=button>Salvar</button></div>`;
  const[b1,b2]=sh.querySelectorAll('button');b1.onclick=()=>ov.remove();b2.onclick=()=>{cb(sh.querySelector('input').value.trim());ov.remove()};
  sh.querySelector('input').onkeydown=x=>{if(x.key=='Enter')b2.click()};ov.appendChild(sh);document.body.appendChild(ov);sh.querySelector('input').focus()}
function abreBusca(titulo,itens,atual,cb){const ov=document.createElement('div'),sh=document.createElement('div');ov.className='ov';sh.className='sh';ov.onclick=x=>{if(x.target==ov)ov.remove()};
  sh.innerHTML=`<label class=f1>${esc(titulo)}</label><input class=fi placeholder="Buscar por código ou texto"><div></div>`;const L=sh.lastChild,I=sh.querySelector('input');
  const des=()=>{const b=nrmQ(I.value);const F=itens.filter(i=>!b||nrmQ(i.t).includes(b)).slice(0,60);L.innerHTML='';
    const lim=document.createElement('button');lim.type='button';lim.className='op';lim.textContent='Sem seleção';lim.onclick=()=>{cb('');ov.remove()};L.appendChild(lim);
    F.forEach(i=>{const b2=document.createElement('button');b2.type='button';b2.className='op'+(i.v==atual?' on':'');b2.textContent=i.t.length>150?i.t.slice(0,150)+'…':i.t;b2.onclick=()=>{cb(i.v);ov.remove()};L.appendChild(b2)});
    if(!itens.length)L.insertAdjacentHTML('beforeend','<small class=f11>Nenhuma habilidade cadastrada. Importe em Avaliações, Habilidades.</small>')};
  I.oninput=des;des();ov.appendChild(sh);document.body.appendChild(ov)}
const nrmQ=t=>String(t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function qTecla(i){const[,s,sel]=QK[i],t=$('#qen');if(!t)return;const a=t.selectionStart,b=t.selectionEnd,v=t.value;t.value=v.slice(0,a)+s+v.slice(b);
  let ini=a+s.length,fim=ini;if(sel){const k=s.indexOf('{'+sel+'}');if(k>=0){ini=a+k+1;fim=ini+sel.length}}t.focus();t.setSelectionRange(ini,fim);Q.e.enunciado=t.value;qPrev()}
function qFig(){const p=$('#qfig'),e=Q.e;if(!p)return;const f=figHtml(e.figura,170);
  p.innerHTML=f?`<div class=fcard><div class=fth>${f}</div><div class=fbt><button class=tg type=button onclick=fgAbrir()>Editar figura</button><button class=tg type=button onclick=fgRem()>Remover</button></div></div>`:'<button class=tg type=button onclick=fgTipos()>+ Adicionar figura</button>'}
function fgRem(){if(!confirm('Remover a figura desta questão?'))return;Q.e.figura='';qFig();qPrev()}
function qIt(){const e=Q.e,d=e.tipo=='discursiva',p=$('#qit');if(!p)return;$('#qlb').textContent=d?'Itens':'Alternativas (toque na letra para marcar a correta)';
  p.innerHTML=d?e.itens.map((t,i)=>`<div class=qi><b>${'abcdefghijkl'[i]})</b><input class=fi value="${esc(t)}" oninput="Q.e.itens[${i}]=this.value;qPrev()">${e.itens.length>1?`<button class=sx type=button aria-label="Tirar item" onclick="qItRem(${i})">✕</button>`:''}</div>`).join('')+(e.itens.length<12?'<button class=tg type=button onclick=qItAdd()>+ Adicionar item</button>':'')
   :e.alts.map((t,i)=>`<div class=qi><button class="lt ${e.correta=='ABCD'[i]?'on':''}" type=button aria-label="Marcar ${'ABCD'[i]} como correta" onclick="Q.e.correta='${'ABCD'[i]}';qIt();qPrev()">${'ABCD'[i]}</button><input class=fi value="${esc(t)}" oninput="Q.e.alts[${i}]=this.value;qPrev()"></div>`).join('')}
function qItAdd(){Q.e.itens.push('');qIt();qPrev();const I=document.querySelectorAll('#qit .fi');if(I.length)I[I.length-1].focus()}
function qItRem(i){Q.e.itens.splice(i,1);qIt();qPrev()}
let qt=0;function qPrev(já){clearTimeout(qt);qt=setTimeout(()=>{const e=Q.e,p=$('#qp');if(!p)return;const f=figHtml(e.figura,230),d=e.tipo=='discursiva';
  p.innerHTML=`<div><b>Q.1.</b> ${tx(e.enunciado)||'<span class=mu>O enunciado aparece aqui.</span>'}</div>${f?`<div class=pf>${f}</div>`:''}`
    +(d?e.itens:e.alts).map((a,i)=>`<div class=pa><b>${'abcdefghijkl'[i]})</b> ${tx(a)}</div>`).join('');mat(p)},já?0:250)}
function qDup(){Q.e.id='';qEdDes();msg('Cópia criada. Salve para registrar a nova questão.')}
async function qSalva(){const e=Q.e;
  if(!e.enunciado.trim())return msg('Escreva o enunciado.');
  if(e.tipo=='objetiva'){if(e.alts.some(a=>!a.trim()))return msg('Preencha as quatro alternativas.');if(!e.correta)return msg('Marque a alternativa correta.')}
  else if(!e.itens.some(a=>a.trim()))return msg('Escreva pelo menos um item.');
  let j;try{j=await api('salvarQuestao',{id:e.id,tipo:e.tipo,serie:e.serie,bncc:e.bncc,saeb:e.saeb,nivel:e.nivel,assunto:e.assunto,enunciado:e.enunciado,alts:e.alts,correta:e.correta,itens:e.itens,figura:e.figura,obs:e.obs},true)}catch{return}
  msg(j.nova?'Questão '+j.id+' criada':'Questão salva');qBanco()}

/* ---------- Figuras: tipo e editor de polígonos ---------- */
let FG={f:null,aba:'lados',grade:true,fundo:null};
function fgTipos(){const T=[['polygon','Polígono','Triângulos e quadriláteros',1],['circle','Circunferência','Raio, cordas, ângulos',0],['cart','Plano cartesiano','Pontos, retas, funções',0],['chart-bar','Gráfico','Colunas, linhas, setores',0],['table','Tabela','Dados em linhas e colunas',0],['cube','Sólido','Prismas, pirâmides, cilindro',0]];
  h(`${cabec('Figura','Escolha o tipo','qEdDes()')}<div class=ig2>${T.map(([i,n,l,on])=>`<button class="tl ${on?'':'off'}" type=button ${on?'onclick=fgNovo()':'disabled'}>${TI2(i,20)}<b>${n}</b><span>${on?l:'Em breve'}</span></button>`).join('')}</div><small class=f11>Imagem pronta (casos pontuais) também entra numa próxima etapa.</small>`,'gab')}
const TI2=(n,z)=>{const X={polygon:'<path d="M12 3l8 6-3 11H7L4 9z"/>',circle:'<circle cx="12" cy="12" r="8"/><path d="M12 12h8"/>',cart:'<path d="M12 3v18M3 12h18"/><path d="M15 9l3-3"/>',cube:'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>'};
  return X[n]?`<svg width="${z}" height="${z}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none">${X[n]}</svg>`:TI(n,z)};
function fgNovo(){FG={f:figNova('Triângulo'),aba:'forma',grade:true,fundo:null};fgDes()}
function fgAbrir(){let f=null;try{f=JSON.parse(Q.e.figura)}catch(x){}if(!f||f.t!='poly')return msg('Não consegui abrir esta figura.');FG={f,aba:'lados',grade:true,fundo:null};fgDes()}
const fgNomes=f=>f.p.map((p,i)=>(f.n[i]||'?')+(f.n[(i+1)%f.p.length]||'?'));
function fgDes(){const f=FG.f;
  h(`${cabec('Figura','Polígono','qEdDes()')}
  <div class=fgx><div class=fgc><div class=fr><span class=f1i>Modelo</span><button class="tg on" type=button onclick=fgModelo()>${esc(f.m)}</button><label class=tg style="margin-left:auto"><input type=file accept="image/*" hidden onchange="fgFundo(this)">${FG.fundo?'Trocar decalque':'Decalcar imagem'}</label>${FG.fundo?'<button class=tg type=button onclick="FG.fundo=null;fgCanvas()">Tirar decalque</button>':''}</div>
  <div class=fgcv><svg id=fgs viewBox="-12 -8 354 186"></svg></div><small class=f11>Arraste os pontos verdes para moldar a figura.</small></div>
  <div class=fgp><div class=fg>${[['forma','Forma'],['lados','Lados'],['angs','Ângulos'],['marcas','Marcas']].map(([k,t])=>`<button class="tg ${FG.aba==k?'on':''}" type=button onclick="FG.aba='${k}';fgPainel()">${t}</button>`).join('')}</div><div id=fgpn></div></div></div>
  <div class=ebt><button type=button onclick=fgUsar()>Usar figura</button><button class=g type=button onclick=qEdDes()>Cancelar</button></div>`,'gab');
  $('#app').classList.add('wide');fgCanvas();fgPainel();fgBind()}
function fgCanvas(){const s=$('#fgs');if(!s)return;const{o}=figInner(FG.f);
  s.innerHTML=(FG.fundo?`<image href="${FG.fundo}" x="0" y="0" width="330" height="170" opacity=".35" preserveAspectRatio="xMidYMid meet"/>`:'')+o+FG.f.p.map((p,i)=>`<circle class=fgh data-i="${i}" cx="${p[0]}" cy="${p[1]}" r="10" fill="rgba(93,205,176,.28)" stroke="#2a9d84" stroke-width="1.5"/>`).join('')}
function fgBind(){const s=$('#fgs');if(!s)return;let dr=-1;
  const pos=e=>{const pt=s.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const q=pt.matrixTransform(s.getScreenCTM().inverse());return[q.x,q.y]};
  s.onpointerdown=e=>{const t=e.target.closest&&e.target.closest('.fgh');if(!t)return;dr=+t.dataset.i;try{s.setPointerCapture(e.pointerId)}catch(x){}e.preventDefault()};
  s.onpointermove=e=>{if(dr<0)return;let[x,y]=pos(e);const g=FG.grade?5:1;x=Math.min(322,Math.max(8,Math.round(x/g)*g));y=Math.min(160,Math.max(14,Math.round(y/g)*g));FG.f.p[dr]=[x,y];fgCanvas()};
  s.onpointerup=s.onpointercancel=()=>{dr=-1}}
function fgModelo(){const f=FG.f,s=document.createElement('select');Object.keys(FG_MOD).forEach(m=>{const o=document.createElement('option');o.textContent=m;o.selected=m==f.m;s.appendChild(o)});
  s.onchange=()=>{const v=figNova(s.value);v.nm=f.nm;v.l=v.p.map((_,i)=>f.l[i]||'');v.a=v.p.map((_,i)=>f.a[i]||{txt:''});v.c=v.p.map((_,i)=>f.c[i]||0);v.n=v.p.map((_,i)=>f.n[i]||'ABCD'[i]);FG.f=v;fgDes()};abreSel(s,()=>{})}
function fgFundo(i){const fl=i.files[0];i.value='';if(!fl)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,700/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);FG.fundo=c.toDataURL('image/jpeg',.7);fgDes()};im.onerror=()=>msg('Não consegui abrir esta imagem.');im.src=r.result};r.readAsDataURL(fl)}
function fgPainel(){const f=FG.f,p=$('#fgpn'),N=f.p.length,nm=fgNomes(f);document.querySelectorAll('.fgp .fg .tg').forEach((b,i)=>b.classList.toggle('on',['forma','lados','angs','marcas'][i]==FG.aba));
  if(FG.aba=='forma')p.innerHTML=`<label class=f1>Nomes dos vértices</label><div class=fr>${f.n.map((n,i)=>`<input class="fi fgn" maxlength=2 value="${esc(n)}" oninput="FG.f.n[${i}]=this.value;fgCanvas();fgNm()">`).join('')}</div>
    <div class=fg><button class="tg ${f.nm?'on':''}" type=button onclick="FG.f.nm=!FG.f.nm;fgCanvas();fgPainel()">Mostrar nomes</button><button class="tg ${FG.grade?'on':''}" type=button onclick="FG.grade=!FG.grade;fgPainel()">Alinhar à grade</button></div>
    <div class=fg><button class=tg type=button onclick="FG.f.p=figNova(FG.f.m).p;fgCanvas()">Restaurar a forma do modelo</button></div>`;
  else if(FG.aba=='lados')p.innerHTML=nm.map((n,i)=>`<div class=fr2><b class=fgl>${esc(n)}</b><input class=fi placeholder="sem rótulo" value="${esc(f.l[i]||'')}" oninput="FG.f.l[${i}]=this.value;fgCanvas()"></div>`).join('')+'<small class=f11>Exemplos: x + 9, 8 cm, 2x + 3.</small>';
  else if(FG.aba=='angs')p.innerHTML=f.p.map((_,i)=>{const a=f.a[i]=f.a[i]||{txt:''},arc=!!a.reto?false:(a.arco===true||(a.arco!==false&&!!a.txt));
    return `<div class=fr2><b class=fgl>${esc(f.n[i]||'?')}</b><input class=fi placeholder="sem rótulo" value="${esc(a.txt||'')}" oninput="FG.f.a[${i}].txt=this.value;fgCanvas()"><button class="tg ${arc?'on':''}" type=button onclick="fgAng(${i},'arc')">Arco</button><button class="tg ${a.reto?'on':''}" type=button onclick="fgAng(${i},'reto')">Reto</button><button class="tg ${a.fora?'on':''}" type=button onclick="fgAng(${i},'fora')">Fora</button></div>`}).join('')+'<small class=f11>Exemplo: (3x + 10)°. O arco aparece sozinho quando há rótulo. "Fora" põe o rótulo fora do ângulo.</small>';
  else p.innerHTML=`<label class=f1>Lados congruentes (toque para trocar 0, 1, 2 ou 3 traços)</label><div class=fr>${nm.map((n,i)=>`<button class="tg ${f.c[i]?'on':''}" type=button onclick="fgCong(${i})">${esc(n)}${f.c[i]?' · '+f.c[i]:''}</button>`).join('')}</div>${N==4?`<div class=fg><button class="tg ${f.d?'on':''}" type=button onclick="FG.f.d=!FG.f.d;fgCanvas();fgPainel()">Diagonais</button></div>`:''}<small class=f11>Ângulo reto: aba Ângulos, botão Reto.</small>`}
function fgNm(){if(FG.aba=='forma')return;fgPainel()}
function fgAng(i,k){const a=FG.f.a[i];if(k=='reto'){a.reto=!a.reto}else if(k=='fora'){a.fora=!a.fora}else{const arc=!a.reto&&(a.arco===true||(a.arco!==false&&!!a.txt));a.arco=!arc;if(a.reto)a.reto=false}fgCanvas();fgPainel()}
function fgCong(i){FG.f.c[i]=((FG.f.c[i]||0)+1)%4;fgCanvas();fgPainel()}
function fgUsar(){Q.e.figura=JSON.stringify(FG.f);qEdDes()}
