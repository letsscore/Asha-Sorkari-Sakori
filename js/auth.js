import{auth,onAuthStateChanged,signOut}from"./firebase.js";export{onAuthStateChanged};export async function logout(){await signOut(auth);location.href="index.html"}
