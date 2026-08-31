import {onAuthStateChanged,signInWithEmailAndPassword,signOut,dbGet,friendlyFirebaseError} from '../js/firebase.js';
import {header,footer} from '../js/ui.js';
header();footer();
const form=document.getElementById('admin-login-form');
const msg=document.getElementById('admin-msg');
const next=new URLSearchParams(location.search).get('next')||'./index.html';
function setMsg(text,type='error'){msg.textContent=text;msg.className=`form-message ${type}`;}
async function checkAdmin(user){if(!user)return false;const snap=await dbGet(`admins/${user.uid}`).catch(()=>null);return !!(snap?.exists()&&snap.val()===true);}
onAuthStateChanged(async user=>{if(!user)return; if(await checkAdmin(user)){location.replace(next);return;} await signOut().catch(()=>{}); if(new URLSearchParams(location.search).get('unauthorized')==='1') setMsg('This Firebase account is not authorized for owner access.','error');});
form.addEventListener('submit',async e=>{e.preventDefault();const email=document.getElementById('admin-email').value.trim().toLowerCase(),password=document.getElementById('admin-password').value,button=form.querySelector('button');if(!email||!password)return setMsg('Enter the owner email and password.');button.disabled=true;button.textContent='Verifying owner access…';setMsg('Authenticating securely…','info');try{const cred=await signInWithEmailAndPassword(email,password);const ok=await checkAdmin(cred.user);if(!ok){await signOut().catch(()=>{});setMsg('Access denied. This account is not an authorized admin.');button.disabled=false;button.textContent='Sign In as Admin';return;}setMsg('Owner verified. Opening bureau…','success');location.replace(next);}catch(error){setMsg(friendlyFirebaseError(error));button.disabled=false;button.textContent='Sign In as Admin';}});
