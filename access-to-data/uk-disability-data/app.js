const DATA_URL = "data/dashboard.json";
const SOURCES_URL = "data/sources.json";
let dashboardData = null;
let sourceRegistry = [];
const charts = new Map();

document.addEventListener("DOMContentLoaded", init);

async function init(){
  bindNavigation();
  bindViewSwitches();
  bindDisplayControls();
  try{
    const responses = await Promise.all([fetch(DATA_URL), fetch(SOURCES_URL)]);
    if(!responses[0].ok || !responses[1].ok) throw new Error("Data files could not be loaded");
    dashboardData = await responses[0].json();
    sourceRegistry = await responses[1].json();
    renderDashboard();
    bindFilters();
    window.addEventListener("resize", debounce(resizeCharts, 120));
  }catch(error){
    console.error(error);
    const main = document.getElementById("metricGrid");
    if(main) main.innerHTML = '<p class="load-error">The dashboard data could not be loaded. Please use the downloadable CSV while this is fixed.</p>';
  }
}

function bindNavigation(){
  const button = document.getElementById("menuButton");
  const nav = document.getElementById("primaryNav");
  if(!button || !nav) return;
  button.addEventListener("click", function(){
    const open = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", function(event){
    if(event.target.closest("a") && window.innerWidth <= 720){
      nav.classList.remove("open");
      button.setAttribute("aria-expanded","false");
    }
  });
}

function bindViewSwitches(){
  document.querySelectorAll(".view-button").forEach(function(button){
    button.addEventListener("click", function(){
      const target = button.dataset.target;
      const view = button.dataset.view;
      document.querySelectorAll('.view-button[data-target="' + target + '"]').forEach(function(item){
        item.classList.toggle("active", item === button);
      });
      const chartPanel = document.getElementById(target + "-chart-panel");
      const tablePanel = document.getElementById(target + "-table-panel");
      if(chartPanel) chartPanel.hidden = view !== "chart";
      if(tablePanel) tablePanel.hidden = view !== "table";
      if(view === "chart" && charts.has(target)) requestAnimationFrame(function(){ charts.get(target).resize(); });
    });
  });
}

function bindDisplayControls(){
  const textButton = document.getElementById("textSizeButton");
  const contrastButton = document.getElementById("contrastButton");
  if(textButton){
    textButton.addEventListener("click", function(){
      const on = document.body.classList.toggle("large-text");
      textButton.setAttribute("aria-pressed",String(on));
    });
  }
  if(contrastButton){
    contrastButton.addEventListener("click", function(){
      const on = document.body.classList.toggle("high-contrast");
      contrastButton.setAttribute("aria-pressed",String(on));
      renderCharts();
    });
  }
}

function bindFilters(){
  const geography = document.getElementById("geographyFilter");
  if(!geography) return;
  geography.addEventListener("change", function(){
    renderPrevalence(geography.value);
  });
}

function renderDashboard(){
  renderHero();
  renderMetrics();
  renderPrevalence("all");
  renderBsl();
  renderSources();
  const checked = dashboardData.meta && dashboardData.meta.lastChecked ? dashboardData.meta.lastChecked : "";
  const status = document.getElementById("sourceStatusText");
  if(status) status.textContent = checked ? "Sources checked " + formatDate(checked) : "Sources checked";
}

function renderHero(){
  const item = dashboardData.headline.find(function(x){ return x.id === "disabled-share"; });
  if(!item) return;
  setText("heroStatValue",item.display);
  setText("heroStatDescription",item.description);
  setText("heroStatSource",sourceName(item.source) + " " + item.period);
}

function renderMetrics(){
  const grid = document.getElementById("metricGrid");
  if(!grid) return;
  grid.innerHTML = dashboardData.headline.map(function(item){
    const anchor = item.id === "employment-gap" ? ' id="employment-kpi"' : item.id === "pip-caseload" ? ' id="pip-kpi"' : "";
    return '<article class="metric-card"' + anchor + '>' +
      '<div class="metric-label">' + escapeHtml(item.label) + '</div>' +
      '<strong class="metric-value">' + escapeHtml(item.display) + '</strong>' +
      '<p class="metric-description">' + escapeHtml(item.description) + '</p>' +
      '<small class="metric-source">' + escapeHtml(item.period + " · " + item.geography) + '</small>' +
      '</article>';
  }).join("");
}

function renderPrevalence(filter){
  let rows = dashboardData.prevalenceByArea.slice();
  if(filter && filter !== "all") rows = rows.filter(function(row){ return row.geography === filter; });
  const body = document.getElementById("prevalenceTableBody");
  if(body){
    body.innerHTML = rows.map(function(row){
      return '<tr><th scope="row">' + escapeHtml(row.label) + '</th><td>' + row.value + '%</td><td>' + escapeHtml(row.period) + '</td></tr>';
    }).join("");
  }
  const source = sourceById("frs");
  const link = document.getElementById("prevalenceSourceLink");
  if(link && source) link.href = source.url;
  drawHorizontalBar("prevalence","prevalenceChart",rows.map(function(r){return r.label;}),rows.map(function(r){return r.value;}),"%",30);
}

function renderBsl(){
  const rows = dashboardData.bslMeasures;
  const body = document.getElementById("bslTableBody");
  if(body){
    body.innerHTML = rows.map(function(row){
      return '<tr><th scope="row">' + escapeHtml(row.label) + '</th><td>' + escapeHtml(row.display) + '</td><td>' + escapeHtml(row.geography + " · " + row.period) + '</td></tr>';
    }).join("");
  }
  const gov = sourceById("bsl-government");
  const ons = sourceById("ons-language");
  const govLink = document.getElementById("bslGovSourceLink");
  const onsLink = document.getElementById("bslOnsSourceLink");
  if(govLink && gov) govLink.href = gov.url;
  if(onsLink && ons) onsLink.href = ons.url;
  drawHorizontalBar("bsl","bslChart",rows.map(function(r){return r.shortLabel;}),rows.map(function(r){return r.value;}),"k",160);
}

function renderSources(){
  const grid = document.getElementById("sourceGrid");
  if(!grid) return;
  grid.innerHTML = sourceRegistry.map(function(source){
    return '<article class="source-card">' +
      '<span class="source-org">' + escapeHtml(source.organisation) + '</span>' +
      '<h3>' + escapeHtml(source.name) + '</h3>' +
      '<p>' + escapeHtml(source.covers) + '</p>' +
      '<div class="source-meta"><span>' + escapeHtml(source.updateFrequency) + '</span><span>' + escapeHtml(source.automation) + '</span></div>' +
      '<a href="' + escapeAttribute(source.url) + '" target="_blank" rel="noopener">Open official source ↗</a>' +
      '</article>';
  }).join("");
}

function renderCharts(){
  if(!dashboardData || typeof echarts === "undefined") return;
  renderPrevalence(document.getElementById("geographyFilter") ? document.getElementById("geographyFilter").value : "all");
  renderBsl();
}

function drawHorizontalBar(key,elementId,labels,values,suffix,maxValue){
  if(typeof echarts === "undefined") return;
  const element = document.getElementById(elementId);
  if(!element) return;
  let chart = charts.get(key);
  if(!chart){
    chart = echarts.init(element,null,{renderer:"canvas"});
    charts.set(key,chart);
  }
  const highContrast = document.body.classList.contains("high-contrast");
  const ink = highContrast ? "#000000" : "#163300";
  const muted = highContrast ? "#111111" : "#4b5b4d";
  const background = highContrast ? "#fff9a8" : "#e5f8d7";
  const compact = window.innerWidth <= 720;
  chart.setOption({
    animation: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    aria:{enabled:true,decal:{show:false}},
    tooltip:{trigger:"axis",axisPointer:{type:"shadow"},valueFormatter:function(value){return value + suffix;}},
    grid:{left:compact?92:138,right:compact?38:48,top:18,bottom:16},
    xAxis:{
      type:"value",
      max:maxValue,
      axisLabel:{show:false},
      axisLine:{show:false},
      splitLine:{show:false},
      axisTick:{show:false}
    },
    yAxis:{
      type:"category",
      inverse:true,
      data:labels,
      axisLine:{show:false},
      axisTick:{show:false},
      axisLabel:{
        color:ink,
        fontWeight:700,
        fontSize:compact?11:12,
        width:compact?78:125,
        overflow:"truncate"
      }
    },
    series:[{
      type:"bar",
      data:values,
      barWidth:compact?12:14,
      showBackground:true,
      backgroundStyle:{color:background,borderRadius:8},
      itemStyle:{color:ink,borderRadius:8},
      label:{
        show:true,
        position:"right",
        formatter:function(params){return params.value + suffix;},
        color:muted,
        fontWeight:700,
        fontSize:compact?11:12
      }
    }]
  },true);
}

function resizeCharts(){
  charts.forEach(function(chart){ chart.resize(); });
}

function sourceById(id){
  return sourceRegistry.find(function(source){return source.id === id;}) || null;
}

function sourceName(id){
  const source = sourceById(id);
  return source ? source.shortName : id;
}

function setText(id,value){
  const element = document.getElementById(id);
  if(element) element.textContent = value;
}

function formatDate(value){
  const parts = value.split("-");
  if(parts.length !== 3) return value;
  return Number(parts[2]) + " " + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][Number(parts[1])-1] + " " + parts[0];
}

function debounce(fn,wait){
  let timeout;
  return function(){
    clearTimeout(timeout);
    timeout = setTimeout(fn,wait);
  };
}

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g,function(char){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char];
  });
}

function escapeAttribute(value){
  return escapeHtml(value);
}