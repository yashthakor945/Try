const $=s=>document.querySelector(s),K='yourhisab_v1';
const KS='home hisab reports calc more total addAcc accName noAcc motor qty rate amount add update date noEntry motors addMotor noMotor language backup restore csv pdf from to month account allAcc rMonthly rRange rMotor rCust rAll confirm entries today monthTotal allTotal fill dayTotal'.split(' ');
const T={en:'Home|Daily Hisab|Reports|Calculator|More|Total|Add account|Customer / work name|No accounts yet. Tap “Add account” to start.|Motor type|Quantity|Rate|Amount|Add entry|Update entry|Date|No entries for this day.|Motor types|Add motor type, e.g. 3 HP TP|Add a motor type first (More tab).|Language|Backup|Restore|Export CSV|Save / Print PDF|From|To|Month|Account|All accounts|Monthly|Date to date|Motor-wise|Customer-wise|All combined|Delete this?|entries|Today|This month|All accounts total|Enter quantity and rate.|Day total',
hi:'होम|दैनिक हिसाब|रिपोर्ट|कैलकुलेटर|और|कुल|खाता जोड़ें|ग्राहक / काम का नाम|अभी कोई खाता नहीं है। शुरू करने के लिए “खाता जोड़ें” दबाएँ।|मोटर टाइप|मात्रा|रेट|रकम|एंट्री जोड़ें|एंट्री अपडेट करें|तारीख|इस दिन की कोई एंट्री नहीं।|मोटर टाइप्स|मोटर टाइप जोड़ें, जैसे 3 HP TP|पहले मोटर टाइप जोड़ें (और टैब)।|भाषा|बैकअप|रीस्टोर|CSV निकालें|PDF सेव / प्रिंट|से|तक|महीना|खाता|सभी खाते|मासिक|तारीख से तारीख|मोटर अनुसार|ग्राहक अनुसार|सभी एक साथ|इसे हटाएँ?|एंट्री|आज|इस महीने|सभी खातों का कुल|मात्रा और रेट भरें।|दिन का कुल',
gu:'હોમ|દૈનિક હિસાબ|રિપોર્ટ|કેલ્ક્યુલેટર|વધુ|કુલ|ખાતું ઉમેરો|ગ્રાહક / કામનું નામ|હજી કોઈ ખાતું નથી. શરૂ કરવા “ખાતું ઉમેરો” દબાવો.|મોટર પ્રકાર|જથ્થો|ભાવ|રકમ|એન્ટ્રી ઉમેરો|એન્ટ્રી અપડેટ કરો|તારીખ|આ દિવસની કોઈ એન્ટ્રી નથી.|મોટર પ્રકારો|મોટર પ્રકાર ઉમેરો, દા.ત. 3 HP TP|પહેલા મોટર પ્રકાર ઉમેરો (વધુ ટેબ).|ભાષા|બેકઅપ|રીસ્ટોર|CSV એક્સપોર્ટ|PDF સેવ / પ્રિન્ટ|થી|સુધી|મહિનો|ખાતું|બધા ખાતા|માસિક|તારીખથી તારીખ|મોટર મુજબ|ગ્રાહક મુજબ|બધા સાથે|આ કાઢી નાખવું?|એન્ટ્રી|આજ|આ મહિને|બધા ખાતાનો કુલ|જથ્થો અને ભાવ ભરો.|દિવસનો કુલ'};
for(const l in T)T[l]=T[l].split('|');
let D;try{D=JSON.parse(localStorage.getItem(K))}catch(x){}
if(!D||!Array.isArray(D.acc)||!Array.isArray(D.motors))D={lang:'en',acc:[],motors:[]};
const save=()=>localStorage.setItem(K,JSON.stringify(D));
const t=k=>(T[D.lang]||T.en)[KS.indexOf(k)];
const loc=()=>({en:'en-IN',hi:'hi-IN',gu:'gu-IN'})[D.lang]||'en-IN';
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const num=n=>(+n||0).toLocaleString('en-IN',{maximumFractionDigits:2});
const money=n=>'₹'+num(n);
const amt=e=>Math.round(e.q*e.r*100)/100;
const sum=a=>a.reduce((s,e)=>s+amt(e),0);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const fmtd=s=>s.split('-').reverse().join('/');
const now=new Date(),first=new Date(now.getFullYear(),now.getMonth(),1);
let tab='home',cur=null,date=null,cal=first,editId=null,hAcc='';
let R={mode:'monthly',acc:'all',month:iso(now).slice(0,7),from:iso(first),to:iso(now)};
const RK={monthly:'rMonthly',range:'rRange',motor:'rMotor',customer:'rCust',all:'rAll'};
const A=()=>D.acc.find(a=>a.id===cur);
function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('show');clearTimeout(toast.h);toast.h=setTimeout(()=>e.classList.remove('show'),1800)}
function tb(h,rows,f,nl){const c=(v,i)=>`<td class="${i>=nl?'r':''}">${v}</td>`;
 return `<table><thead><tr>${h.map((x,i)=>`<th class="${i>=nl?'r':''}">${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c).join('')}</tr>`).join('')}</tbody><tfoot><tr>${f.map(c).join('')}</tr></tfoot></table>`}
/* ---------- navigation ---------- */
function go(x){tab=x;cur=null;date=null;editId=null;render()}
function openAcc(id){cur=id;date=null;cal=first;render()}
function openDay(s){date=s;editId=null;render()}
function jump(id,d){cur=id;date=d;editId=null;render()}
function back(){if(date){date=null;editId=null}else cur=null;render()}
function mon(d){cal=new Date(cal.getFullYear(),cal.getMonth()+d,1);render()}
function setLang(c){D.lang=c;save();render()}
/* ---------- accounts ---------- */
function addAcc(){const n=(prompt(t('accName'))||'').trim();if(!n)return;D.acc.push({id:uid(),n,e:[]});save();render()}
function editAcc(id){const a=D.acc.find(x=>x.id===id),n=(prompt(t('accName'),a.n)||'').trim();if(n){a.n=n;save();render()}}
function delAcc(id){if(confirm(t('confirm'))){D.acc=D.acc.filter(a=>a.id!==id);save();render()}}
/* ---------- entries ---------- */
function pv(){$('#pv').textContent=money(Math.round((+$('#q').value||0)*(+$('#r').value||0)*100)/100)}
function autoRate(){if(editId||$('#r').value)return;const l=[...A().e].reverse().find(e=>e.m===$('#m').value);if(l){$('#r').value=l.r;pv()}}
function saveE(){const a=A(),m=$('#m').value,q=parseFloat($('#q').value),r=parseFloat($('#r').value);
 if(!m)return toast(t('noMotor'));if(!(q>0)||isNaN(r)||r<0)return toast(t('fill'));
 if(editId)Object.assign(a.e.find(e=>e.id===editId),{m,q,r});else a.e.push({id:uid(),d:date,m,q,r});
 editId=null;save();render();toast('✓')}
function editE(id){editId=id;render();scrollTo(0,0)}
function delE(id){if(confirm(t('confirm'))){const a=A();a.e=a.e.filter(e=>e.id!==id);if(editId===id)editId=null;save();render()}}
/* ---------- motors ---------- */
function addM(){const n=$('#nm').value.trim();if(!n)return;if(D.motors.some(m=>m.toLowerCase()===n.toLowerCase()))return toast('✓');D.motors.push(n);save();render()}
function editM(i){const o=D.motors[i],n=(prompt(t('motor'),o)||'').trim();if(!n||n===o)return;D.motors[i]=n;D.acc.forEach(a=>a.e.forEach(e=>{if(e.m===o)e.m=n}));save();render()}
function delM(i){if(confirm(t('confirm'))){D.motors.splice(i,1);save();render()}}
/* ---------- export / backup ---------- */
function dl(n,s,ty){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([s],{type:ty}));a.download=n;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),2000)}
const csv=rows=>'\ufeff'+['Account,Date,Motor,Qty,Rate,Amount',...rows.map(r=>[r.a,r.d,r.m,r.q,r.r,r.t].map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(','))].join('\n');
const allRows=()=>D.acc.flatMap(a=>a.e.map(e=>({...e,a:a.n,t:amt(e)})));
function csvAll(){dl('your-hisab-'+iso(now)+'.csv',csv(allRows()),'text/csv')}
function csvRep(){dl('your-hisab-report-'+iso(now)+'.csv',csv(rd()),'text/csv')}
function backup(){dl('your-hisab-backup-'+iso(now)+'.json',JSON.stringify(D),'application/json')}
function restore(inp){const f=inp.files[0];if(!f)return;const r=new FileReader();
 r.onload=()=>{try{const j=JSON.parse(r.result);if(!Array.isArray(j.acc)||!Array.isArray(j.motors))throw 0;
  if(!confirm(t('restore')+'?'))return;D={lang:j.lang||D.lang,acc:j.acc,motors:j.motors};save();render();toast('✓')}catch(x){toast('Invalid backup file')}inp.value=''};r.readAsText(f)}
/* ---------- reports ---------- */
function rd(){let f=R.from,e=R.to;if(R.mode==='monthly'){f=R.month+'-01';e=R.month+'-31'}
 const all=R.mode==='customer'||R.mode==='all'||R.acc==='all',rows=[];
 D.acc.forEach(a=>{if(all||a.id===R.acc)a.e.forEach(x=>{if(x.d>=f&&x.d<=e)rows.push({...x,a:a.n,t:amt(x)})})});
 return rows.sort((x,y)=>x.d<y.d?-1:x.d>y.d?1:0)}
function grp(rows,k){const o={};rows.forEach(r=>{const g=o[r[k]]=o[r[k]]||{q:0,t:0};g.q+=r.q;g.t+=r.t});return Object.entries(o)}
function repBody(rows){if(!rows.length)return `<p style="margin-top:10px"><small>${t('noEntry')}</small></p>`;
 const tq=rows.reduce((s,r)=>s+r.q,0),tt=rows.reduce((s,r)=>s+r.t,0),m=R.mode;
 if(m==='motor'||m==='customer')return tb([t(m==='motor'?'motor':'account'),t('qty'),t('amount')],grp(rows,m==='motor'?'m':'a').map(([k,v])=>[esc(k),num(v.q),money(v.t)]),[t('total'),num(tq),money(tt)],1);
 const sa=R.acc==='all'||m==='all';
 return tb([t('date'),...(sa?[t('account')]:[]),t('motor'),t('qty'),t('rate'),t('amount')],rows.map(r=>[fmtd(r.d),...(sa?[esc(r.a)]:[]),esc(r.m),num(r.q),num(r.r),money(r.t)]),[t('total'),...(sa?['']:[]),'',num(tq),'',money(tt)],sa?3:2)}
function reports(){const ch=Object.keys(RK).map(m=>`<button class="sec${R.mode===m?' on':''}" onclick="R.mode='${m}';render()">${t(RK[m])}</button>`).join('');
 const scope=R.mode==='customer'||R.mode==='all'?'':`<label>${t('account')}</label><select onchange="R.acc=this.value;render()"><option value="all">${t('allAcc')}</option>${D.acc.map(a=>`<option value="${a.id}"${R.acc===a.id?' selected':''}>${esc(a.n)}</option>`).join('')}</select>`;
 const per=R.mode==='monthly'?`<label>${t('month')}</label><input type="month" value="${R.month}" onchange="R.month=this.value;render()">`:`<div class="f2"><div><label>${t('from')}</label><input type="date" value="${R.from}" onchange="R.from=this.value;render()"></div><div><label>${t('to')}</label><input type="date" value="${R.to}" onchange="R.to=this.value;render()"></div></div>`;
 const pd=R.mode==='monthly'?R.month:fmtd(R.from)+' – '+fmtd(R.to);
 return `<div class="chips np">${ch}</div><div class="card np">${scope}${per}<div class="f2" style="margin-top:12px"><button class="sec" onclick="print()">${t('pdf')}</button><button class="sec" onclick="csvRep()">CSV</button></div></div>
 <div class="card"><div class="po"><b>YOUR HISAB</b></div><h3>${t(RK[R.mode])}</h3><small>${pd}</small>${repBody(rd())}</div>`}
/* ---------- views ---------- */
function home(){const all=D.acc.flatMap(a=>a.e),td=iso(now);
 return `<div class="hero"><small>${t('allTotal')}</small><h1>${money(sum(all))}</h1><div class="st"><div><small>${t('today')}</small><b>${money(sum(all.filter(e=>e.d===td)))}</b></div><div><small>${t('account')}</small><b>${D.acc.length}</b></div></div></div>
 <button class="pri" onclick="addAcc()">+ ${t('addAcc')}</button>
 ${D.acc.length?D.acc.map(a=>`<div class="card row go" onclick="openAcc('${a.id}')"><div class="av">${esc([...a.n][0])}</div><div class="g"><b>${esc(a.n)}</b><br><small>${a.e.length} ${t('entries')}</small></div><b>${money(sum(a.e))}</b><button class="ic" onclick="event.stopPropagation();editAcc('${a.id}')">✎</button><button class="ic" onclick="event.stopPropagation();delAcc('${a.id}')">🗑</button></div>`).join(''):`<div class="card"><small>${t('noAcc')}</small></div>`}`}
function accView(){const a=A(),y=cal.getFullYear(),m=cal.getMonth(),ms=iso(cal).slice(0,7),mt=a.e.filter(e=>e.d.startsWith(ms)),ds=new Set(mt.map(e=>e.d));
 let c=[0,1,2,3,4,5,6].map(i=>`<span>${new Date(2024,0,7+i).toLocaleDateString(loc(),{weekday:'narrow'})}</span>`).join('');
 for(let i=0;i<cal.getDay();i++)c+='<i></i>';
 for(let d=1;d<=new Date(y,m+1,0).getDate();d++){const s=ms+'-'+String(d).padStart(2,'0');c+=`<button class="d${ds.has(s)?' has':''}${s===iso(now)?' td':''}" onclick="openDay('${s}')">${d}</button>`}
 return `<button class="sec" onclick="back()">← ${t('home')}</button><h2>${esc(a.n)}</h2>
 <div class="hero"><small>${t('monthTotal')}</small><h1 style="margin-bottom:0">${money(sum(mt))}</h1></div>
 <div class="card"><div class="mh"><button class="ic" onclick="mon(-1)">‹</button><span>${cal.toLocaleDateString(loc(),{month:'long',year:'numeric'})}</span><button class="ic" onclick="mon(1)">›</button></div><div class="cal">${c}</div></div>`}
function dayView(){const a=A(),es=a.e.filter(e=>e.d===date),ed=es.find(e=>e.id===editId)||{},ms=[...new Set([...(ed.m?[ed.m]:[]),...D.motors])];
 return `<button class="sec" onclick="back()">← ${esc(a.n)}</button><h2>${fmtd(date)}</h2>
 <div class="card">${D.motors.length?'':`<p class="warn">${t('noMotor')}</p>`}<label>${t('motor')}</label><select id="m" onchange="autoRate()">${ms.map(m=>`<option${m===ed.m?' selected':''}>${esc(m)}</option>`).join('')}</select>
 <div class="f2"><div><label>${t('qty')}</label><input id="q" type="number" inputmode="decimal" step="any" min="0" value="${ed.q??''}" oninput="pv()"></div><div><label>${t('rate')}</label><input id="r" type="number" inputmode="decimal" step="any" min="0" value="${ed.r??''}" oninput="pv()"></div></div>
 <p style="margin:10px 0">${t('amount')}: <b id="pv">${money(ed.id?amt(ed):0)}</b></p><button class="pri" onclick="saveE()">${ed.id?t('update'):t('add')}</button></div>
 <div class="hero"><small>${t('dayTotal')}</small><h1 style="margin-bottom:0">${money(sum(es))}</h1></div>
 ${es.length?es.map(e=>`<div class="card row"><div class="g"><b>${esc(e.m)}</b><br><small>${num(e.q)} × ${num(e.r)}</small></div><b>${money(amt(e))}</b><button class="ic" onclick="editE('${e.id}')">✎</button><button class="ic" onclick="delE('${e.id}')">🗑</button></div>`).join(''):`<div class="card"><small>${t('noEntry')}</small></div>`}`}
function hisab(){if(!D.acc.length)return `<h2>${t('hisab')}</h2><div class="card"><small>${t('noAcc')}</small></div>`;
 if(!D.acc.some(a=>a.id===hAcc))hAcc=D.acc[0].id;const a=D.acc.find(x=>x.id===hAcc),by={};a.e.forEach(e=>(by[e.d]=by[e.d]||[]).push(e));
 return `<h2>${t('hisab')}</h2><select onchange="hAcc=this.value;render()">${D.acc.map(x=>`<option value="${x.id}"${x.id===hAcc?' selected':''}>${esc(x.n)}</option>`).join('')}</select>
 <div class="hero" style="margin-top:12px"><small>${t('total')}</small><h1 style="margin-bottom:0">${money(sum(a.e))}</h1></div>
 ${Object.keys(by).sort().reverse().map(d=>`<div class="card go" onclick="jump('${a.id}','${d}')">${tb([t('date'),t('motor'),t('qty'),t('rate'),t('amount')],by[d].map(e=>[fmtd(d),esc(e.m),num(e.q),num(e.r),money(amt(e))]),[t('dayTotal'),'',num(by[d].reduce((s,e)=>s+e.q,0)),'',money(sum(by[d]))],2)}</div>`).join('')||`<div class="card"><small>${t('noEntry')}</small></div>`}`}
function more(){return `<h2>${t('language')}</h2><div class="card f3">${[['en','English'],['hi','हिन्दी'],['gu','ગુજરાતી']].map(([c,n])=>`<button class="sec${D.lang===c?' on':''}" onclick="setLang('${c}')">${n}</button>`).join('')}</div>
 <h2>${t('motors')}</h2><div class="card"><div class="row"><input id="nm" placeholder="${t('addMotor')}" onkeydown="if(event.key==='Enter')addM()"><button class="pri" style="width:auto" onclick="addM()">+</button></div>${D.motors.map((m,i)=>`<div class="row" style="padding-top:10px"><div class="g"><b>${esc(m)}</b></div><button class="ic" onclick="editM(${i})">✎</button><button class="ic" onclick="delM(${i})">🗑</button></div>`).join('')}</div>
 <h2>${t('backup')}</h2><div class="card f2"><button class="sec" onclick="backup()">${t('backup')}</button><button class="sec" onclick="$('#rf').click()">${t('restore')}</button><button class="sec" onclick="csvAll()" style="grid-column:span 2">${t('csv')}</button><input id="rf" type="file" accept=".json,application/json" hidden onchange="restore(this)"></div>`}
/* ---------- calculator ---------- */
let ex='',sm='',eq=false;
function ev(s){const n=s.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');if(!/^[\d+\-*/().\s]+$/.test(n))return null;
 try{const v=Function('"use strict";return ('+n+')')();return isFinite(v)?String(Math.round(v*1e10)/1e10):null}catch(x){return null}}
function key(k){const op='+−×÷';
 if(k==='AC'){ex='';sm='';eq=false}
 else if(k==='⌫'){ex=ex.slice(0,-1);eq=false}
 else if(k==='='){if(!ex)return;const r=ev(ex);sm=r===null?'Error':ex+' =';ex=r===null?'':r;eq=r!==null}
 else if(op.includes(k)){if(!ex)ex='0';if(op.includes(ex.slice(-1)))ex=ex.slice(0,-1);ex+=k;eq=false}
 else if(k==='%')ex=ex.replace(/(\d*\.?\d+)$/,m=>String(+m/100));
 else if(k==='±'){const m=ex.match(/\(-(\d*\.?\d+)\)$|\d*\.?\d+$/);if(m)ex=ex.slice(0,m.index)+(m[1]!==undefined?m[1]:'(-'+m[0]+')')}
 else{if(eq){ex='';sm='';eq=false}if(ex.slice(-1)===')')return;if(k==='.'){if(/\.\d*$/.test(ex))return;if(!/\d$/.test(ex))ex+='0'}ex+=k}
 $('#cx').textContent=ex||'0';$('#cs').textContent=sm}
function calc(){return `<div class="card disp"><small id="cs">${esc(sm)}</small><div id="cx">${esc(ex)||'0'}</div></div><div class="keys">${['AC','⌫','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','±','0','.','='].map(k=>`<button class="${'AC⌫%÷×−+±'.includes(k)?'o':''}${k==='='?'e':''}" onclick="key('${k}')">${k}</button>`).join('')}</div>`}
/* ---------- render ---------- */
function render(){document.documentElement.lang=D.lang;
 document.querySelectorAll('nav button').forEach(b=>{b.classList.toggle('on',b.dataset.t===tab);b.querySelector('span').textContent=t(b.dataset.t)});
 const v=$('#app');v.innerHTML=cur?(date?dayView():accView()):({home,hisab,reports,calc,more})[tab]();
 v.classList.remove('in');void v.offsetWidth;v.classList.add('in');
 if(cur&&date)autoRate()}
render();if(navigator.storage&&navigator.storage.persist)navigator.storage.persist();
