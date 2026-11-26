/* Questões: editor (objetiva e discursiva), figuras geométricas e prévia "como fica na prova" */
/* ---------- Editor da questão ---------- */
const QK=[['x²','$x^{2}$','2'],['a/b','$\\frac{a}{b}$','a'],['√','$\\sqrt{x}$','x'],['π','$\\pi$',''],['°','°',''],['≤','$\\leq$',''],['≥','$\\geq$',''],['≠','$\\neq$','']];
async function qEd(id){await carrega('figuras');const q=id&&Q.L.find(x=>x.id==id);
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

/* ---------- Figuras: escolha do tipo e editores ---------- */
let FG={f:null,aba:'lados',grade:true,fundo:null};
const FG_TIT={poly:'Polígono',circ:'Circunferência',cart:'Plano cartesiano'};
const FG_ABAS={poly:[['forma','Forma'],['lados','Lados'],['angs','Ângulos'],['marcas','Marcas']],circ:[['pts','Pontos'],['segs','Segmentos'],['angs','Ângulos'],['forma','Forma']],cart:[['plano','Plano'],['pontos','Pontos'],['ligar','Ligar'],['funcoes','Funções']]};
function fgTipos(){const T=[['polygon','Polígono','Triângulos e quadriláteros','poly'],['circle','Circunferência','Raio, cordas, ângulos','circ'],['cart','Plano cartesiano','Pontos, retas, funções','cart'],['chart-bar','Gráfico','Colunas, linhas, setores',0],['table','Tabela','Dados em linhas e colunas',0],['cube','Sólido','Prismas, pirâmides, cilindro',0]];
  h(`${cabec('Figura','Escolha o tipo','qEdDes()')}<div class=ig2>${T.map(([i,n,l,k])=>`<button class="tl ${k?'':'off'}" type=button ${k?`onclick="fgNovo('${k}')"`:'disabled'}>${TI2(i,20)}<b>${n}</b><span>${k?l:'Em breve'}</span></button>`).join('')}</div><small class=f11>Imagem pronta (casos pontuais) também entra numa próxima etapa.</small>`,'gab')}
const TI2=(n,z)=>{const X={polygon:'<path d="M12 3l8 6-3 11H7L4 9z"/>',circle:'<circle cx="12" cy="12" r="8"/><path d="M12 12h8"/>',cart:'<path d="M12 3v18M3 12h18"/><path d="M15 9l3-3"/>',cube:'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>'};
  return X[n]?`<svg width="${z}" height="${z}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none">${X[n]}</svg>`:TI(n,z)};
function fgNovo(t){FG={f:t=='circ'?figNovaCirc():t=='cart'?figNovaCart():figNova('Triângulo'),aba:FG_ABAS[t||'poly'][0][0],grade:true,fundo:null};fgDes()}
function fgAbrir(){let f=null;try{f=JSON.parse(Q.e.figura)}catch(x){}if(!f||!FG_TIT[f.t])return msg('Não consegui abrir esta figura.');FG={f,aba:f.t=='poly'?'lados':FG_ABAS[f.t][0][0],grade:true,fundo:null};fgDes()}
const fgNomes=f=>f.p.map((p,i)=>(f.n[i]||'?')+(f.n[(i+1)%f.p.length]||'?'));
function fgDes(){const f=FG.f,t=f.t;
  h(`${cabec('Figura',FG_TIT[t],'qEdDes()')}
  <div class=fgx><div class=fgc><div class=fr>${t=='poly'?`<span class=f1i>Modelo</span><button class="tg on" type=button onclick=fgModelo()>${esc(f.m)}</button>`:''}<label class=tg style="margin-left:auto"><input type=file accept="image/*" hidden onchange="fgFundo(this)">${FG.fundo?'Trocar decalque':'Decalcar imagem'}</label>${FG.fundo?'<button class=tg type=button onclick="FG.fundo=null;fgCanvas()">Tirar decalque</button>':''}</div>
  <div class=fgcv><svg id=fgs viewBox="-12 -8 354 186"></svg></div><small class=f11>${t=='cart'?'Arraste os pontos verdes: eles encaixam nas posições inteiras.':t=='circ'?'Arraste os pontos verdes ao longo da circunferência.':'Arraste os pontos verdes para moldar a figura.'}</small></div>
  <div class=fgp><div class=fg id=fgtabs>${FG_ABAS[t].map(([k,x])=>`<button class="tg ${FG.aba==k?'on':''}" type=button onclick="FG.aba='${k}';fgPainel()">${x}</button>`).join('')}</div><div id=fgpn></div></div></div>
  <div class=ebt><button type=button onclick=fgUsar()>Usar figura</button><button class=g type=button onclick=qEdDes()>Cancelar</button></div>`,'gab');
  $('#app').classList.add('wide');fgCanvas();fgPainel();fgBind()}
/* geometria do plano na área de edição */
function fgCartEsc(f){const xr=f.x[1]-f.x[0],yr=f.y[1]-f.y[0],s=Math.min(300/xr,150/yr);return{s,ox:(330-xr*s)/2,oy:(170-yr*s)/2+2}}
function fgCanvas(){const s=$('#fgs');if(!s)return;const f=FG.f;let o,h='';
  const fundo=FG.fundo?`<image href="${FG.fundo}" x="0" y="0" width="330" height="170" opacity=".35" preserveAspectRatio="xMidYMid meet"/>`:'';
  if(f.t=='cart'){const g=fgCartEsc(f);o=figInnerCart(f,g.s,g.ox,g.oy).o;h=f.pts.map((p,i)=>`<circle class=fgh data-i="${i}" cx="${(g.ox+(p.x-f.x[0])*g.s).toFixed(1)}" cy="${(g.oy+(f.y[1]-p.y)*g.s).toFixed(1)}" r="10" fill="rgba(93,205,176,.28)" stroke="#2a9d84" stroke-width="1.5"/>`).join('')}
  else if(f.t=='circ'){o=figInnerCirc(f).o;h=f.pts.map((p,i)=>{const q=figPc(f,i);return `<circle class=fgh data-i="${i}" cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="10" fill="rgba(93,205,176,.28)" stroke="#2a9d84" stroke-width="1.5"/>`}).join('')}
  else{o=figInnerPoly(f).o;h=f.p.map((p,i)=>`<circle class=fgh data-i="${i}" cx="${p[0]}" cy="${p[1]}" r="10" fill="rgba(93,205,176,.28)" stroke="#2a9d84" stroke-width="1.5"/>`).join('')}
  s.innerHTML=fundo+o+h}
function fgBind(){const s=$('#fgs');if(!s)return;let dr=-1;
  const pos=e=>{const pt=s.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const q=pt.matrixTransform(s.getScreenCTM().inverse());return[q.x,q.y]};
  s.onpointerdown=e=>{const t=e.target.closest&&e.target.closest('.fgh');if(!t)return;dr=+t.dataset.i;try{s.setPointerCapture(e.pointerId)}catch(x){}e.preventDefault()};
  s.onpointermove=e=>{if(dr<0)return;let[x,y]=pos(e);const f=FG.f;
    if(f.t=='circ'){const a=Math.atan2(-(y-FG_C0[1]),x-FG_C0[0])*180/Math.PI,st=FG.grade?5:1;f.pts[dr].a=((Math.round(a/st)*st)%360+360)%360;fgCanvas();if(FG.aba=='pts')fgPainel(1);return}
    if(f.t=='cart'){const g=fgCartEsc(f),cx=Math.round((x-g.ox)/g.s+f.x[0]),cy=Math.round(f.y[1]-(y-g.oy)/g.s);f.pts[dr].x=Math.min(f.x[1],Math.max(f.x[0],cx));f.pts[dr].y=Math.min(f.y[1],Math.max(f.y[0],cy));fgCanvas();if(FG.aba=='pontos')fgPainel(1);return}
    const g=FG.grade?5:1;x=Math.min(322,Math.max(8,Math.round(x/g)*g));y=Math.min(160,Math.max(14,Math.round(y/g)*g));f.p[dr]=[x,y];fgCanvas()};
  s.onpointerup=s.onpointercancel=()=>{dr=-1}}
function fgModelo(){const f=FG.f,s=document.createElement('select');Object.keys(FG_MOD).forEach(m=>{const o=document.createElement('option');o.textContent=m;o.selected=m==f.m;s.appendChild(o)});
  s.onchange=()=>{const v=figNova(s.value);v.nm=f.nm;v.l=v.p.map((_,i)=>f.l[i]||'');v.a=v.p.map((_,i)=>f.a[i]||{txt:''});v.c=v.p.map((_,i)=>f.c[i]||0);v.n=v.p.map((_,i)=>f.n[i]||'ABCD'[i]);FG.f=v;fgDes()};abreSel(s,()=>{})}
function fgFundo(i){const fl=i.files[0];i.value='';if(!fl)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,700/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);FG.fundo=c.toDataURL('image/jpeg',.7);fgDes()};im.onerror=()=>msg('Não consegui abrir esta imagem.');im.src=r.result};r.readAsDataURL(fl)}
function fgUsar(){Q.e.figura=JSON.stringify(FG.f);qEdDes()}
/* painéis */
const fgSel=(v,op,fn)=>`<select onchange="${fn}this.value)">${op.map(([k,t])=>`<option value="${k}" ${String(k)==String(v)?'selected':''}>${esc(t)}</option>`).join('')}</select>`;
const fgRem2=(lista,i)=>`<button class=sx type=button aria-label="Tirar" onclick="FG.f.${lista}.splice(${i},1);fgCanvas();fgPainel()">✕</button>`;
const fgNum=(v,fn,ex)=>`<input class="fi fgnum" type=number inputmode=decimal step=any value="${v}" oninput="${fn}"${ex||''}>`;
function fgPainel(manter){const f=FG.f,p=$('#fgpn');if(!p)return;
  document.querySelectorAll('#fgtabs .tg').forEach((b,i)=>b.classList.toggle('on',FG_ABAS[f.t][i]&&FG_ABAS[f.t][i][0]==FG.aba));
  if(manter&&document.activeElement&&p.contains(document.activeElement))return;
  p.innerHTML=f.t=='circ'?fgPCirc(f):f.t=='cart'?fgPCart(f):fgPPoly(f);melhoraSel()}
function fgPPoly(f){const N=f.p.length,nm=fgNomes(f);
  if(FG.aba=='forma')return `<label class=f1>Nomes dos vértices</label><div class=fr>${f.n.map((n,i)=>`<input class="fi fgn" maxlength=2 value="${esc(n)}" oninput="FG.f.n[${i}]=this.value;fgCanvas()">`).join('')}</div>
    <div class=fg><button class="tg ${f.nm?'on':''}" type=button onclick="FG.f.nm=!FG.f.nm;fgCanvas();fgPainel()">Mostrar nomes</button><button class="tg ${FG.grade?'on':''}" type=button onclick="FG.grade=!FG.grade;fgPainel()">Alinhar à grade</button></div>
    <div class=fg><button class=tg type=button onclick="FG.f.p=figNova(FG.f.m).p;fgCanvas()">Restaurar a forma do modelo</button></div>`;
  if(FG.aba=='lados')return nm.map((n,i)=>`<div class=fr2><b class=fgl>${esc(n)}</b><input class=fi placeholder="sem rótulo" value="${esc(f.l[i]||'')}" oninput="FG.f.l[${i}]=this.value;fgCanvas()"></div>`).join('')+'<small class=f11>Exemplos: x + 9, 8 cm, 2x + 3.</small>';
  if(FG.aba=='angs')return f.p.map((_,i)=>{const a=f.a[i]=f.a[i]||{txt:''},arc=!!a.reto?false:(a.arco===true||(a.arco!==false&&!!a.txt));
    return `<div class=fr2><b class=fgl>${esc(f.n[i]||'?')}</b><input class=fi placeholder="sem rótulo" value="${esc(a.txt||'')}" oninput="FG.f.a[${i}].txt=this.value;fgCanvas()"><button class="tg ${arc?'on':''}" type=button onclick="fgAng(${i},'arc')">Arco</button><button class="tg ${a.reto?'on':''}" type=button onclick="fgAng(${i},'reto')">Reto</button><button class="tg ${a.fora?'on':''}" type=button onclick="fgAng(${i},'fora')">Fora</button></div>`}).join('')+'<small class=f11>Exemplo: (3x + 10)°. O arco aparece sozinho quando há rótulo. "Fora" põe o rótulo fora do ângulo.</small>';
  return `<label class=f1>Lados congruentes (toque para trocar 0, 1, 2 ou 3 traços)</label><div class=fr>${nm.map((n,i)=>`<button class="tg ${f.c[i]?'on':''}" type=button onclick="fgCong(${i})">${esc(n)}${f.c[i]?' · '+f.c[i]:''}</button>`).join('')}</div>${N==4?`<div class=fg><button class="tg ${f.d?'on':''}" type=button onclick="FG.f.d=!FG.f.d;fgCanvas();fgPainel()">Diagonais</button></div>`:''}<small class=f11>Ângulo reto: aba Ângulos, botão Reto.</small>`}
function fgAng(i,k){const a=FG.f.a[i];if(k=='reto'){a.reto=!a.reto}else if(k=='fora'){a.fora=!a.fora}else{const arc=!a.reto&&(a.arco===true||(a.arco!==false&&!!a.txt));a.arco=!arc;if(a.reto)a.reto=false}fgCanvas();fgPainel()}
function fgCong(i){FG.f.c[i]=((FG.f.c[i]||0)+1)%4;fgCanvas();fgPainel()}
/* circunferência */
const fgCop=f=>[[-1,f.c||'O'],...f.pts.map((p,i)=>[i,p.n||'?'])];
function fgPCirc(f){const op=fgCop(f);
  if(FG.aba=='pts')return f.pts.map((q,i)=>`<div class=fr2><input class="fi fgn" maxlength=2 value="${esc(q.n)}" oninput="FG.f.pts[${i}].n=this.value;fgCanvas()"><span class=f1i>ângulo</span>${fgNum(Math.round(q.a),`FG.f.pts[${i}].a=((+this.value%360)+360)%360;fgCanvas()`)}<span class=f1i>°</span>${f.pts.length>1?fgRem2('pts',i):''}</div>`).join('')+(f.pts.length<8?'<button class=tg type=button onclick="fgCircAdd()">+ Ponto</button>':'')+'<small class=f11>O ângulo é medido a partir da direita, no sentido anti-horário.</small>';
  if(FG.aba=='segs')return f.seg.map((s,i)=>`<div class=rowc><div class=fr3>${fgSel(s.i,op,`fgSegSet(${i},'i',+`)}<span class=f1i>até</span>${fgSel(s.j,op,`fgSegSet(${i},'j',+`)}</div><div class=fr2><input class=fi placeholder="rótulo (ex.: r = 5 cm)" value="${esc(s.txt||'')}" oninput="FG.f.seg[${i}].txt=this.value;fgCanvas()"><button class="tg ${s.d?'on':''}" type=button onclick="FG.f.seg[${i}].d=FG.f.seg[${i}].d?0:1;fgCanvas();fgPainel()">Tracejado</button>${fgRem2('seg',i)}</div></div>`).join('')+'<button class=tg type=button onclick="FG.f.seg.push({i:-1,j:0,txt:\'\',d:0});fgCanvas();fgPainel()">+ Segmento</button><small class=f11>Raio: do centro a um ponto. Diâmetro: passa pelo centro. Corda: entre dois pontos.</small>';
  if(FG.aba=='angs')return f.ang.map((g,i)=>{const arc=!g.reto&&(g.arco===true||(g.arco!==false&&g.arco!==0&&!!g.txt));
    return `<div class=rowc><div class=fr3>${fgSel(g.v,op,`fgAngSet(${i},'v',+`)}<span class=f1i>de</span>${fgSel(g.a,op,`fgAngSet(${i},'a',+`)}<span class=f1i>a</span>${fgSel(g.b,op,`fgAngSet(${i},'b',+`)}</div><div class=fr2><input class=fi placeholder="rótulo (ex.: 60°)" value="${esc(g.txt||'')}" oninput="FG.f.ang[${i}].txt=this.value;fgCanvas()">${fgRem2('ang',i)}</div>
    <div class=fg><button class="tg ${arc?'on':''}" type=button onclick="fgCAng(${i},'arc')">Arco</button><button class="tg ${g.reto?'on':''}" type=button onclick="fgCAng(${i},'reto')">Reto</button>${g.v===-1?`<button class="tg ${g.sombra?'on':''}" type=button onclick="fgCAng(${i},'sombra')">Sombrear setor</button>`:''}<button class="tg ${g.inv?'on':''}" type=button onclick="fgCAng(${i},'inv')">Lado maior</button><button class="tg ${g.fora?'on':''}" type=button onclick="fgCAng(${i},'fora')">Rótulo fora</button></div></div>`}).join('')+'<button class=tg type=button onclick="FG.f.ang.push({v:-1,a:0,b:Math.min(1,FG.f.pts.length-1),txt:\'\',arco:null,sombra:0,fora:0,inv:0,reto:0});fgCanvas();fgPainel()">+ Ângulo</button><small class=f11>Central: vértice no centro. Inscrito: vértice em um ponto da circunferência.</small>';
  return `<label class=f1>Nome do centro</label><input class=fi maxlength=2 value="${esc(f.c||'')}" oninput="FG.f.c=this.value;fgCanvas()"><div class=fg><button class="tg ${f.nm?'on':''}" type=button onclick="FG.f.nm=!FG.f.nm;fgCanvas();fgPainel()">Mostrar nomes</button><button class="tg ${f.cn!==false?'on':''}" type=button onclick="FG.f.cn=f.cn===false;fgCanvas();fgPainel()">Mostrar centro</button><button class="tg ${FG.grade?'on':''}" type=button onclick="FG.grade=!FG.grade;fgPainel()">Alinhar de 5° em 5°</button></div>`.replace('FG.f.cn=f.cn===false','FG.f.cn=FG.f.cn===false')}
function fgCircAdd(){const f=FG.f,a=f.pts.length?(f.pts[f.pts.length-1].a+50)%360:0;f.pts.push({n:'ABCDEFGH'[f.pts.length]||'P',a});fgCanvas();fgPainel()}
function fgSegSet(i,k,v){FG.f.seg[i][k]=v;fgCanvas()}
function fgAngSet(i,k,v){FG.f.ang[i][k]=v;fgCanvas()}
function fgCAng(i,k){const g=FG.f.ang[i];if(k=='arc'){const arc=!g.reto&&(g.arco===true||(g.arco!==false&&g.arco!==0&&!!g.txt));g.arco=!arc;if(g.reto)g.reto=0}else g[k]=g[k]?0:1;fgCanvas();fgPainel()}
/* plano cartesiano */
function fgPCart(f){
  if(FG.aba=='plano')return `<div class=fr2><span class=f1i style="width:46px">x de</span>${fgNum(f.x[0],'fgLim(0,0,this.value)')}<span class=f1i>a</span>${fgNum(f.x[1],'fgLim(0,1,this.value)')}</div><div class=fr2><span class=f1i style="width:46px">y de</span>${fgNum(f.y[0],'fgLim(1,0,this.value)')}<span class=f1i>a</span>${fgNum(f.y[1],'fgLim(1,1,this.value)')}</div>
    <div class=fr2><span class=f1i style="width:46px">passo</span>${fgSel(f.passo,[[1,'1'],[2,'2'],[5,'5'],[10,'10'],[0.5,'0,5']],'fgPasso(+')}</div>
    <div class=fg><button class="tg ${f.grade?'on':''}" type=button onclick="FG.f.grade=!FG.f.grade;fgCanvas();fgPainel()">Grade</button><button class="tg ${f.nums!==false?'on':''}" type=button onclick="FG.f.nums=FG.f.nums===false;fgCanvas();fgPainel()">Números nos eixos</button></div><small class=f11>O plano vai de −40 a 40 em cada eixo.</small>`;
  if(FG.aba=='pontos')return f.pts.map((p,i)=>`<div class=fr2><input class="fi fgn" maxlength=2 value="${esc(p.n)}" oninput="FG.f.pts[${i}].n=this.value;fgCanvas()"><span class=f1i>x</span>${fgNum(p.x,`FG.f.pts[${i}].x=fgV(this.value);fgCanvas()`)}<span class=f1i>y</span>${fgNum(p.y,`FG.f.pts[${i}].y=fgV(this.value);fgCanvas()`)}<button class="tg ${p.co?'on':''}" type=button onclick="FG.f.pts[${i}].co=!FG.f.pts[${i}].co;fgCanvas();fgPainel()">(x, y)</button>${fgRem2('pts',i)}</div>`).join('')+(f.pts.length<12?'<button class=tg type=button onclick="fgPtAdd()">+ Ponto</button>':'')+'<small class=f11>"(x, y)" mostra as coordenadas ao lado do nome.</small>';
  if(FG.aba=='ligar')return `<label class=f1>Ordem dos pontos (ex.: A B C D)</label><input class=fi value="${esc(f.liga||'')}" oninput="FG.f.liga=this.value;fgCanvas()"><div class=fg><button class="tg ${f.fecha?'on':''}" type=button onclick="FG.f.fecha=!FG.f.fecha;fgCanvas();fgPainel()">Fechar a figura</button></div><small class=f11>Liga os pontos na ordem escrita. Para um segmento, escreva só dois pontos.</small>`;
  return f.fn.map((g,i)=>{const ok=!g.e||figExpr(g.e);return `<div class=rowc><div class=fr2><span class=f1i>y =</span><input class=fi placeholder="2x + 1" value="${esc(g.e||'')}" oninput="FG.f.fn[${i}].e=this.value;fgCanvas();fgFnOk(${i},this)">${fgRem2('fn',i)}</div><div class=fr2><input class=fi placeholder="rótulo (ex.: y = 2x + 1)" value="${esc(g.txt||'')}" oninput="FG.f.fn[${i}].txt=this.value;fgCanvas()"></div><small class=f11 id=fnok${i}>${ok?'':'Expressão inválida.'}</small></div>`}).join('')+(f.fn.length<4?'<button class=tg type=button onclick="FG.f.fn.push({e:\'\',txt:\'\'});fgPainel()">+ Função</button>':'')+'<small class=f11>Use x, + − * / ^ e parênteses. Exemplos: 2x + 1, x^2 − 4, (x − 1)(x + 2).</small>'}
const fgV=v=>{const n=parseFloat(v);return isNaN(n)?0:n};
function fgLim(eixo,lado,v){const a=eixo?FG.f.y:FG.f.x,n=parseFloat(v);if(isNaN(n))return;const novo=a.slice();novo[lado]=Math.max(-40,Math.min(40,n));if(novo[1]-novo[0]<1)return;a[lado]=novo[lado];fgCanvas()}
function fgPasso(v){FG.f.passo=v;fgCanvas()}
function fgPtAdd(){const f=FG.f,n='ABCDEFGHIJKL'[f.pts.length]||'P';f.pts.push({n,x:Math.min(f.x[1],Math.max(f.x[0],0)),y:Math.min(f.y[1],Math.max(f.y[0],0)),co:true});fgCanvas();fgPainel()}
function fgFnOk(i,el){const g=FG.f.fn[i],s=$('#fnok'+i);if(s)s.textContent=!g.e||figExpr(g.e)?'':'Expressão inválida.'}
