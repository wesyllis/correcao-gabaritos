/* Alunos da turma ativa: ativos, arquivados, adicionar e lista de frequência (PDF) */
let AL={aba:'ativos',L:[],turma:''};
const alNome=(a,b)=>a.nome.localeCompare(b.nome,'pt-BR');
async function alunosTela(){if(!cfg.url)return conf();h('<p>Carregando…</p>','alunos');
  try{const t=await lerC('turmas');S.turmas=t.turmas;AL.turma=turmaAtiva();AL.L=AL.turma?(await lerC('alunosSit',{turma:AL.turma})).alunos:[]}catch{return inicio()}
  alunosDes()}
function alunosDes(){const at=AL.L.filter(a=>!a.arq).sort(alNome),ar=AL.L.filter(a=>a.arq).sort(alNome),L=AL.aba=='ativos'?at:ar;
  h(`${cabec('Alunos',`<button class=hsb onclick="escolheTurma(alunosTela)">${esc(AL.turma)}${S.turmas.length>1?TI('chevron-down',12):''}</button>`,'inicio()')}
  <div class=br><button class=pb type=button onclick=alunosNovo()>${TI('user-plus',14)}Adicionar</button><button class=ob type=button onclick=alunosPdf()>${TI('file-text',14)}Lista de frequência (PDF)</button></div>
  <div class=fg style="margin-top:12px"><button class="tg ${AL.aba=='ativos'?'on':''}" onclick="AL.aba='ativos';alunosDes()">Ativos (${at.length})</button><button class="tg ${AL.aba=='arq'?'on':''}" onclick="AL.aba='arq';alunosDes()">Arquivados (${ar.length})</button></div>
  <div>${L.length?L.map((a,i)=>`<div class=lr2><span class=n>${AL.aba=='ativos'?i+1:''}</span><span class=c>${esc(a.nome)}</span>${AL.aba=='ativos'?`<button class=ab type=button aria-label="Arquivar" data-i="${esc(a.id)}" onclick="alunoArq(this.dataset.i,true)">${TI('archive',15)}</button>`:`<button class=tg type=button data-i="${esc(a.id)}" onclick="alunoArq(this.dataset.i,false)">Restaurar</button>`}</div>`).join(''):`<p>${AL.aba=='ativos'?'Nenhum aluno ativo nesta turma.':'Nenhum aluno arquivado.'}</p>`}</div>`,'alunos')}
async function alunoArq(id,arq){const a=AL.L.find(x=>x.id==id);if(!a)return;
  if(!confirm(arq?`Arquivar ${a.nome}? O histórico de notas é mantido.`:`Restaurar ${a.nome}?`))return;
  try{await api('arquivarAluno',{id,arquivar:arq},true)}catch{return}a.arq=arq;msg(arq?'Aluno arquivado.':'Aluno restaurado.');alunosDes()}
function alunosNovo(){h(`${cabec('Adicionar alunos',esc(AL.turma),'alunosDes()')}<textarea id=nn rows=10 placeholder="Um nome por linha, ou cole a lista da turma"></textarea><button onclick=alunosAddSalva()>Adicionar</button><small class=f11>Os alunos aparecem em ordem alfabética.</small>`,'alunos')}
async function alunosAddSalva(){const nomes=$('#nn').value.split('\n').map(x=>x.trim()).filter(Boolean);if(!nomes.length)return msg('Digite pelo menos um nome.');
  let j;try{j=await api('salvarAluno',{turma:AL.turma,nomes},true)}catch{return}
  msg(j.adicionados+' aluno(s) adicionado(s)'+(j.ignorados.length?'; '+j.ignorados.length+' já existiam':''));alunosTela()}
/* Lista de frequência para dias de avaliação (impressa pelo navegador, "Salvar como PDF") */
async function alunosPdf(){const at=AL.L.filter(a=>!a.arq).sort(alNome);if(!at.length)return msg('Não há alunos ativos nesta turma.');
  const av=prompt('Nome da avaliação (aparece na lista):',S.sims&&S.sims.length?S.sims[S.sims.length-1].simulado:'');if(av===null)return;
  await carrega('escola');const e={...((await escolaDados())||{})};
  if(!e.professor){const pn=prompt('Nome do(a) professor(a) para o rodapé da lista (fica guardado em Ajustes, Escola):','');
    if(pn&&pn.trim()){e.professor=pn.trim();try{await api('salvarEscola',{professor:e.professor},true);S.esc={...S.esc,professor:e.professor}}catch{}}}
  const n=at.length,rh=Math.max(16,Math.min(24,560/(n+1))),fsz=rh<22?10:11.5,tc='border:.7pt solid #888;';
  const lin=(a,i)=>{const len=Math.max(a.nome.length,1);let f=Math.min(fsz,270/(len*.53)),q='nowrap';if(f<7.5){f=7.5;q='normal'}
    return `<tr style="height:${rh}pt;page-break-inside:avoid"><td style="${tc}padding:0 6pt;text-align:center;width:34pt">${i+1}</td><td style="${tc}padding:0 8pt;text-align:left;white-space:${q};font-size:${f.toFixed(1)}pt">${esc(a.nome)}</td><td style="${tc}width:210pt"></td></tr>`};
  let pr=$('#pr');if(!pr){pr=document.createElement('div');pr.id='pr';document.body.appendChild(pr)}
  pr.innerHTML=`<div style="font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#111;font-size:11.5pt"><div style="display:flex;align-items:center;gap:16pt;border-bottom:1.5pt solid #111;padding-bottom:10pt">
  ${e.logo?`<img src="${e.logo}" alt="" style="width:56pt;height:56pt;object-fit:contain">`:''}
  <div style="flex:1;text-align:center;line-height:1.35"><div style="font:600 14pt Poppins,system-ui,sans-serif">${esc(e.nome||'')}</div><div style="font-size:11pt">${esc(e.rede||'')}</div><div style="font-size:11pt">${esc(e.municipio||'')}</div></div>
  <div style="font-size:11pt;text-align:right;line-height:1.35">${e.ano?'Ano letivo<br>'+esc(e.ano):''}</div></div>
  <div style="text-align:center;font:600 15pt Poppins,system-ui,sans-serif;margin:14pt 0 6pt">Lista de frequência</div>
  <div style="display:flex;justify-content:space-between;font-size:11.5pt;margin-bottom:10pt"><span>Turma: ${esc(AL.turma)}</span><span>Avaliação: ${esc(av)}</span><span>Data: ____/____/______</span></div>
  <table style="width:100%;border-collapse:collapse;font-size:${fsz}pt"><thead><tr style="background:#eee;height:${rh}pt"><th style="${tc}padding:0 6pt;text-align:center">Nº</th><th style="${tc}padding:0 8pt;text-align:left">Nome do aluno</th><th style="${tc}text-align:center">Assinatura</th></tr></thead><tbody>${at.map(lin).join('')}</tbody></table>
  <div style="font-size:11pt;margin-top:12pt">Professor(a): ${esc([e.professor,e.disciplina].filter(Boolean).join(', '))}</div></div>`;
  const st=document.createElement('style');st.textContent='@page{size:A4;margin:11mm 12mm}';document.head.appendChild(st);
  const lim=()=>{pr.innerHTML='';st.remove();removeEventListener('afterprint',lim)};addEventListener('afterprint',lim);window.print()}
