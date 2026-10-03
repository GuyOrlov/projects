const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const money=n=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(n);
async function getJSON(path){const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw new Error(path);return r.json()}
function safeLink(url){return url&&url!=='#'?url:'#commercial'}

async function initHomepage(){
  if(!$('[data-hero-title]')) return;
  try{
    const [site,facts,tools,offers]=await Promise.all([getJSON('data/site.json'),getJSON('data/facts.json'),getJSON('data/tools.json'),getJSON('data/offers.json')]);
    document.title=`${site.siteName} — ${site.strapline}`;
    $('[data-hero-eyebrow]').textContent=site.heroEyebrow;
    $('[data-hero-title]').textContent=site.heroTitle;
    $('[data-hero-text]').textContent=site.heroText;
    const pc=$('[data-primary]'); if(pc){pc.textContent=site.primaryCta;pc.href=site.primaryCtaHref}
    const sc=$('[data-secondary]'); if(sc){sc.textContent=site.secondaryCta;sc.href=site.secondaryCtaHref}
    const updated=$('[data-updated]'); if(updated) updated.textContent=`Evidence checked ${new Date(facts.updated+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}`;
    const factsEl=$('#facts'); if(factsEl) factsEl.innerHTML=facts.facts.map(f=>`<article class="fact"><div class="big-stat">${f.stat}</div><div class="stat-suffix">${f.suffix}</div><h3>${f.title}</h3><p>${f.description}</p><div class="bar-chart" role="img" aria-label="Comparison: ${f.chartLabelA} ${f.chartValueA}; ${f.chartLabelB} ${f.chartValueB}"><div class="bar-wrap"><div class="bar" style="height:${Math.min(f.chartValueA,100)}%"></div><div class="bar-label">${f.chartLabelA}</div></div><div class="bar-wrap"><div class="bar alt" style="height:${Math.min(f.chartValueB,100)}%"></div><div class="bar-label">${f.chartLabelB}</div></div></div><div class="source">Source: <a href="${f.sourceUrl}" target="_blank" rel="noopener">${f.source} ↗</a></div></article>`).join('');
    const toolsEl=$('#tools'); if(toolsEl) toolsEl.innerHTML=tools.tools.map(t=>`<article class="tool-card"><div class="tool-icon" aria-hidden="true">${t.icon}</div><h3>${t.title}</h3><p>${t.description}</p><a class="btn" href="${t.href}">${t.button} →</a></article>`).join('');
    const disclosure=$('[data-disclosure]'); if(disclosure) disclosure.textContent=offers.disclosure;
    const offersEl=$('#offers'); if(offersEl) offersEl.innerHTML=offers.offers.map(o=>`<article class="offer"><span class="offer-label">${o.label}</span><small>${o.category}</small><h3>${o.title}</h3><p>${o.description}</p><a class="btn" href="${safeLink(o.href)}" ${o.href&&o.href.startsWith('http')?'target="_blank" rel="sponsored noopener"':''}>${o.button} →</a></article>`).join('');
    const footer=$('[data-footer]'); if(footer) footer.textContent=site.footerText;
    const email=$('[data-email]'); if(email){email.href=`mailto:${site.email}`;email.textContent=site.email}
  }catch(e){console.error(e)}
}

function setupProgress(){
  const boxes=$$('.money-step'),out=$('#progressNum'),bar=$('#progressBar');
  if(!boxes.length||!out||!bar) return;
  function update(){const done=boxes.filter(b=>b.checked).length,p=Math.round(done/boxes.length*100);out.textContent=`${p}%`;bar.style.width=`${p}%`;localStorage.setItem('atm-progress',JSON.stringify(boxes.map(b=>b.checked)))}
  let saved=[]; try{saved=JSON.parse(localStorage.getItem('atm-progress')||'[]')}catch{}
  boxes.forEach((b,i)=>{b.checked=!!saved[i];b.addEventListener('change',update)});update();
}

function futureValue(start,monthly,annual,years){const r=annual/100/12,n=years*12;if(!r)return start+monthly*n;return start*Math.pow(1+r,n)+monthly*((Math.pow(1+r,n)-1)/r)}
function setupCalcs(){
  const pension=$('#pensionForm');
  if(pension) pension.addEventListener('submit',e=>{e.preventDefault();const start=+$('#pensionPot').value||0,monthly=+$('#pensionMonthly').value||0,growth=+$('#pensionGrowth').value||0,years=+$('#pensionYears').value||0;const total=futureValue(start,monthly,growth,years),paid=start+monthly*years*12;$('#pensionResult').innerHTML=`<b>${money(total)}</b><small>Illustrative pot after ${years} years. Contributions entered: ${money(paid)}. This is not a forecast or guarantee and ignores fees, tax, inflation and changing returns.</small>`});
  const savings=$('#savingsForm');
  if(savings) savings.addEventListener('submit',e=>{e.preventDefault();const start=+$('#savingStart').value||0,monthly=+$('#savingMonthly').value||0,rate=+$('#savingRate').value||0,years=+$('#savingYears').value||0;const total=futureValue(start,monthly,rate,years),paid=start+monthly*years*12;$('#savingsResult').innerHTML=`<b>${money(total)}</b><small>Illustrative value after ${years} years; ${money(paid)} contributed. Actual savings rates can change.</small>`});
}

function setupUI(){
  const root=document.documentElement;
  if(localStorage.getItem('atm-dark')==='true') root.classList.add('dark');
  if(localStorage.getItem('atm-large-text')==='true') root.classList.add('large-text');
  const theme=$('#themeBtn'); if(theme){theme.setAttribute('aria-pressed',root.classList.contains('dark'));theme.addEventListener('click',()=>{root.classList.toggle('dark');const on=root.classList.contains('dark');localStorage.setItem('atm-dark',on);theme.setAttribute('aria-pressed',on)})}
  const text=$('#textBtn'); if(text){text.setAttribute('aria-pressed',root.classList.contains('large-text'));text.addEventListener('click',()=>{root.classList.toggle('large-text');const on=root.classList.contains('large-text');localStorage.setItem('atm-large-text',on);text.setAttribute('aria-pressed',on)})}
  const menu=$('#menuBtn'),nav=$('#navLinks'); if(menu&&nav) menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
}

document.addEventListener('DOMContentLoaded',()=>{initHomepage();setupProgress();setupCalcs();setupUI()});
