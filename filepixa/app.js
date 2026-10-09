/* FilePixa Studio — all image pixels stay inside the visitor's browser.
   Optional AI segmentation code and model are downloaded from third-party CDNs.
   External AI dependency @imgly/background-removal is AGPL-3.0 licensed. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const DEFAULTS = Object.freeze({brightness:100,contrast:100,saturation:100,sharpen:0,aspect:"original",bg:"transparent",rotation:0,flip:false});
  const s = {file:null,original:null,current:null,currentBlob:null,removed:false,settings:{...DEFAULTS},history:[],busy:false,renderQueued:false,urls:[]};
  const ids = ["remove-bg","auto-enhance","fix-blur","brightness","contrast","saturation","sharpen","aspect","rotate-left","rotate-right","flip","custom-bg","format","scale","download","reset"];
  const CLAMP = (x,min,max) => Math.max(min,Math.min(max,x));
  function message(value,isError=false) { const node=$("status");node.textContent=value;node.classList.toggle("error",isError); }
  function setBusy(busy,label) {
    s.busy=busy;
    for(const id of ids){const el=$(id);if(el) el.disabled=busy||!s.file;}
    $("undo").disabled=busy||s.history.length===0;
    document.querySelectorAll("[data-bg]").forEach(el=>el.disabled=busy||!s.file);
    if(busy) message(label||"Working on your photo…");
    $("download").textContent=busy?"Working…":"↓ Download image";
  }
  function snapshot() {
    return {current:s.current,currentBlob:s.currentBlob,removed:s.removed,settings:{...s.settings}};
  }
  function remember() {
    if(!s.file || s.busy) return;
    s.history.push(snapshot());
    if(s.history.length>15)s.history.shift();
    $("undo").disabled=false;
  }
  function restore(snap) {
    s.current=snap.current;s.currentBlob=snap.currentBlob;s.removed=snap.removed;s.settings={...snap.settings};
    sync();scheduleRender();
  }
  function sync() {
    for(const id of ["brightness","contrast","saturation","sharpen"]){
      $(id).value=s.settings[id];$(id+"-val").textContent=s.settings[id]+"%";
    }
    $("aspect").value=s.settings.aspect;
    document.querySelectorAll("[data-bg]").forEach(el=>{
      const selected=el.dataset.bg===s.settings.bg;
      el.classList.toggle("selected",selected);
      el.setAttribute("aria-pressed",String(selected));
    });
    $("remove-bg").disabled=!s.file||s.busy||s.removed;
  }
  function loadFromUrl(url) {
    return new Promise((resolve,reject)=>{
      const img=new Image();
      img.onload=()=>resolve(img);
      img.onerror=()=>reject(Error("This image cannot be opened in your browser."));
      img.src=url;
    });
  }
  function humanSize(n){return n>=1048576?(n/1048576).toFixed(1)+" MB":Math.max(1,Math.round(n/1024))+" KB";}
  async function loadFile(file){
    if(!file)return;
    const supported=/^image\/(png|jpeg|webp|avif|gif)$/i.test(file.type)||/\.(jpe?g|png|webp|avif|gif)$/i.test(file.name);
    if(!supported){message("Please select a JPG, PNG or WebP image (AVIF/GIF if your browser supports it).",true);return;}
    if(file.size>30*1048576){message("This file exceeds the 30 MB limit. Please choose a smaller image.",true);return;}
    if(s.busy)return;
    const url=URL.createObjectURL(file);
    try{
      const img=await loadFromUrl(url);
      if(!img.naturalWidth||!img.naturalHeight)throw Error("Image has no visible dimensions.");
      if(img.naturalWidth*img.naturalHeight>70e6)throw Error("Photo dimensions are too large for safe browser editing.");
      s.urls.push(url);s.file=file;s.original=img;s.current=img;s.currentBlob=file;s.removed=false;s.settings={...DEFAULTS};s.history=[];
      $("upload").value="";
      $("empty-state").classList.add("hidden");$("photo-stage").classList.remove("hidden");$("preview-bar").classList.remove("hidden");
      $("dropzone").setAttribute("aria-label","Choose a different photo");
      $("compare").value="100";setCompare();
      setBusy(false);sync();scheduleRender();
      message("Loaded "+file.name+" · "+humanSize(file.size)+". Ready to edit.");
    }catch(e){URL.revokeObjectURL(url);message(e.message||"Failed to open photo.",true);}
  }
  function cropFor(img) {
    const w=img.naturalWidth,h=img.naturalHeight;
    const wanted=s.settings.aspect==="original"?w/h:Number(s.settings.aspect);
    let cw=w,ch=h;
    if(w/h>wanted)cw=h*wanted;else ch=w/wanted;
    return {x:(w-cw)/2,y:(h-ch)/2,w:cw,h:ch};
  }
  function sharpenCanvas(canvas,level) {
    if(level<=0)return;
    const ctx=canvas.getContext("2d",{willReadFrequently:true});
    const w=canvas.width,h=canvas.height;
    if(w<3||h<3)return;
    const img=ctx.getImageData(0,0,w,h),input=img.data,output=new Uint8ClampedArray(input);
    const a=level/100*.95;
    for(let y=1;y<h-1;y++){
      for(let x=1;x<w-1;x++){
        const i=(y*w+x)*4;
        if(input[i+3]<10)continue;
        for(let c=0;c<3;c++){
          const center=input[i+c];
          const neighbour=(input[i-4+c]+input[i+4+c]+input[i-w*4+c]+input[i+w*4+c])/4;
          output[i+c]=CLAMP(center+(center-neighbour)*a*3,0,255);
        }
      }
    }
    img.data.set(output);ctx.putImageData(img,0,0);
  }
  function renderInto(canvas,img,original=false,multiplier=1,limit=1200,forJpeg=false) {
    const c=cropFor(img);
    const rotate=s.settings.rotation%180!==0;
    const zoom=Math.max(.1,multiplier);
    const originalLongest=Math.max(c.w,c.h);
    const scale=Math.min(zoom,limit/originalLongest,Math.sqrt(16e6/(c.w*c.h)));
    const w=Math.max(1,Math.round(c.w*scale)),h=Math.max(1,Math.round(c.h*scale));
    canvas.width=rotate?h:w;canvas.height=rotate?w:h;
    const ctx=canvas.getContext("2d",{alpha:!forJpeg,willReadFrequently:!original&&s.settings.sharpen>0});
    if(!ctx)throw Error("Image canvas could not be created.");
    if(!original&&(s.settings.bg!=="transparent"||forJpeg)){
      ctx.fillStyle=s.settings.bg==="transparent"?"#ffffff":s.settings.bg;
      ctx.fillRect(0,0,canvas.width,canvas.height);
    }
    ctx.save();
    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.rotate(s.settings.rotation*Math.PI/180);
    ctx.scale(s.settings.flip?-1:1,1);
    if(!original) ctx.filter="brightness("+s.settings.brightness+"%) contrast("+s.settings.contrast+"%) saturate("+s.settings.saturation+"%)";
    ctx.drawImage(img,c.x,c.y,c.w,c.h,-w/2,-h/2,w,h);
    ctx.restore();
    if(!original&&s.settings.sharpen>0)sharpenCanvas(canvas,s.settings.sharpen);
  }
  function scheduleRender() {
    if(s.renderQueued)return;
    s.renderQueued=true;
    requestAnimationFrame(()=>{s.renderQueued=false;try{renderPreview();}catch(e){message(e.message||"Preview error.",true);}});
  }
  function renderPreview() {
    if(!s.current)return;
    const before=$("before-canvas"),after=$("after-canvas");
    renderInto(before,s.original,true,1,1000,false);
    renderInto(after,s.current,false,1,1000,false);
    /* AI segmentation can return a different size; both previews retain the same crop settings. */
    const originalWidth=s.original.naturalWidth,originalHeight=s.original.naturalHeight;
    $("image-info").textContent=originalWidth+" × "+originalHeight+" px";
    setCompare();
  }
  function setCompare(){
    const p=Number($("compare").value);
    $("after-canvas").style.clipPath="inset(0 "+(100-p)+"% 0 0)";
    $("compare-line").style.left=p+"%";
  }
  function modify(newValues,note){
    if(!s.file||s.busy)return;
    remember();Object.assign(s.settings,newValues);sync();scheduleRender();if(note)message(note);
  }
  function reset(){
    if(!s.file||s.busy)return;
    remember();s.settings={...DEFAULTS};s.current=s.original;s.currentBlob=s.file;s.removed=false;
    $("format").value="image/png";$("scale").value="1";
    sync();scheduleRender();message("Photo restored to original settings.");
  }
  function undo(){
    if(!s.history.length||s.busy)return;
    restore(s.history.pop());$("undo").disabled=s.history.length===0;message("Previous edit restored.");
  }
  async function removeBackground(){
    if(!s.file||s.busy||s.removed)return;
    remember();
    setBusy(true,"Loading AI background remover. First use downloads a model and may take time…");
    await new Promise(resolve=>setTimeout(resolve,40));
    try{
      const module=await import("https://esm.sh/@imgly/background-removal@1.7.0?bundle");
      const remove=typeof module.default==="function"?module.default:module.removeBackground;
      if(typeof remove!=="function")throw Error("Background removal module did not load correctly.");
      const blob=await remove(s.currentBlob||s.file,{
        model:"isnet_quint8",
        device:"cpu",
        output:{format:"image/png",type:"foreground"},
        progress:(name,done,total)=>{
          if(total>0&&Number.isFinite(done)){
            const pct=Math.round(done/total*100);
            if(pct>=0&&pct<=100)message("Preparing AI background remover: "+pct+"% ("+name+")");
          }
        }
      });
      if(!(blob instanceof Blob)||blob.size===0)throw Error("AI returned an empty image.");
      const url=URL.createObjectURL(blob);
      const img=await loadFromUrl(url);
      s.urls.push(url);s.current=img;s.currentBlob=blob;s.removed=true;s.settings.bg="transparent";
      sync();scheduleRender();
      $("format").value="image/png";
      message("Background removed. Export as PNG or WebP to keep transparency.");
    }catch(e){
      s.history.pop();
      console.error("FilePixa background removal error",e);
      message("Background removal could not run on this device or connection. "+(e.message||"Please retry while online.")+" Try a smaller photo or a desktop browser.",true);
    }finally{setBusy(false);sync();}
  }
  function canvasBlob(canvas,type,quality=.93) {
    return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error("Image export failed.")),type,quality));
  }
  async function download(){
    if(!s.file||s.busy)return;
    setBusy(true,"Preparing your image…");
    try{
      const type=$("format").value;
      const scale=Number($("scale").value)||1;
      const canvas=document.createElement("canvas");
      renderInto(canvas,s.current,false,scale,6000,type==="image/jpeg");
      const blob=await canvasBlob(canvas,type);
      const ext=type==="image/png"?"png":type==="image/jpeg"?"jpg":"webp";
      const stem=s.file.name.replace(/\.[^.]+$/,"").replace(/[^a-zA-Z0-9_\- .]/g,"_").slice(0,65)||"photo";
      const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=stem+"-filepixa."+ext;document.body.append(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),60000);
      message("Downloaded "+a.download+" · "+canvas.width+" × "+canvas.height+" px · "+humanSize(blob.size));
    }catch(e){message("Could not export photo: "+(e.message||e),true);}
    finally{setBusy(false);sync();}
  }
  function attach(){
    $("upload").addEventListener("change",e=>loadFile(e.target.files[0]));
    $("dropzone").addEventListener("click",()=>{if(!s.busy)$("upload").click();});
    $("dropzone").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();if(!s.busy)$("upload").click();}});
    const drop=$("dropzone");
    ["dragenter","dragover"].forEach(type=>drop.addEventListener(type,e=>{e.preventDefault();if(!s.busy)$("drop-overlay").classList.remove("hidden");}));
    ["dragleave","dragend"].forEach(type=>drop.addEventListener(type,e=>{e.preventDefault();$("drop-overlay").classList.add("hidden");}));
    drop.addEventListener("drop",e=>{e.preventDefault();$("drop-overlay").classList.add("hidden");if(!s.busy)loadFile(e.dataTransfer.files[0]);});
    $("compare").addEventListener("input",setCompare);
    $("undo").addEventListener("click",undo);
    $("reset").addEventListener("click",reset);
    $("remove-bg").addEventListener("click",removeBackground);
    $("auto-enhance").addEventListener("click",()=>modify({brightness:106,contrast:112,saturation:116,sharpen:22},"Auto enhancement applied. Fine-tune with the sliders."));
    $("fix-blur").addEventListener("click",()=>modify({sharpen:70,contrast:Math.max(s.settings.contrast,105)},"Sharpening applied. It can improve mild blur but not reconstruct missing detail."));
    for(const id of ["brightness","contrast","saturation","sharpen"]){
      const slider=$(id);
      slider.addEventListener("pointerdown",()=>{if(!s.busy)remember();});
      slider.addEventListener("keydown",e=>{if(["ArrowLeft","ArrowRight","Home","End","PageUp","PageDown"].includes(e.key))remember();});
      slider.addEventListener("input",()=>{
        s.settings[id]=Number(slider.value);
        $(id+"-val").textContent=slider.value+"%";
        scheduleRender();
      });
    }
    $("aspect").addEventListener("change",()=>modify({aspect:$("aspect").value},"Aspect ratio changed (centred crop)."));
    $("rotate-left").addEventListener("click",()=>modify({rotation:(s.settings.rotation+270)%360},"Rotated 90° left."));
    $("rotate-right").addEventListener("click",()=>modify({rotation:(s.settings.rotation+90)%360},"Rotated 90° right."));
    $("flip").addEventListener("click",()=>modify({flip:!s.settings.flip},"Horizontal flip applied."));
    document.querySelectorAll("[data-bg]").forEach(el=>el.addEventListener("click",()=>modify({bg:el.dataset.bg},"Background colour updated.")));
    $("custom-bg").addEventListener("input",e=>{if(!s.busy){s.settings.bg=e.target.value;sync();scheduleRender();}});
    $("custom-bg").addEventListener("change",e=>message("Custom background colour: "+e.target.value));
    $("download").addEventListener("click",download);
    window.addEventListener("beforeunload",()=>s.urls.forEach(url=>URL.revokeObjectURL(url)));
  }
  attach();sync();
})();