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

function figInner(f){return f.t=='circ'?figInnerCirc(f):f.t=='cart'?figInnerCart(f):figInnerPoly(f)}
function figSvg(f,maxW){const{o,bb}=figInner(f),m=6,x=bb[0]-m,y=bb[1]-m,w=bb[2]-bb[0]+2*m,h=bb[3]-bb[1]+2*m;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}" width="${Math.round(w)}" height="${Math.round(h)}" style="max-width:${maxW?maxW+'px':'100%'};width:100%;height:auto;display:block;background:#fff" role="img" aria-label="Figura geométrica">${o}</svg>`}
function figHtml(f,maxW){if(typeof f=='string'){try{f=JSON.parse(f)}catch(e){return ''}}return f&&['poly','circ','cart'].includes(f.t)?figSvg(f,maxW):''}
