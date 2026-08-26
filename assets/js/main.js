/* URL do Google Apps Script que recebe o formulário */
const ENDPOINT_FORM = "COLE_AQUI_A_URL_DO_APPS_SCRIPT";

/* header fixo */
const cab = document.querySelector('header');
const aoRolar = () => cab.classList.toggle('fixo', window.scrollY > 40);
aoRolar(); window.addEventListener('scroll', aoRolar, {passive:true});

/* ano */
document.getElementById('ano').textContent = new Date().getFullYear();

/* reveal */
const io = new IntersectionObserver((ents)=>{
  ents.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target);} });
},{threshold:.12, rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

/* faq */
document.querySelectorAll('.q button').forEach(b=>{
  b.addEventListener('click', ()=>{
    const item = b.parentElement;
    const resp = item.querySelector('.r');
    const aberta = item.classList.contains('aberta');
    document.querySelectorAll('.q.aberta').forEach(o=>{ o.classList.remove('aberta'); o.querySelector('.r').style.maxHeight = null; });
    if(!aberta){ item.classList.add('aberta'); resp.style.maxHeight = resp.scrollHeight + 'px'; }
  });
});

/* máscara simples de telefone */
const tel = document.getElementById('tel');
tel.addEventListener('input', ()=>{
  let v = tel.value.replace(/\D/g,'').slice(0,11);
  if(v.length > 6){ v = `(${v.slice(0,2)}) ${v.slice(2,3)} ${v.slice(3,7)}-${v.slice(7)}`; }
  else if(v.length > 2){ v = `(${v.slice(0,2)}) ${v.slice(2)}`; }
  else if(v.length > 0){ v = `(${v}`; }
  tel.value = v;
});

/* envio do formulário */
const form = document.getElementById('formOrcamento');
form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const obrigatorios = ['nome','tel','cidade','perfil','ambiente'];
  for(const id of obrigatorios){
    const c = document.getElementById(id);
    if(!c.value.trim()){ c.focus(); c.style.borderColor = '#E05B5B'; return; }
    c.style.borderColor = '';
  }
  const btn = form.querySelector('button[type=submit]');
  const txt = btn.textContent;
  btn.textContent = 'Enviando...'; btn.disabled = true;

  const dados = Object.fromEntries(new FormData(form).entries());
  dados.origem = 'LP MarmoMonte';
  dados.data = new Date().toLocaleString('pt-BR');

  try{
    if(ENDPOINT_FORM.startsWith('http')){
      await fetch(ENDPOINT_FORM, {method:'POST', mode:'no-cors', body: JSON.stringify(dados)});
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event:'gerar_lead', formulario:'orcamento', ambiente:dados.ambiente, perfil:dados.perfil});
    document.getElementById('msgOk').style.display = 'block';
    form.reset();
  }catch(err){
    document.getElementById('msgOk').textContent = 'Não foi possível enviar agora. Chame no WhatsApp (51) 9 9019-9620.';
    document.getElementById('msgOk').style.display = 'block';
  }finally{
    btn.textContent = txt; btn.disabled = false;
  }
});


/* lightbox com zoom */
(function(){
  const fotos=[...document.querySelectorAll('.g')];
  if(!fotos.length) return;
  const lb=document.getElementById('lb'), palco=document.getElementById('lbPalco'),
        img=document.getElementById('lbImg'), leg=document.getElementById('lbLegenda'),
        conta=document.getElementById('lbConta');
  let atual=0, escala=1, px=0, py=0, arrastando=false, x0=0, y0=0, d0=0;

  function aplicar(){
    img.style.transform=`translate(${px}px, ${py}px) scale(${escala})`;
    palco.classList.toggle('zoom', escala>1);
  }
  function zoom(v, cx, cy){
    const ant=escala;
    escala=Math.min(5, Math.max(1, v));
    if(escala===1){ px=0; py=0; }
    else if(cx!==undefined){
      const r=img.getBoundingClientRect();
      const ox=cx-(r.left+r.width/2), oy=cy-(r.top+r.height/2);
      px-=ox*(escala/ant-1); py-=oy*(escala/ant-1);
    }
    aplicar();
  }
  function mostrar(i){
    atual=(i+fotos.length)%fotos.length;
    const b=fotos[atual];
    img.src=b.dataset.full; img.alt=b.dataset.legenda;
    leg.textContent=b.dataset.legenda;
    conta.textContent=`${atual+1} / ${fotos.length}`;
    escala=1; px=0; py=0; aplicar();
  }
  function abrir(i){ mostrar(i); lb.classList.add('on'); document.body.style.overflow='hidden'; }
  function fechar(){ lb.classList.remove('on'); document.body.style.overflow=''; img.src=''; }

  fotos.forEach((b,i)=>b.addEventListener('click',()=>abrir(i)));
  document.getElementById('lbFechar').onclick=fechar;
  document.getElementById('lbAnt').onclick=e=>{e.stopPropagation();mostrar(atual-1)};
  document.getElementById('lbProx').onclick=e=>{e.stopPropagation();mostrar(atual+1)};
  document.getElementById('lbMais').onclick=e=>{e.stopPropagation();zoom(escala+.5)};
  document.getElementById('lbMenos').onclick=e=>{e.stopPropagation();zoom(escala-.5)};

  lb.addEventListener('click',e=>{ if(e.target===lb||e.target===palco) fechar(); });
  document.addEventListener('keydown',e=>{
    if(!lb.classList.contains('on')) return;
    if(e.key==='Escape') fechar();
    if(e.key==='ArrowRight') mostrar(atual+1);
    if(e.key==='ArrowLeft') mostrar(atual-1);
  });

  img.addEventListener('dblclick',e=>{ e.preventDefault(); zoom(escala>1?1:2.5, e.clientX, e.clientY); });
  img.addEventListener('click',e=>{ e.stopPropagation(); if(escala===1) zoom(2.2, e.clientX, e.clientY); });
  palco.addEventListener('wheel',e=>{ e.preventDefault(); zoom(escala + (e.deltaY<0?.35:-.35), e.clientX, e.clientY); },{passive:false});

  /* arrastar com mouse */
  img.addEventListener('pointerdown',e=>{
    if(escala<=1) return;
    arrastando=true; palco.classList.add('arrastando');
    x0=e.clientX-px; y0=e.clientY-py; img.setPointerCapture(e.pointerId);
  });
  img.addEventListener('pointermove',e=>{ if(!arrastando) return; px=e.clientX-x0; py=e.clientY-y0; aplicar(); });
  ['pointerup','pointercancel'].forEach(ev=>img.addEventListener(ev,()=>{arrastando=false;palco.classList.remove('arrastando')}));

  /* pinça no toque */
  palco.addEventListener('touchstart',e=>{
    if(e.touches.length===2){
      d0=Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
    }
  },{passive:true});
  palco.addEventListener('touchmove',e=>{
    if(e.touches.length===2 && d0){
      e.preventDefault();
      const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
      zoom(escala*(d/d0), (e.touches[0].clientX+e.touches[1].clientX)/2, (e.touches[0].clientY+e.touches[1].clientY)/2);
      d0=d;
    }
  },{passive:false});
  palco.addEventListener('touchend',()=>{ d0=0; });
})();

/* eventos de clique nos CTAs */
document.querySelectorAll('[data-cta]').forEach(el=>{
  el.addEventListener('click', ()=>{
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event:'clique_cta', local: el.getAttribute('data-cta')});
  });
});