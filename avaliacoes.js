/* Montar avaliação: escolher questões do banco, ajustar opções, pré-visualizar a prova (tipos A e B),
   imprimir em PDF e registrar o gabarito para a correção por foto. */
let AV={L:[],e:null,Q:{},QL:[],f:{b:'',s:'',t:''},tipo:'A',pv:null,dir:0};
const avN=a=>a.filter(x=>AV.Q[x]).length;
const avPlano=t=>String(t||'').replace(/\$/g,'').replace(/\\[a-zA-Z]+/g,' ').replace(/\s+/g,' ').trim();
async function avalCarrega(){await Promise.all([carrega('figuras'),carrega('prova')]);
  const[q,a,t]=await Promise.all([lerC('questoes'),lerC('avaliacoes'),lerC('turmas')]);AV.QL=q.questoes.filter(x=>x.status!='arquivada');AV.Q={};q.questoes.forEach(x=>AV.Q[x.id]=x);AV.L=a.avaliacoes;S.turmas=t.turmas;await escCarrega()}
async function avalLista(){if(!cfg.url)return conf();h('<p>Carregando…</p>','gab');try{await avalCarrega()}catch(e){return provasTela()}avalListaDes()}
function avalListaDes(){const L=AV.L.filter(a=>a.status!='arquivada').sort((a,b)=>String(b.atualizada).localeCompare(String(a.atualizada)));
  h(`${cabec('Montar avaliação','Prova a partir do banco de questões','provasTela()')}<div>${L.length?L.map(a=>`<button class=ar type=button data-i="${esc(a.id)}" onclick="avalEd(this.dataset.i)"><span class=c>${esc(a.nome)}</span><span class=e>${avN(a.dados.q||[])} questões</span></button>`).join(''):'<p>Nenhuma avaliação ainda. Toque em Nova avaliação.</p>'}</div><button onclick="avalEd()">Nova avaliação</button><button class=g onclick=provasTela()>Voltar</button>`,'gab')}
function avalEd(id){const a=id&&AV.L.find(x=>x.id==id);
  AV.e=a?{id:a.id,nome:a.nome,turma:a.turma,d:JSON.parse(JSON.stringify(a.dados))}:{id:'',nome:'',turma:turmaAtiva(),d:{tipoAv:'SIMULADO',numero:'',disciplina:(S.esc&&S.esc.disciplina)||'Matemática',ano:String(new Date().getFullYear()),q:[],cfg:{}}};
  const c=AV.e.d.cfg=AV.e.d.cfg||{};if(c.folha===undefined)c.folha=true;if(c.esp===undefined)c.esp=true;if(c.fil===undefined)c.fil=true;if(!c.texto)c.texto='auto';if(!c.notaMax)c.notaMax=10;if(!c.seedB)c.seedB=Math.floor(Math.random()*1e6)+1;if(!c.trava)c.trava={};if(!c.ori||!c.ori.length)c.ori=PV_ORI.slice();
  AV.e.d.q=AV.e.d.q||[];avalEdDes()}
const avObj=()=>({...AV.e.d,turma:AV.e.turma});
function avalEdDes(){const e=AV.e,d=e.d,c=d.cfg,T=['',...S.turmas];
  h(`${cabec(e.id?esc(e.nome||'Avaliação'):'Nova avaliação','','avalLista()')}
  <div class=qx><div class=qf>
  <div class=fr2><span class=f1i style="width:60px">Tipo</span><input class=fi value="${esc(d.tipoAv)}" oninput="AV.e.d.tipoAv=this.value"><span class=f1i>Nº</span><input class="fi" style="max-width:90px" value="${esc(d.numero)}" placeholder="4.1" oninput="AV.e.d.numero=this.value"></div>
  <div class=fr2><span class=f1i style="width:60px">Turma</span><select onchange="AV.e.turma=this.value">${T.map(t=>`<option value="${esc(t)}" ${t==e.turma?'selected':''}>${t?esc(t):'Em branco (várias turmas)'}</option>`).join('')}</select></div>
  <div class=fr2><span class=f1i style="width:60px">Disciplina</span><input class=fi value="${esc(d.disciplina)}" oninput="AV.e.d.disciplina=this.value"><span class=f1i>Ano</span><input class=fi style="max-width:84px" value="${esc(d.ano)}" oninput="AV.e.d.ano=this.value"></div>
  <label class=f1>Opções</label><div class=fg>
    <button class="tg ${c.folha?'on':''}" type=button onclick="avCfg('folha')">Folha de respostas</button><button class="tg ${c.esp?'on':''}" type=button onclick="avCfg('esp')">Espaço para cálculos</button><button class="tg ${c.fil?'on':''}" type=button onclick="avCfg('fil')">Filetes</button></div>
  <div class=fg><button class="tg ${c.texto=='auto'?'on':''}" type=button onclick="avTexto('auto')">Texto automático</button><button class="tg ${c.texto=='fixo'?'on':''}" type=button onclick="avTexto('fixo')">Texto fixo (100%)</button></div>
  <div class=fr2><span class=f1i style="flex:none">Nota máxima</span><input class="fi fgnum" type=number step=any value="${c.notaMax}" oninput="AV.e.d.cfg.notaMax=+this.value||10"></div>
  <label class=f1>Orientações (uma por linha)</label><textarea rows=4 oninput="AV.e.d.cfg.ori=this.value.split('\\n')">${esc(c.ori.join('\n'))}</textarea>
  </div><div class=qp><label class=f1 id=avh></label><div id=avq></div><button class=tg type=button onclick=avalPick()>+ Adicionar do banco</button><div id=avw></div></div></div>
  <div class="ebt qbt"><button type=button onclick="avalPrev('A')">Pré-visualizar</button><button class=g type=button onclick=avalSalva()>Salvar</button></div>${e.id?`<div class=fg><button class=tg type=button onclick="avalArq()">Arquivar esta avaliação</button></div>`:''}`,'gab');
  $('#app').classList.add('wide');avalQs();melhoraSel()}
const AV_ORI2=['Leia com atenção cada questão antes de responder;','Utilize caneta azul ou preta;','Apresente os cálculos nos espaços indicados.'];
function avCfg(k){const c=AV.e.d.cfg;c[k]=!c[k];if(k=='folha'){const j=JSON.stringify(c.ori);if(!c.folha&&j==JSON.stringify(PV_ORI))c.ori=AV_ORI2.slice();else if(c.folha&&j==JSON.stringify(AV_ORI2))c.ori=PV_ORI.slice()}avalEdDes()}
function avTexto(v){AV.e.d.cfg.texto=v;avalEdDes()}
function avalQs(){const d=AV.e.d,p=$('#avq');if(!p)return;const ids=d.q.filter(x=>AV.Q[x]),obj=ids.filter(x=>AV.Q[x].tipo!='discursiva').length;
  $('#avh').textContent=`Questões (${ids.length})`;
  p.innerHTML=ids.length?ids.map((id,i)=>{const q=AV.Q[id],dis=q.tipo=='discursiva',tr=!dis&&pvTrava(avObj(),q);
    return `<div class=qr><span class=n>${i+1}</span><span class=c><span class=l1><b>${esc(q.id)}</b> · ${esc(q.assunto||'sem assunto')}</span><span class="l1 mu">${esc(avPlano(q.enunciado))}</span></span>${dis?'<span class=f1i>disc.</span>':`<button class="tg ${tr?'on':''}" type=button title="Alternativas fixas no tipo B" onclick="avTrava('${id}')">fixa</button>`}<button class=sx type=button aria-label="Subir" onclick="avMove(${i},-1)">↑</button><button class=sx type=button aria-label="Descer" onclick="avMove(${i},1)">↓</button><button class=sx type=button aria-label="Tirar" onclick="avTira(${i})">✕</button></div>`}).join(''):'<small class=f11>Nenhuma questão ainda.</small>';
  if(ids.length)p.insertAdjacentHTML('beforeend','<small class=f11>"fixa": não embaralha as alternativas desta questão no tipo B.</small>');
  const w=$('#avw'),c=d.cfg;let msg='';
  if(c.folha&&obj!=10)msg=`A folha de respostas atual lê 10 questões objetivas. Você tem ${obj}.`;else if(c.folha&&ids.length!=obj)msg='Com a folha de respostas ligada, use só questões objetivas.';
  w.innerHTML=msg?`<div class=w>${msg}</div>`:''}
function avTrava(id){const c=AV.e.d.cfg,q=AV.Q[id],atual=pvTrava(avObj(),q);c.trava[id]=!atual;avalQs()}
function avMove(i,dir){const q=AV.e.d.q,j=i+dir;if(j<0||j>=q.length)return;[q[i],q[j]]=[q[j],q[i]];avalQs()}
function avTira(i){AV.e.d.q.splice(i,1);avalQs()}
/* escolher questões do banco */
function avalPick(){AV.f={b:'',s:'',t:''};h(`${cabec('Questões do banco','','avalEdDes()')}
  <input class=fi id=avb placeholder="Buscar no enunciado, assunto ou habilidade" oninput="AV.f.b=this.value;avalPickLista()">
  <div class=fg id=avf></div><div id=avp></div><div class="ebt qbt"><button type=button onclick="avalEdDes()">Concluir</button></div>`,'gab');avalPickLista()}
function avalPickLista(){const f=AV.f,sel=new Set(AV.e.d.q),series=[...new Set(AV.QL.map(q=>q.serie).filter(Boolean))].sort();
  $('#avf').innerHTML=`<button class="tg ${f.s?'':'on'}" type=button onclick="AV.f.s='';avalPickLista()">Todas as séries</button>${series.map(s=>`<button class="tg ${f.s==s?'on':''}" type=button onclick="AV.f.s='${s}';avalPickLista()">${s}º ano</button>`).join('')}<button class="tg ${f.t=='objetiva'?'on':''}" type=button onclick="AV.f.t=AV.f.t=='objetiva'?'':'objetiva';avalPickLista()">Objetivas</button><button class="tg ${f.t=='discursiva'?'on':''}" type=button onclick="AV.f.t=AV.f.t=='discursiva'?'':'discursiva';avalPickLista()">Discursivas</button>`;
  const b=avN2(f.b),L=AV.QL.filter(q=>(!f.s||q.serie==f.s)&&(!f.t||q.tipo==f.t)&&(!b||avN2([q.id,q.assunto,q.bncc,q.saeb,q.enunciado].join(' ')).includes(b))).slice(0,80);
  $('#avp').innerHTML=(L.length?L.map(q=>{const on=sel.has(q.id);return `<button class=pk type=button data-i="${esc(q.id)}" onclick="avEscolhe(this.dataset.i)"><span class="bx ${on?'on':''}">${on?TI('check',11):''}</span><span style="flex:1;min-width:0"><b>${esc(q.id)}</b> · ${esc(q.assunto||'sem assunto')}${q.nivel?' · nível '+q.nivel:''}${q.tipo=='discursiva'?' · discursiva':''}${q.figura?' · figura':''}<br><span class=mu>${esc(avPlano(q.enunciado).slice(0,130))}</span></span></button>`}).join(''):'<p>Nenhuma questão encontrada.</p>')+`<small class=f11>${AV.e.d.q.filter(x=>AV.Q[x]).length} selecionada(s).</small>`}
const avN2=t=>String(t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function avEscolhe(id){const q=AV.e.d.q,i=q.indexOf(id);if(i<0){if(q.length>=40)return msg('No máximo 40 questões.');q.push(id)}else q.splice(i,1);avalPickLista()}
/* salvar */
const avNome=()=>{const e=AV.e,d=e.d;return e.nome||[d.tipoAv,d.numero].filter(Boolean).join(' ')+(e.turma?' - '+e.turma:'')};
async function avalSalva(sem){const e=AV.e;if(!e.d.q.length)return msg('Escolha pelo menos uma questão.');e.nome=e.nome||avNome();
  try{const j=await api('salvarAvaliacao',{id:e.id,nome:e.nome,turma:e.turma,dados:JSON.stringify(e.d)},true);e.id=j.id}catch{return false}
  const r=AV.L.find(x=>x.id==e.id);if(r){r.nome=e.nome;r.turma=e.turma;r.dados=JSON.parse(JSON.stringify(e.d))}else AV.L.push({id:e.id,nome:e.nome,turma:e.turma,dados:JSON.parse(JSON.stringify(e.d)),status:'ativa',atualizada:new Date().toISOString()});
  if(!sem){msg('Avaliação salva.');avalEdDes()}return true}
async function avalArq(){if(!confirm('Arquivar esta avaliação?'))return;try{await api('statusAvaliacao',{id:AV.e.id,status:'arquivada'},true)}catch{return}const r=AV.L.find(x=>x.id==AV.e.id);if(r)r.status='arquivada';msg('Avaliação arquivada.');avalListaDes()}
/* pré-visualização */
async function avalPrev(tipo){AV.tipo=tipo||AV.tipo;const e=AV.e,d=e.d,ids=d.q.filter(x=>AV.Q[x]);if(!ids.length)return msg('Escolha pelo menos uma questão.');
  h('<p>Montando a prova…</p>','gab');let r;try{r=await provaMontar(avObj(),AV.tipo,AV.Q)}catch(x){msg('Não consegui montar a prova.');return avalEdDes()}AV.pv=r;
  const obj=ids.filter(x=>AV.Q[x].tipo!='discursiva').length,bloq=d.cfg.folha&&(obj!=10||ids.length!=obj);
  const gA=pvVersao(avObj(),'A',AV.Q).map(v=>v.correta).join(' '),gB=pvVersao(avObj(),'B',AV.Q).map(v=>v.correta).join(' ');
  h(`${cabec('Pré-visualização','','avalEdDes()')}
  <div class=fg><button class="tg ${AV.tipo=='A'?'on':''}" type=button onclick="avalPrev('A')">Tipo A</button><button class="tg ${AV.tipo=='B'?'on':''}" type=button onclick="avalPrev('B')">Tipo B</button><button class=tg type=button onclick="avSorteia()">Sortear tipo B de novo</button></div>
  <small class=f11>${r.pags} página${r.pags>1?'s':''} · texto a ${Math.round(r.esc*100)}% · tipo ${AV.tipo}</small>
  ${r.estouro?'<div class=w>Uma questão é maior que a coluna. Reduza a figura ou divida a questão.</div>':''}${(pvVersao(avObj(),'B',AV.Q).iguais||0)?'<div class=w>Algumas questões com alternativas fixas fazem o tipo B repetir a letra do tipo A em uma posição. Desmarque "fixa" ou troque a ordem.</div>':''}${bloq?`<div class=w>A folha de respostas lê 10 questões objetivas (você tem ${obj}${ids.length!=obj?' e há discursivas':''}). Ajuste a lista ou desligue a folha de respostas.</div>`:''}
  <div id=pvw class=pvw></div><small class=f11><b>Gabarito A:</b> ${gA}<br><b>Gabarito B:</b> ${gB}</small>
  <div class="ebt qbt" style="flex-wrap:wrap"><button type=button ${bloq?'disabled':''} onclick=avImprime()>Imprimir ou PDF</button><button class=g type=button ${bloq?'disabled':''} onclick=avRegistra()>Registrar gabarito</button></div>
  <small class=f11>Ao imprimir, escolha "Salvar como PDF", papel A4 e escala 100%. Sem margens extras.</small>`,'gab');
  $('#app').classList.add('wide');const w=$('#pvw'),k=Math.min(1,(w.clientWidth||340)/793.7);
  r.pages.forEach(p=>{const box=document.createElement('div');box.style.cssText=`width:${793.7*k}px;height:${1122.5*k}px;margin:0 auto 10px;overflow:hidden;border:1px solid var(--bd)`;const c=p.cloneNode(true);c.style.transform=`scale(${k})`;c.style.transformOrigin='top left';box.appendChild(c);w.appendChild(box)})}
function avSorteia(){AV.e.d.cfg.seedB=Math.floor(Math.random()*1e6)+1;avalPrev('B')}
const avArquivo=()=>{const e=AV.e,d=e.d,ab=String(d.tipoAv||'').slice(0,3).toUpperCase();return `${d.ano||new Date().getFullYear()} - ${e.turma||'TURMAS'} - ${String(d.disciplina||'').toUpperCase()} - ${ab}. ${d.numero||''} (${AV.tipo})`.replace(/\s+/g,' ')};
function avImprime(){if(!AV.pv)return;provaImprime(AV.pv.pages,avArquivo())}
async function avRegistra(){const e=AV.e,d=e.d;if(!await avalSalva(1))return;
  const sug=`${String(d.tipoAv||'Simulado').charAt(0).toUpperCase()+String(d.tipoAv||'Simulado').slice(1).toLowerCase()} ${d.numero||''}${e.turma?' - '+e.turma.replace(' ANO',''):''}`.replace(/\s+/g,' ').trim();
  const nome=prompt('Nome do simulado no Syntese (vai aparecer na correção por foto):',sug);if(!nome)return;
  const av=avObj();let ok=0;
  for(const t of ['A','B']){const resp=pvVersao(av,t,AV.Q).map(v=>v.correta);
    try{await api('salvarGabarito',{simulado:nome.trim(),tipo:t,questoes:resp.length,alternativas:4,notaMax:d.cfg.notaMax||10,respostas:resp},true);ok++}catch{break}}
  if(ok==2){try{S.sims=(await api('simulados',{},0,1)).simulados}catch(x){}msg('Gabarito registrado (tipos A e B). Já dá para corrigir por foto.')}}
