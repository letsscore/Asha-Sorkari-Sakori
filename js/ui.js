import {onAuthStateChanged,signOut} from "./firebase.js";
export function header(){
 const root=document.getElementById("site-header");if(!root)return;
 root.innerHTML=`<header class="site-header"><nav class="nav container"><a class="brand" href="index.html"><span class="brand-mark">AS</span><span><b>Asha Sorkari Sakori</b><small>Competitive Exam Preparation</small></span></a><button class="menu" id="menu" aria-label="Open menu">☰</button><div class="nav-links" id="links"><a href="index.html">Home</a><a href="exams.html">Exams</a><a href="courses.html">Courses</a><a href="mock-tests.html">Mock Tests</a><a href="current-affairs.html">Current Affairs</a><a href="jobs.html">Jobs</a><a href="study.html">Resources</a><a class="nav-cta" href="login.html" id="auth-link">Login</a></div></nav></header>`;
 document.getElementById("menu")?.addEventListener("click",()=>document.getElementById("links")?.classList.toggle("open"));
 onAuthStateChanged(user=>{const link=document.getElementById("auth-link");if(!link)return;if(user){link.textContent="My Dashboard";link.href="dashboard.html";}});
}
export function footer(){const root=document.getElementById("site-footer");if(root)root.innerHTML=`<footer><div class="container footer-inner"><div><strong>Asha Sorkari Sakori</strong><p>Independent competitive-examination preparation platform for Assam aspirants.</p></div><div class="footer-links"><a href="courses.html">Courses</a><a href="mock-tests.html">Mock Tests</a><a href="jobs.html">Jobs</a><a href="login.html">Student Login</a></div></div><div class="container copyright">© ${new Date().getFullYear()} Asha Sorkari Sakori · Competitive Exams</div></footer>`;}
export const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));
export async function logout(){await signOut();location.href="index.html";}
