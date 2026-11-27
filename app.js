const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const uid=()=>Math.random().toString(36).slice(2,9);
const K="giaidau-demo-v1";
function sched(ids){const a=[...ids];if(a.length%2)a.push(null);const n=a.length,rs=[];
  for(let r=0;r<n-1;r++){const ps=[];for(let i=0;i<n/2;i++){const h=a[i],b=a[n-1-i];if(h&&b)ps.push([h,b])}rs.push(ps);a.splice(1,0,a.pop())}
  return rs}
const mk=ids=>sched(ids).flatMap((ps,i)=>ps.map(([h,a])=>({id:uid(),round:i+1,home:h,away:a,hs:null,as:null})));
const demoP=()=>[["Minh Quân",5,18,7,4],["Hải Đăng",4,12,10,2],["Gia Bảo",3,9,15,1],["Tuấn Kiệt",4,15,5,3],["Bảo Ngọc",2,6,12,0],["Khánh Linh",3,8,9,2],["Đức Anh",5,20,4,5],["Thu Hà",1,3,8,0],["Quang Huy",2,7,3,1],["Mai Phương",3,10,11,2],["Việt Hoàng",4,13,6,1]].map(([name,stars,k,a,mvp],i)=>({id:uid(),name,stars,k,a,mvp,t:i}));
function seed(){
  const teams=["Sao Băng","Hổ Xám","Phượng Hoàng","Sóng Xanh"].map(n=>({id:uid(),name:"Đội "+n}));
  const matches=mk(teams.map(t=>t.id));
  [[2,1],[0,0],[3,1],[1,2]].forEach((s,i)=>{matches[i].hs=s[0];matches[i].as=s[1]});
  return {cfg:{name:"Giải đấu Liên Quân",subtitle:"Vòng tròn tính điểm, mỗi đội gặp nhau một lần."},teams,matches,accounts:[],players:demoP(),squads:[],notes:[{id:uid(),text:"Chào mừng đến với giải đấu! Thông báo từ ban tổ chức sẽ hiện ở đây.",t:Date.now()}],arr:{size:5,mode:"same"}};
}
const load=()=>{try{return JSON.parse(localStorage.getItem(K))}catch{return null}};
let S=load()||seed();
S.players??=demoP();S.squads??=[];S.notes??=[];S.accounts.forEach(a=>{if(a.code===undefined)a.code=a.p||null;delete a.p});S.arr??={size:5,mode:"same"};
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch{}};
let user=null;try{user=sessionStorage.getItem("cu")}catch{}
let tm;const ok=(t,bad)=>{const o=$("#ok");o.className=bad?"bad":"";o.textContent=t;clearTimeout(tm);tm=setTimeout(()=>o.textContent="",bad?3500:1800)};
const sure=(b,t)=>{if(b.dataset.s){b.dataset.s="";b.textContent=b.dataset.o;return true}b.dataset.o=b.textContent;b.dataset.s=1;b.textContent=t||"Bấm lần nữa để xác nhận";setTimeout(()=>{if(b.dataset.s){b.dataset.s="";b.textContent=b.dataset.o}},3000);return false};
const cp=async t=>{try{await navigator.clipboard.writeText(t);ok("Đã sao chép")}catch{const x=document.createElement("textarea");x.value=t;document.body.appendChild(x);x.select();let r=false;try{r=document.execCommand("copy")}catch{}x.remove();ok(r?"Đã sao chép":t.split(String.fromCharCode(10)).join(", "),!r)}};
const nm=id=>S.teams.find(t=>t.id===id)?.name||"?";

function route(){
  let a=view?view==="admin":location.hash==="#admin";if(a&&!isAdm)a=false;
  $("#vAdmin").hidden=!a;$("#vClient").hidden=a;
  $("#nA").classList.toggle("on",a);$("#nC").classList.toggle("on",!a);
  if(a)fillInfo();
  draw();
}
addEventListener("hashchange",()=>{view=null;route()});
function fillInfo(){$("#name").value=S.cfg.name||"";$("#sub").value=S.cfg.subtitle||""}
function draw(){drawClient();drawJoin();drawAdmin();drawNotes();drawChat();drawGroup();drawPf();drawShop();drawCoin();autoRead();autoChat();musSync()}

const TG=["111","011","101","001","110","010","100","000"];
const bar=(y,v)=>v==="1"?`<rect x="183" y="${y}" width="34" height="5" rx="1.5"/>`:`<rect x="183" y="${y}" width="14" height="5" rx="1.5"/><rect x="203" y="${y}" width="14" height="5" rx="1.5"/>`;
const BAGUA=TG.map((t,i)=>`<g transform="rotate(${i*45} 200 200)">${[...t].map((v,j)=>bar(24+j*10,v)).join("")}</g>`).join("");
const RUNE=`<svg viewBox="0 0 400 400" fill="none" stroke-width="1.2"><g class="g1" stroke="#fff"><circle cx="200" cy="200" r="196" opacity=".35" stroke-dasharray="1 7"/><circle cx="200" cy="200" r="148" opacity=".4"/><g fill="#fff" stroke="none" opacity=".75">${BAGUA}</g></g><g class="g2" stroke="#fff"><circle cx="200" cy="200" r="132" opacity=".3" stroke-dasharray="52 12"/><circle cx="200" cy="200" r="118" opacity=".25"/></g><g transform="translate(200 200)"><g class="g3"><circle r="100" fill="#ececea"/><path d="M0-100A100 100 0 0 1 0 100A50 50 0 0 1 0 0A50 50 0 0 0 0-100" fill="#0a0a0a"/><circle cy="-50" r="13" fill="#0a0a0a"/><circle cy="50" r="13" fill="#ececea"/><circle r="100" stroke="#fff" stroke-width="2" opacity=".8"/></g></g></svg>`;
const sp=a=>a.map(([x,h,w])=>`M${x-w*1.7} 300C${x-w*1.1} ${300-h*.5} ${x-w*.7} ${300-h*.82} ${x-w*.2} ${300-h}L${x+w*.3} ${309-h}C${x+w*.7} ${300-h*.7} ${x+w*1.2} ${300-h*.35} ${x+w*1.7} 300Z`).join("");
const pk=(a,f,c,y)=>`<svg class="pk ${c}" viewBox="0 0 1600 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><path d="${sp(a)}M0 300V${y}H1600V300Z" fill="${f}"/></svg>`;
const ml=(st,r)=>`<div class="mist${r?" r":""}" style="${st}"><i></i><i></i></div>`;
const isl=st=>`<svg class="isl" style="${st}" viewBox="0 0 120 90" aria-hidden="true"><path d="M8 24Q34 8 62 14T112 24L98 36Q84 62 62 86Q42 62 22 38Z" fill="#161616" stroke="rgba(255,255,255,.35)"/><path d="M44 17l8-15 8 15zM66 16l6-10 6 10z" fill="#2c2c2c" stroke="rgba(255,255,255,.3)"/></svg>`;
const BG=ml("top:10%;height:26%;opacity:.3;--t:160s",1)+isl("right:7%;top:8%")+isl("left:3%;top:58%;width:clamp(40px,6vw,76px);animation-delay:-3s;animation-duration:10s")
 +pk([[90,150,34],[260,200,30],[430,130,40],[610,230,28],[790,160,36],[960,210,32],[1130,140,38],[1300,240,30],[1480,170,34]],"#222","",270)
 +ml("bottom:12%;height:34%;opacity:.5;--t:100s")
 +pk([[0,90,50],[170,120,44],[360,80,52],[540,130,40],[720,95,48],[900,125,42],[1080,85,50],[1250,135,44],[1430,100,48],[1600,95,50]],"#060606","n",262)
 +ml("bottom:-3%;height:28%;opacity:.7;--t:62s",1);
document.querySelectorAll(".rune").forEach(e=>e.innerHTML=RUNE);
document.querySelectorAll(".bgx").forEach(e=>e.innerHTML=BG);
let selR=null,enter=true;
function drawClient(){
  if(user&&!S.accounts.some(a=>a.u===user)){user=null;try{sessionStorage.removeItem("cu")}catch{}}
  if(me&&!myAcc())setMe(null);
  const li=!!user;$("#login").hidden=li;$("#site").hidden=!li;
  if(li)peek=null;
  const pa=myAcc();if(!lmode)lmode=pa?"up":"in";
  $("#li").hidden=lmode!=="in";$("#fp").hidden=lmode!=="fg";$("#lf").hidden=lmode!=="up"||!!pa;$("#cf").hidden=lmode!=="up"||!pa;if(pa)$("#pn").textContent=pa.u;
  document.querySelectorAll(".lt button").forEach(b=>b.classList.toggle("on",b.dataset.lt===lmode||(lmode==="fg"&&b.dataset.lt==="in")));
  if(!li){enter=true;return}
  $("#h").textContent=S.cfg.name||"Giải đấu";$("#s").textContent=S.cfg.subtitle||"";
  const T={};S.teams.forEach(t=>T[t.id]={id:t.id,name:t.name,p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0});
  S.matches.filter(m=>m.hs!=null&&T[m.home]&&T[m.away]).forEach(m=>{
    const a=T[m.home],b=T[m.away];a.p++;b.p++;a.gf+=m.hs;a.ga+=m.as;b.gf+=m.as;b.ga+=m.hs;
    if(m.hs>m.as){a.w++;a.pts+=3;b.l++}else if(m.hs<m.as){b.w++;b.pts+=3;a.l++}else{a.d++;b.d++;a.pts++;b.pts++}
  });
  const rows=Object.values(T).sort((x,y)=>y.pts-x.pts||(y.gf-y.ga)-(x.gf-x.ga)||y.gf-x.gf||x.name.localeCompare(y.name));
  const mx=Math.max(1,...rows.map(r=>r.pts)),tb=$("#tb");
  if(enter){tb.classList.add("enter");setTimeout(()=>tb.classList.remove("enter"),1800);enter=false}
  tb.innerHTML=rows.map((r,i)=>{const g=r.gf-r.ga;return `<tr class="${i<3?"r"+(i+1):""}" style="--i:${i}"><td><span class="rk">${i+1}</span></td><td class="n">${S.av?.[r.id]?`<img class="tav" src="${S.av[r.id]}" alt="">`:""}${esc(r.name)}<div class="pb"><i style="--w:${r.pts/mx*100}%"></i></div></td><td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${g>0?"+":""}${g}</td><td class="pt">${r.pts}</td></tr>`}).join("");
  drawSolo();const L=rows[0],has=L&&L.p;$("#ld").hidden=!has;if(has){$("#ln").textContent=L.name;$("#lpt").textContent=L.pts}
  const R={};S.matches.forEach(m=>(R[m.round]??=[]).push(m));
  const ks=Object.keys(R).map(Number).sort((a,b)=>a-b);
  if(selR==null||!ks.includes(selR))selR=ks.find(k=>R[k].some(m=>m.hs==null))??ks[ks.length-1];
  const n=id=>esc(T[id]?.name||"?");
  $("#rs").innerHTML=ks.length?`<div class="tabs">${ks.map(k=>`<button class="${k===selR?"on":""}" data-r="${k}">Vòng ${k}</button>`).join("")}</div><div class="ml">${R[selR].map(m=>{const pl=m.hs!=null,w=pl?(m.hs>m.as?1:m.hs<m.as?2:0):0;return `<div class="mc"><span class="tm l ${w==1?"win":w==2?"lose":""}">${n(m.home)}</span>${pl?`<span class="vs"><b>${m.hs}</b><i>:</i><b>${m.as}</b></span>`:`<span class="vs np">Chưa đấu</span>`}<span class="tm ${w==2?"win":w==1?"lose":""}">${n(m.away)}</span></div>`}).join("")}</div>`:"<p>Chưa có lịch thi đấu.</p>";
}
const SOLO={k:["Siêu hạ gục","K"],a:["Siêu hỗ trợ","A"],mvp:["Siêu MVP","MVP"]};
function drawSolo(){
  $("#wt").hidden=rkT!=="team";$("#ws").hidden=$("#rp").hidden=rkT!=="solo";
  document.querySelectorAll("#rt button").forEach(b=>b.classList.toggle("on",b.dataset.rt===rkT));
  document.querySelectorAll("#rp button").forEach(b=>b.classList.toggle("on",b.dataset.pk===rkP));
  $("#sh").textContent=SOLO[rkP][1];
  const ps=S.players.filter(p=>p.st!=="pending"&&(p[rkP]||0)>0).sort((x,y)=>y[rkP]-x[rkP]||x.name.localeCompare(y.name)),mx=ps.length?ps[0][rkP]:1;
  $("#sbd").innerHTML=ps.map((p,i)=>`<tr class="${i<3?"r"+(i+1):""}"><td><span class="rk">${i+1}</span></td><td class="n">${avImg(p.acc)}${esc(p.name)}${badgeE(p.acc)}<div class="pb"><i style="--w:${p[rkP]/mx*100}%"></i></div></td><td class="pt">${p[rkP]}</td></tr>`).join("")||`<tr><td colspan="3" style="width:auto;color:var(--mut)">Chưa có số liệu ${SOLO[rkP][0].toLowerCase()}.</td></tr>`;
}
const LV=["Mới chơi","Cơ bản","Khá","Giỏi","Cao thủ"];
const sx=n=>"★".repeat(n)+"☆".repeat(5-n);
let pick=0,openP=null,rkT="team",rkP="k";
const myReg=()=>{const i=curId();return i?S.players.find(p=>p.acc===i):null};
const accName=id=>S.accounts.find(a=>a.id===id)?.u||"?";
const jo=$("#jo"),shutJ=()=>{jo.hidden=true};
function drawJoin(){
  if($("#site").hidden)jo.hidden=true;
  const r=myReg(),lv=r?r.name+" ("+r.stars+" sao: "+LV[r.stars-1]+")":"",w=r&&r.st==="pending";
  $("#cta").textContent=!r?"Đăng ký tham gia":w?"Chờ duyệt…":"Đã đăng ký ✓";
  $("#jrw").hidden=!!r;$("#jd").hidden=!r;
  if(r){$("#jt0").textContent=w?"Đã gửi đăng ký":"Đăng ký thành công";$("#jt").textContent=w?lv+" đang chờ ban tổ chức duyệt. Bạn chưa thể đăng ký lại.":lv+" đã vào danh sách tham gia."}
  document.querySelectorAll("#sb button").forEach(b=>{b.classList.toggle("on",+b.dataset.s<=pick);b.setAttribute("aria-checked",+b.dataset.s===pick)});
  $("#sl").textContent=pick?pick+" sao: "+LV[pick-1]:"Chọn số sao đúng với trình độ của bạn.";
}
const jm=(t,bad)=>{const m=$("#jm");m.textContent=t;m.className=bad?"bad":"good"};
$("#sb").onclick=e=>{const b=e.target.closest("button");if(b){pick=+b.dataset.s;drawJoin()}};
$("#cta").onclick=()=>{jm("");jo.hidden=false;drawJoin();if(!myReg())$("#jn").focus()};
$("#jcl").onclick=shutJ;
jo.addEventListener("click",e=>{if(e.target===jo)shutJ()});
addEventListener("keydown",e=>{if(e.key==="Escape")shutJ()});
$("#jf").onsubmit=e=>{e.preventDefault();
  const name=$("#jn").value.trim();
  if(myReg())return jm("Bạn đã gửi đăng ký rồi.",1);
  if(!pick)return jm("Hãy chọn cấp độ chơi của bạn.",1);
  if(S.players.some(p=>p.name.toLowerCase()===name.toLowerCase()))return jm("Tên này đã được đăng ký.",1);
  S.players.push({id:uid(),name,stars:pick,t:Date.now(),acc:curId(),st:"pending"});save();
  $("#jn").value="";pick=0;jm("");draw()};
function arrange(){
  const{size,mode}=S.arr,ps=S.players.filter(p=>p.st!=="pending").sort((a,b)=>b.stars-a.stars||a.t-b.t),n=ps.length;
  if(!n)return[];
  const k=Math.ceil(n/size),base=Math.floor(n/k),ex=n%k,cap=Array.from({length:k},(_,i)=>base+(i<ex?1:0)),T=cap.map(()=>[]);
  if(mode==="same"){let i=0;T.forEach((t,j)=>{t.push(...ps.slice(i,i+cap[j]));i+=cap[j]})}
  else ps.forEach((p,i)=>{const r=Math.floor(i/k),q=i%k;let j=r%2?k-1-q:q,g=0;while(T[j].length>=cap[j]&&g++<k)j=(j+1)%k;T[j].push(p)});
  return T.map((m,i)=>({id:uid(),name:"Đội "+(i+1),members:m.map(p=>p.id)}));
}
function drawArr(){
  const wt=S.players.filter(p=>p.st==="pending").length;$("#pc").textContent="("+S.players.length+(wt?", "+wt+" chờ duyệt":"")+")";
  $("#pl").innerHTML=S.players.slice().sort((a,b)=>(b.st==="pending")-(a.st==="pending")||b.stars-a.stars||a.t-b.t).map(p=>{const w=p.st==="pending",o=openP===p.id;return `<div class="m pr"><span class="t">${w?esc(p.name):`<button type="button" class="lk" data-op="${p.id}" aria-expanded="${o}">${esc(p.name)}</button>`}${p.acc?` <span class="hint">· tk ${esc(accName(p.acc))}</span>`:""}${w?` <span class="hint">· chờ duyệt</span>`:` <span class="hint">· K ${p.k||0} · A ${p.a||0} · MVP ${p.mvp||0}</span>`}</span><span class="sx">${sx(p.stars)}</span>${w?`<button data-ap="${p.id}">Duyệt</button><button class="ghost" data-rj="${p.id}">Từ chối</button>`:""}<button class="del" data-dp="${p.id}">Xóa</button></div>`+(o?`<form class="pf" data-pf="${p.id}"><label>K (hạ gục)<input type="number" name="k" min="0" inputmode="numeric" value="${p.k||0}"></label><label>A (hỗ trợ)<input type="number" name="a" min="0" inputmode="numeric" value="${p.a||0}"></label><label>MVP<input type="number" name="mvp" min="0" inputmode="numeric" value="${p.mvp||0}"></label><button>Lưu</button></form>`:"")}).join("")||"<p>Chưa có ai đăng ký. Người chơi đăng ký ở trang client.</p>";
  document.querySelectorAll("#sz button").forEach(b=>b.classList.toggle("on",+b.dataset.z===S.arr.size));
  document.querySelectorAll("#md button").forEach(b=>b.classList.toggle("on",b.dataset.m===S.arr.mode));
  $("#mh").textContent=S.arr.mode==="same"?"Người có số sao gần nhau được xếp chung một đội.":"Mỗi đội có sức mạnh gần bằng nhau: người sao cao và sao thấp được chia đều giữa các đội.";
  $("#use").hidden=$("#uh").hidden=!S.squads.length;
  $("#sqs").innerHTML=S.squads.map(q=>{const m=q.members.map(id=>S.players.find(p=>p.id===id)).filter(Boolean),av=m.length?(m.reduce((a,p)=>a+p.stars,0)/m.length).toFixed(1).replace(".",","):"0";return `<div class="sq"><input type="text" class="qn" data-q="${q.id}" value="${esc(q.name)}" maxlength="40" aria-label="Tên đội" placeholder="Tên đội"> <span class="hint">(${m.length} người, trung bình ${av} sao)</span>${m.map(p=>`<div class="m"><span class="t">${esc(p.name)}</span><span class="sx">${sx(p.stars)}</span></div>`).join("")}</div>`}).join("");
}
$("#sz").onclick=e=>{const b=e.target.closest("[data-z]");if(b){S.arr.size=+b.dataset.z;save();draw()}};
$("#md").onclick=e=>{const b=e.target.closest("[data-m]");if(b){S.arr.mode=b.dataset.m;save();draw()}};
$("#sqs").oninput=e=>{const i=e.target.closest(".qn");if(!i)return;const q=S.squads.find(x=>x.id===i.dataset.q);if(q){q.name=i.value;save()}};
$("#arr").onclick=()=>{if(!S.players.some(p=>p.st!=="pending"))return ok("Chưa có người chơi nào được duyệt.",1);S.squads=arrange();save();draw();ok("Đã sắp "+S.squads.length+" đội")};
$("#pl").onclick=e=>{
  const op=e.target.closest("[data-op]");if(op){openP=openP===op.dataset.op?null:op.dataset.op;drawArr();return}
  const a=e.target.closest("[data-ap]"),r=e.target.closest("[data-rj]"),b=e.target.closest("[data-dp]");
  const tell=(p,t)=>{if(p.acc)S.notes.push({id:uid(),to:p.acc,text:t,t:Date.now()})};
  const get=id=>S.players.find(x=>x.id===id);
  if(a){const p=get(a.dataset.ap);if(p){delete p.st;tell(p,"Đăng ký tham gia của bạn đã được duyệt. Đăng ký thành công!");save();draw();ok("Đã duyệt "+p.name)}}
  else if(r){if(!sure(r,"Chắc chắn?"))return;const p=get(r.dataset.rj);if(p){tell(p,"Đăng ký tham gia của bạn bị từ chối. Bạn có thể đăng ký lại.");S.players=S.players.filter(x=>x.id!==p.id);save();draw()}}
  else if(b&&sure(b,"Chắc chắn?")){const p=get(b.dataset.dp);if(p)tell(p,"Dữ liệu đăng ký của bạn đã bị xóa. Bạn có thể đăng ký lại.");S.players=S.players.filter(x=>x.id!==b.dataset.dp);save();draw()}};
$("#pl").onsubmit=e=>{e.preventDefault();
  const f=e.target.closest("[data-pf]"),p=f&&S.players.find(x=>x.id===f.dataset.pf);if(!p)return;
  const n=k=>Math.max(0,Math.floor(+f.elements[k].value)||0);
  p.k=n("k");p.a=n("a");p.mvp=n("mvp");openP=null;save();draw();ok("Đã lưu chỉ số "+p.name)};
$("#use").onclick=()=>{if(!sure($("#use"),"Sẽ thay các đội và lịch cũ. Bấm Lưu lần nữa"))return;S.teams=S.squads.map((q,i)=>({id:q.id,name:(q.name||"").trim()||"Đội "+(i+1)}));S.matches=S.teams.length>1?mk(S.teams.map(t=>t.id)):[];save();draw();ok("Đã lưu "+S.teams.length+" đội")};
$("#rs").onclick=e=>{const b=e.target.closest("[data-r]");if(b){selR=+b.dataset.r;drawClient()}};
$("#rt").onclick=e=>{const b=e.target.closest("[data-rt]");if(b){rkT=b.dataset.rt;drawSolo()}};
$("#rp").onclick=e=>{const b=e.target.closest("[data-pk]");if(b){rkP=b.dataset.pk;drawSolo()}};
(()=>{
  const cs=[...document.querySelectorAll("canvas.fx")];
  if(!cs.length||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const st=cs.map(c=>({c,x:c.getContext("2d"),p:[],w:0,h:0}));
  const np=(s,r)=>({x:Math.random()*s.w,y:r?Math.random()*s.h:s.h+10,r:Math.random()*1.8+.5,v:Math.random()*.5+.15,ph:Math.random()*6.28,g:Math.random()<.55});
  const fit=s=>{const b=s.c.parentElement.getBoundingClientRect();if(b.width&&(b.width!==s.w||b.height!==s.h)){s.w=s.c.width=b.width;s.h=s.c.height=b.height;s.p=Array.from({length:Math.min(70,Math.round(b.width/16))},()=>np(s,true))}};
  const loop=t=>{
    for(const s of st){
      if(!s.c.offsetParent)continue;
      fit(s);s.x.clearRect(0,0,s.w,s.h);
      for(const q of s.p){
        q.y-=q.v;q.x+=Math.sin(t/1500+q.ph)*.25;
        if(q.y<-10)Object.assign(q,np(s));
        const a=.35+.35*Math.sin(t/500+q.ph);
        s.x.fillStyle=q.g?`rgba(255,255,255,${a})`:`rgba(180,180,180,${a})`;
        s.x.beginPath();s.x.arc(q.x,q.y,q.r,0,6.283);s.x.fill();
      }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();
let lmode=null,peek=null;
const ME=K+"-me";
let me=null;try{me=localStorage.getItem(ME)}catch{}
const setMe=v=>{me=v;try{v?localStorage.setItem(ME,v):localStorage.removeItem(ME)}catch{}};
const myAcc=()=>S.accounts.find(a=>a.id===me)||null;
const curId=()=>user?(S.accounts.find(a=>a.u===user)||{}).id:((lmode!=="up"&&peek)||me);
const mine=()=>S.notes.filter(x=>!x.to||x.to===curId()).sort((a,b)=>b.t-a.t);
$("#lf").onsubmit=e=>{e.preventDefault();
  const u=$("#lu").value.trim(),a=S.accounts.find(x=>x.u.toLowerCase()===u.toLowerCase());
  if(a&&a.id!==me){$("#err").textContent="Tên này đã có người đăng ký, hãy chọn tên khác.";return}
  if(!a){const n={id:uid(),u,code:null,t:Date.now()};S.accounts.push(n);save();setMe(n.id)}
  $("#err").textContent="";$("#lu").value="";draw()};
$("#cf").onsubmit=e=>{e.preventDefault();
  const a=myAcc(),c=$("#lc").value.trim();
  if(!a||!a.code||c!==a.code){$("#err2").textContent=a&&!a.code?"Ban tổ chức chưa gửi mã. Hãy chờ thông báo ở chuông.":"Mã chưa đúng.";return}
  user=a.u;try{sessionStorage.setItem("cu",user)}catch{}
  $("#err2").textContent="";$("#lc").value="";draw()};
$("#lb").onclick=()=>{setMe(null);$("#err2").textContent="";$("#lc").value="";draw()};
document.querySelectorAll(".lt button").forEach(b=>b.onclick=()=>{lmode=b.dataset.lt;document.querySelectorAll("#err,#err2,#ierr,#ferr").forEach(p=>p.textContent="");draw()});
/* ===== ĐĂNG NHẬP ADMIN (chỉ lưu mã băm SHA-256) ===== */
let isAdm=false;try{isAdm=sessionStorage.getItem("adm")==="1"}catch{}
const ADM_H="ed4af527266d6104b3180d67e055ad227d0d4842fbda8428464a41e600440623";
async function admOk(u,c){try{const h=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(u+":"+c));return [...new Uint8Array(h)].map(b=>b.toString(16).padStart(2,"0")).join("")===ADM_H}catch{return false}}
function admIn(){isAdm=true;try{sessionStorage.setItem("adm","1")}catch{}view="admin";try{history.replaceState(null,"","#admin")}catch{}route()}
function admOut(){isAdm=false;try{sessionStorage.removeItem("adm")}catch{}view="client";try{history.replaceState(null,"","#client")}catch{}route()}
$("#admOut").onclick=admOut;
$("#li").onsubmit=async e=>{e.preventDefault();
  const u=$("#iu").value.trim().toLowerCase(),c=$("#ic").value.trim(),a=S.accounts.find(x=>x.u.toLowerCase()===u);
  if(await admOk(u,c)){$("#ierr").textContent="";$("#iu").value=$("#ic").value="";admIn();return}
  if(!a||!a.code||a.code!==c){$("#ierr").textContent="Sai tài khoản hoặc mã đăng nhập.";return}
  user=a.u;try{sessionStorage.setItem("cu",user)}catch{}
  $("#ierr").textContent="";$("#iu").value=$("#ic").value="";draw()};
const goMode=m=>{lmode=m;document.querySelectorAll("#err,#err2,#ierr,#ferr").forEach(p=>p.textContent="");draw()};
$("#fg").onclick=()=>goMode("fg");
$("#fb").onclick=()=>goMode("in");
$("#fp").onsubmit=e=>{e.preventDefault();
  const u=$("#fu").value.trim().toLowerCase(),a=S.accounts.find(x=>x.u.toLowerCase()===u),m=$("#ferr");
  const say=(t,ok)=>{m.textContent=t;m.className=ok?"good":""};
  if(!a)return say("Không tìm thấy tài khoản này. Hãy nhập đúng tên tài khoản.");
  if(!a.code)return say("Tài khoản này chưa có mã. Hãy chờ ban tổ chức gửi mã.");
  if(!S.notes.some(n=>n.to===a.id&&n.fg&&Date.now()-n.t<60000)){S.notes.push({id:uid(),to:a.id,fg:1,text:"Mã đăng nhập của bạn là "+a.code+" (gửi lại theo yêu cầu quên mật khẩu).",t:Date.now()});save();draw()}
  peek=a.id;npOpen=true;seenAt=seen();try{localStorage.setItem(SK,Date.now())}catch{}
  $("#np").style.top=($("#login .bell").getBoundingClientRect().bottom+8)+"px";
  draw();say("Đã gửi mã vào thông báo của tài khoản "+a.u+". Xem ở chuông thông báo góc trên bên phải.",1)};
$("#out").onclick=()=>{user=null;lmode=null;try{sessionStorage.removeItem("cu")}catch{}draw()};

let view=null;
document.querySelectorAll(".sw a").forEach(l=>l.onclick=e=>{e.preventDefault();view=l.id==="nA"?"admin":"client";try{history.replaceState(null,"",l.getAttribute("href"))}catch{}route()});
const SK=K+"-seen",seen=()=>{try{return+localStorage.getItem(SK)||0}catch{return 0}};
let npOpen=false,seenAt=0;
const shut=()=>{if(npOpen){npOpen=false;drawNotes()}};
const fdt=t=>new Date(t).toLocaleString("vi-VN");
function drawNotes(){
  if($("#vClient").hidden)npOpen=false;
  const n=mine(),u=npOpen?0:n.filter(x=>x.t>seen()).length,np=$("#np");
  document.querySelectorAll(".bd").forEach(b=>{b.hidden=!u;b.textContent=u>9?"9+":u});
  document.querySelectorAll(".bell").forEach(b=>{b.setAttribute("aria-label",u?"Thông báo, "+u+" chưa đọc":"Thông báo");b.setAttribute("aria-expanded",npOpen)});
  
  np.hidden=!npOpen;
  if(npOpen)np.innerHTML=`<div class="nh"><span>Thông báo từ ban tổ chức</span><button type="button" class="spk" data-auto>${autoOn()?"🔊 Tự đọc: bật":"🔇 Tự đọc: tắt"}</button></div>`+(n.map(x=>`<div class="ni${x.t>seenAt?" new":""}"><p>${esc(x.text)}</p><small>${esc(fdt(x.t))}</small><button type="button" class="spk" data-say="${x.id}" aria-label="Đọc to">🔊</button></div>`).join("")||`<p class="ne">Chưa có thông báo nào.</p>`);
}
function drawNl(){
  $("#nl").innerHTML=[...S.notes].sort((a,b)=>b.t-a.t).map(x=>`<div class="m"><span class="t">${esc(x.text)} <span class="hint">· ${x.to?"riêng cho "+esc(S.accounts.find(a=>a.id===x.to)?.u||"?"):"gửi tất cả"} · ${esc(fdt(x.t))}</span></span><button class="del" data-dn="${x.id}">Xóa</button></div>`).join("")||"<p>Chưa gửi thông báo nào.</p>";
}
document.querySelectorAll(".bell").forEach(bl=>bl.onclick=e=>{e.stopPropagation();npOpen=!npOpen;if(npOpen){seenAt=seen();$("#np").style.top=(bl.getBoundingClientRect().bottom+8)+"px";try{localStorage.setItem(SK,Date.now())}catch{}}drawNotes()});
document.addEventListener("click",e=>{if(!e.target.closest("#np"))shut()});
addEventListener("keydown",e=>{if(e.key==="Escape")shut()});
addEventListener("scroll",shut,{passive:true});
addEventListener("storage",e=>{if(e.key===K){const d=load();if(d){S=d;S.notes??=[];draw()}}});
$("#nf").onsubmit=e=>{e.preventDefault();const text=$("#nt").value.trim();if(!text)return;S.notes.push({id:uid(),text,t:Date.now()});save();$("#nt").value="";draw();ok("Đã gửi thông báo")};
$("#nl").onclick=e=>{const b=e.target.closest("[data-dn]");if(!b||!sure(b,"Chắc chắn?"))return;S.notes=S.notes.filter(x=>x.id!==b.dataset.dn);save();draw()};
function drawAdmin(){drawArr();drawNl();drawCnt();
  $("#al").innerHTML=S.accounts.map(a=>`<div class="m"><span class="t"><b>${esc(a.u)}</b> <span class="hint">· ${a.code?"đã gửi mã "+esc(a.code):"chờ gửi mã"}</span></span><button class="ghost" data-sc="${a.id}">${a.code?"Gửi lại mã":"Gửi mã"}</button><button class="del" data-ad="${a.id}">Xóa</button></div>`).join("")||"<p>Chưa có ai đăng ký. Người chơi nhập tên ở trang client.</p>";
  $("#tl").innerHTML=S.teams.map(t=>`<div class="m"><span class="t">${esc(t.name)}</span><button class="del" data-dt="${t.id}">Xóa</button></div>`).join("")||"<p>Chưa có đội nào.</p>";
  const R={};S.matches.forEach(m=>(R[m.round]??=[]).push(m));
  $("#ms").innerHTML=Object.keys(R).sort((a,b)=>a-b).map(r=>`<div class="rdn">Vòng ${r}</div>`+R[r].map(m=>`<div class="m" data-id="${m.id}"><span class="t">${esc(nm(m.home))} – ${esc(nm(m.away))}</span><input type="number" min="0" value="${m.hs??""}"><input type="number" min="0" value="${m.as??""}"><button>Lưu</button></div>`).join("")).join("")||"<p>Chưa có lịch. Thêm đội rồi bấm “Tạo lịch vòng tròn”.</p>";
}
$("#sf").onsubmit=e=>{e.preventDefault();S.cfg={name:$("#name").value,subtitle:$("#sub").value};save();draw();ok("Đã lưu")};
$("#al").onclick=e=>{
  const c=e.target.closest("[data-sc]"),d=e.target.closest("[data-ad]");
  if(c){const a=S.accounts.find(x=>x.id===c.dataset.sc);if(!a)return;
    a.code??=Array.from(crypto.getRandomValues(new Uint8Array(6)),b=>b%10).join("");
    S.notes.push({id:uid(),to:a.id,text:"Mã đăng nhập của bạn là "+a.code+". Nhập mã này để vào xem giải đấu.",t:Date.now()});
    save();draw();ok("Đã gửi mã cho "+a.u)}
  if(d&&sure(d,"Chắc chắn?")){S.accounts=S.accounts.filter(x=>x.id!==d.dataset.ad);S.notes=S.notes.filter(x=>x.to!==d.dataset.ad);S.players=S.players.filter(p=>p.acc!==d.dataset.ad);save();draw()}};
$("#tf").onsubmit=e=>{e.preventDefault();S.teams.push({id:uid(),name:$("#tn").value.trim()});save();$("#tn").value="";draw()};
$("#tl").onclick=e=>{const b=e.target.closest("[data-dt]");
  if(!b||!sure(b,"Chắc chắn?"))return;
  S.teams=S.teams.filter(t=>t.id!==b.dataset.dt);S.matches=S.matches.filter(m=>m.home!==b.dataset.dt&&m.away!==b.dataset.dt);save();draw()};
$("#gen").onclick=()=>{
  if(S.teams.length<2)return ok("Cần ít nhất 2 đội.",1);
  if(S.matches.length&&!sure($("#gen"),"Lịch cũ sẽ bị xóa. Bấm lần nữa"))return;
  S.matches=mk(S.teams.map(t=>t.id));save();draw();ok("Đã tạo lịch")};
$("#ms").onclick=e=>{
  const b=e.target.closest("button");if(!b)return;
  const r=b.closest(".m"),[h,a]=r.querySelectorAll("input");
  if((h.value==="")!==(a.value===""))return ok("Nhập đủ 2 tỉ số, hoặc để trống cả hai.",1);
  const m=S.matches.find(x=>x.id===r.dataset.id),has=h.value!=="";
  m.hs=has?+h.value:null;m.as=has?+a.value:null;save();draw();ok("Đã lưu")};
$("#rst").onclick=()=>{if(!sure($("#rst"),"Bấm lần nữa để đặt lại"))return;S=seed();save();fillInfo();draw();ok("Đã đặt lại")};
function drawCnt(){
  const wa=S.accounts.filter(a=>!a.code).length,done=S.matches.filter(m=>m.hs!=null).length;
  $("#cn").textContent="("+S.notes.length+")";
  $("#ca").textContent="("+S.accounts.length+(wa?", "+wa+" chờ mã":"")+")";
  $("#ct").textContent="("+S.teams.length+")";
  $("#cm").textContent="("+done+"/"+S.matches.length+" trận đã nhập)";
}
document.querySelectorAll(".adm > h2").forEach(t=>{const d=document.createElement("details"),s=document.createElement("summary"),b=t.nextElementSibling;d.className="sec";s.append(...t.childNodes);d.append(s,b);t.replaceWith(d)});

let chOpen=false,chK="all";
const mySq=()=>{const p=myReg();return p?S.squads.find(q=>q.members.includes(p.id))||null:null};
const dmT=()=>{const n=$("#chTo").value.trim().toLowerCase();return n&&S.players.find(p=>p.name.toLowerCase()===n)||null};
function chState(){
  const me=curId(),p=myReg(),sq=mySq(),t=dmT(),C=S.chat;
  if(chK==="team"){
    if(!sq)return{L:[],can:0,info:p?"Bạn chưa được xếp vào đội nào.":"Bạn cần đăng ký tham gia và được xếp đội để chat nhóm."};
    return{L:C.filter(m=>m.k==="team"&&m.to===sq.id),can:1,info:"Chỉ thành viên "+(sq.name||"đội")+" mới thấy."};
  }
  if(chK==="dm"){
    if(!p)return{L:[],can:0,info:"Bạn cần đăng ký tham gia để nhắn riêng."};
    if(!t)return{L:[],can:0,info:"Nhập đúng tên người chơi đã đăng ký để nhắn riêng."};
    if(t.id===p.id)return{L:[],can:0,info:"Bạn không thể nhắn cho chính mình."};
    return{L:C.filter(m=>m.k==="dm"&&(m.fa===me&&m.to===t.id||t.acc&&m.fa===t.acc&&m.to===p.id)),can:1,info:"Nhắn riêng cho "+t.name+". Chỉ hai người thấy."};
  }
  return{L:C.filter(m=>m.k==="all"),can:1,info:"Mọi người đều thấy."};
}
function drawChat(go){
  S.chat??=[];
  if($("#site").hidden){chOpen=false;$("#chW").hidden=true;if(rd)stopSay();return}
  $("#chW").hidden=!chOpen;$("#chB").setAttribute("aria-expanded",chOpen);
  if(rd&&(!chOpen||rd.k!==chK||chK==="dm"&&(dmT()||{}).id!==rd.t))stopSay();
  if(!chOpen)return;
  const{L,can,info}=chState(),me=curId(),p=myReg(),el=$("#chL"),end=el.scrollHeight-el.scrollTop-el.clientHeight<40;
  document.querySelectorAll("#chT button").forEach(b=>b.classList.toggle("on",b.dataset.ck===chK));
  $("#chD").hidden=chK!=="dm";$("#chI").textContent=info;$("#chA").textContent=chAuto()[chK]?"🔊 Tự đọc: bật":"🔇 Tự đọc: tắt";
  const cp=new Map();
  S.chat.forEach(m=>{if(m.k!=="dm")return;const q=m.fa===me?S.players.find(x=>x.id===m.to):p&&m.to===p.id?S.players.find(x=>x.acc===m.fa):null;if(q)cp.set(q.id,q.name)});
  $("#chC").innerHTML=[...cp.values()].map(n=>`<button type="button" data-n="${esc(n)}">${esc(n)}</button>`).join("");
  el.innerHTML=L.map(m=>{const mi=m.fa===me;return `<div class="cmsg${mi?" me":""}" data-id="${m.id}"><small>${mi?"Bạn":esc(m.fn)} · ${new Date(m.t).toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"})}</small>${esc(m.x)}<button type="button" class="spk" data-say="${m.id}" aria-label="Đọc to">🔊</button></div>`}).join("")||`<p class="hint">Chưa có tin nhắn.</p>`;
  $("#chTx").disabled=$("#chF button").disabled=!can;
  if(go||end)el.scrollTop=el.scrollHeight;
  rdMark();
}
$("#chB").onclick=()=>{chOpen=!chOpen;drawChat(true)};
$("#chX").onclick=()=>{chOpen=false;drawChat()};
$("#chT").onclick=e=>{const b=e.target.closest("[data-ck]");if(b){chK=b.dataset.ck;drawChat(true)}};
$("#chTo").oninput=()=>drawChat(true);
$("#chC").onclick=e=>{const b=e.target.closest("[data-n]");if(b){$("#chTo").value=b.dataset.n;drawChat(true)}};
$("#chF").onsubmit=e=>{e.preventDefault();
  S.chat??=[];
  const x=$("#chTx").value.trim(),me=curId(),p=myReg(),st=chState();
  if(!x||!me||!st.can)return;
  const m={id:uid(),t:Date.now(),fa:me,fn:p?p.name:user,x,k:chK};
  if(chK==="team")m.to=mySq().id;else if(chK==="dm")m.to=dmT().id;
  S.chat.push(m);if(S.chat.length>300)S.chat=S.chat.slice(-300);
  save();$("#chTx").value="";drawChat(true)};

(()=>{
  const c=$("#fxA"),x=c.getContext("2d");
  if(!x||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  let w=0,h=0,P=[],M=[];
  const mk=r=>({x:Math.random()*w,y:r?Math.random()*h:h+30,s:Math.random()*9+3,v:Math.random()*.5+.15,a:Math.random()*6.28,ra:(Math.random()-.5)*.025,ph:Math.random()*6.28,k:Math.random()<.45});
  const rs=()=>{w=c.width=innerWidth;h=c.height=innerHeight;P=Array.from({length:Math.min(54,Math.round(w/22))},()=>mk(1))};
  const loop=t=>{
    x.clearRect(0,0,w,h);
    for(const q of P){
      q.y-=q.v;q.a+=q.ra;q.x+=Math.sin(t/1800+q.ph)*.3;
      if(q.y<-40)Object.assign(q,mk(0));
      const hu=210+q.x/w*70,al=.45+.4*Math.sin(t/600+q.ph),s=q.s;
      x.save();x.translate(q.x,q.y);x.rotate(q.a);x.shadowColor=`hsl(${hu},100%,65%)`;x.shadowBlur=14;
      if(q.k){x.beginPath();x.moveTo(0,-s*1.7);x.lineTo(s*.75,0);x.lineTo(0,s*1.7);x.lineTo(-s*.75,0);x.closePath();
        x.fillStyle=`hsla(${hu},95%,70%,${al*.45})`;x.fill();x.strokeStyle=`hsla(${hu},100%,85%,${al})`;x.lineWidth=1;x.stroke()}
      else{x.fillStyle=`hsla(${hu},100%,88%,${al})`;x.beginPath();x.arc(0,0,s*.22,0,6.283);x.fill()}
      x.restore();
    }
    if(Math.random()<.006)M.push({x:Math.random()*w*.8,y:Math.random()*h*.45,l:0});
    for(let i=M.length-1;i>=0;i--){const m=M[i];m.x+=11;m.y+=5;m.l++;
      const g=x.createLinearGradient(m.x-90,m.y-41,m.x,m.y);g.addColorStop(0,"rgba(150,170,255,0)");g.addColorStop(1,"rgba(235,240,255,.95)");
      x.strokeStyle=g;x.lineWidth=2;x.beginPath();x.moveTo(m.x-90,m.y-41);x.lineTo(m.x,m.y);x.stroke();
      if(m.l>60)M.splice(i,1)}
    requestAnimationFrame(loop)};
  rs();addEventListener("resize",rs);requestAnimationFrame(loop);
})();
const AK=K+"-auto",LR=K+"-read";
const autoOn=()=>{try{return localStorage.getItem(AK)!=="0"}catch{return true}};
const TTS="speechSynthesis" in window;
let spKey=null,act=false,cSay=false;
const stopSay=()=>{if(TTS)try{speechSynthesis.cancel()}catch{}spKey=null;if(rd){rd=null;rdMark()}};
const mkU=t=>{const u=new SpeechSynthesisUtterance(t);u.lang="vi-VN";const v=speechSynthesis.getVoices().find(v=>/^vi/i.test(v.lang));if(v)u.voice=v;return u};
function say(t,key){
  if(!TTS)return;
  if(spKey===key){stopSay();return}
  stopSay();const u=mkU(t);spKey=key;
  u.onend=u.onerror=()=>{if(spKey===key)spKey=null};
  speechSynthesis.speak(u)}
function autoRead(){
  if($("#vClient").hidden)return;
  const inn=!$("#site").hidden;
  if(inn&&cSay){stopSay();cSay=false}
  if(!act)return;
  let last=0;try{last=+localStorage.getItem(LR)||0}catch{}
  const all=mine(),top=all.length?all[0].t:0;
  if(!last){try{localStorage.setItem(LR,Date.now())}catch{}return}
  if(top<=last)return;
  try{localStorage.setItem(LR,top)}catch{}
  if(!TTS||!autoOn())return;
  const code=x=>x.fg||/mã đăng nhập/i.test(x.text),nw=all.filter(x=>x.t>last&&(inn?!code(x):code(x)&&x.to)).reverse().slice(-3);
  nw.forEach(x=>{if(code(x)){cSay=true;const t=x.text.split(/[.(]/)[0].replace(/\d+/g,d=>[...d].join(", "));for(let i=0;i<3;i++)speechSynthesis.speak(mkU(t))}else speechSynthesis.speak(mkU("Thông báo từ ban tổ chức. "+x.text))})}
const wake=()=>{if(!act){act=true;setTimeout(()=>{autoRead();autoChat();musSync()},0)}};
["click","keydown","touchend"].forEach(ev=>addEventListener(ev,wake,true));
$("#np").addEventListener("click",e=>{
  const a=e.target.closest("[data-auto]"),b=e.target.closest("[data-say]");
  if(a){const v=!autoOn();try{localStorage.setItem(AK,v?"1":"0")}catch{}if(!v)stopSay();a.textContent=v?"🔊 Tự đọc: bật":"🔇 Tự đọc: tắt"}
  if(b){const x=S.notes.find(n=>n.id===b.dataset.say);if(x)say(x.text,"n"+x.id)}});
$("#chL").addEventListener("click",e=>{
  const c=e.target.closest(".cmsg");if(!c||String(getSelection()))return;
  const{L}=chState(),i=L.findIndex(x=>x.id===c.dataset.id);if(i<0)return;
  if(rd&&rd.cur===c.dataset.id){stopSay();return}
  startRd(L.slice(i))});
const CK=K+"-ca",CR=K+"-cr";
const chAuto=()=>{try{return JSON.parse(localStorage.getItem(CK))||{}}catch{return{}}};
function autoChat(){
  if(!act||$("#site").hidden||$("#vClient").hidden)return;
  const me=curId(),p=myReg(),sq=mySq(),C=S.chat||[];
  let last=0;try{last=+localStorage.getItem(CR)||0}catch{}
  const top=C.reduce((a,m)=>Math.max(a,m.t),0);
  if(!last){try{localStorage.setItem(CR,Date.now())}catch{}return}
  if(top<=last)return;
  try{localStorage.setItem(CR,top)}catch{}
  const A=chAuto();if(!TTS)return;
  C.filter(m=>m.t>last&&m.fa!==me&&(m.k==="all"||m.k==="team"&&sq&&m.to===sq.id||m.k==="dm"&&p&&m.to===p.id)&&(A[m.k]||inRd(m))).sort((a,b)=>a.t-b.t).slice(-3).forEach(m=>{if(inRd(m))rdSpeak(m);else speechSynthesis.speak(mkU(m.fn+": "+m.x))})}
$("#chA").onclick=()=>{const o=chAuto(),v=!o[chK];o[chK]=v?1:0;try{localStorage.setItem(CK,JSON.stringify(o))}catch{}if(!v)stopSay();drawChat()};
try{if(!localStorage.getItem(LR))localStorage.setItem(LR,Date.now())}catch{}
let rd=null;
function rdMark(sc){
  $("#chS").hidden=!rd;
  document.querySelectorAll("#chL .cmsg").forEach(el=>{const on=!!rd&&el.dataset.id===rd.cur;el.classList.toggle("rd",on);if(on&&sc)el.scrollIntoView({block:"nearest"})})}
function rdSpeak(m){
  const u=mkU((m.fa===curId()?"Bạn":m.fn)+": "+m.x);
  u.onstart=()=>{if(rd){rd.cur=m.id;rdMark(1)}};
  u.onend=u.onerror=()=>setTimeout(()=>{if(rd&&!speechSynthesis.speaking&&!speechSynthesis.pending){rd.cur=null;rdMark()}},250);
  speechSynthesis.speak(u)}
function startRd(list){
  if(!TTS)return;
  stopSay();
  rd={k:chK,t:chK==="dm"?(dmT()||{}).id:null,cur:null};
  list.forEach(m=>rdSpeak(m));rdMark()}
function inRd(m){return !!rd&&rd.k===m.k&&(m.k!=="dm"||(S.players.find(x=>x.id===rd.t)||{}).acc===m.fa)}
$("#chS").onclick=()=>stopSay();
let gOpen=false;
const GI='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>';
function drawGroup(){
  S.votes??={};S.cap??={};S.av??={};S.tie??={};
  const sq=$("#site").hidden?null:mySq(),p=myReg();
  $("#gB").hidden=!sq;
  if(!sq){gOpen=false;$("#gW").hidden=true;return}
  const av=S.av[sq.id],nm=(sq.name||"").trim()||"Đội "+(S.squads.indexOf(sq)+1);
  $("#gB").innerHTML=GI;
  $("#gW").hidden=!gOpen;if(!gOpen)return;
  const M=sq.members.map(id=>S.players.find(x=>x.id===id)).filter(Boolean),el=M.filter(x=>x.acc),V=S.votes[sq.id]||{},cap=S.cap[sq.id],
    can=!cap&&p&&p.acc&&M.some(x=>x.id===p.id),cp=cap&&M.find(x=>x.id===cap),n=el.filter(x=>V[x.id]).length;
  $("#gNm").textContent=nm;
  $("#gAv").innerHTML=av?`<img src="${av}" alt="">`:esc(nm.slice(0,1).toUpperCase());
  $("#gSt").textContent=cp?"👑 Đội trưởng: "+cp.name:el.length?"Đã bầu "+n+"/"+el.length+(S.tie[sq.id]?" · Hòa phiếu, cả đội bầu lại":""):"Chưa có thành viên nào có tài khoản để bầu";
  $("#gAct").innerHTML=cp&&p&&cp.id===p.id?`<button type="button" class="gv" data-av>📷 Đặt avatar nhóm</button>`:"";
  $("#gL").innerHTML=M.map(x=>{const mine=V[p&&p.id]===x.id;return `<div class="gm"><div class="gt">${avImg(x.acc)}<b>${esc(x.name)}</b>${badgeE(x.acc)}${cap===x.id?" 👑":""}${can?`<button type="button" class="gv${mine?" on":""}" data-vote="${x.id}">${mine?"✓ Đã bầu":"Bầu đội trưởng"}</button>`:""}${cap?`<small>${el.filter(y=>V[y.id]===x.id).length} phiếu</small>`:""}</div><div class="gs"><span>K ${x.k||0}</span><span>A ${x.a||0}</span><span>MVP ${x.mvp||0}</span></div></div>`}).join("")||`<p class="hint">Đội chưa có thành viên.</p>`}
function vote(cid){
  S.votes??={};S.cap??={};S.tie??={};
  const p=myReg(),sq=mySq();
  if(!p||!p.acc||!sq||S.cap[sq.id]||!sq.members.includes(cid))return;
  const V=S.votes[sq.id]??={};V[p.id]=cid;
  const el=sq.members.map(id=>S.players.find(x=>x.id===id)).filter(x=>x&&x.acc);
  if(el.every(x=>V[x.id])){
    const t={};el.forEach(x=>t[V[x.id]]=(t[V[x.id]]||0)+1);
    const mx=Math.max(...Object.values(t)),w=Object.keys(t).filter(k=>t[k]===mx);
    if(w.length===1){S.cap[sq.id]=w[0];delete S.tie[sq.id]}else{delete S.votes[sq.id];S.tie[sq.id]=1}}
  save();draw()}
$("#gB").onclick=()=>{gOpen=!gOpen;if(gOpen&&chOpen){chOpen=false;drawChat()}drawGroup()};
$("#chB").addEventListener("click",()=>{if(gOpen){gOpen=false;drawGroup()}});
$("#gX").onclick=()=>{gOpen=false;drawGroup()};
$("#gW").addEventListener("click",e=>{const v=e.target.closest("[data-vote]");if(v)return vote(v.dataset.vote);if(e.target.closest("[data-av]"))$("#gFile").click()});
$("#gFile").onchange=e=>{
  const f=e.target.files[0],sq=mySq(),p=myReg();e.target.value="";
  if(!f||!sq||!p||S.cap?.[sq.id]!==p.id||!/^image\//.test(f.type))return;
  const r=new FileReader();
  r.onload=()=>{const im=new Image();im.onload=()=>{
    const c=document.createElement("canvas");c.width=c.height=160;const x=c.getContext("2d"),s=Math.min(im.width,im.height);
    x.drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,160,160);
    (S.av??={})[sq.id]=c.toDataURL("image/jpeg",.85);save();draw()};im.src=r.result};
  r.readAsDataURL(f)};
const MI={on:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg>`,off:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" opacity=".6"/><path d="M4 4l16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`};
let AC=null,GN=null,mP=null,mTried=false,mHold=false;
const mPref=()=>{try{return localStorage.getItem(K+"-mus")==="1"}catch{return false}};
const mSet=v=>{try{localStorage.setItem(K+"-mus",v?"1":"0")}catch{}};
let mStep=0,mMode=null,mBlob=null;
const mPlaying=()=>mMode==="el"?!$("#au").paused:!!AC&&AC.state==="running";
function mUi(){const on=mPlaying(),b=$("#mus");b.classList.toggle("on",on);b.setAttribute("aria-label",on?"Tắt nhạc":"Bật nhạc");b.innerHTML=on?MI.on:MI.off;if("mediaSession" in navigator)navigator.mediaSession.playbackState=on?"playing":"paused"}
const mReady=()=>mP??=(async()=>{
  const AX=window.AudioContext||window.webkitAudioContext;
  try{AC=new AX({sampleRate:24000})}catch{AC=new AX()}
  GN=AC.createGain();GN.gain.value=.5;GN.connect(AC.destination);AC.onstatechange=mUi;
  setInterval(()=>GN.gain.setTargetAtTime(TTS&&speechSynthesis.speaking?.1:.5,AC.currentTime,.15),400);
  const b=atob(MUSIC_B64),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);
  const buf=await new Promise((ok,no)=>AC.decodeAudioData(u.buffer,ok,no));
  const sr=AC.createBufferSource();sr.buffer=buf;sr.loop=true;sr.connect(GN);sr.start()})().catch(()=>{mP=null;AC=null});
function mSrc(){
  const a=$("#au");
  if(mStep===0){
    if(!mBlob){const b=atob(MUSIC_B64),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);mBlob=URL.createObjectURL(new Blob([u],{type:"audio/mpeg"}))}
    a.src=mBlob}
  else a.src="data:audio/mpeg;base64,"+MUSIC_B64;
  a.dataset.s=mStep}
function mPlay(){
  if(mStep>1)return mWA();
  const a=$("#au");
  if(a.dataset.s!==String(mStep))mSrc();
  const p=a.play();
  if(p)p.then(()=>{mMode="el";mUi();mSess()}).catch(e=>{
    if(e&&e.name==="NotAllowedError"){mTried=false;mUi();return}
    if(e&&e.name==="AbortError")return;
    mStep++;mPlay()})}
async function mWA(){mMode="wa";await mReady();if(AC)try{await AC.resume()}catch{}mUi()}
function mPause(){if(mMode==="el")$("#au").pause();else if(AC)AC.suspend()}
function mSess(){
  if(!("mediaSession" in navigator))return;
  try{navigator.mediaSession.metadata=new MediaMetadata({title:"Nhạc nền",artist:S.cfg?.name||"Giải đấu"});
    navigator.mediaSession.setActionHandler("play",()=>{mSet(true);mPlay()});
    navigator.mediaSession.setActionHandler("pause",()=>{mSet(false);mPause()})}catch{}}
function musSync(){
  const c=!$("#vClient").hidden,b=$("#mus");b.hidden=!c;
  if(!b.innerHTML)mUi();
  if(!c){if(mPlaying()){mHold=true;mPause()}return}
  if(mHold){mHold=false;mPlay()}}
$("#mus").onclick=()=>{mTried=true;if(mPlaying()){mSet(false);mPause()}else{mSet(true);mPlay()}};
$("#au").addEventListener("play",mUi);$("#au").addEventListener("pause",mUi);
setInterval(()=>{$("#au").volume=TTS&&speechSynthesis.speaking?.1:.5},400);
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&mMode==="wa"&&mPref()&&!$("#vClient").hidden&&AC&&AC.state!=="running")AC.resume().catch(()=>{})});
let pfOpen=false;
function drawPf(){
  S.pav??={};
  const inn=!$("#site").hidden,id=inn?curId():null;
  $("#pfB").hidden=!id;$("#pfB").classList.toggle("alone",$("#gB").hidden);
  if(!id){pfOpen=false;$("#pfW").hidden=true;return}
  $("#pfW").hidden=!pfOpen;if(!pfOpen)return;
  const p=myReg(),sq=mySq(),av=S.pav[id],nm=p?p.name:user;
  $("#pfNm").textContent=nm+badgeE(id);{const fc=frameC(id);$("#pfAv").style.boxShadow=fc?`0 0 0 3px ${fc},0 0 14px ${fc}`:""}
  $("#pfAv").innerHTML=av?`<img src="${av}" alt="">`:esc((nm||"?").slice(0,1).toUpperCase());
  {const fk=eqOf(id).frame,m=fk==="f4"||fk==="f5"||fk==="f6";$("#pfAv").classList.toggle("mfr",m);$("#pfAv").classList.toggle("tet",fk==="f5");$("#pfAv").classList.toggle("rxg",fk==="f6");if(fk==="f6")$("#pfAv").dataset.acc=id;else delete $("#pfAv").dataset.acc;if(m)$("#pfAv").insertAdjacentHTML("beforeend",MFX[fk])}
  $("#pfSt").textContent=p?(p.st==="pending"?"Đang chờ duyệt":sq?"Đội: "+((sq.name||"").trim()||"Đội "+(S.squads.indexOf(sq)+1)):"Chưa vào đội"):"Chưa đăng ký tham gia";
  $("#pfL").innerHTML=p?`<div class="gm"><div class="gt"><b>Chỉ số của bạn</b></div><div class="gs"><span>K ${p.k||0}</span><span>A ${p.a||0}</span><span>MVP ${p.mvp||0}</span></div></div>`:`<p class="hint">Đăng ký tham gia giải để có chỉ số K, A, MVP.</p>`;
  $("#pfDel").hidden=!av}
$("#pfB").onclick=()=>{pfOpen=!pfOpen;if(pfOpen){if(chOpen){chOpen=false;drawChat()}if(gOpen){gOpen=false;drawGroup()}}drawPf()};
$("#chB").addEventListener("click",()=>{if(chOpen&&pfOpen){pfOpen=false;drawPf()}});
$("#gB").addEventListener("click",()=>{if(gOpen&&pfOpen){pfOpen=false;drawPf()}});
$("#pfX").onclick=()=>{pfOpen=false;drawPf()};
$("#pfSet").onclick=()=>$("#pfFile").click();
$("#pfDel").onclick=()=>{const id=curId();if(id&&S.pav){delete S.pav[id];save();draw()}};
$("#pfFile").onchange=e=>{
  const f=e.target.files[0],id=curId();e.target.value="";
  if(!f||!id||!/^image\//.test(f.type))return;
  const r=new FileReader();
  r.onload=()=>{const im=new Image();im.onload=()=>{
    const c=document.createElement("canvas");c.width=c.height=160;const x=c.getContext("2d"),s=Math.min(im.width,im.height);
    x.drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,160,160);
    (S.pav??={})[id]=c.toDataURL("image/jpeg",.85);save();draw()};im.src=r.result};
  r.readAsDataURL(f)};
const SHOP=[{id:"f1",t:"frame",n:"Khung avatar Vàng",p:100,c:"#ffd54a"},{id:"f2",t:"frame",n:"Khung avatar Lam",p:150,c:"#4da3ff"},{id:"f3",t:"frame",n:"Khung avatar Tím",p:150,c:"#c084fc"},{id:"f4",t:"frame",n:"Khung Ma Tu (động)",p:5000,m:1},{id:"f5",t:"frame",n:"Khung Tết Tiên Hiệp (động)",p:5000,m:2},{id:"f6",t:"frame",n:"Khung Rồng Xương (động)",p:5000,m:3},{id:"b1",t:"badge",n:"Huy hiệu Lửa",p:200,e:"🔥"},{id:"b2",t:"badge",n:"Huy hiệu Sao",p:200,e:"⭐"}];
const eqOf=a=>(S.eq&&S.eq[a])||{};
const frameC=a=>{const f=SHOP.find(x=>x.id===eqOf(a).frame);return f?f.c:""};
const badgeE=a=>{const b=SHOP.find(x=>x.id===eqOf(a).badge);return b?" "+b.e:""};
const MFX={f4:'<i class="rg"></i><i class="fr"></i><i class="em"></i>',f5:'<i class="fr"></i><i class="lt"></i><i class="wv"></i><i class="em"></i>',f6:'<i class="fr"></i><i class="wv"></i><i class="em"></i>'};
const rxMark=(id,it)=>{if(it&&it.id==="f6"){S.rxT??={};S.rxT[id]=Date.now()}};
const mfr=(inner,cls="",k="f4",acc="")=>`<span class="mfr${k==="f5"?" tet":k==="f6"?" rxg":""}${cls}"${k==="f6"?` data-acc="${String(acc||"shop").replace(/"/g,"")}"`:""}>${inner}${MFX[k]}</span>`;
const avImg=a=>{const v=S.pav&&S.pav[a];if(!v)return"";const c=frameC(a),im=`<img class="tav" src="${v}" alt=""${c?` style="border-color:${c};box-shadow:0 0 0 2px ${c},0 0 12px ${c}"`:""}>`;return ["f4","f5","f6"].includes(eqOf(a).frame)?mfr(im,"",eqOf(a).frame,a):im};
const PACKS=[{vnd:10000,coin:10000},{vnd:20000,coin:20000}];
const PAY={bank:"MB Bank",acc:"0382795080",name:"Lê Huỳnh Khánh Huy"}; /* điền ngân hàng / số tài khoản / tên chủ tài khoản nhận tiền */
const fmt=n=>Number(n).toLocaleString("vi-VN");
const BANKS=[{c:"VIETCOMBANK",n:"Vietcombank"},{c:"VIETINBANK",n:"VietinBank"},{c:"BIDV",n:"BIDV"},{c:"AGRIBANK",n:"Agribank"},{c:"TECHCOMBANK",n:"Techcombank"},{c:"MBBANK",n:"MB Bank"},{c:"ACB",n:"ACB"},{c:"VPBANK",n:"VPBank"},{c:"TPBANK",n:"TPBank"},{c:"SACOMBANK",n:"Sacombank"},{c:"HDBANK",n:"HDBank"},{c:"NCB",n:"NCB"}]; /* c = mã ngân hàng gửi sang cổng thanh toán, cần đối chiếu với danh sách của cổng */
const PAY_API=""; /* địa chỉ server thanh toán của bạn (có đường dẫn /create trả về payUrl). Để trống = chuyển khoản thủ công */
let shPack=null,shBank=null,shMsg="";
/* ===== VÍ COIN THẬT (Supabase): mỗi tài khoản trên trang có một ví tự tạo, không cần đăng nhập thêm ===== */
const SB_URL="https://snaqauwsvhjwqqgqmkdt.supabase.co",SB_KEY="sb_publishable_xumJPdWyAY35KPOkA-XwPw_fUvS-6cB";
let wl={sess:null,prof:null,state:"idle",msg:"",busy:false,acc:null};
const wacc=()=>(S.accounts.find(x=>x.u===user)||{}).id||null;
const wsave=()=>{try{wl.sess?localStorage.setItem("wl_sess_"+wl.acc,JSON.stringify(wl.sess)):localStorage.removeItem("wl_sess_"+wl.acc)}catch{}};
const wvi=m=>/Anonymous sign-ins are disabled/i.test(m)?"Ví tự động chưa được bật, hãy báo ban tổ chức":/Database error/i.test(m)?"Không tạo được ví, hãy thử lại":m;
async function sb(path,{method="GET",body,token}={}){
  const r=await fetch(SB_URL+path,{method,headers:{apikey:SB_KEY,"Content-Type":"application/json",...(token?{Authorization:"Bearer "+token}:{})},body:body?JSON.stringify(body):undefined});
  const d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(d.msg||d.message||d.error_description||d.error||"Lỗi "+r.status);
  return d}
function wset(d){wl.sess={access_token:d.access_token,refresh_token:d.refresh_token,expires_at:Date.now()+(d.expires_in||3600)*1000};wsave()}
async function wtoken(){
  const s=wl.sess;if(!s)return null;
  if(Date.now()>s.expires_at-60000){
    try{wset(await sb("/auth/v1/token?grant_type=refresh_token",{method:"POST",body:{refresh_token:s.refresh_token}}))}
    catch{wl.sess=null;wl.prof=null;wsave();return null}}
  return wl.sess.access_token}
async function wload(){
  const t=await wtoken();if(!t){wl.prof=null;return}
  try{wl.prof=(await sb("/rest/v1/profiles?select=username,coin",{token:t}))[0]||null}catch(e){wl.msg=wvi(e.message)}}
async function winit(){
  const id=wacc();if(!id)return;
  wl={sess:null,prof:null,state:"loading",msg:"",busy:false,acc:id};
  try{wl.sess=JSON.parse(localStorage.getItem("wl_sess_"+id)||"null")}catch{}
  try{
    if(!wl.sess){
      const d=await sb("/auth/v1/signup",{method:"POST",body:{data:{username:(user+"_"+Math.random().toString(36).slice(2,7)).slice(0,30)}}});
      if(!d.access_token)throw new Error("Chưa tạo được ví");
      wset(d)}
    await wload();
    wl.state=wl.prof?"ready":"error";if(!wl.prof&&!wl.msg)wl.msg="Chưa tải được ví"
  }catch(e){wl.state="error";wl.msg=wvi(e.message)}
  if(wl.acc===id)drawShop()}
async function wpay(vnd){
  wl.busy=true;wl.msg="";drawShop();
  try{
    const t=await wtoken();if(!t)throw new Error("Ví chưa sẵn sàng, bấm Thử lại");
    const d=await sb("/functions/v1/create-order",{method:"POST",body:{vnd},token:t});
    if(!d.payUrl)throw new Error("Không nhận được link thanh toán");
    location.href=d.payUrl;return
  }catch(e){wl.msg=wvi(e.message)}
  wl.busy=false;drawShop()}
function walletHTML(){
  const id=wacc(),load='<p class="hint">Đang kết nối ví...</p>';
  if(!id)return '<p class="hint">Hãy đăng nhập để nạp coin.</p>';
  if(wl.acc!==id||wl.state==="idle"){winit();return load}
  if(wl.state==="loading")return load;
  const m=wl.msg?`<p class="hint" style="color:#ff8fa3">${esc(wl.msg)}</p>`:"";
  if(wl.state==="error"||!wl.prof)return `<p class="hint">Chưa kết nối được ví.</p>${m}<button type="button" class="gv nap" data-wa="rt">Thử lại</button>`;
  return `<div class="gm"><div class="wb"><b>${esc(user)}</b><small>Số dư thật: 🪙 ${fmt(wl.prof.coin)} coin</small></div></div><p class="hint"><b>Chọn gói nạp</b></p><div class="shg">${PACKS.map(p=>`<button type="button" class="gv" data-wp="${p.vnd}"${wl.busy?" disabled":""}>${fmt(p.vnd)} VND<br>= ${fmt(p.coin)} coin</button>`).join("")}</div>${m}<p class="hint">Bấm gói để sang trang thanh toán. Trả xong coin tự cộng, nếu chưa thấy bấm <button type="button" class="gv" data-wa="rf">Làm mới</button></p>`}
$("#shW").addEventListener("click",e=>{
  const a=e.target.closest("[data-wa]"),p=e.target.closest("[data-wp]");
  if(p){wpay(+p.dataset.wp);return}
  if(!a)return;const k=a.dataset.wa;
  if(k==="rt"){wl.state="idle";wl.acc=null;wl.msg="";drawShop()}
  else if(k==="rf"){wload().then(drawShop)}
});
if(/orderCode|status=/.test(location.search)){shOpen=true;shTab="coin";let n=0;const iv=setInterval(()=>{if(wl.state==="ready")wload().then(drawShop);if(++n>10)clearInterval(iv)},3000)}

let shOpen=false,shTab="coin";
function drawShop(){
  S.coins??={};S.inv??={};S.eq??={};S.creq??=[];
  const id=$("#site").hidden?null:curId();
  $("#shB").hidden=!id;
  if(!id){shOpen=false;$("#shW").hidden=true;return}
  $("#shW").hidden=!shOpen;if(!shOpen)return;
  {const ae=document.activeElement;if(ae&&ae.tagName==="INPUT"&&ae.closest("#shL"))return}
  const bal=S.coins[id]||0,inv=S.inv[id]||[],eq=S.eq[id]||{},pend=S.creq.find(r=>r.acc===id);
  $("#shBal").textContent="🪙 "+bal+" coin";
  document.querySelectorAll("#shT button").forEach(b=>b.classList.toggle("on",b.dataset.st===shTab));
  $("#shL").innerHTML=shTab==="coin"
    ?walletHTML()
    :SHOP.map(it=>{const own=inv.includes(it.id),on=eq[it.t]===it.id;
      return `<div class="gm shi"><div>${it.m?mfr(`<span class="tav ph"></span>`," sm",it.id):`<span class="shp" style="background:${it.c||"rgba(255,255,255,.12)"}">${it.e||""}</span>`}<b>${esc(it.n)}</b><small>${own?"Đã sở hữu":"🪙 "+it.p+" coin"}</small></div>${own?`<button type="button" class="gv${on?" on":""}" data-eq="${it.id}">${on?"✓ Đang dùng":"Dùng"}</button>`:`<button type="button" class="gv" data-buy="${it.id}"${bal<it.p?" disabled":""}>${bal<it.p?"Thiếu coin":"Mua"}</button>`}</div>`}).join("")}
$("#shB").onclick=()=>{shOpen=!shOpen;if(shOpen){if(chOpen){chOpen=false;drawChat()}if(gOpen){gOpen=false;drawGroup()}if(pfOpen){pfOpen=false;drawPf()}}drawShop()};
$("#chB").addEventListener("click",()=>{if(chOpen&&shOpen){shOpen=false;drawShop()}});
$("#gB").addEventListener("click",()=>{if(gOpen&&shOpen){shOpen=false;drawShop()}});
$("#pfB").addEventListener("click",()=>{if(pfOpen&&shOpen){shOpen=false;drawShop()}});
$("#shX").onclick=()=>{shOpen=false;drawShop()};
$("#shT").onclick=e=>{const b=e.target.closest("[data-st]");if(b){shTab=b.dataset.st;drawShop()}};
$("#shW").addEventListener("click",e=>{
  const id=curId();if(!id)return;
  S.coins??={};S.inv??={};S.eq??={};S.creq??=[];
  const q=e.target.closest("[data-rq]"),b=e.target.closest("[data-buy]"),u=e.target.closest("[data-eq]"),c=e.target.closest("[data-rc]"),pk=e.target.closest("[data-pk]"),bk=e.target.closest("[data-bk]"),go=e.target.closest("[data-go]");
  if(q){const p=PACKS.find(x=>x.vnd===+q.dataset.rq);if(p&&!S.creq.some(r=>r.acc===id)){S.creq.push({id:uid(),t:Date.now(),acc:id,amt:p.coin,vnd:p.vnd,code:"NAP"+uid().slice(0,5).toUpperCase()});save();draw()}}
  else if(c){S.creq=S.creq.filter(r=>!(r.id===c.dataset.rc&&r.acc===id));save();draw()}
  else if(pk){shPack=+pk.dataset.pk;shMsg="";drawShop()}
  else if(bk){shBank=bk.dataset.bk;shMsg="";drawShop()}
  else if(go){payNow(id)}
  else if(b){const it=SHOP.find(x=>x.id===b.dataset.buy),bal=S.coins[id]||0;
    if(it&&bal>=it.p&&!(S.inv[id]||[]).includes(it.id)){S.coins[id]=bal-it.p;(S.inv[id]??=[]).push(it.id);(S.eq[id]??={})[it.t]=it.id;rxMark(id,it);save();draw()}}
  else if(u){const it=SHOP.find(x=>x.id===u.dataset.eq);
    if(it&&(S.inv[id]||[]).includes(it.id)){const o=S.eq[id]??={};if(o[it.t]===it.id)delete o[it.t];else{o[it.t]=it.id;rxMark(id,it)}save();draw()}}});
async function payNow(id){
  const p=PACKS.find(x=>x.vnd===shPack),k=BANKS.find(x=>x.c===shBank);
  if(!p||!k||S.creq.some(r=>r.acc===id))return;
  const o={id:uid(),t:Date.now(),acc:id,amt:p.coin,vnd:p.vnd,code:"NAP"+uid().slice(0,5).toUpperCase(),bank:k.n};
  if(PAY_API){
    try{
      const r=await fetch(PAY_API+"/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user:accName(id),vnd:o.vnd,coin:o.amt,bank:k.c,code:o.code})});
      const d=await r.json();
      if(!d||!d.payUrl)throw 0;
      S.creq.push(o);save();location.href=d.payUrl;
    }catch{shMsg="Không kết nối được cổng thanh toán, thử lại sau.";drawShop()}
    return}
  shMsg="";S.creq.push(o);save();draw()}
function giveCoin(id,n){
  S.coins??={};S.coins[id]=(S.coins[id]||0)+n;
  S.notes.push({id:uid(),to:id,text:"Bạn được cấp "+n+" coin. Số dư: "+S.coins[id]+" coin.",t:Date.now()});
  save();draw()}
function drawCoin(){
  const q=S.creq||[];$("#cgc").textContent=q.length?"("+q.length+")":"";
  $("#crq").innerHTML=q.map(r=>`<div class="m"><span class="t"><b>${esc(accName(r.acc))}</b> <span class="hint">· xin nạp ${fmt(r.amt)} coin${r.vnd?` (${fmt(r.vnd)} VND · mã ${esc(r.code||"")})`:""}</span></span><button data-cq="${r.id}">Cấp</button><button class="ghost" data-cx="${r.id}">Bỏ</button></div>`).join("")||`<p>Chưa có yêu cầu nạp coin.</p>`}
$("#cgf").onsubmit=e=>{e.preventDefault();
  const u=$("#cga").value.trim().toLowerCase(),n=Math.floor(+$("#cgn").value),a=S.accounts.find(x=>x.u.toLowerCase()===u);
  if(!a)return ok("Không có tài khoản tên này",1);
  if(!(n>=1&&n<=1e6))return ok("Số coin phải từ 1 đến 1.000.000",1);
  giveCoin(a.id,n);$("#cga").value=$("#cgn").value="";ok("Đã phát "+n+" coin cho "+a.u)};
$("#crq").onclick=e=>{
  const a=e.target.closest("[data-cq]"),b=e.target.closest("[data-cx]");
  if(a){const r=(S.creq||[]).find(x=>x.id===a.dataset.cq);if(r){S.creq=S.creq.filter(x=>x!==r);giveCoin(r.acc,r.amt);ok("Đã cấp "+r.amt+" coin cho "+accName(r.acc))}}
  else if(b){S.creq=(S.creq||[]).filter(x=>x.id!==b.dataset.cx);save();draw()}};
/* ================= KHUNG RỒNG XƯƠNG (f6) =================
   Chỉ người hạng 1 bảng cá nhân đang xem mới có rồng: bay lượn khắp màn hình 10s (2s phun lửa 1 lần) -> cuộn thành khung rồng lớn giữa màn hình -> thu nhỏ dần về avatar.
   Sau đó cứ RX_WAIT (60 giây) lại bay + hóa thành khung, lặp vô tận.
   Mọi nơi có hiện avatar kèm khung này (bảng xếp hạng, nhóm, hồ sơ...) đều chạy cùng một đồng hồ. */
(()=>{
"use strict";
const SOUND=true;        // false = tắt tiếng gầm
const WAIT=60000;        // nghỉ giữa 2 lần bay (ms)
const PI=Math.PI,N=52,GAP=14,V0=455,LAG=GAP/V0,RU=120,RF=215;
const PRE=.6,TAIL=.25,FA=2.6,FB=5.5,FRATE=110,FLIFE=.75;
const BL="#f4ecd6",BM="#cdc19f",BD="#8c8166",DK="#120d17",EM="#ff4a1c";
const ss=x=>x<=0?0:x>=1?1:x*x*(3-2*x);
const rnd=(k,s)=>{const x=Math.sin(k*127.1+s*311.7)*43758.5453;return x-Math.floor(x)};
const RAD=Array.from({length:N},(_,i)=>5+17*Math.exp(-Math.pow((i-14)/14,2)));

/* ---- kịch bản mới: bay lượn khắp màn hình 10s (cứ 2s phun lửa 1 lần) -> cuộn thành khung rồng LỚN giữa màn hình -> thu nhỏ dần về avatar ---- */
const TF0=.5,TFLY=10,TC=3.4,THOLD=1.1,TSHR=2.6,TAILX=.3;
const FB0=1.4,FGAP=2,FBN=5,FBD=.9;            // 5 lần phun lửa, mỗi lần cách nhau 2 giây
const T_C0=TF0+TFLY,T_H0=T_C0+TC,T_S0=T_H0+THOLD,T_E=T_S0+TSHR;
const DTOT=T_E+TAILX,PERIOD=DTOT*1000+WAIT;
const ff=u=>ss((u-TF0+.3)/1)*(1-ss((u-(T_C0+1))/1.2));
const burst=u=>{for(let b=0;b<FBN;b++){const x=u-(TF0+FB0+b*FGAP);if(x>=0&&x<FBD)return ss(x/.15)*(1-ss((x-.7)/.2))}return 0};
function buildPath(R){
  const w=W,h=Hh,sF=Math.max(.28,Math.min(.5,Math.min(w,h)*.00095));
  const B=Math.min(Math.min(w,h)*.88,720),Rb=B*.3165,cx=w/2,cy=h/2,ax=w*.56,ay=h*.44;
  const lb=sF*N*GAP*1.1+120,pts=[[cx-ax,cy-lb]],M=170;
  for(let i=0;i<=M;i++){const th=i/M*PI*2;pts.push([cx-ax*Math.cos(3*th),cy+ay*Math.sin(2*th)])}
  const len=q=>{let L=0;for(let i=1;i<q.length;i++)L+=Math.hypot(q[i][0]-q[i-1][0],q[i][1]-q[i-1][1]);return L};
  const Lj=len(pts),a0=PI,a1=-PI/2-2*PI,K=110;
  for(let i=1;i<=K;i++){const k=i/K,an=a0+(a1-a0)*k,r=Rb+(ax-Rb)*(1-ss(k/.6));pts.push([cx+r*Math.cos(an),cy+r*Math.sin(an)])}
  const Lr=len(pts);let q=pts;
  for(let it=0;it<2;it++){const o=[q[0]];for(let i=0;i<q.length-1;i++){const u=q[i],v=q[i+1];o.push([u[0]*.75+v[0]*.25,u[1]*.75+v[1]*.25],[u[0]*.25+v[0]*.75,u[1]*.25+v[1]*.75])}o.push(q[q.length-1]);q=o}
  const cl=[0];for(let i=1;i<q.length;i++)cl.push(cl[i-1]+Math.hypot(q[i][0]-q[i-1][0],q[i][1]-q[i-1][1]));
  const L=cl[cl.length-1],d=2,n=Math.floor(L/d)+1,X=new Float32Array(n),Y=new Float32Array(n);
  for(let k=0,j=0;k<n;k++){const t=k*d;while(j<q.length-2&&cl[j+1]<t)j++;const w2=(t-cl[j])/((cl[j+1]-cl[j])||1);X[k]=q[j][0]+(q[j+1][0]-q[j][0])*w2;Y[k]=q[j][1]+(q[j+1][1]-q[j][1])*w2}
  const tx=X[4]-X[0],ty=Y[4]-Y[0],tl=Math.hypot(tx,ty)||1;
  R.p={X,Y,d,n,L:(n-1)*d,sf:Lj*L/Lr,tx:tx/tl,ty:ty/tl};
  R.sF=sF;R.sB=Rb/RU;R.B=B;R.Rb=Rb;R.cx=cx;R.cy=cy;R.W=w;R.H=h;
}
function at(p,sg){
  if(sg<=0)return[p.X[0]+p.tx*sg,p.Y[0]+p.ty*sg];
  const f=Math.min(sg/p.d,p.n-1),i=Math.min(Math.floor(f),p.n-2),t=f-i;
  return[p.X[i]+(p.X[i+1]-p.X[i])*t,p.Y[i]+(p.Y[i+1]-p.Y[i])*t];
}
const sOf=(R,u)=>u<=T_C0?R.sF:u>=T_H0?R.sB:R.sF+(R.sB-R.sF)*ss((u-T_C0)/TC);
function sig(R,u){
  const p=R.p;if(u<=TF0)return 0;if(u<=T_C0)return p.sf*(u-TF0)/TFLY;
  const k=Math.min(1,(u-T_C0)/TC),Lc=p.L-p.sf,c=Math.max(.3,Math.min(1.9,p.sf/TFLY*TC/Lc));
  return p.sf+Lc*(c*k+(3-2*c)*k*k+(c-2)*k*k*k);
}
function headAt(R,u){const s=sOf(R,u),g=sig(R,u),a=at(R.p,g),b=at(R.p,g-GAP*s);return{x:a[0],y:a[1],an:Math.atan2(a[1]-b[1],a[0]-b[0]),s}}

/* ---- vẽ rồng (chuyển từ file Rồng xương, vẽ theo đơn vị rồng rồi thu nhỏ theo kích thước avatar) ---- */
let G,SC=1,SG,AN,WG=1,TT=0,JW=.2,FR=false;
const P=(pts,fill,stroke,lw)=>{G.beginPath();for(let i=0;i<pts.length;i++){const q=pts[i];i?G.lineTo(q[0],q[1]):G.moveTo(q[0],q[1])}G.closePath();if(fill){G.fillStyle=fill;G.fill()}if(stroke){G.strokeStyle=stroke;G.lineWidth=Math.max(lw||1.4,.7/SC);G.stroke()}};
const PL=(pts,col,lw)=>{G.beginPath();for(let i=0;i<pts.length;i++){const q=pts[i];i?G.lineTo(q[0],q[1]):G.moveTo(q[0],q[1])}G.strokeStyle=col;G.lineWidth=Math.max(lw,.7/SC);G.stroke()};
const rot=(p,a,s)=>{const c=Math.cos(a),n=Math.sin(a);return[p.x+c*s[0]-n*s[1],p.y+n*s[0]+c*s[1]]};
const SB=v=>v*SC*1.3;
function bone(a,b,w0,w1){
  const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,top=ny<0;
  const a1=[a[0]+nx*w0,a[1]+ny*w0],b1=[b[0]+nx*w1,b[1]+ny*w1],a2=[a[0]-nx*w0,a[1]-ny*w0],b2=[b[0]-nx*w1,b[1]-ny*w1];
  P([a,a1,b1,b],top?BL:BD);P([a,a2,b2,b],top?BD:BL);P([a1,b1,b2,a2],null,DK,1);
}
const joint=(q,r)=>P([[q[0],q[1]-r],[q[0]+r,q[1]],[q[0],q[1]+r],[q[0]-r,q[1]]],BL,DK,1);
function wing(i,side,f,kw){
  const p=SG[i],a=AN[i],K=WG*kw,L=(x,y)=>rot(p,a,[-x*K,side*y*K]),o=[p.x,p.y];
  const el=L(-10,46*f+16),wrl=[52,96*f+36],wr=L(wrl[0],wrl[1]);
  const V=[[94,138*f+70],[140,112*f+58],[170,70*f+40],[160,28*f+22],[118,4*f+14]];
  const Fg=V.map((v,k)=>{
    const len=Math.hypot(v[0],v[1]),px=-v[1]/len,py=v[0]/len,kk=9*(k%2?1:-1),c=Math.sin(TT*5.5-k*.4)*7;
    const m1=L(wrl[0]+v[0]*.38+px*kk,wrl[1]+v[1]*.38+py*kk);
    const m2=L(wrl[0]+v[0]*.72-px*kk*.8,wrl[1]+v[1]*.72-py*kk*.8+c*.5);
    const tp=L(wrl[0]+v[0],wrl[1]+v[1]+c);
    return{m1,m2,tp};
  });
  const B=L(128,10),tips=Fg.map(q=>q.tp);
  const notch=k=>{const A=tips[k],Bq=tips[k+1];return[(A[0]+Bq[0])/2+(wr[0]-(A[0]+Bq[0])/2)*.4,(A[1]+Bq[1])/2+(wr[1]-(A[1]+Bq[1])/2)*.4]};
  const panel=(pts,c0,c1,mid)=>{const g=G.createLinearGradient(wr[0],wr[1],mid[0],mid[1]);g.addColorStop(0,c0);g.addColorStop(1,c1);P(pts,g)};
  for(let k=0;k<4;k++){const nt=notch(k);panel([wr,Fg[k].m2,tips[k],nt,tips[k+1],Fg[k+1].m2],"rgba(225,60,70,.42)","rgba(80,10,40,.16)",nt)}
  panel([o,el,wr,Fg[4].m2,tips[4],B],"rgba(200,45,60,.34)","rgba(70,10,40,.14)",B);
  G.strokeStyle="rgba(255,150,110,.32)";G.lineWidth=Math.max(1,.6/SC);
  for(let k=0;k<4;k++){G.beginPath();G.moveTo(...Fg[k].m1);G.lineTo(...Fg[k+1].m1);G.moveTo(...Fg[k].m2);G.lineTo(...Fg[k+1].m2);G.stroke()}
  G.beginPath();G.moveTo(...el);G.lineTo(...Fg[4].m1);G.moveTo(...o);G.lineTo(...Fg[4].m2);G.stroke();
  G.save();G.shadowColor="rgba(255,90,40,.7)";G.shadowBlur=SB(10);
  const edge=[];tips.forEach((tp,k)=>{edge.push(tp);if(k<4)edge.push(notch(k))});edge.push(B);
  PL(edge,"rgba(255,140,100,.7)",1.4);G.restore();
  G.save();G.shadowColor="rgba(255,90,40,.45)";G.shadowBlur=SB(8);
  bone(o,el,7.5,5.5);bone(el,wr,5.5,4.2);
  P([[el[0]-4,el[1]-4],L(-24,46*f+36),[el[0]+4,el[1]+4]],BM,DK,1);
  bone(wr,L(wrl[0]-6,wrl[1]+26),3.4,.4);
  Fg.forEach((q,k)=>{const w=3.6-k*.25;bone(wr,q.m1,w,w*.72);bone(q.m1,q.m2,w*.72,w*.5);bone(q.m2,q.tp,w*.5,.4)});
  G.restore();
  joint(el,6);joint(wr,6.5);Fg.forEach(q=>{joint(q.m1,3.2);joint(q.m2,2.4)});
}
function head(){
  const p=SG[0],jaw=JW;
  G.save();G.translate(p.x,p.y);G.rotate(AN[0]);if(Math.cos(AN[0])<0)G.scale(1,-1);
  for(let k=-2;k<=2;k++){const tip=[-46+Math.abs(k)*9,k*22];P([[-6,k*5-3.5],tip,[-6,k*5+3.5]],k<0?BM:BD,DK,1)}
  G.shadowColor="rgba(255,90,40,.55)";G.shadowBlur=SB(12);
  [-1,1].forEach(s=>{
    P([[4,s*8],[-28,s*32],[-84,s*10],[-26,s*13]],s<0?BL:BM,DK,1.2);
    P([[-2,s*15],[-58,s*32],[-84,s*10],[-28,s*32]],s<0?BM:BD,DK,1.2);
    P([[10,s*11],[-4,s*36],[-30,s*44],[-6,s*18]],s<0?BM:BD,DK,1.2);
    PL([[-20,s*21],[-44,s*24],[-62,s*18]],DK,1.2);
  });
  G.shadowBlur=0;
  G.save();G.translate(-4,6);G.rotate(jaw);G.translate(4,-6);
  P([[-10,6],[40,6],[58,12],[10,12]],BD,DK,1.2);
  P([[10,12],[58,12],[53,18],[36,17],[-4,19]],"#1c1422",BM,1.4);
  for(let x=12;x<40;x+=6)P([[x,6],[x+3,-3],[x+6,6]],BL,DK,.8);
  P([[47,9],[51,-9],[55,10]],BL,DK,.8);
  G.restore();
  const E=DK;
  P([[-10,-14],[8,-22],[28,-18],[20,-8],[2,-6]],BL,E,1.6);
  P([[28,-18],[44,-9],[62,-4],[38,-4],[20,-8]],BM,E,1.6);
  P([[38,-4],[62,-4],[62,2],[48,6],[20,5]],BD,E,1.6);
  P([[-16,0],[-10,-14],[2,-6],[12,6],[-2,11]],"#a99e82",E,1.6);
  P([[2,-6],[20,-8],[20,5],[12,6]],"#b8ad8e",E,1.6);
  P([[-2,-9],[32,-22],[26,-12]],BL,E,1.2);
  P([[0,8],[-22,26],[20,11]],BM,E,1.2);
  for(let x=16;x<46;x+=6)P([[x,5],[x+3,12],[x+6,5]],BL,E,.8);
  P([[42,4],[46,21],[50,4]],BL,E,.8);
  P([[4,-4],[17,-11],[24,-3],[10,2]],"#000");
  G.shadowColor=EM;G.shadowBlur=SB(FR?48:26);P([[8,-4],[15,-8],[20,-4],[12,-1]],EM);
  G.shadowBlur=0;P([[13,-7],[14.5,-4.5],[13,-2],[11.5,-4.5]],"#2a0000");
  P([[50,-2],[54,-2],[54,0],[50,0]],"#000");
  G.restore();
}
function tail(){
  const p=SG[N-1];G.save();G.translate(p.x,p.y);G.rotate(AN[N-1]+PI);
  P([[0,-8],[58,0],[0,0]],BL,DK,1.2);P([[0,0],[58,0],[0,8]],BD,DK,1.2);
  [-1,1].forEach(s=>P([[10,s*6],[34,s*22],[26,s*4]],s<0?BM:BD,DK,1));
  G.restore();
}
function body(){
  {const Lf=[],Rt=[];
    for(let i=2;i<N-1;i++){const p=SG[i],r=RAD[i]*.92,a=AN[i];Lf.push([p.x-Math.sin(a)*r,p.y+Math.cos(a)*r]);Rt.push([p.x+Math.sin(a)*r,p.y-Math.cos(a)*r])}
    P([...Lf,...Rt.reverse()],"rgba(24,15,30,.96)","rgba(244,236,214,.6)",1.6);
    const L2=[],R2=[];
    for(let i=2;i<N-1;i+=2){const p=SG[i],r=RAD[i]*.45,a=AN[i];L2.push([p.x-Math.sin(a)*r,p.y+Math.cos(a)*r]);R2.push([p.x+Math.sin(a)*r,p.y-Math.cos(a)*r])}
    P([...L2,...R2.reverse()],"rgba(90,40,70,.35)");}
  for(let i=N-2;i>=1;i--){
    const p=SG[i],r=RAD[i],ny=Math.cos(AN[i]),up=ny<0?1:-1;
    const lit=s=>s===up?BL:BD,litM=s=>s===up?BM:BD;
    G.save();G.translate(p.x,p.y);G.rotate(AN[i]);
    if(i>3&&i<N-10&&i%2===0)[-1,1].forEach(s=>{PL([[0,s*r*.35],[-r*.2,s*r*1.08],[-r*1.0,s*r*.9]],DK,5);PL([[0,s*r*.35],[-r*.2,s*r*1.08],[-r*1.0,s*r*.9]],litM(s),2.6)});
    if(i%2===0)[-1,1].forEach(s=>{const sl=6+r*.9;
      P([[r*.25,s*r*.72],[-r*.5-sl*.4,s*(r*.85+sl)],[-r*.75,s*r*.55]],lit(s),DK,1);
      P([[r*.25,s*r*.72],[-r*.5-sl*.4,s*(r*.85+sl)],[-r*.3,s*r*.6]],litM(s))});
    P([[r*.62,0],[0,-r*.52],[-r*.72,0]],lit(-1),DK,1.2);
    P([[r*.62,0],[-r*.72,0],[0,r*.52]],lit(1),DK,1.2);
    P([[r*.2,0],[0,-r*.18],[-r*.25,0],[0,r*.18]],DK);
    G.restore();
  }
}
/* lửa: mỗi lần phun kéo dài FBD giây, hạt có thời điểm sinh cố định nên vị trí tính thẳng từ thời gian */
function fire(g,R,u){
  G=g;SC=1;g.save();g.globalCompositeOperation="lighter";
  for(let bi=0;bi<FBN;bi++){
    const tb=TF0+FB0+bi*FGAP,k0=Math.ceil(Math.max(tb,u-FLIFE)*FRATE),k1=Math.floor(Math.min(u,tb+FBD)*FRATE);
    for(let k=k0;k<=k1;k++){
      const te=k/FRATE,age=u-te,n=age*60,l=1-age/FLIFE;if(l<=0)continue;
      const h=headAt(R,te),m=Math.cos(h.an)<0?-9:9,c=Math.cos(h.an),sn=Math.sin(h.an);
      const mx=h.x+(c*56-sn*m)*h.s,my=h.y+(sn*56+c*m)*h.s;
      const a2=h.an+(rnd(k,1)-.5)*.4,vf=(7+rnd(k,2)*7)*h.s*1.4,d=vf*(1-Math.pow(.955,n))/.045;
      const x=mx+Math.cos(a2)*d,y=my+Math.sin(a2)*d-.12*n*h.s,z=(5+rnd(k,3)*7+.5*n)*h.s*1.5;
      const col=l>.75?"255,240,170":l>.5?"255,190,60":l>.25?"255,100,30":"200,40,20",al=Math.min(.5,l*.6);
      g.save();g.translate(x,y);g.rotate(rnd(k,4)*6+.1*n);
      P([[0,-z],[z,0],[0,z],[-z,0]],`rgba(${col},${al})`);
      g.fillStyle=`rgba(${col},${Math.min(.8,al*1.6)})`;g.beginPath();g.arc(0,0,z*.45,0,7);g.fill();g.restore();
    }
  }
  g.restore();
}
function pulse(g,x,y,r,k){
  if(k<=0||k>=1)return;
  g.save();g.globalCompositeOperation="lighter";g.lineWidth=10*(1-k)+2;g.strokeStyle=`rgba(255,${150-80*k|0},60,${.75*(1-k)})`;
  g.beginPath();g.arc(x,y,r*(1+1.1*ss(k)),0,7);g.stroke();g.restore();
}
function drawDragon(g,R,u,da){
  const s=sOf(R,u),sg=sig(R,u),f=ff(u),bf=burst(u);
  G=g;SC=s;TT=u;WG=.25+.75*f;FR=bf>.5;JW=.2+.14*Math.sin(2.2*u)*(1-bf)+.3*bf;
  SG=[];AN=[];
  for(let i=0;i<N;i++){const q=at(R.p,sg-i*GAP*s);SG.push({x:q[0]/s,y:q[1]/s})}
  for(let i=0;i<N;i++){const a=i?SG[i-1]:{x:2*SG[0].x-SG[1].x,y:2*SG[0].y-SG[1].y};AN[i]=Math.atan2(a.y-SG[i].y,a.x-SG[i].x)}
  g.save();g.scale(s,s);g.lineJoin="miter";g.lineCap="butt";g.miterLimit=2;g.globalAlpha=da;
  const flap=Math.sin(u*5),wOn=f>.04;
  if(wOn){g.globalAlpha=da*Math.min(1,f*3);wing(8,-1,flap,1);wing(8,1,flap,.62);g.globalAlpha=da}
  tail();body();
  if(wOn){g.globalAlpha=da*Math.min(1,f*3);wing(9,-1,flap*.9,1);wing(9,1,flap*.9,.62);g.globalAlpha=da}
  head();
  if(bf>0){const h=SG[0],an=AN[0],mp=rot(h,an,[56,Math.cos(an)<0?-9:9]),fg=g.createRadialGradient(mp[0],mp[1],0,mp[0],mp[1],200);
    fg.addColorStop(0,`rgba(255,170,60,${.26*bf})`);fg.addColorStop(1,"rgba(255,80,20,0)");
    g.save();g.globalCompositeOperation="lighter";g.fillStyle=fg;g.fillRect(mp[0]-200,mp[1]-200,400,400);g.restore()}
  g.restore();
}
/* khung rồng lớn: vẽ ảnh khung (lấy từ biến CSS --rxi) + avatar ở giữa, rồi thu nhỏ dần về avatar thật */
let FI=null;
const frameImg=()=>{if(FI)return FI;try{const v=getComputedStyle(document.documentElement).getPropertyValue("--rxi"),m=/url\(\s*["']?(.*?)["']?\s*\)/s.exec(v);if(m){FI=new Image();FI.src=m[1]}}catch{}return FI};
function drawFrame(g,x,y,B,al,av){
  if(al<=.003)return;const im=frameImg(),ar=B/1.752/2;
  g.save();g.globalAlpha=al;
  g.save();g.beginPath();g.arc(x,y,ar,0,7);g.clip();
  if(av&&av.complete&&av.naturalWidth)g.drawImage(av,x-ar,y-ar,ar*2,ar*2);else{g.fillStyle="#5b6cff";g.fill()}
  g.restore();
  if(im&&im.complete&&im.naturalWidth)g.drawImage(im,x-B/2,y-B/2,B,B);
  g.restore();
}

/* ---- âm thanh: tiếng gầm tổng hợp bằng Web Audio (giống file Rồng xương) ---- */
let AX=null,NB=null;const lastK={};
const unlock=()=>{try{if(!AX)AX=new(window.AudioContext||window.webkitAudioContext)();if(AX.state==="suspended")AX.resume()}catch{}};
["pointerdown","keydown","touchend"].forEach(e=>addEventListener(e,unlock,{passive:true}));
const noiseBuf=ac=>NB||(NB=(()=>{const b=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b})());
const dcurve=k=>{const n=256,c=new Float32Array(n);for(let i=0;i<n;i++)c[i]=Math.tanh(k*(i*2/n-1));return c};
function sfx(kind,vol){
  if(!SOUND||!AX||AX.state!=="running")return;
  if(AX.currentTime-(lastK[kind]||-9)<.8)return;lastK[kind]=AX.currentTime;
  const ac=AX,now=ac.currentTime,out=ac.createGain(),cmp=ac.createDynamicsCompressor(),srcs=[];let dur;
  out.connect(cmp);cmp.connect(ac.destination);
  const nz=(rate)=>{const n=ac.createBufferSource();n.buffer=noiseBuf(ac);n.loop=true;if(rate)n.playbackRate.value=rate;srcs.push(n);return n};
  if(kind==="roar"){
    dur=2.9;
    out.gain.setValueAtTime(.0001,now);out.gain.linearRampToValueAtTime(vol,now+.07);out.gain.exponentialRampToValueAtTime(vol*.5,now+1.2);
    out.gain.setValueAtTime(vol*.5,now+dur-.7);out.gain.exponentialRampToValueAtTime(.0001,now+dur);
    const ws=ac.createWaveShaper();ws.curve=dcurve(6);
    const lp=ac.createBiquadFilter();lp.type="lowpass";lp.frequency.setValueAtTime(500,now);lp.frequency.linearRampToValueAtTime(1400,now+.3);lp.frequency.linearRampToValueAtTime(700,now+1.5);
    const tr=ac.createGain();tr.gain.value=.6;
    const lfo=ac.createOscillator();lfo.frequency.value=26;const lg=ac.createGain();lg.gain.value=.4;lfo.connect(lg);lg.connect(tr.gain);srcs.push(lfo);
    [0,21,-27].forEach(d=>{const o=ac.createOscillator();o.type="sawtooth";o.detune.value=d;
      o.frequency.setValueAtTime(75,now);o.frequency.exponentialRampToValueAtTime(150,now+.25);o.frequency.exponentialRampToValueAtTime(58,now+1.8);o.connect(ws);srcs.push(o)});
    ws.connect(lp);lp.connect(tr);tr.connect(out);
    const n1=nz(),bp=ac.createBiquadFilter();bp.type="bandpass";bp.Q.value=.8;bp.frequency.setValueAtTime(600,now);bp.frequency.linearRampToValueAtTime(1800,now+.5);
    const ng=ac.createGain();ng.gain.value=.55;n1.connect(bp);bp.connect(ng);ng.connect(out);
    const n2=nz(.5),lp2=ac.createBiquadFilter();lp2.type="lowpass";lp2.frequency.value=300;const g2=ac.createGain();g2.gain.value=.8;n2.connect(lp2);lp2.connect(g2);g2.connect(out);
  }else if(kind==="whoosh"){
    dur=1.1;
    out.gain.setValueAtTime(.0001,now);out.gain.linearRampToValueAtTime(vol*.7,now+.35);out.gain.exponentialRampToValueAtTime(.0001,now+dur);
    const n=nz(),bp=ac.createBiquadFilter();bp.type="bandpass";bp.Q.value=1.1;bp.frequency.setValueAtTime(300,now);bp.frequency.exponentialRampToValueAtTime(2600,now+.45);bp.frequency.exponentialRampToValueAtTime(500,now+dur);
    n.connect(bp);bp.connect(out);
  }else{
    dur=.9;
    out.gain.setValueAtTime(.0001,now);out.gain.linearRampToValueAtTime(vol*1.1,now+.02);out.gain.exponentialRampToValueAtTime(.0001,now+dur);
    const o=ac.createOscillator();o.type="sine";o.frequency.setValueAtTime(95,now);o.frequency.exponentialRampToValueAtTime(38,now+.6);o.connect(out);srcs.push(o);
    const n=nz(),lp=ac.createBiquadFilter();lp.type="lowpass";lp.frequency.setValueAtTime(1800,now);lp.frequency.exponentialRampToValueAtTime(200,now+.5);
    const ng=ac.createGain();ng.gain.value=.6;n.connect(lp);lp.connect(ng);ng.connect(out);
  }
  srcs.forEach(x=>x.start(now));srcs.forEach(x=>{try{x.stop(now+dur+.1)}catch{}});
}

/* ---- lớp phủ + vòng lặp: tìm mọi avatar đang đeo khung Rồng Xương trên màn hình ---- */
const cv=document.createElement("canvas");
cv.id="rxcv";cv.setAttribute("aria-hidden","true");
cv.style.cssText="position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:36";
document.body.appendChild(cv);
const cx2=cv.getContext("2d");let dpr=1,W=0,Hh=0,dirty=false;
const fit=()=>{dpr=Math.min(window.devicePixelRatio||1,2);W=innerWidth;Hh=innerHeight;cv.width=Math.round(W*dpr);cv.height=Math.round(Hh*dpr)};
fit();addEventListener("resize",fit);
const t0of=key=>{try{return(S.rxT&&S.rxT[key])||0}catch{return 0}};
const setA=(el,a)=>{if(el._a!==a){el._a=a;el.style.setProperty("--rxa",String(a))}};
const setV=(el,a)=>{if(el._v!==a){el._v=a;el.style.setProperty("--rxv",String(a))}};
/* CHỈ avatar ở HẠNG 1 của bảng cá nhân đang hiển thị mới có rồng bay.
   Rời bảng đó (sang xếp hạng đội, che khuất, cuộn mất...) là dừng ngay; quay lại thì bắt đầu lại từ đầu.
   Các hạng còn lại và mọi nơi khác (hồ sơ, nhóm, cửa hàng...) chỉ hiện khung tĩnh. */
let R=null;
function frame(){
  requestAnimationFrame(frame);
  const list=document.getElementsByClassName("rxg");
  if(!list.length){if(dirty){cx2.setTransform(1,0,0,1,0,0);cx2.clearRect(0,0,cv.width,cv.height);dirty=false}R=null;return}
  if(document.hidden)return;
  const now=Date.now();
  cx2.setTransform(dpr,0,0,dpr,0,0);
  if(dirty){cx2.clearRect(0,0,W,Hh);dirty=false}
  let pe=null,pr=null;
  for(let n=0;n<list.length&&!pe;n++){
    const el=list[n];if(!el.closest("#sbd tr.r1"))continue;
    const r=el.getBoundingClientRect();if(r.width<8||r.bottom<0||r.top>Hh||r.right<0||r.left>W)continue;
    const top=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);
    if(top&&(el===top||el.contains(top))){pe=el;pr=r}
  }
  for(let n=0;n<list.length;n++){const el=list[n];if(el!==pe){setA(el,1);setV(el,1)}}
  if(!pe){R=null;return}
  const key=pe.dataset.acc||"x";
  if(!R||R.key!==key)R={key,t0:now,cyc:0,fl:{},W:0,H:0,A:pr.width,cx0:0,cy0:0,av:null};
  const cyc=Math.floor((now-R.t0)/PERIOD);if(cyc!==R.cyc){R.cyc=cyc;R.fl={}}
  const u=((now-R.t0)%PERIOD)/1000;
  if(u>=DTOT){setA(pe,1);setV(pe,1);return}
  if(R.W!==W||R.H!==Hh)buildPath(R);
  R.A=pr.width;R.cx0=pr.left+pr.width/2;R.cy0=pr.top+pr.height/2;R.av=pe.querySelector("img.tav")||R.av;
  /* khung avatar thật: tan biến lúc đầu, hiện lại khi khung lớn đã thu nhỏ về đúng chỗ */
  const a=u<TF0?1-ss(u/.4):u<T_E?0:ss((u-T_E)/TAILX),v=u<T_H0?1:u<T_E?0:ss((u-T_E)/TAILX);
  setA(pe,a);setV(pe,v);
  const g=cx2,fl=R.fl,hit=(nm,t,kind,vol)=>{if(!fl[nm]&&u>=t&&u<t+1.5){fl[nm]=1;sfx(kind,vol)}};
  hit("w0",TF0,"whoosh",.5);hit("r0",TF0+FB0,"roar",.5);for(let bi=1;bi<FBN;bi++)hit("f"+bi,TF0+FB0+bi*FGAP,"whoosh",.4);hit("b0",T_H0,"boom",.55);
  const dk=.5*ss((u-T_C0)/TC)*(1-ss((u-T_S0)/TSHR));
  if(dk>.01){const gr=g.createRadialGradient(R.cx,R.cy,0,R.cx,R.cy,Math.max(W,Hh)*.7);gr.addColorStop(0,`rgba(0,0,0,${dk})`);gr.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=gr;g.fillRect(0,0,W,Hh)}
  pulse(g,R.cx0,R.cy0,R.A*.9,u/.9);pulse(g,R.cx,R.cy,R.Rb,(u-T_H0+.2)/.9);
  const da=u<T_H0?1:1-ss((u-T_H0-.2)/.7);
  if(da>.003){drawDragon(g,R,u,da);fire(g,R,u)}
  if(u>=T_H0){
    const k=ss((u-T_S0)/TSHR),fa=u<T_E?ss((u-T_H0)/.8):1-ss((u-T_E)/TAILX),Bt=R.A*1.752;
    drawFrame(g,R.cx+(R.cx0-R.cx)*k,R.cy+(R.cy0-R.cy)*k,R.B+(Bt-R.B)*k,fa,R.av);
  }
  dirty=true;
}
requestAnimationFrame(frame);
})();

/* Không còn tài khoản thử tự vào sẵn: mới vào là trang Đăng nhập / Đăng ký. Dọn tài khoản "Khách thử" cũ nếu còn trong dữ liệu */
try{const NM="Khách thử",g=S.accounts.find(x=>x.u===NM);
if(g){const id=g.id,pids=S.players.filter(p=>p.acc===id||p.name===NM).map(p=>p.id);
 S.accounts=S.accounts.filter(x=>x.id!==id);S.players=S.players.filter(p=>!pids.includes(p.id));
 for(const k of["pav","coins","inv","eq","rxT"])if(S[k])delete S[k][id];
 for(const q of(S.squads||[]))for(const k in q)if(Array.isArray(q[k]))q[k]=q[k].filter(v=>!pids.includes(v)&&!(v&&v.id&&pids.includes(v.id)));
 if(me===id)setMe(null);save()}
if(user===NM){user=null;try{sessionStorage.removeItem("cu")}catch{}}}catch(e){}
route();
