/* Prova impressa: bloco de gabarito (10 × 4, compatível com o leitor), sorteio do tipo B,
   paginação automática em A4 com duas colunas e impressão. Medidas em pt (1 pt ≈ 0,353 mm). */
const PV={pt:841.9,w:595.3,mx:32,my:26,gap:18,fmin:.85,fmax:1.10};
PV.col=(PV.w-2*PV.mx-PV.gap)/2;PV.larg=PV.w-2*PV.mx;PV.blocoH=311.8;PV.blocoW=232.4;
const pvPt=px=>px*0.75;
/* O leitor localiza os 4 quadrados pretos (centros em 0,0 / 204,0 / 204,282 / 0,282) e lê as bolinhas em (56+40a, 55,5+23q) */
function provaBloco(){let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 228 306" width="82mm" height="110mm" style="display:block;font-family:Poppins,system-ui,sans-serif" role="img" aria-label="Folha de respostas"><rect x="-12" y="-12" width="228" height="306" fill="#fff"/>`;
  [[0,0],[204,0],[204,282],[0,282]].forEach(p=>{s+=`<rect x="${p[0]-4}" y="${p[1]-4}" width="8" height="8" fill="#000"/>`});
  s+=`<rect x="5" y="6" width="194" height="271.5" fill="#fff" stroke="#888" stroke-width="1"/><rect x="5.5" y="6.5" width="193" height="16.5" fill="#ccc"/><text x="102" y="15" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="700" fill="#111">GABARITO</text><rect x="5.5" y="23" width="193" height="21" fill="#e4e4e4"/>`;
  for(let a=0;a<4;a++)s+=`<text x="${56+40*a}" y="33.8" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="700" fill="#111">${'ABCD'[a]}</text>`;
  for(let q=0;q<10;q++){const y=55.5+23*q;s+=`<line x1="5.5" y1="${y-11.5}" x2="198.5" y2="${y-11.5}" stroke="#888" stroke-width=".6"/><text x="21" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="8.5" font-weight="700" fill="#111">Q.${q+1}</text>`;
    for(let a=0;a<4;a++)s+=`<circle cx="${56+40*a}" cy="${y}" r="7.2" fill="#fff" stroke="#111" stroke-width="1"/>`}
  return s+'</svg>'}

/* ---------- sorteio do tipo B ---------- */
const pvRng=seed=>{let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
const pvTrava=(av,q)=>{const t=av.cfg&&av.cfg.trava;if(t&&t[q.id]!==undefined)return !!t[q.id];return q.alts.some(a=>/todas as anteriores|nenhuma d[ae]s?|ambas|alternativas anteriores|n[aã]o h[aá]/i.test(a))};
function pvVersao(av,tipo,Q){const base=av.q.map(id=>Q[id]).filter(Boolean),L='ABCD';
  const A=base.map(q=>({q,alts:q.alts.slice(),correta:q.correta}));if(tipo!='B')return A;
  const sem=(av.cfg&&av.cfg.seedB)||1;let melhor=null,mv=1e9;
  for(let t=0;t<400&&mv>0;t++){const r=pvRng(sem*1000+t),ord=base.map((_,i)=>i);for(let i=ord.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[ord[i],ord[j]]=[ord[j],ord[i]]}
    const B=[];let viol=0;
    for(let i=0;i<ord.length;i++){const q=base[ord[i]],a=A[i]?A[i].correta:'',orig=L.indexOf(q.correta);
      if(q.tipo=='discursiva'||!q.alts.some(Boolean)||orig<0){B.push({q,alts:q.alts.slice(),correta:q.correta});continue}
      if(pvTrava(av,q)){if(q.correta==a)viol++;B.push({q,alts:q.alts.slice(),correta:q.correta});continue}
      const perm=[0,1,2,3].filter(k=>k!=orig),op=L.split('').filter(c=>c!=a),alvo=L.indexOf(op[Math.floor(r()*op.length)]);
      for(let k=perm.length-1;k>0;k--){const j=Math.floor(r()*(k+1));[perm[k],perm[j]]=[perm[j],perm[k]]}
      const novo=Array(4);novo[alvo]=q.alts[orig];let pp=0;for(let k=0;k<4;k++)if(k!=alvo)novo[k]=q.alts[perm[pp++]];B.push({q,alts:novo,correta:L[alvo]})}
    if(viol<mv){mv=viol;melhor=B}}
  melhor.iguais=mv;return melhor}

/* ---------- elementos ---------- */
const pvTx=t=>esc(t==null?'':t).replace(/\n/g,'<br>');
const pvAltCls=alts=>{const m=Math.max(0,...alts.map(a=>String(a).replace(/\$[^$]*\$/g,'xx').length));return m<=8?'a1':m<=26?'a2':'a3'};
function pvQEl(v,n){const q=v.q,d=document.createElement('div'),fg=figHtml(q.figura,420);let fw=0;
  if(fg){const m=fg.match(/ width="(\d+)"/);fw=m?+m[1]*0.72:200}
  const dis=q.tipo=='discursiva',L=dis?(q.itens||[]):v.alts;
  d.className='pvq';d.innerHTML=`<div class=pve><b>Q.${n}.</b> ${pvTx(q.enunciado)}</div>${fg?`<div class=pvf style="width:calc(${fw.toFixed(1)}pt*var(--s,1));max-width:100%">${fg}</div>`:''}<div class="pva ${dis?'a3':pvAltCls(L)}">${L.map((a,i)=>`<span><b>${'abcdefghijkl'[i]})</b> ${pvTx(a)}</span>`).join('')}</div>`;return d}
const pvEsc=()=>S.esc||{};
function pvHeader(av,p1){const e=pvEsc(),nm=String(e.nome||'').toUpperCase(),logo=e.logo?`<img src="${e.logo}" alt="" style="width:${p1?66:44}pt;height:${p1?66:44}pt;object-fit:contain;flex:none">`:'';
  const prof=`<span><b>PROFESSOR</b>: ${esc(String(av.professor||e.professor||'').toUpperCase())}</span><span><b>DISCIPLINA</b>: ${esc(String(av.disciplina||e.disciplina||'').toUpperCase())}</span>`,d=document.createElement('div');
  if(!p1){d.className='pvh2';d.innerHTML=`${logo}<div style="flex:1;min-width:0;line-height:1.6"><div style="font-size:10.5pt;font-weight:700">${esc(nm)}</div><div style="display:flex;justify-content:space-between;font-size:9pt">${prof}</div></div>`;return d}
  d.className='pvh1';d.innerHTML=`<div class=pvh1a>${logo}<div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between;align-items:center;height:26pt"><span style="font-size:11.5pt;font-weight:700">${esc(nm)}</span><span class=pvnota>Nota</span></div><div style="display:flex;justify-content:space-between;font-size:9.5pt;margin-top:6pt">${prof}</div></div></div>
    <div class=pvaluno><span style="flex:1">ALUNO: ________________________________________</span><span>SÉRIE/TURMA: ${av.turma?esc(String(av.turma).toUpperCase()):'__________'}</span></div><div class=pvtit>${esc(pvTitulo(av))}</div>`;return d}
const pvTitulo=av=>[av.tipoAv||'SIMULADO',String(av.disciplina||pvEsc().disciplina||'').toUpperCase(),av.numero].filter(Boolean).join(' - ').toUpperCase();
function pvOri(av){const d=document.createElement('div'),L=(av.cfg&&av.cfg.ori)||PV_ORI;d.className='pvo';d.innerHTML=`<div class=pvot>ORIENTAÇÕES:</div><ul>${L.filter(x=>String(x).trim()).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;return d}
const PV_ORI=['Assinale no gabarito apenas uma alternativa por questão;','Marque a alternativa usando caneta na cor azul ou preta;','Preencha completamente a região de cada alternativa.'];

/* ---------- paginação ---------- */
const pvGap=2;   // pt de folga entre itens, além do espaçamento da própria questão
function pvEmpacota(H,o){const cap=k=>PV.pt-2*PV.my-(k<2?o.h1:o.h2)-(o.res||0),cols=[{itens:[],usado:o.fixo}];let estouro=false;
  H.forEach((h,i)=>{let ci=cols.length-1,c=cols[ci];if(c.usado+h>cap(ci)+.01&&c.itens.length){cols.push({itens:[],usado:0});ci++;c=cols[ci]}
    if(c.usado+h>cap(ci)+.01)estouro=true;c.itens.push(i);c.usado+=h});
  if(cols.length%2)cols.push({itens:[],usado:0});return{cols,estouro,pags:cols.length/2,cap}}
function pvPack(H,o){let r=pvEmpacota(H,{...o,res:0});const ult=r.pags-1;
  if(r.cols.some((c,k)=>Math.floor(k/2)==ult&&c.usado>r.cap(k)-24+.01))r=pvEmpacota(H,{...o,res:24});return r}
async function provaMontar(av,tipo,Q){await carregaKatex().catch(()=>{});
  const V=pvVersao(av,tipo,Q),folha=av.cfg&&av.cfg.folha!==false,esp=!av.cfg||av.cfg.esp!==false,fixo=av.cfg&&av.cfg.texto=='fixo';
  const med=document.createElement('div');med.className='pvbox';med.style.cssText=`position:absolute;left:-9999px;top:0;width:${PV.col}pt;visibility:hidden`;document.body.appendChild(med);
  const els=V.map((v,i)=>pvQEl(v,i+1));els.forEach(e=>med.appendChild(e));const ori=pvOri(av);med.appendChild(ori);
  const mh=document.createElement('div');mh.className='pvbox';mh.style.cssText=`position:absolute;left:-9999px;top:0;width:${PV.larg}pt;visibility:hidden`;document.body.appendChild(mh);
  const e1=pvHeader(av,true),e2=pvHeader(av,false);mh.appendChild(e1);mh.appendChild(e2);
  await mat(med);try{await document.fonts.ready}catch(x){}
  const mg=e=>parseFloat(getComputedStyle(e).marginBottom)||0,h1=pvPt(e1.offsetHeight+mg(e1)),h2=pvPt(e2.offsetHeight+mg(e2));
  const mede=s=>{med.style.setProperty('--s',s);return{H:els.map(e=>pvPt(e.offsetHeight+mg(e))+pvGap),fixo:pvPt(ori.offsetHeight+mg(ori))+(folha?PV.blocoH+10:0)}};
  let esc=1,res=null;const tent=[];
  if(fixo){const m=mede(1);res=pvPack(m.H,{h1,h2,fixo:m.fixo})}
  else{for(let k=Math.round(PV.fmax*100);k>=Math.round(PV.fmin*100);k--){const s=k/100,m=mede(s),r=pvPack(m.H,{h1,h2,fixo:m.fixo});tent.push({s,r})}
    const ok=tent.filter(t=>!t.r.estouro),pool=ok.length?ok:tent,minP=Math.min(...pool.map(t=>t.r.pags)),esc0=pool.find(t=>t.r.pags==minP);esc=esc0.s;res=esc0.r}
  if(fixo)esc=1;const fin=mede(esc);
  const pgs=[];
  for(let n=0;n<res.pags;n++){const pg=document.createElement('div');pg.className='pvpg';pg.style.setProperty('--s',esc);
    pg.appendChild(n==0?pvHeader(av,true):pvHeader(av,false));const g=document.createElement('div');g.className='pvcols';
    [0,1].forEach(lado=>{const k=n*2+lado,c=res.cols[k],col=document.createElement('div');col.className='pvcol';
      if(k==0){col.appendChild(pvOri(av));if(folha){const b=document.createElement('div');b.className='pvbl';b.innerHTML=provaBloco();col.appendChild(b)}}
      c.itens.forEach((i,j)=>{const e=els[i].cloneNode(true);if(j==c.itens.length-1||av.cfg&&av.cfg.fil===false)e.classList.add('ult');col.appendChild(e)});
      const livre=res.cap(k)-c.usado-(c.itens.length?0:0);
      if(esp&&livre-12>=56&&(k!=0||c.itens.length)){const b=document.createElement('div');b.className='pvesp';b.style.height=(livre-12).toFixed(1)+'pt';b.innerHTML='<span>ESPAÇO PARA CÁLCULOS</span>';col.appendChild(b)}
      g.appendChild(col)});
    pg.appendChild(g);if(n==res.pags-1){const f=document.createElement('div');f.className='pvfim';f.textContent='BOM DESEMPENHO!';pg.appendChild(f)}pgs.push(pg)}
  med.remove();mh.remove();
  return{pages:pgs,esc,pags:res.pags,estouro:res.estouro,gab:V.map(v=>v.correta),V}}
/* ---------- impressão ---------- */
function provaImprime(pgs,titulo){let pr=$('#pr');if(!pr){pr=document.createElement('div');pr.id='pr';document.body.appendChild(pr)}
  pr.innerHTML='';pgs.forEach(p=>{const c=p.cloneNode(true);pr.appendChild(c)});
  const st=document.createElement('style');st.textContent='@page{size:A4;margin:0}';document.head.appendChild(st);const old=document.title;document.title=titulo;
  const lim=()=>{pr.innerHTML='';st.remove();document.title=old;removeEventListener('afterprint',lim)};addEventListener('afterprint',lim);setTimeout(()=>window.print(),150)}
