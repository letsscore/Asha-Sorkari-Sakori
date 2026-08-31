import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { ref, set, get } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { auth, db } from "./firebase.js";

export async function registerUser({ name, email, password, targetExam }) {
  name = String(name || "").trim();
  email = String(email || "").trim().toLowerCase();
  password = String(password || "");

  if (!name) throw new Error("Please enter your name.");
  if (!email) throw new Error("Please enter your email.");
  if (password.length < 6) throw new Error("Password must contain at least 6 characters.");
  if (!targetExam) throw new Error("Please select your target examination.");

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  await updateProfile(user, { displayName: name });

  await set(ref(db, `users/${user.uid}`), {
    uid: user.uid,
    name,
    email,
    targetExam,
    role: "student",
    createdAt: Date.now(),
    updatedAt: Date.now()
  });

  return user;
}

export async function loginUser(email, password) {
  email = String(email || "").trim().toLowerCase();
  if (!email || !password) throw new Error("Enter email and password.");
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logoutUser() { await signOut(auth); }

export async function getUserProfile(uid) {
  const snapshot = await get(ref(db, `users/${uid}`));
  return snapshot.exists() ? snapshot.val() : null;
}

export function watchAuth(callback) { return onAuthStateChanged(auth, callback); }

export async function redirectAfterLogin(user) {
  if (!user) { window.location.href = "login.html"; return; }
  const profile = await getUserProfile(user.uid);
  if (profile?.role === "admin") window.location.href = "admin/index.html";
  else window.location.href = "index.html";
}