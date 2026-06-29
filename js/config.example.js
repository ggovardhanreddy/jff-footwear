/**
 * Copy this file to config.js and fill in your keys.
 *
 * Razorpay: https://dashboard.razorpay.com/app/keys
 * Firebase: https://console.firebase.google.com → Project settings → Web app
 */
window.JFFConfig = {
  // Razorpay Key ID (starts with rzp_test_ or rzp_live_) — safe to use in browser
  razorpayKeyId: "",

  // Firebase — enables real SMS OTP login
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    appId: "",
  },

  // Set true to test OTP with code 123456 when Firebase is not configured
  demoOtp: true,

  store: {
    name: "JFF Footwear",
    phone: "918106407372",
    email: "govardhan.reddy.g.94@gmail.com",
  },
};
