import { firebaseConfig } from "./firebase-config.js";

const PLACEHOLDER = Object.values(firebaseConfig).some(v => String(v).includes("REPLACE_WITH_ASHA_SORKARI_SAKORI"));
export const firebaseEnabled = !PLACEHOLDER;

let auth = null;
let db = null;
let firebasePromise = null;

async function loadFirebase() {
  if (!firebaseEnabled) return { auth: null, db: null };
  if (firebasePromise) return firebasePromise;

  firebasePromise = (async () => {
    const [{ initializeApp }, authMod, dbMod] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js")
    ]);
    const app = initializeApp(firebaseConfig);
    auth = authMod.getAuth(app);
    db = dbMod.getDatabase(app);
    return { auth, db, authMod, dbMod };
  })().catch(error => {
    firebasePromise = null;
    console.error("Asha Sorkari Sakori Firebase initialization failed:", error);
    throw error;
  });

  return firebasePromise;
}

export async function getFirebase() {
  return loadFirebase();
}

export async function getAuthInstance() {
  const f = await loadFirebase();
  return f.auth;
}

export async function getDbInstance() {
  const f = await loadFirebase();
  return f.db;
}

export async function onAuthStateChanged(callback) {
  if (!firebaseEnabled) {
    callback(null);
    return () => {};
  }
  try {
    const { auth, authMod } = await loadFirebase();
    return authMod.onAuthStateChanged(auth, callback);
  } catch (error) {
    callback(null, error);
    return () => {};
  }
}

export async function createUserWithEmailAndPassword(email, password) {
  if (!firebaseEnabled) throw new Error("Firebase is not configured for Asha Sorkari Sakori yet.");
  const { auth, authMod } = await loadFirebase();
  return authMod.createUserWithEmailAndPassword(auth, email, password);
}

export async function signInWithEmailAndPassword(email, password) {
  if (!firebaseEnabled) throw new Error("Firebase is not configured for Asha Sorkari Sakori yet.");
  const { auth, authMod } = await loadFirebase();
  return authMod.signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  if (!firebaseEnabled) return;
  const { auth, authMod } = await loadFirebase();
  return authMod.signOut(auth);
}

export async function updateProfile(user, data) {
  if (!firebaseEnabled) throw new Error("Firebase is not configured for Asha Sorkari Sakori yet.");
  const { authMod } = await loadFirebase();
  return authMod.updateProfile(user, data);
}

export async function dbGet(path) {
  if (!firebaseEnabled) throw new Error("Firebase is not configured for Asha Sorkari Sakori yet.");
  const { db, dbMod } = await loadFirebase();
  return dbMod.get(dbMod.ref(db, path));
}

export async function dbSet(path, value) {
  if (!firebaseEnabled) throw new Error("Firebase is not configured for Asha Sorkari Sakori yet.");
  const { db, dbMod } = await loadFirebase();
  return dbMod.set(dbMod.ref(db, path), value);
}

export async function dbPush(path) {
  if (!firebaseEnabled) throw new Error("Firebase is not configured for Asha Sorkari Sakori yet.");
  const { db, dbMod } = await loadFirebase();
  return dbMod.push(dbMod.ref(db, path));
}
