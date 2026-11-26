/* Figuras geométricas: desenho no padrão do Syntese (polígonos, circunferência e plano cartesiano).
   Usado pelo editor de questões e, depois, pela prova e pelos slides. */
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
function figInnerPoly(f){const P=f.p,N=P.length,T=`font-family:${FG_FONT};fill:#111;stroke:#fff;stroke-width:3.2px;stroke-linejoin:round;paint-order:stroke`,bb=[1e9,1e9,-1e9,-1e9],
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


const figRad=g=>g*Math.PI/180;
let FGID=0;
const figN=v=>(+v).toFixed(1);
function figTxt(bb,x,y,s,z,w,rot){const T=`font-family:${FG_FONT};fill:#111;stroke:#fff;stroke-width:3.2px;stroke-linejoin:round;paint-order:stroke`;s=String(s);const k=s.length*z*.56;
  bb[0]=Math.min(bb[0],x-k/2);bb[1]=Math.min(bb[1],y-z*.6);bb[2]=Math.max(bb[2],x+k/2);bb[3]=Math.max(bb[3],y+z*.6);
  return `<text x="${figN(x)}" y="${figN(y+z*.36)}" text-anchor="middle" font-size="${z}" font-weight="${w}" style="${T}"${rot?` transform="rotate(${figN(rot)} ${figN(x)} ${figN(y)})"`:''}>${esc(s)}</text>`}
function figExt(bb,x,y,w,h){bb[0]=Math.min(bb[0],x-w);bb[1]=Math.min(bb[1],y-h);bb[2]=Math.max(bb[2],x+w);bb[3]=Math.max(bb[3],y+h)}

/* ---------- Circunferência ---------- */
const FG_C0=[165,85],FG_R=70;
function figNovaCirc(){return{t:'circ',c:'O',nm:true,cn:true,pts:[{n:'A',a:200},{n:'B',a:340},{n:'C',a:90}],seg:[{i:-1,j:0,txt:'',d:0},{i:-1,j:1,txt:'',d:0}],ang:[{v:-1,a:0,b:1,txt:'',arco:null,sombra:0,fora:0,inv:0,reto:0}]}}
const figPc=(f,i)=>i<0?FG_C0:[FG_C0[0]+FG_R*Math.cos(figRad(f.pts[i].a)),FG_C0[1]-FG_R*Math.sin(figRad(f.pts[i].a))];
function figArcoLado(p,a1,a2,r,inv){let d=a2-a1;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;if(inv)d=d>0?d-2*Math.PI:d+2*Math.PI;
  const x2=p[0]+r*Math.cos(a1+d),y2=p[1]+r*Math.sin(a1+d);return{d,path:`M${figN(p[0]+r*Math.cos(a1))} ${figN(p[1]+r*Math.sin(a1))}A${r} ${r} 0 ${Math.abs(d)>Math.PI?1:0} ${d>0?1:0} ${figN(x2)} ${figN(y2)}`}}
function figInnerCirc(f){const bb=[1e9,1e9,-1e9,-1e9],C=FG_C0,R=FG_R,P=i=>figPc(f,i),pts=f.pts||[];let o='';
  const ok=i=>i===-1||(i>=0&&i<pts.length);
  (f.ang||[]).forEach(g=>{if(g.sombra&&g.v===-1&&ok(g.a)&&ok(g.b)&&g.a>=0&&g.b>=0){const pa=P(g.a),pb=P(g.b),a1=Math.atan2(pa[1]-C[1],pa[0]-C[0]),a2=Math.atan2(pb[1]-C[1],pb[0]-C[0]),ar=figArcoLado(C,a1,a2,R,g.inv);
    o+=`<path d="M${C[0]} ${C[1]}L${figN(pa[0])} ${figN(pa[1])}${ar.path.replace(/^M[^A]*/,'')}Z" fill="#d6d6d6" stroke="none"/>`}});
  o+=`<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="none" stroke="#111" stroke-width="1.6"/>`;figExt(bb,C[0],C[1],R,R);
  (f.seg||[]).forEach(s=>{if(!ok(s.i)||!ok(s.j)||s.i===s.j)return;const p=P(s.i),q=P(s.j);
    o+=`<line x1="${figN(p[0])}" y1="${figN(p[1])}" x2="${figN(q[0])}" y2="${figN(q[1])}" stroke="#111" stroke-width="1.6"${s.d?' stroke-dasharray="5 3"':''}/>`;
    if(s.txt){const mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2,L=Math.hypot(q[0]-p[0],q[1]-p[1])||1;let th=Math.atan2(q[1]-p[1],q[0]-p[0])*180/Math.PI;if(th>90)th-=180;if(th<=-90)th+=180;
      const r=th*Math.PI/180,off=10;o+=figTxt(bb,mx+Math.sin(r)*off,my-Math.cos(r)*off,s.txt,12.5,400,th)}});
  if(f.cn!==false){o+=`<circle cx="${C[0]}" cy="${C[1]}" r="2.8" fill="#111"/>`;
    if(f.nm&&f.c){let sx=0,sy=0;const add=i=>{if(i>=0&&i<pts.length){const q=P(i),u=figU(C,q);sx+=u[0];sy+=u[1]}};
      (f.seg||[]).forEach(s=>{if(s.i===-1)add(s.j);else if(s.j===-1)add(s.i)});(f.ang||[]).forEach(g=>{if(g.v===-1){add(g.a);add(g.b)}});
      const L=Math.hypot(sx,sy);let lx=C[0]+10,ly=C[1]+13;if(L>.4){lx=C[0]-sx/L*14;ly=C[1]-sy/L*14}o+=figTxt(bb,lx,ly,f.c,15,600)}}
  pts.forEach((p,i)=>{const q=P(i);o+=`<circle cx="${figN(q[0])}" cy="${figN(q[1])}" r="2.8" fill="#111"/>`;figExt(bb,q[0],q[1],3,3);
    if(f.nm){const dx=q[0]-C[0],dy=q[1]-C[1],n=Math.hypot(dx,dy)||1;o+=figTxt(bb,q[0]+dx/n*15,q[1]+dy/n*15,p.n||'',15,600)}});
  (f.ang||[]).forEach(g=>{if(!ok(g.v)||!ok(g.a)||!ok(g.b)||g.v===g.a||g.v===g.b||g.a===g.b)return;const v=P(g.v),pa=P(g.a),pb=P(g.b),u1=figU(v,pa),u2=figU(v,pb),r=g.v===-1?24:18,a1=Math.atan2(u1[1],u1[0]),a2=Math.atan2(u2[1],u2[0]);
    if(g.reto){const s=11;o+=`<polyline points="${figN(v[0]+u1[0]*s)},${figN(v[1]+u1[1]*s)} ${figN(v[0]+(u1[0]+u2[0])*s)},${figN(v[1]+(u1[1]+u2[1])*s)} ${figN(v[0]+u2[0]*s)},${figN(v[1]+u2[1]*s)}" fill="none" stroke="#111" stroke-width="1.4"/>`}
    else if(g.arco===true||(g.arco!==false&&g.arco!==0&&g.txt)||(g.arco==null&&g.txt)){o+=`<path d="${figArcoLado(v,a1,a2,r,g.inv).path}" fill="none" stroke="#111" stroke-width="1.4"/>`}
    if(g.txt){let bx=u1[0]+u2[0],by=u1[1]+u2[1];if(g.inv){bx=-bx;by=-by}const bl=Math.hypot(bx,by)||1,X=bx/bl,Y=by/bl,z=12.5,w=String(g.txt).length*z*.56,sg=g.fora?-1:1,d=r+5+Math.abs(X)*w/2+Math.abs(Y)*z*.55;o+=figTxt(bb,v[0]+X*d*sg,v[1]+Y*d*sg,g.txt,z,400)}});
  return{o,bb}}

/* ---------- Expressões em x (para gráficos de funções) ---------- */
function figExpr(src){let s=String(src||'').toLowerCase().replace(/\s+/g,'').replace(/,/g,'.').replace(/[−–]/g,'-').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/²/g,'^2').replace(/³/g,'^3').replace(/^(y|f\(x\))=/,'');
  if(!s)return null;const T=[];let i=0;
  while(i<s.length){const c=s[i];if(/[0-9.]/.test(c)){let j=i;while(j<s.length&&/[0-9.]/.test(s[j]))j++;const n=parseFloat(s.slice(i,j));if(isNaN(n))return null;T.push({n});i=j}
    else if(c=='x'){T.push({v:1});i++}else if(s.startsWith('pi',i)){T.push({n:Math.PI});i+=2}
    else if(/[a-z]/.test(c)){let j=i;while(j<s.length&&/[a-z]/.test(s[j]))j++;const f=s.slice(i,j);if(!['sqrt','abs','sen','sin','cos','tan'].includes(f))return null;T.push({f});i=j}
    else if('+-*/^()'.includes(c)){T.push({o:c});i++}else return null}
  const V=[];T.forEach((t,k)=>{V.push(t);const a=T[k+1];if(!a)return;const fim=t.n!==undefined||t.v||t.o==')',ini=a.n!==undefined||a.v||a.f||a.o=='(';if(fim&&ini)V.push({o:'*'})});
  let p=0;const pk=()=>V[p],er=()=>{throw 0};
  const E=()=>{let a=Tm();while(pk()&&(pk().o=='+'||pk().o=='-')){const o=V[p++].o,b=Tm(),l=a;a=o=='+'?x=>l(x)+b(x):x=>l(x)-b(x)}return a};
  const Tm=()=>{let a=U();while(pk()&&(pk().o=='*'||pk().o=='/')){const o=V[p++].o,b=U(),l=a;a=o=='*'?x=>l(x)*b(x):x=>l(x)/b(x)}return a};
  const U=()=>{if(pk()&&pk().o=='-'){p++;const a=U();return x=>-a(x)}if(pk()&&pk().o=='+'){p++;return U()}return Pw()};
  const Pw=()=>{const a=At();if(pk()&&pk().o=='^'){p++;const b=U();return x=>Math.pow(a(x),b(x))}return a};
  const At=()=>{const t=V[p++];if(!t)er();if(t.n!==undefined)return()=>t.n;if(t.v)return x=>x;
    if(t.o=='('){const a=E();if(!pk()||pk().o!=')')er();p++;return a}
    if(t.f){if(!pk()||pk().o!='(')er();p++;const a=E();if(!pk()||pk().o!=')')er();p++;const F={sqrt:Math.sqrt,abs:Math.abs,sen:Math.sin,sin:Math.sin,cos:Math.cos,tan:Math.tan}[t.f];return x=>F(a(x))}er()};
  try{const f=E();if(p<V.length)return null;f(1);return f}catch(e){return null}}

/* ---------- Plano cartesiano ---------- */
function figNovaCart(){return{t:'cart',x:[-5,5],y:[-5,5],passo:1,grade:true,nums:true,pts:[{n:'A',x:2,y:3,co:true}],liga:'',fecha:false,fn:[]}}
function figInnerCart(f,s,ox,oy){s=s||22;ox=ox||0;oy=oy||0;const[x0,x1]=f.x,[y0,y1]=f.y,W=(x1-x0)*s,H=(y1-y0)*s,X=x=>ox+(x-x0)*s,Y=y=>oy+(y1-y)*s,bb=[ox,oy,ox+W,oy+H],pt=f.passo||1,id='cp'+(++FGID);let o='';
  o+=`<defs><clipPath id="${id}"><rect x="${ox}" y="${oy}" width="${W}" height="${H}"/></clipPath></defs>`;
  if(f.grade){for(let k=Math.ceil(x0/pt)*pt;k<=x1+1e-9;k+=pt)o+=`<line x1="${figN(X(k))}" y1="${oy}" x2="${figN(X(k))}" y2="${oy+H}" stroke="#d4d4d4" stroke-width=".8"/>`;
    for(let k=Math.ceil(y0/pt)*pt;k<=y1+1e-9;k+=pt)o+=`<line x1="${ox}" y1="${figN(Y(k))}" x2="${ox+W}" y2="${figN(Y(k))}" stroke="#d4d4d4" stroke-width=".8"/>`}
  const ax=Math.min(Math.max(0,x0),x1),ay=Math.min(Math.max(0,y0),y1),px=X(ax),py=Y(ay);
  o+=`<line x1="${ox-6}" y1="${figN(py)}" x2="${ox+W+8}" y2="${figN(py)}" stroke="#111" stroke-width="1.4"/><line x1="${figN(px)}" y1="${oy+H+6}" x2="${figN(px)}" y2="${oy-8}" stroke="#111" stroke-width="1.4"/>`;
  o+=`<path d="M${ox+W+9} ${figN(py)}l-6 -3v6z" fill="#111"/><path d="M${figN(px)} ${oy-9}l-3 6h6z" fill="#111"/>`;figExt(bb,ox+W+9,py,0,4);figExt(bb,px,oy-9,4,0);
  o+=figTxt(bb,ox+W+14,py+9,'x',12.5,400)+figTxt(bb,px+11,oy-8,'y',12.5,400);
  if(f.nums!==false){for(let k=Math.ceil(x0/pt)*pt;k<=x1+1e-9;k+=pt){if(Math.abs(k)<1e-9)continue;o+=`<line x1="${figN(X(k))}" y1="${figN(py-3)}" x2="${figN(X(k))}" y2="${figN(py+3)}" stroke="#111" stroke-width="1"/>`+figTxt(bb,X(k),py+12,String(+k.toFixed(2)),10.5,400)}
    for(let k=Math.ceil(y0/pt)*pt;k<=y1+1e-9;k+=pt){if(Math.abs(k)<1e-9)continue;o+=`<line x1="${figN(px-3)}" y1="${figN(Y(k))}" x2="${figN(px+3)}" y2="${figN(Y(k))}" stroke="#111" stroke-width="1"/>`+figTxt(bb,px-11,Y(k),String(+k.toFixed(2)),10.5,400)}
    if(x0<=0&&x1>=0&&y0<=0&&y1>=0)o+=figTxt(bb,px-8,py+11,'0',10.5,400)}
  (f.fn||[]).forEach(g=>{const F=figExpr(g.e);if(!F)return;let d='',pen=false,last=null;const n=320;
    for(let k=0;k<=n;k++){const x=x0+(x1-x0)*k/n,y=F(x);if(!isFinite(y)||Math.abs(y)>1e4||(last!==null&&Math.abs(y-last)>(y1-y0)*4)){pen=false;last=null;continue}
      d+=(pen?'L':'M')+figN(X(x))+' '+figN(Y(y));pen=true;last=y}
    if(d)o+=`<path d="${d}" fill="none" stroke="#111" stroke-width="1.7" clip-path="url(#${id})"/>`;
    if(g.txt){let bx=x1-(x1-x0)*.04,by=F(bx);if(!isFinite(by)||by>y1||by<y0){for(let k=n;k>=0;k--){const x=x0+(x1-x0)*k/n,y=F(x);if(isFinite(y)&&y<=y1&&y>=y0){bx=x;by=y;break}}}
      if(isFinite(by)&&by<=y1&&by>=y0)o+=figTxt(bb,Math.min(X(bx)+4,ox+W-String(g.txt).length*3.5),Math.max(oy+8,Y(by)-12),g.txt,12.5,400)}});
  const pm={};(f.pts||[]).forEach(p=>{pm[p.n]=p});
  const seq=String(f.liga||'').trim().split(/[\s,;-]+/).filter(n=>pm[n]);
  if(seq.length>1)o+=`<${f.fecha?'polygon':'polyline'} points="${seq.map(n=>figN(X(pm[n].x))+','+figN(Y(pm[n].y))).join(' ')}" fill="none" stroke="#111" stroke-width="1.7" stroke-linejoin="round"/>`;
  (f.pts||[]).forEach(p=>{o+=`<circle cx="${figN(X(p.x))}" cy="${figN(Y(p.y))}" r="3" fill="#111"/>`;
    const t=(p.n||'')+(p.co?`(${String(p.x).replace('.',',')}, ${String(p.y).replace('.',',')})`:'');if(t)o+=figTxt(bb,X(p.x)+8+t.length*3.4,Y(p.y)-10,t,12.5,600)});
  return{o,bb,s,ox,oy}}

/* ---------- Tabelas (dados e frequência) ---------- */
const figFmt=(n,d)=>String(+(+n).toFixed(d)).replace('.',',');
function figNovaTab(m){return m=='freq'?{t:'tab',modo:'freq',tit:'',rot:'Valor',fl:[{x:'A',f:5},{x:'B',f:8},{x:'C',f:7}],fr:true,pc:true,fac:false,total:true,dest:true,neg1:false}
  :{t:'tab',modo:'dados',tit:'',cab:['Mês','Vendas'],lin:[['Janeiro','10'],['Fevereiro','15'],['Março','12']],dest:true,neg1:false}}
function figInnerTab(f){const z=12.5,pad=10,lh=15,tw=s=>String(s).length*z*.6;let cab,lin;const neg=[];
  if(f.modo=='freq'){const L=f.fl||[],tot=L.reduce((s,r)=>s+(+r.f||0),0);cab=[f.rot||'Valor','Frequência\nabsoluta'];if(f.fr)cab.push('Frequência\nrelativa');if(f.pc)cab.push('Frequência\n(%)');if(f.fac)cab.push('Frequência\nacumulada');
    let ac=0;lin=L.map(r=>{const v=+r.f||0;ac+=v;const row=[r.x||'',figFmt(v,0)];if(f.fr)row.push(tot?figFmt(v/tot,3):'0');if(f.pc)row.push(tot?figFmt(v/tot*100,1)+'%':'0%');if(f.fac)row.push(figFmt(ac,0));return row});
    if(f.total!==false){const row=['Total',figFmt(tot,0)];if(f.fr)row.push(tot?'1':'0');if(f.pc)row.push(tot?'100%':'0%');if(f.fac)row.push('—');lin.push(row);neg.push(lin.length-1)}}
  else{cab=(f.cab||[]).slice();lin=(f.lin||[]).map(r=>r.slice())}
  const nc=Math.max(cab.length,...lin.map(r=>r.length),1),L=s=>String(s==null?'':s).split('\n');
  const cw=Array.from({length:nc},(_,c)=>Math.max(46,Math.max(...[cab[c],...lin.map(r=>r[c])].map(s=>Math.max(...L(s).map(tw))))+2*pad)),W=cw.reduce((a,b)=>a+b,0);
  const hl=Math.max(1,...cab.map(s=>L(s).length)),hH=hl*lh+10,rH=lin.map(r=>Math.max(1,...r.map(s=>L(s).length))*lh+10),Ht=hH+rH.reduce((a,b)=>a+b,0);
  let o='',y=0;const dest=f.dest!==false,tt=f.tit?24:0;
  const cell=(c,yy,h,s,w)=>{const x=cw.slice(0,c).reduce((a,b)=>a+b,0)+cw[c]/2,ls=L(s),y0=yy+h/2-(ls.length-1)*lh/2;return ls.map((t,i)=>figTxt([1e9,1e9,-1e9,-1e9],x,y0+i*lh,t,z,w)).join('')};
  if(dest)o+=`<rect x="0" y="0" width="${W}" height="${hH}" fill="#e6e6e6"/>`;
  for(let c=0;c<nc;c++)o+=cell(c,0,hH,cab[c]||'',dest?600:400);
  y=hH;lin.forEach((r,i)=>{for(let c=0;c<nc;c++)o+=cell(c,y,rH[i],r[c]==null?'':r[c],(neg.includes(i)||(f.neg1&&c==0))?600:400);y+=rH[i]});
  let yy=hH;o+=`<line x1="0" y1="${hH}" x2="${W}" y2="${hH}" stroke="#111" stroke-width="1.4"/>`;rH.forEach((h,i)=>{yy+=h;if(i<rH.length-1)o+=`<line x1="0" y1="${yy}" x2="${W}" y2="${yy}" stroke="#111" stroke-width="1"/>`});
  let xx=0;cw.forEach((w,c)=>{xx+=w;if(c<nc-1)o+=`<line x1="${xx}" y1="0" x2="${xx}" y2="${Ht}" stroke="#111" stroke-width="1"/>`});
  o+=`<rect x="0" y="0" width="${W}" height="${Ht}" fill="none" stroke="#111" stroke-width="1.5"/>`;
  const bb=[-2,-2-tt,W+2,Ht+2];if(f.tit)o+=figTxt(bb,W/2,-14,f.tit,13,600);
  return{o,bb}}

/* ---------- Gráficos ---------- */
const FG_GR=['#cfcfcf','#7f7f7f','#f2f2f2'],FG_CO=['#4e79a7','#f28e2b','#59a14f','#e15759','#b07aa1','#76b7b2'],FG_PZ=['#e4e4e4','#8e8e8e','#cbcbcb','#5f5f5f','#f4f4f4','#a9a9a9'];
function figNice(max){if(!(max>0))return{m:1,s:.2};const raw=max/5,mag=Math.pow(10,Math.floor(Math.log10(raw))),n=raw/mag,st=(n<=1?1:n<=2?2:n<=5?5:10)*mag;return{s:st,m:Math.ceil(max/st-1e-9)*st}}
function figNovaGraf(){return{t:'graf',k:'col',tit:'',ex:'',ey:'',ser:['Série 1'],cats:[{n:'A',v:[10]},{n:'B',v:[15]},{n:'C',v:[8]}],val:true,grade:true,cor:false,ini:0,amp:10,pc:'pc',u:10,sim:'circ',un:'',ymax:0}}
const figWrap=(s,n)=>{s=String(s);if(s.length<=n)return[s];const p=s.split(' '),L=[''];p.forEach(w=>{const l=L[L.length-1];if(l&&(l+' '+w).length>n)L.push(w);else L[L.length-1]=l?l+' '+w:w});return L.slice(0,3)};
function figSimbolo(k,x,y,sz,fill,id,fr){let s='',r=sz/2;const cl=fr<1?` clip-path="url(#${id})"`:'';
  if(fr<1)s+=`<clipPath id="${id}"><rect x="${x-r}" y="${y-r}" width="${sz*fr}" height="${sz}"/></clipPath>`;
  if(k=='quad')s+=`<rect x="${x-r+1}" y="${y-r+1}" width="${sz-2}" height="${sz-2}" fill="${fill}" stroke="#111" stroke-width="1.2"${cl}/>`;
  else if(k=='est'){const P=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r*.45:r;P.push(figN(x+q*Math.cos(a))+','+figN(y+q*Math.sin(a)))}s+=`<polygon points="${P.join(' ')}" fill="${fill}" stroke="#111" stroke-width="1.1"${cl}/>`}
  else if(k=='pess')s+=`<g${cl}><circle cx="${x}" cy="${y-r+3}" r="2.8" fill="${fill}" stroke="#111" stroke-width="1.1"/><path d="M${x-r+2} ${y+r-1}v-5a${r-2} 3.5 0 0 1 ${2*r-4} 0v5z" fill="${fill}" stroke="#111" stroke-width="1.1"/></g>`;
  else s+=`<circle cx="${x}" cy="${y}" r="${r-1}" fill="${fill}" stroke="#111" stroke-width="1.2"${cl}/>`;return s}
function figInnerGraf(f){const k=f.k,ser=(f.ser&&f.ser.length?f.ser:['Série 1']).slice(0,3),ns=['pizza','pict','hist'].includes(k)?1:ser.length,cats=f.cats||[],n=cats.length,W=300;let H=210;
  const bb=[0,0,W,H],B=[1e9,1e9,-1e9,-1e9],T=(x,y,s,z,w,a,rot)=>{const st=`font-family:${FG_FONT};fill:#111;stroke:#fff;stroke-width:3px;stroke-linejoin:round;paint-order:stroke`;return `<text x="${figN(x)}" y="${figN(y+z*.36)}" text-anchor="${a||'middle'}" font-size="${z}" font-weight="${w||400}" style="${st}"${rot?` transform="rotate(${rot} ${figN(x)} ${figN(y)})"`:''}>${esc(s)}</text>`};
  const id='g'+(++FGID),cor=i=>f.cor?FG_CO[i%6]:FG_GR[i%3],fill=i=>(!f.cor&&i%3==2)?`url(#${id}h)`:cor(i),V=cats.map(c=>(c.v||[]).map(x=>+x||0));
  let o=`<defs><pattern id="${id}h" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="5" fill="#fff"/><line x1="0" y1="0" x2="0" y2="5" stroke="#111" stroke-width="1.2"/></pattern></defs>`;
  const top0=f.tit?28:12;if(f.tit)o+=T(W/2,13,f.tit,13,600);
  const leg=()=>{let s='',x=W-12;if(ns<2)return s;const items=ser.slice(0,ns).map((nm,i)=>({nm,w:String(nm).length*6.4+22}));let tx=W-12-items.reduce((a,b)=>a+b.w,0);if(tx<8)tx=8;
    items.forEach((it,i)=>{s+=`<rect x="${tx}" y="${top0+1}" width="10" height="10" fill="${fill(i)}" stroke="#111" stroke-width="1"/>`+T(tx+14,top0+6,it.nm,11,400,'start');tx+=it.w});return s};
  if(k=='pizza'){const tot=V.reduce((a,r)=>a+(r[0]||0),0),R=Math.min(60,(H-top0)/2-26),cx=W/2,cy=top0+(H-top0)/2+2;let a0=-Math.PI/2;
    if(!(tot>0))return{o:o+T(cx,cy,'Informe valores',12,400),bb};
    cats.forEach((c,i)=>{const v=V[i][0]||0;if(v<=0)return;const a=2*Math.PI*v/tot,a1=a0+a,pct=v/tot*100,fl=f.cor?FG_CO[i%6]:FG_PZ[i%6];
      if(v==tot)o+=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${fl}" stroke="#111" stroke-width="1.2"/>`;
      else o+=`<path d="M${cx} ${cy}L${figN(cx+R*Math.cos(a0))} ${figN(cy+R*Math.sin(a0))}A${R} ${R} 0 ${a>Math.PI?1:0} 1 ${figN(cx+R*Math.cos(a1))} ${figN(cy+R*Math.sin(a1))}Z" fill="${fl}" stroke="#111" stroke-width="1.2" stroke-linejoin="round"/>`;
      const am=a0+a/2,lx=cx+(R+12)*Math.cos(am),ly=cy+(R+12)*Math.sin(am),an=Math.cos(am)>.25?'start':Math.cos(am)<-.25?'end':'middle',vt=f.pc=='v'?figFmt(v,2):f.pc=='ambos'?figFmt(v,2)+' ('+figFmt(pct,1)+'%)':f.pc=='nenhum'?'':figFmt(pct,1)+'%';
      const ls=[c.n||'',vt].filter(Boolean),dy=Math.sin(am)<-.5?-(ls.length-1)*13:Math.sin(am)>.5?0:-(ls.length-1)*6.5;ls.forEach((t,j)=>{o+=T(lx+(an=='start'?3:an=='end'?-3:0),ly+dy+j*13,t,11,j?400:600,an)});a0=a1});
    return{o,bb}}
  if(k=='pict'){const u=+f.u>0?+f.u:1,lw=Math.min(110,Math.max(40,Math.max(0,...cats.map(c=>String(c.n||'').length))*6.4+14)),sz=15,rh=22,x0=12+lw;
    H=top0+n*rh+34;bb[3]=H;let y=top0+8;cats.forEach((c,i)=>{const v=V[i][0]||0,cnt=v/u,full=Math.floor(cnt+1e-9),fr=cnt-full;o+=T(x0-8,y,c.n||'',11.5,400,'end');
      for(let j=0;j<full;j++)o+=figSimbolo(f.sim,x0+j*(sz+4)+sz/2,y,sz,f.cor?FG_CO[0]:'#cfcfcf',id+'s',1);
      if(fr>.05)o+=figSimbolo(f.sim,x0+full*(sz+4)+sz/2,y,sz,f.cor?FG_CO[0]:'#cfcfcf',id+'p'+i,fr);y+=rh});
    o+=figSimbolo(f.sim,x0+sz/2,H-14,sz,f.cor?FG_CO[0]:'#cfcfcf',id+'l',1)+T(x0+sz+6,H-14,'= '+figFmt(u,2)+(f.un?' '+f.un:''),11.5,400,'start');return{o,bb}}
  /* col, bar, lin, hist: eixos */
  const hor=k=='bar',vals=V.flat().concat(0),mx=Math.max(...vals,0),nz=f.ymax>0?{s:figNice(f.ymax).s,m:+f.ymax}:figNice(mx),tick=nz.s;let ym=nz.m;if(!(f.ymax>0)&&f.val!==false&&mx>=ym-1e-9)ym+=tick;
  const lw=hor?Math.min(110,Math.max(30,Math.max(0,...cats.map(c=>String(c.n||'').length))*6+14)):(f.ey?52:44),top=top0+(ns>1?22:0),right=16,bot=hor?(f.ex?40:28):(f.ex?50:36),pw=W-lw-right,ph=H-top-bot,L=lw;
  if(ns>1)o+=leg();
  const X=hor?(v=>L+v/ym*pw):(i=>L+i*pw/Math.max(n,1)),Y=hor?(i=>top+i*ph/Math.max(n,1)):(v=>top+ph-v/ym*ph);
  for(let t=0;t<=ym+1e-9;t+=tick){const p=hor?X(t):Y(t);if(f.grade!==false&&t>0)o+=hor?`<line x1="${figN(p)}" y1="${top}" x2="${figN(p)}" y2="${top+ph}" stroke="#d8d8d8" stroke-width=".8"/>`:`<line x1="${L}" y1="${figN(p)}" x2="${L+pw}" y2="${figN(p)}" stroke="#d8d8d8" stroke-width=".8"/>`;
    o+=hor?`<line x1="${figN(p)}" y1="${top+ph}" x2="${figN(p)}" y2="${top+ph+3}" stroke="#111"/>`+T(p,top+ph+12,figFmt(t,2),10.5):`<line x1="${L-3}" y1="${figN(p)}" x2="${L}" y2="${figN(p)}" stroke="#111"/>`+T(L-6,p,figFmt(t,2),10.5,400,'end')}
  o+=`<line x1="${L}" y1="${top}" x2="${L}" y2="${top+ph}" stroke="#111" stroke-width="1.4"/><line x1="${L}" y1="${top+ph}" x2="${L+pw}" y2="${top+ph}" stroke="#111" stroke-width="1.4"/>`;
  const cwid=(hor?ph:pw)/Math.max(n,1),labW=Math.max(6,Math.floor(cwid/6.2));
  cats.forEach((c,i)=>{const ctr=(hor?top+(i+.5)*cwid:L+(i+.5)*cwid);
    if(k!='hist'){if(hor)o+=T(L-6,ctr,String(c.n||'').slice(0,18),11,400,'end');else{const ls=figWrap(c.n||'',labW);ls.forEach((t,j)=>{o+=T(ctr,top+ph+13+j*12,t,11)})}}
    for(let s=0;s<ns;s++){const v=V[i][s]||0;let bx,by,bw,bh;
      if(k=='col'||k=='hist'){const g=k=='hist'?cwid:cwid*.72,w=g/ns;bw=w;bx=L+i*cwid+(cwid-g)/2+s*w;by=Y(v);bh=top+ph-by;o+=`<rect x="${figN(bx)}" y="${figN(by)}" width="${figN(bw)}" height="${figN(bh)}" fill="${fill(s)}" stroke="#111" stroke-width="1.1"/>`;if(f.val!==false&&v>0)o+=T(bx+bw/2,by-7,figFmt(v,2),10.5)}
      else if(hor){const g=cwid*.72,h=g/ns;by=top+i*cwid+(cwid-g)/2+s*h;bx=L;bw=X(v)-L;o+=`<rect x="${L}" y="${figN(by)}" width="${figN(bw)}" height="${figN(h)}" fill="${fill(s)}" stroke="#111" stroke-width="1.1"/>`;if(f.val!==false&&v>0)o+=T(X(v)+4,by+h/2,figFmt(v,2),10.5,400,'start')}}});
  if(k=='lin')for(let s=0;s<ns;s++){const P=cats.map((c,i)=>[L+(i+.5)*cwid,Y(V[i][s]||0),V[i][s]||0]),da=['','5 3','2 3'][s];
    o+=`<polyline points="${P.map(p=>figN(p[0])+','+figN(p[1])).join(' ')}" fill="none" stroke="${f.cor?FG_CO[s]:'#111'}" stroke-width="1.6"${da?` stroke-dasharray="${da}"`:''} stroke-linejoin="round"/>`;
    P.forEach(p=>{const c=f.cor?FG_CO[s]:'#111';o+=s==0?`<circle cx="${figN(p[0])}" cy="${figN(p[1])}" r="3" fill="${c}"/>`:s==1?`<rect x="${figN(p[0]-3)}" y="${figN(p[1]-3)}" width="6" height="6" fill="${c}"/>`:`<polygon points="${figN(p[0])},${figN(p[1]-3.6)} ${figN(p[0]-3.4)},${figN(p[1]+2.6)} ${figN(p[0]+3.4)},${figN(p[1]+2.6)}" fill="${c}"/>`;if(f.val!==false&&p[2]>0&&ns==1)o+=T(p[0],p[1]-9,figFmt(p[2],2),10.5)})}
  if(k=='hist'){for(let i=0;i<=n;i++)o+=T(L+i*cwid,top+ph+13,figFmt((+f.ini||0)+i*(+f.amp||1),2),10.5)}
  if(f.ex)o+=T(L+pw/2,H-9,f.ex,11.5,400);if(f.ey)o+=T(12,top+ph/2,f.ey,11.5,400,'middle',-90);
  return{o,bb}}
function figInner(f){return f.t=='circ'?figInnerCirc(f):f.t=='cart'?figInnerCart(f):f.t=='tab'?figInnerTab(f):f.t=='graf'?figInnerGraf(f):figInnerPoly(f)}
function figSvg(f,maxW){const{o,bb}=figInner(f),m=6,x=bb[0]-m,y=bb[1]-m,w=bb[2]-bb[0]+2*m,h=bb[3]-bb[1]+2*m;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}" width="${Math.round(w)}" height="${Math.round(h)}" style="max-width:${Math.min(maxW||1e9,Math.round(w))}px;width:100%;height:auto;display:block;background:#fff" role="img" aria-label="Figura">${o}</svg>`}
function figHtml(f,maxW){if(typeof f=='string'){try{f=JSON.parse(f)}catch(e){return ''}}return f&&['poly','circ','cart','tab','graf'].includes(f.t)?figSvg(f,maxW):''}
