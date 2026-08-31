import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile, signOut, dbGet, dbSet, friendlyFirebaseError } from './firebase.js';
import { header, footer, trackActivity } from './ui.js';
header(); footer();
const msg=document.getElementById('form-msg');
function setMsg(text,type='error'){if(msg){msg.textContent=text;msg.className=`form-message ${type}`;}}
const nextUrl=()=>new URLSearchParams(location.search).get('next') || 'dashboard.html';

document.getElementById('register-form')?.addEventListener('submit',async e=>{
  e.preventDefault();
  const form=e.currentTarget, name=document.getElementById('name').value.trim(), email=document.getElementById('email').value.trim().toLowerCase(), password=document.getElementById('password').value, target=document.getElementById('target-exam')?.value||'';
  const button=form.querySelector('button[type=submit]');
  if(name.length<2) return setMsg('Please enter your full name.');
  if(!email) return setMsg('Please enter your email address.');
  if(password.length<6) return setMsg('Password must be at least 6 characters.');
  button.disabled=true;button.textContent='Creating account…';setMsg('Setting up your aspirant account…','info');
  try{
    const cred=await createUserWithEmailAndPassword(email,password);
    await updateProfile(cred.user,{displayName:name});
    await dbSet(`users/${cred.user.uid}`,{uid:cred.user.uid,name,email,targetExam:target,accountType:'aspirant',createdAt:Date.now(),lastLogin:Date.now(),enrollments:{}});
    await trackActivity(cred.user,'registration',{targetExam:target});
    location.href=nextUrl();
  }catch(error){setMsg(friendlyFirebaseError(error));button.disabled=false;button.textContent='Create Aspirant Account';}
});

document.getElementById('login-form')?.addEventListener('submit',async e=>{
  e.preventDefault();
  const form=e.currentTarget,email=document.getElementById('email').value.trim().toLowerCase(),password=document.getElementById('password').value,button=form.querySelector('button[type=submit]');
  button.disabled=true;button.textContent='Signing in…';setMsg('Checking your account…','info');
  try{
    const cred=await signInWithEmailAndPassword(email,password);
    const deletedSnap=await dbGet(`deletedUsers/${cred.user.uid}`).catch(()=>null);
    if(deletedSnap?.exists()){
      await signOut().catch(()=>{});
      return setMsg('This account has been removed by the site owner and can no longer access the website.');
    }
    // Authentication success must not be blocked by optional database bookkeeping.
    // This is important when Firebase Rules are being updated/deployed.
    try {
      const profileSnap=await dbGet(`users/${cred.user.uid}`);
      if(profileSnap.exists()){
        await dbSet(`users/${cred.user.uid}/lastLogin`,Date.now());
      } else {
        await dbSet(`users/${cred.user.uid}`,{uid:cred.user.uid,name:cred.user.displayName||email.split('@')[0],email,targetExam:'',accountType:'aspirant',createdAt:Date.now(),lastLogin:Date.now(),enrollments:{}});
      }
    } catch (dbError) {
      console.warn('Login succeeded, but profile bookkeeping could not be saved:', dbError);
    }
    try {
      await trackActivity(cred.user,'login');
    } catch (activityError) {
      console.warn('Login succeeded, but activity could not be recorded:', activityError);
    }
    location.href=nextUrl();
  }catch(error){setMsg(friendlyFirebaseError(error));button.disabled=false;button.textContent='Sign In';}
});

const reset=document.getElementById('reset-password');
reset?.addEventListener('click',async e=>{e.preventDefault();const email=document.getElementById('email').value.trim().toLowerCase();if(!email)return setMsg('Enter your email address first.');try{await sendPasswordResetEmail(email);setMsg('Password reset email sent. Check your inbox.','success');}catch(error){setMsg(friendlyFirebaseError(error));}});
