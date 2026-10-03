const ENHANCED_DATA_URL="data/dashboard.json?v=20261003-features-v1";
let enhancedDashboard=null;
let activeTopicFilter="all";

document.addEventListener("DOMContentLoaded",()=>{
  bindDiscoverySearch();
  bindChartTools();
  loadEnhancedDashboard();
});

async function loadEnhancedDashboard(){
  try{
    const response=await fetch(ENHANCED_DATA_URL);
    if(!response.ok) throw new Error("Enhanced dashboard data could not be loaded");
    enhancedDashboard=await response.json();
    renderTrendFeature();
    renderCountryFeature();
  }catch(error){
    console.error(error);
    ["trendFeature","countryFeature"].forEach(id=>{
      const el=document.getElementById(id);
      if(el) el.classList.add("feature-load-failed");
    });
  }
}

function bindDiscoverySearch(){
  const input=document.getElementById("dataSearch");
  const buttons=document.querySelectorAll("[data-topic-filter]");
  const cards=Array.from(document.querySelectorAll(".issue-card[data-topic]"));
  const status=document.getElementById("searchStatus");
  if(!input || !cards.length) return;

  function apply(){
    const query=input.value.trim().toLowerCase();
    let visible=0;
    cards.forEach(card=>{
      const topic=card.dataset.topic||"";
      const haystack=((card.textContent||"")+" "+(card.dataset.keywords||"")).toLowerCase();
      const topicMatch=activeTopicFilter==="all" || topic===activeTopicFilter;
      const queryMatch=!query || haystack.includes(query);
      const show=topicMatch && queryMatch;
      card.hidden=!show;
      if(show) visible++;
    });
    if(status){
      status.textContent=query || activeTopicFilter!=="all"
        ? visible+" topic"+(visible===1?"":"s")+" matched"
        : "Showing all topics";
    }
  }

  input.addEventListener("input",apply);
  buttons.forEach(button=>{
    button.addEventListener("click",()=>{
      activeTopicFilter=button.dataset.topicFilter;
      buttons.forEach(b=>{
        const active=b===button;
        b.classList.toggle("active",active);
        b.setAttribute("aria-pressed",String(active));
      });
      apply();
    });
  });
  apply();
}

function renderTrendFeature(){
  const rows=enhancedDashboard?.disabilityTrend||[];
  const svg=document.getElementById("trendSvg");
  const mobile=document.getElementById("trendMobile");
  const insight=document.getElementById("trendInsight");
  if(!rows.length) return;

  if(svg){
    const width=720,height=260,pad={l:48,r:26,t:28,b:48};
    const minV=Math.min(...rows.map(r=>r.value))-2;
    const maxV=Math.max(...rows.map(r=>r.value))+2;
    const x=i=>pad.l+(i*(width-pad.l-pad.r)/Math.max(1,rows.length-1));
    const y=v=>pad.t+((maxV-v)*(height-pad.t-pad.b)/Math.max(1,maxV-minV));
    const points=rows.map((r,i)=>x(i)+","+y(r.value)).join(" ");
    const grid=[20,22,24,26].map(v=>'<line x1="'+pad.l+'" y1="'+y(v)+'" x2="'+(width-pad.r)+'" y2="'+y(v)+'" class="trend-grid"/><text x="'+(pad.l-10)+'" y="'+(y(v)+4)+'" text-anchor="end" class="trend-axis">'+v+'%</text>').join("");
    const labels=rows.map((r,i)=>'<text x="'+x(i)+'" y="'+(height-16)+'" text-anchor="middle" class="trend-axis">'+escapeSvg(r.period)+'</text>').join("");
    const dots=rows.map((r,i)=>'<circle cx="'+x(i)+'" cy="'+y(r.value)+'" r="6" class="trend-dot"/><text x="'+x(i)+'" y="'+(y(r.value)-13)+'" text-anchor="middle" class="trend-value">'+r.value+'%</text>').join("");
    svg.setAttribute("viewBox","0 0 "+width+" "+height);
    svg.innerHTML=grid+'<polyline points="'+points+'" class="trend-line"/>'+dots+labels;
  }
  if(mobile){
    mobile.innerHTML=rows.map(r=>'<div class="trend-mobile-row"><span>'+escapeHtml2(r.period)+'</span><strong>'+r.value+'%</strong></div>').join("");
  }
  if(insight){
    const first=rows[0],last=rows[rows.length-1];
    const change=last.value-first.value;
    insight.innerHTML='<strong>'+first.value+'% → '+last.value+'%</strong><span>'+Math.abs(change)+' percentage point'+(Math.abs(change)===1?"":"s")+" "+(change>=0?"increase":"decrease")+' across the selected years.</span>';
  }
}

function renderCountryFeature(){
  const comparison=enhancedDashboard?.countryComparison;
  const target=document.getElementById("countryBars");
  const insight=document.getElementById("countryInsight");
  const period=document.getElementById("countryPeriod");
  if(!comparison || !target) return;
  const rows=comparison.rows.slice().sort((a,b)=>b.value-a.value);
  const max=Math.max(...rows.map(r=>r.value),1);
  if(period) period.textContent=comparison.period+" · complete four-nation comparison";
  target.innerHTML=rows.map((row,index)=>
    '<div class="country-bar-row"><div class="country-bar-head"><span>'+escapeHtml2(row.label)+'</span><strong>'+row.value+'%</strong></div>'+
    '<div class="country-bar-track" aria-hidden="true"><div class="country-bar-fill" style="width:'+((row.value/max)*100).toFixed(1)+'%"></div></div>'+
    (index===0?'<small>Highest of the four nations</small>':'')+'</div>'
  ).join("");
  if(insight){
    const high=rows[0],low=rows[rows.length-1];
    insight.innerHTML='<strong>Highest: '+escapeHtml2(high.label)+' · '+high.value+'%</strong><span>Lowest: '+escapeHtml2(low.label)+' · '+low.value+'%. Figures are from '+escapeHtml2(comparison.period)+'.</span>';
  }
}

function bindChartTools(){
  document.addEventListener("click",event=>{
    const csvButton=event.target.closest("[data-download-csv]");
    if(csvButton){ downloadFeatureCsv(csvButton.dataset.downloadCsv); return; }
    const pngButton=event.target.closest("[data-download-png]");
    if(pngButton){ downloadFeaturePng(pngButton.dataset.downloadPng); return; }
    const shareButton=event.target.closest("[data-share-chart]");
    if(shareButton){ shareFeature(shareButton.dataset.shareChart); }
  });
}

function featureRows(key){
  if(key==="trend") return (enhancedDashboard?.disabilityTrend||[]).map(r=>({label:r.period,value:r.value,suffix:"%"}));
  if(key==="country") return (enhancedDashboard?.countryComparison?.rows||[]).map(r=>({label:r.label,value:r.value,suffix:"%"}));
  if(key==="prevalence"){
    return Array.from(document.querySelectorAll("#prevalenceTableBody tr")).map(tr=>{
      const cells=tr.querySelectorAll("th,td");
      return {label:cells[0]?.textContent.trim()||"",value:parseFloat(cells[1]?.textContent)||0,suffix:"%"};
    });
  }
  if(key==="bsl"){
    return Array.from(document.querySelectorAll("#bslTableBody tr")).map(tr=>{
      const cells=tr.querySelectorAll("th,td");
      const raw=cells[1]?.textContent.trim()||"";
      return {label:cells[0]?.textContent.trim()||"",display:raw,value:parseFloat(raw.replace(/[^0-9.]/g,""))||0,suffix:raw.toLowerCase().includes("k")?"k":""};
    });
  }
  return [];
}

function featureTitle(key){
  return {
    prevalence:"Share of people who are disabled",
    bsl:"British Sign Language population measures",
    trend:"UK disability prevalence trend",
    country:"Disability prevalence by UK nation"
  }[key]||"UK disability data";
}

function downloadFeatureCsv(key){
  const rows=featureRows(key);
  if(!rows.length) return;
  const lines=[["Label","Value"].map(csvCell2).join(",")];
  rows.forEach(r=>lines.push([r.label,r.display||String(r.value)+(r.suffix||"")].map(csvCell2).join(",")));
  downloadBlob2(lines.join("\n"),key+"-disability-data.csv","text/csv;charset=utf-8");
}

function downloadFeaturePng(key){
  const rows=featureRows(key);
  if(!rows.length) return;
  const canvas=document.createElement("canvas");
  canvas.width=1200;
  canvas.height=250+rows.length*105;
  const ctx=canvas.getContext("2d");
  ctx.fillStyle="#ffffff";ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#163300";ctx.font="700 44px Arial";ctx.fillText(featureTitle(key),65,70);
  ctx.font="24px Arial";ctx.fillStyle="#38463b";ctx.fillText("Access to Data · UK Disability Data Hub",65,110);
  const max=Math.max(...rows.map(r=>r.value),1);
  rows.forEach((row,index)=>{
    const y=175+index*105;
    ctx.fillStyle="#163300";ctx.font="700 25px Arial";ctx.fillText(row.label,65,y);
    const valueText=row.display||String(row.value)+(row.suffix||"");
    ctx.textAlign="right";ctx.fillText(valueText,1135,y);ctx.textAlign="left";
    ctx.fillStyle="#e5f8d7";rounded2(ctx,65,y+22,1070,26,13);ctx.fill();
    ctx.fillStyle="#163300";rounded2(ctx,65,y+22,1070*(row.value/max),26,13);ctx.fill();
  });
  ctx.fillStyle="#38463b";ctx.font="20px Arial";ctx.fillText("Source details are available on the web page.",65,canvas.height-35);
  const a=document.createElement("a");a.href=canvas.toDataURL("image/png");a.download=key+"-disability-chart.png";a.click();
}

async function shareFeature(key){
  const rows=featureRows(key);
  const url=location.origin+location.pathname+"#"+({prevalence:"prevalence-card",bsl:"bsl-card",trend:"trendFeature",country:"countryFeature"}[key]||"top");
  const text=featureTitle(key)+": "+rows.slice(0,4).map(r=>r.label+" "+(r.display||r.value+(r.suffix||""))).join(" · ");
  try{
    if(navigator.share) await navigator.share({title:featureTitle(key),text,url});
    else if(navigator.clipboard) await navigator.clipboard.writeText(text+"\n"+url);
  }catch(error){ if(error?.name!=="AbortError") console.error(error); }
}

function rounded2(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}
function downloadBlob2(content,name,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);}
function csvCell2(v){const s=String(v??"");return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}
function escapeSvg(v){return String(v??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
function escapeHtml2(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
