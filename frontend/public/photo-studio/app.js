'use strict';
/* PixelForge – client-side photo studio. No uploads, no dependencies. */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c;};
const clone=c=>{const n=mk(c.width,c.height);n.getContext('2d').drawImage(c,0,0);return n;};
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const tick=()=>new Promise(r=>setTimeout(r));
const S={img:null,orig:null,hist:[],redo:[],zoom:1,tab:'adjust',name:'photo',mask:null,crop:null,cancel:false,adj:{},comparing:false,logo:null,temp:null,hover:null,prev:null,batch:[]};
let lastYield=0;
async function maybeYield(){ if(performance.now()-lastYield>30){await tick();lastYield=performance.now();if(S.cancel)throw 'cancelled';} }
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),3200);}
const view=$('#view'),ov=$('#ov'),vctx=view.getContext('2d'),octx=ov.getContext('2d');
const val=id=>+$('#'+id).value, sv=id=>$('#'+id).value, chk=id=>$('#'+id).checked;

/* ---------- UI helpers ---------- */
const rng=(id,l,min,max,v,step=1)=>`<label class="r"><span>${l}</span><input type="range" id="${id}" min="${min}" max="${max}" value="${v}" step="${step}"><b id="${id}_v">${v}</b></label>`;
const opts=a=>a.map(x=>Array.isArray(x)?`<option value="${x[0]}">${x[1]}</option>`:`<option>${x}</option>`).join('');
async function task(msg,fn){
  $('#busyMsg').textContent=msg;setBar(0);$('#busy').hidden=false;S.cancel=false;lastYield=performance.now();await tick();
  try{await fn(setBar);}catch(e){if(e!=='cancelled'){toast(typeof e==='string'?e:'Error: '+(e&&e.message||e));if(e&&e.stack)console.error(e);}else toast('Cancelled');}
  finally{$('#busy').hidden=true;}
}
function setBar(p){$('#bar').style.width=Math.round(clamp(p,0,1)*100)+'%';}
$('#bCancel').onclick=()=>{S.cancel=true;};

/* ---------- Adjustments ---------- */
const ADJ=[['exposure','Exposure'],['brightness','Brightness'],['contrast','Contrast'],['highlights','Highlights'],['shadows','Shadows'],['temperature','Temperature'],['tint','Tint'],['saturation','Saturation'],['vibrance','Vibrance'],['hue','Hue',-180,180],['sepia','Sepia',0,100],['clarity','Clarity'],['sharpen','Sharpen',0,100],['blur','Blur',0,100],['vignette','Vignette'],['grain','Grain',0,100]];
const ZERO=Object.fromEntries(ADJ.map(a=>[a[0],0]));
const PRESETS={Original:{},Vivid:{saturation:30,contrast:15,vibrance:20},'B&W':{saturation:-100,contrast:20},Noir:{saturation:-100,contrast:45,vignette:40,grain:20},Warm:{temperature:30,tint:5,saturation:8},Cool:{temperature:-30,saturation:5},Vintage:{saturation:-25,temperature:25,sepia:25,vignette:35,grain:25,contrast:-10},Fade:{contrast:-25,brightness:12,saturation:-15},Dramatic:{contrast:35,clarity:50,saturation:-10,vignette:30,shadows:-20},Sepia:{sepia:100},'HDR':{shadows:50,highlights:-50,clarity:50,vibrance:30,contrast:10},Soft:{blur:8,brightness:6,contrast:-8}};
S.adj={...ZERO};
const isNeutral=P=>ADJ.every(a=>!P[a[0]]);
function blurRGBA(src,w,h,r){
  r=Math.round(r);if(r<1)return src.slice();
  let a=src.slice(),b=src.slice();const d=2*r+1;
  for(let it=0;it<3;it++){
    for(let y=0;y<h;y++){const row=y*w;for(let c=0;c<3;c++){let s=0;for(let i=-r;i<=r;i++)s+=a[(row+Math.min(w-1,Math.max(0,i)))*4+c];
      for(let x=0;x<w;x++){b[(row+x)*4+c]=s/d;s+=a[(row+Math.min(w-1,x+r+1))*4+c]-a[(row+Math.max(0,x-r))*4+c];}}}
    for(let x=0;x<w;x++){for(let c=0;c<3;c++){let s=0;for(let i=-r;i<=r;i++)s+=b[(Math.min(h-1,Math.max(0,i))*w+x)*4+c];
      for(let y=0;y<h;y++){a[(y*w+x)*4+c]=s/d;s+=b[(Math.min(h-1,y+r+1)*w+x)*4+c]-b[(Math.max(0,y-r)*w+x)*4+c];}}}
  }
  return a;
}
function unsharp(id,amt,r){
  const d=id.data,bl=blurRGBA(d,id.width,id.height,r);
  for(let i=0;i<d.length;i+=4){d[i]+=amt*(d[i]-bl[i]);d[i+1]+=amt*(d[i+1]-bl[i+1]);d[i+2]+=amt*(d[i+2]-bl[i+2]);}
}
function adjustPixels(id,P0,sc=1){
  const P={...ZERO,...P0},d=id.data,w=id.width,h=id.height;
  const ex=Math.pow(2,P.exposure/50),br=P.brightness/250,ct=1+P.contrast/100,tp=P.temperature/100*.18,tn=P.tint/100*.12,
    sat=1+P.saturation/100,vib=P.vibrance/100,sh=P.shadows/100*.35,hi=P.highlights/100*.35,sep=P.sepia/100;
  const an=P.hue*Math.PI/180,ca=Math.cos(an),sa=Math.sin(an);
  const m00=.213+ca*.787-sa*.213,m01=.715-ca*.715-sa*.715,m02=.072-ca*.072+sa*.928,
        m10=.213-ca*.213+sa*.143,m11=.715+ca*.285+sa*.140,m12=.072-ca*.072-sa*.283,
        m20=.213-ca*.213-sa*.787,m21=.715-ca*.715+sa*.715,m22=.072+ca*.928+sa*.072;
  const need=P.exposure||P.brightness||P.contrast||P.temperature||P.tint||P.saturation||P.vibrance||P.shadows||P.highlights||P.hue||P.sepia;
  if(need)for(let i=0;i<d.length;i+=4){
    let r=d[i]/255*ex,g=d[i+1]/255*ex,b=d[i+2]/255*ex;
    r+=br+tp+tn*.5;g+=br-tn;b+=br-tp+tn*.5;
    if(sh||hi){const l=clamp(.299*r+.587*g+.114*b,0,1),ad=sh*(1-l)*(1-l)+hi*l*l;r+=ad;g+=ad;b+=ad;}
    r=(r-.5)*ct+.5;g=(g-.5)*ct+.5;b=(b-.5)*ct+.5;
    if(P.hue){const r2=m00*r+m01*g+m02*b,g2=m10*r+m11*g+m12*b,b2=m20*r+m21*g+m22*b;r=r2;g=g2;b=b2;}
    if(sat!==1||vib){
      const l=.299*r+.587*g+.114*b,mx=Math.max(r,g,b),mn=Math.min(r,g,b),cs=mx>0?clamp((mx-mn)/mx,0,1):0,s=sat+vib*(1-cs);
      r=l+(r-l)*s;g=l+(g-l)*s;b=l+(b-l)*s;
    }
    if(sep){const sr=.393*r+.769*g+.189*b,sg=.349*r+.686*g+.168*b,sb=.272*r+.534*g+.131*b;r+=(sr-r)*sep;g+=(sg-g)*sep;b+=(sb-b)*sep;}
    d[i]=r*255;d[i+1]=g*255;d[i+2]=b*255;
  }
  if(P.blur>0){const bl=blurRGBA(d,w,h,Math.max(1,P.blur*.4*sc));for(let i=0;i<d.length;i++)d[i]=bl[i];}
  if(P.sharpen>0)unsharp(id,P.sharpen/40,Math.max(1,Math.round(1.2*sc)));
  if(P.clarity)unsharp(id,P.clarity/100*.8,Math.max(2,Math.round(Math.max(w,h)/55)));
  if(P.vignette||P.grain){
    const v=P.vignette/100,gr=P.grain*1.2;
    for(let y=0;y<h;y++){const dy=(y-h/2)/(h/2);for(let x=0;x<w;x++){
      const i=(y*w+x)*4,dx=(x-w/2)/(w/2),q=(dx*dx+dy*dy)/2;
      for(let c=0;c<3;c++){let t=d[i+c];
        if(v>0)t*=1-v*q;else if(v<0)t+=(255-t)*(-v)*q;
        if(gr)t+=(Math.random()-.5)*gr;d[i+c]=t;}
    }}
  }
  return id;
}
function adjPreview(){
  const w=S.img.width,h=S.img.height,sc=Math.min(1,1280/Math.max(w,h));
  if(!S.prev||S.prev.src!==S.img){const c=mk(w*sc,h*sc);c.getContext('2d').drawImage(S.img,0,0,c.width,c.height);
    S.prev={src:S.img,c,base:c.getContext('2d').getImageData(0,0,c.width,c.height)};}
  const b=S.prev.base,id=new ImageData(new Uint8ClampedArray(b.data),b.width,b.height);
  adjustPixels(id,S.adj,sc);S.prev.c.getContext('2d').putImageData(id,0,0);return S.prev.c;
}

/* ---------- Core state ---------- */
function commit(c){S.hist.push(S.img);if(S.hist.length>20)S.hist.shift();S.redo=[];S.img=c;afterChange();}
function beginEdit(){commit(clone(S.img));return S.img.getContext('2d');}
function afterChange(){
  if(!S.mask||S.mask.width!==S.img.width||S.mask.height!==S.img.height)S.mask=mk(S.img.width,S.img.height);
  if(S.crop&&(S.crop.x+S.crop.w>S.img.width||S.crop.y+S.crop.h>S.img.height))S.crop=null;
  if(S.tab==='crop'&&!S.crop)initCrop();
  syncResizeFields();render();
}
function undo(){if(!S.hist.length)return;S.redo.push(S.img);S.img=S.hist.pop();afterChange();}
function redo(){if(!S.redo.length)return;S.hist.push(S.img);S.img=S.redo.pop();afterChange();}
async function loadBlob(blob,name){
  let bmp;try{bmp=await createImageBitmap(blob);}catch(e){return toast('Could not read this image (try JPG/PNG/WebP).');}
  const c=mk(bmp.width,bmp.height);c.getContext('2d').drawImage(bmp,0,0);
  S.name=(name||'photo').replace(/\.[^.]+$/,'');S.img=c;S.orig=clone(c);S.hist=[];S.redo=[];S.crop=null;S.mask=mk(c.width,c.height);S.adj={...ZERO};resetAdjUI();
  $('#drop').hidden=true;fit();afterChange();if(S.tab==='crop')initCrop();
}
function fit(){
  if(!S.img)return;const sc=$('#scroll');S.zoom=Math.min(2,(sc.clientWidth-40)/S.img.width,(sc.clientHeight-40)/S.img.height);if(S.zoom<=0)S.zoom=1;
}
function setZoom(z){S.zoom=clamp(z,.05,16);render();}
function render(){
  if(!S.img)return;const w=S.img.width,h=S.img.height;
  if(view.width!==w||view.height!==h){view.width=w;view.height=h;ov.width=w;ov.height=h;}
  vctx.clearRect(0,0,w,h);
  if(S.comparing&&S.orig)vctx.drawImage(S.orig,0,0,w,h);
  else if(S.tab==='adjust'&&!isNeutral(S.adj))vctx.drawImage(adjPreview(),0,0,w,h);
  else vctx.drawImage(S.img,0,0);
  for(const c of [view,ov]){c.style.width=w*S.zoom+'px';c.style.height=h*S.zoom+'px';}
  drawOverlay();
  $('#info').textContent=`${w}×${h}px · ${(w*h/1e6).toFixed(1)}MP · ${Math.round(S.zoom*100)}%`;
  $('#bUndo').disabled=!S.hist.length;$('#bRedo').disabled=!S.redo.length;
}
let rafP=0;const schedule=()=>{if(rafP)return;rafP=requestAnimationFrame(()=>{rafP=0;render();});};

/* ---------- Panels ---------- */
const TABS=[['adjust','Adjust','🎚'],['enhance','AI Enhance','✨'],['resize','Resize','↔'],['crop','Crop','✂'],['draw','Draw','🖌'],['mark','Watermark','Ⓦ'],['remove','Remove WM','🧽'],['export','Export','⬇'],['batch','Batch','🗂']];
const FONTS=['Arial','Georgia','Times New Roman','Courier New','Verdana','Impact','Trebuchet MS','Comic Sans MS'];
const ASPECTS=[['free','Free'],['1','1:1'],['1.3333','4:3'],['1.5','3:2'],['1.7778','16:9'],['0.5625','9:16'],['0.8','4:5'],['orig','Original']];
const SIZES=[['','— preset —'],['1080x1080','Instagram square 1080²'],['1080x1350','Instagram portrait 1080×1350'],['1080x1920','Story / Reel 1080×1920'],['1920x1080','Full HD 1920×1080'],['3840x2160','4K 3840×2160'],['1280x720','HD 1280×720'],['1200x630','Facebook/OG 1200×630'],['1500x500','Twitter header 1500×500'],['827x1063','Passport 35×45mm @600dpi'],['800x800','Thumbnail 800²'],['512x512','Icon 512²'],['256x256','Icon 256²']];
const posBtns=()=>[...Array(9).keys()].map(i=>`<button data-pos="${i}" class="${i===8?'on':''}">${['↖','↑','↗','←','·','→','↙','↓','↘'][i]}</button>`).join('');
const PANES={
adjust:()=>`<h3>Adjust & Filters</h3><div class="chips" id="presets">${Object.keys(PRESETS).map(k=>`<button>${k}</button>`).join('')}</div><h4>Sliders</h4>${ADJ.map(a=>rng('a_'+a[0],a[1],a[2]??-100,a[3]??100,0)).join('')}
<div class="row"><button class="pri" id="adjApply">Apply</button><button id="adjReset">Reset</button></div><div class="note">Live preview; pixels change when you press Apply.</div>`,
enhance:()=>`<h3>AI Enhance</h3>
<button class="big pri" id="e_auto">✨ One-click auto enhance</button>
<button class="big" id="e_wb">Auto white balance</button>
<button class="big" id="e_low">Low-light fix</button>
<button class="big" id="e_hdr">HDR look</button>
<h4>Denoise</h4>${rng('e_dn','Strength',10,100,40)}<button class="big" id="e_denoise">Reduce noise (edge-preserving)</button>
<h4>Sharpen / deblur</h4>${rng('e_sh','Amount',10,300,100)}${rng('e_shr','Radius',1,8,2)}<button class="big" id="e_sharp">Sharpen</button>
<h4>Portrait</h4>${rng('e_sk','Smoothing',10,100,50)}<button class="big" id="e_skin">Skin smoothing</button>
<h4>Upscale</h4><div class="row"><select id="e_up">${opts([['2','2×'],['3','3×'],['4','4×']])}</select><button id="e_upgo" class="pri">Upscale + restore detail</button></div>
<div class="note">These are classical image-processing algorithms (levels, bilateral filter, bicubic + detail restore) that run locally. They are not generative neural networks, so they will not invent missing detail.</div>`,
resize:()=>`<h3>Resize</h3><div class="note" id="rOrig"></div>
<div class="row"><select id="r_pre">${opts(SIZES)}</select></div>
<div class="row"><label>W</label><input type="number" id="r_w" min="1"><label>H</label><input type="number" id="r_h" min="1"></div>
<div class="row"><label>%</label><input type="number" id="r_p" value="100" min="1"><label><input type="checkbox" id="r_lock" checked> Keep ratio</label></div>
<div class="row"><label>Preset fit</label><select id="r_fit">${opts([['stretch','Stretch'],['contain','Contain (pad)'],['cover','Cover (crop)']])}</select><input type="color" id="r_bg" value="#ffffff"></div>
<div class="row"><label><input type="checkbox" id="r_smooth" checked> Smooth resampling</label></div>
<button class="big pri" id="r_go">Apply resize</button>`,
crop:()=>`<h3>Crop / Rotate</h3><div class="hint">Drag the box or its handles on the image.</div>
<div class="row"><label>Aspect</label><select id="c_as">${opts(ASPECTS)}</select></div><div class="note" id="c_info"></div>
<div class="row"><button class="pri" id="c_go">Apply crop</button><button id="c_all">Select all</button></div>
<h4>Rotate & flip</h4><div class="row"><button id="t_l">⟲ 90°</button><button id="t_r">⟳ 90°</button><button id="t_h">⇋ Flip H</button><button id="t_v">⇅ Flip V</button></div>
<h4>Straighten</h4>${rng('t_ang','Angle°',-45,45,0,.5)}<div class="row"><label><input type="checkbox" id="t_auto" checked> Auto-crop corners</label></div><button class="big" id="t_go">Apply rotation</button>`,
draw:()=>`<h3>Draw & Text</h3><div class="chips" id="modes">${[['brush','Brush'],['blur','Blur brush'],['pixel','Pixelate'],['rect','Rectangle'],['ellipse','Ellipse'],['line','Line'],['text','Text']].map((m,i)=>`<button data-m="${m[0]}" class="${i?'':'on'}">${m[1]}</button>`).join('')}</div>
<h4>Style</h4><div class="row"><label>Color</label><input type="color" id="d_col" value="#ff3b30"><label><input type="checkbox" id="d_fill"> Fill shapes</label></div>
${rng('d_size','Size',1,300,12)}${rng('d_op','Opacity',5,100,100)}
<h4>Text</h4><div class="row"><input type="text" id="d_txt" value="Your text"></div>
<div class="row"><select id="d_font">${opts(FONTS)}</select><label><input type="checkbox" id="d_bold" checked> Bold</label></div>
${rng('d_fs','Font size',8,600,64)}${rng('d_stroke','Outline',0,20,0)}
<div class="note">Brush/blur/pixelate use “Size”. For text, click the photo to place it (top-left corner).</div>`,
mark:()=>`<h3>Add Watermark</h3><div class="row"><select id="w_kind">${opts([['text','Text'],['logo','Logo image']])}</select><button id="w_pick">Choose logo…</button></div>
<div class="row"><input type="text" id="w_txt" value="© My Photos"></div>
<div class="row"><label>Color</label><input type="color" id="w_col" value="#ffffff"><label><input type="checkbox" id="w_tile"> Tile</label></div>
${rng('w_size','Size %',2,80,20)}${rng('w_op','Opacity',5,100,50)}${rng('w_rot','Rotate°',-90,90,0)}${rng('w_mar','Margin %',0,15,3)}
<h4>Position</h4><div class="pos" id="w_pos">${posBtns()}</div><br><button class="big pri" id="w_go">Stamp onto photo</button>`,
remove:()=>`<h3>Remove Watermark / Object</h3><div class="hint">1) Mark the watermark 2) press <b>Remove</b>. Works best on text and logos over textured or smooth backgrounds.</div>
<div class="chips" id="rmodes">${[['brush','Brush'],['rect','Rectangle'],['wand','Magic wand'],['detect','Auto-detect in box']].map((m,i)=>`<button data-m="${m[0]}" class="${i?'':'on'}">${m[1]}</button>`).join('')}</div>
${rng('m_size','Brush size',2,300,24)}${rng('m_tol','Wand tolerance',1,100,25)}${rng('m_thr','Detect sensitivity',4,80,22)}
<div class="row"><label><input type="checkbox" id="m_glob"> Wand: whole image</label></div>
<div class="row"><label>Grow</label><input type="number" id="m_grow" value="3" min="0" max="30"><button id="m_growgo">Grow mask</button><button id="m_clear">Clear</button></div>
<h4>Fill method</h4><div class="row"><select id="m_mode">${opts([['patch','Texture (patch-based)'],['smooth','Smooth (flat areas)']])}</select></div>
${rng('m_ph','Patch size',2,8,4)}${rng('m_samples','Search effort',60,600,220)}
<button class="big pri" id="m_go">🧽 Remove selected</button>
<div class="note">Exemplar-based inpainting runs locally. It copies real texture from around the mark. It is not a generative model, so very large or detailed regions may show repetition. Only remove marks from images you own or have the right to edit.</div>`,
export:()=>`<h3>Export</h3><div class="row"><label>Format</label><select id="x_fmt">${opts([['jpeg','JPEG'],['png','PNG'],['webp','WebP']])}</select></div>
${rng('x_q','Quality',5,100,90)}<div class="row"><label>Max size KB</label><input type="number" id="x_kb" placeholder="optional (JPEG/WebP)"></div>
<div class="row"><label>File name</label><input type="text" id="x_name"></div>
<button class="big pri" id="x_dl">⬇ Download</button><button class="big" id="x_copy">Copy to clipboard</button><div class="note" id="x_info"></div>`,
batch:()=>`<h3>Batch Resize</h3><button class="big" id="b_pick">Choose photos…</button><div class="note" id="b_list">No files chosen.</div>
<div class="row"><label>Mode</label><select id="b_mode">${opts([['long','Longest side (px)'],['w','Width (px)'],['h','Height (px)'],['pct','Percent']])}</select><input type="number" id="b_val" value="1600"></div>
<div class="row"><label>Format</label><select id="b_fmt">${opts([['jpeg','JPEG'],['png','PNG'],['webp','WebP']])}</select></div>${rng('b_q','Quality',5,100,88)}
<div class="row"><label><input type="checkbox" id="b_enh"> Auto-enhance each</label></div>
<button class="big pri" id="b_go">Process & download ZIP</button>`
};
function buildUI(){
  $('#rail').innerHTML=TABS.map(t=>`<button data-t="${t[0]}"><span>${t[2]}</span>${t[1]}</button>`).join('');
  $('#panel').innerHTML=TABS.map(t=>`<div class="pane" id="p_${t[0]}">${PANES[t[0]]()}</div>`).join('');
  $$('#rail button').forEach(b=>b.onclick=()=>setTab(b.dataset.t));
  $('#panel').addEventListener('input',e=>{const t=e.target;if(t.type==='range'){const o=$('#'+t.id+'_v');if(o)o.textContent=t.value;}if(t.id.startsWith('a_')){S.adj[t.id.slice(2)]=+t.value;schedule();}});
  setTab('adjust');wire();
}
function setTab(t){
  S.tab=t;$$('#rail button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));$$('.pane').forEach(p=>p.classList.toggle('on',p.id==='p_'+t));
  S.temp=null;if(t==='crop'&&S.img&&!S.crop)initCrop();
  if(t==='export')updateExportInfo();
  if(t==='draw'||t==='remove'){const id=t==='draw'?'d_size':'m_size';if(S.img&&!S.sizeSet){const v=Math.max(8,Math.round(Math.max(S.img.width,S.img.height)/70));$('#d_size').value=$('#m_size').value=v;$('#d_size_v').textContent=$('#m_size_v').textContent=v;S.sizeSet=true;}}
  if(S.img)render();
}
function resetAdjUI(){ADJ.forEach(a=>{const e=$('#a_'+a[0]);if(e){e.value=0;$('#a_'+a[0]+'_v').textContent=0;}});}
function setAdj(P){S.adj={...ZERO,...P};ADJ.forEach(a=>{$('#a_'+a[0]).value=S.adj[a[0]];$('#a_'+a[0]+'_v').textContent=S.adj[a[0]];});render();}
const needImg=()=>{if(!S.img){toast('Open a photo first');return false;}return true;};

/* ---------- Pixel ops ---------- */
function getID(c){return c.getContext('2d').getImageData(0,0,c.width,c.height);}
function applyID(id){const c=mk(id.width,id.height);c.getContext('2d').putImageData(id,0,0);commit(c);}
function resizeTo(src,w,h,smooth=true){
  w=Math.max(1,Math.round(w));h=Math.max(1,Math.round(h));
  if(!smooth){const c=mk(w,h),x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(src,0,0,w,h);return c;}
  let cur=src,cw=src.width,ch=src.height;
  while(cw/2>=w&&ch/2>=h){const nw=Math.ceil(cw/2),nh=Math.ceil(ch/2),c=mk(nw,nh),x=c.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(cur,0,0,nw,nh);cur=c;cw=nw;ch=nh;}
  const c=mk(w,h),x=c.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(cur,0,0,w,h);return c;
}
function fitResize(src,tw,th,mode,bg,smooth){
  if(mode==='stretch')return resizeTo(src,tw,th,smooth);
  const sw=src.width,sh=src.height,sc=mode==='contain'?Math.min(tw/sw,th/sh):Math.max(tw/sw,th/sh);
  const iw=Math.round(sw*sc),ih=Math.round(sh*sc),r=resizeTo(src,iw,ih,smooth),c=mk(tw,th),x=c.getContext('2d');
  if(bg&&mode==='contain'){x.fillStyle=bg;x.fillRect(0,0,tw,th);}
  x.drawImage(r,Math.round((tw-iw)/2),Math.round((th-ih)/2));return c;
}
async function bilateral(id,radius,sigR,prog){
  const w=id.width,h=id.height,s=id.data,o=new Uint8ClampedArray(s.length),k=radius*2+1,sw=new Float32Array(k*k),sg=radius*.8+.4;
  for(let y=-radius;y<=radius;y++)for(let x=-radius;x<=radius;x++)sw[(y+radius)*k+x+radius]=Math.exp(-(x*x+y*y)/(2*sg*sg));
  const lut=new Float32Array(766);for(let i=0;i<766;i++){const t=i/3;lut[i]=Math.exp(-t*t/(2*sigR*sigR));}
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const i=(y*w+x)*4,r0=s[i],g0=s[i+1],b0=s[i+2];let r=0,g=0,b=0,ws=0;
      for(let dy=-radius;dy<=radius;dy++){const yy=y+dy;if(yy<0||yy>=h)continue;
        for(let dx=-radius;dx<=radius;dx++){const xx=x+dx;if(xx<0||xx>=w)continue;
          const j=(yy*w+xx)*4,sad=Math.abs(s[j]-r0)+Math.abs(s[j+1]-g0)+Math.abs(s[j+2]-b0),wt=sw[(dy+radius)*k+dx+radius]*lut[sad];
          r+=s[j]*wt;g+=s[j+1]*wt;b+=s[j+2]*wt;ws+=wt;}}
      o[i]=r/ws;o[i+1]=g/ws;o[i+2]=b/ws;o[i+3]=s[i+3];
    }
    if(y%8===0){await maybeYield();if(prog)prog(y/h);}
  }
  return o;
}
function autoLevels(id,strength=.85){
  const d=id.data,hist=[new Uint32Array(256),new Uint32Array(256),new Uint32Array(256)],n=d.length/4;
  for(let i=0;i<d.length;i+=4){hist[0][d[i]]++;hist[1][d[i+1]]++;hist[2][d[i+2]]++;}
  const lo=[],hi=[];
  for(let c=0;c<3;c++){let a=0,l=0,h=255;for(l=0;l<255;l++){a+=hist[c][l];if(a>n*.005)break;}a=0;for(h=255;h>0;h--){a+=hist[c][h];if(a>n*.005)break;}lo[c]=l;hi[c]=Math.max(h,l+8);}
  // use a shared range partly so colour casts are not over-corrected
  const L=Math.min(...lo),H=Math.max(...hi);
  const lut=[0,1,2].map(c=>{const a=lo[c]*.5+L*.5,b=hi[c]*.5+H*.5,t=new Float32Array(256);for(let x=0;x<256;x++){const v=clamp((x-a)/(b-a),0,1);t[x]=(x/255)*(1-strength)+v*strength;}return t;});
  let m=0;for(let i=0;i<d.length;i+=4)m+=.299*lut[0][d[i]]+.587*lut[1][d[i+1]]+.114*lut[2][d[i+2]];m/=n;
  const gm=clamp(Math.log(.47)/Math.log(Math.max(.02,m)),.7,1.5);
  for(let i=0;i<d.length;i+=4){d[i]=255*Math.pow(lut[0][d[i]],gm);d[i+1]=255*Math.pow(lut[1][d[i+1]],gm);d[i+2]=255*Math.pow(lut[2][d[i+2]],gm);}
}
function grayWorld(id,amt=.7){
  const d=id.data;let r=0,g=0,b=0,n=d.length/4;for(let i=0;i<d.length;i+=4){r+=d[i];g+=d[i+1];b+=d[i+2];}
  r/=n;g/=n;b/=n;const m=(r+g+b)/3,kr=1+(m/r-1)*amt,kg=1+(m/g-1)*amt,kb=1+(m/b-1)*amt;
  for(let i=0;i<d.length;i+=4){d[i]*=kr;d[i+1]*=kg;d[i+2]*=kb;}
}
function enhanceAuto(id){autoLevels(id);adjustPixels(id,{vibrance:22,saturation:6,clarity:22,sharpen:22},1);}
async function upscale(src,f){
  const steps=f===4?[2,2]:[f];let cur=src;
  for(const s of steps){
    if(cur.width*s*cur.height*s>120e6)throw 'Result would be too large (limit ≈120 MP).';
    const c=resizeTo(cur,cur.width*s,cur.height*s);const id=getID(c);
    unsharp(id,.55,1.2+s*.3);c.getContext('2d').putImageData(id,0,0);cur=c;await tick();
  }
  return cur;
}
async function skinSmooth(id,strength,prog){
  const d=id.data,sm=await bilateral(id,3,18+strength*.4,prog),a=strength/100*.85;
  for(let i=0;i<d.length;i+=4){
    const r=d[i],g=d[i+1],b=d[i+2],Y=.299*r+.587*g+.114*b,cb=128-.1687*r-.3313*g+.5*b,cr=128+.5*r-.4187*g-.0813*b;
    if(cb>77&&cb<127&&cr>133&&cr<173&&Y>40){d[i]=r+(sm[i]-r)*a;d[i+1]=g+(sm[i+1]-g)*a;d[i+2]=b+(sm[i+2]-b)*a;}
  }
}
function rotatedRect(w,h,a){
  a=Math.abs(a)%Math.PI;if(a>Math.PI/2)a=Math.PI-a;const s=Math.sin(a),c=Math.cos(a);if(a<1e-6)return[w,h];
  const wl=w>=h,L=wl?w:h,Sh=wl?h:w;let wr,hr;
  if(Sh<=2*s*c*L||Math.abs(s-c)<1e-10){const x=.5*Sh;wr=wl?x/s:x/c;hr=wl?x/c:x/s;}
  else{const c2=c*c-s*s;wr=(w*c-h*s)/c2;hr=(h*c-w*s)/c2;}
  return[wr,hr];
}
function rotateCanvas(src,deg,autoCrop){
  const a=deg*Math.PI/180,w=src.width,h=src.height,cs=Math.abs(Math.cos(a)),sn=Math.abs(Math.sin(a));
  const nw=Math.ceil(w*cs+h*sn),nh=Math.ceil(w*sn+h*cs),c=mk(nw,nh),x=c.getContext('2d');
  x.translate(nw/2,nh/2);x.rotate(a);x.imageSmoothingQuality='high';x.drawImage(src,-w/2,-h/2);
  if(!autoCrop)return c;
  const[rw,rh]=rotatedRect(w,h,a),cw=Math.floor(rw),ch=Math.floor(rh),o=mk(cw,ch);
  o.getContext('2d').drawImage(c,(nw-cw)/2,(nh-ch)/2,cw,ch,0,0,cw,ch);return o;
}
function flipRot(kind){
  const s=S.img,w=s.width,h=s.height;let c,x;
  if(kind==='h'||kind==='v'){c=mk(w,h);x=c.getContext('2d');if(kind==='h'){x.translate(w,0);x.scale(-1,1);}else{x.translate(0,h);x.scale(1,-1);}x.drawImage(s,0,0);}
  else{c=mk(h,w);x=c.getContext('2d');x.translate(h/2,w/2);x.rotate(kind==='r'?Math.PI/2:-Math.PI/2);x.drawImage(s,-w/2,-h/2);}
  commit(c);
}

/* ---------- Watermark stamping ---------- */
function stampCanvas(W,o){
  if(o.kind==='logo'){if(!S.logo)throw 'Choose a logo image first.';const lw=Math.max(8,W*o.size/100),lh=lw*S.logo.height/S.logo.width,c=mk(lw,lh);c.getContext('2d').drawImage(S.logo,0,0,lw,lh);return c;}
  const fs=Math.max(8,W*o.size/100/Math.max(4,o.text.length)*2.2),t=mk(10,10).getContext('2d');t.font=`bold ${fs}px Arial`;
  const m=t.measureText(o.text).width,c=mk(m+fs*.6,fs*1.5),x=c.getContext('2d');
  x.font=`bold ${fs}px Arial`;x.textBaseline='middle';x.fillStyle=o.color;x.shadowColor='rgba(0,0,0,.45)';x.shadowBlur=fs*.08;x.shadowOffsetY=fs*.03;x.fillText(o.text,fs*.3,c.height/2);return c;
}
function stamp(ctx,W,H,o){
  const sc=stampCanvas(W,o),rot=o.rot*Math.PI/180;ctx.save();ctx.globalAlpha=o.op/100;
  if(o.tile){
    ctx.translate(W/2,H/2);ctx.rotate(rot);const span=Math.hypot(W,H),sx=sc.width*1.5,sy=sc.height*2.2;let row=0;
    for(let y=-span;y<span;y+=sy,row++)for(let x=-span+(row%2?sx/2:0);x<span;x+=sx)ctx.drawImage(sc,x,y);
  }else{
    const mg=W*o.mar/100,col=o.pos%3,rw=Math.floor(o.pos/3);
    const x=col===0?mg:col===1?(W-sc.width)/2:W-sc.width-mg,y=rw===0?mg:rw===1?(H-sc.height)/2:H-sc.height-mg;
    ctx.translate(x+sc.width/2,y+sc.height/2);ctx.rotate(rot);ctx.drawImage(sc,-sc.width/2,-sc.height/2);
  }
  ctx.restore();
}

/* ---------- Inpainting (watermark removal) ---------- */
async function inpaint(canvas,maskCanvas,o,prog){
  const W=canvas.width,H=canvas.height,md=maskCanvas.getContext('2d').getImageData(0,0,W,H).data;
  let x0=W,y0=H,x1=-1,y1=-1;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(md[(y*W+x)*4+3]>20){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
  if(x1<0)throw 'Mark the watermark first (brush, rectangle, wand or auto-detect).';
  const ph=o.ph,M=Math.max(30,Math.round(Math.max(x1-x0,y1-y0)*.7)+ph*2+4);
  const rx=Math.max(0,x0-M),ry=Math.max(0,y0-M),w=Math.min(W,x1+M+1)-rx,h=Math.min(H,y1+M+1)-ry;
  const ctx=canvas.getContext('2d'),im=ctx.getImageData(rx,ry,w,h),px=im.data,known=new Uint8Array(w*h);let unk=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const a=md[((ry+y)*W+rx+x)*4+3]>20;known[y*w+x]=a?0:1;if(a)unk++;}
  const total=unk,N8=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]];
  const ringOf=()=>{const ring=[];for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x;if(known[i])continue;let kn=0;
    for(const[dx,dy]of N8){const xx=x+dx,yy=y+dy;if(xx>=0&&yy>=0&&xx<w&&yy<h)kn+=known[yy*w+xx];}if(kn)ring.push([i,kn]);}return ring;};
  if(o.mode==='smooth'){
    const f=new Float32Array(w*h*3);for(let i=0;i<w*h;i++){f[i*3]=px[i*4];f[i*3+1]=px[i*4+1];f[i*3+2]=px[i*4+2];}
    const hole=[];
    while(unk>0){
      const ring=ringOf();if(!ring.length)break;
      for(const[i]of ring){const x=i%w,y=(i/w)|0;let r=0,g=0,b=0,n=0;
        for(const[dx,dy]of N8){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=w||yy>=h)continue;const j=yy*w+xx;if(known[j]){r+=f[j*3];g+=f[j*3+1];b+=f[j*3+2];n++;}}
        f[i*3]=r/n;f[i*3+1]=g/n;f[i*3+2]=b/n;}
      for(const[i]of ring){known[i]=1;hole.push(i);unk--;}
      await maybeYield();prog&&prog(.5*(1-unk/total));
    }
    for(let it=0;it<60;it++){
      for(const i of hole){const x=i%w,y=(i/w)|0;let r=0,g=0,b=0,n=0;
        for(const[dx,dy]of[[0,-1],[-1,0],[1,0],[0,1]]){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=w||yy>=h)continue;const j=yy*w+xx;r+=f[j*3];g+=f[j*3+1];b+=f[j*3+2];n++;}
        f[i*3]=r/n;f[i*3+1]=g/n;f[i*3+2]=b/n;}
      if(it%6===0){await maybeYield();prog&&prog(.5+.5*it/60);}
    }
    for(const i of hole){px[i*4]=f[i*3];px[i*4+1]=f[i*3+1];px[i*4+2]=f[i*3+2];}
    ctx.putImageData(im,rx,ry);return;
  }
  // --- patch-based (exemplar) fill with PatchMatch-style propagation ---
  const S1=new Int32Array((w+1)*(h+1));
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)S1[(y+1)*(w+1)+x+1]=S1[y*(w+1)+x+1]+S1[(y+1)*(w+1)+x]-S1[y*(w+1)+x]+(known[y*w+x]?0:1);
  const cand=[];
  for(let y=ph;y<h-ph;y++)for(let x=ph;x<w-ph;x++){const a=x-ph,b=y-ph,c=x+ph+1,d=y+ph+1;
    if(S1[d*(w+1)+c]-S1[b*(w+1)+c]-S1[d*(w+1)+a]+S1[b*(w+1)+a]===0)cand.push(y*w+x);}
  if(cand.length<10)throw 'Not enough clean background around the mark. Try the “Smooth” method or a smaller selection.';
  const valid=new Uint8Array(w*h);for(const c of cand)valid[c]=1;
  const srcIdx=new Int32Array(w*h).fill(-1),side=ph*2+1,E=new Int32Array(side*side),ER=new Float32Array(side*side),EG=new Float32Array(side*side),EB=new Float32Array(side*side);
  let ne=0,best=0,bestC=-1;
  const test=c=>{let s=0;for(let k=0;k<ne;k++){const q=(c+E[k])*4,dr=px[q]-ER[k],dg=px[q+1]-EG[k],db=px[q+2]-EB[k];s+=dr*dr+dg*dg+db*db;if(s>=best)return;}best=s;bestC=c;};
  let done=0;
  while(unk>0){
    const ring=ringOf();if(!ring.length)break;ring.sort((a,b)=>b[1]-a[1]);
    for(const[i]of ring){
      const x=i%w,y=(i/w)|0;ne=0;
      for(let dy=-ph;dy<=ph;dy++){const yy=y+dy;if(yy<0||yy>=h)continue;for(let dx=-ph;dx<=ph;dx++){const xx=x+dx;if(xx<0||xx>=w)continue;const j=yy*w+xx;if(!known[j])continue;
        E[ne]=dy*w+dx;ER[ne]=px[j*4];EG[ne]=px[j*4+1];EB[ne]=px[j*4+2];ne++;}}
      best=Infinity;bestC=-1;
      for(const[dx,dy]of N8){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=w||yy>=h)continue;const n=yy*w+xx;if(srcIdx[n]>=0){const c=srcIdx[n]-(dy*w+dx);if(c>=0&&c<w*h&&valid[c])test(c);}}
      for(let s=0;s<o.samples;s++)test(cand[(Math.random()*cand.length)|0]);
      if(bestC<0)bestC=cand[0];
      px[i*4]=px[bestC*4];px[i*4+1]=px[bestC*4+1];px[i*4+2]=px[bestC*4+2];srcIdx[i]=bestC;known[i]=1;unk--;done++;
      if(done%40===0){await maybeYield();prog&&prog(1-unk/total);}
    }
  }
  ctx.putImageData(im,rx,ry);
}
function maskBounds(){const W=S.mask.width,H=S.mask.height,d=S.mask.getContext('2d').getImageData(0,0,W,H).data;let x0=W,y0=H,x1=-1,y1=-1;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(d[(y*W+x)*4+3]>20){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}return x1<0?null:{x0,y0,x1,y1};}
function growMask(r){
  const b=maskBounds();if(!b||r<1)return;const W=S.mask.width,H=S.mask.height,mc=S.mask.getContext('2d');
  const X0=Math.max(0,b.x0-r),Y0=Math.max(0,b.y0-r),w=Math.min(W,b.x1+r+1)-X0,h=Math.min(H,b.y1+r+1)-Y0,im=mc.getImageData(X0,Y0,w,h),d=im.data;
  let a=new Uint8Array(w*h),t=new Uint8Array(w*h);for(let i=0;i<w*h;i++)a[i]=d[i*4+3]>20?1:0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){let v=0;for(let k=Math.max(0,x-r);k<=Math.min(w-1,x+r)&&!v;k++)v=a[y*w+k];t[y*w+x]=v;}
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){let v=0;for(let k=Math.max(0,y-r);k<=Math.min(h-1,y+r)&&!v;k++)v=t[k*w+x];a[y*w+x]=v;}
  for(let i=0;i<w*h;i++)if(a[i]){d[i*4]=255;d[i*4+1]=40;d[i*4+2]=40;d[i*4+3]=150;}
  mc.putImageData(im,X0,Y0);drawOverlay();
}
function wand(p){
  const W=S.img.width,H=S.img.height,d=getID(S.img).data,x=clamp(Math.floor(p.x),0,W-1),y=clamp(Math.floor(p.y),0,H-1),i0=(y*W+x)*4,r0=d[i0],g0=d[i0+1],b0=d[i0+2],th=val('m_tol')*3;
  const ok=i=>Math.abs(d[i]-r0)+Math.abs(d[i+1]-g0)+Math.abs(d[i+2]-b0)<=th;
  const mc=S.mask.getContext('2d'),mi=mc.getImageData(0,0,W,H),m=mi.data,set=i=>{m[i]=255;m[i+1]=40;m[i+2]=40;m[i+3]=150;};
  if(chk('m_glob')){for(let i=0;i<d.length;i+=4)if(ok(i))set(i);}
  else{const seen=new Uint8Array(W*H),st=[y*W+x];seen[y*W+x]=1;
    while(st.length){const q=st.pop(),qx=q%W,qy=(q/W)|0;if(!ok(q*4))continue;set(q*4);
      if(qx>0&&!seen[q-1]){seen[q-1]=1;st.push(q-1);}if(qx<W-1&&!seen[q+1]){seen[q+1]=1;st.push(q+1);}
      if(qy>0&&!seen[q-W]){seen[q-W]=1;st.push(q-W);}if(qy<H-1&&!seen[q+W]){seen[q+W]=1;st.push(q+W);}}}
  mc.putImageData(mi,0,0);growMask(val('m_grow'));
}
function detectIn(r){
  const x=Math.round(r.x),y=Math.round(r.y),w=Math.round(r.w),h=Math.round(r.h);if(w<4||h<4)return;
  const im=S.img.getContext('2d').getImageData(x,y,w,h),d=im.data,bg=blurRGBA(d,w,h,Math.max(5,Math.min(w,h)/6)),thr=val('m_thr');
  const mc=S.mask.getContext('2d'),mi=mc.getImageData(x,y,w,h),m=mi.data;let n=0;
  for(let i=0;i<d.length;i+=4){const l=.299*d[i]+.587*d[i+1]+.114*d[i+2],lb=.299*bg[i]+.587*bg[i+1]+.114*bg[i+2];
    if(Math.abs(l-lb)>thr){m[i]=255;m[i+1]=40;m[i+2]=40;m[i+3]=150;n++;}}
  mc.putImageData(mi,x,y);growMask(Math.max(1,val('m_grow')));toast(n?`Detected ${n} px — refine with brush/clear if needed`:'Nothing detected: raise sensitivity or use brush/wand');
}

/* ---------- Crop ---------- */
function initCrop(){if(S.img)S.crop={x:0,y:0,w:S.img.width,h:S.img.height};updCropInfo();}
function updCropInfo(){const e=$('#c_info');if(e&&S.crop)e.textContent=`Selection: ${Math.round(S.crop.w)} × ${Math.round(S.crop.h)} px`;}
function cropRatio(){const v=sv('c_as');return v==='free'?0:v==='orig'?S.img.width/S.img.height:+v;}
function setCropRatio(){
  const r=cropRatio();if(!r||!S.crop)return;const c=S.crop,cx=c.x+c.w/2,cy=c.y+c.h/2;let w=c.w,h=w/r;if(h>c.h){h=c.h;w=h*r;}
  S.crop={x:cx-w/2,y:cy-h/2,w,h};updCropInfo();drawOverlay();
}

/* ---------- Overlay & pointer tools ---------- */
function drawOverlay(){
  if(!S.img)return;const W=ov.width,H=ov.height;octx.clearRect(0,0,W,H);
  if(S.tab==='remove'&&S.mask)octx.drawImage(S.mask,0,0);
  if(S.tab==='crop'&&S.crop){
    const c=S.crop,z=1/S.zoom;octx.fillStyle='rgba(0,0,0,.55)';
    octx.fillRect(0,0,W,c.y);octx.fillRect(0,c.y+c.h,W,H-c.y-c.h);octx.fillRect(0,c.y,c.x,c.h);octx.fillRect(c.x+c.w,c.y,W-c.x-c.w,c.h);
    octx.strokeStyle='#fff';octx.lineWidth=2*z;octx.strokeRect(c.x,c.y,c.w,c.h);octx.lineWidth=z;octx.strokeStyle='rgba(255,255,255,.4)';
    for(let i=1;i<3;i++){octx.beginPath();octx.moveTo(c.x+c.w*i/3,c.y);octx.lineTo(c.x+c.w*i/3,c.y+c.h);octx.moveTo(c.x,c.y+c.h*i/3);octx.lineTo(c.x+c.w,c.y+c.h*i/3);octx.stroke();}
    octx.fillStyle='#fff';const s=10*z;for(const[hx,hy]of[[0,0],[.5,0],[1,0],[0,.5],[1,.5],[0,1],[.5,1],[1,1]])octx.fillRect(c.x+c.w*hx-s/2,c.y+c.h*hy-s/2,s,s);
  }
  if(S.temp)S.temp(octx);
  const m=S.tab==='draw'?sv_mode('modes'):S.tab==='remove'?sv_mode('rmodes'):'';
  if(S.hover&&((S.tab==='draw'&&['brush','blur','pixel'].includes(m))||(S.tab==='remove'&&m==='brush'))){
    octx.strokeStyle='#fff';octx.lineWidth=1.5/S.zoom;octx.beginPath();octx.arc(S.hover.x,S.hover.y,val(S.tab==='draw'?'d_size':'m_size')/2,0,7);octx.stroke();
  }
}
const sv_mode=g=>{const b=$('#'+g+' .on');return b?b.dataset.m:'';};
function pt(e){const r=ov.getBoundingClientRect();return{x:(e.clientX-r.left)*ov.width/r.width,y:(e.clientY-r.top)*ov.height/r.height};}
let drag=null;
function strokePts(a,b,step,fn){const d=Math.hypot(b.x-a.x,b.y-a.y),n=Math.max(1,Math.ceil(d/step));for(let i=1;i<=n;i++)fn({x:a.x+(b.x-a.x)*i/n,y:a.y+(b.y-a.y)*i/n});}
function maskStroke(a,b){const c=S.mask.getContext('2d');c.strokeStyle='rgba(255,40,40,.6)';c.fillStyle='rgba(255,40,40,.6)';c.lineCap='round';c.lineJoin='round';c.lineWidth=val('m_size');c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();c.beginPath();c.arc(b.x,b.y,val('m_size')/2,0,7);c.fill();}
function normRect(a,b){return{x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),w:Math.abs(a.x-b.x),h:Math.abs(a.y-b.y)};}
function rgba(hex,a){const n=parseInt(hex.slice(1),16);return`rgba(${n>>16},${n>>8&255},${n&255},${a})`;}
function drawShape(ctx,m,a,b){
  ctx.save();ctx.globalAlpha=val('d_op')/100;ctx.strokeStyle=ctx.fillStyle=sv('d_col');ctx.lineWidth=Math.max(1,val('d_size')/4);ctx.lineCap='round';
  const r=normRect(a,b);ctx.beginPath();
  if(m==='rect')ctx.rect(r.x,r.y,r.w,r.h);else if(m==='ellipse')ctx.ellipse(r.x+r.w/2,r.y+r.h/2,r.w/2,r.h/2,0,0,7);else{ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);}
  if(m!=='line'&&chk('d_fill'))ctx.fill();else ctx.stroke();ctx.restore();
}
function drawText(p){
  const ctx=beginEdit(),fs=val('d_fs');ctx.save();ctx.globalAlpha=val('d_op')/100;ctx.font=`${chk('d_bold')?'bold ':''}${fs}px ${sv('d_font')}`;ctx.textBaseline='top';ctx.fillStyle=sv('d_col');
  sv('d_txt').split('\n').forEach((ln,i)=>{if(val('d_stroke')){ctx.lineWidth=val('d_stroke');ctx.strokeStyle='#000';ctx.lineJoin='round';ctx.strokeText(ln,p.x,p.y+i*fs*1.2);}ctx.fillText(ln,p.x,p.y+i*fs*1.2);});
  ctx.restore();afterChange();
}
ov.addEventListener('pointerdown',e=>{
  if(!S.img||e.button>0)return;ov.setPointerCapture(e.pointerId);const p=pt(e);drag={p0:p,last:p};
  if(S.tab==='crop'){
    const c=S.crop,r=14/S.zoom,nl=Math.abs(p.x-c.x)<r,nr=Math.abs(p.x-c.x-c.w)<r,nt=Math.abs(p.y-c.y)<r,nb=Math.abs(p.y-c.y-c.h)<r,inX=p.x>c.x-r&&p.x<c.x+c.w+r,inY=p.y>c.y-r&&p.y<c.y+c.h+r;
    let mode='';if(inY&&inX){mode=(nt?'t':nb?'b':'')+(nl?'l':nr?'r':'');if(!mode&&p.x>c.x&&p.x<c.x+c.w&&p.y>c.y&&p.y<c.y+c.h)mode='move';}
    if(!mode){S.crop={x:p.x,y:p.y,w:1,h:1};mode='br';}
    drag.mode=mode;drag.orig={...S.crop};
  }else if(S.tab==='draw'){
    const m=sv_mode('modes');drag.m=m;
    if(m==='text'){drawText(p);drag=null;return;}
    if(m==='brush'){drag.base=clone(S.img);drag.layer=mk(S.img.width,S.img.height);commit(clone(S.img));}
    if(m==='blur'||m==='pixel'){
      const w=S.img.width,h=S.img.height,sz=Math.max(2,val('d_size')/2);
      if(m==='blur'){const id=getID(S.img);id.data.set(blurRGBA(id.data,w,h,Math.max(2,sz/2)));drag.fx=mk(w,h);drag.fx.getContext('2d').putImageData(id,0,0);}
      else{const b=Math.max(3,Math.round(sz/2)),sm=mk(w/b,h/b);sm.getContext('2d').drawImage(S.img,0,0,sm.width,sm.height);drag.fx=mk(w,h);const x=drag.fx.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(sm,0,0,w,h);}
      commit(clone(S.img));
    }
    if(m==='brush'||m==='blur'||m==='pixel')drawStroke(p,p);
  }else if(S.tab==='remove'){
    const m=sv_mode('rmodes');drag.m=m;if(m==='brush'){maskStroke(p,p);drawOverlay();}if(m==='wand'){wand(p);drag=null;}
  }
});
function drawStroke(a,b){
  const m=drag.m,ctx=S.img.getContext('2d'),r=val('d_size')/2;
  if(m==='brush'){const l=drag.layer.getContext('2d');l.strokeStyle=l.fillStyle=sv('d_col');l.lineCap='round';l.lineWidth=r*2;l.beginPath();l.moveTo(a.x,a.y);l.lineTo(b.x,b.y);l.stroke();l.beginPath();l.arc(b.x,b.y,r,0,7);l.fill();
    ctx.clearRect(0,0,S.img.width,S.img.height);ctx.drawImage(drag.base,0,0);ctx.globalAlpha=val('d_op')/100;ctx.drawImage(drag.layer,0,0);ctx.globalAlpha=1;}
  else strokePts(a,b,Math.max(1,r/3),q=>{ctx.save();ctx.beginPath();ctx.arc(q.x,q.y,r,0,7);ctx.clip();ctx.drawImage(drag.fx,0,0);ctx.restore();});
  render();
}
ov.addEventListener('pointermove',e=>{
  if(!S.img)return;const p=pt(e);S.hover=p;
  if(!drag){if(S.tab==='draw'||S.tab==='remove')drawOverlay();return;}
  if(S.tab==='crop'){dragCrop(p);}
  else if(S.tab==='draw'){
    if(['brush','blur','pixel'].includes(drag.m))drawStroke(drag.last,p);
    else if(['rect','ellipse','line'].includes(drag.m)){const a=drag.p0;S.temp=c=>drawShape(c,drag.m,a,p);drawOverlay();}
  }else if(S.tab==='remove'){
    if(drag.m==='brush'){maskStroke(drag.last,p);drawOverlay();}
    else if(drag.m==='rect'||drag.m==='detect'){const r=normRect(drag.p0,p);S.temp=c=>{c.strokeStyle='#ff4040';c.lineWidth=2/S.zoom;c.setLineDash([6/S.zoom,4/S.zoom]);c.strokeRect(r.x,r.y,r.w,r.h);};drawOverlay();}
  }
  drag.last=p;
});
ov.addEventListener('pointerup',e=>{
  if(!drag)return;const p=pt(e),d=drag;drag=null;S.temp=null;
  if(S.tab==='draw'&&['rect','ellipse','line'].includes(d.m)){const ctx=beginEdit();drawShape(ctx,d.m,d.p0,p);afterChange();}
  else if(S.tab==='draw'){render();}
  else if(S.tab==='remove'){
    if(d.m==='rect'){const r=normRect(d.p0,p),c=S.mask.getContext('2d');c.fillStyle='rgba(255,40,40,.6)';c.fillRect(r.x,r.y,r.w,r.h);growMask(val('m_grow'));}
    else if(d.m==='detect')detectIn(normRect(d.p0,p));
    else if(d.m==='brush')growMask(val('m_grow'));
  }
  drawOverlay();
});
ov.addEventListener('pointerleave',()=>{S.hover=null;if(!drag)drawOverlay();});
function dragCrop(p){
  const o=drag.orig,W=S.img.width,H=S.img.height,f=drag.mode,ratio=cropRatio();let c;
  if(f==='move'){c={x:clamp(o.x+p.x-drag.p0.x,0,W-o.w),y:clamp(o.y+p.y-drag.p0.y,0,H-o.h),w:o.w,h:o.h};}
  else{
    let x0=o.x,y0=o.y,x1=o.x+o.w,y1=o.y+o.h;
    if(f.includes('l'))x0=clamp(p.x,0,x1-8);if(f.includes('r'))x1=clamp(p.x,x0+(f==='br'&&o.w<=1?1:8),W);
    if(f.includes('t'))y0=clamp(p.y,0,y1-8);if(f.includes('b'))y1=clamp(p.y,y0+(f==='br'&&o.h<=1?1:8),H);
    if(ratio){
      let w=x1-x0,h=y1-y0;
      if(f.length===2||f==='l'||f==='r'){h=w/ratio;if(f.includes('t'))y0=y1-h;else y1=y0+h;if(f==='l'||f==='r'){const cy=o.y+o.h/2;y0=cy-h/2;y1=cy+h/2;}}
      else{w=h*ratio;if(f.includes('l'))x0=x1-w;else x1=x0+w;if(f==='t'||f==='b'){const cx=o.x+o.w/2;x0=cx-w/2;x1=cx+w/2;}}
      if(x0<0||y0<0||x1>W||y1>H)return;
    }
    c={x:x0,y:y0,w:x1-x0,h:y1-y0};
  }
  S.crop=c;updCropInfo();drawOverlay();
}

/* ---------- Export ---------- */
const MIME={jpeg:'image/jpeg',png:'image/png',webp:'image/webp'};
function toBlob(c,type,q){return new Promise(r=>c.toBlob(r,type,q));}
async function exportBlob(canvas,fmt,q,kb){
  let src=canvas;if(fmt==='jpeg'){src=mk(canvas.width,canvas.height);const x=src.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,src.width,src.height);x.drawImage(canvas,0,0);}
  if(fmt==='png'||!kb)return toBlob(src,MIME[fmt],q);
  let lo=.03,hi=.98,best=null;
  for(let i=0;i<9;i++){const m=(lo+hi)/2,b=await toBlob(src,MIME[fmt],m);if(b.size<=kb*1024){best=b;lo=m;}else hi=m;}
  return best||toBlob(src,MIME[fmt],.03);
}
async function updateExportInfo(){
  if(!S.img)return;const nm=$('#x_name');if(!nm.value)nm.value=S.name+'-edited';
  const b=await exportBlob(S.img,sv('x_fmt'),val('x_q')/100,0);$('#x_info').textContent=`${S.img.width}×${S.img.height}px · approx. ${(b.size/1024).toFixed(0)} KB`;
}
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);}
const extOf=f=>f==='jpeg'?'jpg':f;

/* ---------- ZIP (store) ---------- */
const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
function crc32(b){let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=CRC[(c^b[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0;}
function makeZip(files){
  const enc=new TextEncoder(),parts=[],cen=[];let off=0;
  for(const f of files){
    const nm=enc.encode(f.name),crc=crc32(f.data),sz=f.data.length,lh=new DataView(new ArrayBuffer(30));
    lh.setUint32(0,0x04034b50,true);lh.setUint16(4,20,true);lh.setUint16(6,0x0800,true);lh.setUint16(12,0x21,true);lh.setUint32(14,crc,true);lh.setUint32(18,sz,true);lh.setUint32(22,sz,true);lh.setUint16(26,nm.length,true);
    const ch=new DataView(new ArrayBuffer(46));
    ch.setUint32(0,0x02014b50,true);ch.setUint16(4,20,true);ch.setUint16(6,20,true);ch.setUint16(8,0x0800,true);ch.setUint16(14,0x21,true);ch.setUint32(16,crc,true);ch.setUint32(20,sz,true);ch.setUint32(24,sz,true);ch.setUint16(28,nm.length,true);ch.setUint32(42,off,true);
    parts.push(lh,nm,f.data);cen.push(ch,nm);off+=30+nm.length+sz;
  }
  let cs=0;for(const c of cen)cs+=c.byteLength;const end=new DataView(new ArrayBuffer(22));
  end.setUint32(0,0x06054b50,true);end.setUint16(8,files.length,true);end.setUint16(10,files.length,true);end.setUint32(12,cs,true);end.setUint32(16,off,true);
  return new Blob([...parts,...cen,end],{type:'application/zip'});
}

/* ---------- Wiring ---------- */
function syncResizeFields(){
  if(!S.img||!$('#r_w'))return;$('#r_w').value=S.img.width;$('#r_h').value=S.img.height;$('#r_p').value=100;$('#rOrig').textContent=`Current: ${S.img.width} × ${S.img.height}px`;
}
function wire(){
  const on=(id,fn)=>{$('#'+id).onclick=async()=>{if(needImg())await fn();};};
  // Adjust
  $$('#presets button').forEach(b=>b.onclick=()=>{if(needImg())setAdj(PRESETS[b.textContent]);});
  on('adjReset',()=>setAdj({}));
  on('adjApply',()=>task('Applying…',async()=>{if(isNeutral(S.adj))return;const id=getID(S.img);adjustPixels(id,S.adj,1);applyID(id);setAdj({});}));
  // Enhance
  const runEnh=(msg,fn)=>async()=>task(msg,async p=>{const id=getID(S.img);await fn(id,p);applyID(id);});
  on('e_auto',runEnh('Enhancing…',async id=>enhanceAuto(id)));
  on('e_wb',runEnh('White balance…',async id=>grayWorld(id)));
  on('e_low',runEnh('Lifting shadows…',async id=>adjustPixels(id,{exposure:20,shadows:60,highlights:-10,contrast:8,vibrance:20,sharpen:10})));
  on('e_hdr',runEnh('HDR look…',async id=>adjustPixels(id,PRESETS.HDR)));
  on('e_denoise',runEnh('Denoising…',async(id,p)=>{const s=val('e_dn'),o=await bilateral(id,s>60?3:2,6+s*.5,p);id.data.set(o);}));
  on('e_sharp',runEnh('Sharpening…',async id=>unsharp(id,val('e_sh')/100,val('e_shr'))));
  on('e_skin',runEnh('Smoothing skin…',async(id,p)=>skinSmooth(id,val('e_sk'),p)));
  on('e_upgo',()=>task('Upscaling…',async()=>{commit(await upscale(S.img,+sv('e_up')));fit();render();}));
  // Resize
  const rw=$('#r_w'),rh=$('#r_h'),rp=$('#r_p');
  rw.oninput=()=>{if(!S.img)return;if(chk('r_lock'))rh.value=Math.round(rw.value*S.img.height/S.img.width);rp.value=Math.round(rw.value/S.img.width*100);};
  rh.oninput=()=>{if(!S.img)return;if(chk('r_lock'))rw.value=Math.round(rh.value*S.img.width/S.img.height);rp.value=Math.round(rh.value/S.img.height*100);};
  rp.oninput=()=>{if(!S.img)return;rw.value=Math.round(S.img.width*rp.value/100);rh.value=Math.round(S.img.height*rp.value/100);};
  $('#r_pre').onchange=e=>{if(!e.target.value)return;const[w,h]=e.target.value.split('x');rw.value=w;rh.value=h;$('#r_lock').checked=false;};
  on('r_go',()=>task('Resizing…',async()=>{
    const w=Math.round(rw.value),h=Math.round(rh.value);if(!(w>0&&h>0))throw 'Enter a valid size.';if(w*h>150e6)throw 'Too large (limit ≈150 MP).';
    commit(fitResize(S.img,w,h,$('#r_pre').value?sv('r_fit'):'stretch',sv('r_bg'),chk('r_smooth')));fit();render();}));
  // Crop
  $('#c_as').onchange=()=>{if(S.img)setCropRatio();};
  on('c_all',()=>{initCrop();setCropRatio();drawOverlay();});
  on('c_go',()=>{const c=S.crop;if(!c)return;const x=Math.round(c.x),y=Math.round(c.y),w=Math.max(1,Math.round(c.w)),h=Math.max(1,Math.round(c.h)),n=mk(w,h);n.getContext('2d').drawImage(S.img,x,y,w,h,0,0,w,h);S.crop=null;commit(n);initCrop();fit();render();});
  on('t_l',()=>flipRot('l'));on('t_r',()=>flipRot('r'));on('t_h',()=>flipRot('h'));on('t_v',()=>flipRot('v'));
  on('t_go',()=>{const a=val('t_ang');if(!a)return;commit(rotateCanvas(S.img,a,chk('t_auto')));$('#t_ang').value=0;$('#t_ang_v').textContent=0;fit();render();});
  // Draw
  $$('#modes button').forEach(b=>b.onclick=()=>{$$('#modes button').forEach(x=>x.classList.remove('on'));b.classList.add('on');});
  // Watermark add
  $$('#w_pos button').forEach(b=>b.onclick=()=>{$$('#w_pos button').forEach(x=>x.classList.remove('on'));b.classList.add('on');});
  $('#w_pick').onclick=()=>$('#logoFile').click();
  $('#logoFile').onchange=async e=>{const f=e.target.files[0];if(f){S.logo=await createImageBitmap(f);$('#w_kind').value='logo';toast('Logo loaded');}e.target.value='';};
  on('w_go',()=>{const ctx=beginEdit(),pb=$('#w_pos .on');
    try{stamp(ctx,S.img.width,S.img.height,{kind:sv('w_kind'),text:sv('w_txt')||' ',color:sv('w_col'),size:val('w_size'),op:val('w_op'),rot:val('w_rot'),mar:val('w_mar'),tile:chk('w_tile'),pos:+pb.dataset.pos});afterChange();}
    catch(e){undo();S.redo=[];toast(e);}});
  // Remove
  $$('#rmodes button').forEach(b=>b.onclick=()=>{$$('#rmodes button').forEach(x=>x.classList.remove('on'));b.classList.add('on');});
  on('m_clear',()=>{S.mask=mk(S.img.width,S.img.height);drawOverlay();});
  on('m_growgo',()=>growMask(Math.max(1,val('m_grow'))));
  on('m_go',()=>task('Removing watermark…',async p=>{const out=clone(S.img);await inpaint(out,S.mask,{mode:sv('m_mode'),ph:val('m_ph'),samples:val('m_samples')},p);commit(out);S.mask=mk(out.width,out.height);render();toast('Done — Undo if it needs another pass');}));
  // Export
  ['x_fmt','x_q'].forEach(i=>$('#'+i).addEventListener('change',updateExportInfo));
  on('x_dl',()=>task('Encoding…',async()=>{const f=sv('x_fmt'),b=await exportBlob(S.img,f,val('x_q')/100,val('x_kb')||0);
    if(val('x_kb')&&b.size>val('x_kb')*1024)toast(`Smallest reachable: ${(b.size/1024).toFixed(0)} KB — reduce dimensions in Resize`);
    download(b,(sv('x_name')||S.name)+'.'+extOf(f));}));
  on('x_copy',async()=>{try{const b=await toBlob(S.img,'image/png');await navigator.clipboard.write([new ClipboardItem({'image/png':b})]);toast('Copied');}catch(e){toast('Clipboard not available in this browser');}});
  $('#bExport').onclick=()=>setTab('export');
  // Batch
  $('#b_pick').onclick=()=>$('#batchFiles').click();
  $('#batchFiles').onchange=e=>{S.batch=[...e.target.files];$('#b_list').textContent=S.batch.length?S.batch.length+' file(s): '+S.batch.slice(0,4).map(f=>f.name).join(', ')+(S.batch.length>4?'…':''):'No files chosen.';e.target.value='';};
  $('#b_go').onclick=()=>{if(!S.batch.length)return toast('Choose photos first');task('Batch processing…',async p=>{
    const out=[],used=new Set(),fmt=sv('b_fmt'),v=val('b_val');
    for(let i=0;i<S.batch.length;i++){
      const f=S.batch[i];let bmp;try{bmp=await createImageBitmap(f);}catch(e){continue;}
      let c=mk(bmp.width,bmp.height);c.getContext('2d').drawImage(bmp,0,0);
      const m=sv('b_mode'),W=c.width,H=c.height;let sc=m==='long'?v/Math.max(W,H):m==='w'?v/W:m==='h'?v/H:v/100;
      if(sc!==1)c=resizeTo(c,W*sc,H*sc);
      if($('#b_enh').checked){const id=getID(c);enhanceAuto(id);c.getContext('2d').putImageData(id,0,0);}
      const b=await exportBlob(c,fmt,val('b_q')/100,0);let nm=f.name.replace(/\.[^.]+$/,'')+'-resized',k=nm,n=1;while(used.has(k))k=nm+'-'+(++n);used.add(k);
      out.push({name:k+'.'+extOf(fmt),data:new Uint8Array(await b.arrayBuffer())});p((i+1)/S.batch.length);await tick();
    }
    if(!out.length)throw 'No readable images.';download(makeZip(out),'pixelforge-batch.zip');});};
  // Header
  $('#bOpen').onclick=()=>$('#file').click();
  $('#file').onchange=e=>{const f=e.target.files[0];if(f)loadBlob(f,f.name);e.target.value='';};
  $('#bUndo').onclick=undo;$('#bRedo').onclick=redo;
  const cmp=v=>()=>{S.comparing=v;render();};const bc=$('#bCmp');bc.onpointerdown=cmp(true);bc.onpointerup=bc.onpointerleave=cmp(false);
  $('#zIn').onclick=()=>setZoom(S.zoom*1.25);$('#zOut').onclick=()=>setZoom(S.zoom/1.25);$('#z100').onclick=()=>setZoom(1);$('#zFit').onclick=()=>{fit();render();};
}
$('#scroll').addEventListener('wheel',e=>{if(e.ctrlKey&&S.img){e.preventDefault();setZoom(S.zoom*(e.deltaY<0?1.1:1/1.1));}},{passive:false});
const stg=$('#stage');
stg.addEventListener('dragover',e=>{e.preventDefault();$('#drop').classList.add('over');});
stg.addEventListener('dragleave',()=>$('#drop').classList.remove('over'));
stg.addEventListener('drop',e=>{e.preventDefault();$('#drop').classList.remove('over');const f=[...e.dataTransfer.files].find(f=>f.type.startsWith('image/'));if(f)loadBlob(f,f.name);});
$('#drop').onclick=()=>$('#file').click();
window.addEventListener('paste',e=>{const it=[...(e.clipboardData||{}).items||[]].find(i=>i.type.startsWith('image/'));if(it)loadBlob(it.getAsFile(),'pasted');});
window.addEventListener('keydown',e=>{
  if(/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)&&document.activeElement.type!=='range')return;
  if(e.ctrlKey&&e.key==='z'){e.preventDefault();undo();}else if(e.ctrlKey&&(e.key==='y'||(e.shiftKey&&e.key==='Z'))){e.preventDefault();redo();}
  else if(e.key==='+'||e.key==='=')setZoom(S.zoom*1.25);else if(e.key==='-')setZoom(S.zoom/1.25);
});
window.addEventListener('resize',()=>{if(S.img){fit();render();}});
buildUI();

/* ---------- Self-test: open index.html#selftest ---------- */
if(location.hash==='#selftest')(async()=>{
  const R={};try{
    const W=420,H=300,clean=mk(W,H),cx=clean.getContext('2d');
    const g=cx.createLinearGradient(0,0,W,H);g.addColorStop(0,'#3a7bd5');g.addColorStop(1,'#f2994a');cx.fillStyle=g;cx.fillRect(0,0,W,H);
    for(let i=0;i<400;i++){cx.fillStyle=`rgba(255,255,255,${Math.random()*.15})`;cx.fillRect(Math.random()*W,Math.random()*H,6,6);}
    const marked=clone(clean),mx=marked.getContext('2d');mx.font='bold 40px Arial';mx.fillStyle='rgba(255,255,255,.7)';mx.fillText('WATERMARK',90,160);
    const diff=(a,b,r)=>{const A=a.getContext('2d').getImageData(r.x,r.y,r.w,r.h).data,B=b.getContext('2d').getImageData(r.x,r.y,r.w,r.h).data;let s=0;for(let i=0;i<A.length;i+=4)s+=Math.abs(A[i]-B[i])+Math.abs(A[i+1]-B[i+1])+Math.abs(A[i+2]-B[i+2]);return s/(A.length/4*3);};
    const reg={x:85,y:120,w:260,h:55};R.before=diff(marked,clean,reg);
    S.img=clone(marked);S.mask=mk(W,H);S.zoom=1;
    const mc=S.mask.getContext('2d');mc.fillStyle='rgba(255,40,40,.6)';mc.fillRect(85,125,255,48);
    for(const mode of['patch','smooth']){const out=clone(marked);await inpaint(out,S.mask,{mode,ph:4,samples:200},null);R['after_'+mode]=diff(out,clean,reg);}
    const id=getID(clean);adjustPixels(id,{...PRESETS.Vivid,sharpen:30,vignette:30,grain:10,hue:20},1);R.adjust_ok=id.data.length===W*H*4;
    const id2=getID(clean);id2.data.set(await bilateral(id2,2,20));R.bilateral_ok=true;
    const up=await upscale(clean,2);R.upscale=[up.width,up.height];
    const rs=resizeTo(clean,100,70);R.resize=[rs.width,rs.height];
    const rot=rotateCanvas(clean,10,true);R.rot=[rot.width,rot.height];
    const z=makeZip([{name:'a.txt',data:new TextEncoder().encode('hello')}]);R.zip=z.size;
    const jb=await exportBlob(clean,'jpeg',.9,8);R.jpeg_kb_limit=jb.size<=8*1024;
    const e2=getID(clean);enhanceAuto(e2);R.enh_ok=true;
    R.pass=R.after_patch<R.before&&R.after_smooth<R.before&&R.upscale[0]===840&&R.jpeg_kb_limit;
  }catch(e){R.error=String(e&&e.stack||e);}
  const pre=document.createElement('pre');pre.id='selftest';pre.textContent=JSON.stringify(R);document.body.appendChild(pre);document.title='SELFTEST '+(R.pass?'PASS':'FAIL');
})();
