const USERS_KEY = "jff_users";
const SESSION_KEY = "jff_session";
const ORDERS_KEY = "jff_orders";

const hashPassword = async (password) => {
  const data = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
};

const setSession = (user) => {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ id: user.id, name: user.name, email: user.email, phone: user.phone })
  );
};

const clearSession = () => localStorage.removeItem(SESSION_KEY);

const signup = async ({ name, email, phone, password }) => {
  const users = readUsers();
  const emailKey = email.trim().toLowerCase();
  const phoneKey = phone.trim();

  if (users.some((u) => u.email === emailKey)) {
    throw new Error("An account with this email already exists.");
  }
  if (users.some((u) => u.phone === phoneKey)) {
    throw new Error("An account with this phone number already exists.");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const user = {
    id: `user_${Date.now()}`,
    name: name.trim(),
    email: emailKey,
    phone: phoneKey,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  writeUsers(users);
  setSession(user);
  return user;
};

const login = async ({ email, password }) => {
  const users = readUsers();
  const emailKey = email.trim().toLowerCase();
  const user = users.find((u) => u.email === emailKey || u.phone === email.trim());

  if (!user) throw new Error("Account not found. Please sign up first.");
  const hash = await hashPassword(password);
  if (user.passwordHash !== hash) throw new Error("Incorrect password.");

  setSession(user);
  return user;
};

const normalizePhone = (phone) => {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.startsWith("91") && digits.length === 12) return digits.slice(2);
  return digits;
};

const loginWithPhone = async ({ phone, name }) => {
  const users = readUsers();
  const phoneKey = normalizePhone(phone);
  let user = users.find((u) => normalizePhone(u.phone) === phoneKey);

  if (!user) {
    user = {
      id: `user_${Date.now()}`,
      name: (name || "Customer").trim(),
      email: `${phoneKey}@jff.phone`,
      phone: phoneKey,
      passwordHash: "",
      authMethod: "otp",
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    writeUsers(users);
  }

  setSession(user);
  return user;
};

const logout = () => clearSession();

const getCurrentUser = () => {
  const session = getSession();
  if (!session) return null;
  return readUsers().find((u) => u.id === session.id) || null;
};

const requireAuth = (redirectTo = "login.html") => {
  if (!getSession()) {
    const returnUrl = encodeURIComponent(window.location.pathname.split("/").pop() + window.location.search);
    window.location.href = `${redirectTo}?return=${returnUrl}`;
    return false;
  }
  return true;
};

const getOrders = (userId) => {
  try {
    const all = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    return all.filter((o) => o.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
};

const saveOrder = (order) => {
  const all = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  all.push(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
};

window.JFFAuth = {
  signup,
  login,
  loginWithPhone,
  logout,
  getSession,
  getCurrentUser,
  requireAuth,
  getOrders,
  saveOrder,
};
