import {createUserWithEmailAndPassword,signInWithEmailAndPassword,updateProfile,dbSet,friendlyFirebaseError} from "./firebase.js";
import {header,footer} from "./ui.js";
header();footer();
const msg=document.getElementById("form-msg");
const setMsg=(text,type="error")=>{if(msg){msg.textContent=text;msg.className=`message ${type}`;}};
const register=document.getElementById("register-form");
register?.addEventListener("submit",async e=>{
 e.preventDefault();
 const name=document.getElementById("name").value.trim();
 const email=document.getElementById("email").value.trim().toLowerCase();
 const password=document.getElementById("password").value;
 const targetExam=document.getElementById("target-exam")?.value||"";
 const button=register.querySelector("button[type=submit]");
 if(name.length<2)return setMsg("Please enter your full name.");
 if(password.length<6)return setMsg("Password should be at least 6 characters.");
 button.disabled=true;button.textContent="Creating account…";setMsg("Creating your free account…","info");
 try{
   const credential=await createUserWithEmailAndPassword(email,password);
   await updateProfile(credential.user,{displayName:name});
   await dbSet(`users/${credential.user.uid}`,{uid:credential.user.uid,name,email,targetExam,accountType:"student",createdAt:Date.now(),lastLogin:Date.now()});
   location.href="dashboard.html";
 }catch(error){setMsg(friendlyFirebaseError(error));button.disabled=false;button.textContent="Create Free Account";}
});
const login=document.getElementById("login-form");
login?.addEventListener("submit",async e=>{
 e.preventDefault();
 const email=document.getElementById("email").value.trim().toLowerCase();
 const password=document.getElementById("password").value;
 const button=login.querySelector("button[type=submit]");button.disabled=true;button.textContent="Signing in…";setMsg("Signing you in…","info");
 try{
   const credential=await signInWithEmailAndPassword(email,password);
   await dbSet(`users/${credential.user.uid}/lastLogin`,Date.now());
   const next=new URLSearchParams(location.search).get("next");location.href=next||"dashboard.html";
 }catch(error){setMsg(friendlyFirebaseError(error));button.disabled=false;button.textContent="Login";}
});
