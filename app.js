const scenes = [
  {cls:'scene-lanternlake', particles:'lanterns'},
  {cls:'scene-bamboo', particles:'gold'},
  {cls:'scene-templecliff', particles:'sparkles'},
  {cls:'scene-blueforest', particles:'butterflies'},
  {cls:'scene-redmoon', particles:'sparkles'},
  {cls:'scene-torii', particles:'petals'},
  {cls:'scene-lotus', particles:'fireflies'},
  {cls:'scene-blossomvillage', particles:'petals'},
  {cls:'scene-ghostvillage', particles:'ghosts'},
  {cls:'scene-cozywindow', particles:'sparkles'},
  {cls:'scene-moonmountain', particles:'fireflies'},
  {cls:'scene-goldenpalace', particles:'gold'},
  {cls:'scene-seasidetown', particles:'sparkles'},
  {cls:'scene-jade', particles:'petals'},
  {cls:'scene-pinkcity', particles:'rain'}
];

let idx = 0, shuffled = [], currentSceneCls = '';
let favorites = JSON.parse(localStorage.getItem('mm2-favs')||'[]');
let mehList = JSON.parse(localStorage.getItem('mm2-meh')||'[]');
let soundOn = false, audioCtx = null;

function shuffleArr(arr) {
  let f = arr.filter(c => !mehList.includes(c.text));
  if (f.length < 5) { mehList=[]; localStorage.removeItem('mm2-meh'); f=[...arr]; }
  const a = [...f];
  for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

function pickScene() {
  let s;
  do { s = scenes[Math.floor(Math.random()*scenes.length)]; } while(s.cls===currentSceneCls && scenes.length>1);
  return s;
}

function makeParticles(type) {
  const c = document.getElementById('particles'); c.innerHTML='';
  const count = {petals:16,sparkles:22,fireflies:14,lanterns:8,butterflies:12,rain:45,gold:20,ghosts:8}[type]||15;
  for(let i=0;i<count;i++){
    const el = document.createElement('div');
    if(type==='petals'){
      el.className='p-petal';
      el.style.left=Math.random()*100+'%';
      el.style.width=(8+Math.random()*12)+'px'; el.style.height=el.style.width;
      el.style.animationDuration=(6+Math.random()*10)+'s';
      el.style.animationDelay=Math.random()*8+'s';
      const cols=['rgba(255,182,193,0.7)','rgba(255,228,225,0.6)','rgba(255,200,220,0.5)','rgba(255,160,180,0.6)'];
      el.style.background='radial-gradient(ellipse,'+cols[Math.floor(Math.random()*cols.length)]+',transparent)';
    } else if(type==='sparkles'){
      el.className='p-sparkle';
      el.style.left=Math.random()*100+'%'; el.style.top=Math.random()*100+'%';
      el.style.width=(2+Math.random()*4)+'px'; el.style.height=el.style.width;
      const col=['rgba(255,255,255,0.8)','rgba(255,215,0,0.7)','rgba(200,180,255,0.7)'][Math.floor(Math.random()*3)];
      el.style.color=col; el.style.background=col;
      el.style.animationDuration=(1.5+Math.random()*2.5)+'s';
      el.style.animationDelay=Math.random()*5+'s';
    } else if(type==='fireflies'){
      el.className='p-firefly';
      el.style.left=Math.random()*100+'%'; el.style.top=(20+Math.random()*60)+'%';
      el.style.animationDuration=(4+Math.random()*6)+'s';
      el.style.animationDelay=Math.random()*6+'s';
    } else if(type==='lanterns'){
      el.className='p-lantern';
      el.style.left=(10+Math.random()*80)+'%'; el.style.top=(15+Math.random()*50)+'%';
      el.style.animationDelay=Math.random()*3+'s';
    } else if(type==='butterflies'){
      el.className='p-butterfly';
      el.style.left=Math.random()*100+'%'; el.style.top=(30+Math.random()*50)+'%';
      el.style.animationDuration=(5+Math.random()*5)+'s';
      el.style.animationDelay=Math.random()*6+'s';
    } else if(type==='rain'){
      el.className='p-rain';
      el.style.left=Math.random()*100+'%';
      el.style.height=(12+Math.random()*20)+'px';
      el.style.animationDuration=(0.5+Math.random()*0.6)+'s';
      el.style.animationDelay=Math.random()*2+'s';
    } else if(type==='gold'){
      el.className='p-gold';
      el.style.left=Math.random()*100+'%';
      el.style.animationDuration=(5+Math.random()*8)+'s';
      el.style.animationDelay=Math.random()*6+'s';
    } else if(type==='ghosts'){
      el.className='p-ghost';
      el.style.left=(10+Math.random()*80)+'%'; el.style.top=(30+Math.random()*50)+'%';
      el.style.animationDelay=Math.random()*2+'s';
      el.style.opacity=0.3+Math.random()*0.3;
    }
    c.appendChild(el);
  }
}

function showCard() {
  const card = shuffled[idx];
  const scene = pickScene();
  document.getElementById('scene').className = 'scene ' + scene.cls;
  currentSceneCls = scene.cls;
  makeParticles(scene.particles);
  const qt = document.getElementById('quoteText');
  qt.style.animation='none'; qt.offsetHeight; qt.style.animation='fadeInUp 0.7s ease both';
  document.getElementById('quoteType').textContent =
    card.type==='breathe'?'breathe':card.type==='vibe'?'imagine':card.type==='joke'?'smile':card.type==='affirm'?'you':'gentle reminder';
  document.getElementById('quoteEmoji').textContent = card.emoji;
  qt.textContent = card.text;
  document.getElementById('quoteSub').textContent = card.sub;
  document.getElementById('counter').textContent = (idx+1)+'/'+shuffled.length;
  updateFavBtn();
  if(soundOn) playChime();
  if(idx>0) document.getElementById('swipeHint').style.display='none';
}

function nextCard(){idx=(idx+1)%shuffled.length;if(idx===0)shuffled=shuffleArr(cards);showCard();}
function prevCard(){idx=(idx-1+shuffled.length)%shuffled.length;showCard();}

// SWIPE
let sx=0,sy=0;
document.getElementById('scene').addEventListener('touchstart',e=>{sx=e.changedTouches[0].screenX;sy=e.changedTouches[0].screenY},{passive:true});
document.getElementById('scene').addEventListener('touchend',e=>{
  const dx=sx-e.changedTouches[0].screenX, dy=sy-e.changedTouches[0].screenY;
  if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>50){dx>0?nextCard():prevCard();}
},{passive:true});
document.getElementById('scene').addEventListener('click',e=>{
  if(e.target.closest('.act-btn')||e.target.closest('.nav-btn')||e.target.closest('.nav'))return;
  nextCard();
});

// MEH
document.getElementById('btnMeh').addEventListener('click',e=>{
  e.stopPropagation();
  const c=shuffled[idx];
  if(!mehList.includes(c.text)){mehList.push(c.text);localStorage.setItem('mm2-meh',JSON.stringify(mehList));}
  shuffled.splice(idx,1);
  if(!shuffled.length)shuffled=shuffleArr(cards);
  if(idx>=shuffled.length)idx=0;
  showCard();
});

// FAV
function updateFavBtn(){
  const btn=document.getElementById('btnFav');
  const isFav=favorites.some(f=>f.text===shuffled[idx].text);
  btn.classList.toggle('fav-active',isFav);
  btn.innerHTML=isFav?'&#10084;&#65039;':'&#9825;';
}
document.getElementById('btnFav').addEventListener('click',e=>{
  e.stopPropagation();
  const c=shuffled[idx];
  const i=favorites.findIndex(f=>f.text===c.text);
  if(i>=0)favorites.splice(i,1); else favorites.push({emoji:c.emoji,text:c.text,sub:c.sub});
  localStorage.setItem('mm2-favs',JSON.stringify(favorites));
  updateFavBtn();
});

// FAVORITES VIEW
document.getElementById('navFav').addEventListener('click',()=>{
  document.getElementById('favoritesView').classList.add('show');
  document.getElementById('navFav').classList.add('active');
  document.getElementById('navHome').classList.remove('active');
  renderFavs();
});
document.getElementById('navHome').addEventListener('click',()=>{
  document.getElementById('favoritesView').classList.remove('show');
  document.getElementById('navHome').classList.add('active');
  document.getElementById('navFav').classList.remove('active');
});
function renderFavs(){
  const list=document.getElementById('favList');
  if(!favorites.length){list.innerHTML='<div class="empty-fav">No favorites yet.<br>Tap &#9825; on cards you love.</div>';return;}
  list.innerHTML=favorites.map((f,i)=>'<div class="fav-card"><button class="fav-remove" onclick="rmFav('+i+')">&times;</button><div class="fav-card-emoji">'+f.emoji+'</div><div class="fav-card-text">'+f.text+'</div></div>').join('');
}
function rmFav(i){favorites.splice(i,1);localStorage.setItem('mm2-favs',JSON.stringify(favorites));renderFavs();updateFavBtn();}

// SOUND
document.getElementById('btnSound').addEventListener('click',e=>{
  e.stopPropagation();
  soundOn=!soundOn;
  document.getElementById('btnSound').classList.toggle('sound-active',soundOn);
  if(soundOn)playChime();
});
function playChime(){
  try{
    if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();
    const o=audioCtx.createOscillator(),g=audioCtx.createGain();
    o.connect(g);g.connect(audioCtx.destination);o.type='sine';
    const notes=[523.25,587.33,659.25,783.99,880,1046.5,1174.66];
    o.frequency.value=notes[Math.floor(Math.random()*notes.length)];
    g.gain.setValueAtTime(0.1,audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+2);
    o.start(audioCtx.currentTime);o.stop(audioCtx.currentTime+2);
  }catch(e){}
}

// KEYBOARD
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'||e.key===' ')nextCard();
  if(e.key==='ArrowLeft')prevCard();
});

// INIT
shuffled=shuffleArr(cards); showCard();
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
