const ISSUE_DATA_URL = "data/issues.json?v=20261003-plain-english-v2";
const SOURCE_DATA_URL = "data/sources.json?v=20261003-plain-english-v2";

document.addEventListener("DOMContentLoaded", initIssues);

async function initIssues(){
  try{
    const responses = await Promise.all([fetch(ISSUE_DATA_URL), fetch(SOURCE_DATA_URL)]);
    if(!responses[0].ok || !responses[1].ok) throw new Error("Issue evidence could not be loaded");
    const data = await responses[0].json();
    const sources = await responses[1].json();
    renderIssueEvidence(data.items || [],sources || []);
  }catch(error){
    console.error(error);
    document.querySelectorAll(".issue-evidence-list").forEach(function(el){
      el.innerHTML='<p class="load-error">We could not load these figures. You can still find the sources on the main page.</p>';
    });
  }
}

function renderIssueEvidence(items,sources){
  const grouped={};
  items.forEach(function(item){
    if(!grouped[item.issue]) grouped[item.issue]=[];
    grouped[item.issue].push(item);
  });

  Object.keys(grouped).forEach(function(issue){
    const target=document.getElementById(issue+"Evidence");
    if(!target) return;
    target.innerHTML=grouped[issue].map(function(item){
      const source=item.source?sources.find(function(s){return s.id===item.source;}):null;
      return '<article class="issue-evidence-card">' +
        '<div class="evidence-highlight-top"><span class="evidence-badge">' + esc(displayEvidenceType(item.evidenceType)) + '</span>' +
        (item.freshness?'<span class="freshness-badge">'+esc(item.freshness)+'</span>':'') + '</div>' +
        '<h3>' + esc(item.title) + '</h3>' +
        '<div class="issue-stat-line"><strong>' + esc(item.value) + '</strong><span>' + esc(item.comparison) + '</span></div>' +
        '<p>' + esc(item.detail) + '</p>' +
        '<small>' + esc(item.geography + " · " + item.period) + '</small>' +
        (item.caveat?'<details class="evidence-caveat"><summary>What this does not tell us</summary><p>'+esc(item.caveat)+'</p></details>':'') +
        (source?'<a class="evidence-source-link" href="'+attr(source.url)+'" target="_blank" rel="noopener">View source ↗</a>':'') +
      '</article>';
    }).join("");
  });
}


function displayEvidenceType(value){
  const labels={
    "Administrative statistics":"Public-service records",
    "Official statistical analysis":"Official statistics",
    "Accredited official statistics / survey":"Official survey statistics",
    "Accredited official statistics":"Official statistics",
    "Official statistics / police-recorded crime":"Police-recorded statistics",
    "Official statistics / survey":"Official survey statistics",
    "Survey analysis · older evidence":"Survey analysis · older data",
    "Scope note":"About this section"
  };
  return labels[value] || value;
}

function esc(value){
  return String(value==null?"":value).replace(/[&<>"']/g,function(char){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char];
  });
}
function attr(value){ return esc(value); }
