import { firebaseConfig } from "./firebase-config.js";
let promise;
async function load(){
  if(promise) return promise;
  promise=Promise.all([
    import("https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js")
  ]).then(([appMod,authMod,dbMod])=>{
    const app=appMod.initializeApp(firebaseConfig);
    return {auth:authMod.getAuth(app),db:dbMod.getDatabase(app),authMod,dbMod};
  });
  return promise;
}
export async function getAuthInstance(){return (await load()).auth;}
export async function getDbInstance(){return (await load()).db;}
export async function onAuthStateChanged(callback){const {auth,authMod}=await load();return authMod.onAuthStateChanged(auth,callback);}
export async function createUserWithEmailAndPassword(email,password){const {auth,authMod}=await load();return authMod.createUserWithEmailAndPassword(auth,email,password);}
export async function signInWithEmailAndPassword(email,password){const {auth,authMod}=await load();return authMod.signInWithEmailAndPassword(auth,email,password);}
export async function signOut(){const {auth,authMod}=await load();return authMod.signOut(auth);}
export async function updateProfile(user,data){const {authMod}=await load();return authMod.updateProfile(user,data);}
export async function dbGet(path){const {db,dbMod}=await load();return dbMod.get(dbMod.ref(db,path));}
export async function dbSet(path,value){const {db,dbMod}=await load();return dbMod.set(dbMod.ref(db,path),value);}
export async function dbUpdate(path,value){const {db,dbMod}=await load();return dbMod.update(dbMod.ref(db,path),value);}
export async function dbPush(path){const {db,dbMod}=await load();return dbMod.push(dbMod.ref(db,path));}
export function friendlyFirebaseError(error){
  const code=error?.code||"";
  const messages={
    "auth/email-already-in-use":"This email is already registered. Please login instead.",
    "auth/invalid-email":"Please enter a valid email address.",
    "auth/weak-password":"Password should be at least 6 characters.",
    "auth/invalid-credential":"Email or password is incorrect.",
    "auth/too-many-requests":"Too many attempts. Please wait a little and try again.",
    "auth/network-request-failed":"Network error. Check your internet connection and try again.",
    "PERMISSION_DENIED":"Firebase permission denied. Check the Asha-Sorkari-Sakori database rules."
  };
  return messages[code]||error?.message||"Something went wrong. Please try again.";
}
