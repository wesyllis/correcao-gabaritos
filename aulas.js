/* Aulas: lista, editor e envio ao Lançador de Aulas (layout aprovado) */
let AU={f:'todas',L:[],e:null,cat:null,cats:{},pend:[],env:[],turma:'',objL:[],habL:[]};
const aulaComp=()=>((S.esc&&S.esc.disciplina)||'Matemática').toUpperCase();
const nrm=t=>String(t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const dBR=d=>d.split('-').reverse().join('/');
const dSem=d=>['dom','seg','ter','qua','qui','sex','sáb'][new Date(d+'T12:00:00').getDay()];
const dCurta=d=>dSem(d)+' '+dBR(d).slice(0,5);
const aulaRot=d=>d==hoje()?'Hoje, '+dCurta(d):dCurta(d);
function serieDe(t){const m=String(t||'').match(/(\d)\s*[ºo°ª]/i)||String(t||'').match(/(\d)/);return m?m[1]:''}
async function aulaCat(s){if(AU.cats[s])return AU.cats[s];const r=await fetch('catalogo_'+s+'ano_ligado.json');if(!r.ok)throw new Error('sem catálogo');return AU.cats[s]=await r.json()}
/* Regra da planilha: pontua por palavras-chave; vale quem tem ao menos o mínimo e 60% da melhor pontuação */
function aulaEsc(L,t,c,ok){const P=L.filter(x=>!ok||ok(x)).map((x,i)=>({x,i,s:x.palavras.filter(p=>t.includes(p)).length}));
  const mx=Math.max(0,...P.map(p=>p.s));if(mx<c.minimoPalavras)return[];const lim=Math.max(c.minimoPalavras,mx*c.proporcaoMinima);
  return P.filter(p=>p.s>=lim).sort((a,b)=>b.s-a.s||a.i-b.i)}
/* Conteúdo com "|": cada parte é avaliada à parte e os resultados se somam. Objeto marcado = o primeiro de cada parte. */
function aulaSug(cat,cont){const c=cat.configuracoes,cand=[],sel=[],hab=[];
  String(cont).split('|').forEach(par=>{const t=nrm(par);if(!t.trim())return;
    const os=aulaEsc(cat.objetos,t,c).slice(0,c.maxObjetos);if(!os.length)return;
    os.forEach(p=>{if(!cand.includes(p.x.texto))cand.push(p.x.texto)});
    const top=os[0].x;if(!sel.includes(top.texto))sel.push(top.texto);
    let hs=aulaEsc(cat.habilidades,t,c,k=>k.objetos.includes(top.n)).slice(0,c.maxHabilidades);
    if(!hs.length){const u=cat.habilidades.filter(k=>k.objetos.includes(top.n));if(u.length==1)hs=[{x:u[0]}]}
    hs.forEach(p=>{if(!hab.includes(p.x.codigo))hab.push(p.x.codigo)})});
  return{cand,sel,hab}}
function aulaSit(a){if(!a.data)return'Falta a data';if(!(a.conteudo||'').trim())return'Falta o conteúdo';if(!(a.estrategias||'').trim())return'Faltam as estratégias';
  if(!a.objetos.length)return'Sem objeto correspondente';if(!a.habilidades.length)return'Sem habilidade correspondente';return'Pronto'}
const aulaEst=a=>a.estado=='Lançada'?'Lançada':(a.estado=='Pronta'&&aulaSit(a)=='Pronto'&&a.data<=hoje()?'Pronta':'Planejada');

async function aulasTela(){if(!cfg.url)return conf();h('<p>Carregando…</p>','aulas');
  try{const t=await lerC('turmas');S.turmas=t.turmas;AU.turma=turmaAtiva();AU.L=AU.turma?(await lerC('aulas',{turma:AU.turma})).aulas:[]}catch{return inicio()}
  await escCarrega();AU.e=null;aulasDes()}
function aulasDes(){
  if(!S.turmas.length)return h(cabec('Aulas','','inicio()')+'<p>Cadastre uma turma para registrar aulas.</p><button onclick=turmasTela()>Cadastrar turma</button>','aulas');
  const F=[['todas','Todas'],['Planejada','Planejadas'],['Pronta','Prontas'],['Lançada','Lançadas']],np=AU.L.filter(a=>aulaEst(a)=='Pronta').length;
  h(`<div class=au2><div id=aul>${cabec('Aulas',`<button class=hsb onclick="escolheTurma(aulasTela)">${esc(AU.turma)}${bimTem()?', '+bimRot(bimSel()):''}${S.turmas.length>1?TI('chevron-down',12):''}</button>`,'inicio()')}
  ${bimTem()?`<div class=fg>${bimAbas('aulasDes()')}</div>`:''}${AU.pend.length?`<div class=w>${AU.pend.length} aula(s) enviada(s) ao Lançador. Depois de lançar na plataforma, marque como lançadas.<button onclick=aulaMarca()>Marcar como lançadas</button></div>`:''}
  <div class="fg afl">${F.map(([k,t])=>`<button class="tg ${AU.f==k?'on':''}" onclick="AU.f='${k}';aulaLista()">${t}</button>`).join('')}</div><div id=al></div>
  <div class=br2><button onclick=aulaEd()>Nova aula</button>${np?`<button class=g onclick=aulasLanca()>Lançar ${np} ${np>1?'prontas':'pronta'}</button>`:''}</div></div><div id=aue></div></div>`,'aulas');
  $('#app').classList.add('wide','xw');aulaLista();aulaPainel()}
function aulaLista(){const e=$('#al');if(!e)return;
  document.querySelectorAll('#aul .afg2 .tg').forEach((b,i)=>b.classList.toggle('on',['todas','Planejada','Pronta','Lançada'][i]==AU.f));
  const L=AU.L.filter(a=>bimDentro(a.data,bimSel())&&(AU.f=='todas'||aulaEst(a)==AU.f)).sort((a,b)=>b.data.localeCompare(a.data));
  e.innerHTML=L.length?L.map(a=>{const s=aulaEst(a);return `<button class=ar type=button data-i="${esc(a.id)}" onclick="aulaEd(this.dataset.i)"><span class=d>${dCurta(a.data)}</span><span class=c>${esc(a.conteudo)||'Sem conteúdo'}</span><span class="e ${s=='Pronta'?'p':s=='Lançada'?'l':''}">${s=='Lançada'?TI('check',12):''}${s}</span></button>`}).join(''):'<p>Nenhuma aula neste filtro.</p>'}
async function aulaEd(id){const a=id&&AU.L.find(x=>x.id==id);
  AU.e=a?{...a,objetos:[...a.objetos],habilidades:[...a.habilidades],multi:a.multiturma?a.multiturma.split(/\s*;\s*/).filter(Boolean):[],cand:[],man:true}
         :{id:'',turma:AU.turma,data:hoje(),multi:[],conteudo:'',estrategias:'',objetos:[],habilidades:[],cand:[],man:false,estado:''};
  AU.cat=null;AU.estEd=false;if(!S.esc)await escCarrega();try{AU.cat=await aulaCat(serieDe(AU.e.turma))}catch(x){}
  if(AU.cat&&AU.e.id){AU.e.cand=aulaSug(AU.cat,AU.e.conteudo).cand}
  aulaPainel()}
function aulaFecha(){AU.e=null;aulaPainel()}
function aulaPainel(){const w=$('.au2'),p=$('#aue');if(!w||!p)return;w.classList.toggle('ed',!!AU.e);$('#app').classList.toggle('ced',!!AU.e);
  if(!AU.e){p.innerHTML='<small class=f11>Escolha uma aula ou toque em Nova aula.</small>';return}
  const e=AU.e,outras=S.turmas.filter(t=>t!=e.turma),est=e.estado;
  p.innerHTML=`<div class=eh-m>${cabec(e.id?'Editar aula':'Nova aula','','aulaFecha()')}</div><div class=eh-d>${e.id?'Editar aula':'Nova aula'}</div>
  <div class=er><button class="tg on" type=button onclick=aulaCal()><span id=adl>${aulaRot(e.data)}</span></button>
  ${outras.length?`<span class=f1i>Turmas</span><button class="tg on" type=button disabled>${esc(e.turma)}</button>${outras.map(t=>`<button class="tg ${e.multi.includes(t)?'on':''}" type=button data-t="${esc(t)}" onclick="aulaMulti(this.dataset.t)">${esc(t)}</button>`).join('')}`:''}</div>
  <div class=ec><div class=ec1><label class=f1>Conteúdo (assuntos separados por | )</label><textarea oninput="AU.e.conteudo=this.value;aulaSugere()">${esc(e.conteudo)}</textarea>
  <label class=f1>Estratégias</label><input id=aei class=fi value="${esc(e.estrategias)}" oninput="AU.e.estrategias=this.value;aulaSgDes();aulaEstDes()"><div id=aet class=afg></div></div><div class=ec2 id=asg></div></div>
  <div class=ebt><button class=g type=button onclick="aulaSalva()">Salvar</button><button type=button onclick="aulaSalva('${est=='Pronta'?'':'Pronta'}')">${est==''?'Marcar como pronta':est=='Pronta'?'Voltar a planejada':'Voltar a pronta'}</button>${e.id?'<button class=g type=button onclick=aulaExclui()>Excluir</button>':''}</div>`;
  aulaSgDes();aulaEstDes()}
function aulaCal(){pickData(AU.e.data,v=>{if(v)aulaData(v)})}
function aulaData(v){if(!v)return;AU.e.data=v;$('#adl').textContent=aulaRot(v);aulaSgDes()}
function aulaMulti(t){const m=AU.e.multi,k=m.indexOf(t);k<0?m.push(t):m.splice(k,1);aulaPainel()}
let aut=0;function aulaSugere(já){clearTimeout(aut);aut=setTimeout(()=>{const e=AU.e,c=AU.cat;if(!e)return;if(!c)return aulaSgDes();
  const s=aulaSug(c,e.conteudo);e.cand=s.cand;if(!e.man){e.objetos=s.sel;e.habilidades=s.hab}aulaSgDes()},já?0:300)}
const IX='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6l-12 12"/><path d="M6 6l12 12"/></svg>';
function aulaSgDes(){const e=AU.e,c=AU.cat,p=$('#asg');if(!e||!p)return;
  if(!c){p.innerHTML=`<div class=w>Não encontrei o catálogo do ${esc(serieDe(e.turma)||'?')}º ano. Publique o arquivo catalogo_${esc(serieDe(e.turma)||'N')}ano_ligado.json junto do app.</div>`;return}
  const ns=c.objetos.filter(o=>e.objetos.includes(o.texto)).map(o=>o.n),sit=aulaSit(e),
    hd=k=>{const x=c.habilidades.find(y=>y.codigo==k);return x?x.texto.split(' - ').slice(1).join(' - '):''},
    oOp=[...e.cand.filter(o=>!e.objetos.includes(o)).map(o=>['Sugerido · '+o,o]),...c.objetos.filter(o=>!e.objetos.includes(o.texto)&&!e.cand.includes(o.texto)).map(o=>[o.texto,o.texto])],
    hl=c.habilidades.filter(k=>!e.habilidades.includes(k.codigo)),hc=hl.filter(k=>k.objetos.some(n=>ns.includes(n))),hr=hl.filter(k=>!hc.includes(k)),
    hOp=[...hc,...hr].map(k=>[k.texto.slice(0,110),k.codigo]);
  p.innerHTML=`<label class="f1 lo">Objeto de conhecimento</label>${e.objetos.map((o,i)=>`<div class="sb o"><span>${esc(o)}</span><button class=sx type=button aria-label="Tirar" onclick="aulaRemO(${i})">${IX}</button></div>`).join('')||'<small class=f11>Nenhum objeto marcado.</small>'}
  <select onchange="aulaOutro(this.value)"><option value="">Adicionar objeto</option>${oOp.map(([t,v])=>`<option value="${esc(v)}">${esc(t)}</option>`).join('')}</select>
  <label class="f1 lh">Habilidades</label>${e.habilidades.map((k,i)=>`<div class="sb hh"><span><b>${esc(k)}</b> ${esc(hd(k))}</span><button class=sx type=button aria-label="Tirar" onclick="aulaRemH(${i})">${IX}</button></div>`).join('')||'<small class=f11>Nenhuma habilidade marcada.</small>'}
  <select onchange="aulaAddH(this.value)"><option value="">Adicionar habilidade</option>${hOp.map(([t,v])=>`<option value="${esc(v)}">${esc(t)}</option>`).join('')}</select>
  ${sit=='Pronto'?'':`<div class=w>${sit}.</div>`}<div class=afg><button class=tg type=button onclick="AU.e.man=false;aulaSugere(1)">Sugerir de novo pelo conteúdo</button></div>`;melhoraSel()}
function aulaRemO(i){const e=AU.e;e.objetos.splice(i,1);e.man=true;aulaHabAuto();aulaSgDes()}
function aulaRemH(i){AU.e.habilidades.splice(i,1);AU.e.man=true;aulaSgDes()}
function aulaAddH(v){if(!v)return;const e=AU.e;if(!e.habilidades.includes(v))e.habilidades.push(v);e.man=true;aulaSgDes()}
function aulaOutro(v){if(!v)return;const e=AU.e;if(!e.objetos.includes(v))e.objetos.push(v);e.man=true;aulaHabAuto();aulaSgDes()}
function aulaHabAuto(){const e=AU.e,c=AU.cat;if(!c)return;const ns=c.objetos.filter(o=>e.objetos.includes(o.texto)).map(o=>o.n),H=[];
  String(e.conteudo).split('|').forEach(par=>{const t=nrm(par);if(!t.trim())return;
    aulaEsc(c.habilidades,t,c.configuracoes,k=>k.objetos.some(n=>ns.includes(n))).slice(0,c.configuracoes.maxHabilidades).forEach(p=>{if(!H.includes(p.x.codigo))H.push(p.x.codigo)})});
  if(!H.length&&ns.length==1){const u=c.habilidades.filter(k=>k.objetos.includes(ns[0]));if(u.length==1)H.push(u[0].codigo)}
  e.habilidades=H}
/* estado: undefined = só salva; "Pronta" ou "" = salva e muda o estado */
async function aulaSalva(estado){const e=AU.e;if(!e.data)return msg('Escolha a data.');
  if(estado==='Pronta'){const s=aulaSit(e);if(s!='Pronto')return msg(s+'.')}
  try{const j=await api('salvarAula',{id:e.id,turma:e.turma,data:e.data,multiturma:e.multi.join('; '),conteudo:e.conteudo,estrategias:e.estrategias,objetos:e.objetos,habilidades:e.habilidades},true);
    if(estado!==undefined&&estado!==(e.estado||''))await api('marcarAulas',{ids:[j.id],estado},true)}catch{return}
  msg(estado==='Pronta'?(e.data>hoje()?'Aula pronta. Fica planejada até o dia.':'Aula marcada como pronta.'):'Aula salva.');aulasTela()}
async function aulaExclui(){if(!confirm('Excluir esta aula?'))return;try{await api('excluirAula',{id:AU.e.id},true)}catch{return}msg('Aula excluída.');aulasTela()}
async function aulaMarca(){try{await api('marcarAulas',{ids:AU.pend,estado:'Lançada'},true)}catch{return}AU.pend=[];msg('Aulas marcadas como lançadas.');aulasTela()}
function aulasLanca(){const L=AU.L.filter(a=>aulaEst(a)=='Pronta').sort((a,b)=>a.data.localeCompare(b.data));
  if(!L.length)return msg('Não há aulas prontas.');if(!EXT.aulas)return msg('Não encontrei o Lançador de Aulas neste navegador. Ele funciona no Chrome do computador.');
  AU.env=L.map(a=>a.id);
  postMessage({tipo:'syntese-aulas',versao:1,turma:AU.turma,componente:aulaComp(),aulas:L.map(a=>({data:dBR(a.data),multiturma:a.multiturma,objetos:a.objetos,habilidades:a.habilidades,conteudo:a.conteudo,estrategias:a.estrategias}))},location.origin)}
function aulaEnviada(m){if(!m.ok)return msg('Erro no envio: '+m.erro);AU.pend=AU.env||[];msg(m.recebidas+' aula(s) enviada(s). Abra a plataforma e clique em Carregar no Lançador de Aulas.');if($('.au2'))aulasDes()}

/* Atalhos de estratégia: os três de sempre, mais os que você guardar (ficam na planilha, valem em qualquer aparelho) */
const EST_PAD=['Aula expositiva dialogada','Exercício de Fixação','Correção do Exercício'];
function estLista(){const r=S.esc&&S.esc.estrategias;if(r){try{const j=JSON.parse(r);if(Array.isArray(j))return j}catch(x){}}return EST_PAD.slice()}
async function estSalva(L){try{await api('salvarEscola',{estrategias:JSON.stringify(L)},true)}catch{return false}S.esc={...S.esc,estrategias:JSON.stringify(L)};return true}
function aulaEstDes(){const e=AU.e,p=$('#aet');if(!e||!p)return;const L=estLista(),ed=AU.estEd,t=(e.estrategias||'').trim();
  p.innerHTML=L.map((x,i)=>`<button class=tg type=button onclick="${ed?`estRem(${i})`:`aulaEstAdd(${i})`}">${esc(x)}${ed?' ✕':''}</button>`).join('')
   +(t&&!ed&&!L.includes(t)?'<button class=tg type=button onclick=estGuarda()>+ Guardar este texto</button>':'')
   +(ed?'<div class=ean><input id=aen class=fi placeholder="Novo atalho" onkeydown="if(event.key==\'Enter\')estNovo()"><button class=tg type=button onclick=estNovo()>Adicionar</button></div>':'')
   +`<button class=tg type=button onclick="AU.estEd=!AU.estEd;aulaEstDes()">${ed?'Concluir':'Editar atalhos'}</button>`}
async function estNovo(){const i=$('#aen'),t=(i&&i.value||'').trim(),L=estLista();if(!t)return msg('Digite o texto do atalho.');if(L.includes(t))return msg('Esse atalho já existe.');
  L.push(t);if(await estSalva(L)){aulaEstDes();const n=$('#aen');if(n)n.focus()}}
function aulaEstAdd(i){const e=AU.e,x=estLista()[i];if(x===undefined)return;const t=(e.estrategias||'').trim();if(t.split(/\s*,\s*/).includes(x))return;
  e.estrategias=t?t+', '+x:x;$('#aei').value=e.estrategias;aulaSgDes();aulaEstDes()}
async function estGuarda(){const L=estLista(),t=AU.e.estrategias.trim();if(!t||L.includes(t))return;L.push(t);if(await estSalva(L)){msg('Atalho guardado.');aulaEstDes()}}
async function estRem(i){const L=estLista();if(!confirm('Remover o atalho "'+L[i]+'"?'))return;L.splice(i,1);if(await estSalva(L))aulaEstDes()}
