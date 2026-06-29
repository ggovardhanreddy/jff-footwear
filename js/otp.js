let firebaseApp = null;
let firebaseAuth = null;
let confirmationResult = null;
let recaptchaVerifier = null;

const isFirebaseConfigured = () => {
  const f = window.JFFConfig?.firebase;
  return Boolean(f?.apiKey && f?.authDomain && f?.projectId);
};

const loadFirebase = () =>
  new Promise((resolve, reject) => {
    if (window.firebase?.apps?.length) {
      resolve(window.firebase);
      return;
    }

    const scripts = [
      "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
      "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js",
    ];

    let loaded = 0;
    scripts.forEach((src) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => {
        loaded += 1;
        if (loaded === scripts.length) resolve(window.firebase);
      };
      s.onerror = () => reject(new Error("Failed to load Firebase."));
      document.head.appendChild(s);
    });
  });

const initFirebase = async () => {
  if (!isFirebaseConfigured()) return null;
  if (firebaseApp) return { app: firebaseApp, auth: firebaseAuth };

  const fb = await loadFirebase();
  const cfg = window.JFFConfig.firebase;
  firebaseApp = fb.apps.length ? fb.app() : fb.initializeApp(cfg);
  firebaseAuth = fb.auth();
  return { app: firebaseApp, auth: firebaseAuth };
};

const formatPhone = (phone) => {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.startsWith("91") && digits.length === 12) return `+${digits}`;
  throw new Error("Enter a valid 10-digit Indian mobile number.");
};

const setupRecaptcha = async (containerId) => {
  const { auth } = await initFirebase();
  if (!auth) throw new Error("Firebase is not configured.");

  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch {
      /* ignore */
    }
  }

  const fb = await loadFirebase();
  recaptchaVerifier = new fb.auth.RecaptchaVerifier(auth, containerId, {
    size: "normal",
    callback: () => {},
  });
  await recaptchaVerifier.render();
  return recaptchaVerifier;
};

const sendOtpFirebase = async (phone, recaptchaContainerId) => {
  const { auth } = await initFirebase();
  const verifier = await setupRecaptcha(recaptchaContainerId);
  const phoneNumber = formatPhone(phone);
  confirmationResult = await auth.signInWithPhoneNumber(phoneNumber, verifier);
  return { mode: "firebase" };
};

const DEMO_OTP = "123456";
const DEMO_OTP_KEY = "jff_demo_otp";

const sendOtpDemo = (phone) => {
  const phoneKey = formatPhone(phone);
  const payload = {
    phone: phoneKey,
    code: DEMO_OTP,
    expires: Date.now() + 5 * 60 * 1000,
  };
  sessionStorage.setItem(DEMO_OTP_KEY, JSON.stringify(payload));
  return { mode: "demo", demoCode: DEMO_OTP };
};

const sendOtp = async (phone, recaptchaContainerId) => {
  if (isFirebaseConfigured()) {
    return sendOtpFirebase(phone, recaptchaContainerId);
  }
  if (window.JFFConfig?.demoOtp) {
    return sendOtpDemo(phone);
  }
  throw new Error(
    "SMS OTP is not configured. Add Firebase keys in js/config.js or enable demoOtp for testing."
  );
};

const verifyOtpFirebase = async (code) => {
  if (!confirmationResult) throw new Error("Please request an OTP first.");
  const cred = await confirmationResult.confirm(code);
  return cred.user.phoneNumber || "";
};

const verifyOtpDemo = (phone, code) => {
  const raw = sessionStorage.getItem(DEMO_OTP_KEY);
  if (!raw) throw new Error("OTP expired. Please request a new code.");
  const data = JSON.parse(raw);
  if (Date.now() > data.expires) {
    sessionStorage.removeItem(DEMO_OTP_KEY);
    throw new Error("OTP expired. Please request a new code.");
  }
  if (formatPhone(phone) !== data.phone) throw new Error("Phone number mismatch.");
  if (String(code).trim() !== data.code) throw new Error("Invalid OTP. Try again.");
  sessionStorage.removeItem(DEMO_OTP_KEY);
  return data.phone.replace("+91", "");
};

const verifyOtp = async (phone, code) => {
  if (isFirebaseConfigured() && confirmationResult) {
    const verified = await verifyOtpFirebase(code);
    return verified.replace("+91", "");
  }
  return verifyOtpDemo(phone, code);
};

const usesDemoOtp = () => !isFirebaseConfigured() && Boolean(window.JFFConfig?.demoOtp);

window.JFFOtp = {
  sendOtp,
  verifyOtp,
  usesDemoOtp,
  isFirebaseConfigured,
};
