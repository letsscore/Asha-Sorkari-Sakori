import { firebaseConfig } from './firebase-config.js';

// Cache the local app shell so repeat navigation feels instant on GitHub Pages.
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register(location.pathname.includes('/admin/')?'../sw.js':'./sw.js').catch(()=>{}),{once:true});
}

let firebasePromise;
async function loadFirebase(){
  if(firebasePromise) return firebasePromise;
  firebasePromise = Promise.all([
    import('https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js')
  ]).then(([appMod, authMod, dbMod])=>{
    const app = appMod.initializeApp(firebaseConfig);
    return { auth: authMod.getAuth(app), db: dbMod.getDatabase(app), authMod, dbMod };
  });
  return firebasePromise;
}

export async function getAuthInstance(){ return (await loadFirebase()).auth; }
export async function getDbInstance(){ return (await loadFirebase()).db; }
export async function onAuthStateChanged(callback){
  const {auth, authMod} = await loadFirebase();
  return authMod.onAuthStateChanged(auth, callback);
}
export async function createUserWithEmailAndPassword(email,password){
  const {auth, authMod} = await loadFirebase();
  return authMod.createUserWithEmailAndPassword(auth,email,password);
}
export async function sendPasswordResetEmail(email){
  const {auth, authMod} = await loadFirebase();
  return authMod.sendPasswordResetEmail(auth,email);
}
export async function signInWithEmailAndPassword(email,password){
  const {auth, authMod} = await loadFirebase();
  return authMod.signInWithEmailAndPassword(auth,email,password);
}
export async function signOut(){
  const {auth, authMod} = await loadFirebase();
  return authMod.signOut(auth);
}
export async function updateProfile(user,data){
  const {authMod} = await loadFirebase();
  return authMod.updateProfile(user,data);
}
export async function dbGet(path){
  const {db, dbMod} = await loadFirebase();
  return dbMod.get(dbMod.ref(db,path));
}
export async function dbSet(path,value){
  const {db, dbMod} = await loadFirebase();
  return dbMod.set(dbMod.ref(db,path),value);
}
export async function dbUpdate(path,value){
  const {db, dbMod} = await loadFirebase();
  return dbMod.update(dbMod.ref(db,path),value);
}
export async function dbPush(path){
  const {db, dbMod} = await loadFirebase();
  return dbMod.push(dbMod.ref(db,path));
}
export function friendlyFirebaseError(error){
  const code = error?.code || '';
  const messages = {
    'auth/email-already-in-use':'This email is already registered. Please sign in instead.',
    'auth/invalid-email':'Please enter a valid email address.',
    'auth/weak-password':'Password should be at least 6 characters.',
    'auth/invalid-credential':'Email or password is incorrect.',
    'auth/user-disabled':'This account has been disabled. Please contact support.',
    'auth/too-many-requests':'Too many attempts. Please wait and try again.',
    'auth/network-request-failed':'Network error. Please check your internet connection.',
    'PERMISSION_DENIED':'Access was blocked by Firebase security rules. Please contact support if this continues.'
  };
  return messages[code] || error?.message || 'Something went wrong. Please try again.';
}
