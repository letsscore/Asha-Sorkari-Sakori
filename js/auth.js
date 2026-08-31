import { onAuthStateChanged, signOut } from "./firebase.js";
export { onAuthStateChanged };
export async function logout() {
  await signOut();
  location.href = "index.html";
}
