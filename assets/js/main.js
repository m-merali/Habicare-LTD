// Habicare LTD landing interactivity
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d', { alpha: true });
let w, h, dpr;

function resize(){
  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  w = canvas.width = Math.floor(innerWidth * dpr);
  h = canvas.height = Math.floor(innerHeight * dpr);
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
}
resize();
addEventListener('resize', resize);

// Particle field
const BRAND = '#9ca88c';
const particles = [];
const count = Math.min(120, Math.floor((innerWidth*innerHeight)/16000));
for(let i=0;i<count;i++){
  particles.push({
    x: Math.random()*w, y: Math.random()*h,
    vx: (Math.random()-.5)*0.2, vy: (Math.random()-.5)*0.2,
    r: Math.random()*1.6 + .3
  });
}

let mx = w/2, my = h/2;
addEventListener('pointermove', (e)=>{
  mx = (e.clientX || innerWidth/2) * dpr;
  my = (e.clientY || innerHeight/2) * dpr;
});

function step(){
  ctx.clearRect(0,0,w,h);
  // glow bg
  const grd = ctx.createRadialGradient(mx,my, 0, mx,my, Math.max(w,h)/1.2);
  grd.addColorStop(0, 'rgba(156,168,140,0.18)');
  grd.addColorStop(1, 'rgba(156,168,140,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0,0,w,h);

  // particles
  for(const p of particles){
    p.x += p.vx + (mx - p.x)*0.00003;
    p.y += p.vy + (my - p.y)*0.00003;
    if(p.x<0) p.x+=w; if(p.x>w) p.x-=w;
    if(p.y<0) p.y+=h; if(p.y>h) p.y-=h;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fill();
  }
  requestAnimationFrame(step);
}
requestAnimationFrame(step);

// Subtle parallax on logo stack
const logoWrap = document.querySelector('.logo-wrap');
addEventListener('pointermove', (e)=>{
  const x = (e.clientX / innerWidth - .5) * 10;
  const y = (e.clientY / innerHeight - .5) * 10;
  logoWrap.style.transform = `translate3d(${x}px, ${y}px, 0)`;
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Light/Dark toggle with localStorage (+ respect system on first load)
const modeToggle = document.getElementById('modeToggle');
function setMode(mode){
  const logo = document.getElementById('logo');
  if(mode === 'light'){
    document.body.classList.add('light');
    logo.src = "assets/img/logo-light.png";
  } else {
    document.body.classList.remove('light');
    logo.src = "assets/img/logo-dark.png";
  }
  localStorage.setItem('habicare_mode', mode);
  modeToggle.setAttribute('aria-pressed', mode === 'light');
}

modeToggle.addEventListener('click', ()=>{
  const next = document.body.classList.contains('light') ? 'dark' : 'light';
  setMode(next);
});

const saved = localStorage.getItem('habicare_mode');
if(saved){
  setMode(saved);
} else {
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  setMode(prefersLight ? 'light' : 'dark');
}
