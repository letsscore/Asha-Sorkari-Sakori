import {
  firebaseEnabled,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  dbSet
} from "./firebase.js";
import { header, footer } from "./ui.js";

header();
footer();

const msg = document.getElementById("form-msg");

if (!firebaseEnabled && msg) {
  msg.textContent = "Student accounts will be enabled after the dedicated Asha-Sorkari-Sakori Firebase project is connected.";
}

document.getElementById("login-form")?.addEventListener("submit", async e => {
  e.preventDefault();
  if (!firebaseEnabled) { msg.textContent = "Firebase setup is required before login can be used."; return; }
  msg.textContent = "Signing in…";
  try {
    await signInWithEmailAndPassword(email.value.trim(), password.value);
    location.href = "dashboard.html";
  } catch (x) {
    msg.textContent = x.message;
  }
});

document.getElementById("register-form")?.addEventListener("submit", async e => {
  e.preventDefault();
  if (!firebaseEnabled) { msg.textContent = "Firebase setup is required before registration can be used."; return; }
  msg.textContent = "Creating account…";
  try {
    const c = await createUserWithEmailAndPassword(email.value.trim(), password.value);
    await updateProfile(c.user, { displayName: name.value.trim() });
    await dbSet("users/" + c.user.uid, {
      uid: c.user.uid,
      name: name.value.trim(),
      email: c.user.email,
      createdAt: Date.now()
    });
    location.href = "dashboard.html";
  } catch (x) {
    msg.textContent = x.message;
  }
});
