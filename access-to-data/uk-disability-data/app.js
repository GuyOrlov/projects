const DATA_URL = "data/dashboard.json?v=20261003-plain-english-v2";
const SOURCES_URL = "data/sources.json?v=20261003-plain-english-v2";
const ISSUES_URL = "data/issues.json?v=20261003-plain-english-v2";
let dashboardData = null;
let sourceRegistry = [];
let issueEvidence = null;
const charts = new Map();

document.addEventListener("DOMContentLoaded", init);

async function init(){
  bindNavigation();
  bindAccessibilityPanel();
  bindViewSwitches();
  bindDisplayControls();
  bindBslShare();
  try{
    const responses = await Promise.all([fetch(DATA_URL), fetch(SOURCES_URL), fetch(ISSUES_URL)]);
    if(!responses[0].ok || !responses[1].ok || !responses[2].ok) throw new Error("Data files could not be loaded");
    dashboardData = await responses[0].json();
    sourceRegistry = await responses[1].json();
    issueEvidence = await responses[2].json();
    renderDashboard();
    bindFilters();
    window.addEventListener("resize", debounce(resizeCharts, 120));
  }catch(error){
    console.error(error);
    const main = document.getElementById("metricGrid");
    if(main) main.innerHTML = '<p class="load-error">We could not load the data. You can still use the downloadable CSV.</p>';
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
  const year = document.getElementById("yearFilter");
  if(!geography || !year) return;

  function applyAreaFilter(){
    renderPrevalence(geography.value, year.value);
  }

  geography.addEventListener("change", applyAreaFilter);
  geography.addEventListener("input", applyAreaFilter);

  year.addEventListener("change", function(){
    populateGeographyOptions(year.value, "all");
    geography.value = "all";
    renderPrevalence("all", year.value);
  });
}

function renderDashboard(){
  renderHero();
  renderMetrics();
  populateYearOptions();
  const yearFilter = document.getElementById("yearFilter");
  const initialYear = yearFilter && yearFilter.value ? yearFilter.value : "2024–25";
  populateGeographyOptions(initialYear, "all");
  renderPrevalence("all", initialYear);
  renderBsl();
  renderEvidenceHighlights();
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
      ? '<details class="metric-help"><summary>What are percentage points?</summary><p>Percentage points are used to compare two percentages. For example, 82.5% minus 52.8% is a gap of 29.7 percentage points.</p></details>'
      : "";
    return '<article class="metric-card"' + anchor + '>' +
      '<div class="metric-label">' + escapeHtml(item.label) + '</div>' +
      '<strong class="metric-value">' + escapeHtml(item.display) + '</strong>' +
      '<p class="metric-description">' + escapeHtml(item.description) + '</p>' +
      help +
      '<small class="metric-source">' + escapeHtml((item.id === "pip-caseload" ? "As at " : "") + item.period + " · " + item.geography) + '</small>' +
      '</article>';
  }).join("");
}

function populateYearOptions(){
  const select = document.getElementById("yearFilter");
  if(!select || !dashboardData) return;
  const periods = Array.from(new Set(dashboardData.prevalenceByArea.map(function(row){ return row.period; })));
  select.innerHTML = periods.map(function(period,index){
    const uk = dashboardData.prevalenceByArea.find(function(row){ return row.period === period && row.geography === "UK"; });
    const detail = uk ? " · UK " + uk.value + "%" : "";
    return '<option value="' + escapeAttribute(period) + '">' + escapeHtml(period + (index === 0 ? " (latest)" : "") + detail) + '</option>';
  }).join("");
}

function populateGeographyOptions(period, selected){
  const select = document.getElementById("geographyFilter");
  if(!select || !dashboardData) return;
  const rows = dashboardData.prevalenceByArea.filter(function(row){ return row.period === period; });
  const options = ['<option value="all">All available areas · ' + rows.length + '</option>'].concat(
    rows.map(function(row){
      return '<option value="' + escapeAttribute(row.geography) + '">' + escapeHtml(row.label + " · " + row.value + "%") + '</option>';
    })
  );
  select.innerHTML = options.join("");
  select.value = selected && Array.from(select.options).some(function(option){ return option.value === selected; }) ? selected : "all";
}

function renderPrevalence(filter, period){
  let rows = dashboardData.prevalenceByArea.slice();
  if(period) rows = rows.filter(function(row){ return row.period === period; });
  if(filter && filter !== "all") rows = rows.filter(function(row){ return row.geography === filter; });

  const filterResult = document.getElementById("filterResult");
  if(filterResult){
    if(rows.length === 1){
      filterResult.innerHTML =
        '<span class="filter-result-label">Selected area</span>' +
        '<strong>' + escapeHtml(rows[0].label) + ' · ' + rows[0].value + '%</strong>' +
        '<span>' + escapeHtml(rows[0].period) + ' · disabled population estimate</span>' +
        '<a href="#prevalence-card">See chart ↓</a>';
    }else if(rows.length > 1){
      filterResult.innerHTML =
        '<span class="filter-result-label">Current view</span>' +
        '<strong>' + rows.length + ' available areas</strong>' +
        '<span>' + escapeHtml(period || "") + '</span>' +
        '<a href="#prevalence-card">See chart ↓</a>';
    }else{
      filterResult.innerHTML =
        '<span class="filter-result-label">Current view</span>' +
        '<strong>No verified figure available</strong>' +
        '<span>Try another area or year.</span>';
    }
  }

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
      summary.textContent = "For " + period + ", among the areas available in this dashboard, " + sorted[0].label + " has the highest estimated share at " + sorted[0].value + "%, while " + sorted[sorted.length-1].label + " has the lowest at " + sorted[sorted.length-1].value + "%.";
    }else if(rows.length === 1){
      summary.textContent = "In " + rows[0].label + ", an estimated " + rows[0].value + "% of people were classed as disabled in " + rows[0].period + ".";
    }else{
      summary.textContent = "No verified figure is available in this dashboard for that area and year.";
    }
  }

  const source = rows.length ? sourceById(rows[0].source) : null;
  const link = document.getElementById("prevalenceSourceLink");
  if(link && source){
    link.href = source.url;
    link.textContent = source.shortName + " " + (period || "") + " ↗";
  }

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

  renderBslBars(rows);

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
}

function renderEvidenceHighlights(){
  const grid = document.getElementById("evidenceHighlightGrid");
  if(!grid || !issueEvidence) return;
  const ids = issueEvidence.highlights || [];
  const items = ids.map(function(id){
    return issueEvidence.items.find(function(item){ return item.id === id; });
  }).filter(Boolean);
  grid.innerHTML = items.map(function(item){
    const source = item.source ? sourceById(item.source) : null;
    const freshness = item.freshness ? '<span class="freshness-badge">' + escapeHtml(item.freshness) + '</span>' : '';
    return '<article class="evidence-highlight-card">' +
      '<div class="evidence-highlight-top"><span class="evidence-badge">' + escapeHtml(displayEvidenceType(item.evidenceType)) + '</span>' + freshness + '</div>' +
      '<h3>' + escapeHtml(item.title) + '</h3>' +
      '<strong class="evidence-highlight-value">' + escapeHtml(item.value) + '</strong>' +
      '<p class="evidence-highlight-comparison">' + escapeHtml(item.comparison) + '</p>' +
      '<p>' + escapeHtml(item.detail) + '</p>' +
      '<small>' + escapeHtml(item.geography + " · " + item.period) + '</small>' +
      (source ? '<a href="' + escapeAttribute(source.url) + '" target="_blank" rel="noopener">View source ↗</a>' : '') +
      '</article>';
  }).join("");
}

function renderSources(){
  const grid = document.getElementById("sourceGrid");
  if(!grid) return;
  grid.innerHTML = sourceRegistry.map(function(source){
    return '<article class="source-card">' +
      '<span class="source-org">' + escapeHtml(source.organisation) + '</span>' +
      '<h3>' + escapeHtml(source.name) + '</h3>' +
      '<div class="evidence-badge">' + escapeHtml(displayEvidenceType(source.evidenceType || "Published evidence")) + '</div>' +
      '<p>' + escapeHtml(source.covers) + '</p>' +
      '<div class="source-meta"><span>Updated: ' + escapeHtml(source.updateFrequency) + '</span></div>' +
      '<a href="' + escapeAttribute(source.url) + '" target="_blank" rel="noopener">View source ↗</a>' +
      '</article>';
  }).join("");
}

function renderCharts(){
  if(!dashboardData || typeof echarts === "undefined") return;
  renderPrevalence(
    document.getElementById("geographyFilter") ? document.getElementById("geographyFilter").value : "all",
    document.getElementById("yearFilter") ? document.getElementById("yearFilter").value : "2024–25"
  );
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

function renderBslBars(rows){
  const list = document.getElementById("bslBarList");
  if(!list) return;
  const maxValue = 160;
  list.innerHTML = rows.map(function(row,index){
    const width = Math.max(4,Math.min(100,(row.value/maxValue)*100));
    const fullValue = row.value === 151 ? "151,000" : row.value === 87 ? "87,000" : row.value === 22 ? "22,000" : row.display;
    const source = sourceById(row.source);
    return '<div class="bsl-bar-row" tabindex="0" aria-describedby="bsl-tip-' + index + '">' +
      '<div class="bsl-bar-label-row">' +
        '<div class="bsl-bar-label">' + escapeHtml(row.tooltipLabel || row.label) + '</div>' +
        '<strong class="bsl-bar-value">' + escapeHtml(row.display) + '</strong>' +
      '</div>' +
      '<div class="bsl-bar-meta">' + escapeHtml(row.geography + " · " + row.period) + '</div>' +
      '<div class="bsl-bar-track" aria-hidden="true"><div class="bsl-bar-fill" style="width:' + width.toFixed(1) + '%"></div></div>' +
      '<div class="bsl-html-tooltip" role="tooltip" id="bsl-tip-' + index + '">' +
        '<div class="bsl-tooltip-title">' + escapeHtml(row.tooltipLabel || row.label) + '</div>' +
        '<div class="bsl-tooltip-value">' + escapeHtml(fullValue) + '</div>' +
        '<div class="bsl-tooltip-meta"><strong>Area:</strong> ' + escapeHtml(row.geography) + '</div>' +
        '<div class="bsl-tooltip-meta"><strong>Type:</strong> ' + escapeHtml(row.type || "") + '</div>' +
        '<div class="bsl-tooltip-definition">' + escapeHtml(row.definition) + '</div>' +
        '<div class="bsl-tooltip-source">Source: ' + escapeHtml(source ? source.shortName : row.source) + '</div>' +
      '</div>' +
    '</div>';
  }).join("");
}

function bindBslShare(){
  const button = document.getElementById("shareBslChart");
  const status = document.getElementById("shareBslStatus");
  if(!button) return;
  button.addEventListener("click", async function(){
    const url = location.origin + location.pathname + "#bsl-card";
    const title = "How many people use BSL in the UK?";
    const text = "About 151,000 estimated BSL users · about 87,000 estimated Deaf BSL users · about 22,000 people reported BSL as their main language in England and Wales in Census 2021. These figures count different groups.";
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


function displayEvidenceType(value){
  const labels = {
    "Administrative statistics":"Public-service records",
    "Administrative data API":"Public-service data API",
    "Official statistical analysis":"Official statistics",
    "Accredited official statistics / survey":"Official survey statistics",
    "Accredited official statistics":"Official statistics",
    "Official statistics / police-recorded crime":"Police-recorded statistics",
    "Official statistics / survey":"Official survey statistics",
    "Survey analysis · older evidence":"Survey analysis · older data",
    "Government report / published estimate":"Government report / estimate"
  };
  return labels[value] || value;
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