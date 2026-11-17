const WA = "923000000000"; // your WhatsApp number (country code, no +)
const P = [
 {id:"sunflower",name:"Sunflower Dhanak Set",price:6500,img:"images/sunflower.jpg",back:"images/sunflower-model.jpg",hero:"images/sunflower-model.jpg",bg:"#e3a21a",cw:"Yellow & Brown",
  z:["images/sunflower-d1.jpg","images/sunflower-d2.jpg","images/sunflower-d3.jpg"],d:["Premium dhanak kurta","Handmade sunflower buttons","Sleeve ties with sunflower tassels","Crinkle dupatta + plain palazzo"]},
 {id:"strawberry",name:"Strawberry Cream Set",price:6200,img:"images/strawberry.jpg",back:"images/strawberry-model.jpg",hero:"images/strawberry-model.jpg",bg:"#f1e8a8",cw:"Cream & Red",
  z:["images/strawberry-d1.jpg","images/strawberry-d2.jpg","images/strawberry-d3.jpg"],d:["Soft cotton square-neck kurta","Crochet strawberry neck tassels","Red button sleeve ties","Red lace trim + pearl-dotted dupatta"]},
 {id:"olive",name:"Olive Lace Set",price:5800,img:"images/olive.jpg",back:"images/olive-model.jpg",bg:"#6f6a2a",cw:"Olive & Black",
  z:["images/olive-d1.jpg","images/olive-d2.jpg","images/olive-d3.jpg"],d:["Olive notch-neck kurta","Black lace cuffs and hem","Wide black sharara","Easy everyday luxury"]},
 {id:"abaya",name:"Ribbed Abaya Set",price:9800,img:"images/mocha.jpg",back:"images/mocha-model.jpg",bg:"#7a5a46",
  cols:[["Mocha","#7a5a46","images/mocha.jpg"],["Grey","#9a9a9e","images/abaya-grey.jpg"],["Black","#1d1b1c","images/abaya-black.jpg"],["Burgundy","#6e1236","images/abaya-burgundy.jpg"]],
  z:["images/mocha-d1.jpg","images/mocha-d2.jpg","images/mocha-d3.jpg"],d:["Open-front soft abaya","Ribbed turtleneck inner dress","Available in 4 colours","Matching beret (mocha)"]}
];
const SZ={S:{s:.94,n:'Small · Bust 34" · Length 44"'},M:{s:1,n:'Medium · Bust 36" · Length 45"'},L:{s:1.06,n:'Large · Bust 38" · Length 46"'}};
const $=(s,r=document)=>r.querySelector(s),money=n=>"PKR "+n.toLocaleString("en-US");
let cart=[];try{cart=JSON.parse(localStorage.getItem("bz")||"[]")}catch(e){}
const saveC=()=>{try{localStorage.setItem("bz",JSON.stringify(cart))}catch(e){}};
const ST=new WeakMap(),st=pv=>ST.get(pv)||(ST.set(pv,{size:null,col:0}),ST.get(pv));
let moved=0;
// ---- shared chrome ----
document.body.insertAdjacentHTML("afterbegin",`${$("#hero")?'<div class="curtain"><i></i><i></i><div class="cl">by<em>Aleezay</em></div></div>':''}<div id="bar"></div>
<header class="nav"><a class="logo" href="index.html">by<em>Aleezay</em></a><nav><a href="index.html">Home</a><a href="shop.html">Collection</a><a href="index.html#story">Details</a><a href="index.html#sizes">Size Guide</a></nav><button id="cartBtn" class="cart-btn">Bag <span id="cartCount">0</span></button></header>`);
document.body.insertAdjacentHTML("beforeend",`<footer class="ft"><div class="logo">by<em>Aleezay</em></div><div><a href="index.html">Home</a><a href="shop.html">Collection</a><a href="index.html#sizes">Size Guide</a><a id="waLink" href="#" target="_blank">WhatsApp</a></div><small>© 2026 byAleezay. All rights reserved.</small></footer>
<section id="panel" class="panel"><div class="pbox" id="pbox"></div></section>
<aside id="drawer" class="drawer"><div class="dhead"><h3>Your Bag</h3><button id="closeCart">✕</button></div><div id="items" class="items"></div><div class="dfoot"><div class="total"><span>Total</span><b id="total">PKR 0</b></div><button id="checkout" class="btn full">Order on WhatsApp</button></div></aside><div id="veil" class="veil"></div><div id="toast" class="toast"></div>`);
$("#waLink").href="https://wa.me/"+WA;
// ---- product view (used in popup + shop page) ----
const view=p=>`<div class="pv" data-id="${p.id}"><div class="stage"><div class="card3d"><div class="face" style="background:${p.bg}"><img class="fr" src="${p.img}" alt="${p.name}"></div><div class="face back" style="background:${p.bg}"><img src="${p.back}" alt="${p.name} on model"></div></div>
<div class="ctrls"><button class="tab on" data-v="0">Dress</button><button class="tab" data-v="1">On Model</button></div>
<div class="zoomrow">${p.z.map(z=>`<div class="z" style="background-image:url(${z})"></div>`).join("")}</div></div>
<div class="info"><span class="tag">Limited piece</span><h2>${p.name}</h2><div class="price">${money(p.price)}</div><ul>${p.d.map(x=>`<li>${x}</li>`).join("")}</ul>
${p.cols?`<b style="font-size:12px;letter-spacing:.2em">COLOUR</b><span class="cn">${p.cols[0][0]}</span><div class="row">${p.cols.map((c,i)=>`<button class="sw ${i?"":"on"}" data-c="${i}" style="background:${c[1]}" title="${c[0]}"></button>`).join("")}</div>`:`<div class="cw">Colourway · ${p.cw}</div>`}
<b style="font-size:12px;letter-spacing:.2em">SIZE</b><div class="row">${Object.keys(SZ).map(s=>`<button class="sz" data-s="${s}">${s}</button>`).join("")}</div>
<div class="note"></div><button class="btn" data-add>Add to bag</button></div></div>`;
function tilt(pv){const c=pv.querySelector(".card3d"),s=pv.querySelector(".stage");
 s.onmousemove=e=>{if(c.classList.contains("flip"))return;const r=c.getBoundingClientRect();c.style.transform=`rotateY(${((e.clientX-r.left)/r.width-.5)*26}deg) rotateX(${-((e.clientY-r.top)/r.height-.5)*18}deg)`};
 s.onmouseleave=()=>c.style.transform=""}
function openPop(id){$("#pbox").innerHTML='<button class="x" data-x>✕</button>'+view(P.find(p=>p.id===id));tilt($("#pbox .pv"));$("#panel").classList.add("open")}
if($("#list")){$("#list").innerHTML=P.map(p=>`<section class="prodsec" id="${p.id}"><div class="rv">${view(p)}</div></section>`).join("");
 document.querySelectorAll(".pv").forEach(tilt);if(location.hash)setTimeout(()=>$(location.hash)?.scrollIntoView(),50)}
// ---- hanging rail (home) ----
const hook='<svg class="hook" viewBox="0 0 120 64"><circle cx="60" cy="6" r="4" fill="none" stroke="#d4b06a" stroke-width="1.5"/><path d="M60 10 4 62M60 10l56 52" stroke="#d4b06a" stroke-width="1.2" fill="none"/></svg>';
if($("#strip")){
 $("#strip").innerHTML=P.map((p,i)=>`<div class="drop" style="--i:${i}"><button class="hang" data-id="${p.id}">${hook}<span class="garment" style="background-color:${p.bg};background-image:url(${p.hero||p.img})"></span><span class="no">0${i+1}</span><span class="n">${p.name}</span><span class="p">${money(p.price)}</span></button></div>`).join("");
 const track=$("#track"),hangs=[...document.querySelectorAll(".hang")],sp=hangs.map(()=>({a:0,v:0,ry:0}));
 let mx=innerWidth/2,my=innerHeight/2,last=0,drag=false,sx=0,sl=0;
 addEventListener("pointermove",e=>{mx=e.clientX;my=e.clientY;$("#scene").style.transform=`rotateY(${(mx/innerWidth-.5)*8}deg) rotateX(${-(my/innerHeight-.5)*5}deg)`;if(drag){const dx=e.clientX-sx;moved=Math.max(moved,Math.abs(dx));track.scrollLeft=sl-dx}});
 track.addEventListener("pointerdown",e=>{drag=true;sx=e.clientX;sl=track.scrollLeft;moved=0;track.classList.add("drag")});
 addEventListener("pointerup",()=>{drag=false;track.classList.remove("drag")});
 track.addEventListener("wheel",e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)){e.preventDefault();track.scrollLeft+=e.deltaX}},{passive:false});
 $("#aL").onclick=()=>track.scrollBy({left:-300,behavior:"smooth"});$("#aR").onclick=()=>track.scrollBy({left:300,behavior:"smooth"});
 (function loop(){const d=track.scrollLeft-last;last=track.scrollLeft;
  hangs.forEach((h,i)=>{const s=sp[i],r=h.getBoundingClientRect(),dx=(mx-(r.left+r.width/2))/innerWidth;s.v+=d*-.07+Math.sin(Date.now()/1400+i*1.7)*.004;s.v+=-s.a*.045;s.v*=.95;s.a+=s.v;s.ry+=((-dx*38)-s.ry)*.08;h.style.transform=`rotateZ(${s.a}deg) rotateY(${s.ry}deg)`});
  requestAnimationFrame(loop)})();
 new IntersectionObserver((es,o)=>es.forEach(x=>{if(x.isIntersecting){$("#store").classList.add("live");o.disconnect()}}),{threshold:.3}).observe($("#store"));
}
// ---- scroll effects ----
const nav=$(".nav"),bar=$("#bar");
function onS(){const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;bar.style.width=(h>0?y/h*100:0)+"%";nav.classList.toggle("sc",y>40);
 if(y<innerHeight*1.2)document.querySelectorAll("[data-sp]").forEach(el=>el.style.transform=`translate3d(0,${-y*el.dataset.sp}px,0)`)}
addEventListener("scroll",onS,{passive:true});onS();
const io=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&(x.target.classList.add("in"),io.unobserve(x.target))),{threshold:.12});
document.querySelectorAll(".rv,.clip").forEach(el=>io.observe(el));
// ---- cart ----
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("on");setTimeout(()=>e.classList.remove("on"),2200)}
function drawer(o){$("#drawer").classList.toggle("open",o);$("#veil").classList.toggle("on",o)}
function render(){$("#cartCount").textContent=cart.length;
 $("#items").innerHTML=cart.length?cart.map((c,i)=>`<div class="it"><div class="th" style="background-image:url(${c.img})"></div><div><b>${c.name}</b><br>${c.col?c.col+" · ":""}Size ${c.s} · ${money(c.price)}</div><button data-rm="${i}">Remove</button></div>`).join(""):"<p>Your bag is empty.</p>";
 $("#total").textContent=money(cart.reduce((a,c)=>a+c.price,0));saveC()}
document.addEventListener("click",e=>{
 const h=e.target.closest(".hang");if(h&&moved<6)return openPop(h.dataset.id);
 if(e.target.id==="panel"||e.target.dataset.x!==undefined)return $("#panel").classList.remove("open");
 const t=e.target.closest("button");if(!t)return;
 if(t.dataset.rm){cart.splice(+t.dataset.rm,1);return render()}
 const pv=t.closest(".pv");if(!pv)return;const p=P.find(x=>x.id===pv.dataset.id),s=st(pv);
 if(t.dataset.v){pv.querySelectorAll(".tab").forEach(b=>b.classList.toggle("on",b===t));pv.querySelector(".card3d").classList.toggle("flip",t.dataset.v==="1")}
 if(t.dataset.c){s.col=+t.dataset.c;pv.querySelectorAll(".sw").forEach(b=>b.classList.toggle("on",b===t));pv.querySelector(".fr").src=p.cols[s.col][2];pv.querySelector(".cn").textContent=p.cols[s.col][0]}
 if(t.dataset.s){s.size=t.dataset.s;pv.querySelectorAll(".sz").forEach(b=>b.classList.toggle("on",b===t));pv.querySelector(".note").textContent=SZ[s.size].n;pv.querySelector(".back").style.setProperty("--sz",SZ[s.size].s)}
 if(t.dataset.add!==undefined){if(!s.size)return toast("Please select a size first");
  cart.push({name:p.name,price:p.price,s:s.size,col:p.cols?p.cols[s.col][0]:"",img:p.cols?p.cols[s.col][2]:p.img});render();$("#panel").classList.remove("open");toast("Added to your bag");drawer(true)}
});
$("#cartBtn").onclick=()=>drawer(true);$("#closeCart").onclick=$("#veil").onclick=()=>drawer(false);
$("#checkout").onclick=()=>{if(!cart.length)return toast("Your bag is empty");
 const l=cart.map(c=>`• ${c.name}${c.col?" ("+c.col+")":""} Size ${c.s} — ${money(c.price)}`).join("\n");
 window.open(`https://wa.me/${WA}?text=${encodeURIComponent("Hello byAleezay, I want to order:\n"+l+"\nTotal: "+money(cart.reduce((a,c)=>a+c.price,0))+"\nName:\nAddress:\nPhone:")}`,"_blank")};
render();
