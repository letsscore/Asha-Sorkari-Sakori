import { onAuthStateChanged, signOut, dbPush, dbSet } from './firebase.js';

const base = location.pathname.includes('/admin/') ? '../' : '';

export function esc(value){
  return String(value ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

export function header(){
  const root = document.getElementById('site-header');
  if(!root) return;
  root.innerHTML = `<header class="site-header">
    <div class="container nav-wrap">
      <a class="brand" href="${base}index.html" aria-label="Asha Sorkari Sakori home">
        <span class="brand-mark">AS</span>
        <span class="brand-copy"><strong>Asha Sorkari Sakori</strong><small>Competitive Exam Preparation</small></span>
      </a>
      <button class="menu-toggle" id="menu-toggle" aria-label="Open navigation">☰</button>
      <nav class="nav-links" id="nav-links">
        <a href="${base}exams.html">Exams</a>
        <a href="${base}courses.html">Courses</a>
        <a href="${base}mock-tests.html">Mock Tests</a>
        <a href="${base}current-affairs.html">Current Affairs</a>
        <a href="${base}jobs.html">Government Jobs</a>
        <a href="${base}study.html">Resources</a>
        <span class="nav-divider"></span>
        <a href="${base}login.html" id="auth-link" class="nav-login">Login</a>
        <a href="${base}register.html" id="register-link" class="nav-register">Create Account</a>
      </nav>
    </div>
  </header>`;
  document.getElementById('menu-toggle')?.addEventListener('click',()=>document.getElementById('nav-links')?.classList.toggle('open'));
  if(!document.getElementById('page-progress')){const bar=document.createElement('div');bar.id='page-progress';document.body.appendChild(bar);document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||e.defaultPrevented||a.target==='_blank'||a.origin!==location.origin||a.hash&&a.pathname===location.pathname)return;bar.classList.remove('run');void bar.offsetWidth;bar.classList.add('run');},{passive:true});}
  onAuthStateChanged(user=>{
    const auth = document.getElementById('auth-link');
    const reg = document.getElementById('register-link');
    if(!auth || !reg) return;
    if(user){
      auth.textContent='Dashboard'; auth.href=`${base}dashboard.html`; auth.classList.add('nav-dashboard');
      reg.textContent='Logout'; reg.href='#'; reg.classList.remove('nav-register'); reg.classList.add('nav-logout');
      reg.onclick=e=>{e.preventDefault(); logout(base+'index.html');};
    }
  });
}

export function footer(){
  const root=document.getElementById('site-footer'); if(!root) return;
  root.innerHTML=`<footer class="site-footer"><div class="container footer-grid">
    <div><a class="brand footer-brand" href="${base}index.html"><span class="brand-mark">AS</span><span class="brand-copy"><strong>Asha Sorkari Sakori</strong><small>Competitive Exam Preparation</small></span></a><p>Focused preparation, practice and recruitment updates for competitive-exam aspirants.</p><div class="footer-contact"><a href="mailto:sorkarisakori@gmail.com">sorkarisakori@gmail.com</a><a href="https://wa.me/917002137940" target="_blank" rel="noopener">WhatsApp · 7002137940</a></div></div>
    <div><h4>Prepare</h4><a href="${base}exams.html">Competitive Exams</a><a href="${base}courses.html">Free & Premium Courses</a><a href="${base}mock-tests.html">Mock Tests</a><a href="${base}study.html">Study Resources</a></div>
    <div><h4>Stay Updated</h4><a href="${base}jobs.html">Government Jobs</a><a href="${base}current-affairs.html">Current Affairs</a><a href="${base}about.html">About Us</a><a href="${base}contact.html">Contact Us</a></div>
    <div><h4>Legal</h4><a href="${base}privacy.html">Privacy Policy</a><a href="${base}login.html">Aspirant Login</a><a href="${base}register.html">Create Account</a></div>
  </div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} Asha Sorkari Sakori</span><span>Built exclusively for competitive-exam preparation.</span></div></footer>`;
}

export async function trackActivity(user, action, details={}){
  if(!user) return;
  try{
    const ref=await dbPush(`activity/${user.uid}`);
    await dbSet(`activity/${user.uid}/${ref.key}`,{userId:user.uid,email:user.email||'',action,details,createdAt:Date.now()});
  }catch(_){ /* activity logging must never break the user flow */ }
}

export async function logout(destination='index.html'){
  const user=await new Promise(resolve=>{let settled=false; onAuthStateChanged(u=>{if(!settled){settled=true;resolve(u);}});});
  if(user) await trackActivity(user,'logout');
  await signOut();
  location.href=destination;
}

export function formatMoney(value){ return Number(value||0)===0 ? 'Free' : `₹${Number(value).toLocaleString('en-IN')}`; }
export function formatDate(value){ return value ? new Date(value).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—'; }
