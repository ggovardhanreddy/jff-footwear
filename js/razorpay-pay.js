const loadRazorpayScript = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error("Could not load Razorpay. Check your internet connection."));
    document.head.appendChild(script);
  });

const pay = async ({ amountPaise, orderId, customer, onSuccess, onFailure }) => {
  const key = window.JFFConfig?.razorpayKeyId;
  if (!key) {
    throw new Error(
      "Online payment is not set up yet. Add your Razorpay Key ID in js/config.js, or choose Cash on Delivery."
    );
  }

  const Razorpay = await loadRazorpayScript();
  const store = window.JFFConfig.store || {};

  return new Promise((resolve, reject) => {
    const options = {
      key,
      amount: amountPaise,
      currency: "INR",
      name: store.name || "JFF Footwear",
      description: `Order ${orderId}`,
      order_id: undefined,
      prefill: {
        name: customer.name || "",
        email: customer.email || "",
        contact: customer.phone || "",
      },
      theme: { color: "#1a5fbf" },
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
      },
      handler(response) {
        onSuccess?.(response);
        resolve(response);
      },
      modal: {
        ondismiss() {
          const err = new Error("Payment cancelled.");
          onFailure?.(err);
          reject(err);
        },
      },
    };

    const rzp = new Razorpay(options);
    rzp.on("payment.failed", (response) => {
      const err = new Error(response.error?.description || "Payment failed.");
      onFailure?.(err);
      reject(err);
    });
    rzp.open();
  });
};

window.JFFRazorpay = { pay };
