import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged as fbOnAuthStateChanged, createUserWithEmailAndPassword as fbCreateUser, signInWithEmailAndPassword as fbSignIn, signOut as fbSignOut, updateProfile as fbUpdateProfile } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getDatabase, ref as fbRef, get as fbGet, set as fbSet, push as fbPush } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const PLACEHOLDER = Object.values(firebaseConfig).some(v => String(v).includes("REPLACE_WITH_ASHA_SORKARI_SAKORI"));
export const firebaseEnabled = !PLACEHOLDER;

let auth = null;
let db = null;
if (firebaseEnabled) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getDatabase(app);
  } catch (error) {
    console.error("Asha Sorkari Sakori Firebase initialization failed:", error);
  }
}

export { auth, db };

export function onAuthStateChanged(instance, callback) {
  if (instance) return fbOnAuthStateChanged(instance, callback);
  callback(null);
  return () => {};
}

export function createUserWithEmailAndPassword(instance, email, password) {
  if (!instance) return Promise.reject(new Error("Firebase is not configured for Asha Sorkari Sakori yet."));
  return fbCreateUser(instance, email, password);
}
export function signInWithEmailAndPassword(instance, email, password) {
  if (!instance) return Promise.reject(new Error("Firebase is not configured for Asha Sorkari Sakori yet."));
  return fbSignIn(instance, email, password);
}
export function signOut(instance) {
  if (!instance) return Promise.resolve();
  return fbSignOut(instance);
}
export function updateProfile(user, data) {
  if (!user) return Promise.reject(new Error("No authenticated user."));
  return fbUpdateProfile(user, data);
}
export function ref(instance, path) {
  if (!instance) throw new Error("Firebase is not configured for Asha Sorkari Sakori yet.");
  return fbRef(instance, path);
}
export function get(reference) {
  if (!reference) return Promise.reject(new Error("Firebase is not configured for Asha Sorkari Sakori yet."));
  return fbGet(reference);
}
export function set(reference, value) {
  if (!reference) return Promise.reject(new Error("Firebase is not configured for Asha Sorkari Sakori yet."));
  return fbSet(reference, value);
}
export function push(reference) {
  if (!reference) throw new Error("Firebase is not configured for Asha Sorkari Sakori yet.");
  return fbPush(reference);
}
