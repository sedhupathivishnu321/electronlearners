'use strict';
/* Photo Studio — client-side photo editor. No uploads, no dependencies.
   Architecture:
   - Real-time adjustments run on the GPU (WebGL2, two passes) on a ≤2560px preview texture.
   - Heavy jobs (enhance, denoise, sharpen, skin smoothing, inpainting) run in Web Workers (UI never blocks, cancellable).
   - History is memory-budgeted; strokes are drawn incrementally; overlays are coalesced with requestAnimationFrame. */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c;};
const clone=c=>{const n=mk(c.width,c.height);n.getContext('2d').drawImage(c,0,0);return n;};
const tick=()=>new Promise(r=>setTimeout(r));
const debounce=(f,ms)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>f(...a),ms);};};
const store={get(k,d){try{const v=localStorage.getItem('ps_'+k);return v===null?d:v;}catch(e){return d;}},set(k,v){try{localStorage.setItem('ps_'+k,v);}catch(e){}}};

/* ======================================================================
   PURE PIXEL FUNCTIONS — these are also serialised into the Web Worker,
   so they must only reference each other, ZERO and Math.
   ====================================================================== */
const ADJ=[['exposure','Exposure'],['brightness','Brightness'],['contrast','Contrast'],['highlights','Highlights'],['shadows','Shadows'],['temperature','Temperature'],['tint','Tint'],['saturation','Saturation'],['vibrance','Vibrance'],['hue','Hue',-180,180],['sepia','Sepia',0,100],['clarity','Clarity'],['sharpen','Sharpen',0,100],['blur','Blur',0,100],['vignette','Vignette'],['grain','Grain',0,100]];
const ZERO=Object.fromEntries(ADJ.map(a=>[a[0],0]));
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function blurRGBA(src,w,h,r){
  r=Math.round(r);if(r<1)return src.slice();
  var a=src.slice(),b=src.slice(),d=2*r+1,x,y,c,i,s,row;
  for(var it=0;it<3;it++){
    for(y=0;y<h;y++){row=y*w;for(c=0;c<3;c++){s=0;for(i=-r;i<=r;i++)s+=a[(row+Math.min(w-1,Math.max(0,i)))*4+c];
      for(x=0;x<w;x++){b[(row+x)*4+c]=s/d;s+=a[(row+Math.min(w-1,x+r+1))*4+c]-a[(row+Math.max(0,x-r))*4+c];}}}
    for(x=0;x<w;x++){for(c=0;c<3;c++){s=0;for(i=-r;i<=r;i++)s+=b[(Math.min(h-1,Math.max(0,i))*w+x)*4+c];
      for(y=0;y<h;y++){a[(y*w+x)*4+c]=s/d;s+=b[(Math.min(h-1,y+r+1)*w+x)*4+c]-b[(Math.max(0,y-r)*w+x)*4+c];}}}
  }
  return a;
}
function unsharp(id,amt,r){
  var d=id.data,bl=blurRGBA(d,id.width,id.height,r);
  for(var i=0;i<d.length;i+=4){d[i]+=amt*(d[i]-bl[i]);d[i+1]+=amt*(d[i+1]-bl[i+1]);d[i+2]+=amt*(d[i+2]-bl[i+2]);}
}
function adjustPixels(id,P0,sc){
  sc=sc||1;var P=Object.assign({},ZERO,P0),d=id.data,w=id.width,h=id.height;
  var ex=Math.pow(2,P.exposure/50),br=P.brightness/250,ct=1+P.contrast/100,tp=P.temperature/100*.18,tn=P.tint/100*.12,
    sat=1+P.saturation/100,vib=P.vibrance/100,sh=P.shadows/100*.35,hi=P.highlights/100*.35,sep=P.sepia/100;
  var an=P.hue*Math.PI/180,ca=Math.cos(an),sa=Math.sin(an);
  var m00=.213+ca*.787-sa*.213,m01=.715-ca*.715-sa*.715,m02=.072-ca*.072+sa*.928,
      m10=.213-ca*.213+sa*.143,m11=.715+ca*.285+sa*.140,m12=.072-ca*.072-sa*.283,
      m20=.213-ca*.213-sa*.787,m21=.715-ca*.715+sa*.715,m22=.072+ca*.928+sa*.072;
  var need=P.exposure||P.brightness||P.contrast||P.temperature||P.tint||P.saturation||P.vibrance||P.shadows||P.highlights||P.hue||P.sepia;
  var i,r,g,b,l;
  if(need)for(i=0;i<d.length;i+=4){
    r=d[i]/255*ex;g=d[i+1]/255*ex;b=d[i+2]/255*ex;
    r+=br+tp+tn*.5;g+=br-tn;b+=br-tp+tn*.5;
    if(sh||hi){l=clamp(.299*r+.587*g+.114*b,0,1);var ad=sh*(1-l)*(1-l)+hi*l*l;r+=ad;g+=ad;b+=ad;}
    r=(r-.5)*ct+.5;g=(g-.5)*ct+.5;b=(b-.5)*ct+.5;
    if(P.hue){var r2=m00*r+m01*g+m02*b,g2=m10*r+m11*g+m12*b,b2=m20*r+m21*g+m22*b;r=r2;g=g2;b=b2;}
    if(sat!==1||vib){
      l=.299*r+.587*g+.114*b;var mx=Math.max(r,g,b),mn=Math.min(r,g,b),cs=mx>0?clamp((mx-mn)/mx,0,1):0,s=sat+vib*(1-cs);
      r=l+(r-l)*s;g=l+(g-l)*s;b=l+(b-l)*s;
    }
    if(sep){var sr=.393*r+.769*g+.189*b,sg=.349*r+.686*g+.168*b,sb=.272*r+.534*g+.131*b;r+=(sr-r)*sep;g+=(sg-g)*sep;b+=(sb-b)*sep;}
    d[i]=r*255;d[i+1]=g*255;d[i+2]=b*255;
  }
  if(P.blur>0){var bl=blurRGBA(d,w,h,Math.max(1,P.blur*.4*sc));for(i=0;i<d.length;i++)d[i]=bl[i];}
  if(P.sharpen>0)unsharp(id,P.sharpen/40,Math.max(1,Math.round(1.2*sc)));
  if(P.clarity)unsharp(id,P.clarity/100*.8,Math.max(2,Math.round(Math.max(w,h)/55)));
  if(P.vignette||P.grain){
    var v=P.vignette/100,gr=P.grain*1.2,x,y,dx,dy,q,c,t;
    for(y=0;y<h;y++){dy=(y-h/2)/(h/2);for(x=0;x<w;x++){
      i=(y*w+x)*4;dx=(x-w/2)/(w/2);q=(dx*dx+dy*dy)/2;
      for(c=0;c<3;c++){t=d[i+c];
        if(v>0)t*=1-v*q;else if(v<0)t+=(255-t)*(-v)*q;
        if(gr)t+=(Math.random()-.5)*gr;d[i+c]=t;}
    }}
  }
  return id;
}
function autoLevels(id,strength){
  strength=strength===undefined?.85:strength;
  var d=id.data,n=d.length/4,hist=[new Uint32Array(256),new Uint32Array(256),new Uint32Array(256)],i,c,a,l,h,x;
  for(i=0;i<d.length;i+=4){hist[0][d[i]]++;hist[1][d[i+1]]++;hist[2][d[i+2]]++;}
  var lo=[],hi=[];
  for(c=0;c<3;c++){a=0;for(l=0;l<255;l++){a+=hist[c][l];if(a>n*.005)break;}a=0;for(h=255;h>0;h--){a+=hist[c][h];if(a>n*.005)break;}lo[c]=l;hi[c]=Math.max(h,l+8);}
  var L=Math.min(lo[0],lo[1],lo[2]),H=Math.max(hi[0],hi[1],hi[2]),lut=[];
  for(c=0;c<3;c++){var aa=lo[c]*.5+L*.5,bb=hi[c]*.5+H*.5,t=new Float32Array(256);for(x=0;x<256;x++){var v=clamp((x-aa)/(bb-aa),0,1);t[x]=(x/255)*(1-strength)+v*strength;}lut.push(t);}
  var m=0;for(i=0;i<d.length;i+=4)m+=.299*lut[0][d[i]]+.587*lut[1][d[i+1]]+.114*lut[2][d[i+2]];m/=n;
  var gm=clamp(Math.log(.47)/Math.log(Math.max(.02,m)),.7,1.5);
  for(i=0;i<d.length;i+=4){d[i]=255*Math.pow(lut[0][d[i]],gm);d[i+1]=255*Math.pow(lut[1][d[i+1]],gm);d[i+2]=255*Math.pow(lut[2][d[i+2]],gm);}
}
function grayWorld(id,amt){
  amt=amt||.7;var d=id.data,n=d.length/4,r=0,g=0,b=0,i;
  for(i=0;i<d.length;i+=4){r+=d[i];g+=d[i+1];b+=d[i+2];}
  r/=n;g/=n;b/=n;var m=(r+g+b)/3,kr=1+(m/r-1)*amt,kg=1+(m/g-1)*amt,kb=1+(m/b-1)*amt;
  for(i=0;i<d.length;i+=4){d[i]*=kr;d[i+1]*=kg;d[i+2]*=kb;}
}
function enhanceAuto(id){autoLevels(id);adjustPixels(id,{vibrance:22,saturation:6,clarity:22,sharpen:22},1);}
function bilateral(id,radius,sigR,prog){
  var w=id.width,h=id.height,s=id.data,o=new Uint8ClampedArray(s.length),k=radius*2+1,sw=new Float32Array(k*k),sg=radius*.8+.4,x,y,dx,dy,i;
  for(y=-radius;y<=radius;y++)for(x=-radius;x<=radius;x++)sw[(y+radius)*k+x+radius]=Math.exp(-(x*x+y*y)/(2*sg*sg));
  var lut=new Float32Array(766);for(i=0;i<766;i++){var t=i/3;lut[i]=Math.exp(-t*t/(2*sigR*sigR));}
  for(y=0;y<h;y++){
    for(x=0;x<w;x++){
      i=(y*w+x)*4;var r0=s[i],g0=s[i+1],b0=s[i+2],r=0,g=0,b=0,ws=0;
      for(dy=-radius;dy<=radius;dy++){var yy=y+dy;if(yy<0||yy>=h)continue;
        for(dx=-radius;dx<=radius;dx++){var xx=x+dx;if(xx<0||xx>=w)continue;
          var j=(yy*w+xx)*4,sad=Math.abs(s[j]-r0)+Math.abs(s[j+1]-g0)+Math.abs(s[j+2]-b0),wt=sw[(dy+radius)*k+dx+radius]*lut[sad];
          r+=s[j]*wt;g+=s[j+1]*wt;b+=s[j+2]*wt;ws+=wt;}}
      o[i]=r/ws;o[i+1]=g/ws;o[i+2]=b/ws;o[i+3]=s[i+3];
    }
    if(prog&&y%16===0)prog(y/h);
  }
  return o;
}
function skinSmooth(id,strength,prog){
  var d=id.data,sm=bilateral(id,3,18+strength*.4,prog),a=strength/100*.85;
  for(var i=0;i<d.length;i+=4){
    var r=d[i],g=d[i+1],b=d[i+2],Y=.299*r+.587*g+.114*b,cb=128-.1687*r-.3313*g+.5*b,cr=128+.5*r-.4187*g-.0813*b;
    if(cb>77&&cb<127&&cr>133&&cr<173&&Y>40){d[i]=r+(sm[i]-r)*a;d[i+1]=g+(sm[i+1]-g)*a;d[i+2]=b+(sm[i+2]-b)*a;}
  }
}
/* Exemplar-based inpainting (region-level). id = region RGBA, known = 1 where pixel is trusted, 0 where it must be filled. */
function inpaintCore(id,known,o,prog){
  var w=id.width,h=id.height,px=id.data,ph=o.ph,x,y,i,unk=0;
  for(i=0;i<w*h;i++)if(!known[i])unk++;
  var total=unk,N8=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]];
  function ringOf(){var ring=[];for(var y=0;y<h;y++)for(var x=0;x<w;x++){var i=y*w+x;if(known[i])continue;var kn=0;
    for(var n=0;n<8;n++){var xx=x+N8[n][0],yy=y+N8[n][1];if(xx>=0&&yy>=0&&xx<w&&yy<h)kn+=known[yy*w+xx];}if(kn)ring.push([i,kn]);}return ring;}
  var ring,n,r,g,b,cnt,j,xx,yy;
  if(o.mode==='smooth'){
    var f=new Float32Array(w*h*3);for(i=0;i<w*h;i++){f[i*3]=px[i*4];f[i*3+1]=px[i*4+1];f[i*3+2]=px[i*4+2];}
    var hole=[];
    while(unk>0){
      ring=ringOf();if(!ring.length)break;
      for(var q=0;q<ring.length;q++){i=ring[q][0];x=i%w;y=(i/w)|0;r=g=b=cnt=0;
        for(n=0;n<8;n++){xx=x+N8[n][0];yy=y+N8[n][1];if(xx<0||yy<0||xx>=w||yy>=h)continue;j=yy*w+xx;if(known[j]){r+=f[j*3];g+=f[j*3+1];b+=f[j*3+2];cnt++;}}
        f[i*3]=r/cnt;f[i*3+1]=g/cnt;f[i*3+2]=b/cnt;}
      for(q=0;q<ring.length;q++){known[ring[q][0]]=1;hole.push(ring[q][0]);unk--;}
      if(prog)prog(.5*(1-unk/total));
    }
    var N4=[[0,-1],[-1,0],[1,0],[0,1]];
    for(var it=0;it<60;it++){
      for(var hq=0;hq<hole.length;hq++){i=hole[hq];x=i%w;y=(i/w)|0;r=g=b=cnt=0;
        for(n=0;n<4;n++){xx=x+N4[n][0];yy=y+N4[n][1];if(xx<0||yy<0||xx>=w||yy>=h)continue;j=yy*w+xx;r+=f[j*3];g+=f[j*3+1];b+=f[j*3+2];cnt++;}
        f[i*3]=r/cnt;f[i*3+1]=g/cnt;f[i*3+2]=b/cnt;}
      if(prog&&it%6===0)prog(.5+.5*it/60);
    }
    for(var hh=0;hh<hole.length;hh++){i=hole[hh];px[i*4]=f[i*3];px[i*4+1]=f[i*3+1];px[i*4+2]=f[i*3+2];}
    return;
  }
  var S1=new Int32Array((w+1)*(h+1));
  for(y=0;y<h;y++)for(x=0;x<w;x++)S1[(y+1)*(w+1)+x+1]=S1[y*(w+1)+x+1]+S1[(y+1)*(w+1)+x]-S1[y*(w+1)+x]+(known[y*w+x]?0:1);
  var cand=[];
  for(y=ph;y<h-ph;y++)for(x=ph;x<w-ph;x++){var a=x-ph,bb=y-ph,c=x+ph+1,dd=y+ph+1;
    if(S1[dd*(w+1)+c]-S1[bb*(w+1)+c]-S1[dd*(w+1)+a]+S1[bb*(w+1)+a]===0)cand.push(y*w+x);}
  if(cand.length<10)throw 'Not enough clean background around the mark. Try the Smooth method or a smaller selection.';
  var valid=new Uint8Array(w*h);for(i=0;i<cand.length;i++)valid[cand[i]]=1;
  var srcIdx=new Int32Array(w*h).fill(-1),side=ph*2+1,E=new Int32Array(side*side),ER=new Float32Array(side*side),EG=new Float32Array(side*side),EB=new Float32Array(side*side);
  var ne=0,best=0,bestC=-1,done=0;
  function test(c){var s=0;for(var k=0;k<ne;k++){var q=(c+E[k])*4,dr=px[q]-ER[k],dg=px[q+1]-EG[k],db=px[q+2]-EB[k];s+=dr*dr+dg*dg+db*db;if(s>=best)return;}best=s;bestC=c;}
  while(unk>0){
    ring=ringOf();if(!ring.length)break;ring.sort(function(a,b){return b[1]-a[1];});
    for(var rq=0;rq<ring.length;rq++){
      i=ring[rq][0];x=i%w;y=(i/w)|0;ne=0;
      for(var dy=-ph;dy<=ph;dy++){yy=y+dy;if(yy<0||yy>=h)continue;for(var dx=-ph;dx<=ph;dx++){xx=x+dx;if(xx<0||xx>=w)continue;j=yy*w+xx;if(!known[j])continue;
        E[ne]=dy*w+dx;ER[ne]=px[j*4];EG[ne]=px[j*4+1];EB[ne]=px[j*4+2];ne++;}}
      best=Infinity;bestC=-1;
      for(n=0;n<8;n++){xx=x+N8[n][0];yy=y+N8[n][1];if(xx<0||yy<0||xx>=w||yy>=h)continue;var nb=yy*w+xx;if(srcIdx[nb]>=0){var cc=srcIdx[nb]-(N8[n][1]*w+N8[n][0]);if(cc>=0&&cc<w*h&&valid[cc])test(cc);}}
      for(var s=0;s<o.samples;s++)test(cand[(Math.random()*cand.length)|0]);
      if(bestC<0)bestC=cand[0];
      px[i*4]=px[bestC*4];px[i*4+1]=px[bestC*4+1];px[i*4+2]=px[bestC*4+2];srcIdx[i]=bestC;known[i]=1;unk--;done++;
      if(prog&&done%60===0)prog(1-unk/total);
    }
  }
}
function dispatch(op,id,a,prog){
  switch(op){
    case 'adjust':adjustPixels(id,a.P,1);break;
    case 'enhance':enhanceAuto(id);break;
    case 'wb':grayWorld(id);break;
    case 'preset':adjustPixels(id,a.P,1);break;
    case 'denoise':id.data.set(bilateral(id,a.radius,a.sig,prog));break;
    case 'sharpen':unsharp(id,a.amt,a.r);break;
    case 'skin':skinSmooth(id,a.strength,prog);break;
    case 'inpaint':inpaintCore(id,a.known instanceof Uint8Array?a.known:new Uint8Array(a.known),a.o,prog);break;
    default:throw 'Unknown operation '+op;
  }
}
const WORKER_SRC='const ZERO='+JSON.stringify(ZERO)+';\n'+[clamp,blurRGBA,unsharp,adjustPixels,autoLevels,grayWorld,enhanceAuto,bilateral,skinSmooth,inpaintCore,dispatch].map(f=>f.toString()).join('\n')+
 '\nonmessage=function(e){var d=e.data;var id={data:new Uint8ClampedArray(d.buf),width:d.w,height:d.h};try{dispatch(d.op,id,d.args,function(p){postMessage({p:p});});postMessage({done:1,buf:id.data.buffer},[id.data.buffer]);}catch(err){postMessage({err:String(err&&err.message||err)});}};';
let workerURL=null;
const S={img:null,orig:null,hist:[],redo:[],zoom:1,tab:'adjust',name:'photo',mask:null,crop:null,adj:{...ZERO},comparing:false,logo:null,temp:null,prev:null,batch:[],cancelFn:null,space:false,preset:'Original'};

/* Runs an operation on an ImageData in a worker; resolves with a new ImageData. Falls back to the main thread if workers are unavailable. */
function runOp(op,id,args,prog,extra){
  args=args||{};
  return new Promise((res,rej)=>{
    const inline=async()=>{try{await tick();const c=new ImageData(new Uint8ClampedArray(id.data),id.width,id.height);dispatch(op,c,args,prog);res(c);}catch(e){rej(e);}};
    let wk;
    try{if(!workerURL)workerURL=URL.createObjectURL(new Blob([WORKER_SRC],{type:'text/javascript'}));wk=new Worker(workerURL);}catch(e){return inline();}
    S.cancelFn=()=>{wk.terminate();S.cancelFn=null;rej('cancelled');};
    wk.onmessage=e=>{const d=e.data;
      if(d.p!==undefined){prog&&prog(d.p);}
      else if(d.err){wk.terminate();S.cancelFn=null;rej(d.err);}
      else if(d.done){wk.terminate();S.cancelFn=null;res(new ImageData(new Uint8ClampedArray(d.buf),id.width,id.height));}};
    wk.onerror=e=>{wk.terminate();S.cancelFn=null;workerURL=null;inline();};
    const copy=id.data.slice().buffer;
    wk.postMessage({op,buf:copy,w:id.width,h:id.height,args},[copy,...(extra||[])]);
  });
}

/* ======================================================================
   UI helpers
   ====================================================================== */
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),3400);}
const view=$('#view'),ov=$('#ov'),glc=$('#gl'),vctx=view.getContext('2d'),octx=ov.getContext('2d'),scrollEl=$('#scroll');
const val=id=>+$('#'+id).value, sv=id=>$('#'+id).value, chk=id=>$('#'+id).checked;
function setBar(p){$('#bar').style.width=Math.round(clamp(p,0,1)*100)+'%';}
async function task(msg,fn){
  $('#busyMsg').textContent=msg;setBar(0);$('#busy').hidden=false;await tick();
  try{await fn(setBar);}catch(e){if(e!=='cancelled'){toast(typeof e==='string'?e:'Error: '+(e&&e.message||e));if(e&&e.stack)console.error(e);}else toast('Cancelled');}
  finally{$('#busy').hidden=true;S.cancelFn=null;}
}
$('#bCancel').onclick=()=>{if(S.cancelFn)S.cancelFn();};
const rng=(id,l,min,max,v,step=1)=>`<div class="sl"><label for="${id}" title="Double-click to reset">${l}</label><input class="num" type="number" id="${id}_n" min="${min}" max="${max}" step="${step}" value="${v}" aria-label="${l} value"><input type="range" id="${id}" min="${min}" max="${max}" value="${v}" step="${step}" data-def="${v}"></div>`;
const opts=a=>a.map(x=>Array.isArray(x)?`<option value="${x[0]}">${x[1]}</option>`:`<option>${x}</option>`).join('');
function paintRange(el){
  const min=+el.min,max=+el.max,v=+el.value,p=(v-min)/(max-min)*100;let a=0,b=p;
  if(min<0){const c=(0-min)/(max-min)*100;a=Math.min(c,p);b=Math.max(c,p);}
  el.style.setProperty('--trk',`linear-gradient(90deg,var(--surface3) ${a}%,var(--accent) ${a}%,var(--accent) ${b}%,var(--surface3) ${b}%)`);
}
function setRange(id,v){const el=$('#'+id);el.value=v;const n=$('#'+id+'_n');if(n)n.value=el.value;paintRange(el);}

/* ======================================================================
   WebGL2 real-time adjustment engine
   ====================================================================== */
const G={ok:false,gl:null,max:4096,fw:0,fh:0,srcFor:null,tex:null,pw:0,ph:0,u:{}};
const GL_VS='#version 300 es\nin vec2 p;out vec2 vUv;void main(){vUv=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}';
const GL_F1='#version 300 es\nprecision highp float;in vec2 vUv;out vec4 o;uniform sampler2D uTex;uniform float uEx,uBr,uCt,uTp,uTn,uSat,uVib,uSh,uHi,uSep;uniform mat3 uHue;\n'+
'void main(){vec4 c=texture(uTex,vUv);vec3 v=c.rgb*uEx;v+=vec3(uBr+uTp+uTn*.5,uBr-uTn,uBr-uTp+uTn*.5);\n'+
'float l=clamp(dot(v,vec3(.299,.587,.114)),0.,1.);v+=uSh*(1.-l)*(1.-l)+uHi*l*l;v=(v-.5)*uCt+.5;v=uHue*v;\n'+
'float L=dot(v,vec3(.299,.587,.114));float mx=max(v.r,max(v.g,v.b)),mn=min(v.r,min(v.g,v.b));float cs=mx>0.?clamp((mx-mn)/mx,0.,1.):0.;float s=uSat+uVib*(1.-cs);v=vec3(L)+(v-vec3(L))*s;\n'+
'vec3 sp=vec3(dot(v,vec3(.393,.769,.189)),dot(v,vec3(.349,.686,.168)),dot(v,vec3(.272,.534,.131)));v=mix(v,sp,uSep);o=vec4(clamp(v,0.,1.),c.a);}';
const GL_F2='#version 300 es\nprecision highp float;in vec2 vUv;out vec4 o;uniform sampler2D uTex;uniform vec2 uTexel;uniform float uScale,uBlur,uSharp,uClar,uVig,uGrain,uDim;\n'+
'vec3 SL(vec2 uv,float lod){return textureLod(uTex,vec2(uv.x,1.-uv.y),lod).rgb;}\n'+
'vec3 bl(vec2 uv,float r){float lod=max(log2(max(r,1.)),0.);vec2 d=uTexel*r*.7;return(SL(uv,lod)*2.+SL(uv+d,lod)+SL(uv-d,lod)+SL(uv+vec2(d.x,-d.y),lod)+SL(uv+vec2(-d.x,d.y),lod))/6.;}\n'+
'void main(){vec3 c=SL(vUv,0.);float al=textureLod(uTex,vec2(vUv.x,1.-vUv.y),0.).a;vec3 v=c;\n'+
'if(uBlur>0.)v=bl(vUv,max(1.,uBlur*.4*uScale)*1.6);\n'+
'if(uSharp>0.){float r=max(1.,1.2*uScale);vec2 dx=vec2(uTexel.x*r,0.),dy=vec2(0.,uTexel.y*r);vec3 b=(c*4.+(SL(vUv+dx,0.)+SL(vUv-dx,0.)+SL(vUv+dy,0.)+SL(vUv-dy,0.))*2.+SL(vUv+dx+dy,0.)+SL(vUv+dx-dy,0.)+SL(vUv-dx+dy,0.)+SL(vUv-dx-dy,0.))/16.;v+=uSharp*(c-b);}\n'+
'if(uClar!=0.){vec3 b=bl(vUv,max(2.,uDim/55.));v+=uClar*(c-b);}\n'+
'vec2 q=(vUv-.5)*2.;float qq=dot(q,q)*.5;if(uVig>0.)v*=1.-uVig*qq;else if(uVig<0.)v+=(1.-v)*(-uVig)*qq;\n'+
'if(uGrain>0.){float n=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5;v+=n*uGrain/255.;}\n'+
'float a=al;o=vec4(clamp(v,0.,1.),a);}';
function glInit(){
  try{
    const gl=glc.getContext('webgl2',{premultipliedAlpha:false,alpha:true,antialias:false,preserveDrawingBuffer:false});if(!gl)return;
    const sh=(t,s)=>{const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(x);return x;};
    const prog=(f)=>{const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,GL_VS));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,f));gl.bindAttribLocation(p,0,'p');gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw gl.getProgramInfoLog(p);return p;};
    G.p1=prog(GL_F1);G.p2=prog(GL_F2);G.gl=gl;
    const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    const tp=(t,min)=>{gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,min);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);};
    G.tex=gl.createTexture();tp(G.tex,gl.LINEAR);
    G.fbTex=gl.createTexture();tp(G.fbTex,gl.LINEAR_MIPMAP_LINEAR);
    G.fbo=gl.createFramebuffer();
    G.max=Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE),16384);
    glc.addEventListener('webglcontextlost',e=>{e.preventDefault();G.ok=false;statusGpu();if(S.img)render();});
    G.ok=true;
  }catch(e){console.warn('WebGL2 unavailable, using CPU preview:',e);G.ok=false;}
}
function U(p,n){const k=(p===G.p1?'a':'b')+n;if(!(k in G.u))G.u[k]=G.gl.getUniformLocation(p,n);return G.u[k];}
function glRun(src,tw,th,P,scale,dim){
  const gl=G.gl;P={...ZERO,...P};
  if(glc.width!==tw||glc.height!==th){glc.width=tw;glc.height=th;}
  if(G.fw!==tw||G.fh!==th){gl.bindTexture(gl.TEXTURE_2D,G.fbTex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,tw,th,0,gl.RGBA,gl.UNSIGNED_BYTE,null);G.fw=tw;G.fh=th;
    gl.bindFramebuffer(gl.FRAMEBUFFER,G.fbo);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,G.fbTex,0);}
  // pass 1: per-pixel colour operations -> FBO
  gl.bindFramebuffer(gl.FRAMEBUFFER,G.fbo);gl.viewport(0,0,tw,th);gl.useProgram(G.p1);
  gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,src);gl.uniform1i(U(G.p1,'uTex'),0);
  const an=P.hue*Math.PI/180,ca=Math.cos(an),sa=Math.sin(an);
  const m00=.213+ca*.787-sa*.213,m01=.715-ca*.715-sa*.715,m02=.072-ca*.072+sa*.928,m10=.213-ca*.213+sa*.143,m11=.715+ca*.285+sa*.140,m12=.072-ca*.072-sa*.283,m20=.213-ca*.213-sa*.787,m21=.715-ca*.715+sa*.715,m22=.072+ca*.928+sa*.072;
  gl.uniformMatrix3fv(U(G.p1,'uHue'),false,[m00,m10,m20,m01,m11,m21,m02,m12,m22]);
  const f=(n,v)=>gl.uniform1f(U(G.p1,n),v);
  f('uEx',Math.pow(2,P.exposure/50));f('uBr',P.brightness/250);f('uCt',1+P.contrast/100);f('uTp',P.temperature/100*.18);f('uTn',P.tint/100*.12);
  f('uSat',1+P.saturation/100);f('uVib',P.vibrance/100);f('uSh',P.shadows/100*.35);f('uHi',P.highlights/100*.35);f('uSep',P.sepia/100);
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  gl.bindTexture(gl.TEXTURE_2D,G.fbTex);gl.generateMipmap(gl.TEXTURE_2D);
  // pass 2: blur / sharpen / clarity / vignette / grain -> canvas
  gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,tw,th);gl.useProgram(G.p2);
  gl.uniform1i(U(G.p2,'uTex'),0);gl.uniform2f(U(G.p2,'uTexel'),1/tw,1/th);
  const g=(n,v)=>gl.uniform1f(U(G.p2,n),v);
  g('uScale',scale);g('uBlur',P.blur);g('uSharp',P.sharpen/40);g('uClar',P.clarity/100*.8);g('uVig',P.vignette/100);g('uGrain',P.grain*1.2);g('uDim',Math.max(tw,th));
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
}
function glUpload(){
  const w=S.img.width,h=S.img.height,sc=Math.min(1,2560/Math.max(w,h));let src=S.img;
  if(sc<1)src=resizeTo(S.img,w*sc,h*sc);
  const gl=G.gl;gl.bindTexture(gl.TEXTURE_2D,G.tex);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,src);
  G.pw=src.width;G.ph=src.height;G.srcFor=S.img;
}
function drawGL(){
  if(!G.ok||!S.img)return;if(G.srcFor!==S.img)glUpload();
  glRun(G.tex,G.pw,G.ph,S.adj,G.pw/S.img.width);
}
function glFull(P){
  if(!G.ok)return null;const w=S.img.width,h=S.img.height;if(w>G.max||h>G.max||w*h>90e6)return null;
  const gl=G.gl,t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,S.img);
  glRun(t,w,h,P,1);const out=mk(w,h);out.getContext('2d').drawImage(glc,0,0);
  gl.deleteTexture(t);gl.bindTexture(gl.TEXTURE_2D,G.fbTex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,null);G.fw=1;G.fh=1;
  return out;
}
function statusGpu(){const e=$('#sGpu');e.textContent=G.ok?'GPU preview':'CPU preview';e.classList.toggle('cpu',!G.ok);}

/* CPU fallback preview */
const isNeutral=P=>ADJ.every(a=>!P[a[0]]);
function adjPreviewCPU(){
  const w=S.img.width,h=S.img.height,sc=Math.min(1,1280/Math.max(w,h));
  if(!S.prev||S.prev.src!==S.img){const c=mk(w*sc,h*sc);c.getContext('2d').drawImage(S.img,0,0,c.width,c.height);S.prev={src:S.img,c,base:c.getContext('2d').getImageData(0,0,c.width,c.height)};}
  const b=S.prev.base,id=new ImageData(new Uint8ClampedArray(b.data),b.width,b.height);
  adjustPixels(id,S.adj,sc);S.prev.c.getContext('2d').putImageData(id,0,0);return S.prev.c;
}

/* ======================================================================
   Canvas ops
   ====================================================================== */
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
async function upscale(src,f,prog){
  const steps=f===4?[2,2]:[f];let cur=src;
  for(let i=0;i<steps.length;i++){
    const s=steps[i];if(cur.width*s*cur.height*s>120e6)throw 'Result would be too large (limit ≈120 MP).';
    const c=resizeTo(cur,cur.width*s,cur.height*s),out=await runOp('sharpen',getID(c),{amt:.55,r:Math.round(1.2+s*.3)},p=>prog&&prog((i+p)/steps.length));
    c.getContext('2d').putImageData(out,0,0);cur=c;
  }
  return cur;
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
function stampCanvas(W,o){
  if(o.kind==='logo'){if(!S.logo)throw 'Choose a logo image first.';const lw=Math.max(8,W*o.size/100),lh=lw*S.logo.height/S.logo.width,c=mk(lw,lh);c.getContext('2d').drawImage(S.logo,0,0,lw,lh);return c;}
  const fs=Math.max(8,W*o.size/100/Math.max(4,o.text.length)*2.2),t=mk(10,10).getContext('2d');t.font=`bold ${fs}px Inter,Arial`;
  const m=t.measureText(o.text).width,c=mk(m+fs*.6,fs*1.5),x=c.getContext('2d');
  x.font=`bold ${fs}px Inter,Arial`;x.textBaseline='middle';x.fillStyle=o.color;x.shadowColor='rgba(0,0,0,.45)';x.shadowBlur=fs*.08;x.shadowOffsetY=fs*.03;x.fillText(o.text,fs*.3,c.height/2);return c;
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
function markOpts(){const pb=$('#w_pos .on');return{kind:sv('w_kind'),text:sv('w_txt')||' ',color:sv('w_col'),size:val('w_size'),op:val('w_op'),rot:val('w_rot'),mar:val('w_mar'),tile:chk('w_tile'),pos:+pb.dataset.pos};}
function markPreview(){if(S.tab!=='mark'||!S.img)return;try{const o=markOpts(),W=S.img.width,H=S.img.height;S.temp=c=>stamp(c,W,H,o);}catch(e){S.temp=null;}drawOverlay();}

/* Inpainting driver: region extraction on the main thread, solve in a worker */
async function inpaint(canvas,maskCanvas,o,prog){
  const W=canvas.width,H=canvas.height,md=maskCanvas.getContext('2d').getImageData(0,0,W,H).data;
  let x0=W,y0=H,x1=-1,y1=-1;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(md[(y*W+x)*4+3]>20){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
  if(x1<0)throw 'Mark the watermark first (brush, rectangle, wand or auto-detect).';
  const M=Math.max(30,Math.round(Math.max(x1-x0,y1-y0)*.7)+o.ph*2+4),rx=Math.max(0,x0-M),ry=Math.max(0,y0-M),w=Math.min(W,x1+M+1)-rx,h=Math.min(H,y1+M+1)-ry;
  const ctx=canvas.getContext('2d'),im=ctx.getImageData(rx,ry,w,h),known=new Uint8Array(w*h);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)known[y*w+x]=md[((ry+y)*W+rx+x)*4+3]>20?0:1;
  const out=await runOp('inpaint',im,{known:known.buffer,o:{mode:o.mode,ph:o.ph,samples:o.samples}},prog,[known.buffer]);
  ctx.putImageData(out,rx,ry);
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
  mc.putImageData(mi,x,y);growMask(Math.max(1,val('m_grow')));toast(n?`Detected ${n.toLocaleString()} px — refine with the brush or Clear if needed`:'Nothing detected: raise sensitivity or use the brush / wand');
}

/* ======================================================================
   State, history (memory-budgeted), rendering
   ====================================================================== */
const HIST_BUDGET=640*1024*1024,HIST_MAX=40;
const bytes=c=>c.width*c.height*4;
function free(c){try{c.width=c.height=0;}catch(e){}}
function histBytes(){return S.hist.reduce((s,c)=>s+bytes(c),0)+S.redo.reduce((s,c)=>s+bytes(c),0);}
function commit(c){
  S.hist.push(S.img);S.redo.forEach(free);S.redo=[];S.img=c;
  while(S.hist.length>0&&(S.hist.length>HIST_MAX||histBytes()+bytes(S.img)>HIST_BUDGET))free(S.hist.shift());
  afterChange();
}
function beginEdit(){commit(clone(S.img));return S.img.getContext('2d');}
function afterChange(){
  if(!S.mask||S.mask.width!==S.img.width||S.mask.height!==S.img.height)S.mask=mk(S.img.width,S.img.height);
  if(S.crop&&(S.crop.x+S.crop.w>S.img.width+1||S.crop.y+S.crop.h>S.img.height+1))S.crop=null;
  if(S.tab==='crop'&&!S.crop)initCrop();
  syncResizeFields();render();thumbsSoon();exportSoon();
}
function undo(){if(!S.hist.length)return;S.redo.push(S.img);S.img=S.hist.pop();afterChange();}
function redo(){if(!S.redo.length)return;S.hist.push(S.img);S.img=S.redo.pop();afterChange();}
async function loadBlob(blob,name){
  let bmp;try{bmp=await createImageBitmap(blob);}catch(e){return toast('Could not read this image. Try a JPG, PNG or WebP.');}
  if(bmp.width*bmp.height>120e6)return toast('Image is larger than 120 megapixels.');
  const c=mk(bmp.width,bmp.height);c.getContext('2d').drawImage(bmp,0,0);bmp.close&&bmp.close();setImage(c,name);
}
function setImage(c,name){
  S.hist.forEach(free);S.redo.forEach(free);S.hist=[];S.redo=[];
  S.name=(name||'photo').replace(/\.[^.]+$/,'');S.img=c;S.orig=clone(c);S.crop=null;S.mask=mk(c.width,c.height);S.prev=null;
  setAdj({},true);$('#drop').hidden=true;$('#x_name').value=S.name+'-edited';fit();afterChange();if(S.tab==='crop')initCrop();
}
function fit(){if(!S.img)return;const w=scrollEl.clientWidth,h=scrollEl.clientHeight;S.zoom=Math.min(2,Math.max(.02,(w-48)/S.img.width),Math.max(.02,(h-48)/S.img.height));S.zoom=Math.min(S.zoom,(w-48)/S.img.width,(h-48)/S.img.height);if(!(S.zoom>0))S.zoom=1;}
function setZoom(z,cx,cy){
  if(!S.img)return;const r0=ov.getBoundingClientRect();if(cx===undefined){const s=scrollEl.getBoundingClientRect();cx=s.left+s.width/2;cy=s.top+s.height/2;}
  const ix=(cx-r0.left)/S.zoom,iy=(cy-r0.top)/S.zoom;S.zoom=clamp(z,.02,16);cssSize();
  const r1=ov.getBoundingClientRect();scrollEl.scrollLeft+=r1.left+ix*S.zoom-cx;scrollEl.scrollTop+=r1.top+iy*S.zoom-cy;statusInfo();
}
function cssSize(){if(!S.img)return;const w=S.img.width*S.zoom+'px',h=S.img.height*S.zoom+'px';for(const c of[view,glc,ov]){c.style.width=w;c.style.height=h;}}
function render(){
  if(!S.img)return;const w=S.img.width,h=S.img.height;
  if(view.width!==w||view.height!==h){view.width=w;view.height=h;ov.width=w;ov.height=h;}
  vctx.clearRect(0,0,w,h);vctx.drawImage(S.comparing&&S.orig?S.orig:S.img,0,0,w,h);
  cssSize();updatePreview();drawOverlay();statusInfo();$('#chip').hidden=!S.comparing;
  $('#bUndo').disabled=!S.hist.length;$('#bRedo').disabled=!S.redo.length;
}
function updatePreview(){
  if(!S.img)return;const want=!S.comparing&&S.tab==='adjust'&&!isNeutral(S.adj);
  if(G.ok){glc.style.display=want?'block':'none';if(want)drawGL();}
  else if(want)vctx.drawImage(adjPreviewCPU(),0,0,S.img.width,S.img.height);
}
let rafP=0;const schedule=()=>{if(rafP)return;rafP=requestAnimationFrame(()=>{rafP=0;G.ok?updatePreview():render();});};
function statusInfo(){
  if(!S.img)return;$('#sDim').textContent=`${S.img.width} × ${S.img.height} px · ${(S.img.width*S.img.height/1e6).toFixed(1)} MP`;
  const z=Math.round(S.zoom*100)+'%';$('#sZoom').textContent=z;$('#zLabel').textContent=z;
  $('#sMem').textContent=`History ${S.hist.length} · ${(histBytes()/1048576).toFixed(0)} MB`;
}

/* ======================================================================
   Panels
   ====================================================================== */
const TABS=[['adjust','Adjust','i-adjust'],['enhance','Enhance','i-sparkle'],['resize','Resize','i-resize'],['crop','Crop','i-crop'],['draw','Draw','i-brush'],['mark','Watermark','i-stamp'],['remove','Remove','i-eraser'],['export','Export','i-download'],['batch','Batch','i-layers']];
const FONTS=['Inter','Arial','Georgia','Times New Roman','Courier New','Verdana','Impact','Trebuchet MS'];
const ASPECTS=[['free','Free'],['1','1:1'],['1.3333','4:3'],['1.5','3:2'],['1.7778','16:9'],['0.5625','9:16'],['0.8','4:5'],['orig','Original']];
const SIZES=[['','Custom'],['1080x1080','Instagram square · 1080²'],['1080x1350','Instagram portrait · 1080×1350'],['1080x1920','Story / Reel · 1080×1920'],['1920x1080','Full HD · 1920×1080'],['3840x2160','4K · 3840×2160'],['1280x720','HD · 1280×720'],['1200x630','Facebook / OG · 1200×630'],['1500x500','Twitter header · 1500×500'],['827x1063','Passport 35×45 mm @600 dpi'],['800x800','Thumbnail · 800²'],['512x512','Icon · 512²'],['256x256','Icon · 256²']];
const PRESETS={Original:{},Vivid:{saturation:30,contrast:15,vibrance:20},'B&W':{saturation:-100,contrast:20},Noir:{saturation:-100,contrast:45,vignette:40,grain:20},Warm:{temperature:30,tint:5,saturation:8},Cool:{temperature:-30,saturation:5},Vintage:{saturation:-25,temperature:25,sepia:25,vignette:35,grain:25,contrast:-10},Fade:{contrast:-25,brightness:12,saturation:-15},Dramatic:{contrast:35,clarity:50,saturation:-10,vignette:30,shadows:-20},Sepia:{sepia:100},HDR:{shadows:50,highlights:-50,clarity:50,vibrance:30,contrast:10},Soft:{blur:8,brightness:6,contrast:-8}};
const GROUPS=[['Light',['exposure','brightness','contrast','highlights','shadows']],['Color',['temperature','tint','saturation','vibrance','hue','sepia']],['Detail',['clarity','sharpen','blur']],['Effects',['vignette','grain']]];
const sec=(t,body,open=true)=>`<details class="sec" ${open?'open':''}><summary>${t}</summary><div class="sb">${body}</div></details>`;
const head=(t,p)=>`<div class="ph"><h2>${t}</h2><p>${p}</p></div>`;
const act=(id,ic,t,d,pr)=>`<button class="act${pr?' pr':''}" id="${id}"><svg class="ic"><use href="#${ic}"/></svg><div><b>${t}</b><span>${d}</span></div></button>`;
const posBtns=()=>[...Array(9).keys()].map(i=>`<button data-pos="${i}" class="${i===8?'on':''}" aria-label="Position ${i+1}">${['↖','↑','↗','←','·','→','↙','↓','↘'][i]}</button>`).join('');
const PANES={
adjust:()=>head('Adjust','Edits update live on the GPU.')+
 sec('Presets',`<div class="presets" id="presets">${Object.keys(PRESETS).map(k=>`<button class="pre${k==='Original'?' on':''}" data-p="${k}"><canvas width="96" height="72"></canvas>${k}</button>`).join('')}</div>`)+
 GROUPS.map(g=>sec(g[0],g[1].map(k=>{const a=ADJ.find(x=>x[0]===k);return rng('a_'+k,a[1],a[2]??-100,a[3]??100,0);}).join(''),g[0]!=='Effects')).join('')+
 `<div class="foot"><button class="btn" id="adjReset">Reset</button><button class="btn primary" id="adjApply">Apply</button></div>`,
enhance:()=>head('Enhance','Local image-processing, no uploads.')+
 `<div class="sb pad">${act('e_auto','i-sparkle','Auto enhance','Levels, tone, vibrance and clarity in one click',true)}${act('e_wb','i-sun','Auto white balance','Neutralise colour casts')}${act('e_low','i-moon','Low-light fix','Lift shadows and recover detail')}${act('e_hdr','i-image','HDR look','Local contrast and rich colour')}</div>`+
 sec('Denoise',rng('e_dn','Strength',10,100,40)+`<button class="btn block" id="e_denoise">Reduce noise</button>`,false)+
 sec('Sharpen / deblur',rng('e_sh','Amount',10,300,100)+rng('e_shr','Radius',1,8,2)+`<button class="btn block" id="e_sharp">Sharpen</button>`,false)+
 sec('Portrait',rng('e_sk','Smoothing',10,100,50)+`<button class="btn block" id="e_skin">Smooth skin</button>`,false)+
 sec('Upscale',`<div class="f"><label>Factor</label><select class="inp" id="e_up">${opts([['2','2×'],['3','3×'],['4','4×']])}</select></div><button class="btn primary block" id="e_upgo">Upscale + restore detail</button>`,true)+
 `<div class="sb"><p class="note">These are classical algorithms (levels, bilateral filter, bicubic + detail restore), not generative models, so they will not invent missing detail.</p></div>`,
resize:()=>head('Resize','Change pixel dimensions with high-quality resampling.')+
 `<div class="sb pad"><div class="kv"><span>Current</span><b id="rOrig">—</b></div><div class="f"><label>Preset</label><select class="inp" id="r_pre">${opts(SIZES)}</select></div>
 <div class="f2"><div><label class="lbl" style="margin:0 0 4px;display:block">Width</label><input class="inp" type="number" id="r_w" min="1"></div><div><label class="lbl" style="margin:0 0 4px;display:block">Height</label><input class="inp" type="number" id="r_h" min="1"></div></div>
 <div class="f"><label>Scale %</label><input class="inp" type="number" id="r_p" value="100" min="1"></div>
 <label class="chk"><input type="checkbox" id="r_lock" checked> Lock aspect ratio</label><label class="chk"><input type="checkbox" id="r_smooth" checked> Smooth resampling</label>
 <div class="f"><label>Preset fit</label><select class="inp" id="r_fit">${opts([['stretch','Stretch'],['contain','Contain (pad)'],['cover','Cover (crop)']])}</select></div>
 <div class="f"><label>Pad colour</label><input type="color" id="r_bg" value="#ffffff"></div>
 <div class="kv"><span>New size</span><b id="r_info">—</b></div><button class="btn primary block" id="r_go">Apply resize</button></div>`,
crop:()=>head('Crop & rotate','Drag the frame on the photo.')+
 `<div class="sb pad"><div class="lbl" style="margin-top:0">Aspect ratio</div><div class="pills" id="c_pills">${ASPECTS.map((a,i)=>`<button class="pill${i?'':' on'}" data-a="${a[0]}">${a[1]}</button>`).join('')}</div>
 <div class="kv" style="margin-top:10px"><span>Selection</span><b id="c_info">—</b></div>
 <div class="f2"><button class="btn" id="c_all">Select all</button><button class="btn primary" id="c_go">Apply crop</button></div></div>`+
 sec('Rotate & flip',`<div class="f2"><button class="btn" id="t_l">Rotate left</button><button class="btn" id="t_r">Rotate right</button><button class="btn" id="t_h">Flip horizontal</button><button class="btn" id="t_v">Flip vertical</button></div>`)+
 sec('Straighten',rng('t_ang','Angle (°)',-45,45,0,.5)+`<label class="chk"><input type="checkbox" id="t_auto" checked> Auto-crop corners</label><button class="btn block" id="t_go">Apply rotation</button>`),
draw:()=>head('Draw & text','Brush, privacy blur, shapes and text.')+
 `<div class="sb pad"><div class="pills" id="modes">${[['brush','Brush'],['blur','Blur'],['pixel','Pixelate'],['rect','Rectangle'],['ellipse','Ellipse'],['line','Line'],['text','Text']].map((m,i)=>`<button class="pill${i?'':' on'}" data-m="${m[0]}">${m[1]}</button>`).join('')}</div></div>`+
 sec('Style',`<div class="f"><label>Colour</label><input type="color" id="d_col" value="#ff3b30"></div>${rng('d_size','Size',1,300,12)}${rng('d_op','Opacity',5,100,100)}<label class="chk"><input type="checkbox" id="d_fill"> Fill shapes</label>`)+
 sec('Text',`<div class="f"><label>Text</label><input class="inp" type="text" id="d_txt" value="Your text"></div><div class="f"><label>Font</label><select class="inp" id="d_font">${opts(FONTS)}</select></div>${rng('d_fs','Font size',8,600,64)}${rng('d_stroke','Outline',0,20,0)}<label class="chk"><input type="checkbox" id="d_bold" checked> Bold</label><p class="note">Click the photo to place text. Shortcuts: [ and ] change brush size, hold Space to pan.</p>`,false),
mark:()=>head('Add watermark','Protect your photos with text or a logo. Live preview.')+
 `<div class="sb pad"><div class="f"><label>Type</label><select class="inp" id="w_kind">${opts([['text','Text'],['logo','Logo image']])}</select></div><button class="btn block" id="w_pick" style="margin-top:0">Choose logo…</button>
 <div class="f"><label>Text</label><input class="inp" type="text" id="w_txt" value="© My Photos"></div><div class="f"><label>Colour</label><input type="color" id="w_col" value="#ffffff"></div>
 ${rng('w_size','Size',2,80,20)}${rng('w_op','Opacity',5,100,50)}${rng('w_rot','Rotation',-90,90,0)}${rng('w_mar','Margin',0,15,3)}
 <label class="chk"><input type="checkbox" id="w_tile"> Tile across the photo</label><div class="lbl">Position</div><div class="pos" id="w_pos">${posBtns()}</div><button class="btn primary block" id="w_go">Stamp onto photo</button></div>`,
remove:()=>head('Remove watermark','Mark the unwanted area, then remove it.')+
 `<div class="sb pad"><div class="pills" id="rmodes">${[['brush','Brush'],['rect','Rectangle'],['wand','Magic wand'],['detect','Auto-detect']].map((m,i)=>`<button class="pill${i?'':' on'}" data-m="${m[0]}">${m[1]}</button>`).join('')}</div>
 <div class="tip" id="m_tip">Paint over the watermark. Works best on text and logos.</div></div>`+
 sec('Selection',rng('m_size','Brush size',2,300,24)+rng('m_tol','Wand tolerance',1,100,25)+rng('m_thr','Detect sensitivity',4,80,22)+rng('m_grow','Grow mask (px)',0,30,3)+`<label class="chk"><input type="checkbox" id="m_glob"> Wand selects whole image</label><div class="f2"><button class="btn" id="m_growgo">Grow</button><button class="btn" id="m_clear">Clear mask</button></div>`)+
 sec('Fill',`<div class="f"><label>Method</label><select class="inp" id="m_mode">${opts([['patch','Texture (patch-based)'],['smooth','Smooth (flat areas)']])}</select></div>${rng('m_ph','Patch size',2,8,4)}${rng('m_samples','Search effort',60,600,220)}`,false)+
 `<div class="sb"><button class="btn primary block" id="m_go">Remove selected area</button><p class="note">Exemplar-based inpainting runs locally in a background worker. It copies real texture from around the mark and is not a generative model, so large or highly detailed regions may repeat. Only edit images you own or have the right to modify.</p></div>`,
export:()=>head('Export','Choose format and size, then download.')+
 `<div class="sb pad"><div class="f"><label>Format</label><select class="inp" id="x_fmt">${opts([['jpeg','JPEG'],['png','PNG'],['webp','WebP']])}</select></div>${rng('x_q','Quality',5,100,90)}
 <div class="f"><label>Max size</label><input class="inp" type="number" id="x_kb" placeholder="KB (optional)"></div><div class="f"><label>File name</label><input class="inp" type="text" id="x_name"></div>
 <div class="kv"><span>Output</span><b id="x_info">—</b></div><button class="btn primary block" id="x_dl">Download</button><button class="btn block" id="x_copy">Copy to clipboard</button></div>`,
batch:()=>head('Batch resize','Process many photos and download a ZIP.')+
 `<div class="sb pad"><button class="btn block" id="b_pick" style="margin-top:0">Choose photos…</button><p class="note" id="b_list">No files chosen.</p>
 <div class="f"><label>Mode</label><select class="inp" id="b_mode">${opts([['long','Longest side (px)'],['w','Width (px)'],['h','Height (px)'],['pct','Percent']])}</select></div><div class="f"><label>Value</label><input class="inp" type="number" id="b_val" value="1600"></div>
 <div class="f"><label>Format</label><select class="inp" id="b_fmt">${opts([['jpeg','JPEG'],['png','PNG'],['webp','WebP']])}</select></div>${rng('b_q','Quality',5,100,88)}
 <label class="chk"><input type="checkbox" id="b_enh"> Auto-enhance each photo</label><button class="btn primary block" id="b_go">Process and download ZIP</button></div>`
};
function buildUI(){
  $('#rail').innerHTML=TABS.map(t=>`<button class="rail-b" data-t="${t[0]}" title="${t[1]}"><svg class="ic"><use href="#${t[2]}"/></svg>${t[1]}</button>`).join('');
  $('#panel').innerHTML=TABS.map(t=>`<div class="pane" id="p_${t[0]}">${PANES[t[0]]()}</div>`).join('');
  $$('#rail button').forEach(b=>b.onclick=()=>setTab(b.dataset.t));
  $$('#panel input[type=range]').forEach(paintRange);
  const P=$('#panel');
  P.addEventListener('input',e=>{const t=e.target;
    if(t.type==='range')onRange(t);
    else if(t.classList.contains('num')){const r=$('#'+t.id.slice(0,-2));if(t.value==='')return;r.value=t.value;onRange(r,true);}
    if(t.closest('#p_mark'))markPreview();
    if(t.closest('#p_export'))exportSoon();
    if(t.closest('#p_resize'))resizeInfo();});
  P.addEventListener('dblclick',e=>{const l=e.target.closest('.sl label'),r=e.target.closest('input[type=range]');const el=l?$('#'+l.getAttribute('for')):r;if(el){el.value=el.dataset.def;onRange(el,true);}});
  P.addEventListener('click',e=>{if(e.target.closest('#p_mark'))setTimeout(markPreview,0);});
  setTab('adjust');wire();
}
function onRange(el,fromNum){
  const n=$('#'+el.id+'_n');if(n&&!fromNum)n.value=el.value;if(n&&fromNum)n.value=el.value;paintRange(el);
  if(el.id.startsWith('a_')){S.adj[el.id.slice(2)]=+el.value;if(S.preset){S.preset=null;$$('.pre').forEach(b=>b.classList.remove('on'));}schedule();}
  if(el.id==='m_size'||el.id==='d_size')updateCursor();
}
function setTab(t){
  S.tab=t;S.temp=null;$$('#rail button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));$$('.pane').forEach(p=>p.classList.toggle('on',p.id==='p_'+t));
  $('#panel').scrollTop=0;if(t==='crop'&&S.img&&!S.crop)initCrop();if(t==='export')updateExportInfo();if(t==='resize')syncResizeFields();
  if((t==='draw'||t==='remove')&&S.img&&!S.sizeSet){const v=Math.max(8,Math.round(Math.max(S.img.width,S.img.height)/70));setRange('d_size',v);setRange('m_size',v);S.sizeSet=true;}
  if(t==='mark')markPreview();hideCursor();if(S.img){render();if(t==='adjust')thumbsSoon();}
}
function setAdj(P,silent){
  S.adj={...ZERO,...P};ADJ.forEach(a=>setRange('a_'+a[0],S.adj[a[0]]));
  S.preset=null;$$('.pre').forEach(b=>b.classList.remove('on'));if(!Object.keys(P).length){S.preset='Original';const o=$('.pre[data-p=Original]');o&&o.classList.add('on');}
  if(!silent&&S.img)render();
}
function thumbsNow(){
  if(!S.img||!$('.pre canvas'))return;const sw=96,sh=72,s=mk(sw,sh),sx=s.getContext('2d'),k=Math.max(sw/S.img.width,sh/S.img.height),w=S.img.width*k,h=S.img.height*k;
  sx.drawImage(S.img,(sw-w)/2,(sh-h)/2,w,h);const base=sx.getImageData(0,0,sw,sh);
  $$('.pre').forEach(b=>{const id=new ImageData(new Uint8ClampedArray(base.data),sw,sh);adjustPixels(id,PRESETS[b.dataset.p],sw/S.img.width*1.5);b.querySelector('canvas').getContext('2d').putImageData(id,0,0);});
}
const thumbsSoon=debounce(()=>{if(S.tab==='adjust')thumbsNow();},250);

/* ======================================================================
   Resize / crop / export helpers
   ====================================================================== */
function syncResizeFields(){
  if(!S.img||!$('#r_w'))return;$('#r_w').value=S.img.width;$('#r_h').value=S.img.height;$('#r_p').value=100;$('#rOrig').textContent=`${S.img.width} × ${S.img.height}`;resizeInfo();
}
function resizeInfo(){
  if(!S.img||!$('#r_info'))return;const w=+$('#r_w').value,h=+$('#r_h').value;if(!(w>0&&h>0))return;
  $('#r_info').textContent=`${w} × ${h} · ${(w*h/1e6).toFixed(1)} MP${w>S.img.width?' · upscaling':''}`;
}
function initCrop(){if(S.img)S.crop={x:0,y:0,w:S.img.width,h:S.img.height};updCropInfo();}
function updCropInfo(){const e=$('#c_info');if(e&&S.crop)e.textContent=`${Math.round(S.crop.w)} × ${Math.round(S.crop.h)} px`;}
function cropRatio(){const a=$('#c_pills .on'),v=a?a.dataset.a:'free';return v==='free'?0:v==='orig'?S.img.width/S.img.height:+v;}
function setCropRatio(){
  const r=cropRatio();if(!r||!S.crop)return;const c=S.crop,cx=c.x+c.w/2,cy=c.y+c.h/2;let w=c.w,h=w/r;if(h>c.h){h=c.h;w=h*r;}
  S.crop={x:cx-w/2,y:cy-h/2,w,h};updCropInfo();drawOverlay();
}
const MIME={jpeg:'image/jpeg',png:'image/png',webp:'image/webp'};
const toBlob=(c,type,q)=>new Promise(r=>c.toBlob(r,type,q));
async function exportBlob(canvas,fmt,q,kb){
  let src=canvas;if(fmt==='jpeg'){src=mk(canvas.width,canvas.height);const x=src.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,src.width,src.height);x.drawImage(canvas,0,0);}
  if(fmt==='png'||!kb)return toBlob(src,MIME[fmt],q);
  let lo=.03,hi=.98,best=null;
  for(let i=0;i<9;i++){const m=(lo+hi)/2,b=await toBlob(src,MIME[fmt],m);if(b.size<=kb*1024){best=b;lo=m;}else hi=m;}
  return best||toBlob(src,MIME[fmt],.03);
}
let expSeq=0;
async function updateExportInfo(){
  if(!S.img||S.tab!=='export')return;const seq=++expSeq,f=sv('x_fmt');$('#x_q').disabled=f==='png';
  const b=await exportBlob(S.img,f,val('x_q')/100,val('x_kb')||0);if(seq!==expSeq)return;
  $('#x_info').textContent=`${S.img.width}×${S.img.height} · ${b.size>1048576?(b.size/1048576).toFixed(2)+' MB':(b.size/1024).toFixed(0)+' KB'}`;
  store.set('fmt',f);store.set('q',val('x_q'));
}
const exportSoon=debounce(updateExportInfo,350);
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);}
const extOf=f=>f==='jpeg'?'jpg':f;
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

/* ======================================================================
   Overlay + pointer tools
   ====================================================================== */
const getMode=g=>{const b=$('#'+g+' .on');return b?b.dataset.m:'';};
function drawOverlay(){
  if(!S.img)return;const W=ov.width,H=ov.height;octx.clearRect(0,0,W,H);
  if(S.tab==='remove'&&S.mask)octx.drawImage(S.mask,0,0);
  if(S.tab==='crop'&&S.crop){
    const c=S.crop,z=1/S.zoom;octx.fillStyle='rgba(0,0,0,.58)';
    octx.fillRect(0,0,W,c.y);octx.fillRect(0,c.y+c.h,W,H-c.y-c.h);octx.fillRect(0,c.y,c.x,c.h);octx.fillRect(c.x+c.w,c.y,W-c.x-c.w,c.h);
    octx.strokeStyle='#fff';octx.lineWidth=1.5*z;octx.strokeRect(c.x,c.y,c.w,c.h);octx.lineWidth=z;octx.strokeStyle='rgba(255,255,255,.35)';
    for(let i=1;i<3;i++){octx.beginPath();octx.moveTo(c.x+c.w*i/3,c.y);octx.lineTo(c.x+c.w*i/3,c.y+c.h);octx.moveTo(c.x,c.y+c.h*i/3);octx.lineTo(c.x+c.w,c.y+c.h*i/3);octx.stroke();}
    octx.fillStyle='#fff';const s=9*z;for(const[hx,hy]of[[0,0],[.5,0],[1,0],[0,.5],[1,.5],[0,1],[.5,1],[1,1]])octx.fillRect(c.x+c.w*hx-s/2,c.y+c.h*hy-s/2,s,s);
  }
  if(S.temp)S.temp(octx);
}
function pt(e){const r=ov.getBoundingClientRect();return{x:(e.clientX-r.left)*ov.width/r.width,y:(e.clientY-r.top)*ov.height/r.height};}
const cur=$('#cursor');
function brushSize(){return S.tab==='draw'?val('d_size'):val('m_size');}
function brushActive(){return S.tab==='draw'?['brush','blur','pixel'].includes(getMode('modes')):S.tab==='remove'&&getMode('rmodes')==='brush';}
function updateCursor(e){
  if(!brushActive()||!S.img){cur.hidden=true;return;}
  if(e){const r=$('#stage').getBoundingClientRect();cur.style.left=(e.clientX-r.left)+'px';cur.style.top=(e.clientY-r.top)+'px';}
  const d=Math.max(4,brushSize()*S.zoom);cur.style.width=cur.style.height=d+'px';cur.hidden=false;
}
function hideCursor(){cur.hidden=true;}
let drag=null;
function strokePts(a,b,step,fn){const d=Math.hypot(b.x-a.x,b.y-a.y),n=Math.max(1,Math.ceil(d/step));for(let i=1;i<=n;i++)fn({x:a.x+(b.x-a.x)*i/n,y:a.y+(b.y-a.y)*i/n});}
function maskStroke(a,b){
  const s=val('m_size');for(const c of[S.mask.getContext('2d'),octx]){c.strokeStyle=c.fillStyle='rgba(255,40,40,.6)';c.lineCap='round';c.lineJoin='round';c.lineWidth=s;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();c.beginPath();c.arc(b.x,b.y,s/2,0,7);c.fill();}
}
function normRect(a,b){return{x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),w:Math.abs(a.x-b.x),h:Math.abs(a.y-b.y)};}
function drawShape(ctx,m,a,b){
  ctx.save();ctx.globalAlpha=val('d_op')/100;ctx.strokeStyle=ctx.fillStyle=sv('d_col');ctx.lineWidth=Math.max(1,val('d_size')/4);ctx.lineCap='round';
  const r=normRect(a,b);ctx.beginPath();
  if(m==='rect')ctx.rect(r.x,r.y,r.w,r.h);else if(m==='ellipse')ctx.ellipse(r.x+r.w/2,r.y+r.h/2,r.w/2,r.h/2,0,0,7);else{ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);}
  if(m!=='line'&&chk('d_fill'))ctx.fill();else ctx.stroke();ctx.restore();
}
function paintText(ctx,p,alpha){
  const fs=val('d_fs');ctx.save();ctx.globalAlpha=alpha;ctx.font=`${chk('d_bold')?'bold ':''}${fs}px ${sv('d_font')}`;ctx.textBaseline='top';ctx.fillStyle=sv('d_col');
  sv('d_txt').split('\n').forEach((ln,i)=>{if(val('d_stroke')){ctx.lineWidth=val('d_stroke');ctx.strokeStyle='#000';ctx.lineJoin='round';ctx.strokeText(ln,p.x,p.y+i*fs*1.2);}ctx.fillText(ln,p.x,p.y+i*fs*1.2);});
  ctx.restore();
}
ov.addEventListener('pointerdown',e=>{
  if(!S.img)return;
  if(e.button===1||(e.button===0&&S.space)){drag={pan:true,x:e.clientX,y:e.clientY,sl:scrollEl.scrollLeft,st:scrollEl.scrollTop};ov.classList.add('grab');ov.setPointerCapture(e.pointerId);e.preventDefault();return;}
  if(e.button>0)return;ov.setPointerCapture(e.pointerId);const p=pt(e);drag={p0:p,last:p};
  if(S.tab==='crop'){
    const c=S.crop,r=14/S.zoom,nl=Math.abs(p.x-c.x)<r,nr=Math.abs(p.x-c.x-c.w)<r,nt=Math.abs(p.y-c.y)<r,nb=Math.abs(p.y-c.y-c.h)<r,inX=p.x>c.x-r&&p.x<c.x+c.w+r,inY=p.y>c.y-r&&p.y<c.y+c.h+r;
    let mode='';if(inY&&inX){mode=(nt?'t':nb?'b':'')+(nl?'l':nr?'r':'');if(!mode&&p.x>c.x&&p.x<c.x+c.w&&p.y>c.y&&p.y<c.y+c.h)mode='move';}
    if(!mode){S.crop={x:p.x,y:p.y,w:1,h:1};mode='br';}
    drag.mode=mode;drag.orig={...S.crop};
  }else if(S.tab==='draw'){
    const m=getMode('modes');drag.m=m;
    if(m==='text'){const ctx=beginEdit();paintText(ctx,p,val('d_op')/100);afterChange();drag=null;return;}
    if(m==='brush'){octx.clearRect(0,0,ov.width,ov.height);ov.style.opacity=val('d_op')/100;}
    if(m==='blur'||m==='pixel'){
      const w=S.img.width,h=S.img.height,sz=Math.max(2,val('d_size')/2);
      if(m==='blur'){const id=getID(S.img);id.data.set(blurRGBA(id.data,w,h,Math.max(2,sz/2)));drag.fx=mk(w,h);drag.fx.getContext('2d').putImageData(id,0,0);}
      else{const b=Math.max(3,Math.round(sz/2)),sm=mk(w/b,h/b);sm.getContext('2d').drawImage(S.img,0,0,sm.width,sm.height);drag.fx=mk(w,h);const x=drag.fx.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(sm,0,0,w,h);}
      commit(clone(S.img));
    }
    if(['brush','blur','pixel'].includes(m))drawStroke(p,p);
  }else if(S.tab==='remove'){
    const m=getMode('rmodes');drag.m=m;if(m==='brush')maskStroke(p,p);if(m==='wand'){wand(p);drag=null;}
  }
});
function drawStroke(a,b){
  const m=drag.m,r=val('d_size')/2;
  if(m==='brush'){octx.strokeStyle=octx.fillStyle=sv('d_col');octx.lineCap='round';octx.lineWidth=r*2;octx.beginPath();octx.moveTo(a.x,a.y);octx.lineTo(b.x,b.y);octx.stroke();octx.beginPath();octx.arc(b.x,b.y,r,0,7);octx.fill();return;}
  const ctx=S.img.getContext('2d');
  strokePts(a,b,Math.max(1,r/3),q=>{for(const c of[ctx,vctx]){c.save();c.beginPath();c.arc(q.x,q.y,r,0,7);c.clip();c.drawImage(drag.fx,0,0);c.restore();}});
}
ov.addEventListener('pointermove',e=>{
  if(!S.img)return;
  if(drag&&drag.pan){scrollEl.scrollLeft=drag.sl-(e.clientX-drag.x);scrollEl.scrollTop=drag.st-(e.clientY-drag.y);return;}
  const p=pt(e);$('#sPos').textContent=`${Math.round(p.x)}, ${Math.round(p.y)}`;updateCursor(e);
  if(!drag){
    if(S.tab==='draw'&&getMode('modes')==='text'){S.temp=c=>paintText(c,p,.6*val('d_op')/100);drawOverlay();}
    return;
  }
  if(S.tab==='crop')dragCrop(p);
  else if(S.tab==='draw'){
    if(['brush','blur','pixel'].includes(drag.m)){
      const evs=e.getCoalescedEvents?e.getCoalescedEvents():[e];let a=drag.last;
      for(const ce of evs){const q=pt(ce);drawStroke(a,q);a=q;}drag.last=a;return;
    }else if(['rect','ellipse','line'].includes(drag.m)){const a=drag.p0;S.temp=c=>drawShape(c,drag.m,a,p);drawOverlay();}
  }else if(S.tab==='remove'){
    if(drag.m==='brush'){const evs=e.getCoalescedEvents?e.getCoalescedEvents():[e];let a=drag.last;for(const ce of evs){const q=pt(ce);maskStroke(a,q);a=q;}drag.last=a;return;}
    else if(drag.m==='rect'||drag.m==='detect'){const r=normRect(drag.p0,p);S.temp=c=>{c.strokeStyle='#ff5a5a';c.lineWidth=2/S.zoom;c.setLineDash([6/S.zoom,4/S.zoom]);c.strokeRect(r.x,r.y,r.w,r.h);};drawOverlay();}
  }
  drag.last=p;
});
ov.addEventListener('pointerup',e=>{
  if(!drag)return;const d=drag;drag=null;
  if(d.pan){ov.classList.remove('grab');return;}
  const p=pt(e);S.temp=null;
  if(S.tab==='draw'){
    if(d.m==='brush'){const ctx=beginEdit();ctx.globalAlpha=val('d_op')/100;ctx.drawImage(ov,0,0);ctx.globalAlpha=1;ov.style.opacity=1;octx.clearRect(0,0,ov.width,ov.height);afterChange();return;}
    if(['rect','ellipse','line'].includes(d.m)){const ctx=beginEdit();drawShape(ctx,d.m,d.p0,p);afterChange();return;}
    render();
  }else if(S.tab==='remove'){
    if(d.m==='rect'){const r=normRect(d.p0,p),c=S.mask.getContext('2d');c.fillStyle='rgba(255,40,40,.6)';c.fillRect(r.x,r.y,r.w,r.h);growMask(val('m_grow'));}
    else if(d.m==='detect')detectIn(normRect(d.p0,p));
    else if(d.m==='brush')growMask(val('m_grow'));
  }
  drawOverlay();
});
ov.addEventListener('pointerleave',()=>{if(!drag){hideCursor();if(S.temp&&S.tab==='draw'){S.temp=null;drawOverlay();}}});
ov.addEventListener('pointerenter',e=>updateCursor(e));
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

/* ======================================================================
   Wiring
   ====================================================================== */
function sampleCanvas(){
  const W=1600,H=1067,c=mk(W,H),x=c.getContext('2d');
  let g=x.createLinearGradient(0,0,0,H*.62);g.addColorStop(0,'#2c5aa0');g.addColorStop(.6,'#f6a96b');g.addColorStop(1,'#fbd9a0');x.fillStyle=g;x.fillRect(0,0,W,H);
  x.fillStyle='rgba(255,244,214,.95)';x.beginPath();x.arc(1120,440,70,0,7);x.fill();
  const ridge=(y0,amp,col,seed)=>{x.fillStyle=col;x.beginPath();x.moveTo(0,H);for(let i=0;i<=W;i+=20)x.lineTo(i,y0+Math.sin(i/170+seed)*amp+Math.sin(i/57+seed*2)*amp*.35);x.lineTo(W,H);x.fill();};
  ridge(560,70,'#6a5a86',1);ridge(650,60,'#41406e',3);ridge(740,45,'#232b4f',5);
  g=x.createLinearGradient(0,800,0,H);g.addColorStop(0,'#2a5b7a');g.addColorStop(1,'#10263a');x.fillStyle=g;x.fillRect(0,800,W,H-800);
  for(let i=0;i<2500;i++){x.fillStyle=`rgba(255,255,255,${Math.random()*.06})`;x.fillRect(Math.random()*W,Math.random()*H,3,3);}
  x.save();x.translate(800,520);x.rotate(-.12);x.font='bold 120px Inter,Arial';x.textAlign='center';x.fillStyle='rgba(255,255,255,.45)';x.fillText('SAMPLE STOCK',0,0);x.restore();
  return c;
}
function wire(){
  const on=(id,fn)=>{$('#'+id).onclick=async()=>{if(needImg())await fn();};};
  const needImg=()=>{if(!S.img){toast('Open a photo first');return false;}return true;};
  // Adjust
  $$('#presets .pre').forEach(b=>b.onclick=()=>{if(!needImg())return;setAdj(PRESETS[b.dataset.p]);S.preset=b.dataset.p;b.classList.add('on');});
  on('adjReset',()=>setAdj({}));
  on('adjApply',()=>task('Applying adjustments…',async p=>{
    if(isNeutral(S.adj))return;const P={...S.adj};let out=null;
    if(G.ok){await tick();try{out=glFull(P);}catch(e){console.warn(e);out=null;}}
    if(out)commit(out);else{const r=await runOp('adjust',getID(S.img),{P},p);applyID(r);}
    setAdj({});}));
  // Enhance
  const enh=(msg,op,args)=>()=>task(msg,async p=>{applyID(await runOp(op,getID(S.img),typeof args==='function'?args():args,p));});
  on('e_auto',enh('Enhancing…','enhance'));on('e_wb',enh('Balancing colour…','wb'));
  on('e_low',enh('Lifting shadows…','preset',{P:{exposure:20,shadows:60,highlights:-10,contrast:8,vibrance:20,sharpen:10}}));
  on('e_hdr',enh('Applying HDR look…','preset',{P:PRESETS.HDR}));
  on('e_denoise',enh('Reducing noise…','denoise',()=>{const s=val('e_dn');return{radius:s>60?3:2,sig:6+s*.5};}));
  on('e_sharp',enh('Sharpening…','sharpen',()=>({amt:val('e_sh')/100,r:val('e_shr')})));
  on('e_skin',enh('Smoothing skin…','skin',()=>({strength:val('e_sk')})));
  on('e_upgo',()=>task('Upscaling…',async p=>{commit(await upscale(S.img,+sv('e_up'),p));fit();render();}));
  // Resize
  const rw=$('#r_w'),rh=$('#r_h'),rp=$('#r_p');
  rw.oninput=()=>{if(!S.img)return;if(chk('r_lock'))rh.value=Math.round(rw.value*S.img.height/S.img.width);rp.value=Math.round(rw.value/S.img.width*100);resizeInfo();};
  rh.oninput=()=>{if(!S.img)return;if(chk('r_lock'))rw.value=Math.round(rh.value*S.img.width/S.img.height);rp.value=Math.round(rh.value/S.img.height*100);resizeInfo();};
  rp.oninput=()=>{if(!S.img)return;rw.value=Math.round(S.img.width*rp.value/100);rh.value=Math.round(S.img.height*rp.value/100);resizeInfo();};
  $('#r_pre').onchange=e=>{if(!e.target.value)return;const[w,h]=e.target.value.split('x');rw.value=w;rh.value=h;$('#r_lock').checked=false;resizeInfo();};
  on('r_go',()=>task('Resizing…',async()=>{
    const w=Math.round(rw.value),h=Math.round(rh.value);if(!(w>0&&h>0))throw 'Enter a valid size.';if(w*h>150e6)throw 'Too large (limit ≈150 MP).';
    commit(fitResize(S.img,w,h,$('#r_pre').value?sv('r_fit'):'stretch',sv('r_bg'),chk('r_smooth')));fit();render();}));
  // Crop
  $$('#c_pills .pill').forEach(b=>b.onclick=()=>{$$('#c_pills .pill').forEach(x=>x.classList.remove('on'));b.classList.add('on');if(S.img)setCropRatio();});
  on('c_all',()=>{initCrop();setCropRatio();drawOverlay();});
  on('c_go',()=>{const c=S.crop;if(!c)return;const x=Math.round(c.x),y=Math.round(c.y),w=Math.max(1,Math.round(c.w)),h=Math.max(1,Math.round(c.h)),n=mk(w,h);n.getContext('2d').drawImage(S.img,x,y,w,h,0,0,w,h);S.crop=null;commit(n);initCrop();fit();render();});
  on('t_l',()=>flipRot('l'));on('t_r',()=>flipRot('r'));on('t_h',()=>flipRot('h'));on('t_v',()=>flipRot('v'));
  on('t_go',()=>{const a=val('t_ang');if(!a)return;commit(rotateCanvas(S.img,a,chk('t_auto')));setRange('t_ang',0);fit();render();});
  // Draw
  $$('#modes .pill').forEach(b=>b.onclick=()=>{$$('#modes .pill').forEach(x=>x.classList.remove('on'));b.classList.add('on');S.temp=null;drawOverlay();updateCursor();});
  // Watermark add
  $$('#w_pos button').forEach(b=>b.onclick=()=>{$$('#w_pos button').forEach(x=>x.classList.remove('on'));b.classList.add('on');markPreview();});
  $('#w_pick').onclick=()=>$('#logoFile').click();
  $('#logoFile').onchange=async e=>{const f=e.target.files[0];if(f){S.logo=await createImageBitmap(f);$('#w_kind').value='logo';markPreview();toast('Logo loaded');}e.target.value='';};
  on('w_go',()=>{try{const o=markOpts();S.temp=null;const ctx=beginEdit();stamp(ctx,S.img.width,S.img.height,o);afterChange();}catch(e){S.hist.length&&undo();S.redo=[];toast(e);}});
  // Remove
  const tips={brush:'Paint over the watermark. Works best on text and logos.',rect:'Drag a rectangle around the watermark.',wand:'Click a watermark colour to select similar pixels.',detect:'Drag a box around the watermark; contrasting pixels inside are selected.'};
  $$('#rmodes .pill').forEach(b=>b.onclick=()=>{$$('#rmodes .pill').forEach(x=>x.classList.remove('on'));b.classList.add('on');$('#m_tip').textContent=tips[b.dataset.m];updateCursor();});
  on('m_clear',()=>{S.mask=mk(S.img.width,S.img.height);drawOverlay();});
  on('m_growgo',()=>growMask(Math.max(1,val('m_grow'))));
  on('m_go',()=>task('Removing watermark…',async p=>{const out=clone(S.img);await inpaint(out,S.mask,{mode:sv('m_mode'),ph:val('m_ph'),samples:val('m_samples')},p);commit(out);S.mask=mk(out.width,out.height);render();toast('Done. Undo if it needs another pass.');}));
  // Export
  on('x_dl',()=>task('Encoding…',async()=>{const f=sv('x_fmt'),b=await exportBlob(S.img,f,val('x_q')/100,val('x_kb')||0);
    if(val('x_kb')&&b.size>val('x_kb')*1024)toast(`Smallest reachable: ${(b.size/1024).toFixed(0)} KB. Reduce the dimensions in Resize.`);
    download(b,(sv('x_name')||S.name)+'.'+extOf(f));}));
  on('x_copy',async()=>{try{const b=await toBlob(S.img,'image/png');await navigator.clipboard.write([new ClipboardItem({'image/png':b})]);toast('Copied to clipboard');}catch(e){toast('Clipboard is not available in this browser');}});
  $('#x_fmt').value=store.get('fmt','jpeg');setRange('x_q',+store.get('q',90));
  $('#bExport').onclick=()=>setTab('export');
  // Batch
  $('#b_pick').onclick=()=>$('#batchFiles').click();
  $('#batchFiles').onchange=e=>{S.batch=[...e.target.files];$('#b_list').textContent=S.batch.length?S.batch.length+' file(s): '+S.batch.slice(0,3).map(f=>f.name).join(', ')+(S.batch.length>3?'…':''):'No files chosen.';e.target.value='';};
  $('#b_go').onclick=()=>{if(!S.batch.length)return toast('Choose photos first');task('Batch processing…',async p=>{
    const out=[],used=new Set(),fmt=sv('b_fmt'),v=val('b_val');
    for(let i=0;i<S.batch.length;i++){
      const f=S.batch[i];let bmp;try{bmp=await createImageBitmap(f);}catch(e){continue;}
      let c=mk(bmp.width,bmp.height);c.getContext('2d').drawImage(bmp,0,0);bmp.close&&bmp.close();
      const m=sv('b_mode'),W=c.width,H=c.height,sc=m==='long'?v/Math.max(W,H):m==='w'?v/W:m==='h'?v/H:v/100;
      if(sc!==1)c=resizeTo(c,W*sc,H*sc);
      if(chk('b_enh')){const r=await runOp('enhance',getID(c));c.getContext('2d').putImageData(r,0,0);}
      const b=await exportBlob(c,fmt,val('b_q')/100,0);let nm=f.name.replace(/\.[^.]+$/,'')+'-resized',k=nm,n=1;while(used.has(k))k=nm+'-'+(++n);used.add(k);
      out.push({name:k+'.'+extOf(fmt),data:new Uint8Array(await b.arrayBuffer())});free(c);p((i+1)/S.batch.length);
    }
    if(!out.length)throw 'No readable images.';download(makeZip(out),'photo-studio-batch.zip');});};
  // Header
  const openDlg=()=>$('#file').click();
  $('#bOpen').onclick=openDlg;$('#dzOpen').onclick=e=>{e.stopPropagation();openDlg();};$('#drop').onclick=openDlg;
  $('#dzSample').onclick=e=>{e.stopPropagation();setImage(sampleCanvas(),'sample');};
  $('#file').onchange=e=>{const f=e.target.files[0];if(f)loadBlob(f,f.name);e.target.value='';};
  $('#bUndo').onclick=undo;$('#bRedo').onclick=redo;
  const cmp=v=>()=>{if(S.comparing!==v){S.comparing=v;if(S.img)render();}};const bc=$('#bCmp');bc.onpointerdown=cmp(true);bc.onpointerup=bc.onpointerleave=bc.onpointercancel=cmp(false);
  $('#zIn').onclick=()=>setZoom(S.zoom*1.25);$('#zOut').onclick=()=>setZoom(S.zoom/1.25);$('#zLabel').onclick=()=>setZoom(1);$('#zFit').onclick=()=>{fit();render();};
  const theme=store.get('theme',matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
  const applyTheme=t=>{document.documentElement.dataset.theme=t;$('#bTheme use').setAttribute('href',t==='dark'?'#i-sun':'#i-moon');store.set('theme',t);};
  applyTheme(theme);$('#bTheme').onclick=()=>applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
}
scrollEl.addEventListener('wheel',e=>{if((e.ctrlKey||e.metaKey)&&S.img){e.preventDefault();setZoom(S.zoom*(e.deltaY<0?1.12:1/1.12),e.clientX,e.clientY);}},{passive:false});
const stg=$('#stage');
stg.addEventListener('dragover',e=>{e.preventDefault();$('#drop').classList.add('over');});
stg.addEventListener('dragleave',()=>$('#drop').classList.remove('over'));
stg.addEventListener('drop',e=>{e.preventDefault();$('#drop').classList.remove('over');const f=[...e.dataTransfer.files].find(f=>f.type.startsWith('image/'));if(f)loadBlob(f,f.name);});
window.addEventListener('paste',e=>{const it=[...((e.clipboardData||{}).items||[])].find(i=>i.type.startsWith('image/'));if(it)loadBlob(it.getAsFile(),'pasted');});
window.addEventListener('keydown',e=>{
  const typing=/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)&&document.activeElement.type!=='range'&&document.activeElement.type!=='checkbox';
  if(e.key===' '&&!typing){S.space=true;ov.classList.add('pan');e.preventDefault();return;}
  if(typing)return;
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&!e.shiftKey){e.preventDefault();undo();}
  else if((e.ctrlKey||e.metaKey)&&(e.key.toLowerCase()==='y'||(e.shiftKey&&e.key.toLowerCase()==='z'))){e.preventDefault();redo();}
  else if(e.key==='+'||e.key==='=')setZoom(S.zoom*1.25);else if(e.key==='-')setZoom(S.zoom/1.25);
  else if(e.key==='f'||e.key==='F'){fit();render();}else if(e.key==='0')setZoom(1);
  else if(e.key==='\\'&&!S.comparing){S.comparing=true;render();}
  else if((e.key==='['||e.key===']')&&(S.tab==='draw'||S.tab==='remove')){const id=S.tab==='draw'?'d_size':'m_size',v=clamp(val(id)*(e.key===']'?1.2:1/1.2),2,300);setRange(id,Math.round(v));updateCursor();}
});
window.addEventListener('keyup',e=>{if(e.key===' '){S.space=false;ov.classList.remove('pan');}if(e.key==='\\'&&S.comparing){S.comparing=false;render();}});
window.addEventListener('resize',debounce(()=>{if(S.img){fit();render();}},120));
glInit();buildUI();statusGpu();

/* ======================================================================
   Self-test: open index.html#selftest
   ====================================================================== */
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
    R.worker=!!workerURL;
    // GPU vs CPU parity (colour pipeline), if WebGL2 is available
    R.gl=G.ok;
    if(G.ok){
      S.img=clone(clean);const P={exposure:15,contrast:20,saturation:25,temperature:12,shadows:25,highlights:-15,hue:20,vibrance:20};
      const out=glFull(P),cpu=getID(clean);adjustPixels(cpu,P,1);const cc=mk(W,H);cc.getContext('2d').putImageData(cpu,0,0);
      R.gl_vs_cpu=diff(out,cc,{x:0,y:0,w:W,h:H});
      const flip=glFull({});R.gl_identity=diff(flip,clean,{x:0,y:0,w:W,h:H});
      const outD=glFull({sharpen:40,clarity:30,vignette:40,grain:10,blur:10});R.gl_detail_ok=!!outD&&outD.width===W;
    }
    const up=await upscale(clean,2);R.upscale=[up.width,up.height];
    const rs=resizeTo(clean,100,70);R.resize=[rs.width,rs.height];
    const rot=rotateCanvas(clean,10,true);R.rot=[rot.width,rot.height];
    const z=makeZip([{name:'a.txt',data:new TextEncoder().encode('hello')}]);R.zip=z.size;
    const jb=await exportBlob(clean,'jpeg',.9,8);R.jpeg_kb_limit=jb.size<=8*1024;
    const e2=await runOp('enhance',getID(clean));R.enh_ok=e2.width===W;
    const dn=await runOp('denoise',getID(clean),{radius:2,sig:20});R.denoise_ok=dn.width===W;
    const sk=await runOp('skin',getID(clean),{strength:50});R.skin_ok=sk.width===W;
    R.pass=R.after_patch<R.before&&R.after_smooth<R.before&&R.upscale[0]===840&&R.jpeg_kb_limit&&(!G.ok||(R.gl_vs_cpu<3&&R.gl_identity<1.5&&R.gl_detail_ok));
  }catch(e){R.error=String(e&&e.stack||e);}
  const pre=document.createElement('pre');pre.id='selftest';pre.textContent=JSON.stringify(R);document.body.appendChild(pre);document.title='SELFTEST '+(R.pass?'PASS ':'FAIL ')+JSON.stringify(R);
})();
