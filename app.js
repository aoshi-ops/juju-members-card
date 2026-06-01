const ranks = [
  { n: 1, name: "\u8ff7\u3044\u4eba", min: 1, max: 5 },
  { n: 2, name: "\u5e38\u9023\u306e\u6c17\u914d", min: 5.5, max: 10.5 },
  { n: 3, name: "\u597d\u4e8b\u5bb6", min: 11, max: 16.5 },
  { n: 4, name: "\u546a\u7269\u611b\u597d\u5bb6", min: 17, max: 23.5 },
  { n: 5, name: "\u546a\u7269\u53ce\u96c6\u5bb6", min: 24, max: 38.5 },
  { n: 6, name: "\u546a\u7269\u5009\u5eab\u4ed8\u304d\u5b66\u82b8\u54e1", min: 39, max: 68.5 },
  { n: 7, name: "\u546a\u7269\u535a\u58eb", min: 69, max: null }
];

const demoSoundHorrors = [
  { id: "demo-1", title: "\u8179\u8a71\u8853\u4eba\u5f62\u307e\u3041\u304f\u3093" },
  { id: "demo-2", title: "\u5ca9\u5869\u4ecf" },
  { id: "demo-3", title: "\u304a\u6bcd\u3055\u3093\u5f79\u306e\u64cd\u308a\u4eba\u5f62" },
  { id: "demo-4", title: "\u907a\u68c4\u3055\u308c\u305f\u9ed2\u96fb\u8a71" },
  { id: "demo-5", title: "\u75c5\u5451\u5b88\u308a" },
  { id: "demo-6", title: "\u5751\u5185\u99ac\u306e\u8e44\u9244" }
];
const soundHorrorTitles = demoSoundHorrors.map((horror) => horror.title);
const currentSoundHorrors = (horrors = []) =>
  soundHorrorTitles
    .map((title) => horrors.find((horror) => horror.title === title) || demoSoundHorrors.find((horror) => horror.title === title))
    .filter(Boolean);
const specialExperiences = [
  { code: "sange-box", title: "\u3055\u3093\u3052\u306e\u7bb1", point: 3 }
];
const contactInfo = {
  phone: "03-5913-8428",
  email: "obakendesk@gmail.com",
  address: "\u3012168-0062 \u6771\u4eac\u90fd\u6749\u4e26\u533a\u65b9\u53572-4-27",
  hp: "https://obaken-event.wixsite.com/cafe-joujou"
};

const welcomeCoupon = {
  title: "\u4f1a\u54e1\u767b\u9332\u30ad\u30e3\u30f3\u30da\u30fc\u30f3\u30af\u30fc\u30dd\u30f3",
  description: "\u30b5\u30a6\u30f3\u30c9\u30db\u30e9\u30fc\u4e00\u56de\u7121\u6599\uff08\uffe51,000\u4f5c\u54c1\u306e\u307f\u5bfe\u8c61\uff09"
};
const relicCatalog = [
  { id: "local-byoudon-mamori", name: "\u75c5\u5451\u5b88\u308a", image: "assets/relics/byoudon-mamori.jpg" },
  { id: "local-sange-box", name: "\u3055\u3093\u3052\u306e\u7bb1", image: "assets/relics/sange-box.jpg" },
  { id: "local-ganenbutsu", name: "\u5ca9\u5869\u4ecf", image: "assets/relics/ganenbutsu.jpg" },
  { id: "local-black-phone", name: "\u907a\u68c4\u3055\u308c\u305f\u9ed2\u96fb\u8a71", image: "assets/relics/black-phone.jpg" },
  { id: "local-mother-puppet", name: "\u304a\u6bcd\u3055\u3093\u5f79\u306e\u64cd\u308a\u4eba\u5f62", image: "assets/relics/mother-puppet.jpg" },
  { id: "local-horseshoe", name: "\u5751\u5185\u99ac\u306e\u8e44\u9244", image: "assets/relics/horseshoe.jpg" },
  { id: "local-ma-kun", name: "\u8179\u8a71\u8853\u4eba\u5f62\u307e\u3041\u304f\u3093", image: "assets/relics/ma-kun.jpg" }
];
const relicImageByHorrorTitle = Object.fromEntries([
  ...relicCatalog.map((relic) => [relic.name, relic.image]),
  ["\u8179\u8a71\u8853\u4eba\u5f62\u307e\u3041\u304f\u3093", "assets/relics/ma-kun.jpg"]
]);

const demo = {
  profile: { role: "user" },
  user: {
    id: "demo-user",
    auth_user_id: "demo-auth",
    member_number: "JUJU-000001",
    real_name: "\u5c71\u7530 \u592a\u90ce",
    username: "juju_guest",
    email: "demo@example.com",
    birthday: "1996-08-13",
    birthday_visible: true,
    age: 29,
    gender: "\u56de\u7b54\u3057\u306a\u3044",
    favorite_relic_id: null
  },
  visits: [
    { visit_type: "second_floor", point_value: 1.5, visited_at: new Date().toISOString() }
  ],
  listens: [
    { sound_horror_id: "demo-1", point_value: 2 },
    { sound_horror_id: "demo-1", point_value: 2 },
    { sound_horror_id: "demo-2", point_value: 2 }
  ],
  pointEvents: [
    { point_type: "visit_2f", point_value: 1.5, rank_affects: true, created_at: new Date().toISOString() },
    { point_type: "sound_horror", point_value: 2, rank_affects: true, created_at: new Date().toISOString() },
    { point_type: "sound_horror", point_value: 2, rank_affects: true, created_at: new Date().toISOString() },
    { point_type: "sound_horror", point_value: 2, rank_affects: true, created_at: new Date().toISOString() }
  ],
  coupons: [
    {
      id: "demo-user-coupon-1",
      status: "available",
      issued_at: new Date().toISOString(),
      coupons: { id: "demo-coupon-1", title: welcomeCoupon.title, description: welcomeCoupon.description, expires_at: null }
    }
  ],
  relics: relicCatalog,
  users: []
};

let supabase = null;
let createClient = null;
let session = null;
let state = { busy: false, message: "", error: "" };
let qrStream = null;
let qrFrame = 0;
let qrScanning = false;
let iconDrag = null;
let jsQrDecoder = null;
let qrDetecting = false;
let qrSessionConsumed = false;
let lastQrValue = "";
let lastQrAt = 0;

const app = document.querySelector("#app");
const scriptUrl = new URL(import.meta.url);
const BASE_PATH = scriptUrl.pathname.replace(/\/app\.js$/, "").replace(/\/$/, "");
const ADMIN_DEMO_ID = "joujoustaff";
const ADMIN_DEMO_PASSWORD = "joujoufirstanniversary";
const ADMIN_DEMO_STORAGE = "JUJU_ADMIN_DEMO_AUTH";
const ADMIN_APP_STORAGE = "JUJU_ADMIN_APP";
const PENDING_REGISTRATION_STORAGE = "JUJU_PENDING_REGISTRATION";
const DEFAULT_SUPABASE_URL = "https://qaiedhueykxoodagbkda.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_f4X3hypSAb24Dt__vhElKA_yT6vDa2x";
const iconStorageKey = (userId) => `JUJU_ICON_${userId}`;
const relicStorageKey = (userId) => `JUJU_FAVORITE_RELIC_${userId}`;
const couponEnsuredKey = (userId) => `JUJU_COUPON_READY_${userId}`;
const newsReadStorageKey = (userId) => `JUJU_NEWS_READ_${userId}`;
const usernameFontStorageKey = (userId) => `JUJU_USERNAME_FONT_${userId}`;
const usernameFontSeenStorageKey = (userId) => `JUJU_USERNAME_FONT_SEEN_${userId}`;
const QR_CAMERA_ALLOWED_STORAGE = "JUJU_QR_CAMERA_ALLOWED";
const NEWS_LOCAL_STORAGE = "JUJU_LOCAL_NEWS_POSTS";
const CALENDAR_IMAGE_STORAGE = "JUJU_CALENDAR_IMAGE";
const CALENDAR_SETTING_KEY = "calendar_image";
const usernameFontOptions = [
  { id: "hina", label: "\u3072\u306a\u660e\u671d", note: "\u6a19\u6e96", className: "username-font-hina", cssStack: "\"JujuHinaMincho\", \"Yu Mincho\", serif", minRank: 1 },
  { id: "zero", label: "\u96f6\u30b4\u30b7\u30c3\u30af", note: "\u30e9\u30f3\u30af2\u3067\u89e3\u653e", className: "username-font-zero", cssStack: "\"JujuZeroGothic\", \"JujuHinaMincho\", serif", minRank: 2 },
  { id: "taisho", label: "\u5927\u6b63\u6d3b\u5b57", note: "\u30e9\u30f3\u30af3\u3067\u89e3\u653e", className: "username-font-taisho", cssStack: "\"JujuTaisho\", \"JujuHinaMincho\", serif", minRank: 3 },
  { id: "cheese", label: "\u30c1\u30fc\u30ba\u30b4\u30b7\u30c3\u30af", note: "\u30e9\u30f3\u30af3\u3067\u89e3\u653e", className: "username-font-cheese", cssStack: "\"JujuCheeseGothic\", \"JujuHinaMincho\", serif", minRank: 3 },
  { id: "glitch", label: "\u30b0\u30ea\u30c3\u30c1\u660e\u671d", note: "\u30e9\u30f3\u30af5\u3067\u89e3\u653e", className: "username-font-glitch", cssStack: "\"JujuGlitchMincho\", \"JujuHinaMincho\", serif", minRank: 5 },
  { id: "enka-dot", label: "\u3048\u3093\u304b\u30c9\u30c3\u30c8\u660e\u671d", note: "\u30e9\u30f3\u30af6\u3067\u89e3\u653e", className: "username-font-enka-dot", cssStack: "\"JujuEnkaDotMincho\", \"JujuHinaMincho\", serif", minRank: 6 }
];
const cfg = () => ({
  url: localStorage.getItem("SUPABASE_URL") || DEFAULT_SUPABASE_URL,
  anon: localStorage.getItem("SUPABASE_ANON_KEY") || DEFAULT_SUPABASE_ANON_KEY
});
const isConfigured = () => Boolean(cfg().url && cfg().anon);
const schemaSetupMessage =
  "Supabaseのデータベース初期設定が未完了です。AuthenticationのUsersとは別に、SQL Editorで public.users などのアプリ用テーブルを作成してください。";
const yenDate = (value) => (value ? new Date(value).toLocaleDateString("ja-JP") : "-");
const monthDayDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" });
};
function calculateAgeFromBirthday(value) {
  const birthday = new Date(value);
  if (Number.isNaN(birthday.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) age -= 1;
  return Math.max(0, Math.min(120, age));
}
const html = (strings, ...values) => strings.map((s, i) => s + (values[i] ?? "")).join("");

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formFromEvent(event) {
  return event?.target?.matches?.("form")
    ? event.target
    : event?.target?.closest?.("form");
}

const appPath = () => {
  const path = location.pathname;
  const normalize = (value) => (value.length > 1 ? value.replace(/\/$/, "") : value);
  if (BASE_PATH && path.startsWith(`${BASE_PATH}/`)) return normalize(path.slice(BASE_PATH.length) || "/");
  if (BASE_PATH && path === BASE_PATH) return "/";
  return normalize(path);
};
const publicUrl = (path) => `${BASE_PATH}${path}`;
const absoluteUrl = (path) => new URL(publicUrl(path), location.origin).href;
const navigate = (path) => {
  stopQrScanner();
  state = { ...state, message: "", error: "" };
  history.pushState({}, "", publicUrl(path));
  render();
};
const replacePath = (path) => history.replaceState({}, "", publicUrl(path));

function isDemoAdmin() {
  return localStorage.getItem(ADMIN_DEMO_STORAGE) === "true";
}

function isAdminLaunchQuery() {
  return new URLSearchParams(location.search).get("app") === "admin";
}

function isStandaloneApp() {
  return window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function rememberAdminApp() {
  if (appPath().startsWith("/admin") || isAdminLaunchQuery()) localStorage.setItem(ADMIN_APP_STORAGE, "true");
}

function isAdminAppLaunch() {
  return isAdminLaunchQuery();
}

function demoAdminData() {
  const users = [
    { ...demo.user, id: "demo-user", real_name: "山田 太郎", username: "juju_guest", gender: "回答しない", rank_points: sumRankPoints(demo.pointEvents), total_visit_count: 1, sound_horror_listen_count: 3, last_visited_at: demo.visits[0]?.visited_at },
    { ...demo.user, id: "demo-user-2", member_number: "JUJU-000002", real_name: "佐藤 花子", username: "relic_hana", age: 34, gender: "女性", rank_points: 7.5, total_visit_count: 3, sound_horror_listen_count: 2, last_visited_at: new Date(Date.now() - 86400000).toISOString() }
  ];
  return {
    users,
    visits: [
      ...demo.visits,
      { id: "demo-visit-2", user_id: "demo-user-2", visit_type: "first_floor", point_value: 1, visited_at: new Date(Date.now() - 86400000).toISOString() }
    ],
    listens: demo.listens,
    pointEvents: [
      ...demo.pointEvents,
      { id: "demo-special-1", user_id: "demo-user-2", point_type: "special", point_value: 3, rank_affects: true, source_type: "manual", memo: "おまじない体験コース", created_at: new Date().toISOString() }
    ],
    coupons: [],
    userLogs: [],
    newsPosts: localNewsPosts()
  };
}

function registrationPayloadFromForm(form, authUserId = null) {
  const birthday = String(form.get("birthday") || "");
  return {
    auth_user_id: authUserId,
    email: String(form.get("email") || "").trim(),
    real_name: String(form.get("real_name") || "").trim(),
    username: String(form.get("username") || "").trim(),
    birthday,
    age: calculateAgeFromBirthday(birthday),
    gender: String(form.get("gender") || "回答しない"),
    birthday_visible: form.get("birthday_visible") === "on"
  };
}

function profilePayloadFromForm(form, authUser) {
  const birthday = String(form.get("birthday") || "");
  return {
    auth_user_id: authUser.id,
    email: authUser.email,
    real_name: String(form.get("real_name") || "").trim(),
    username: String(form.get("username") || "").trim(),
    birthday,
    age: calculateAgeFromBirthday(birthday),
    gender: String(form.get("gender") || "回答しない"),
    birthday_visible: form.get("birthday_visible") === "on"
  };
}

function savePendingRegistration(payload) {
  localStorage.setItem(PENDING_REGISTRATION_STORAGE, JSON.stringify(payload));
}

function readPendingRegistration() {
  try {
    return JSON.parse(localStorage.getItem(PENDING_REGISTRATION_STORAGE) || "null");
  } catch {
    return null;
  }
}

function profileFromAuthMetadata(authUser) {
  const meta = authUser?.user_metadata || {};
  if (!meta.real_name || !meta.username || !meta.birthday || !meta.gender) return null;
  return {
    auth_user_id: authUser.id,
    email: authUser.email,
    real_name: meta.real_name,
    username: meta.username,
    birthday: meta.birthday,
    age: Number(meta.age ?? calculateAgeFromBirthday(meta.birthday)),
    gender: meta.gender,
    birthday_visible: meta.birthday_visible !== false
  };
}

function clearPendingRegistration() {
  localStorage.removeItem(PENDING_REGISTRATION_STORAGE);
}

function appErrorMessage(error) {
  const message = String(error?.message || error || "");
  if (
    message.includes("create_staff_news_post") ||
    message.includes("Could not find the function") ||
    (message.includes("function") && message.includes("does not exist"))
  ) {
    return "NEWS投稿用のSupabase関数がまだ反映されていません。最新の supabase/schema.sql をSQL Editorで再実行してください。";
  }
  if (
    message.includes("public.users") ||
    message.includes("schema cache") ||
    message.includes("Could not find the table")
  ) {
    return schemaSetupMessage;
  }
  return message;
}

function isMissingDbObject(error) {
  const message = String(error?.message || "");
  return (
    message.includes("Could not find") ||
    message.includes("schema cache") ||
    message.includes("does not exist") ||
    message.includes("function")
  );
}

function userIcon(user) {
  return user.icon_url || localStorage.getItem(iconStorageKey(user.id)) || "";
}

function relicOptions(relics = []) {
  return relicCatalog.map((catalogRelic) => {
    const dbRelic = relics.find((relic) => relic.name === catalogRelic.name);
    return dbRelic ? { ...dbRelic, image: catalogRelic.image } : catalogRelic;
  });
}

function currentFavoriteRelic(user, relics = []) {
  const options = relicOptions(relics);
  const storedName = localStorage.getItem(relicStorageKey(user.id));
  return (
    options.find((relic) => relic.id === user.favorite_relic_id) ||
    options.find((relic) => relic.name === storedName) ||
    null
  );
}

async function optionalQuery(query, fallback = []) {
  const result = await query;
  if (result.error) {
    if (isMissingDbObject(result.error)) return { data: fallback, error: null };
    throw result.error;
  }
  return result;
}

function storedReadNewsIds(userId) {
  try {
    return new Set(JSON.parse(localStorage.getItem(newsReadStorageKey(userId)) || "[]"));
  } catch {
    return new Set();
  }
}

function localNewsPosts() {
  try {
    return JSON.parse(localStorage.getItem(NEWS_LOCAL_STORAGE) || "[]");
  } catch {
    return [];
  }
}

function saveLocalNewsPost(post) {
  const posts = [post, ...localNewsPosts()].slice(0, 100);
  localStorage.setItem(NEWS_LOCAL_STORAGE, JSON.stringify(posts));
}

function availableUsernameFonts(rank) {
  return usernameFontOptions.filter((font) => rank.n >= font.minRank);
}

function currentUsernameFont(user, rank) {
  const stored = localStorage.getItem(usernameFontStorageKey(user.id)) || "hina";
  return availableUsernameFonts(rank).some((font) => font.id === stored) ? stored : "hina";
}

function usernameFontClass(fontId) {
  return usernameFontOptions.find((font) => font.id === fontId)?.className || "username-font-hina";
}

function usernameFontCssStack(fontId) {
  return usernameFontOptions.find((font) => font.id === fontId)?.cssStack || usernameFontOptions[0].cssStack;
}

async function ensureUsernameFontLoaded(fontId, sampleText = "\u30e6\u30fc\u30b6\u30fc\u30cd\u30fc\u30e0") {
  if (!document.fonts?.load) return;
  const stack = usernameFontCssStack(fontId).split(",")[0].trim();
  try {
    await document.fonts.load(`42px ${stack}`, sampleText);
  } catch {
    // Font loading failure should not block the user's choice.
  }
}

function hasNewUsernameFonts(user, rank) {
  const available = availableUsernameFonts(rank).map((font) => font.id).sort().join(",");
  const seen = localStorage.getItem(usernameFontSeenStorageKey(user.id));
  return Boolean(seen && seen !== available);
}

function markUsernameFontsSeen(user, rank) {
  const available = availableUsernameFonts(rank).map((font) => font.id).sort().join(",");
  localStorage.setItem(usernameFontSeenStorageKey(user.id), available);
}

function setInitialUsernameFontSeen(user, rank) {
  if (!localStorage.getItem(usernameFontSeenStorageKey(user.id))) {
    markUsernameFontsSeen(user, rank);
  }
}

function calendarImageFallback() {
  return localStorage.getItem(CALENDAR_IMAGE_STORAGE) || "assets/calendar-icon.jpg";
}

async function loadCalendarImage() {
  if (supabase) {
    const result = await optionalQuery(
      supabase.from("app_settings").select("value").eq("key", CALENDAR_SETTING_KEY).maybeSingle(),
      null
    );
    const value = result.data?.value;
    if (value) {
      localStorage.setItem(CALENDAR_IMAGE_STORAGE, value);
      return value;
    }
  }
  return localStorage.getItem(CALENDAR_IMAGE_STORAGE) || "";
}

async function saveCalendarImageSetting(value) {
  localStorage.setItem(CALENDAR_IMAGE_STORAGE, value);
  if (!supabase) return;
  const result = await supabase.from("app_settings").upsert({
    key: CALENDAR_SETTING_KEY,
    value,
    updated_at: new Date().toISOString()
  });
  if (result.error) throw result.error;
}

function mergeNewsPosts(remotePosts = []) {
  const map = new Map();
  [...localNewsPosts(), ...remotePosts].forEach((post) => {
    if (!post?.id) return;
    const key = post.external_url
      ? `url:${post.external_url}`
      : `article:${post.title || ""}:${post.body || ""}:${post.image_url || ""}`;
    map.set(key || post.id, post);
  });
  return [...map.values()].sort((a, b) => new Date(b.published_at || b.created_at || 0) - new Date(a.published_at || a.created_at || 0));
}

function purchasePermissionFor(user, rank, permissions = []) {
  const manual = permissions.find((permission) => permission.user_id === user.id && permission.is_active !== false);
  return {
    allowed: rank.n >= 5 || Boolean(manual),
    manual: Boolean(manual),
    reason: rank.n >= 5 ? "rank" : manual ? "manual" : "none"
  };
}

async function ensureUserProfile(authUser) {
  if (!supabase || !authUser) return null;
  const existing = await supabase
    .from("users")
    .select("*")
    .eq("auth_user_id", authUser.id)
    .maybeSingle();
  if (existing.error) throw existing.error;
  if (existing.data) {
    clearPendingRegistration();
    await ensureRegistrationCoupon(existing.data.id);
    return existing.data;
  }

  const pending = readPendingRegistration();
  const payloadSource = pending?.email === authUser.email ? pending : profileFromAuthMetadata(authUser);
  if (!payloadSource) {
    const error = new Error("会員プロフィールがまだ作成されていません。会員証に表示するプロフィールを登録してください。");
    error.code = "PROFILE_REQUIRED";
    throw error;
  }

  const payload = { ...payloadSource, auth_user_id: authUser.id, email: authUser.email };
  return saveUserProfile(payload);
}

async function saveUserProfile(payload) {
  const { data, error } = await supabase
    .from("users")
    .upsert(payload, { onConflict: "auth_user_id" })
    .select("*")
    .single();
  if (error) throw error;
  clearPendingRegistration();
  await ensureRegistrationCoupon(data.id);
  return data;
}

async function ensureRegistrationCoupon(userId) {
  if (!supabase) return;
  if (userId && localStorage.getItem(couponEnsuredKey(userId))) return;
  const { error } = await supabase.rpc("ensure_registration_coupon");
  if (error && !String(error.message || "").includes("function")) throw error;
  if (userId) localStorage.setItem(couponEnsuredKey(userId), "true");
}

async function cleanupUserCoupons(userId) {
  if (!supabase || !userId) return;
  const key = `JUJU_COUPON_CLEANUP_${userId}_${new Date().toISOString().slice(0, 10)}`;
  if (sessionStorage.getItem(key)) return;
  const { error } = await supabase.rpc("cleanup_my_coupons");
  if (error && !String(error.message || "").includes("function")) throw error;
  sessionStorage.setItem(key, "true");
}

async function initSupabase() {
  const { url, anon } = cfg();
  if (!url || !anon) {
    supabase = null;
    return;
  }
  if (!createClient) {
    ({ createClient } = await import("https://esm.sh/@supabase/supabase-js@2"));
  }
  supabase = createClient(url, anon);
}

function rankFor(points) {
  return ranks.find((rank) => points >= rank.min && (rank.max === null || points <= rank.max)) || ranks[0];
}

function nextRank(points) {
  return ranks.find((rank) => points < rank.min);
}

function sumRankPoints(events) {
  return Number(events.filter((e) => e.rank_affects).reduce((sum, e) => sum + Number(e.point_value), 0).toFixed(1));
}

async function currentSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  session = data.session;
  return session;
}

async function signOut() {
  if (supabase) await supabase.auth.signOut();
  localStorage.removeItem(ADMIN_DEMO_STORAGE);
  session = null;
  navigate("/login");
}

function exitDemoAdmin() {
  localStorage.removeItem(ADMIN_DEMO_STORAGE);
  state = { busy: false, message: "初期確認用の管理モードを終了しました。実データを見るには admin 権限のSupabaseログインを使ってください。", error: "" };
  navigate("/admin/login");
}

async function loadMyData() {
  if (!supabase) return demo;
  const current = await currentSession();
  if (!current) throw new Error("ログインが必要です。");

  const user = await ensureUserProfile(current.user);
  await cleanupUserCoupons(user.id);
  const { data: profile } = await supabase
    .from("app_profiles")
    .select("role")
    .eq("auth_user_id", current.user.id)
    .maybeSingle();

  const [visits, listens, points, coupons, horrors, relics, purchasePermissions, newsPosts, newsReads] = await Promise.all([
    supabase.from("visits").select("*").eq("user_id", user.id).order("visited_at", { ascending: false }),
    supabase.from("sound_horror_listens").select("*").eq("user_id", user.id).order("listened_at", { ascending: false }),
    supabase.from("point_events").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("user_coupons").select("*, coupons(*)").eq("user_id", user.id).eq("status", "available").order("issued_at", { ascending: false }),
    supabase.from("sound_horrors").select("*").eq("is_active", true).order("title"),
    supabase.from("relics").select("*").eq("is_active", true).order("name"),
    optionalQuery(supabase.from("user_purchase_permissions").select("*").eq("user_id", user.id).eq("is_active", true)),
    optionalQuery(supabase.from("news_posts").select("*").eq("is_published", true).order("published_at", { ascending: false }).limit(50)),
    optionalQuery(supabase.from("news_reads").select("news_post_id").eq("user_id", user.id))
  ]);

  for (const result of [visits, listens, points, coupons, horrors, relics, purchasePermissions, newsPosts, newsReads]) {
    if (result.error) throw result.error;
  }

  const readIds = new Set((newsReads.data || []).map((read) => read.news_post_id));
  const localReadIds = storedReadNewsIds(user.id);
  const mergedNewsPosts = mergeNewsPosts(newsPosts.data || []);
  const unreadNewsCount = mergedNewsPosts.filter((post) => !readIds.has(post.id) && !localReadIds.has(post.id)).length;

  return {
    profile: profile || { role: "user" },
    user,
    visits: visits.data || [],
    listens: listens.data || [],
    pointEvents: points.data || [],
    coupons: coupons.data || [],
    soundHorrors: currentSoundHorrors(horrors.data || []),
    relics: relics.data || [],
    purchasePermissions: purchasePermissions.data || [],
    newsPosts: mergedNewsPosts,
    newsReads: newsReads.data || [],
    unreadNewsCount
  };
}

function applyUnreadNewsCount(data) {
  state.unreadNewsCount = data?.unreadNewsCount || 0;
}

async function loadAdminData(userId = null, options = {}) {
  if (isDemoAdmin()) {
    const data = demoAdminData();
    if (options.includeNews === true && supabase) {
      const newsPosts = await optionalQuery(supabase.from("news_posts").select("*").eq("is_published", true).order("published_at", { ascending: false }).limit(100));
      data.newsPosts = mergeNewsPosts(newsPosts.data || []);
    } else if (options.includeNews === true) {
      data.newsPosts = mergeNewsPosts(data.newsPosts || []);
    }
    return userId ? { ...data, users: data.users.filter((user) => user.id === userId) } : data;
  }

  if (!supabase) {
    throw new Error("管理画面を確認するには、管理ログインを行うか Supabase に接続してください。");
  }

  if (!supabase) {
    return {
      users: [
        { ...demo.user, id: "demo-user", real_name: "山田 太郎", username: "juju_guest" },
        { ...demo.user, id: "demo-user-2", member_number: "JUJU-000002", real_name: "佐藤 花子", username: "relic_hana", age: 34, gender: "女性" }
      ],
      visits: demo.visits,
      listens: demo.listens,
      pointEvents: demo.pointEvents,
      coupons: []
    };
  }

  const current = await currentSession();
  if (!current) throw new Error("管理ログインが必要です。");
  const { data: profile, error: profileError } = await supabase
    .from("app_profiles")
    .select("role")
    .eq("auth_user_id", current.user.id)
    .single();
  if (profileError) throw profileError;
  if (profile?.role !== "admin") throw new Error("admin権限がありません。");

  const usersQuery = supabase.from("admin_user_summaries").select("*").order("created_at", { ascending: false });
  const includeNews = options.includeNews === true;
  const includeUsers = options.includeUsers !== false;
  const includeActivity = options.includeActivity !== false;
  const includeCoupons = options.includeCoupons !== false;
  const includePurchasePermissions = options.includePurchasePermissions !== false;
  const [users, visits, listens, points, coupons, purchasePermissions, newsPosts, userLogs] = await Promise.all([
    includeUsers ? (userId ? supabase.from("users").select("*").eq("id", userId).single() : usersQuery) : Promise.resolve({ data: userId ? null : [], error: null }),
    includeActivity ? (userId ? supabase.from("visits").select("*").eq("user_id", userId).order("visited_at", { ascending: false }) : supabase.from("visits").select("*").order("visited_at", { ascending: false }).limit(200)) : Promise.resolve({ data: [], error: null }),
    includeActivity ? (userId ? supabase.from("sound_horror_listens").select("*, sound_horrors(title)").eq("user_id", userId).order("listened_at", { ascending: false }) : supabase.from("sound_horror_listens").select("*").order("listened_at", { ascending: false }).limit(200)) : Promise.resolve({ data: [], error: null }),
    includeActivity ? (userId ? supabase.from("point_events").select("*").eq("user_id", userId).order("created_at", { ascending: false }) : supabase.from("point_events").select("*").order("created_at", { ascending: false }).limit(200)) : Promise.resolve({ data: [], error: null }),
    includeCoupons ? (userId ? supabase.from("user_coupons").select("*, coupons(*)").eq("user_id", userId) : supabase.from("coupons").select("*").eq("is_active", true).order("created_at", { ascending: false })) : Promise.resolve({ data: [], error: null }),
    includePurchasePermissions ? optionalQuery(userId ? supabase.from("user_purchase_permissions").select("*").eq("user_id", userId).eq("is_active", true) : supabase.from("user_purchase_permissions").select("*").eq("is_active", true)) : Promise.resolve({ data: [], error: null }),
    includeNews ? optionalQuery(supabase.from("news_posts").select("*").eq("is_published", true).order("published_at", { ascending: false }).limit(100)) : Promise.resolve({ data: [] }),
    userId ? optionalQuery(supabase.from("user_profile_logs").select("*").eq("user_id", userId).order("changed_at", { ascending: false }).limit(100)) : Promise.resolve({ data: [] })
  ]);

  for (const result of [users, visits, listens, points, coupons, purchasePermissions, newsPosts, userLogs]) {
    if (result.error) throw result.error;
  }
  return { users: userId ? (users.data ? [users.data] : []) : users.data, visits: visits.data, listens: listens.data, pointEvents: points.data, coupons: coupons.data, purchasePermissions: purchasePermissions.data || [], newsPosts: includeNews ? mergeNewsPosts(newsPosts.data || []) : [], userLogs: userLogs.data || [] };
}

async function handleLogin(event) {
  event?.preventDefault?.();
  const formElement = event?.currentTarget?.matches?.("form")
    ? event.currentTarget
    : document.querySelector('[data-form="login"]');
  if (!formElement.reportValidity()) return;
  const form = new FormData(formElement);
  state = { busy: true, message: "", error: "" };
  try {
    if (!supabase) throw new Error("通信設定を読み込めませんでした。時間をおいて再読み込みしてください。");
    const { error } = await supabase.auth.signInWithPassword({
      email: form.get("email"),
      password: form.get("password")
    });
    if (error) throw error;
    const current = await currentSession();
    if (current?.user) {
      try {
        await ensureUserProfile(current.user);
      } catch (profileError) {
        if (profileError.code === "PROFILE_REQUIRED") {
          state = { busy: false, message: "ログインしました。会員証に表示するプロフィールを登録してください。", error: "" };
          navigate("/complete-profile");
          return;
        }
        throw profileError;
      }
    }
    state = { busy: false, message: "ログインしました。会員証を表示します。", error: "" };
    navigate(appPath().startsWith("/admin") ? "/admin/dashboard" : "/member-card");
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
    render();
  }
}

async function handleAdminLogin(event) {
  event?.preventDefault?.();
  const formElement = event?.currentTarget?.matches?.("form")
    ? event.currentTarget
    : document.querySelector('[data-form="admin-login"]');
  if (!formElement.reportValidity()) return;
  const form = new FormData(formElement);
  const loginId = String(form.get("login_id") || "").trim();
  const password = String(form.get("password") || "").trim();

  if (loginId === ADMIN_DEMO_ID && password === ADMIN_DEMO_PASSWORD) {
    localStorage.setItem(ADMIN_DEMO_STORAGE, "true");
    state = { busy: false, message: "初期確認用の管理者ログインで管理画面を開きました。", error: "" };
    location.assign(publicUrl("/admin/dashboard"));
    return;
  }

  try {
    if (!supabase) throw new Error("Supabase接続が必要です。");
    state = { busy: true, message: "", error: "" };
    render();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginId,
      password
    });
    if (error) throw error;
    const { data: profile, error: profileError } = await supabase
      .from("app_profiles")
      .select("role")
      .eq("auth_user_id", data.user.id)
      .single();
    if (profileError) throw profileError;
    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      session = null;
      throw new Error("admin権限がありません。");
    }
    localStorage.removeItem(ADMIN_DEMO_STORAGE);
    state = { busy: false, message: "管理者ログインしました。", error: "" };
    location.assign(publicUrl("/admin/dashboard"));
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
    render();
  }
}

async function handleRegister(event) {
  event?.preventDefault?.();
  const formElement = event?.currentTarget?.matches?.("form")
    ? event.currentTarget
    : document.querySelector('[data-form="register"]');
  if (!formElement.reportValidity()) return;
  const form = new FormData(formElement);
  state = { busy: true, message: "", error: "" };
  render();
  try {
    if (!supabase) throw new Error("通信設定を読み込めませんでした。時間をおいて再読み込みしてください。");
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const payload = registrationPayloadFromForm(form);
    savePendingRegistration(payload);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: absoluteUrl("/login"),
        data: {
          real_name: payload.real_name,
          username: payload.username,
          birthday: payload.birthday,
          gender: payload.gender,
          birthday_visible: payload.birthday_visible
        }
      }
    });
    if (error) throw error;
    if (!data.user) throw new Error("ユーザー登録に失敗しました。");
    if (data.session) {
      await ensureUserProfile(data.user);
      state = { busy: false, message: "会員登録が完了しました。管理アプリの登録者一覧にも反映されます。", error: "" };
      navigate("/member-card");
      return;
    }
    state = { busy: false, message: "確認メールを送信しました。メール確認後にログインすると、登録情報が保存されます。", error: "" };
    navigate("/login");
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
    render();
  }
}

async function handleCompleteProfile(event) {
  event?.preventDefault?.();
  const formElement = event?.currentTarget?.matches?.("form")
    ? event.currentTarget
    : document.querySelector('[data-form="complete-profile"]');
  if (!formElement.reportValidity()) return;

  try {
    if (!supabase) throw new Error("通信設定を読み込めませんでした。時間をおいて再読み込みしてください。");
    const current = await currentSession();
    if (!current?.user) throw new Error("ログインが必要です。");
    const payload = profilePayloadFromForm(new FormData(formElement), current.user);
    await saveUserProfile(payload);
    clearPendingRegistration();
    state = { busy: false, message: "会員プロフィールを保存しました。会員証を表示します。", error: "" };
    navigate("/member-card");
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
    render();
  }
}

async function handleConfig(event) {
  event?.preventDefault?.();
  const formElement = event?.currentTarget?.matches?.("form")
    ? event.currentTarget
    : document.querySelector('[data-form="config"]');
  const form = new FormData(formElement);
  localStorage.setItem("SUPABASE_URL", form.get("url"));
  localStorage.setItem("SUPABASE_ANON_KEY", form.get("anon"));
  await initSupabase();
  state = { busy: false, message: "接続設定を保存しました。service_role key は保存しないでください。", error: "" };
  render();
}

async function toggleBirthday(checked) {
  if (!supabase) {
    demo.user.birthday_visible = checked;
    render();
    return;
  }
  const current = await currentSession();
  if (!current?.user) {
    state.error = "ログインが必要です。";
    render();
    return;
  }
  const { error } = await supabase.from("users").update({ birthday_visible: checked }).eq("auth_user_id", current.user.id);
  if (error) state.error = appErrorMessage(error);
  render();
}

async function updateUsername(event) {
  event.preventDefault();
  const formElement = formFromEvent(event);
  if (!formElement?.reportValidity?.()) return;
  const form = new FormData(formElement);
  const username = String(form.get("username") || "").trim();
  try {
    if (!username) throw new Error("\u30e6\u30fc\u30b6\u30fc\u30cd\u30fc\u30e0\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002");
    const data = await loadMyData();
    if (!supabase) {
      demo.user.username = username;
    } else {
      const rpc = await supabase.rpc("update_my_username", { new_username: username });
      if (rpc.error) {
        if (!isMissingDbObject(rpc.error)) throw rpc.error;
        const previousUsername = data.user.username || "";
        const { error } = await supabase.from("users").update({ username }).eq("id", data.user.id);
        if (error) throw error;
        if (previousUsername !== username) {
          await optionalQuery(supabase.from("user_profile_logs").insert({
            user_id: data.user.id,
            field_name: "username",
            old_value: previousUsername,
            new_value: username
          }), null);
        }
      }
    }
    state = { ...state, usernameEditor: "font", message: "\u30e6\u30fc\u30b6\u30fc\u30cd\u30fc\u30e0\u3092\u66f4\u65b0\u3057\u307e\u3057\u305f\u3002", error: "" };
  } catch (error) {
    state = { ...state, error: appErrorMessage(error) };
  }
  render();
}

async function setUsernameFont(fontId) {
  try {
    const data = await loadMyData();
    const rank = rankFor(sumRankPoints(data.pointEvents));
    const available = availableUsernameFonts(rank);
    if (!available.some((font) => font.id === fontId)) {
      throw new Error("\u3053\u306e\u30d5\u30a9\u30f3\u30c8\u306f\u307e\u3060\u9078\u3079\u307e\u305b\u3093\u3002");
    }
    await ensureUsernameFontLoaded(fontId, data.user.username || "");
    localStorage.setItem(usernameFontStorageKey(data.user.id), fontId);
    markUsernameFontsSeen(data.user, rank);
    state = { ...state, usernameEditor: null, message: "\u30d5\u30a9\u30f3\u30c8\u3092\u66f4\u65b0\u3057\u307e\u3057\u305f\u3002", error: "" };
  } catch (error) {
    state = { ...state, error: appErrorMessage(error) };
  }
  render();
}

function usernameEditorModal(user, rank, currentFontId) {
  const mode = state.usernameEditor || "name";
  const available = availableUsernameFonts(rank);
  const previewName = escapeHtml(user.username || "\u30e6\u30fc\u30b6\u30fc\u30cd\u30fc\u30e0");
  return html`
    <div class="modal-backdrop">
      <section class="username-editor-modal" data-no-flip>
        <div class="modal-head">
          <h2>${mode === "font" ? "\u30d5\u30a9\u30f3\u30c8\u3092\u9078\u3076" : "\u540d\u524d\u3092\u5909\u66f4"}</h2>
          <button type="button" data-action="close-username-editor">\u9589\u3058\u308b</button>
        </div>
        ${mode === "font" ? `
          <div class="font-choice-list">
            ${available.map((font) => {
              return `<button type="button" class="font-choice ${font.className} ${currentFontId === font.id ? "active" : ""}" style="font-family:${font.cssStack}" data-action="set-username-font" data-font-id="${font.id}" aria-label="\u30d5\u30a9\u30f3\u30c8\u3092\u9078\u629e">
                <span class="font-preview-name">${previewName}</span>
              </button>`;
            }).join("")}
          </div>
        ` : `
          <form data-form="username-update">
            <label>\u30e6\u30fc\u30b6\u30fc\u30cd\u30fc\u30e0<input name="username" required maxlength="32" value="${escapeHtml(user.username || "")}" /></label>
            <button class="primary">\u6c7a\u5b9a</button>
          </form>
          <button class="text-action" type="button" data-action="show-username-fonts">\u30d5\u30a9\u30f3\u30c8\u9078\u629e\u3078</button>
        `}
      </section>
    </div>
  `;
}

function calendarModal(imageUrl) {
  return html`
    <div class="modal-backdrop" data-action="close-calendar-modal">
      <section class="calendar-modal" data-no-flip>
        <div class="modal-head">
          <h2>\u55b6\u696d\u65e5\u30ab\u30ec\u30f3\u30c0\u30fc</h2>
          <button type="button" data-action="close-calendar-modal">\u9589\u3058\u308b</button>
        </div>
        <img src="${imageUrl || calendarImageFallback()}" alt="\u55b6\u696d\u65e5\u30ab\u30ec\u30f3\u30c0\u30fc" />
      </section>
    </div>
  `;
}

async function setFavoriteRelic(value, name = "") {
  const data = await loadMyData();
  const options = relicOptions(data.relics);
  const selected = options.find((relic) => relic.id === value) || options.find((relic) => relic.name === name);
  if (selected) localStorage.setItem(relicStorageKey(data.user.id), selected.name);

  if (!supabase) {
    demo.user.favorite_relic_id = selected?.id || null;
    state = { ...state, relicPicker: false, message: selected ? "推し呪物を設定しました。" : "", error: "" };
    render();
    return;
  }

  const dbRelic = data.relics.find((relic) => relic.id === selected?.id) || data.relics.find((relic) => relic.name === selected?.name);
  if (dbRelic) {
    const { error } = await supabase.from("users").update({ favorite_relic_id: dbRelic.id }).eq("id", data.user.id);
    if (error) state.error = appErrorMessage(error);
    else state = { ...state, relicPicker: false, message: "推し呪物を設定しました。", error: "" };
  } else {
    state = { ...state, relicPicker: false, message: "推し呪物をこの端末に保存しました。Supabase側へ反映するには schema.sql の再実行で呪物候補を登録してください。", error: "" };
  }
  render();
}

async function updateIcon(file) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    state = { busy: false, message: "", error: "画像ファイルを選択してください。" };
    render();
    return;
  }

  const reader = new FileReader();
  reader.onload = async () => {
    state = { ...state, iconEditor: { src: String(reader.result), x: 50, y: 50, zoom: 1.15 }, error: "" };
    render();
  };
  reader.onerror = () => {
    state = { busy: false, message: "", error: "画像を読み込めませんでした。" };
    render();
  };
  reader.readAsDataURL(file);
}

function iconEditorModal(editor) {
  return html`
    <div class="modal-backdrop" data-action="close-icon-editor">
      <section class="icon-editor-modal" data-no-flip>
        <div class="modal-head">
          <h2>アイコン位置調整</h2>
          <button type="button" data-action="close-icon-editor">閉じる</button>
        </div>
        <div class="icon-crop-stage" data-action="icon-crop-drag" style="--icon-x:${editor.x}%;--icon-y:${editor.y}%;--icon-zoom:${editor.zoom};">
          <img src="${editor.src}" alt="アイコン位置調整画像" />
          <div class="icon-crop-mask" aria-hidden="true"></div>
          <div class="icon-crop-circle" aria-hidden="true"></div>
        </div>
        <div class="crop-controls">
          <label>左右<input type="range" min="0" max="100" value="${editor.x}" data-action="icon-crop-x" /></label>
          <label>上下<input type="range" min="0" max="100" value="${editor.y}" data-action="icon-crop-y" /></label>
          <label>拡大<input type="range" min="1" max="3" step="0.05" value="${editor.zoom}" data-action="icon-crop-zoom" /></label>
        </div>
        <button class="primary" type="button" data-action="save-cropped-icon">この位置で保存</button>
      </section>
    </div>
  `;
}

function setIconEditorValue(key, value) {
  if (!state.iconEditor) return;
  state = { ...state, iconEditor: { ...state.iconEditor, [key]: Number(value) } };
  render();
}

async function saveCroppedIcon() {
  if (!state.iconEditor) return;
  try {
    const iconUrl = await cropIconToDataUrl(state.iconEditor);
    const data = await loadMyData();
    localStorage.setItem(iconStorageKey(data.user.id), iconUrl);
    if (supabase) {
      const { error } = await supabase.from("users").update({ icon_url: iconUrl }).eq("id", data.user.id);
      if (error) throw error;
    }
    state = { busy: false, message: "アイコンを更新しました。", error: "", iconEditor: null };
  } catch (error) {
    state = { ...state, error: appErrorMessage(error) };
  }
  render();
}

function cropIconToDataUrl(editor) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const size = 420;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, size, size);
      const scale = Math.max(size / image.width, size / image.height) * editor.zoom;
      const drawW = image.width * scale;
      const drawH = image.height * scale;
      const minX = size - drawW;
      const minY = size - drawH;
      const x = drawW > size ? minX * (editor.x / 100) : (size - drawW) / 2;
      const y = drawH > size ? minY * (editor.y / 100) : (size - drawH) / 2;
      ctx.drawImage(image, x, y, drawW, drawH);
      resolve(canvas.toDataURL("image/jpeg", 0.88));
    };
    image.onerror = () => reject(new Error("画像を読み込めませんでした。"));
    image.src = editor.src;
  });
}

async function recordVisit(type, options = {}) {
  try {
    if (!supabase) throw new Error("デモ表示では記録できません。Supabase 接続後に試してください。");
    const { data, error } = await supabase.rpc("record_visit", { visit_kind: type });
    if (error) throw error;
    state = { ...state, busy: false, message: data.message, error: "", qrProcessingKey: "" };
  } catch (error) {
    state = { ...state, busy: false, message: "", error: appErrorMessage(error), qrProcessingKey: "" };
  }
  if (options.returnToMemberCard) {
    navigate("/member-card");
    return;
  }
  render();
}

async function recordSoundHorror(id, options = {}) {
  try {
    if (!supabase) throw new Error("デモ表示では記録できません。Supabase 接続後に試してください。");
    const { data, error } = await supabase.rpc("record_sound_horror", { horror_id: id });
    if (error) throw error;
    state = { ...state, busy: false, message: data.message, error: "", qrProcessingKey: "" };
  } catch (error) {
    state = { ...state, busy: false, message: "", error: appErrorMessage(error), qrProcessingKey: "" };
  }
  if (options.returnToMemberCard) {
    navigate("/member-card");
    return;
  }
  render();
}

async function recordSpecialExperience(code, options = {}) {
  try {
    if (!supabase) throw new Error("デモ表示では記録できません。Supabase 接続後に試してください。");
    const { data, error } = await supabase.rpc("record_special_experience", { experience_code: code });
    if (error) throw error;
    state = { ...state, busy: false, message: data.message, error: "", qrProcessingKey: "" };
  } catch (error) {
    state = { ...state, busy: false, message: "", error: appErrorMessage(error), qrProcessingKey: "" };
  }
  if (options.returnToMemberCard) {
    navigate("/member-card");
    return;
  }
  render();
}

function stopQrScanner() {
  qrScanning = false;
  if (qrFrame) cancelAnimationFrame(qrFrame);
  qrFrame = 0;
  if (qrStream) qrStream.getTracks().forEach((track) => track.stop());
  qrStream = null;
  qrDetecting = false;
}

async function startQrScanner() {
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("この端末ではブラウザからカメラを起動できません。");
    }
    const video = document.querySelector('[data-role="qr-video"]');
    if (!video) return;
    stopQrScanner();
    qrSessionConsumed = false;
    state = { ...state, message: "QRを枠内に入れてください。読み取ると自動で進みます。", error: "" };
    qrStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    });
    video.srcObject = qrStream;
    await video.play();
    localStorage.setItem(QR_CAMERA_ALLOWED_STORAGE, "true");
    qrScanning = true;
    const detector = "BarcodeDetector" in window ? new BarcodeDetector({ formats: ["qr_code"] }) : null;
    let canvas = null;
    let ctx = null;
    if (!detector) {
      if (!jsQrDecoder) {
        const mod = await import("https://esm.sh/jsqr@1.4.0");
        jsQrDecoder = mod.default || mod.jsQR || mod;
      }
      canvas = document.createElement("canvas");
      ctx = canvas.getContext("2d", { willReadFrequently: true });
    }
    const scan = async () => {
      if (!qrScanning) return;
      if (qrDetecting) {
        qrFrame = requestAnimationFrame(scan);
        return;
      }
      qrDetecting = true;
      try {
        if (video.readyState >= 2) {
          let value = "";
          if (detector) {
            const codes = await detector.detect(video);
            value = codes[0]?.rawValue || "";
          } else if (canvas && ctx && jsQrDecoder) {
            const width = video.videoWidth;
            const height = video.videoHeight;
            if (width && height) {
              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(video, 0, 0, width, height);
              const image = ctx.getImageData(0, 0, width, height);
              value = jsQrDecoder(image.data, width, height, { inversionAttempts: "attemptBoth" })?.data || "";
            }
          }
          if (value) {
            if (qrSessionConsumed) return;
            qrSessionConsumed = true;
            qrScanning = false;
            const now = Date.now();
            if (value === lastQrValue && now - lastQrAt < 5000) {
              stopQrScanner();
              state = { ...state, message: "QRは読み取り済みです。会員証へ戻ります。", error: "" };
              navigate("/member-card");
              return;
            }
            lastQrValue = value;
            lastQrAt = now;
            stopQrScanner();
            openQrValue(value);
            return;
          }
        }
        qrDetecting = false;
      } catch (error) {
        stopQrScanner();
        state = { busy: false, message: "", error: appErrorMessage(error) };
        render();
        return;
      }
      qrFrame = requestAnimationFrame(scan);
    };
    qrFrame = requestAnimationFrame(scan);
  } catch (error) {
    stopQrScanner();
    state = { busy: false, message: "", error: appErrorMessage(error) };
    render();
  }
}

async function decodeQrImage(file) {
  if (!file) return;
  try {
    if (!("BarcodeDetector" in window)) {
      throw new Error("このブラウザでは画像からのQR読み取りに対応していません。標準カメラアプリでQRを読み取ってください。");
    }
    const bitmap = await createImageBitmap(file);
    const detector = new BarcodeDetector({ formats: ["qr_code"] });
    const codes = await detector.detect(bitmap);
    const value = codes[0]?.rawValue;
    if (!value) throw new Error("QRコードを読み取れませんでした。明るい場所でもう一度撮影してください。");
    openQrValue(value);
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
    render();
  }
}

function openQrValue(value) {
  try {
    const url = new URL(value, location.origin);
    const path = BASE_PATH && url.pathname.startsWith(`${BASE_PATH}/`)
      ? url.pathname.slice(BASE_PATH.length)
      : url.pathname;
    if (url.origin === location.origin || url.hostname.endsWith("github.io")) {
      state = { ...state, qrNonce: Date.now(), qrProcessingKey: "" };
      navigate(`${path || "/"}${url.search || ""}`);
      return;
    }
    location.assign(url.href);
  } catch {
    throw new Error("QRコードのURLを開けませんでした。");
  }
}

async function claimCoupon(couponId) {
  try {
    if (!supabase) throw new Error("デモ表示ではクーポン取得を保存できません。Supabase接続後に試してください。");
    const { data, error } = await supabase.rpc("claim_coupon", { target_coupon_id: couponId });
    if (error) throw error;
    state = { busy: false, message: data.message || "クーポンを取得しました。", error: "" };
    navigate("/coupons");
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
    render();
  }
}

async function useCoupon(couponId) {
  try {
    if (!supabase) {
      const target = demo.coupons.find((coupon) => coupon.id === couponId);
      if (target) target.status = "used";
      state = { busy: false, message: "クーポンを使用済みにしました。", error: "", selectedCouponId: "" };
      render();
      return;
    }
    const { data, error } = await supabase.rpc("use_user_coupon", { user_coupon_id: couponId });
    if (error) throw error;
    state = { busy: false, message: data.message || "クーポンを使用済みにしました。", error: "", selectedCouponId: "" };
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error), selectedCouponId: "" };
  }
  render();
}

function autoQrAction(key, action, label = "記録しています") {
  const autoKey = `${key}:${state.qrNonce || "direct"}`;
  state.qrDoneKeys = state.qrDoneKeys || new Set();
  if (!state.qrDoneKeys.has(autoKey)) {
    state.qrDoneKeys.add(autoKey);
    state = { ...state, qrProcessingKey: autoKey, busy: true, message: "", error: "" };
    setTimeout(async () => {
      if (state.qrProcessingKey !== autoKey) return;
      await action();
    }, 0);
  }
  return layout(html`
    <section class="action-panel">
      <h1>${label}</h1>
      <p>QRを読み取りました。ログイン中の会員証へ自動で反映します。</p>
      <button data-link="/member-card">会員証へ戻る</button>
    </section>
  `);
}

async function revokeUserPoints(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const value = Math.abs(Number(form.get("point_value") || 0));
  try {
    if (!value) throw new Error("没収するポイント数を入力してください。");
    if (isDemoAdmin()) { state = { busy: false, message: `デモ管理で ${value}pt 没収操作を確認しました。`, error: "" }; render(); return; }
    if (!supabase) throw new Error("Supabase接続が必要です。");
    const { error } = await supabase.from("point_events").insert({
      user_id: form.get("user_id"),
      point_type: "manual",
      point_value: -value,
      rank_affects: true,
      source_type: "manual",
      memo: `ポイント没収 / ${form.get("memo") || ""}`.trim()
    });
    if (error) throw error;
    state = { busy: false, message: `${value}ptを没収しました。`, error: "" };
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
  }
  render();
}

async function saveMemberCardImage() {
  try {
    const flipCard = document.querySelector(".flip-card");
    const target = flipCard?.classList.contains("is-flipped")
      ? document.querySelector(".member-card.back")
      : document.querySelector(".member-card.front");
    if (!target) throw new Error("保存する会員証が見つかりません。");
    state = { ...state, message: "会員証画像を作成しています。", error: "" };
    const mod = await import("https://esm.sh/html2canvas@1.4.1");
    const html2canvas = mod.default || mod;
    const previousTransform = target.style.transform;
    target.style.transform = "none";
    let canvas;
    try {
      canvas = await html2canvas(target, { backgroundColor: null, scale: Math.min(3, window.devicePixelRatio || 2), useCORS: true, scrollX: 0, scrollY: 0 });
    } finally {
      target.style.transform = previousTransform;
    }
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("画像を作成できませんでした。");
    const file = new File([blob], "juju-members-card.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [file] }) && navigator.share) {
      await navigator.share({ files: [file], title: "cafeジュジュ メンバーズカード" });
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "juju-members-card.png";
      a.click();
      URL.revokeObjectURL(url);
    }
    state = { busy: false, message: "会員証画像を保存できます。", error: "" };
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
  }
  render();
}

async function grantSpecialPoint(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    if (isDemoAdmin()) {
      state = { busy: false, message: `デモ用に ${form.get("point_name")} / ${form.get("point_value")}pt を付与した想定で確認しました。実保存は Supabase admin 権限で行います。`, error: "" };
      render();
      return;
    }
    if (!supabase) throw new Error("デモ表示では付与できません。");
    const { error } = await supabase.from("point_events").insert({
      user_id: form.get("user_id"),
      point_type: "special",
      point_value: Number(form.get("point_value")),
      rank_affects: form.get("rank_affects") === "on",
      source_type: "manual",
      memo: `${form.get("point_name")} / ${form.get("memo") || ""}`.trim()
    });
    if (error) throw error;
    state = { busy: false, message: "特別ポイントを付与しました。", error: "" };
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
  }
  render();
}

async function createCoupon(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    if (isDemoAdmin()) {
      state = { busy: false, message: "デモ管理では作成UIだけ確認できます。実保存はSupabase admin権限で行います。", error: "" };
      render();
      return;
    }
    if (!supabase) throw new Error("Supabase接続が必要です。");
    const { error } = await supabase.from("coupons").insert({
      title: String(form.get("title") || "").trim(),
      description: String(form.get("description") || "").trim(),
      expires_at: form.get("expires_at") || null,
      usage_limit: 1,
      is_active: true
    });
    if (error) throw error;
    state = { busy: false, message: "クーポンを作成しました。", error: "" };
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
  }
  render();
}

async function grantCoupon(event) {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const submitter = event.submitter;
  if (submitter) submitter.disabled = true;
  const submitterText = submitter?.textContent;
  if (submitter) submitter.textContent = "付与中";
  const form = new FormData(event.currentTarget);
  try {
    state = { busy: true, message: "", error: "" };
    if (!form.get("user_id") || !form.get("coupon_id")) throw new Error("対象ユーザーとクーポンを選択してください。");
    if (isDemoAdmin()) {
      if (!supabase) throw new Error("Supabase接続が必要です。");
      const rpc = await supabase.rpc("staff_grant_coupon_to_user", {
        p_staff_id: ADMIN_DEMO_ID,
        p_password: ADMIN_DEMO_PASSWORD,
        p_user_id: form.get("user_id"),
        p_coupon_id: form.get("coupon_id")
      });
      if (rpc.error) throw rpc.error;
      state = { busy: false, message: rpc.data?.message || "会員にクーポンを付与しました。", error: "" };
      render();
      return;
    }
    if (!supabase) throw new Error("Supabase接続が必要です。");
    const rpc = await supabase.rpc("grant_coupon_to_user", {
      target_user_id: form.get("user_id"),
      target_coupon_id: form.get("coupon_id")
    });
    if (rpc.error) {
      if (!isMissingDbObject(rpc.error)) throw rpc.error;
      const fallback = await supabase.from("user_coupons").upsert({
        user_id: form.get("user_id"),
        coupon_id: form.get("coupon_id"),
        status: "available",
        used_at: null
      }, { onConflict: "user_id,coupon_id" });
      if (fallback.error) throw fallback.error;
    }
    state = { busy: false, message: "会員にクーポンを付与しました。", error: "" };
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
  } finally {
    if (submitter) {
      submitter.disabled = false;
      submitter.textContent = submitterText || "会員に直接付与";
    }
  }
  render();
}

async function updateCalendarImage(event) {
  event.preventDefault();
  const formElement = formFromEvent(event);
  if (!formElement?.reportValidity?.()) return;
  const submitter = event.submitter;
  const submitterText = submitter?.textContent;
  if (submitter) {
    submitter.disabled = true;
    submitter.textContent = "保存中";
  }
  try {
    const form = new FormData(formElement);
    const imageUrl = await readImageFileAsDataUrl(form.get("calendar_file"));
    if (!imageUrl) throw new Error("カレンダー画像を選んでください。");
    if (isDemoAdmin() && supabase) {
      const rpc = await supabase.rpc("staff_update_app_setting", {
        p_staff_id: ADMIN_DEMO_ID,
        p_password: ADMIN_DEMO_PASSWORD,
        p_key: CALENDAR_SETTING_KEY,
        p_value: imageUrl
      });
      if (rpc.error) throw rpc.error;
      localStorage.setItem(CALENDAR_IMAGE_STORAGE, imageUrl);
    } else {
      await saveCalendarImageSetting(imageUrl);
    }
    state = { busy: false, message: "営業日カレンダーを更新しました。", error: "" };
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
  } finally {
    if (submitter) {
      submitter.disabled = false;
      submitter.textContent = submitterText || "カレンダーを更新";
    }
  }
  render();
}

async function deleteGrantedCoupon(userCouponId) {
  try {
    if (isDemoAdmin()) {
      state = { busy: false, message: "デモ管理では削除操作の確認だけ行いました。", error: "" };
      render();
      return;
    }
    if (!supabase) throw new Error("Supabase接続が必要です。");
    const { error } = await supabase.from("user_coupons").delete().eq("id", userCouponId);
    if (error) throw error;
    state = { busy: false, message: "付与済みクーポンを削除しました。", error: "" };
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
  }
  render();
}

async function deleteCreatedCoupon(couponId) {
  try {
    if (isDemoAdmin()) {
      state = { busy: false, message: "作成済みクーポンの削除操作を確認しました。", error: "" };
      render();
      return;
    }
    if (!supabase) throw new Error("Supabase接続が必要です。");
    const { error } = await supabase.from("coupons").update({ is_active: false }).eq("id", couponId);
    if (error) throw error;
    state = { busy: false, message: "作成済みクーポンを削除しました。付与済み履歴は残ります。", error: "" };
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
  }
  render();
}

async function grantPurchasePermission(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    if (isDemoAdmin()) {
      state = { busy: false, message: "デモ管理では購入資格刻印の付与操作を確認しました。", error: "" };
      render();
      return;
    }
    if (!supabase) throw new Error("Supabase接続が必要です。");
    const { error } = await supabase.from("user_purchase_permissions").upsert({
      user_id: form.get("user_id"),
      memo: String(form.get("memo") || "").trim(),
      is_active: true
    }, { onConflict: "user_id" });
    if (error) throw error;
    state = { busy: false, message: "購入資格刻印を付与しました。", error: "" };
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
  }
  render();
}

async function revokePurchasePermission(userId) {
  try {
    if (isDemoAdmin()) {
      state = { busy: false, message: "デモ管理では購入資格刻印の解除操作を確認しました。", error: "" };
      render();
      return;
    }
    if (!supabase) throw new Error("Supabase接続が必要です。");
    const { error } = await supabase.from("user_purchase_permissions").update({ is_active: false }).eq("user_id", userId);
    if (error) throw error;
    state = { busy: false, message: "手動の購入資格刻印を解除しました。", error: "" };
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
  }
  render();
}

function sourceLabel(url) {
  if (!url) return "JUJU";
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.includes("x.com") || host.includes("twitter.com")) return "X";
    if (host.includes("instagram.com")) return "Instagram";
    if (host.includes("tiktok.com")) return "TikTok";
    if (host.includes("youtube.com") || host.includes("youtu.be")) return "YouTube";
    return host;
  } catch {
    return "Link";
  }
}

function linkPreview(post) {
  if (!post.external_url) return "";
  let url;
  try {
    url = new URL(post.external_url);
  } catch {
    return "";
  }
  const host = url.hostname.replace(/^www\./, "");
  const label = post.source_label || sourceLabel(post.external_url);
  const favicon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`;
  const path = `${url.pathname}${url.search}`.replace(/\/$/, "") || "/";
  const providerClass = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const previewTitle = post.title || label || host;
  return html`
    <div class="news-link-preview provider-${escapeHtml(providerClass)}">
      <div class="preview-icon"><img src="${escapeHtml(favicon)}" alt="" loading="lazy" /></div>
      <div>
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(previewTitle)}</strong>
        <small>${escapeHtml(host + path)}</small>
      </div>
      <em>リンクを開く</em>
    </div>
  `;
}

function normalizeExternalUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

function readImageFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.size) {
      resolve("");
      return;
    }
    if (!file.type?.startsWith("image/")) {
      reject(new Error("画像ファイルを選択してください。"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("画像を読み込めませんでした。"));
    reader.readAsDataURL(file);
  });
}

async function createNewsPost(formElement, submitter = null) {
  if (!formElement?.reportValidity?.()) return;
  if (submitter) submitter.disabled = true;
  const submitterText = submitter?.textContent;
  if (submitter) submitter.textContent = "送信中";
  const form = new FormData(formElement);
  const mode = String(form.get("mode") || "article");
  const url = normalizeExternalUrl(form.get("url"));
  const body = String(form.get("body") || "").trim();
  const imageFileUrl = await readImageFileAsDataUrl(form.get("image_file"));
  const imageUrl = imageFileUrl || String(form.get("image_url") || "").trim();
  const titleInput = String(form.get("title") || "").trim();
  const title = titleInput || (mode === "url" ? sourceLabel(url) : "NEWS");
  const publishedAt = new Date().toISOString();
  const insertPayload = {
    title,
    body,
    image_url: imageUrl || null,
    external_url: url || null,
    source_label: sourceLabel(url),
    is_published: true,
    published_at: publishedAt
  };
  try {
    state = { busy: true, message: "", error: "" };
    if (mode === "url" && !url) {
      throw new Error("URLを入力してください。");
    }
    if (mode !== "url" && !titleInput && !body && !imageUrl) {
      throw new Error("NEWSのタイトル、本文、画像URL、外部URLのいずれかを入力してください。");
    }
    if (isDemoAdmin()) {
      const post = {
        id: `local-news-${Date.now()}`,
        ...insertPayload,
        is_published: true,
        created_at: publishedAt,
        published_at: publishedAt
      };
      saveLocalNewsPost(post);
      if (supabase) {
        const { error } = await supabase.rpc("create_staff_news_post", {
          p_staff_id: ADMIN_DEMO_ID,
          p_password: ADMIN_DEMO_PASSWORD,
          p_title: title,
          p_body: body || null,
          p_image_url: imageUrl || null,
          p_external_url: url || null,
          p_source_label: sourceLabel(url)
        });
        if (error) {
          const fallback = await supabase.from("news_posts").insert(insertPayload);
          if (fallback.error) {
            state = {
              busy: false,
              message: "NEWSをこの端末に保存しました。全員へ公開するには最新の supabase/schema.sql をSQL Editorで再実行してください。",
              error: appErrorMessage(fallback.error || error)
            };
            render();
            return;
          }
        }
      }
      state = { busy: false, message: "NEWSを公開しました。", error: "" };
      render();
      return;
    }
    if (!supabase) throw new Error("Supabase接続が必要です。");
    const { error } = await supabase.from("news_posts").insert(insertPayload);
    if (error) throw error;
    saveLocalNewsPost({
      id: `local-news-${Date.now()}`,
      ...insertPayload,
      is_published: true,
      created_at: publishedAt,
      published_at: publishedAt
    });
    state = { busy: false, message: "NEWSを公開しました。", error: "" };
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
  } finally {
    if (submitter) {
      submitter.disabled = false;
      submitter.textContent = submitterText || "NEWSを公開";
    }
  }
  render();
}

function handleAdminUserSearch(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  state = { ...state, adminUserSearch: String(form.get("query") || "").trim() };
  render();
}

async function deleteNewsPost(newsId, externalUrl = "") {
  try {
    const removeLocal = () => {
      localStorage.setItem(NEWS_LOCAL_STORAGE, JSON.stringify(localNewsPosts().filter((post) =>
        post.id !== newsId && (!externalUrl || post.external_url !== externalUrl)
      )));
    };
    if (String(newsId).startsWith("local-news-")) {
      removeLocal();
      state = { busy: false, message: "NEWSを削除しました。", error: "" };
      render();
      return;
    }
    if (isDemoAdmin() && supabase) {
      const { error } = await supabase.rpc("delete_staff_news_post", {
        p_staff_id: ADMIN_DEMO_ID,
        p_password: ADMIN_DEMO_PASSWORD,
        p_news_id: newsId
      });
      if (error) throw error;
      removeLocal();
      state = { busy: false, message: "NEWSを削除しました。", error: "" };
      render();
      return;
    }
    if (!supabase) throw new Error("Supabase接続が必要です。");
    const { error } = await supabase.from("news_posts").update({ is_published: false }).eq("id", newsId);
    if (error) throw error;
    removeLocal();
    state = { busy: false, message: "NEWSを非公開にしました。", error: "" };
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
  }
  render();
}

async function updateNewsPost(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const newsId = String(form.get("news_id") || "");
  const title = String(form.get("title") || "").trim();
  const body = String(form.get("body") || "").trim();
  const imageFileUrl = await readImageFileAsDataUrl(form.get("image_file"));
  const imageUrl = imageFileUrl || String(form.get("image_url") || "").trim();
  const url = normalizeExternalUrl(form.get("url"));
  const patch = {
    title,
    body: body || null,
    image_url: imageUrl || null,
    external_url: url || null,
    source_label: sourceLabel(url),
    updated_at: new Date().toISOString()
  };
  try {
    if (!title) throw new Error("タイトルを入力してください。");
    const localPosts = localNewsPosts();
    const localIndex = localPosts.findIndex((post) => post.id === newsId);
    if (localIndex >= 0) {
      localPosts[localIndex] = { ...localPosts[localIndex], ...patch };
      localStorage.setItem(NEWS_LOCAL_STORAGE, JSON.stringify(localPosts));
    }
    if (isDemoAdmin() && supabase && !String(newsId).startsWith("local-news-")) {
      const { error } = await supabase.rpc("update_staff_news_post", {
        p_staff_id: ADMIN_DEMO_ID,
        p_password: ADMIN_DEMO_PASSWORD,
        p_news_id: newsId,
        p_title: title,
        p_body: body || null,
        p_image_url: imageUrl || null,
        p_external_url: url || null,
        p_source_label: sourceLabel(url)
      });
      if (error) throw error;
    } else if (!String(newsId).startsWith("local-news-")) {
      if (!supabase) throw new Error("Supabase接続が必要です。");
      const { error } = await supabase.from("news_posts").update(patch).eq("id", newsId);
      if (error) throw error;
    }
    state = { busy: false, message: "NEWSを更新しました。", error: "" };
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
  }
  render();
}

function layout(content, admin = false) {
  if (admin) localStorage.setItem(ADMIN_APP_STORAGE, "true");
  return html`
    <header class="topbar">
      <button class="brand" data-link="${admin ? "/admin/dashboard" : "/member-card"}"><img src="assets/brand/joujou_logo_white.png" alt="" aria-hidden="true" />cafeジュジュ</button>
      <nav>
        ${admin
          ? `<button data-link="/admin/dashboard">管理</button><button data-link="/admin/users">登録者</button><button data-link="/admin/visits">履歴</button><button data-link="/admin/points">特別ポイント</button><button data-link="/admin/qr">QR表示</button><button data-link="/admin/coupons">クーポン</button><button data-link="/admin/calendar">カレンダー</button><button data-link="/admin/news">NEWS</button>`
          : `<button data-link="/member-card">会員証</button><button data-link="/coupons">クーポン</button><button data-link="/special-cards">特別カード</button><button class="news-nav-button" data-link="/news">NEWS${state.unreadNewsCount ? `<span class="news-badge">${state.unreadNewsCount}</span>` : ""}</button><button data-link="/contact">コンタクト</button>`}
        <button data-action="logout">ログアウト</button>
      </nav>
    </header>
    <main class="${admin ? "admin-main" : "user-main"}">
      ${notice()}
      ${content}
    </main>
  `;
}

function notice() {
  return `${state.message ? `<p class="notice ok">${state.message}</p>` : ""}${state.error ? `<p class="notice error">${state.error}</p>` : ""}`;
}

async function viewLogin() {
  if (isAdminAppLaunch() && (appPath() === "/" || appPath() === "/login")) {
    replacePath("/admin/login");
    return viewAdminLogin();
  }
  const current = isConfigured() ? await currentSession() : null;
  if (current?.user && !appPath().startsWith("/admin")) {
    navigate("/member-card");
    return "";
  }

  return html`
    <main class="auth-page">
      <section class="auth-panel">
        <h1>cafeジュジュ メンバーズカード</h1>
        <p>ログインすると、自分の会員証・来店履歴・サウンドホラー体験履歴だけを表示します。</p>
        ${notice()}
        <form data-form="login">
          <label>メールアドレス<input name="email" type="email" required autocomplete="email" /></label>
          <label>パスワード<input name="password" type="password" required autocomplete="current-password" /></label>
          <button class="primary" type="button" data-action="login-user" ${state.busy ? "disabled" : ""}>ログイン</button>
        </form>
        <div class="auth-links">
          <button data-link="/register">会員登録</button>
        </div>
      </section>
    </main>
  `;
}

function viewAdminLogin() {
  return html`
    <main class="auth-page">
      <section class="auth-panel">
        <h1>管理ログイン</h1>
        <p>admin権限のあるアカウントだけが管理画面を開けます。</p>
        ${notice()}
        <form data-form="admin-login">
          <label>管理ID / メールアドレス<input name="login_id" required autocomplete="username" /></label>
          <label>パスワード<input name="password" type="password" required autocomplete="current-password" /></label>
          <button class="primary" type="button" data-action="admin-login">管理画面を開く</button>
        </form>
        <div class="auth-links">
          <button data-link="/login">ユーザーログイン</button>
        </div>
      </section>
    </main>
  `;
}

function viewRegister() {
  return html`
    <main class="auth-page">
      <section class="auth-panel wide">
        <h1>会員登録</h1>
        <p>ここで入力した情報は本番用の会員プロフィールとして保存され、スタッフ管理アプリの登録者一覧に反映されます。</p>
        ${notice()}
        <form class="grid-form" data-form="register">
          <label>本名<input name="real_name" required autocomplete="name" placeholder="山田 太郎" /></label>
          <label>ユーザーネーム<input name="username" required autocomplete="nickname" placeholder="juju_guest" /></label>
          <label>メールアドレス<input name="email" type="email" required autocomplete="email" placeholder="you@example.com" /></label>
          <label>パスワード<input name="password" type="password" minlength="8" required autocomplete="new-password" /></label>
          <label>誕生日<input name="birthday" type="date" required /></label>
          <label>性別<select name="gender" required><option>男性</option><option>女性</option><option>その他</option><option selected>回答しない</option></select></label>
          <label class="check"><input name="birthday_visible" type="checkbox" checked /> 会員カードに誕生日を表示</label>
          <p class="form-note">本名、性別、年齢は会員カード表面には表示されません。スタッフ管理画面でのみ確認します。</p>
          <button class="primary" type="button" data-action="register-member">登録して会員証へ</button>
        </form>
        <button data-link="/login">ログインへ</button>
      </section>
    </main>
  `;
}

async function viewCompleteProfile() {
  const current = await currentSession();
  if (!current?.user) return viewLogin();
  const pending = readPendingRegistration() || profileFromAuthMetadata(current.user) || {};
  return html`
    <main class="auth-page">
      <section class="auth-panel wide">
        <h1>会員プロフィール登録</h1>
        <p>ログインは完了しています。会員証と管理アプリに反映するプロフィールを保存してください。</p>
        ${notice()}
        <form class="grid-form" data-form="complete-profile">
          <label>本名<input name="real_name" required autocomplete="name" value="${pending.real_name || ""}" /></label>
          <label>ユーザーネーム<input name="username" required autocomplete="nickname" value="${pending.username || ""}" /></label>
          <label>メールアドレス<input value="${current.user.email || ""}" disabled /></label>
          <label>誕生日<input name="birthday" type="date" required value="${pending.birthday || ""}" /></label>
          <label>性別<select name="gender" required>${["男性", "女性", "その他", "回答しない"].map((gender) => `<option ${gender === (pending.gender || "回答しない") ? "selected" : ""}>${gender}</option>`).join("")}</select></label>
          <label class="check"><input name="birthday_visible" type="checkbox" ${pending.birthday_visible === false ? "" : "checked"} /> 会員カードに誕生日を表示</label>
          <p class="form-note">保存すると public.users に会員情報が作られ、スタッフ管理アプリの登録者一覧に反映されます。</p>
          <button class="primary" type="button" data-action="complete-profile">保存して会員証へ</button>
        </form>
      </section>
    </main>
  `;
}

async function viewMemberCard() {
  const data = await loadMyData();
  applyUnreadNewsCount(data);
  const events = data.pointEvents;
  const points = sumRankPoints(events);
  const rank = rankFor(points);
  const next = nextRank(points);
  const horrors = data.soundHorrors?.length ? data.soundHorrors : demoSoundHorrors;
  const currentHorrorIds = new Set(horrors.map((horror) => horror.id));
  const visibleListens = data.listens.filter((listen) => currentHorrorIds.has(listen.sound_horror_id));
  const listensByHorror = countBy(visibleListens, "sound_horror_id");
  const completed = Object.keys(listensByHorror).length;
  const birthday = data.user.birthday_visible ? monthDayDate(data.user.birthday) : "\u975e\u8868\u793a";
  const icon = userIcon(data.user);
  const relics = relicOptions(data.relics);
  const favoriteRelic = currentFavoriteRelic(data.user, data.relics);
  const favoriteLabel = favoriteRelic?.name || "\u63a8\u3057\u546a\u7269";
  const favoriteImage = favoriteRelic?.image || "";
  const purchasePermission = purchasePermissionFor(data.user, rank, data.purchasePermissions || []);
  const usernameFontId = currentUsernameFont(data.user, rank);
  const usernameNewFonts = hasNewUsernameFonts(data.user, rank);
  const calendarImage = await loadCalendarImage();
  setInitialUsernameFontSeen(data.user, rank);

  return layout(html`
    <section class="member-actions">
      <button class="primary compact-action" data-link="/scan">QR\u3092\u8aad\u307f\u53d6\u308b</button>
      <button class="compact-action save-action" type="button" data-action="save-card-image" aria-label="\u4f1a\u54e1\u8a3c\u3092\u4fdd\u5b58">\u4fdd\u5b58</button>
    </section>
    ${usernameNewFonts ? `<button type="button" class="font-unlock-banner" data-action="show-username-fonts">新しいフォントが選択できるようになりました</button>` : ""}
    <section class="card-stage">
      <div class="background-noise" aria-hidden="true"></div>
      <div class="flip-card" data-action="flip-card">
        <article class="member-card face front">
          <img class="card-brand-logo" src="assets/brand/joujou_logo_black.png" alt="" aria-hidden="true" />
          <div class="card-row">
            <div>
              <p class="eyebrow">MEMBERS CARD</p>
              <button type="button" class="username-button ${usernameFontClass(usernameFontId)}" style="font-family:${usernameFontCssStack(usernameFontId)}" data-action="open-username-editor" data-no-flip>
                <span>${data.user.username}</span>
              </button>
              <p class="member-no">${data.user.member_number}</p>
            </div>
            <div class="member-symbols" data-no-flip>
              <label class="avatar" title="\u30a2\u30a4\u30b3\u30f3\u3092\u5909\u66f4" data-no-flip>
                ${icon ? `<img src="${icon}" alt="\u30e6\u30fc\u30b6\u30fc\u30a2\u30a4\u30b3\u30f3" />` : `<span>${(data.user.username || "J").slice(0, 1).toUpperCase()}</span>`}
                <input type="file" accept="image/*" data-action="icon-upload" />
              </label>
              <button type="button" class="favorite-relic-badge ${favoriteImage ? "has-image" : ""}" data-action="open-relic-picker" data-relic-label="${favoriteLabel}" data-no-flip>
                ${favoriteImage ? `<img src="${favoriteImage}" alt="${favoriteLabel}" />` : `<span class="relic-placeholder">?</span>`}
                <strong>${favoriteLabel}</strong>
              </button>
            </div>
          </div>
          <div class="rank-badge" data-rank-label="${rank.name}"><span>\u30e9\u30f3\u30af ${rank.n}</span><strong>${rank.name}</strong></div>
          ${purchasePermission.allowed ? `<button type="button" class="purchase-seal ${purchasePermission.manual ? "manual" : ""}" data-action="open-purchase-seal" data-no-flip><span>\u546a\u7269\u8cfc\u5165\u8cc7\u683c</span><strong>\u8a31</strong></button>` : ""}
          <div class="point-strip">
            <div class="point-main">
              <span>\u73fe\u5728\u30dd\u30a4\u30f3\u30c8</span>
              <strong>${points} <em>pt</em></strong>
            </div>
            <div class="profile-controls" data-no-flip>
              <span>\u8a95\u751f\u65e5 ${birthday}</span>
              <label class="check birthday-toggle"><input type="checkbox" data-action="birthday" aria-label="\u8a95\u751f\u65e5\u3092\u8868\u793a" ${data.user.birthday_visible ? "checked" : ""} /></label>
              <button class="calendar-icon-button" type="button" data-action="open-calendar-modal" data-no-flip aria-label="\u55b6\u696d\u65e5\u30ab\u30ec\u30f3\u30c0\u30fc\u3092\u8868\u793a"><img src="assets/calendar-icon.jpg" alt="" aria-hidden="true" /></button>
            </div>
          </div>
          <div class="mini-facts">
            <span>${next ? `\u6b21\u306e\u30e9\u30f3\u30af\u307e\u3067 ${Math.max(0, next.min - points).toFixed(1)}pt` : "\u6700\u9ad8\u30e9\u30f3\u30af"}</span>
          </div>
        </article>
        <article class="member-card face back">
          <img class="card-brand-logo back-logo" src="assets/brand/joujou_logo_black.png" alt="" aria-hidden="true" />
          <div class="stamp-head">
            <div><p class="eyebrow">SOUND HORROR</p><h2>${completed} / ${horrors.length}</h2></div>
            <strong>\u7dcf\u4f53\u9a13 ${visibleListens.length}\u56de</strong>
          </div>
          <div class="stamp-grid">
            ${horrors.map((horror) => {
              const image = relicImageByHorrorTitle[horror.title];
              const count = listensByHorror[horror.id] || 0;
              return `<div class="stamp ${count ? "done" : ""} ${image ? "has-image" : ""}" ${image ? `style="--stamp-image:url('${image}')"` : ""}><span class="horror-title">${count ? horror.title : "\uff1f\uff1f\uff1f\uff1f\uff1f"}</span><b>${count}</b></div>`;
            }).join("")}
          </div>
        </article>
      </div>
    </section>
    ${state.relicPicker ? relicPickerModal(relics, favoriteRelic) : ""}
    ${state.iconEditor ? iconEditorModal(state.iconEditor) : ""}
    ${state.purchaseSealOpen ? purchaseSealModal() : ""}
    ${state.usernameEditor ? usernameEditorModal(data.user, rank, usernameFontId) : ""}
    ${state.calendarOpen ? calendarModal(calendarImage) : ""}
  `);
}

function purchaseSealModal() {
  return html`
    <div class="modal-backdrop" data-action="close-purchase-seal">
      <section class="purchase-seal-modal" data-no-flip>
        <div class="seal-mark">\u8a31</div>
        <h2>\u546a\u7269\u8cfc\u5165\u8cc7\u683c</h2>
        <p>\u8cb4\u65b9\u306f\u546a\u7269\u3092\u8cfc\u5165\u3059\u308b\u8cc7\u683c\u3092\u6301\u3063\u3066\u3044\u307e\u3059\u3002</p>
      </section>
    </div>
  `;
}

function viewScan() {
  return layout(html`
    <section class="action-panel qr-scan-panel">
      <h1>QR\u8aad\u307f\u53d6\u308a</h1>
      <p>\u5e97\u982dQR\u3092\u30ab\u30e1\u30e9\u306b\u304b\u3056\u3057\u3066\u304f\u3060\u3055\u3044\u3002\u8aad\u307f\u53d6\u308b\u3068\u81ea\u52d5\u3067\u8a18\u9332\u30fb\u53d6\u5f97\u753b\u9762\u3078\u9032\u307f\u307e\u3059\u3002</p>
      <div class="qr-camera-box">
        <video class="qr-video" playsinline muted data-role="qr-video"></video>
        <div class="qr-reticle" aria-hidden="true"></div>
      </div>
      <div class="qr-scan-actions">
        <button class="primary" type="button" data-action="start-qr-scanner">\u30ab\u30e1\u30e9\u3092\u8d77\u52d5</button>
        <button type="button" data-action="stop-qr-scanner">\u505c\u6b62</button>
        <button data-link="/member-card">\u4f1a\u54e1\u8a3c\u3078\u623b\u308b</button>
      </div>
    </section>
  `);
}
function relicPicker(relics, current) {
  return `<div class="relic-picker">${relics.map((relic) => relicChoice(relic, current)).join("")}</div>`;
}

function relicPickerModal(relics, current) {
  return html`
    <div class="modal-backdrop" data-action="close-relic-picker">
      <section class="relic-modal" data-no-flip>
        <div class="modal-head">
          <h2>\u63a8\u3057\u546a\u7269\u3092\u9078\u3076</h2>
          <button type="button" data-action="close-relic-picker">\u9589\u3058\u308b</button>
        </div>
        ${relicPicker(relics, current)}
      </section>
    </div>
  `;
}

function relicChoice(relic, current) {
  const active = current?.name === relic.name || current?.id === relic.id;
  return html`
    <button type="button" class="relic-choice ${active ? "active" : ""}" data-action="favorite-relic" data-relic-id="${relic.id}" data-relic-name="${relic.name}">
      <img src="${relic.image}" alt="${relic.name}" />
      <span>${relic.name}</span>
    </button>
  `;
}

async function viewCoupons() {
  const data = await loadMyData();
  applyUnreadNewsCount(data);
  const selected = data.coupons.find((coupon) => coupon.id === state.selectedCouponId);
  return layout(html`
    <section class="page-head"><h1>クーポン</h1><p>使用時はスタッフに画面を見せてください。</p></section>
    <section class="coupon-wallet">
      ${data.coupons.length ? data.coupons.map(couponTicket).join("") : `<p class="empty">現在利用できるクーポンはありません。</p>`}
    </section>
    ${selected ? couponModal(selected) : ""}
  `);
}

function couponMeta(userCoupon) {
  return userCoupon.coupons || userCoupon;
}

function couponStatusLabel(status) {
  return { available: "使用可能", used: "使用済み", expired: "期限切れ", disabled: "無効" }[status] || status || "使用可能";
}

function couponTicket(userCoupon) {
  const coupon = couponMeta(userCoupon);
  const expires = coupon.expires_at ? yenDate(coupon.expires_at) : "無期限";
  return html`
    <button type="button" class="coupon-ticket ${userCoupon.status || ""}" data-action="open-coupon" data-coupon-id="${userCoupon.id}">
      <span class="ticket-kicker">${couponStatusLabel(userCoupon.status)}</span>
      <strong>${coupon.title || "クーポン"}</strong>
      <small>${expires}</small>
    </button>
  `;
}

function couponModal(userCoupon) {
  const coupon = couponMeta(userCoupon);
  const expires = coupon.expires_at ? yenDate(coupon.expires_at) : "無期限";
  return html`
    <div class="modal-backdrop" data-action="close-coupon">
      <section class="coupon-modal">
        <div class="modal-head">
          <h2>${coupon.title || "クーポン"}</h2>
          <button type="button" data-action="close-coupon">閉じる</button>
        </div>
        <div class="coupon-large">
          <span>${couponStatusLabel(userCoupon.status)}</span>
          <strong>${coupon.title || "クーポン"}</strong>
          <p>${coupon.description || ""}</p>
          <small>${expires}</small>
        </div>
        <p class="notice">使用時はスタッフに画面を見せてください。</p>
        <p class="coupon-staff-note">スタッフが押すので、ご自身では押さないでください。</p>
        ${userCoupon.status === "available" ? `<button class="primary use-coupon" data-action="use-coupon" data-coupon-id="${userCoupon.id}">使用する</button>` : ""}
      </section>
    </div>
  `;
}

async function viewQrVisit() {
  const type = new URLSearchParams(location.search).get("type") === "second_floor" ? "second_floor" : "first_floor";
  const label = type === "second_floor" ? "2F visit" : "1F visit";
  return autoQrAction(`visit:${type}`, () => recordVisit(type, { returnToMemberCard: true }), `${label} recording`);
}

async function viewQrSound() {
  const id = decodeURIComponent(location.pathname.split("/").pop());
  return autoQrAction(`sound:${id}`, () => recordSoundHorror(id, { returnToMemberCard: true }), "Sound horror recording");
}

async function viewQrSpecial() {
  const code = decodeURIComponent(appPath().split("/").pop());
  const experience = specialExperiences.find((item) => item.code === code) || specialExperiences[0];
  return autoQrAction(`special:${experience.code}`, () => recordSpecialExperience(experience.code, { returnToMemberCard: true }), "Experience recording");
}

async function viewQrCoupon() {
  const couponId = decodeURIComponent(appPath().split("/").pop());
  return autoQrAction(`coupon:${couponId}`, () => claimCoupon(couponId), "Coupon claiming");
}
function viewSettings() {
  return layout(html`
    <section class="settings">
      <h1>アプリ設定</h1>
      <p>Supabase接続は公開用アプリに組み込み済みです。お客さんはURLやkeyを入力せずに会員登録・ログインできます。</p>
      ${notice()}
      <div class="setup-guide">
        <h2>公開状態</h2>
        <p>フロントには公開可能なSupabase URLとpublishable keyのみを同梱しています。実データの保護はSupabase RLSとadmin権限で行います。</p>
      </div>
    </section>
  `);
}

function viewContact() {
  return layout(html`
    <section class="contact-page">
      <section class="page-head"><h1>コンタクト</h1><p>店舗への連絡先とアクセス情報です。</p></section>
      <section class="contact-grid">
        <a class="contact-card" href="tel:${contactInfo.phone}"><span>電話番号</span><strong>${contactInfo.phone}</strong></a>
        <a class="contact-card" href="mailto:${contactInfo.email}"><span>メール</span><strong>${contactInfo.email}</strong></a>
        <a class="contact-card" href="https://maps.google.com/?q=${encodeURIComponent(contactInfo.address)}" target="_blank" rel="noopener noreferrer"><span>住所</span><strong>${contactInfo.address}</strong></a>
        <a class="contact-card" href="${contactInfo.hp}" target="_blank" rel="noopener noreferrer"><span>HP</span><strong>${contactInfo.hp}</strong></a>
      </section>
    </section>
  `);
}

function viewSpecialCards() {
  return layout(html`
    <section class="page-head"><h1>\u7279\u5225\u30ab\u30fc\u30c9</h1></section>
    <section class="empty-state">\u73fe\u5728\u8868\u793a\u3067\u304d\u308b\u7279\u5225\u30ab\u30fc\u30c9\u306f\u3042\u308a\u307e\u305b\u3093\u3002</section>
  `);
}

async function markNewsRead(userId, posts = []) {
  const ids = posts.map((post) => post.id).filter(Boolean);
  localStorage.setItem(newsReadStorageKey(userId), JSON.stringify(ids));
  state.unreadNewsCount = 0;
  if (!supabase || !ids.length) return;
  const rows = ids
    .filter((id) => !String(id).startsWith("local-news-"))
    .map((news_post_id) => ({ user_id: userId, news_post_id }));
  if (!rows.length) return;
  const { error } = await supabase.from("news_reads").upsert(rows, { onConflict: "user_id,news_post_id" });
  if (error && !isMissingDbObject(error)) throw error;
}

function newsPostCard(post, admin = false) {
  const date = post.published_at ? yenDate(post.published_at) : yenDate(post.created_at);
  const title = post.title || "NEWS";
  const imageUrl = post.image_url || "";
  const externalUrl = post.external_url || "";
  const bodyText = post.body || "";
  const media = imageUrl ? `<img class="news-image" src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)}" />` : "";
  const body = bodyText ? `<p>${escapeHtml(bodyText)}</p>` : "";
  const source = post.source_label || sourceLabel(externalUrl);
  const preview = linkPreview(post);
  const content = [
    `<div class="news-author"><span class="news-avatar">\u546a</span><div><strong>cafe\u30b8\u30e5\u30b8\u30e5</strong><small>${escapeHtml(source)} / ${escapeHtml(date)}</small></div></div>`,
    `<h2>${escapeHtml(title)}</h2>`,
    body,
    media,
    preview
  ].join("");
  return html`
    <article class="news-post ${externalUrl ? "is-link" : ""}">
      ${externalUrl ? `<a href="${escapeHtml(externalUrl)}" target="_blank" rel="noopener noreferrer">${content}</a>` : content}
      ${admin ? `
        <div class="news-admin-actions">
          <details>
            <summary>\u7de8\u96c6</summary>
            <form class="grid-form admin-form news-edit-form" data-form="news-edit">
              <input type="hidden" name="news_id" value="${escapeHtml(post.id)}" />
              <label>\u30bf\u30a4\u30c8\u30eb<input name="title" value="${escapeHtml(title)}" required /></label>
              <label>\u672c\u6587<textarea name="body" rows="3">${escapeHtml(bodyText)}</textarea></label>
              <label>\u753b\u50cfURL<input name="image_url" value="${escapeHtml(imageUrl)}" /></label>
              <label>\u7aef\u672b\u304b\u3089\u753b\u50cf\u9078\u629e<input name="image_file" type="file" accept="image/*" /></label>
              <label>SNS/\u5916\u90e8URL<input name="url" value="${escapeHtml(externalUrl)}" /></label>
              <button class="primary" type="submit">\u66f4\u65b0</button>
            </form>
          </details>
          <button type="button" data-action="delete-news" data-news-id="${escapeHtml(post.id)}" data-news-url="${escapeHtml(externalUrl)}">\u524a\u9664</button>
        </div>
      ` : ""}
    </article>
  `;
}

async function viewNews() {
  const data = await loadMyData();
  const posts = data.newsPosts || [];
  applyUnreadNewsCount(data);
  state.unreadNewsCount = 0;
  markNewsRead(data.user.id, posts).catch((error) => { state.error = appErrorMessage(error); });
  return layout(html`
    <section class="page-head"><h1>NEWS</h1><p>\u30b8\u30e5\u30b8\u30e5\u304b\u3089\u306e\u304a\u77e5\u3089\u305b\u3092\u65b0\u3057\u3044\u9806\u306b\u8868\u793a\u3057\u307e\u3059\u3002</p></section>
    <section class="news-timeline">
      ${posts.length ? posts.map((post) => newsPostCard(post)).join("") : `<p class="empty">\u73fe\u5728\u8868\u793a\u3067\u304d\u308bNEWS\u306f\u3042\u308a\u307e\u305b\u3093\u3002</p>`}
    </section>
  `);
}

async function viewAdminNews() {
  const data = await loadAdminData(null, { includeUsers: false, includeActivity: false, includeCoupons: false, includePurchasePermissions: false, includeNews: true });
  const posts = data.newsPosts || [];
  return layout(html`
    ${adminModeBanner()}
    <section class="page-head"><h1>NEWS\u7ba1\u7406</h1><p>\u30a4\u30d9\u30f3\u30c8\u544a\u77e5\u3001SNS\u6295\u7a3f\u3001URL\u30ea\u30f3\u30af\u3092\u30e1\u30f3\u30d0\u30fc\u30ba\u30ab\u30fc\u30c9\u306eNEWS\u30bf\u30a4\u30e0\u30e9\u30a4\u30f3\u3078\u8ffd\u52a0\u3057\u307e\u3059\u3002</p></section>
    <section class="news-compose-grid">
      <form class="grid-form admin-form news-form news-compose-card" data-form="news-create">
        <input type="hidden" name="mode" value="article" />
        <h2>\u8a18\u4e8b\u3092\u4f5c\u6210</h2>
        <label>\u30bf\u30a4\u30c8\u30eb<input name="title" placeholder="\u30a4\u30d9\u30f3\u30c8\u540d\u3001\u6295\u7a3f\u30bf\u30a4\u30c8\u30eb\u306a\u3069" /></label>
        <label>\u672c\u6587<textarea name="body" rows="4" placeholder="\u544a\u77e5\u672c\u6587\u3002URL\u3060\u3051\u3067\u6295\u7a3f\u3059\u308b\u5834\u5408\u306f\u7a7a\u3067OK"></textarea></label>
        <label>\u753b\u50cfURL<input name="image_url" placeholder="https://...jpg" /></label>
        <label>\u7aef\u672b\u304b\u3089\u753b\u50cf\u9078\u629e<input name="image_file" type="file" accept="image/*" /></label>
        <label>SNS/\u5916\u90e8URL<input name="url" placeholder="X\u3001Instagram\u3001TikTok\u3001Web\u30da\u30fc\u30b8\u306a\u3069" /></label>
        <button class="primary" type="button" data-action="publish-news">NEWS\u3092\u516c\u958b</button>
      </form>
      <form class="grid-form admin-form news-form news-compose-card" data-form="news-url-create">
        <input type="hidden" name="mode" value="url" />
        <h2>URL\u3060\u3051\u3067\u6295\u7a3f</h2>
        <label>URL<input name="url" inputmode="url" placeholder="https://x.com/... \u306a\u3069" required /></label>
        <p class="form-note">SNS\u3084Web\u30da\u30fc\u30b8\u306eURL\u3060\u3051\u3092NEWS\u306b\u8ffd\u52a0\u3057\u307e\u3059\u3002\u8a18\u4e8b\u3092\u30bf\u30c3\u30d7\u3059\u308b\u3068\u5143\u30da\u30fc\u30b8\u3078\u79fb\u52d5\u3057\u307e\u3059\u3002</p>
        <button class="primary" type="button" data-action="publish-news">URL\u3092NEWS\u306b\u8ffd\u52a0</button>
      </form>
    </section>
    <section class="news-timeline admin-news-timeline">
      ${posts.length ? posts.map((post) => newsPostCard(post, true)).join("") : `<p class="empty">NEWS\u306f\u307e\u3060\u3042\u308a\u307e\u305b\u3093\u3002</p>`}
    </section>
  `, true);
}

function adminModeBanner() {
  return isDemoAdmin()
    ? `<div class="setup-warning"><strong>\u521d\u671f\u78ba\u8a8d\u7528\u306e\u7ba1\u7406\u30e2\u30fc\u30c9\u3067\u3059</strong><p>\u5b9f\u969b\u306b\u767b\u9332\u3057\u305f\u30e6\u30fc\u30b6\u30fc\u3092\u898b\u308b\u306b\u306f\u3001Supabase Auth\u3067\u30ed\u30b0\u30a4\u30f3\u3057\u305f\u30a2\u30ab\u30a6\u30f3\u30c8\u306e app_profiles.role \u3092 admin \u306b\u3057\u3066\u304f\u3060\u3055\u3044\u3002</p><button type="button" data-action="exit-demo-admin">\u78ba\u8a8d\u30e2\u30fc\u30c9\u3092\u7d42\u4e86\u3057\u3066\u5b9f\u30c7\u30fc\u30bf\u30ed\u30b0\u30a4\u30f3\u3078</button></div>`
    : "";
}

function visitLabel(type) {
  return type === "second_floor" ? "\u4e8c\u968e\u5e2d\u6765\u5e97" : "\u4e00\u968e\u5e2d\u6765\u5e97";
}

function pointLabel(type) {
  return {
    visit_1f: "\u4e00\u968e\u5e2d\u6765\u5e97",
    visit_2f: "\u4e8c\u968e\u5e2d\u6765\u5e97",
    sound_horror: "\u30b5\u30a6\u30f3\u30c9\u30db\u30e9\u30fc",
    special: "\u7279\u5225\u30dd\u30a4\u30f3\u30c8",
    coupon: "\u30af\u30fc\u30dd\u30f3",
    manual: "\u624b\u52d5\u8abf\u6574"
  }[type] || type || "\u30dd\u30a4\u30f3\u30c8";
}

function userLogTitle(log) {
  return log?.field_name === "username" ? "\u30e6\u30fc\u30b6\u30fc\u30cd\u30fc\u30e0\u5909\u66f4" : "\u30e6\u30fc\u30b6\u30fc\u60c5\u5831\u5909\u66f4";
}

function qrUrl(path) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=12&data=${encodeURIComponent(new URL(publicUrl(path), location.origin).href)}`;
}

function qrCard(title, path, note) {
  const target = new URL(publicUrl(path), location.origin).href;
  return `<article class="qr-card" data-action="open-qr-modal" data-qr-title="${encodeURIComponent(title)}" data-qr-path="${encodeURIComponent(path)}"><img src="${qrUrl(path)}" alt="${title} QR" /><div><h2>${title}</h2><p>${note}</p><code>${target}</code></div></article>`;
}

function qrModal(qr) {
  const title = qr.title || "QR";
  const path = qr.path || "/";
  const target = new URL(publicUrl(path), location.origin).href;
  return html`
    <div class="modal-backdrop" data-action="close-qr-modal">
      <section class="qr-modal">
        <div class="modal-head">
          <h2>QR拡大表示</h2>
          <button type="button" data-action="close-qr-modal">閉じる</button>
        </div>
        <img src="${qrUrl(path)}" alt="${title} QR" />
        <strong>${title}</strong>
        <code>${target}</code>
      </section>
    </div>
  `;
}

const analyticsLabels = {
  gender: "性別割合",
  age: "年齢分布",
  horror: "サウンドホラー利用回数",
  rank: "ランク帯分布"
};
const analyticsColors = ["#d8b65c", "#8fb89b", "#b36b6b", "#7f89b8", "#b08ab8", "#9f8a68", "#d7d0ba"];

function adminAnalyticsSegments(data, mode) {
  const users = data.users || [];
  const rankPointsByUser = Object.fromEntries(users.map((user) => [user.id, Number(user.rank_points ?? 0)]));
  if (!users.length) return [{ label: "登録者なし", value: 1, empty: true }];
  if (mode === "gender") {
    return bucketSegments(users, (user) => user.gender || "未回答");
  }
  if (mode === "age") {
    return bucketSegments(users, (user) => ageBand(user.age));
  }
  if (mode === "horror") {
    const listenCountByUser = countBy(data.listens || [], "user_id");
    return bucketSegments(users, (user) => {
      const count = listenCountByUser[user.id] || Number(user.sound_horror_listen_count || 0);
      if (count >= 5) return "5回以上";
      return `${count}回`;
    }, ["0回", "1回", "2回", "3回", "4回", "5回以上"]);
  }
  return bucketSegments(users, (user) => {
    const rank = rankFor(rankPointsByUser[user.id] || 0);
    return `ランク${rank.n}`;
  }, ranks.map((rank) => `ランク${rank.n}`));
}

function bucketSegments(items, pick, order = null) {
  const counts = items.reduce((acc, item) => {
    const label = pick(item);
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});
  const labels = order || Object.keys(counts);
  const segments = labels.map((label) => ({ label, value: counts[label] || 0 })).filter((segment) => segment.value > 0);
  return segments.length ? segments : [{ label: "データなし", value: 1, empty: true }];
}

function ageBand(age) {
  const value = Number(age);
  if (!value) return "未回答";
  if (value < 20) return "10代";
  if (value < 30) return "20代";
  if (value < 40) return "30代";
  if (value < 50) return "40代";
  if (value < 60) return "50代";
  return "60代以上";
}

function pieChart(segments) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  let cursor = 0;
  const stops = segments.map((segment, index) => {
    const start = cursor;
    cursor += (segment.value / total) * 100;
    const color = segment.empty ? "#403b32" : analyticsColors[index % analyticsColors.length];
    return `${color} ${start}% ${cursor}%`;
  }).join(", ");
  return html`
    <div class="analytics-chart" style="--pie:${stops}">
      <div class="pie"></div>
      <div class="pie-legend">
        ${segments.map((segment, index) => `<span><i style="background:${segment.empty ? "#403b32" : analyticsColors[index % analyticsColors.length]}"></i>${segment.label}<strong>${segment.empty ? 0 : segment.value}</strong></span>`).join("")}
      </div>
    </div>
  `;
}

async function viewAdminDashboard() {
  const data = await loadAdminData(null, { includeActivity: false, includeCoupons: false, includePurchasePermissions: false });
  const mode = state.analyticsMode || "gender";
  const segments = adminAnalyticsSegments(data, mode);
  return layout(html`
    ${adminModeBanner()}
    <section class="page-head"><h1>管理</h1><p>admin権限だけが登録者全員の情報を扱えます。</p></section>
    <section class="list-section analytics-panel">
      <div class="section-head">
        <h2>登録者分析</h2>
        <div class="segmented">
          ${Object.entries(analyticsLabels).map(([key, label]) => `<button type="button" class="${mode === key ? "active" : ""}" data-action="analytics-mode" data-mode="${key}">${label}</button>`).join("")}
        </div>
      </div>
      ${pieChart(segments)}
    </section>
  `, true);
}

async function viewAdminUsers() {
  const data = await loadAdminData(null, { includeActivity: false, includeCoupons: false, includePurchasePermissions: false });
  const query = (state.adminUserSearch || "").trim().toLowerCase();
  const users = query ? data.users.filter((user) => adminUserMatches(user, query)) : data.users;
  return layout(html`
    ${adminModeBanner()}
    <section class="page-head"><h1>登録者一覧</h1><p>本名、誕生日、性別、年齢を含むため /admin と RLS で保護します。</p></section>
    <form class="admin-search" data-form="admin-user-search">
      <label>登録者検索<input name="query" value="${state.adminUserSearch || ""}" placeholder="名前、誕生日、ユーザーネーム、会員番号、メール" /></label>
      <button class="primary" type="submit">検索</button>
    </form>
    <section class="table-wrap">
      <table>
        <thead><tr><th>会員番号</th><th>本名</th><th>ユーザーネーム</th><th>性別</th><th>年齢</th><th>ランクpt</th><th>詳細</th></tr></thead>
        <tbody>${users.map((u) => `<tr><td>${u.member_number}</td><td>${u.real_name}</td><td>${u.username}</td><td>${u.gender}</td><td>${u.age}</td><td>${u.rank_points ?? 0}</td><td><button data-link="/admin/users/${u.id}">開く</button></td></tr>`).join("")}</tbody>
      </table>
      ${users.length ? "" : `<p class="empty">条件に合う登録者はいません。</p>`}
    </section>
  `, true);
}

function adminUserMatches(user, query) {
  return [
    user.member_number,
    user.real_name,
    user.username,
    user.email,
    user.birthday,
    monthDayDate(user.birthday),
    user.gender,
    String(user.age || "")
  ].some((value) => String(value || "").toLowerCase().includes(query));
}

async function viewAdminUserDetail() {
  const userId = appPath().split("/").pop();
  const data = await loadAdminData(userId);
  const user = data.users[0];
  if (!user) {
    return layout(`${adminModeBanner()}<section class="empty-state">登録者が見つかりません。</section>`, true);
  }
  const points = sumRankPoints(data.pointEvents);
  const rank = rankFor(points);
  const listensByHorror = countBy(data.listens, "sound_horror_id");
  const purchasePermission = purchasePermissionFor(user, rank, data.purchasePermissions || []);
  return layout(html`
    ${adminModeBanner()}
    <section class="page-head"><h1>${user.real_name}</h1><p>${user.member_number} / ${user.username}</p></section>
    <section class="detail-grid">
      <div><span>メール</span><strong>${user.email || "-"}</strong></div>
      <div><span>誕生日</span><strong>${yenDate(user.birthday)}</strong></div>
      <div><span>性別</span><strong>${user.gender}</strong></div>
      <div><span>年齢</span><strong>${user.age}</strong></div>
      <div><span>ランク</span><strong>${rank.name}</strong></div>
      <div><span>ランクポイント</span><strong>${points} pt</strong></div>
      <div><span>呪物購入資格</span><strong>${purchasePermission.allowed ? "あり" : "なし"}</strong></div>
      <div><span>一階席</span><strong>${data.visits.filter((v) => v.visit_type === "first_floor").length}</strong></div>
      <div><span>二階席</span><strong>${data.visits.filter((v) => v.visit_type === "second_floor").length}</strong></div>
      <div><span>総体験</span><strong>${data.listens.length}</strong></div>
      <div><span>制覇作品数</span><strong>${Object.keys(listensByHorror).length}</strong></div>
    </section>
    <section class="list-section purchase-admin-panel"><h2>呪物購入資格刻印</h2>
      <p>${purchasePermission.allowed ? "この会員は店内呪物を購入できる資格を持っています。" : "ランク5未満で、手動刻印もありません。"}</p>
      <form class="grid-form admin-form compact" data-form="purchase-permission">
        <input type="hidden" name="user_id" value="${user.id}" />
        <label>付与メモ<input name="memo" placeholder="例外対応、店頭判断など" /></label>
        <button class="primary" type="submit">低ランクでも刻印を付与</button>
      </form>
      ${purchasePermission.manual ? `<button type="button" data-action="revoke-purchase-permission" data-user-id="${user.id}">手動刻印を解除</button>` : ""}
    </section>
    <section class="list-section"><h2>ポイント没収</h2>
      <form class="grid-form admin-form compact" data-form="point-revoke">
        <input type="hidden" name="user_id" value="${user.id}" />
        <label>没収ポイント<input name="point_value" type="number" min="0.5" step="0.5" required placeholder="0.5刻み" /></label>
        <label>メモ<input name="memo" placeholder="誤付与修正など" /></label>
        <button class="primary" type="submit">ポイントを没収</button>
      </form>
    </section>
    <section class="list-section"><h2>保有クーポン</h2>
      ${data.coupons.length ? data.coupons.map((item) => `<article class="item coupon-grant-row"><div><strong>${item.coupons?.title || "クーポン"}</strong><span>${item.coupons?.description || ""}</span><small>${couponStatusLabel(item.status)} / ${yenDate(item.issued_at)}</small></div><button type="button" data-action="delete-granted-coupon" data-user-coupon-id="${item.id}">削除</button></article>`).join("") : `<p class="empty">この会員のクーポンはありません。</p>`}
    </section>
    <section class="list-section history-box"><h2>来店履歴</h2><div class="history-scroll">${data.visits.length ? data.visits.map((visit) => `<article class="item"><strong>${visitLabel(visit.visit_type)} / ${visit.point_value}pt</strong><span>${yenDate(visit.visited_at)}</span></article>`).join("") : `<p class="empty">来店履歴はまだありません。</p>`}</div></section>
    <section class="list-section history-box"><h2>ポイント履歴</h2><div class="history-scroll">${data.pointEvents.map((p) => `<article class="item"><strong>${p.point_type} / ${p.point_value}pt</strong><span>${p.memo || ""}</span><small>${yenDate(p.created_at)}</small></article>`).join("")}</div></section>
    <section class="list-section history-box"><h2>ユーザーログ</h2><div class="history-scroll">${(data.userLogs || []).length ? data.userLogs.map((log) => `<article class="item"><strong>${userLogTitle(log)}</strong><span>${escapeHtml(log.old_value || "-")} → ${escapeHtml(log.new_value || "-")}</span><small>${yenDate(log.changed_at)}</small></article>`).join("") : `<p class="empty">ユーザー情報の編集履歴はまだありません。</p>`}</div></section>
  `, true);
}

async function viewAdminVisits() {
  const data = await loadAdminData(null, { includeCoupons: false, includePurchasePermissions: false });
  const userById = Object.fromEntries((data.users || []).map((user) => [user.id, user]));
  return layout(html`
    ${adminModeBanner()}
    <section class="page-head"><h1>来店履歴・ポイント履歴</h1><p>登録者の来店、サウンドホラー体験、特別ポイントを確認する画面です。</p></section>
    <section class="split-lists">
      <div class="list-section history-box">
        <h2>来店履歴</h2>
        <div class="history-scroll">${data.visits.length ? data.visits.map((visit) => `<article class="item"><strong>${visitLabel(visit.visit_type)} / ${visit.point_value}pt</strong><span>${userById[visit.user_id]?.member_number || visit.user_id || "-"} ${userById[visit.user_id]?.real_name || ""}</span><small>${yenDate(visit.visited_at)}</small></article>`).join("") : `<p class="empty">来店履歴はまだありません。</p>`}</div>
      </div>
      <div class="list-section history-box">
        <h2>ポイント履歴</h2>
        <div class="history-scroll">${data.pointEvents.length ? data.pointEvents.map((point) => `<article class="item"><strong>${pointLabel(point.point_type)} / ${point.point_value}pt</strong><span>${userById[point.user_id]?.member_number || point.user_id || "-"} ${point.memo || ""}</span><small>${yenDate(point.created_at)}</small></article>`).join("") : `<p class="empty">ポイント履歴はまだありません。</p>`}</div>
      </div>
    </section>
  `, true);
}

async function viewAdminQr() {
  const rawHorrors = supabase && !isDemoAdmin()
    ? await supabase.from("sound_horrors").select("*").eq("is_active", true).order("title").then((result) => {
        if (result.error) throw result.error;
        return result.data || [];
      })
    : demoSoundHorrors;
  const horrors = currentSoundHorrors(rawHorrors);
  const missingHorrors = soundHorrorTitles.filter((title) => !rawHorrors.some((horror) => horror.title === title));
  return layout(html`
    ${adminModeBanner()}
    <section class="page-head"><h1>店舗QR表示</h1><p>スタッフが店頭で提示するQRです。お客さんが読み取ると、ログイン後に本人の履歴として記録されます。</p></section>
    ${missingHorrors.length && supabase && !isDemoAdmin() ? `<p class="notice error admin-only-notice">Supabase側に未登録のサウンドホラーがあります。schema.sql を再実行して作品一覧を更新してください: ${missingHorrors.join(" / ")}</p>` : ""}
    <section class="qr-grid">
      ${qrCard("一階席来店", "/qr/visit?type=first_floor", "1pt / 1日合計2回まで")}
      ${qrCard("二階席来店", "/qr/visit?type=second_floor", "1.5pt / 1日合計2回まで")}
      ${horrors.map((horror) => qrCard(`サウンドホラー: ${horror.title}`, `/qr/sound-horror/${horror.id}`, "2pt / 同じ作品でも毎回記録")).join("")}
      ${specialExperiences.map((experience) => qrCard(`体験サービス: ${experience.title}`, `/qr/special/${experience.code}`, `${experience.point}pt / 会員管理用ポイント履歴に記録`)).join("")}
    </section>
    ${state.qrModal ? qrModal(state.qrModal) : ""}
  `, true);
}

async function viewAdminPoints() {
  const data = await loadAdminData(null, { includeActivity: false, includeCoupons: false, includePurchasePermissions: false });
  return layout(html`
    ${adminModeBanner()}
    <section class="page-head"><h1>特別ポイント付与</h1><p>admin権限を持つアカウントだけが実行できます。</p></section>
    <form class="grid-form admin-form" data-form="special-point">
      <label>対象ユーザー<select name="user_id" required>${data.users.map((u) => `<option value="${u.id}">${u.member_number} / ${u.real_name}</option>`).join("")}</select></label>
      <label>ポイント名<input name="point_name" required placeholder="おまじない体験コース" /></label>
      <label>ポイント数<input name="point_value" type="number" min="0.5" step="0.5" required /></label>
      <label class="check"><input name="rank_affects" type="checkbox" checked /> ランク反映</label>
      <label>メモ<textarea name="memo" rows="3"></textarea></label>
      <button class="primary">付与する</button>
    </form>
  `, true);
}

async function viewAdminCoupons() {
  const data = await loadAdminData(null, { includeActivity: false, includePurchasePermissions: false });
  const coupons = data.coupons || [];
  return layout(html`
    ${adminModeBanner()}
    <section class="page-head"><h1>\u30af\u30fc\u30dd\u30f3\u7ba1\u7406</h1><p>\u30af\u30fc\u30dd\u30f3\u306e\u4f5c\u6210\u3001QR\u8868\u793a\u3001\u4f1a\u54e1\u3078\u306e\u76f4\u63a5\u4ed8\u4e0e\u3092\u884c\u3044\u307e\u3059\u3002</p></section>
    <form class="grid-form admin-form" data-form="coupon-create">
      <label>\u30af\u30fc\u30dd\u30f3\u30bf\u30a4\u30c8\u30eb<input name="title" required placeholder="\u4f1a\u54e1\u767b\u9332\u30ad\u30e3\u30f3\u30da\u30fc\u30f3\u30af\u30fc\u30dd\u30f3" /></label>
      <label>\u5185\u5bb9\u8aac\u660e<textarea name="description" rows="3" required placeholder="\u30b5\u30a6\u30f3\u30c9\u30db\u30e9\u30fc\u4e00\u56de\u7121\u6599\uff08\uffe51,000\u4f5c\u54c1\u306e\u307f\u5bfe\u8c61\uff09"></textarea></label>
      <label>\u4f7f\u7528\u671f\u9650<input name="expires_at" type="date" /></label>
      <button class="primary">\u30af\u30fc\u30dd\u30f3\u3092\u4f5c\u6210</button>
    </form>
    <form class="grid-form admin-form" data-form="coupon-grant">
      <label>\u5bfe\u8c61\u30e6\u30fc\u30b6\u30fc<select name="user_id" required>${(data.users || []).map((u) => `<option value="${u.id}">${u.member_number} / ${u.real_name}</option>`).join("")}</select></label>
      <label>\u4ed8\u4e0e\u30af\u30fc\u30dd\u30f3<select name="coupon_id" required>${coupons.map((c) => `<option value="${c.id}">${c.title}</option>`).join("")}</select></label>
      <button class="primary">\u4f1a\u54e1\u306b\u76f4\u63a5\u4ed8\u4e0e</button>
    </form>
    <section class="list-section">
      <h2>\u4f5c\u6210\u6e08\u307f\u30af\u30fc\u30dd\u30f3</h2>
      ${coupons.length ? coupons.map((c) => `<article class="coupon-admin-item" data-action="open-qr-modal" data-qr-title="${encodeURIComponent(`\u30af\u30fc\u30dd\u30f3: ${c.title}`)}" data-qr-path="${encodeURIComponent(`/qr/coupon/${c.id}`)}"><div><strong>${c.title}</strong><span>${c.description || ""}</span><small>${c.expires_at ? yenDate(c.expires_at) : "\u7121\u671f\u9650"}</small><code>${new URL(publicUrl(`/qr/coupon/${c.id}`), location.origin).href}</code><button type="button" data-action="delete-created-coupon" data-coupon-id="${c.id}">\u524a\u9664</button></div><img src="${qrUrl(`/qr/coupon/${c.id}`)}" alt="${c.title} QR" /></article>`).join("") : `<p class="empty">\u767b\u9332\u6e08\u307f\u30af\u30fc\u30dd\u30f3\u306f\u3042\u308a\u307e\u305b\u3093\u3002</p>`}
    </section>
    ${state.qrModal ? qrModal(state.qrModal) : ""}
  `, true);
}

function calendarAdminForm(calendarImage = "") {
  return html`
    <form id="calendar" class="grid-form admin-form calendar-admin-form" data-form="calendar-image">
      <div>
        <h2>\u55b6\u696d\u65e5\u30ab\u30ec\u30f3\u30c0\u30fc</h2>
        <p>\u4f1a\u54e1\u5074\u306e\u30ab\u30ec\u30f3\u30c0\u30fc\u30a2\u30a4\u30b3\u30f3\u304b\u3089\u8868\u793a\u3055\u308c\u308b\u753b\u50cf\u3092\u66f4\u65b0\u3057\u307e\u3059\u3002</p>
      </div>
      <label>\u753b\u50cf\u3092\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9<input name="calendar_file" type="file" accept="image/*" required /></label>
      ${calendarImage ? `<img class="calendar-admin-preview" src="${calendarImage}" alt="\u73fe\u5728\u306e\u55b6\u696d\u65e5\u30ab\u30ec\u30f3\u30c0\u30fc" />` : `<p class="form-note">\u307e\u3060\u30ab\u30ec\u30f3\u30c0\u30fc\u753b\u50cf\u306f\u767b\u9332\u3055\u308c\u3066\u3044\u307e\u305b\u3093\u3002</p>`}
      <button class="primary">\u30ab\u30ec\u30f3\u30c0\u30fc\u3092\u66f4\u65b0</button>
    </form>
  `;
}

async function viewAdminCalendar() {
  const calendarImage = await loadCalendarImage();
  return layout(html`
    ${adminModeBanner()}
    <section class="page-head"><h1>\u30ab\u30ec\u30f3\u30c0\u30fc\u7ba1\u7406</h1><p>\u4f1a\u54e1\u5074\u306b\u8868\u793a\u3059\u308b\u55b6\u696d\u65e5\u30ab\u30ec\u30f3\u30c0\u30fc\u3092\u66f4\u65b0\u3057\u307e\u3059\u3002</p></section>
    ${calendarAdminForm(calendarImage)}
  `, true);
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1;
    return acc;
  }, {});
}

async function render() {
  try {
    const path = appPath();
    if (path.startsWith("/admin") || isAdminLaunchQuery()) rememberAdminApp();
    if (isAdminLaunchQuery() && !path.startsWith("/admin")) {
      replacePath("/admin/login");
      paintShell(viewAdminLogin());
      return;
    }
    if (path === "/" || path === "/login") paintShell(await viewLogin());
    else if (path === "/admin/login") paintShell(viewAdminLogin());
    else if (path === "/register") paintShell(viewRegister());
    else if (path === "/complete-profile") paintShell(await viewCompleteProfile());
    else if (path === "/member-card") paintShell(await viewMemberCard());
    else if (path === "/scan") paintShell(viewScan());
    else if (path === "/coupons") paintShell(await viewCoupons());
    else if (path === "/news") paintShell(await viewNews());
    else if (path === "/contact") paintShell(viewContact());
    else if (path === "/qr/visit") paintShell(await viewQrVisit());
    else if (path.startsWith("/qr/sound-horror/")) paintShell(await viewQrSound());
    else if (path.startsWith("/qr/special/")) paintShell(await viewQrSpecial());
    else if (path.startsWith("/qr/coupon/")) paintShell(await viewQrCoupon());
    else if (path === "/settings") paintShell(viewSettings());
    else if (path === "/special-cards") paintShell(viewSpecialCards());
    else if (path === "/admin" || path === "/admin/dashboard") paintShell(await viewAdminDashboard());
    else if (path === "/admin/users") paintShell(await viewAdminUsers());
    else if (path.startsWith("/admin/users/")) paintShell(await viewAdminUserDetail());
    else if (path === "/admin/visits") paintShell(await viewAdminVisits());
    else if (path === "/admin/points") paintShell(await viewAdminPoints());
    else if (path === "/admin/qr") paintShell(await viewAdminQr());
    else if (path === "/admin/coupons") paintShell(await viewAdminCoupons());
    else if (path === "/admin/calendar") paintShell(await viewAdminCalendar());
    else if (path === "/admin/news") paintShell(await viewAdminNews());
    else paintShell(layout(`<section class="empty-state">ページが見つかりません。</section>`));
  } catch (error) {
    state.error = appErrorMessage(error);
    if (appPath().startsWith("/admin")) {
      paintShell(layout(`<section class="empty-state"><h1>アクセス拒否</h1><p>${state.error}</p><button data-link="/admin/login">スタッフログインへ</button></section>`, true));
    } else {
      paintShell(await viewLogin());
    }
  }
}

function paintShell(markup) {
  app.innerHTML = markup;
  if (appPath() === "/scan" && localStorage.getItem(QR_CAMERA_ALLOWED_STORAGE) === "true" && !qrScanning) {
    setTimeout(() => {
      if (appPath() === "/scan" && !qrScanning) startQrScanner();
    }, 80);
  }
}

function startIconCropDrag(event, stage = event.currentTarget) {
  if (!state.iconEditor) return;
  event.preventDefault();
  iconDrag = {
    rect: stage.getBoundingClientRect(),
    startX: event.clientX,
    startY: event.clientY,
    x: state.iconEditor.x,
    y: state.iconEditor.y
  };
  stage.setPointerCapture?.(event.pointerId);
}

function moveIconCropDrag(event) {
  if (!iconDrag || !state.iconEditor) return;
  const x = Math.min(100, Math.max(0, iconDrag.x - ((event.clientX - iconDrag.startX) / iconDrag.rect.width) * 100));
  const y = Math.min(100, Math.max(0, iconDrag.y - ((event.clientY - iconDrag.startY) / iconDrag.rect.height) * 100));
  state = { ...state, iconEditor: { ...state.iconEditor, x, y } };
  const stage = document.querySelector(".icon-crop-stage");
  if (stage) {
    stage.style.setProperty("--icon-x", `${x}%`);
    stage.style.setProperty("--icon-y", `${y}%`);
  }
}

function endIconCropDrag() {
  iconDrag = null;
  if (state.iconEditor) render();
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-link]");
  if (link) {
    event.preventDefault();
    navigate(link.dataset.link);
    return;
  }
  const action = event.target.closest("[data-action]");
  if (!action) return;
  if (action.dataset.action === "logout") signOut();
  if (action.dataset.action === "exit-demo-admin") exitDemoAdmin();
  if (action.dataset.action === "login-user") handleLogin(event);
  if (action.dataset.action === "admin-login") handleAdminLogin(event);
  if (action.dataset.action === "save-config") handleConfig(event);
  if (action.dataset.action === "register-member") handleRegister(event);
  if (action.dataset.action === "complete-profile") handleCompleteProfile(event);
  if (action.dataset.action === "open-relic-picker") {
    state = { ...state, relicPicker: true };
    render();
  }
  if (action.dataset.action === "close-relic-picker") {
    if (event.target.closest(".relic-modal") && !event.target.closest("button")) return;
    state = { ...state, relicPicker: false };
    render();
  }
  if (action.dataset.action === "favorite-relic") setFavoriteRelic(action.dataset.relicId, action.dataset.relicName);
  if (action.dataset.action === "open-username-editor") {
    loadMyData().then((data) => {
      const rank = rankFor(sumRankPoints(data.pointEvents));
      markUsernameFontsSeen(data.user, rank);
      state = { ...state, usernameEditor: "name" };
      render();
    }).catch((error) => {
      state = { ...state, error: appErrorMessage(error) };
      render();
    });
  }
  if (action.dataset.action === "close-username-editor") {
    if (event.target !== action && !event.target.closest('[data-action="close-username-editor"]')) return;
    state = { ...state, usernameEditor: null };
    render();
  }
  if (action.dataset.action === "show-username-fonts") {
    loadMyData().then((data) => {
      const rank = rankFor(sumRankPoints(data.pointEvents));
      markUsernameFontsSeen(data.user, rank);
      state = { ...state, usernameEditor: "font" };
      render();
    }).catch((error) => {
      state = { ...state, error: appErrorMessage(error) };
      render();
    });
  }
  if (action.dataset.action === "set-username-font") setUsernameFont(action.dataset.fontId);
  if (action.dataset.action === "open-calendar-modal") {
    state = { ...state, calendarOpen: true };
    render();
  }
  if (action.dataset.action === "close-calendar-modal") {
    if (event.target !== action && !event.target.closest('[data-action="close-calendar-modal"]')) return;
    state = { ...state, calendarOpen: false };
    render();
  }
  if (action.dataset.action === "open-coupon") {
    state = { ...state, selectedCouponId: action.dataset.couponId };
    render();
  }
  if (action.dataset.action === "close-coupon") {
    if (event.target.closest(".coupon-modal") && !event.target.closest("button")) return;
    state = { ...state, selectedCouponId: "" };
    render();
  }
  if (action.dataset.action === "use-coupon") useCoupon(action.dataset.couponId);
  if (action.dataset.action === "claim-coupon") claimCoupon(action.dataset.couponId);
  if (action.dataset.action === "delete-granted-coupon") deleteGrantedCoupon(action.dataset.userCouponId);
  if (action.dataset.action === "delete-created-coupon") deleteCreatedCoupon(action.dataset.couponId);
  if (action.dataset.action === "save-card-image") saveMemberCardImage();
  if (action.dataset.action === "revoke-purchase-permission") revokePurchasePermission(action.dataset.userId);
  if (action.dataset.action === "delete-news") deleteNewsPost(action.dataset.newsId, action.dataset.newsUrl || "");
  if (action.dataset.action === "publish-news") {
    event.preventDefault();
    createNewsPost(action.closest("form"), action);
  }
  if (action.dataset.action === "open-purchase-seal") {
    state = { ...state, purchaseSealOpen: true };
    render();
  }
  if (action.dataset.action === "close-purchase-seal") {
    if (event.target.closest(".purchase-seal-modal")) return;
    state = { ...state, purchaseSealOpen: false };
    render();
  }
  if (action.dataset.action === "start-qr-scanner") startQrScanner();
  if (action.dataset.action === "stop-qr-scanner") stopQrScanner();
  if (action.dataset.action === "open-qr-modal") {
    state = {
      ...state,
      qrModal: {
        title: decodeURIComponent(action.dataset.qrTitle || "QR"),
        path: decodeURIComponent(action.dataset.qrPath || "/")
      }
    };
    render();
  }
  if (action.dataset.action === "close-qr-modal") {
    if (event.target.closest(".qr-modal") && !event.target.closest("button")) return;
    state = { ...state, qrModal: null };
    render();
  }
  if (action.dataset.action === "analytics-mode") {
    state = { ...state, analyticsMode: action.dataset.mode || "gender" };
    render();
  }
  if (action.dataset.action === "close-icon-editor") {
    if (event.target.closest(".icon-editor-modal") && !event.target.closest("button")) return;
    state = { ...state, iconEditor: null };
    render();
  }
  if (action.dataset.action === "save-cropped-icon") saveCroppedIcon();
  if (action.dataset.action === "flip-card") {
    if (event.target.closest("[data-no-flip], .avatar, .favorite-relic-badge, .profile-controls, .username-button")) return;
    action.classList.toggle("is-flipped");
  }
  if (action.dataset.action === "record-visit") recordVisit(action.dataset.type);
  if (action.dataset.action === "record-sound") recordSoundHorror(action.dataset.id);
  if (action.dataset.action === "record-special") recordSpecialExperience(action.dataset.code);
});

document.addEventListener("change", (event) => {
  if (event.target.matches('[data-action="birthday"]')) toggleBirthday(event.target.checked);
  if (event.target.matches('[data-action="icon-upload"]')) updateIcon(event.target.files?.[0]);
  if (event.target.matches('[data-action="icon-crop-x"]')) setIconEditorValue("x", event.target.value);
  if (event.target.matches('[data-action="icon-crop-y"]')) setIconEditorValue("y", event.target.value);
  if (event.target.matches('[data-action="icon-crop-zoom"]')) setIconEditorValue("zoom", event.target.value);
});

document.addEventListener("pointerdown", (event) => {
  const dragTarget = event.target.closest('[data-action="icon-crop-drag"]');
  if (dragTarget) startIconCropDrag(event, dragTarget);
});

document.addEventListener("pointermove", moveIconCropDrag);
document.addEventListener("pointerup", endIconCropDrag);
document.addEventListener("pointercancel", endIconCropDrag);

document.addEventListener("submit", (event) => {
  const form = event.target.dataset.form;
  if (!form) return;
  event.preventDefault();
  if (form === "login") handleLogin(event);
  if (form === "admin-login") handleAdminLogin(event);
  if (form === "register") handleRegister(event);
  if (form === "complete-profile") handleCompleteProfile(event);
  if (form === "config") handleConfig(event);
  if (form === "special-point") grantSpecialPoint(event);
  if (form === "point-revoke") revokeUserPoints(event);
  if (form === "coupon-create") createCoupon(event);
  if (form === "coupon-grant") grantCoupon(event);
  if (form === "calendar-image") updateCalendarImage(event);
  if (form === "username-update") updateUsername(event);
  if (form === "purchase-permission") grantPurchasePermission(event);
  if (form === "news-create" || form === "news-url-create") createNewsPost(event.currentTarget, event.submitter);
  if (form === "news-edit") updateNewsPost(event);
  if (form === "admin-user-search") handleAdminUserSearch(event);
});

window.addEventListener("popstate", () => {
  stopQrScanner();
  state = { ...state, message: "", error: "" };
  render();
});
if ("serviceWorker" in navigator) {
  let refreshingForUpdate = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshingForUpdate) return;
    refreshingForUpdate = true;
    location.reload();
  });
  navigator.serviceWorker.register(publicUrl("/sw.js")).then((registration) => {
    registration.update?.();
    if (registration.waiting) registration.waiting.postMessage({ type: "SKIP_WAITING" });
    registration.addEventListener("updatefound", () => {
      const worker = registration.installing;
      worker?.addEventListener("statechange", () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller) {
          worker.postMessage({ type: "SKIP_WAITING" });
        }
      });
    });
  }).catch(() => {});
}
await initSupabase();
render();
