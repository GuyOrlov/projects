const TYPES_URL="data/types.json?v=20261003-features-v1";
let typesData=null;
let activeTypeGroup="children";

document.addEventListener("DOMContentLoaded",initTypes);

async function initTypes(){
  try{
    const response=await fetch(TYPES_URL);
    if(!response.ok) throw new Error("Types data could not be loaded");
    typesData=await response.json();
    renderSwitch();
    renderDefinitions();
    bindTypeTools();
    const requested=new URLSearchParams(location.search).get("group");
    if(requested && typesData.groups.some(g=>g.id===requested)) activeTypeGroup=requested;
    renderTypeGroup(activeTypeGroup);
  }catch(error){
    console.error(error);
    const target=document.getElementById("typeExplorerBars");
    if(target) target.innerHTML='<p class="load-error">We could not load the disability-type data. Please use the official source link below.</p>';
  }
}

function renderSwitch(){
  const target=document.getElementById("typeGroupSwitch");
  if(!target) return;
  target.innerHTML=typesData.groups.map(group=>
    '<button type="button" data-group="'+escAttr(group.id)+'">'+esc(group.shortLabel)+'</button>'
  ).join("");
  target.addEventListener("click",event=>{
    const button=event.target.closest("button[data-group]");
    if(!button) return;
    activeTypeGroup=button.dataset.group;
    renderTypeGroup(activeTypeGroup);
  });
}

function renderTypeGroup(id){
  const group=typesData.groups.find(g=>g.id===id) || typesData.groups[0];
  activeTypeGroup=group.id;
  document.querySelectorAll("#typeGroupSwitch button").forEach(button=>{
    const active=button.dataset.group===group.id;
    button.classList.toggle("active",active);
    button.setAttribute("aria-pressed",String(active));
  });
  setText("typeGroupTitle",group.label);
  const rows=group.rows.slice().sort((a,b)=>b.value-a.value);
  const max=Math.max(...rows.map(r=>r.value),1);
  const target=document.getElementById("typeExplorerBars");
  if(target){
    target.innerHTML=rows.map((row,index)=>{
      const definition=typesData.definitions.find(d=>d.id===row.definitionId);
      return '<div class="type-explorer-row">' +
        '<div class="type-explorer-label"><span>'+esc(row.label)+'</span><strong>'+row.value+'%</strong></div>' +
        '<div class="type-explorer-track" aria-hidden="true"><div class="type-explorer-fill" style="width:'+((row.value/max)*100).toFixed(1)+'%"></div></div>' +
        '<div class="type-explorer-meta">'+(index===0?'<span class="highest-badge">Highest</span>':'')+
        (definition?'<button type="button" class="definition-jump" data-definition="'+escAttr(row.definitionId)+'">What does this mean?</button>':'')+
        '</div></div>';
    }).join("");
    target.querySelectorAll(".definition-jump").forEach(button=>{
      button.addEventListener("click",()=>{
        const el=document.getElementById("definition-"+button.dataset.definition);
        if(el){ el.open=true; el.scrollIntoView({behavior:"smooth",block:"center"}); }
      });
    });
  }
  const highest=rows[0];
  const lowest=rows[rows.length-1];
  const insight=document.getElementById("typeInsight");
  if(insight) insight.innerHTML='<strong>Highest: '+esc(highest.label)+' · '+highest.value+'%</strong><span>Lowest of the three shown: '+esc(lowest.label)+' · '+lowest.value+'%.</span>';
  history.replaceState(null,"",location.pathname+"?group="+encodeURIComponent(group.id)+location.hash);
}

function renderDefinitions(){
  const grid=document.getElementById("typeDefinitionGrid");
  if(!grid) return;
  grid.innerHTML=typesData.definitions.map(item=>
    '<details class="type-definition-card" id="definition-'+escAttr(item.id)+'"><summary>'+esc(item.label)+'</summary><p>'+esc(item.text)+'</p></details>'
  ).join("");
}

function bindTypeTools(){
  document.getElementById("typeShareButton")?.addEventListener("click",shareTypes);
  document.getElementById("typeCsvButton")?.addEventListener("click",downloadTypesCsv);
  document.getElementById("typePngButton")?.addEventListener("click",downloadTypesPng);
}

function currentGroup(){ return typesData.groups.find(g=>g.id===activeTypeGroup) || typesData.groups[0]; }

async function shareTypes(){
  const group=currentGroup();
  const url=location.origin+location.pathname+"?group="+encodeURIComponent(group.id);
  const text=group.label+": "+group.rows.map(r=>r.label+" "+r.value+"%").join(" · ");
  try{
    if(navigator.share) await navigator.share({title:"UK disability types",text,url});
    else if(navigator.clipboard) await navigator.clipboard.writeText(text+"\n"+url);
  }catch(error){ if(error?.name!=="AbortError") console.error(error); }
}

function downloadTypesCsv(){
  const group=currentGroup();
  const rows=[["Age group","Impairment type","Percent","Period","Geography"]];
  group.rows.forEach(r=>rows.push([group.label,r.label,r.value,typesData.meta.period,typesData.meta.geography]));
  downloadText(rows.map(row=>row.map(csvCell).join(",")).join("\n"),"disability-types-"+group.id+".csv","text/csv;charset=utf-8");
}

function downloadTypesPng(){
  const group=currentGroup();
  const rows=group.rows.slice().sort((a,b)=>b.value-a.value);
  const canvas=document.createElement("canvas");
  canvas.width=1200;
  canvas.height=260+rows.length*120;
  const ctx=canvas.getContext("2d");
  ctx.fillStyle="#ffffff";ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#163300";ctx.font="700 46px Arial";ctx.fillText(group.label,70,70);
  ctx.font="28px Arial";ctx.fillText("UK · 2024–25 · DWP Family Resources Survey",70,115);
  const max=Math.max(...rows.map(r=>r.value),1);
  rows.forEach((row,index)=>{
    const y=190+index*120;
    ctx.font="700 28px Arial";ctx.fillStyle="#163300";ctx.fillText(row.label,70,y);
    ctx.textAlign="right";ctx.fillText(row.value+"%",1130,y);ctx.textAlign="left";
    ctx.fillStyle="#e5f8d7";roundRect(ctx,70,y+25,1060,30,15);ctx.fill();
    ctx.fillStyle="#163300";roundRect(ctx,70,y+25,1060*(row.value/max),30,15);ctx.fill();
  });
  ctx.font="22px Arial";ctx.fillStyle="#38463b";ctx.fillText("Percentages can overlap because people may report more than one impairment.",70,canvas.height-35);
  const link=document.createElement("a");link.href=canvas.toDataURL("image/png");link.download="disability-types-"+group.id+".png";link.click();
}

function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}
function downloadText(content,name,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);}
function csvCell(v){const s=String(v??"");return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}
function setText(id,value){const el=document.getElementById(id);if(el) el.textContent=value;}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function escAttr(v){return esc(v);}
