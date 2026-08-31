import {onAuthStateChanged,dbGet,dbSet,dbUpdate,dbPush} from '../js/firebase.js';
import {EXAMS,COURSES} from '../js/data.js';
import {header,footer,esc,formatMoney,formatDate} from '../js/ui.js';

header(); footer();
const $=id=>document.getElementById(id);
const examName=id=>EXAMS.find(e=>e.id===id)?.name||'Not selected';
const courseName=id=>COURSES.find(c=>c.id===id)?.title||id||'—';
async function read(path){try{const s=await dbGet(path);return s.exists()?s.val():{};}catch{return {};}}

async function requireAdmin(){
  return new Promise(resolve=>{
    let settled=false;
    onAuthStateChanged(async user=>{
      if(settled)return; settled=true;
      if(!user){location.href='../login.html?next='+encodeURIComponent(location.href);resolve(null);return;}
      const ok=await dbGet(`admins/${user.uid}`).catch(()=>null);
      if(!ok?.exists()||ok.val()!==true){
        document.querySelector('main').innerHTML=`<section class="section container narrow"><div class="access-card"><div class="access-icon">⛔</div><span class="eyebrow">PRIVATE OWNER AREA</span><h2>Admin access required</h2><p>This area is restricted to the owner/admin account configured in the Asha Sorkari Sakori Firebase database.</p><a class="btn" href="../dashboard.html">Back to Dashboard</a></div></section>`;
        return;
      }
      resolve(user);
    });
  });
}
const admin=await requireAdmin();
if(!admin) throw new Error('Admin access denied');

function flatActivity(activity){
  return Object.values(activity||{}).flatMap(x=>Object.values(x||{})).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
}
function csvCell(v){return `"${String(v??'').replace(/"/g,'""')}"`;}
function downloadCSV(filename,rows){
  const csv=rows.map(r=>r.map(csvCell).join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}

async function renderBureau(){
 const root=$('admin-root');if(!root)return;
 root.innerHTML='<div class="loading-state">Loading owner bureau…</div>';
 const [users,purchases,results,activity,jobs]=await Promise.all([read('users'),read('purchases'),read('results'),read('activity'),read('jobs')]);
 const U=Object.values(users||{}),P=Object.values(purchases||{}),R=Object.values(results||{}),J=Object.values(jobs||{}),A=flatActivity(activity);
 const pending=P.filter(x=>x.status==='pending'),approved=P.filter(x=>x.status==='approved'),rejected=P.filter(x=>['rejected','revoked'].includes(x.status));
 const revenue=approved.reduce((n,x)=>n+Number(x.amount||0),0);
 const activePremiumUsers=new Set(approved.map(x=>x.userId)).size;
 const targets={};U.forEach(u=>{const k=u.targetExam||'Not selected';targets[k]=(targets[k]||0)+1;});
 const courseCounts={};P.forEach(p=>{const k=p.courseTitle||courseName(p.courseId);courseCounts[k]=(courseCounts[k]||0)+1;});
 const activityCounts={};A.forEach(a=>{const k=a.action||'activity';activityCounts[k]=(activityCounts[k]||0)+1;});
 const maxTarget=Math.max(1,...Object.values(targets));
 const maxCourse=Math.max(1,...Object.values(courseCounts));
 const maxActivity=Math.max(1,...Object.values(activityCounts));

 root.innerHTML=`
 <div class="admin-top">
  <div><span class="eyebrow">OWNER CONSOLE • PRIVATE</span><h2>Aspirant Data Bureau</h2><p>Registered aspirants, course demand, payments, results and activity — competitive-exam website only.</p></div>
  <div class="admin-user">Owner session<br><b>${esc(admin.email||'Authenticated')}</b></div>
 </div>
 <div class="admin-actions"><a class="btn secondary" href="users.html">👥 Aspirant Database</a><a class="btn secondary" href="tests.html">📝 Tests</a><a class="btn secondary" href="jobs.html">📢 Jobs</a><button class="btn" id="refresh-bureau">↻ Refresh</button><button class="btn secondary" id="export-users">Export Aspirants CSV</button><button class="btn secondary" id="export-purchases">Export Payments CSV</button></div>
 <div class="admin-stats">
  <div><span>Total aspirants</span><strong>${U.length}</strong><small>All registered accounts</small></div>
  <div><span>Premium customers</span><strong>${activePremiumUsers}</strong><small>Approved premium access</small></div>
  <div><span>Pending payments</span><strong>${pending.length}</strong><small>Need owner review</small></div>
  <div><span>Approved revenue</span><strong>${formatMoney(revenue)}</strong><small>Based on approved records</small></div>
  <div><span>Tests submitted</span><strong>${R.length}</strong><small>Saved performance records</small></div>
  <div><span>Activity events</span><strong>${A.length}</strong><small>Recorded platform actions</small></div>
 </div>

 <div class="admin-dashboard-grid">
  <section class="admin-panel chart-panel"><div class="admin-panel-head"><div><span class="eyebrow">AUDIENCE ANALYTICS</span><h3>Target examination interest</h3><p>Which competitive examinations aspirants are preparing for.</p></div></div>
   <div class="admin-bars">${Object.entries(targets).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div><div><b>${esc(examName(k))}</b><span>${v} aspirant${v===1?'':'s'}</span></div><i style="width:${Math.max(5,(v/maxTarget)*100)}%"></i></div>`).join('')||'<p class="muted">No aspirants registered yet.</p>'}</div>
  </section>
  <section class="admin-panel chart-panel"><div class="admin-panel-head"><div><span class="eyebrow">COURSE DEMAND</span><h3>Free vs premium demand</h3><p>Purchase requests grouped by course.</p></div></div>
   <div class="admin-bars">${Object.entries(courseCounts).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div><div><b>${esc(k)}</b><span>${v}</span></div><i style="width:${Math.max(5,(v/maxCourse)*100)}%"></i></div>`).join('')||'<p class="muted">No purchase records yet.</p>'}</div>
  </section>
 </div>

 <section class="admin-panel"><div class="admin-panel-head"><div><span class="eyebrow">PAYMENT BUREAU</span><h3>UTR verification queue</h3><p>Approve access only after you verify the payment in your UPI app/bank records.</p></div><span class="admin-count">${pending.length} pending</span></div>
  <div class="admin-table"><table><thead><tr><th>Aspirant</th><th>Course</th><th>Amount</th><th>UTR</th><th>Submitted</th><th>Status</th><th>Action</th></tr></thead><tbody>
  ${P.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).map(p=>`<tr><td><b>${esc(p.userName||'Aspirant')}</b><small>${esc(p.userEmail||'')}</small></td><td>${esc(p.courseTitle||courseName(p.courseId))}</td><td>${formatMoney(p.amount)}</td><td><code>${esc(p.transactionId||'—')}</code></td><td>${formatDate(p.createdAt)}</td><td><span class="status-chip ${esc(p.status||'pending')}">${esc(p.status||'pending')}</span></td><td>${p.status==='approved'?`<button class="btn tiny danger" data-revoke="${esc(p.purchaseId)}" data-user="${esc(p.userId)}" data-course="${esc(p.courseId)}">Revoke</button>`:p.status==='revoked'?'<span class="muted">Revoked</span>':`<button class="btn tiny" data-approve="${esc(p.purchaseId)}" data-user="${esc(p.userId)}" data-course="${esc(p.courseId)}">Approve Access</button>`}</td></tr>`).join('')||'<tr><td colspan="7">No payment records yet.</td></tr>'}
  </tbody></table></div>
 </section>

 <section class="admin-panel"><div class="admin-panel-head"><div><span class="eyebrow">ASPIRANT DATABASE</span><h3>Recent aspirants</h3><p>Open the full searchable database to inspect an individual profile.</p></div><a class="text-link" href="users.html">Open full database →</a></div>
  <div class="admin-table"><table><thead><tr><th>Aspirant</th><th>Target exam</th><th>Free</th><th>Premium requests</th><th>Registered</th><th>Last login</th></tr></thead><tbody>${U.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,30).map(u=>{const ps=P.filter(p=>p.userId===u.uid);return `<tr><td><button class="profile-link" data-profile="${esc(u.uid)}"><b>${esc(u.name||'—')}</b><small>${esc(u.email||'')}</small></button></td><td>${esc(examName(u.targetExam))}</td><td>${u.enrollments?.['free-foundation']?'Active':'—'}</td><td>${ps.length}</td><td>${formatDate(u.createdAt)}</td><td>${formatDate(u.lastLogin)}</td></tr>`}).join('')||'<tr><td colspan="6">No aspirants yet.</td></tr>'}</tbody></table></div>
 </section>

 <div class="admin-dashboard-grid">
  <section class="admin-panel chart-panel"><div class="admin-panel-head"><div><span class="eyebrow">ACTIVITY ANALYTICS</span><h3>Platform activity</h3><p>Most frequently recorded actions.</p></div></div><div class="admin-bars">${Object.entries(activityCounts).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([k,v])=>`<div><div><b>${esc(k.replaceAll('_',' '))}</b><span>${v}</span></div><i style="width:${Math.max(5,(v/maxActivity)*100)}%"></i></div>`).join('')||'<p class="muted">No activity recorded yet.</p>'}</div></section>
  <section class="admin-panel"><div class="admin-panel-head"><div><span class="eyebrow">RECENT EVENTS</span><h3>Activity log</h3><p>Registration, login, logout, enrolment, payment and test events.</p></div></div><div class="admin-table compact-table"><table><thead><tr><th>Time</th><th>Aspirant</th><th>Action</th></tr></thead><tbody>${A.slice(0,20).map(a=>`<tr><td>${formatDate(a.createdAt)}<small>${a.createdAt?new Date(a.createdAt).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}):''}</small></td><td>${esc(a.email||'—')}</td><td><span class="status-chip">${esc((a.action||'activity').replaceAll('_',' '))}</span></td></tr>`).join('')||'<tr><td colspan="3">No activity recorded yet.</td></tr>'}</tbody></table></div></section>
 </div>

 <section class="admin-panel"><div class="admin-panel-head"><div><span class="eyebrow">RECRUITMENT</span><h3>Government vacancy publishing</h3><p>Publish current recruitment information for aspirants.</p></div></div>
  <form id="job-form" class="admin-form"><div><label>Job / post title<input id="job-title" required placeholder="e.g. Assam Government Recruitment 2026"></label><label>Organization<input id="job-org" required placeholder="Department / Commission"></label></div><div><label>Number of posts<input id="job-posts" placeholder="e.g. 120"></label><label>Last date<input id="job-last" type="date"></label></div><label>Description<textarea id="job-desc" rows="4" placeholder="Eligibility, important details and notification summary"></textarea></label><label>Official application URL<input id="job-url" type="url" placeholder="https://official-website..."></label><button class="btn" type="submit">Publish Vacancy</button><p id="job-msg" class="form-message"></p></form>
 </section>
 <div id="profile-modal" class="modal-backdrop hidden"><div class="profile-modal"><button class="modal-close" id="profile-close" aria-label="Close">×</button><div id="profile-content"></div></div></div>`;

 root.querySelectorAll('[data-approve]').forEach(btn=>btn.onclick=async()=>{btn.disabled=true;try{const id=btn.dataset.approve,uid=btn.dataset.user,cid=btn.dataset.course;await dbUpdate('',{[`purchases/${id}/status`]:'approved',[`purchases/${id}/verifiedAt`]:Date.now(),[`purchases/${id}/verifiedBy`]:admin.uid,[`users/${uid}/purchases/${id}/status`]:'approved',[`users/${uid}/purchases/${id}/verifiedAt`]:Date.now(),[`courseAccess/${uid}/${cid}`]:true});await renderBureau();}catch(e){btn.disabled=false;alert(e.message);}});
 root.querySelectorAll('[data-revoke]').forEach(btn=>btn.onclick=async()=>{if(!confirm('Revoke this premium access?'))return;btn.disabled=true;try{const id=btn.dataset.revoke,uid=btn.dataset.user,cid=btn.dataset.course;await dbUpdate('',{[`purchases/${id}/status`]:'revoked',[`purchases/${id}/revokedAt`]:Date.now(),[`purchases/${id}/revokedBy`]:admin.uid,[`users/${uid}/purchases/${id}/status`]:'revoked',[`courseAccess/${uid}/${cid}`]:false});await renderBureau();}catch(e){btn.disabled=false;alert(e.message);}});
 root.querySelectorAll('[data-profile]').forEach(btn=>btn.onclick=()=>showProfile(btn.dataset.profile,U,P,R,A));
 $('profile-close').onclick=()=>$('profile-modal').classList.add('hidden');
 $('profile-modal').onclick=e=>{if(e.target.id==='profile-modal')e.currentTarget.classList.add('hidden');};
 $('refresh-bureau').onclick=async()=>{const b=$('refresh-bureau');b.disabled=true;b.textContent='Refreshing…';try{await renderBureau();}finally{b.disabled=false;b.textContent='↻ Refresh';}};
 $('export-users').onclick=()=>downloadCSV('asha-sorkari-sakori-aspirants.csv',[['UID','Name','Email','Target Exam','Free Enrolled','Premium Access Count','Registered','Last Login'],...U.map(u=>[u.uid,u.name,u.email,examName(u.targetExam),u.enrollments?.['free-foundation']?'Yes':'No',P.filter(p=>p.userId===u.uid&&p.status==='approved').length,formatDate(u.createdAt),formatDate(u.lastLogin)])]);
 $('export-purchases').onclick=()=>downloadCSV('asha-sorkari-sakori-payments.csv',[['Purchase ID','UID','Aspirant','Email','Course','Amount','UTR','Status','Submitted','Verified'],...P.map(p=>[p.purchaseId,p.userId,p.userName,p.userEmail,p.courseTitle||courseName(p.courseId),p.amount,p.transactionId,p.status,formatDate(p.createdAt),formatDate(p.verifiedAt)])]);
 $('job-form').onsubmit=async e=>{e.preventDefault();const b=e.currentTarget.querySelector('button'),msg=$('job-msg');b.disabled=true;b.textContent='Publishing…';try{const ref=await dbPush('jobs');const now=Date.now();await dbSet(`jobs/${ref.key}`,{title:$('job-title').value.trim(),organization:$('job-org').value.trim(),postCount:$('job-posts').value.trim(),lastDate:$('job-last').value||'',description:$('job-desc').value.trim(),applyUrl:$('job-url').value.trim(),status:'OPEN',publishedAt:now,createdAt:now});msg.className='form-message success';msg.textContent='Vacancy published successfully.';e.currentTarget.reset();}catch(err){msg.className='form-message error';msg.textContent=err.message;}finally{b.disabled=false;b.textContent='Publish Vacancy';}};
}

async function showProfile(uid,U,P,R,A){
 const u=U.find(x=>x.uid===uid);if(!u)return;
 const ps=P.filter(p=>p.userId===uid).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
 const rs=R.filter(r=>r.userId===uid).sort((a,b)=>(b.submittedAt||0)-(a.submittedAt||0));
 const as=A.filter(a=>a.userId===uid).slice(0,30);
 const access=await read(`courseAccess/${uid}`);
 const avg=rs.length?Math.round(rs.reduce((n,r)=>n+Number(r.percentage||0),0)/rs.length):0;
 $('profile-content').innerHTML=`<div class="profile-head"><div class="profile-avatar">${esc((u.name||'A').charAt(0).toUpperCase())}</div><div><span class="eyebrow">ASPIRANT PROFILE</span><h2>${esc(u.name||'Aspirant')}</h2><p>${esc(u.email||'')}</p></div></div>
 <div class="profile-stats"><div><span>Target exam</span><b>${esc(examName(u.targetExam))}</b></div><div><span>Premium access</span><b>${Object.keys(access).length}</b></div><div><span>Tests taken</span><b>${rs.length}</b></div><div><span>Average score</span><b>${avg}%</b></div></div>
 <div class="profile-section"><h3>Account</h3><p>Registered: <b>${formatDate(u.createdAt)}</b> · Last login: <b>${formatDate(u.lastLogin)}</b></p></div>
 <div class="profile-section"><h3>Purchase history</h3><div class="admin-table"><table><thead><tr><th>Course</th><th>Amount</th><th>UTR</th><th>Status</th><th>Date</th></tr></thead><tbody>${ps.map(p=>`<tr><td>${esc(p.courseTitle||courseName(p.courseId))}</td><td>${formatMoney(p.amount)}</td><td><code>${esc(p.transactionId||'—')}</code></td><td><span class="status-chip ${esc(p.status||'pending')}">${esc(p.status||'pending')}</span></td><td>${formatDate(p.createdAt)}</td></tr>`).join('')||'<tr><td colspan="5">No purchases.</td></tr>'}</tbody></table></div></div>
 <div class="profile-section"><h3>Test performance</h3><div class="admin-table"><table><thead><tr><th>Test</th><th>Score</th><th>Percentage</th><th>Date</th></tr></thead><tbody>${rs.map(r=>`<tr><td>${esc(r.testTitle||r.testId||'Test')}</td><td>${esc(r.score)}/${esc(r.total)}</td><td><b>${esc(r.percentage)}%</b></td><td>${formatDate(r.submittedAt)}</td></tr>`).join('')||'<tr><td colspan="4">No tests taken.</td></tr>'}</tbody></table></div></div>
 <div class="profile-section"><h3>Recent activity</h3><div class="activity-list">${as.map(a=>`<div><span>${esc((a.action||'activity').replaceAll('_',' '))}</span><small>${formatDate(a.createdAt)} · ${a.createdAt?new Date(a.createdAt).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}):''}</small></div>`).join('')||'<p class="muted">No activity recorded.</p>'}</div></div>`;
 $('profile-modal').classList.remove('hidden');
}

async function renderUsers(){
 const el=$('admin-users');if(!el)return;
 const [users,purchases,results]=await Promise.all([read('users'),read('purchases'),read('results')]);
 const U=Object.values(users||{}),P=Object.values(purchases||{}),R=Object.values(results||{});
 el.innerHTML=`<div class="admin-toolbar"><input id="user-search" placeholder="Search name, email or UID"><select id="exam-filter"><option value="">All target exams</option>${EXAMS.map(e=>`<option value="${e.id}">${esc(e.name)}</option>`).join('')}</select><select id="course-filter"><option value="">All purchase status</option><option value="approved">Premium approved</option><option value="pending">Payment pending</option><option value="none">No premium request</option></select><button class="btn secondary" id="users-export">Export CSV</button></div><div class="admin-table"><table><thead><tr><th>Aspirant</th><th>Target</th><th>Free</th><th>Premium</th><th>Tests</th><th>Registered</th><th>Last login</th><th></th></tr></thead><tbody id="users-body"></tbody></table></div><div id="users-profile-modal" class="modal-backdrop hidden"><div class="profile-modal"><button class="modal-close" id="users-profile-close">×</button><div id="users-profile-content"></div></div></div>`;
 const draw=()=>{const q=$('user-search').value.toLowerCase().trim(),f=$('exam-filter').value,c=$('course-filter').value;const rows=U.filter(u=>{const ps=P.filter(p=>p.userId===u.uid);return(!q||`${u.uid} ${u.name||''} ${u.email||''}`.toLowerCase().includes(q))&&(!f||u.targetExam===f)&&(!c||(c==='none'?ps.length===0:ps.some(p=>p.status===c)));}).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));$('users-body').innerHTML=rows.map(u=>{const ps=P.filter(p=>p.userId===u.uid),approved=ps.filter(p=>p.status==='approved').length,tests=R.filter(r=>r.userId===u.uid).length;return `<tr><td><button class="profile-link" data-user-profile="${esc(u.uid)}"><b>${esc(u.name||'—')}</b><small>${esc(u.email||'')}</small></button></td><td>${esc(examName(u.targetExam))}</td><td>${u.enrollments?.['free-foundation']?'Active':'—'}</td><td>${approved?`<span class="status-chip approved">${approved} active</span>`:ps.length?`<span class="status-chip pending">${ps.length} request</span>`:'—'}</td><td>${tests}</td><td>${formatDate(u.createdAt)}</td><td>${formatDate(u.lastLogin)}</td><td><button class="btn tiny" data-user-profile="${esc(u.uid)}">View</button></td></tr>`}).join('')||'<tr><td colspan="8">No matching aspirants.</td></tr>';rootProfileHandlers();};
 const rootProfileHandlers=()=>document.querySelectorAll('[data-user-profile]').forEach(b=>b.onclick=()=>showUsersProfile(b.dataset.userProfile,U,P,R));
 $('user-search').oninput=draw;$('exam-filter').onchange=draw;$('course-filter').onchange=draw;
 $('users-export').onclick=()=>downloadCSV('asha-sorkari-sakori-aspirants.csv',[['UID','Name','Email','Target Exam','Free Enrolled','Premium Approved','Purchase Requests','Tests Taken','Registered','Last Login'],...U.map(u=>{const ps=P.filter(p=>p.userId===u.uid);return[u.uid,u.name,u.email,examName(u.targetExam),u.enrollments?.['free-foundation']?'Yes':'No',ps.filter(p=>p.status==='approved').length,ps.length,R.filter(r=>r.userId===u.uid).length,formatDate(u.createdAt),formatDate(u.lastLogin)]})]);
 $('users-profile-close').onclick=()=>$('users-profile-modal').classList.add('hidden');draw();
}
async function showUsersProfile(uid,U,P,R){
 const u=U.find(x=>x.uid===uid);if(!u)return;const ps=P.filter(p=>p.userId===uid).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)),rs=R.filter(r=>r.userId===uid).sort((a,b)=>(b.submittedAt||0)-(a.submittedAt||0)),access=await read(`courseAccess/${uid}`),avg=rs.length?Math.round(rs.reduce((n,r)=>n+Number(r.percentage||0),0)/rs.length):0;
 $('users-profile-content').innerHTML=`<div class="profile-head"><div class="profile-avatar">${esc((u.name||'A').charAt(0).toUpperCase())}</div><div><span class="eyebrow">ASPIRANT PROFILE</span><h2>${esc(u.name||'Aspirant')}</h2><p>${esc(u.email||'')}</p></div></div><div class="profile-stats"><div><span>Target</span><b>${esc(examName(u.targetExam))}</b></div><div><span>Premium</span><b>${Object.keys(access).length}</b></div><div><span>Tests</span><b>${rs.length}</b></div><div><span>Average</span><b>${avg}%</b></div></div><div class="profile-section"><h3>Purchase history</h3><div class="admin-table"><table><thead><tr><th>Course</th><th>Amount</th><th>UTR</th><th>Status</th></tr></thead><tbody>${ps.map(p=>`<tr><td>${esc(p.courseTitle||courseName(p.courseId))}</td><td>${formatMoney(p.amount)}</td><td><code>${esc(p.transactionId||'—')}</code></td><td><span class="status-chip ${esc(p.status||'pending')}">${esc(p.status||'pending')}</span></td></tr>`).join('')||'<tr><td colspan="4">No purchases.</td></tr>'}</tbody></table></div></div><div class="profile-section"><h3>Test performance</h3><div class="result-grid">${rs.map(r=>`<div class="result-card-mini"><b>${esc(r.testTitle||r.testId)}</b><strong>${esc(r.percentage)}%</strong><span>${esc(r.score)}/${esc(r.total)} · ${formatDate(r.submittedAt)}</span></div>`).join('')||'<p class="muted">No test records.</p>'}</div></div>`;
 $('users-profile-modal').classList.remove('hidden');
}
async function renderSimplePage(){
 const tests=$('admin-tests');if(tests){const raw=await read('tests');tests.innerHTML=`<div class="admin-table"><table><thead><tr><th>Test</th><th>Exam</th><th>Questions</th><th>Duration</th></tr></thead><tbody>${Object.values(raw||{}).map(t=>`<tr><td>${esc(t.title||'Untitled')}</td><td>${esc(examName(t.examId))}</td><td>${t.questions?.length||0}</td><td>${esc(t.duration||0)} min</td></tr>`).join('')||'<tr><td colspan="4">No tests published.</td></tr>'}</tbody></table></div>`;}
 const jobs=$('admin-jobs');if(jobs){const raw=await read('jobs');jobs.innerHTML=`<div class="admin-table"><table><thead><tr><th>Vacancy</th><th>Organization</th><th>Last date</th><th>Status</th></tr></thead><tbody>${Object.values(raw||{}).sort((a,b)=>(b.publishedAt||0)-(a.publishedAt||0)).map(j=>`<tr><td>${esc(j.title||'')}</td><td>${esc(j.organization||'')}</td><td>${formatDate(j.lastDate)}</td><td>${esc(j.status||'OPEN')}</td></tr>`).join('')||'<tr><td colspan="4">No vacancies published.</td></tr>'}</tbody></table></div>`;}
}
await renderBureau();await renderUsers();await renderSimplePage();
