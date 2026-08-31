import { registerUser, loginUser, redirectAfterLogin } from "./auth.js";

function showMessage(element, message, type = "error") {
  if (!element) return;
  element.textContent = message;
  element.className = `message ${type}`;
  element.style.display = "block";
}

function setLoading(button, loading) {
  if (!button) return;
  button.disabled = loading;
  if (loading) {
    button.dataset.originalText = button.textContent;
    button.textContent = "Please wait...";
  } else {
    button.textContent = button.dataset.originalText || button.textContent;
  }
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async event => {
    event.preventDefault();
    const message = document.getElementById("registerMessage");
    const button = registerForm.querySelector("button[type=submit]");
    const name = document.getElementById("name")?.value;
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    const targetExam = document.getElementById("targetExam")?.value;

    try {
      setLoading(button, true);
      await registerUser({ name, email, password, targetExam });
      showMessage(message, "Account created successfully. Redirecting...", "success");
      setTimeout(() => { window.location.href = "index.html"; }, 1000);
    } catch (error) {
      console.error(error);
      let text = error.message;
      if (error.code === "auth/email-already-in-use") text = "This email is already registered.";
      if (error.code === "auth/invalid-email") text = "Please enter a valid email address.";
      if (error.code === "auth/weak-password") text = "Password is too weak.";
      showMessage(message, text, "error");
    } finally { setLoading(button, false); }
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    const message = document.getElementById("loginMessage");
    const button = loginForm.querySelector("button[type=submit]");
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

    try {
      setLoading(button, true);
      const user = await loginUser(email, password);
      showMessage(message, "Login successful. Redirecting...", "success");
      await redirectAfterLogin(user);
    } catch (error) {
      console.error(error);
      let text = error.message;
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        text = "Invalid email or password.";
      }
      showMessage(message, text, "error");
    } finally { setLoading(button, false); }
  });
}
