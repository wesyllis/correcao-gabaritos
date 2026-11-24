/* Escola (Ajustes): dados que alimentam o cabeçalho das listas e das avaliações impressas */
let EL={};
const ESC_CAMPOS=[['nome','Nome da escola'],['rede','Rede ou secretaria'],['municipio','Município e UF'],['professor','Professor(a)'],['disciplina','Disciplina'],['ano','Ano letivo']];
async function escolaTela(){if(!cfg.url)return conf();h('<p>Carregando…</p>','ajustes');
  if(!await escCarrega())return ajustes();
  EL={...S.esc};if(!EL.ano)EL.ano=String(new Date().getFullYear());escolaDes()}
function escolaDes(){
  h(`${cabec('Escola','','ajustes()')}
  <div class=lgr><div class=lgb>${EL.logo?`<img src="${EL.logo}" alt="Logo da escola">`:IC.logo.replace('width="34" height="34"','width="34" height="34"')}</div><div><b class=f12>Logo da escola</b><small class=f11>PNG ou JPG, reduzida para os impressos</small>
  <div class=br><button class=ob type=button onclick="$('#lf').click()">${TI('upload',14)}Enviar logo</button>${EL.logo?'<button class=ob type=button onclick="EL.logo=\'\';escolaDes()">Remover</button>':''}</div></div></div>
  <input id=lf type=file accept="image/*" hidden onchange="escolaLogo(this)">
  ${ESC_CAMPOS.map(([k,t])=>`<label class=f1>${t}</label><input class=fi value="${esc(EL[k]||'')}" oninput="EL.${k}=this.value">`).join('')}
  <label class=f1>Bimestres (início e fim)</label>${[1,2,3,4].map(i=>`<div class=bq><span>${i}º bimestre</span><input type=date value="${EL['b'+i+'i']||''}" onchange="EL.b${i}i=this.value"><input type=date value="${EL['b'+i+'f']||''}" onchange="EL.b${i}f=this.value"></div>`).join('')}
  <button onclick=escolaSalva()>Salvar</button><small class=f11>Aparece no cabeçalho das listas de frequência e das avaliações impressas.</small>`,'ajustes')}
/* Reduz a logo e a guarda como texto (a planilha aceita até 50 mil caracteres por célula) */
async function escolaLogo(inp){const f=inp.files[0];inp.value='';if(!f)return;
  let url;try{url=await new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=no;r.readAsDataURL(f)})}catch{return msg('Não consegui ler a imagem.')}
  const im=new Image();try{await new Promise((ok,no)=>{im.onload=ok;im.onerror=no;im.src=url})}catch{return msg('Não consegui abrir esta imagem.')}
  let out='';
  for(const m of [240,200,160,120]){const k=Math.min(1,m/Math.max(im.width,im.height)),w=Math.max(1,Math.round(im.width*k)),hh=Math.max(1,Math.round(im.height*k));
    for(const [tp,q] of [['image/png'],['image/jpeg',.85],['image/jpeg',.7]]){const c=document.createElement('canvas');c.width=w;c.height=hh;const x=c.getContext('2d');
      if(tp=='image/jpeg'){x.fillStyle='#fff';x.fillRect(0,0,w,hh)}x.drawImage(im,0,0,w,hh);out=c.toDataURL(tp,q);if(out.length<=44000)break}
    if(out.length<=44000)break}
  if(out.length>44000)return msg('Imagem complexa demais. Use uma logo mais simples.');
  EL.logo=out;escolaDes()}
async function escolaSalva(){const p={logo:EL.logo||''};ESC_CAMPOS.forEach(([k])=>p[k]=(EL[k]||'').trim());
  for(let i=1;i<=4;i++){p['b'+i+'i']=EL['b'+i+'i']||'';p['b'+i+'f']=EL['b'+i+'f']||'';if(p['b'+i+'i']&&p['b'+i+'f']&&p['b'+i+'i']>p['b'+i+'f'])return msg('No '+i+'º bimestre, o fim vem antes do início.')}
  try{await api('salvarEscola',p,true)}catch{return}S.esc={...S.esc,...p};msg('Dados da escola salvos.');ajustes()}
