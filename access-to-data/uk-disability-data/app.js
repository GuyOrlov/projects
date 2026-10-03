const DATA_URL = "data/dashboard.json";
const SOURCES_URL = "data/sources.json";
let dashboardData = null;
let sourceRegistry = [];
const charts = new Map();

document.addEventListener("DOMContentLoaded", init);

async function init(){
  bindNavigation();
  bindAccessibilityPanel();
  bindViewSwitches();
  bindDisplayControls();
  bindBslShare();
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

function bindAccessibilityPanel(){
  const button = document.getElementById("accessibilityButton");
  const panel = document.getElementById("accessibilityPanel");
  if(!button || !panel) return;
  button.addEventListener("click", function(){
    const willOpen = panel.hidden;
    panel.hidden = !willOpen;
    button.setAttribute("aria-expanded", String(willOpen));
  });
  document.addEventListener("click", function(event){
    if(panel.hidden) return;
    if(!panel.contains(event.target) && event.target !== button){
      panel.hidden = true;
      button.setAttribute("aria-expanded","false");
    }
  });
  document.addEventListener("keydown", function(event){
    if(event.key === "Escape" && !panel.hidden){
      panel.hidden = true;
      button.setAttribute("aria-expanded","false");
      button.focus();
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
    const help = item.id === "employment-gap"
      ? '<details class="metric-help"><summary>What does “percentage points” mean?</summary><p>Percentage points show the direct difference between two percentages. For example, 82.5% minus 52.8% equals a 29.7 percentage-point gap.</p></details>'
      : "";
    return '<article class="metric-card"' + anchor + '>' +
      '<div class="metric-label">' + escapeHtml(item.label) + '</div>' +
      '<strong class="metric-value">' + escapeHtml(item.display) + '</strong>' +
      '<p class="metric-description">' + escapeHtml(item.description) + '</p>' +
      help +
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
  renderMobileBars("prevalenceMobileBars", rows.map(function(r){return {label:r.label,value:r.value,display:r.value+"%"};}), 30);
  const summary = document.getElementById("prevalenceSummary");
  if(summary){
    if(rows.length > 1){
      const sorted = rows.slice().sort(function(a,b){return b.value-a.value;});
      summary.textContent = sorted[0].label + " has the highest selected estimate at " + sorted[0].value + "%, while " + sorted[sorted.length-1].label + " has the lowest at " + sorted[sorted.length-1].value + "%.";
    }else if(rows.length === 1){
      summary.textContent = rows[0].label + " has an estimated disability prevalence of " + rows[0].value + "% for " + rows[0].period + ".";
    }
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
      return '<tr><th scope="row">' + escapeHtml(row.tooltipLabel || row.label) + '</th><td>' + escapeHtml(row.display) + '</td><td>' + escapeHtml(row.geography + " · " + row.period) + '</td><td>' + escapeHtml(row.type || "") + '</td></tr>';
    }).join("");
  }

  renderMobileBars("bslMobileBars", rows.map(function(r){
    return {label:r.tooltipLabel || r.label,value:r.value,display:r.display,subline:r.geography + (r.period ? " · " + r.period : "")};
  }), 160);

  const definitionList = document.getElementById("bslDefinitionList");
  if(definitionList){
    definitionList.innerHTML = rows.map(function(row){
      return '<div class="bsl-definition-item">' +
        '<strong><span>' + escapeHtml(row.display) + '</span> ' + escapeHtml(row.tooltipLabel || row.label) + '</strong>' +
        '<p>' + escapeHtml(row.definition) + '</p>' +
        '<small>' + escapeHtml(row.geography + " · " + row.period + " · " + (row.type || "")) + '</small>' +
        '</div>';
    }).join("");
  }

  const checkedDate = document.getElementById("bslCheckedDate");
  if(checkedDate && dashboardData.meta && dashboardData.meta.lastChecked){
    checkedDate.textContent = "Last checked " + formatDate(dashboardData.meta.lastChecked);
  }

  const gov = sourceById("bsl-government");
  const ons = sourceById("ons-language");
  const govLink = document.getElementById("bslGovSourceLink");
  const onsLink = document.getElementById("bslOnsSourceLink");
  if(govLink && gov) govLink.href = gov.url;
  if(onsLink && ons) onsLink.href = ons.url;
  drawBslChart(rows);
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
      barWidth:compact?18:22,
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

function renderMobileBars(elementId,rows,maxValue){
  const element = document.getElementById(elementId);
  if(!element) return;
  element.innerHTML = rows.map(function(row){
    const width = Math.max(3, Math.min(100, (row.value / maxValue) * 100));
    return '<div class="mobile-bar-item">' +
      '<div class="mobile-bar-head"><span>' + escapeHtml(row.label) + '</span><strong>' + escapeHtml(row.display) + '</strong></div>' +
      (row.subline ? '<small class="mobile-bar-subline">' + escapeHtml(row.subline) + '</small>' : '') +
      '<div class="mobile-bar-track" aria-hidden="true"><div class="mobile-bar-fill" style="width:' + width.toFixed(1) + '%"></div></div>' +
      '</div>';
  }).join("");
}

function drawBslChart(rows){
  if(typeof echarts === "undefined") return;
  const element = document.getElementById("bslChart");
  if(!element) return;
  let chart = charts.get("bsl");
  if(!chart){
    chart = echarts.init(element,null,{renderer:"canvas"});
    charts.set("bsl",chart);
  }
  const highContrast = document.body.classList.contains("high-contrast");
  const ink = highContrast ? "#000000" : "#163300";
  const muted = highContrast ? "#111111" : "#38463b";
  const track = highContrast ? "#fff9a8" : "#e5f8d7";

  chart.setOption({
    animation: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    aria:{enabled:true,decal:{show:false}},
    tooltip:{
      trigger:"item",
      confine:true,
      backgroundColor:"#ffffff",
      borderColor:highContrast ? "#000000" : "#9fe870",
      borderWidth:2,
      padding:0,
      extraCssText:"border-radius:14px;box-shadow:0 12px 30px rgba(0,0,0,.18);max-width:310px;",
      textStyle:{color:ink,fontFamily:"Atkinson Hyperlegible, Arial, sans-serif"},
      formatter:function(params){
        const row = rows[params.dataIndex];
        const source = sourceById(row.source);
        return '<div class="bsl-tooltip">' +
          '<div class="bsl-tooltip-title">' + escapeHtml(row.tooltipLabel || row.label) + '</div>' +
          '<div class="bsl-tooltip-value">' + escapeHtml(row.value === 22 ? "22,000" : row.value === 87 ? "87,000" : row.value === 151 ? "151,000" : row.display) + '</div>' +
          '<div class="bsl-tooltip-meta"><strong>Area:</strong> ' + escapeHtml(row.geography) + '</div>' +
          '<div class="bsl-tooltip-meta"><strong>Type:</strong> ' + escapeHtml(row.type || "") + '</div>' +
          '<div class="bsl-tooltip-definition">' + escapeHtml(row.definition) + '</div>' +
          '<div class="bsl-tooltip-source">Source: ' + escapeHtml(source ? source.shortName : row.source) + '</div>' +
          '</div>';
      }
    },
    grid:{left:230,right:54,top:24,bottom:18,containLabel:false},
    xAxis:{
      type:"value",
      max:160,
      axisLabel:{show:false},
      axisLine:{show:false},
      splitLine:{show:false},
      axisTick:{show:false}
    },
    yAxis:{
      type:"category",
      inverse:true,
      data:rows.map(function(row){return row.tooltipLabel || row.label;}),
      axisLine:{show:false},
      axisTick:{show:false},
      axisLabel:{
        color:ink,
        fontWeight:700,
        fontSize:13,
        lineHeight:17,
        width:205,
        overflow:"break",
        align:"left",
        margin:18
      }
    },
    series:[{
      type:"bar",
      data:rows.map(function(row){return row.value;}),
      barWidth:22,
      showBackground:true,
      backgroundStyle:{color:track,borderRadius:10},
      itemStyle:{color:ink,borderRadius:10},
      label:{
        show:true,
        position:"right",
        formatter:function(params){return rows[params.dataIndex].display;},
        color:muted,
        fontWeight:700,
        fontSize:13
      }
    }]
  },true);
}

function bindBslShare(){
  const button = document.getElementById("shareBslChart");
  const status = document.getElementById("shareBslStatus");
  if(!button) return;
  button.addEventListener("click", async function(){
    const url = location.origin + location.pathname + "#bsl-card";
    const title = "How many people use BSL in the UK?";
    const text = "151k estimated BSL users · 87k estimated Deaf BSL users · 22k reported BSL as their main language in England and Wales Census 2021. These figures measure different groups.";
    try{
      if(navigator.share){
        await navigator.share({title:title,text:text,url:url});
        if(status) status.textContent = "Shared.";
      }else if(navigator.clipboard){
        await navigator.clipboard.writeText(title + "\n" + text + "\n" + url);
        if(status) status.textContent = "Chart summary copied.";
      }else{
        if(status) status.textContent = "Copy this page link to share.";
      }
    }catch(error){
      if(error && error.name === "AbortError") return;
      if(status) status.textContent = "Sharing was not available.";
    }
  });
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