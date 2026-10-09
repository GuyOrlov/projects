(function(){
'use strict';
const $=id=>document.getElementById(id);
const cfgs={
paper:'<div class="field"><label for="paper">Paper size</label><select id="paper"><option value="a4">A4 (UK standard)</option><option value="a5">A5</option><option value="letter">US Letter</option><option value="photo">4 × 6 inch</option></select></div>',
orient:'<div class="field"><label for="orient">Orientation</label><select id="orient"><option value="auto">Auto-match photos</option><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></div>',
quality:'<div class="field"><label for="quality">Image quality</label><select id="quality"><option value="balanced">Balanced</option><option value="high">High quality</option><option value="small">Smaller file</option></select></div>',
save:'<label class="note" style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="remember"> Save finished PDF to recent documents on this device</label>',
name:'<div class="field"><label for="file-name">File name</label><input id="file-name" value="my-document" maxlength="80"></div>',
edit:'<div class="grid-2"><div class="field"><label for="rotation">Rotate photos</label><select id="rotation"><option value="0">None</option><option value="90">90° right</option><option value="180">180°</option><option value="270">90° left</option></select></div><div class="field"><label for="crop">Centre crop</label><select id="crop"><option value="100">Show full photo</option><option value="90">90% of photo</option><option value="75">75% of photo</option><option value="60">60% of photo</option></select></div><div class="field"><label for="bright">Brightness: <output id="bright-read">100%</output></label><input type="range" id="bright" min="50" max="165" value="100"></div><div class="field"><label for="contrast">Contrast: <output id="contrast-read">100%</output></label><input type="range" id="contrast" min="50" max="180" value="100"></div></div>',
language:'<div class="field"><label for="ocr-lang">OCR language</label><select id="ocr-lang"><option value="eng">English</option><option value="heb">Hebrew</option><option value="fra">French</option><option value="deu">German</option><option value="spa">Spanish</option></select></div>',
};
function fields(parts){return parts.map(s=>cfgs[s]||s).join('')}
const TOOL=[
{id:'photos',icon:'🖼️',title:'Photo to PDF',desc:'Turn one or more photographs into a PDF, with size, quality and page layout options.',accept:'image/*,.heic,.heif',button:'Download PDF',options:fields(['<div class="grid-2">','paper','orient','quality','<div class="field"><label for="placement">Image placement</label><select id="placement"><option value="contain">Fit whole image</option><option value="cover">Fill page (may crop)</option></select></div>','<div class="field"><label for="margin">White margin</label><select id="margin"><option value="8">Small (8 mm)</option><option value="15">Normal (15 mm)</option><option value="0">None</option></select></div>','</div>','name','save'])},
{id:'scan',icon:'📷',title:'Scan document',desc:'Use phone photos to make clean PDF scans of letters, receipts and paperwork.',accept:'image/*,.heic,.heif',button:'Download scanned PDF',options:fields(['edit','<div class="field"><label for="scan-tone">Scan appearance</label><select id="scan-tone"><option value="gray">Grayscale (clear document)</option><option value="contrast">Black and white (high contrast)</option><option value="color">Keep colour</option></select></div>','paper','name','save'])},
{id:'edit',icon:'✂️',title:'Crop and rotate',desc:'Rotate, straighten by 90°, centre-crop and adjust a photo; download the edited image.',accept:'image/*,.heic,.heif',button:'Download edited photos',options:fields(['edit','<div class="field"><label for="image-type">Image format</label><select id="image-type"><option value="image/jpeg">JPG</option><option value="image/png">PNG</option></select></div>'])},
{id:'enhance',icon:'✨',title:'Enhance photos',desc:'Adjust brightness and contrast or apply a document-cleanup preset.',accept:'image/*,.heic,.heif',button:'Download enhanced photos',options:fields(['edit','<div class="field"><label for="scan-tone">Enhancement preset</label><select id="scan-tone"><option value="color">Natural colour</option><option value="gray">Clear grayscale</option><option value="contrast">High-contrast scan</option></select></div>'])},
{id:'multi',icon:'▦',title:'Multiple photos per page',desc:'Arrange two, four or six pictures neatly on each PDF page.',accept:'image/*,.heic,.heif',button:'Download contact-sheet PDF',options:fields(['<div class="grid-2"><div class="field"><label for="layout-size">Photos per page</label><select id="layout-size"><option value="2">2 photos</option><option value="4">4 photos</option><option value="6">6 photos</option></select></div>','paper','orient','quality','</div>','name','save'])},
{id:'toimages',icon:'🗺️',title:'PDF to JPG / PNG',desc:'Export selected PDF pages as images. Multiple pages download as a ZIP archive.',accept:'.pdf,application/pdf',button:'Convert PDF to images',options:fields(['<div class="grid-2"><div class="field"><label for="image-type">Image format</label><select id="image-type"><option value="image/png">PNG (sharp text)</option><option value="image/jpeg">JPG (smaller files)</option></select></div><div class="field"><label for="scale">Resolution</label><select id="scale"><option value="1.5">Standard</option><option value="2">High</option><option value="2.8">Extra high</option></select></div></div><div class="field"><label for="pages">Pages (blank = all)</label><input id="pages" placeholder="Example: 1-3,5"></div>'])},
{id:'merge',icon:'📎',title:'Merge PDFs',desc:'Join PDFs in the order shown. Existing selectable text normally stays intact.',accept:'.pdf,application/pdf',button:'Merge selected PDFs',options:fields(['name','save'])},
{id:'split',icon:'✂️',title:'Split / extract PDF',desc:'Extract selected pages into one PDF, or into individual one-page PDFs.',accept:'.pdf,application/pdf',button:'Split PDF',options:fields(['<div class="field"><label for="pages">Page numbers</label><input id="pages" value="1" placeholder="1-3,5"></div><div class="field"><label for="split-mode">Export</label><select id="split-mode"><option value="combined">One PDF containing selected pages</option><option value="individual">Separate PDF per selected page (ZIP)</option></select></div>','name','save'])},
{id:'compress',icon:'🗜️',title:'Compress PDF',desc:'Make an image-based PDF with smaller JPEG images.',accept:'.pdf,application/pdf',button:'Compress PDF',options:fields(['<div class="notice warn">Rebuilds pages as images. Searchable text, links, form fields and signatures may be flattened. It can sometimes make PDFs larger, not smaller.</div>','quality','name','save'])},
{id:'numbers',icon:'🔢',title:'Add page numbers',desc:'Number each page with a chosen position and starting number.',accept:'.pdf,application/pdf',button:'Add page numbers',options:fields(['<div class="grid-2"><div class="field"><label for="start">Start numbering at</label><input type="number" id="start" value="1" min="0" max="100000"></div><div class="field"><label for="position">Number location</label><select id="position"><option value="bottom">Bottom centre</option><option value="right">Bottom right</option><option value="top">Top right</option></select></div></div>','name','save'])},
{id:'sign',icon:'✍️',title:'Add signature',desc:'Draw a signature with your finger or mouse and place it in the PDF.',accept:'.pdf,application/pdf',button:'Sign and download PDF',options:fields(['<p class="note">Draw your signature in the box below. It will be placed on the chosen page, as a visual signature only (not a certified digital signature).</p><canvas id="signature" class="signature" width="700" height="220" aria-label="Signature drawing pad"></canvas><button type="button" class="btn small" id="erase-signature">Clear signature</button><div class="grid-2"><div class="field"><label for="sign-page">Which page?</label><select id="sign-page"><option value="last">Last page</option><option value="first">First page</option><option value="all">Every page</option></select></div><div class="field"><label for="position">Position</label><select id="position"><option value="right">Bottom right</option><option value="bottom">Bottom centre</option><option value="top">Top right</option></select></div></div>','name','save'])},
{id:'protect',icon:'🔐',title:'Password-protect PDF',desc:'Create an encrypted copy requiring a password to open.',accept:'.pdf,application/pdf',button:'Protect PDF',options:fields(['<div class="notice warn">Protection is made by rebuilding pages as images. Existing searchable text and interactive content will be flattened. Keep an original copy. Passwords are not saved.</div><div class="field"><label for="password">Password to open PDF</label><input type="password" id="password" minlength="4" autocomplete="new-password" placeholder="At least 4 characters"></div><div class="field"><label for="password-confirm">Confirm password</label><input type="password" id="password-confirm" autocomplete="new-password"></div>','quality','name','save'])},
{id:'watermark',icon:'💧',title:'Watermark PDF',desc:'Stamp diagonal text such as Confidential, Draft or your organisation name.',accept:'.pdf,application/pdf',button:'Apply watermark',options:fields(['<div class="field"><label for="watermark-text">Watermark text</label><input id="watermark-text" value="CONFIDENTIAL" maxlength="60"></div><div class="grid-2"><div class="field"><label for="opacity">Opacity</label><select id="opacity"><option value="0.18">Light</option><option value="0.3">Medium</option><option value="0.5">Dark</option></select></div><div class="field"><label for="watermark-position">Position</label><select id="watermark-position"><option value="center">Diagonal centre</option><option value="top">Top centre</option><option value="bottom">Bottom centre</option></select></div></div>','name','save'])},
{id:'ocr',icon:'🔎',title:'Recognise text (OCR)',desc:'Extract text from photos or scanned PDFs. Choose plain text or a searchable image-based PDF.',accept:'image/*,.pdf,.heic,.heif',button:'Recognise text',options:fields(['language','<div class="field"><label for="ocr-output">Result</label><select id="ocr-output"><option value="text">Text file (.txt)</option><option value="searchable">Searchable image-based PDF (with invisible text)</option></select></div><div class="notice">OCR may misread handwriting and complex layouts. Review the result before relying on it.</div>','name','save'])},
{id:'translate',icon:'🌍',title:'Translate document',desc:'Extract text from PDFs/photos and translate it using an external translation service.',accept:'image/*,.pdf,.heic,.heif',button:'Translate text (external service)',tag:'External consent',options:fields(['language','<div class="field"><label for="source-lang">Document language</label><select id="source-lang"><option value="en">English</option><option value="he">Hebrew</option><option value="fr">French</option><option value="de">German</option><option value="es">Spanish</option></select></div><div class="field"><label for="target-lang">Translate to</label><select id="target-lang"><option value="he">Hebrew</option><option value="en">English</option><option value="fr">French</option><option value="de">German</option><option value="es">Spanish</option></select></div><div class="notice warn">By clicking Translate, you agree to send extracted text to the MyMemory translation service. Do not use with confidential or sensitive documents. Free service limits apply. Layout is not preserved.</div>'])},
{id:'drive',icon:'☁️',title:'Save to Google Drive',desc:'Share a finished PDF to Drive, or configure Google OAuth for direct uploads.',accept:'.pdf,application/pdf',button:'Share or save PDF',tag:'External consent',options:fields(['<div class="notice">On iPhone: tap Share PDF, then choose Google Drive if available. Direct Google Drive uploads require your own Google Cloud OAuth Client ID and authorisation.</div><div class="field"><label for="google-client">Google OAuth Client ID (optional, for direct upload)</label><input id="google-client" placeholder="...apps.googleusercontent.com" autocomplete="off"></div><div class="inline-actions"><button class="btn" id="drive-connect" type="button">Connect & upload directly</button><button class="btn" id="open-drive" type="button">Open Google Drive</button></div><small class="note">The OAuth client must allow this website origin. We do not save your access token or Client ID.</small>'])},
{id:'install',icon:'📱',title:'Install as an app',desc:'Open PDF Toolkit from your home screen, including after you close the browser.',accept:'',button:'Install app',tag:'Offline-ready',options:'<div class="notice good"><strong>iPhone / iPad:</strong> Open this page in Safari → Share → Add to Home Screen.<br><strong>Android:</strong> Chrome menu → Install app or Add to Home Screen.<br><strong>Desktop:</strong> Use the browser install icon if shown.</div><p class="note">Your first visit needs internet to load processing libraries. After that, previously loaded tools can work offline when your browser retains its cache. Translation and Drive always require internet.</p>'},
{id:'history',icon:'🕘',title:'Recent documents',desc:'Access PDFs you explicitly saved in this browser on this device.',accept:'',button:'Refresh recent documents',options:'<div class="notice">Files are stored only in this browser, not in GitHub, a server or a cloud account. Clearing browser storage may remove them.</div><div id="history-list" class="history" aria-live="polite"></div><button id="clear-history" class="btn danger small" type="button">Clear all recent documents</button>'}
];
const U={a4:[210,297],a5:[148,210],letter:[215.9,279.4],photo:[101.6,152.4]};
const files=[];let active=TOOL[0],busy=false,prevUrl=null,editPreviewUrl=null,lastOutput=null,installEvent=null;
const read=(id,fallback='')=>$(id)?$(id).value:fallback;
const check=(id)=>!!($(id)&&$(id).checked);
const safeName=(name,ext)=>((name||'document').trim().replace(/\.[^.]+$/,'').replace(/[\\/:*?"<>|]+/g,'-').replace(/^\.+/,'').slice(0,75)||'document')+'.'+ext;
const makeName=(ext)=>safeName(read('file-name','my-document'),ext);
const isPdf=file=>file.type==='application/pdf'||/\.pdf$/i.test(file.name);
const bytes=n=>n<1048576?Math.max(1,Math.round(n/1024))+' KB':(n/1048576).toFixed(1)+' MB';
const delay=()=>new Promise(r=>setTimeout(r,0));
function setMessage(msg,error=false){$('result').className='output visible'+(error?' error':'');$('status').textContent=msg;}
function errMsg(e){return e instanceof Error?e.message:String(e);}
function buttonsBusy(flag){busy=flag;$('run').disabled=flag;$('run').textContent=flag?'Working…':active.button;const picker=$('file-input');picker.disabled=flag;}
function clearResults(){const d=$('downloads');d.replaceChildren();$('extras').replaceChildren();$('result').className='output';if(prevUrl){URL.revokeObjectURL(prevUrl);prevUrl=null;}}
function releaseFiles(){for(const x of files){URL.revokeObjectURL(x.url)}files.length=0;renderFiles();}
function renderFiles(){
 const out=$('file-list');out.replaceChildren();$('file-toolbar').classList.toggle('hidden',!files.length);$('file-count').textContent=files.length+(files.length===1?' file':' files');
 files.forEach((f,i)=>{
  const row=document.createElement('div');row.className='file-card';row.dataset.i=i;
  const img=document.createElement('span');if(!isPdf(f.file)){const photo=document.createElement('img');photo.src=f.url;photo.alt='Photo preview';img.append(photo);}else{img.textContent='📄';img.style.fontSize='27px';img.style.width='48px';}
  const info=document.createElement('div');info.className='file-info';
  const title=document.createElement('strong');title.textContent=f.file.name;const detail=document.createElement('small');detail.textContent=bytes(f.file.size);info.append(title,detail);
  const actions=document.createElement('div');actions.className='row-actions';[['up','↑',i===0],['down','↓',i===files.length-1],['remove','×',false]].forEach(([act,label,disabled])=>{const button=document.createElement('button');button.type='button';button.className='btn small'+(act==='remove'?' danger':'');button.textContent=label;button.title={up:'Move up',down:'Move down',remove:'Remove'}[act];button.setAttribute('aria-label',button.title+' '+f.file.name);button.disabled=busy||disabled;button.dataset.action=act;actions.append(button);});
  row.append(img,info,actions);out.append(row);
 });
}
function addFiles(input){
 const allowed=active.accept;if(!allowed)return;
 let skipped=0,added=0;for(const file of Array.from(input||[])){
  if(files.length>=80||(allowed.includes('.pdf')&&!allowed.includes('image/')&&!isPdf(file))||(allowed.includes('image/')&&!allowed.includes('.pdf')&&!file.type.startsWith('image/')&&!/\.(heic|heif)$/i.test(file.name))||(file.size>160*1024*1024)){skipped++;continue;}
  files.push({file,url:URL.createObjectURL(file)});added++;
 }
 if(added)clearResults();renderFiles();if(skipped)setMessage(skipped+' unsupported, oversized or excess file(s) skipped.',true);
 if((active.id==='edit'||active.id==='scan'||active.id==='enhance')&&files.length)showEditPreview().catch(e=>setMessage(errMsg(e),true));
}
function drawTools(){
 const nav=$('tools');nav.replaceChildren();for(const t of TOOL){const b=document.createElement('button');b.type='button';b.className='tool-link'+(t.id===active.id?' active':'');b.dataset.tool=t.id;b.innerHTML='<span class="tool-icon" aria-hidden="true">'+t.icon+'</span><span>'+t.title+'</span>';b.setAttribute('aria-current',t.id===active.id?'page':'false');nav.append(b);}
}
function renderTool(){
 drawTools();$('tool-title').textContent=active.title;$('tool-desc').textContent=active.desc;$('tool-tag').textContent=active.tag||'Local processing';
 $('upload-panel').classList.toggle('hidden',!active.accept);$('file-input').accept=active.accept||'';$('file-input').multiple=!['split','compress','numbers','sign','protect','watermark','toimages','drive'].includes(active.id);
 $('drop-label').textContent=active.accept.includes('image/')?'Choose photos or drop them here':'Choose PDF files or drop them here';
 $('upload-hint').textContent=active.accept.includes('image/')?'Images from your phone, photo library or files':'PDF files from your device';
 $('options').innerHTML=active.options;$('run').textContent=active.button;$('options-heading').textContent=active.id==='history'?'Your saved files':'2. Choose options';
 $('privacy-note').textContent=['translate','drive'].includes(active.id)?'External transfer happens only when you choose to proceed.':'Local browser processing. No documents sent to this site’s server.';
 clearResults();$('preview-section').classList.add('hidden');releaseFiles();
 if(active.id==='sign')setupSignature();if(active.id==='history')showHistory();
 if(active.id==='drive'&&lastOutput)setMessage('Most recent generated PDF available: '+lastOutput.name);
}
function output(blob,name,label){const href=URL.createObjectURL(blob);const a=document.createElement('a');a.className='download-link';a.href=href;a.download=name;a.textContent='⬇ '+(label||name);$('downloads').append(a);a.addEventListener('click',()=>setTimeout(()=>URL.revokeObjectURL(href),120000),{once:true});return a;}
function download(blob,name,label){const a=output(blob,name,label);a.click();}
async function finish(blob,name,label,auto=true){
 if(blob.type==='application/pdf'){lastOutput={blob,name};if(check('remember')){try{await historyAdd(blob,name)}catch(e){setMessage('Created PDF, but saving to recent documents failed: '+errMsg(e),true)}}}
 setMessage('Ready: '+name+' ('+bytes(blob.size)+')');
 if(auto)download(blob,name,label||'Download '+name);else output(blob,name,label);
}
function requireFiles(n=1){if(files.length<n)throw Error(n===1?'Add a file first.':'Add at least '+n+' files first.');}
async function loadImage(file){const url=URL.createObjectURL(file);try{return await new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('Cannot open '+file.name+'. Please convert HEIC images to JPEG if your browser does not support them.'));im.src=url;});}finally{URL.revokeObjectURL(url);}}
function imageCanvas(image,scaleMax=2100,edited=false){
 const angle=edited?Number(read('rotation','0')):0,percent=edited?Number(read('crop','100'))/100:1;
 const w=image.naturalWidth,h=image.naturalHeight;if(!w||!h)throw Error('Unreadable image.');
 const sw=w*percent,sh=h*percent,sx=(w-sw)/2,sy=(h-sh)/2;
 const flipped=angle===90||angle===270;const targetW=flipped?sh:sw,targetH=flipped?sw:sh;
 const s=Math.min(1,scaleMax/Math.max(targetW,targetH));const canvas=document.createElement('canvas');
 canvas.width=Math.max(1,Math.round(targetW*s));canvas.height=Math.max(1,Math.round(targetH*s));
 const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)throw Error('Canvas is unavailable.');
 ctx.fillStyle='white';ctx.fillRect(0,0,canvas.width,canvas.height);
 const bright=edited?Number(read('bright','100')):100,contrast=edited?Number(read('contrast','100')):100,tone=edited?read('scan-tone','color'):'color';
 ctx.filter='brightness('+bright+'%) contrast('+(tone==='contrast'?Math.max(contrast,155):contrast)+'%)'+(tone==='gray'||tone==='contrast'?' grayscale(100%)':'');
 ctx.translate(canvas.width/2,canvas.height/2);ctx.rotate(angle*Math.PI/180);
 if(flipped)ctx.drawImage(image,sx,sy,sw,sh,-canvas.height/2,-canvas.width/2,canvas.height,canvas.width);
 else ctx.drawImage(image,sx,sy,sw,sh,-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);
 return canvas;
}
async function showEditPreview(){
 if(!files.length)return;$('preview-section').classList.remove('hidden');$('preview-tools').textContent='First photo preview. Current adjustments apply to all uploaded photos.';
 const img=await loadImage(files[0].file);const can=imageCanvas(img,850,true);$('preview').replaceChildren(can);
}
function pdfLib(){if(!window.PDFLib)throw Error('PDF library did not load. Check your internet connection and reload.');return window.PDFLib;}
function pdfJs(){if(!window.pdfjsLib)throw Error('PDF rendering library did not load. Reload the page when online.');window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';return window.pdfjsLib;}
function jsPdf(){if(!window.jspdf||!window.jspdf.jsPDF)throw Error('PDF writer did not load. Refresh the page while online.');return window.jspdf.jsPDF;}
async function openPdf(file){const data=new Uint8Array(await file.arrayBuffer());try{return await pdfJs().getDocument({data}).promise;}catch(e){throw Error('Could not open '+file.name+'. It may be damaged or password-protected. '+errMsg(e));}}
async function openEditable(file){try{return await pdfLib().PDFDocument.load(await file.arrayBuffer(),{ignoreEncryption:false});}catch(e){throw Error('Could not edit '+file.name+'. This tool needs a non-password-protected PDF. '+errMsg(e));}}
async function renderPage(page,scale=1.5){const viewport=page.getViewport({scale});const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);const ctx=canvas.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);await page.render({canvasContext:ctx,viewport}).promise;return canvas;}
function parsePages(input,max){if(!input||!input.trim())return Array.from({length:max},(_,i)=>i+1);
 const numbers=[];for(const part of input.split(',')){const match=part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);if(!match)throw Error('Invalid page range. Use 1-3,5.');const a=Number(match[1]),b=match[2]?Number(match[2]):a;if(a<1||b>max||a>b)throw Error('Page number outside 1–'+max);for(let n=a;n<=b;n++)if(!numbers.includes(n))numbers.push(n);}
 if(!numbers.length)throw Error('Choose at least one page.');return numbers;
}
async function zipFiles(blobs){if(!window.JSZip)throw Error('ZIP library unavailable. Reload when online.');const zip=new window.JSZip();for(const [name,blob] of blobs)zip.file(name,blob);return await zip.generateAsync({type:'blob',compression:'DEFLATE'});}
function blobCanvas(canvas,type='image/jpeg',quality=.85){return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('Could not encode image.')),type,quality));}
function photoOptions(){const q=read('quality','balanced');return {max:q==='high'?3000:q==='small'?1200:2100,jpg:q==='high'?.94:q==='small'?.65:.84};}
function pageDim(paper,orient,w,h){const format=U[paper]||U.a4;const landscape=orient==='landscape'||(orient==='auto'&&w>h);return landscape?[format[1],format[0]]:format;}
async function photosPdf(mode){
 requireFiles();const js=jsPdf();const settings=photoOptions();const pages=[];let pdf=null;
 const paper=read('paper','a4'),orient=read('orient','auto');
 const n=mode==='multi'?Number(read('layout-size','2')):1;
 for(let i=0;i<files.length;i+=n){const part=files.slice(i,i+n);const first=await loadImage(part[0].file);const [pw,ph]=pageDim(paper,mode==='multi'&&orient==='auto'?'portrait':orient,first.naturalWidth,first.naturalHeight);
 if(!pdf)pdf=new js({unit:'mm',format:[pw,ph],orientation:pw>ph?'landscape':'portrait',compress:true});else pdf.addPage([pw,ph],pw>ph?'landscape':'portrait');
 const margin=mode==='scan'?8:Number(read('margin','8')),perRow=n===1?1:n===2?1:2,rows=Math.ceil(n/perRow),pad=5;
 const areaW=(pw-2*margin-pad*(perRow-1))/perRow,areaH=(ph-2*margin-pad*(rows-1))/rows;
 for(let j=0;j<part.length;j++){const original=j===0?first:await loadImage(part[j].file);const canvas=imageCanvas(original,settings.max,mode==='scan');let iw=canvas.width,ih=canvas.height;
 let drawW=areaW,drawH=areaH;const cover=read('placement','contain')==='cover'&&mode==='photos';
 if(!cover){const factor=Math.min(areaW/iw,areaH/ih);drawW=iw*factor;drawH=ih*factor;}
 const row=Math.floor(j/perRow),col=j%perRow,cx=margin+col*(areaW+pad),cy=margin+row*(areaH+pad);
 // The cover layout fills the box by cropping its source image on canvas.
 if(cover){const crop=document.createElement('canvas');const ratio=areaW/areaH;crop.width=canvas.width;crop.height=Math.max(1,Math.round(crop.width/ratio));const c=crop.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,crop.width,crop.height);const scale=Math.max(crop.width/canvas.width,crop.height/canvas.height);c.drawImage(canvas,(crop.width-canvas.width*scale)/2,(crop.height-canvas.height*scale)/2,canvas.width*scale,canvas.height*scale);pdf.addImage(crop.toDataURL('image/jpeg',settings.jpg),'JPEG',cx,cy,areaW,areaH);crop.width=0;crop.height=0;}
 else pdf.addImage(canvas.toDataURL('image/jpeg',settings.jpg),'JPEG',cx+(areaW-drawW)/2,cy+(areaH-drawH)/2,drawW,drawH);
 canvas.width=0;canvas.height=0;
 }
 setMessage('Building page '+(Math.floor(i/n)+1)+' of '+Math.ceil(files.length/n)+'…');await delay();
 }
 await finish(pdf.output('blob'),makeName('pdf'));
}
async function editPhotos(){
 requireFiles();const enhanced=active.id==='enhance',type=enhanced?'image/jpeg':read('image-type','image/jpeg'),ext=type==='image/png'?'png':'jpg';const outputs=[];
 for(let i=0;i<files.length;i++){const im=await loadImage(files[i].file),canvas=imageCanvas(im,3000,true);outputs.push([safeName(files[i].file.name,ext),await blobCanvas(canvas,type,.92)]);canvas.width=0;canvas.height=0;setMessage('Processing image '+(i+1)+' of '+files.length);await delay();}
 if(outputs.length===1){setMessage('Edited image ready.');download(outputs[0][1],outputs[0][0]);}
 else await finish(await zipFiles(outputs),'edited-photos.zip');
}
async function convertPdfToImages(){
 requireFiles();const type=read('image-type','image/png'),ext=type==='image/png'?'png':'jpg',out=[];
 for(const item of files){const pdf=await openPdf(item.file),nums=parsePages(read('pages',''),pdf.numPages);
 for(const n of nums){const page=await pdf.getPage(n),canvas=await renderPage(page,Number(read('scale','1.5')));out.push([safeName(item.file.name,'').replace(/\.$/,'')+'-page-'+n+'.'+ext,await blobCanvas(canvas,type,.9)]);canvas.width=0;canvas.height=0;setMessage('Rendering page '+n+'…');await delay();}
 await pdf.destroy();}
 if(out.length===1){setMessage('Image ready.');download(out[0][1],out[0][0]);}
 else await finish(await zipFiles(out),'pdf-pages.zip');
}
async function mergePdfs(){
 requireFiles(2);const {PDFDocument}=pdfLib(),dest=await PDFDocument.create();for(let i=0;i<files.length;i++){setMessage('Adding PDF '+(i+1)+' of '+files.length+'…');const src=await openEditable(files[i].file),copied=await dest.copyPages(src,src.getPageIndices());copied.forEach(p=>dest.addPage(p));await delay();}
 await finish(new Blob([await dest.save()],{type:'application/pdf'}),makeName('pdf'));
}
async function splitPdf(){
 requireFiles();const {PDFDocument}=pdfLib(),src=await openEditable(files[0].file),nums=parsePages(read('pages','1'),src.getPageCount()),mode=read('split-mode','combined');
 if(mode==='combined'){const target=await PDFDocument.create(),pages=await target.copyPages(src,nums.map(n=>n-1));pages.forEach(p=>target.addPage(p));await finish(new Blob([await target.save()],{type:'application/pdf'}),makeName('pdf'));}
 else{const out=[];for(const n of nums){const target=await PDFDocument.create();target.addPage((await target.copyPages(src,[n-1]))[0]);out.push([safeName(read('file-name','document'),'' ).replace(/\.$/,'')+'-page-'+n+'.pdf',new Blob([await target.save()],{type:'application/pdf'})]);}await finish(await zipFiles(out),'split-pages.zip');}
}
async function rasterizePdf(protect){
 requireFiles();const js=jsPdf(),source=await openPdf(files[0].file),quality=photoOptions();if(protect){if(read('password').length<4)throw Error('Choose a password of at least 4 characters.');if(read('password')!==read('password-confirm'))throw Error('Passwords do not match.');}
 let dest=null;for(let n=1;n<=source.numPages;n++){
 setMessage((protect?'Protecting':'Compressing')+' page '+n+' of '+source.numPages+'…');const p=await source.getPage(n),v=p.getViewport({scale:1}),ratio=Math.min(1,quality.max/Math.max(v.width,v.height));
 const can=await renderPage(p,(protect?1.65:1.8)*ratio),pw=v.width*25.4/72,ph=v.height*25.4/72;
 if(!dest){const options={unit:'mm',format:[pw,ph],orientation:pw>ph?'landscape':'portrait',compress:true};if(protect)options.encryption={userPassword:read('password'),ownerPassword:read('password'),userPermissions:['print']};dest=new js(options);}
 else dest.addPage([pw,ph],pw>ph?'landscape':'portrait');
 dest.addImage(can.toDataURL('image/jpeg',quality.jpg),'JPEG',0,0,pw,ph);can.width=0;can.height=0;await delay();
 }
 await source.destroy();await finish(dest.output('blob'),makeName('pdf'));
}
async function numberPages(){
 requireFiles();const {PDFDocument,rgb}=pdfLib(),src=await openEditable(files[0].file),font=await src.embedFont('Helvetica'),pos=read('position','bottom'),start=Math.max(0,Number(read('start','1')));
 src.getPages().forEach((page,i)=>{const {width,height}=page.getSize(),str=String(start+i),size=11,x=pos==='bottom'?(width-font.widthOfTextAtSize(str,size))/2:width-34,y=pos==='top'?height-29:25;page.drawText(str,{x,y,size,font,color:rgb(.18,.28,.42)});});
 await finish(new Blob([await src.save()],{type:'application/pdf'}),makeName('pdf'));
}
let signed=false;
function setupSignature(){
 const canvas=$('signature');if(!canvas)return;const ctx=canvas.getContext('2d');ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=3;ctx.strokeStyle='#193a65';let drawing=false;
 function coords(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height};}
 canvas.addEventListener('pointerdown',e=>{drawing=true;signed=true;const p=coords(e);ctx.beginPath();ctx.moveTo(p.x,p.y);canvas.setPointerCapture(e.pointerId);e.preventDefault();});
 canvas.addEventListener('pointermove',e=>{if(!drawing)return;const p=coords(e);ctx.lineTo(p.x,p.y);ctx.stroke();e.preventDefault();});
 canvas.addEventListener('pointerup',()=>drawing=false);canvas.addEventListener('pointercancel',()=>drawing=false);
 $('erase-signature').onclick=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);signed=false;};
 signed=false;
}
async function signPdf(){
 requireFiles();if(!signed)throw Error('Draw a signature in the box before signing.');const {PDFDocument}=pdfLib(),pdf=await openEditable(files[0].file),png=await pdf.embedPng($('signature').toDataURL('image/png')),pages=pdf.getPages(),place=read('sign-page','last'),pos=read('position','right');
 const indices=place==='all'?pages.map((_,i)=>i):[place==='first'?0:pages.length-1];
 for(const i of indices){const p=pages[i],{width,height}=p.getSize(),w=Math.min(width*.36,200),h=w*png.height/png.width;
 const x=pos==='bottom'?(width-w)/2:width-w-40,y=pos==='top'?height-h-45:35;p.drawImage(png,{x,y,width:w,height:h});}
 await finish(new Blob([await pdf.save()],{type:'application/pdf'}),makeName('pdf'));
}
async function watermarkPdf(){
 requireFiles();const lib=pdfLib(),src=await openEditable(files[0].file),font=await src.embedFont('Helvetica-Bold'),str=read('watermark-text','CONFIDENTIAL').trim();if(!str)throw Error('Write your watermark text first.');
 const mode=read('watermark-position','center'),opacity=Number(read('opacity','.18'));
 for(const p of src.getPages()){const {width,height}=p.getSize(),size=Math.min(56,width*.95/font.widthOfTextAtSize(str,1)),rot=mode==='center'?lib.degrees(35):lib.degrees(0);
 const textW=font.widthOfTextAtSize(str,size),x=mode==='center'?Math.max(15,width/2-textW*.42):(width-textW)/2,y=mode==='top'?height-55:mode==='bottom'?40:height/2-textW*.19;
 p.drawText(str,{x,y,size,rotate:rot,opacity,color:lib.rgb(.25,.34,.51),font});}
 await finish(new Blob([await src.save()],{type:'application/pdf'}),makeName('pdf'));
}
async function ocrCanvas(canvas,lang){
 if(!window.Tesseract)throw Error('Text recognition library did not load. Reload while online.');
 const r=await window.Tesseract.recognize(canvas,lang,{logger:m=>{if(m.status==='recognizing text')setMessage('Recognising text: '+Math.round(m.progress*100)+'%');}});
 return r.data;
}
async function getCanvases(max=15){
 const result=[];for(const entry of files){if(isPdf(entry.file)){const pdf=await openPdf(entry.file);if(pdf.numPages>max)throw Error('For OCR/translation, use a document of up to '+max+' pages at a time.');for(let p=1;p<=pdf.numPages;p++)result.push(await renderPage(await pdf.getPage(p),1.75));await pdf.destroy();}
 else{const img=await loadImage(entry.file);result.push(imageCanvas(img,2300));}if(result.length>max)throw Error('Too many pages. Process up to '+max+' at once.');}
 return result;
}
async function performOcr(){
 requireFiles();const canvases=await getCanvases(),lang=read('ocr-lang','eng'),mode=read('ocr-output','text'),all=[],js=mode==='searchable'?jsPdf():null;let doc=null;
 try{
 for(let i=0;i<canvases.length;i++){setMessage('OCR page '+(i+1)+' of '+canvases.length+'…');const canvas=canvases[i],data=await ocrCanvas(canvas,lang);all.push((data.text||'').trim());
 if(mode==='searchable'){const width=210,height=width*canvas.height/canvas.width;if(!doc)doc=new js({unit:'mm',format:[width,height],compress:true});else doc.addPage([width,height],width>height?'landscape':'portrait');
 doc.addImage(canvas.toDataURL('image/jpeg',.86),'JPEG',0,0,width,height);
 const words=data.words||[];for(const w of words){if(!w.text||!w.bbox)continue;const bb=w.bbox,x=bb.x0/canvas.width*width,y=bb.y1/canvas.height*height;const size=Math.max(2,Math.min(22,(bb.y1-bb.y0)/canvas.height*height*.9));doc.setFontSize(size*72/25.4);doc.text(String(w.text),x,y,{renderingMode:'invisible'});}
 if(!words.length&&data.text){doc.text(data.text.slice(0,3000),3,3,{renderingMode:'invisible'});}
 }
 canvas.width=0;canvas.height=0;await delay();}
 if(mode==='searchable')await finish(doc.output('blob'),makeName('pdf'));else{const value=all.join('\n\n--- PAGE ---\n\n');await finish(new Blob([value],{type:'text/plain;charset=utf-8'}),makeName('txt'));showText(value);}
 }finally{for(const c of canvases){c.width=0;c.height=0;}}
}
function showText(value){const box=document.createElement('textarea');box.className='result-text';box.readOnly=true;box.value=value;box.setAttribute('aria-label','Extracted document text');$('extras').append(box);
 const b=document.createElement('button');b.className='btn small';b.textContent='Copy text';b.onclick=()=>navigator.clipboard.writeText(box.value).then(()=>setMessage('Text copied.')).catch(()=>setMessage('Select the text manually to copy.'));$('extras').append(b);}
async function getText(){
 requireFiles();const result=[];let pages=0;
 for(const entry of files){if(isPdf(entry.file)){const doc=await openPdf(entry.file);pages+=doc.numPages;if(pages>8)throw Error('Translation supports up to 8 pages at a time.');
 for(let i=1;i<=doc.numPages;i++){const page=await doc.getPage(i),text=await page.getTextContent(),nativeText=text.items.map(item=>item.str).join(' ').trim();if(nativeText.length>20){result.push(nativeText);}else{setMessage('OCR scanning page '+i+'…');const canvas=await renderPage(page,1.6),ocr=await ocrCanvas(canvas,read('ocr-lang','eng'));result.push(ocr.text||'');canvas.width=0;canvas.height=0;}}
 await doc.destroy();}else{const img=await loadImage(entry.file),canvas=imageCanvas(img,1900);const ocr=await ocrCanvas(canvas,read('ocr-lang','eng'));result.push(ocr.text||'');canvas.width=0;canvas.height=0;}}
 return result.join('\n\n');
}
function segmentText(t,max=400){const list=[];let remaining=t.trim();while(remaining){let i=Math.min(max,remaining.length);if(i<remaining.length){const b=remaining.lastIndexOf(' ',i);if(b>max/2)i=b;}list.push(remaining.slice(0,i));remaining=remaining.slice(i).trimStart();}return list;}
async function translate(){
 requireFiles();const from=read('source-lang','en'),to=read('target-lang','he');if(from===to)throw Error('Source and target languages must differ.');
 const txt=await getText();if(!txt.trim())throw Error('No text found in the document.');
 const chunks=segmentText(txt,400);if(chunks.length>15)throw Error('Free translation limit: this document is too long. Try fewer pages (about 6,000 characters).');
 const outputs=[];for(let i=0;i<chunks.length;i++){setMessage('Sending text to translation service: '+(i+1)+' of '+chunks.length+'…');
 const url='https://api.mymemory.translated.net/get?q='+encodeURIComponent(chunks[i])+'&langpair='+encodeURIComponent(from+'|'+to),res=await fetch(url);if(!res.ok)throw Error('Translation service unavailable ('+res.status+').');const data=await res.json();if(data.responseStatus!==200||!data.responseData?.translatedText)throw Error('Translation service reached a limit or returned an error.');outputs.push(data.responseData.translatedText);await delay();}
 const translated=outputs.join(' ');setMessage('Translation complete. Please review it for accuracy.');download(new Blob([translated],{type:'text/plain;charset=utf-8'}),'translated-document.txt');showText(translated);
}
async function shareOrDrive(){
 const candidate=files[0]?{blob:files[0].file,name:files[0].file.name}:lastOutput;if(!candidate)throw Error('Upload a PDF, or create one using another tool first.');
 const file=new File([candidate.blob],candidate.name,{type:'application/pdf'});
 if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:file.name});setMessage('Share menu opened. Choose Google Drive or Save to Files.');}
 else{setMessage('Browser share is unavailable. Download the PDF, open Google Drive and upload it there.');download(file,file.name);}
}
async function directDrive(){
 const id=read('google-client').trim();if(!id||!id.endsWith('.apps.googleusercontent.com'))throw Error('Enter a valid Google OAuth Web Client ID to use direct upload.');const candidate=files[0]?{blob:files[0].file,name:files[0].file.name}:lastOutput;if(!candidate)throw Error('Choose a PDF or create one first.');
 setMessage('Loading Google sign-in…');
 if(!window.google?.accounts?.oauth2){await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';s.onload=resolve;s.onerror=()=>reject(Error('Google sign-in unavailable.'));document.head.append(s);});}
 const token=await new Promise((resolve,reject)=>{const client=window.google.accounts.oauth2.initTokenClient({client_id:id,scope:'https://www.googleapis.com/auth/drive.file',callback:r=>r.error?reject(Error(r.error)):resolve(r.access_token),error_callback:e=>reject(Error(e.message||e.type||'Google sign-in failed'))});client.requestAccessToken({prompt:'consent'});});
 setMessage('Uploading PDF to your Google Drive…');const boundary='pdf-toolkit-'+Date.now(),mime='application/pdf',body=new Blob(['--'+boundary+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n',JSON.stringify({name:candidate.name}),'\r\n--'+boundary+'\r\nContent-Type: '+mime+'\r\n\r\n',candidate.blob,'\r\n--'+boundary+'--']);
 const response=await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'multipart/related; boundary='+boundary},body});
 const data=await response.json();if(!response.ok)throw Error('Google Drive upload failed: '+(data.error?.message||response.status));setMessage('Uploaded to Google Drive: '+data.name);const url=data.webViewLink||'https://drive.google.com/file/d/'+encodeURIComponent(data.id)+'/view';const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.className='download-link';a.textContent='Open PDF in Google Drive ↗';$('downloads').append(a);
}
function historyDB(){return new Promise((resolve,reject)=>{if(!indexedDB)return reject(Error('Browser storage unavailable.'));const req=indexedDB.open('GuyPDFToolkit',1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('documents'))req.result.createObjectStore('documents',{keyPath:'id',autoIncrement:true});};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function transact(mode,method,data){const db=await historyDB();return new Promise((resolve,reject)=>{const tx=db.transaction('documents',mode),request=tx.objectStore('documents')[method](...(data||[]));let value;request.onsuccess=()=>value=request.result;request.onerror=()=>reject(request.error);tx.oncomplete=()=>{db.close();resolve(value);};tx.onerror=()=>{db.close();reject(tx.error);};});}
async function historyAdd(blob,name){await transact('readwrite','add',[{name,blob,date:Date.now()}]);}
async function showHistory(){
 if(active.id!=='history')return;const out=$('history-list');if(!out)return;out.textContent='Loading recent documents…';try{const rows=(await transact('readonly','getAll',[])).sort((a,b)=>b.date-a.date);out.replaceChildren();if(!rows.length){out.textContent='No saved PDFs yet. Tick “Save finished PDF to recent documents” when creating one.';return;}
 rows.forEach(item=>{const row=document.createElement('div');row.className='file-card';const label=document.createElement('div');label.className='file-info';const name=document.createElement('strong');name.textContent=item.name;const date=document.createElement('small');date.textContent=new Date(item.date).toLocaleString()+' · '+bytes(item.blob.size);label.append(name,date);
 const save=document.createElement('button');save.className='btn small';save.textContent='Download';save.onclick=()=>download(item.blob,item.name);
 const del=document.createElement('button');del.className='btn small danger';del.textContent='Delete';del.onclick=async()=>{await transact('readwrite','delete',[item.id]);showHistory();};
 row.append(label,save,del);out.append(row);});
 }catch(e){out.textContent='Could not read browser history: '+errMsg(e);}}
async function perform(){
 switch(active.id){
 case 'photos':case 'scan':case 'multi':return photosPdf(active.id);
 case 'edit':case 'enhance':return editPhotos();
 case 'toimages':return convertPdfToImages();
 case 'merge':return mergePdfs();
 case 'split':return splitPdf();
 case 'compress':return rasterizePdf(false);
 case 'numbers':return numberPages();
 case 'sign':return signPdf();
 case 'protect':return rasterizePdf(true);
 case 'watermark':return watermarkPdf();
 case 'ocr':return performOcr();
 case 'translate':return translate();
 case 'drive':return shareOrDrive();
 case 'install':if(installEvent){installEvent.prompt();const r=await installEvent.userChoice;setMessage('Install prompt: '+r.outcome);installEvent=null;}else setMessage('To install: iPhone Safari → Share → Add to Home Screen. Android Chrome → menu → Install app.');return;
 case 'history':return showHistory();
 }
}
$('tools').addEventListener('click',e=>{if(busy)return;const button=e.target.closest('[data-tool]');if(!button)return;const found=TOOL.find(t=>t.id===button.dataset.tool);if(!found)return;active=found;renderTool();history.replaceState(null,'','#'+found.id);});
$('file-input').addEventListener('change',e=>{addFiles(e.target.files);e.target.value='';});
$('add-more').onclick=()=>$('file-input').click();
$('clear-files').onclick=()=>{if(!busy){releaseFiles();clearResults();$('preview-section').classList.add('hidden');}};
$('file-list').addEventListener('click',e=>{if(busy)return;const button=e.target.closest('[data-action]');if(!button)return;const i=Number(button.closest('.file-card').dataset.i),act=button.dataset.action;if(act==='remove'){URL.revokeObjectURL(files[i].url);files.splice(i,1);}else{const j=i+(act==='up'?-1:1);if(j<0||j>=files.length)return;[files[i],files[j]]=[files[j],files[i]];}clearResults();renderFiles();if(['scan','edit','enhance'].includes(active.id)&&files.length)showEditPreview().catch(e=>setMessage(errMsg(e),true));});
const drop=$('dropzone');['dragover','dragenter'].forEach(type=>drop.addEventListener(type,e=>{e.preventDefault();drop.classList.add('over');}));['dragleave','drop'].forEach(type=>drop.addEventListener(type,e=>{e.preventDefault();drop.classList.remove('over');}));drop.addEventListener('drop',e=>addFiles(e.dataTransfer.files));
$('options').addEventListener('input',e=>{if(['bright','contrast'].includes(e.target.id)){const label=$(e.target.id+'-read');if(label)label.textContent=e.target.value+'%';}if(['bright','contrast','rotation','crop','scan-tone'].includes(e.target.id)&&['scan','edit','enhance'].includes(active.id)&&files.length){showEditPreview().catch(()=>{});}});
$('options').addEventListener('change',e=>{if(['rotation','crop','scan-tone'].includes(e.target.id)&&['scan','edit','enhance'].includes(active.id)&&files.length){showEditPreview().catch(()=>{});}});
$('options').addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;try{if(b.id==='drive-connect'){b.disabled=true;try{await directDrive();}finally{b.disabled=false;}}else if(b.id==='open-drive'){window.open('https://drive.google.com/drive/my-drive','_blank','noopener');}
 else if(b.id==='clear-history'){if(confirm('Delete every saved PDF from this browser?')){await transact('readwrite','clear',[]);showHistory();}}}catch(error){setMessage(errMsg(error),true);}});
$('run').onclick=async()=>{if(busy)return;buttonsBusy(true);clearResults();try{await perform();}catch(e){console.error(e);setMessage(errMsg(e),true);}finally{buttonsBusy(false);renderFiles();}};
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;});
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
const initial=TOOL.find(x=>x.id===location.hash.slice(1));if(initial)active=initial;renderTool();
})();