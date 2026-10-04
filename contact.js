// CONTACT POPUP (Formspree). FORMSPREE_ID is the form ID from formspree.io.
const FORMSPREE_ID='mdeanyek';
const cmodal=document.getElementById('cmodal'),cf=document.getElementById('contactForm');
if(cmodal&&cf){
  const status=document.getElementById('cfStatus'),btn=document.getElementById('cfSubmit'),ok=document.getElementById('cmSuccess');
  let lastFocus=null;
  const say=(msg,cls)=>{status.textContent=msg;status.className='cm-status '+(cls||'');};
  const openC=()=>{
    lastFocus=document.activeElement;
    document.getElementById('mobileMenu').classList.remove('open');
    cf.hidden=false;ok.hidden=true;say('');
    cmodal.classList.add('open');document.body.style.overflow='hidden';
    setTimeout(()=>cf.querySelector('input[name=name]').focus({preventScroll:true}),350);
  };
  const closeC=()=>{
    cmodal.classList.remove('open');document.body.style.overflow='';
    if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true});
  };
  document.querySelectorAll('[data-open-contact]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();openC();}));
  document.getElementById('cmClose').addEventListener('click',closeC);
  document.getElementById('cmDone').addEventListener('click',closeC);
  document.addEventListener('keydown',e=>{
    if(!cmodal.classList.contains('open'))return;
    if(e.key==='Escape'){closeC();return;}
    if(e.key==='Tab'){
      const f=[...cmodal.querySelectorAll('a[href],button:not([disabled]),input:not([type=hidden]):not(.cm-hp),textarea')].filter(x=>x.offsetParent!==null);
      if(!f.length)return;
      const first=f[0],last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  cf.addEventListener('submit',async e=>{
    e.preventDefault();
    const d=new FormData(cf);
    let bad=false;
    cf.querySelectorAll('[required]').forEach(f=>{
      const empty=!f.value.trim()||(f.type==='email'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value.trim()));
      f.classList.toggle('cm-err',empty);if(empty)bad=true;
    });
    if(bad){say('Please add your name, a valid email and a few words about the project.','err');return;}
    if(d.get('_gotcha')){cf.hidden=true;ok.hidden=false;return;}
    btn.disabled=true;say('Sending...');
    try{
      const r=await fetch('https://formspree.io/f/'+FORMSPREE_ID,{method:'POST',body:d,headers:{Accept:'application/json'}});
      if(!r.ok)throw new Error(r.status);
      cf.reset();cf.hidden=true;ok.hidden=false;
      ok.querySelector('button').focus({preventScroll:true});
    }catch(err){
      say('That did not send. Please email bshara@bsharakhoury.com directly.','err');
    }finally{btn.disabled=false;}
  });
  cf.querySelectorAll('[required]').forEach(f=>f.addEventListener('input',()=>f.classList.remove('cm-err')));
}
