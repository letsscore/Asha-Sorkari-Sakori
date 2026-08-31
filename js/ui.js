export function header(){
  const r=document.getElementById("site-header");
  if(!r)return;
  const inAdmin=location.pathname.includes("/admin/");
  const base=inAdmin?"../":"";
  r.innerHTML=`<header><nav class="nav"><a class="brand" href="${base}index.html">🏆 Asha <span>Sorkari Sakori</span></a><button class="menu" id="menu" aria-label="Open menu">☰</button><div class="nav-links" id="links"><a href="${base}index.html">Home</a><a href="${base}exams.html">Exams</a><a href="${base}mock-tests.html">Mock Tests</a><a href="${base}current-affairs.html">Current Affairs</a><a href="${base}jobs.html">Jobs</a><a href="${base}study.html">Study</a><a href="${base}login.html" id="auth-link">Login</a></div></nav></header>`;
  document.getElementById("menu")?.addEventListener("click",()=>document.getElementById("links").classList.toggle("open"));
}
export function footer(){
  const r=document.getElementById("site-footer");
  if(r)r.innerHTML=`<footer><strong>Asha Sorkari Sakori</strong><br><small>Competitive Examination Preparation Platform • Assam</small></footer>`;
}
export const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));
