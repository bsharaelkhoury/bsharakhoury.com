// NAV
document.getElementById('hamburger').addEventListener('click',()=>document.getElementById('mobileMenu').classList.add('open'));
document.getElementById('mobClose').addEventListener('click',()=>document.getElementById('mobileMenu').classList.remove('open'));
document.querySelectorAll('.mob-link').forEach(l=>l.addEventListener('click',()=>document.getElementById('mobileMenu').classList.remove('open')));

// FADE IN
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}});},{threshold:0.07});
document.querySelectorAll('.fade').forEach(el=>obs.observe(el));

// ACCORDION
document.querySelectorAll('.film-cat-header').forEach(h=>h.addEventListener('click',()=>h.parentElement.classList.toggle('open')));

// SCROLL ARROWS
document.querySelectorAll('.scroll-wrapper').forEach(wrapper=>{
  const track=wrapper.querySelector('.film-scroll-track');
  const leftBtn=wrapper.querySelector('.scroll-arrow.left');
  const rightBtn=wrapper.querySelector('.scroll-arrow.right');
  if(!track||!leftBtn||!rightBtn)return;
  const step=240;
  function updateArrows(){
    leftBtn.classList.toggle('hidden',track.scrollLeft<=0);
    rightBtn.classList.toggle('hidden',track.scrollLeft>=track.scrollWidth-track.clientWidth-2);
  }
  leftBtn.addEventListener('click',e=>{e.stopPropagation();track.scrollBy({left:-step,behavior:'smooth'});});
  rightBtn.addEventListener('click',e=>{e.stopPropagation();track.scrollBy({left:step,behavior:'smooth'});});
  track.addEventListener('scroll',updateArrows,{passive:true});
  setTimeout(updateArrows,300);
});

// VIDEO MODAL
const vmodal=document.getElementById('vmodal'),vf=document.getElementById('vmodalFrame');
function openV(src){vf.src=src;vmodal.classList.add('open');document.body.style.overflow='hidden';}
function closeV(){vmodal.classList.remove('open');vf.src='';document.body.style.overflow='';}
document.querySelectorAll('.film-thumb:not(.series-thumb)').forEach(t=>t.addEventListener('click',()=>openV(t.dataset.src)));
document.getElementById('vmodalClose').addEventListener('click',closeV);
vmodal.addEventListener('click',e=>{if(e.target===vmodal)closeV();});

// SERIES OVERLAYS
document.querySelectorAll('.series-thumb').forEach(t=>{
  t.addEventListener('click',()=>{
    const o=document.getElementById('series-'+t.dataset.series);
    if(o){o.classList.add('open');document.body.style.overflow='hidden';}
  });
});
document.querySelectorAll('.series-close-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{btn.closest('.series-overlay').classList.remove('open');document.body.style.overflow='';});
});
document.querySelectorAll('.ep-card').forEach(card=>{
  card.addEventListener('click',()=>openV(card.dataset.src));
});

// HEAD OF MEDIA - open in new tab (bundled JS app cannot run in iframe due to browser security)
document.getElementById('openHomReport').addEventListener('click',()=>{
  window.open('headofmedia.html','_blank');
});

// PHOTO ALBUMS


let curAlbum=[],curLayout='grid',carIdx=0;
const albOver=document.getElementById('albumOverlay'),albLbl=document.getElementById('albumCatLabel'),albCnt=document.getElementById('albumCount'),albBody=document.getElementById('albumBody'),albLb=document.getElementById('albLb'),albLbImg=document.getElementById('albLbImg');

document.querySelectorAll('.photo-cat-card').forEach(card=>card.addEventListener('click',()=>{
  curAlbum=photoData[card.dataset.album]||[];curLayout='grid';carIdx=0;
  albLbl.textContent=card.dataset.label.toUpperCase();
  albCnt.textContent=curAlbum.length?curAlbum.length+' photos':'';
  document.querySelectorAll('.lay-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector('[data-layout="grid"]').classList.add('active');
  renderAlbum();albOver.classList.add('open');document.body.style.overflow='hidden';
}));

document.getElementById('albumClose').addEventListener('click',()=>{albOver.classList.remove('open');document.body.style.overflow='';});
document.querySelectorAll('.lay-btn').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.lay-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  curLayout=btn.dataset.layout;carIdx=0;renderAlbum();
}));

function renderAlbum(){
  albBody.innerHTML='';
  if(!curAlbum.length){albBody.innerHTML='<p class="alb-empty">Album coming soon.</p>';return;}
  if(curLayout==='grid')doGrid();
  else if(curLayout==='carousel')doCarousel();
  else doFull();
}

function doGrid(){
  const g=document.createElement('div');g.className='alb-grid';
  curAlbum.forEach(p=>{
    const item=document.createElement('div');item.className='alb-grid-item';
    const img=document.createElement('img');img.alt=(albLbl.textContent||'Photo').toLowerCase()+' photograph '+(curAlbum.indexOf(p)+1);img.loading='lazy';
    img.addEventListener('load',()=>{
      requestAnimationFrame(()=>img.classList.add('loaded'));
    });
    img.src=p.src;
    item.appendChild(img);
    item.addEventListener('click',()=>{albLbImg.src=p.src;albLb.classList.add('open');});
    g.appendChild(item);
  });
  albBody.appendChild(g);
}

function doCarousel(){
  const wrap=document.createElement('div');wrap.className='alb-carousel';
  const stage=document.createElement('div');stage.className='car-stage-fixed';
  const mi=document.createElement('img');mi.src=curAlbum[carIdx].src;mi.alt=(albLbl.textContent||'Photo').toLowerCase()+' photograph '+(carIdx+1);
  stage.appendChild(mi);
  const ctrl=document.createElement('div');ctrl.className='car-controls';
  const prev=document.createElement('button');prev.className='car-arrow';prev.textContent='‹';
  const cnt=document.createElement('span');cnt.className='car-count';cnt.textContent=(carIdx+1)+' / '+curAlbum.length;
  const next=document.createElement('button');next.className='car-arrow';next.textContent='›';
  ctrl.appendChild(prev);ctrl.appendChild(cnt);ctrl.appendChild(next);
  const strip=document.createElement('div');strip.className='car-strip';
  curAlbum.forEach((p,i)=>{
    const t=document.createElement('img');t.src=p.src;t.loading='lazy';
    if(i===carIdx)t.classList.add('active');
    t.addEventListener('click',()=>goTo(i));
    strip.appendChild(t);
  });
  function goTo(i){
    carIdx=i;
    mi.style.opacity='0';
    setTimeout(()=>{mi.src=curAlbum[i].src;mi.style.opacity='1';},220);
    cnt.textContent=(i+1)+' / '+curAlbum.length;
    strip.querySelectorAll('img').forEach((t,idx)=>t.classList.toggle('active',idx===i));
    const active=strip.querySelectorAll('img')[i];
    if(active)active.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
  }
  prev.addEventListener('click',()=>goTo((carIdx-1+curAlbum.length)%curAlbum.length));
  next.addEventListener('click',()=>goTo((carIdx+1)%curAlbum.length));
  wrap.appendChild(stage);wrap.appendChild(ctrl);wrap.appendChild(strip);
  albBody.appendChild(wrap);
}

function doFull(){
  const wrap=document.createElement('div');wrap.className='alb-full';
  curAlbum.forEach(p=>{
    const item=document.createElement('div');item.className='alb-full-item';
    const img=document.createElement('img');img.alt='';img.loading='lazy';
    img.style.cssText='opacity:0;transition:opacity 0.5s ease;';
    img.addEventListener('load',()=>{img.style.opacity='1';});
    img.src=p.src;
    item.appendChild(img);wrap.appendChild(item);
  });
  albBody.appendChild(wrap);
}

document.getElementById('albLbX').addEventListener('click',()=>{albLb.classList.remove('open');albLbImg.src='';});
albLb.addEventListener('click',e=>{if(e.target===albLb){albLb.classList.remove('open');albLbImg.src='';}});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    closeV();
    albOver.classList.remove('open');
    albLb.classList.remove('open');albLbImg.src='';
    document.querySelectorAll('.series-overlay.open').forEach(o=>o.classList.remove('open'));
    document.getElementById('mobileMenu').classList.remove('open');
    document.body.style.overflow='';
  }
});

// ACCESSIBILITY: make click-only elements keyboard operable
document.querySelectorAll('.film-thumb,.ep-card,.photo-cat-card,.film-cat-header').forEach(el=>{
  if(!el.hasAttribute('tabindex'))el.setAttribute('tabindex','0');
  el.setAttribute('role','button');
  if(!el.getAttribute('aria-label')){
    const t=el.querySelector('img');
    const label=(t&&t.alt)||el.dataset.label||(el.textContent||'').trim().replace(/\s+/g,' ').slice(0,60);
    if(label)el.setAttribute('aria-label',label);
  }
});
document.addEventListener('keydown',e=>{
  if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('[role="button"][tabindex="0"]')){
    e.preventDefault();e.target.click();
  }
});
const yearEl=document.getElementById('year');if(yearEl)yearEl.textContent=new Date().getFullYear();
