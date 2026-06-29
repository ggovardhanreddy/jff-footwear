const params = new URLSearchParams(window.location.search);
const returnUrl = params.get("return") || "index.html";

if (JFFAuth.getSession()) {
  window.location.href = returnUrl;
}

const err = document.getElementById("login-error");
const demoHint = document.getElementById("demo-otp-hint");
const recaptchaWrap = document.getElementById("recaptcha-wrap");

if (JFFOtp.usesDemoOtp()) {
  demoHint.textContent = "Demo mode: OTP is 123456 until you add Firebase keys in js/config.js.";
  demoHint.hidden = false;
  recaptchaWrap.hidden = true;
}

document.querySelectorAll(".auth-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".auth-tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".auth-panel").forEach((p) => p.hidden = true);
    tab.classList.add("active");
    document.getElementById(tab.dataset.panel).hidden = false;
    err.hidden = true;
  });
});

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  err.hidden = true;
  const fd = new FormData(e.target);
  try {
    await JFFAuth.login({
      email: fd.get("email"),
      password: fd.get("password"),
    });
    window.dispatchEvent(new Event("jff-auth-updated"));
    window.location.href = returnUrl;
  } catch (error) {
    err.textContent = error.message;
    err.hidden = false;
  }
});

let otpPhone = "";
let otpSent = false;

const otpPhoneInput = document.getElementById("otp-phone");
const otpCodeInput = document.getElementById("otp-code");
const otpNameInput = document.getElementById("otp-name");
const sendBtn = document.getElementById("send-otp-btn");
const verifyBtn = document.getElementById("verify-otp-btn");
const otpStep2 = document.getElementById("otp-step-2");

sendBtn.addEventListener("click", async () => {
  err.hidden = true;
  otpPhone = otpPhoneInput.value.replace(/\D/g, "").slice(-10);
  otpPhoneInput.value = otpPhone;
  if (!/^\d{10}$/.test(otpPhone)) {
    err.textContent = "Enter a valid 10-digit mobile number.";
    err.hidden = false;
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = "Sending…";
  try {
    const result = await JFFOtp.sendOtp(otpPhone, "recaptcha-container");
    otpSent = true;
    otpStep2.hidden = false;
    verifyBtn.hidden = false;
    if (result.mode === "demo" && result.demoCode) {
      demoHint.textContent = `Demo mode: use OTP ${result.demoCode} (configure Firebase in js/config.js for real SMS).`;
      demoHint.hidden = false;
    }
    sendBtn.textContent = "Resend OTP";
  } catch (error) {
    err.textContent = error.message;
    err.hidden = false;
    sendBtn.textContent = "Send OTP";
  } finally {
    sendBtn.disabled = false;
  }
});

document.getElementById("otp-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!otpSent) return;
  err.hidden = true;
  verifyBtn.disabled = true;
  try {
    const verified = await JFFOtp.verifyOtp(otpPhone, otpCodeInput.value.trim());
    await JFFAuth.loginWithPhone({
      phone: verified,
      name: otpNameInput.value.trim() || undefined,
    });
    window.dispatchEvent(new Event("jff-auth-updated"));
    window.location.href = returnUrl;
  } catch (error) {
    err.textContent = error.message;
    err.hidden = false;
  } finally {
    verifyBtn.disabled = false;
  }
});
