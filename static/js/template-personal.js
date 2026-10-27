document.querySelector('.copy-citation')?.addEventListener('click',async event=>{
 const b=event.currentTarget,s=document.getElementById('copy-status');
 try{await navigator.clipboard.writeText(document.getElementById('citation').textContent);s.textContent=b.dataset.done}
 catch{s.textContent=b.dataset.fail}
});
document.addEventListener('DOMContentLoaded',()=>{
 const hero=document.querySelector('.hero-section');if(!hero||!window.gsap)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const zh=document.documentElement.lang.startsWith('zh');
 const button=document.createElement('button');button.className='motion-control';hero.append(button);
 let paused=reduced.matches;
 const apply=()=>{
   if(paused){gsap.globalTimeline.pause();hero.querySelectorAll('[data-animation]').forEach(e=>{e.style.opacity='1'});}
   else if(!document.hidden)gsap.globalTimeline.resume();
   button.textContent=paused?(zh?'播放背景动效 ▷':'Play background motion ▷'):(zh?'暂停背景动效 Ⅱ':'Pause background motion Ⅱ');
   button.setAttribute('aria-pressed',String(paused));
 };
 button.addEventListener('click',()=>{paused=!paused;apply()});
 reduced.addEventListener('change',e=>{paused=e.matches;apply()});
 document.addEventListener('visibilitychange',()=>{if(paused)gsap.globalTimeline.pause()});
 apply();
});
