const ranks = [
  { n: 1, name: "迷い人", min: 1, max: 5 },
  { n: 2, name: "常連の気配", min: 5.5, max: 10.5 },
  { n: 3, name: "好事家", min: 11, max: 16.5 },
  { n: 4, name: "呪物愛好家", min: 17, max: 23.5 },
  { n: 5, name: "呪物収集家", min: 24, max: 38.5 },
  { n: 6, name: "呪物倉庫付き学芸員", min: 39, max: 68.5 },
  { n: 7, name: "呪物博士", min: 69, max: null }
];

const demoSoundHorrors = [
  { id: "demo-1", title: "腹話術人形まぁくん" },
  { id: "demo-2", title: "岩塩仏" },
  { id: "demo-3", title: "お母さん役の操り人形" },
  { id: "demo-4", title: "遺棄された黒電話" },
  { id: "demo-5", title: "病呑守り" },
  { id: "demo-6", title: "坑内馬の蹄鉄" }
];
const soundHorrorTitles = demoSoundHorrors.map((horror) => horror.title);
const currentSoundHorrors = (horrors = []) =>
  soundHorrorTitles
    .map((title) => horrors.find((horror) => horror.title === title) || demoSoundHorrors.find((horror) => horror.title === title))
    .filter(Boolean);
const specialExperiences = [
  { code: "sange-box", title: "さんげの箱", point: 3 }
];
const contactInfo = {
  phone: "03-5913-8428",
  email: "obakendesk@gmail.com",
  address: "〒168-0062 東京都杉並区方南2-4-27",
  hp: "https://obaken-event.wixsite.com/cafe-joujou"
};

const welcomeCoupon = {
  title: "会員登録キャンペーンクーポン",
  description: "サウンドホラー一回無料（￥1,000作品のみ対象）"
};
const relicCatalog = [
  { id: "local-byoudon-mamori", name: "病呑守り", image: "assets/relics/byoudon-mamori.jpg" },
  { id: "local-sange-box", name: "さんげの箱", image: "assets/relics/sange-box.jpg" },
  { id: "local-ganenbutsu", name: "岩塩仏", image: "assets/relics/ganenbutsu.jpg" },
  { id: "local-black-phone", name: "遺棄された黒電話", image: "assets/relics/black-phone.jpg" },
  { id: "local-mother-puppet", name: "お母さん役の操り人形", image: "assets/relics/mother-puppet.jpg" },
  { id: "local-horseshoe", name: "坑内馬の蹄鉄", image: "assets/relics/horseshoe.jpg" }
];
const relicImageByHorrorTitle = Object.fromEntries(relicCatalog.map((relic) => [relic.name, relic.image]));

const demo = {
  profile: { role: "user" },
  user: {
    id: "demo-user",
    auth_user_id: "demo-auth",
    member_number: "JUJU-000001",
    real_name: "山田 太郎",
    username: "juju_guest",
    email: "demo@example.com",
    birthday: "1996-08-13",
    birthday_visible: true,
    age: 29,
    gender: "回答しない",
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
const NEWS_LOCAL_STORAGE = "JUJU_LOCAL_NEWS_POSTS";
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
  state = { busy: false, message: "デモ管理モードを終了しました。実データを見るには staff/admin のSupabaseログインを使ってください。", error: "" };
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
      const newsPosts = await optionalQuery(supabase.from("news_posts").select("*").order("published_at", { ascending: false }).limit(100));
      data.newsPosts = mergeNewsPosts(newsPosts.data || []);
    } else if (options.includeNews === true) {
      data.newsPosts = mergeNewsPosts(data.newsPosts || []);
    }
    return userId ? { ...data, users: data.users.filter((user) => user.id === userId) } : data;
  }

  if (!supabase) {
    throw new Error("管理画面を確認するには、デモ用スタッフログインを行うか Supabase に接続してください。");
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
  if (!current) throw new Error("スタッフログインが必要です。");
  const { data: profile, error: profileError } = await supabase
    .from("app_profiles")
    .select("role")
    .eq("auth_user_id", current.user.id)
    .single();
  if (profileError) throw profileError;
  if (!["staff", "admin"].includes(profile?.role)) throw new Error("スタッフ権限がありません。");

  const usersQuery = supabase.from("admin_user_summaries").select("*").order("created_at", { ascending: false });
  const includeNews = options.includeNews === true;
  const [users, visits, listens, points, coupons, purchasePermissions, newsPosts] = await Promise.all([
    userId ? supabase.from("users").select("*").eq("id", userId).single() : usersQuery,
    userId ? supabase.from("visits").select("*").eq("user_id", userId).order("visited_at", { ascending: false }) : supabase.from("visits").select("*").order("visited_at", { ascending: false }).limit(200),
    userId ? supabase.from("sound_horror_listens").select("*, sound_horrors(title)").eq("user_id", userId).order("listened_at", { ascending: false }) : supabase.from("sound_horror_listens").select("*").order("listened_at", { ascending: false }).limit(200),
    userId ? supabase.from("point_events").select("*").eq("user_id", userId).order("created_at", { ascending: false }) : supabase.from("point_events").select("*").order("created_at", { ascending: false }).limit(200),
    userId ? supabase.from("user_coupons").select("*, coupons(*)").eq("user_id", userId) : supabase.from("coupons").select("*").order("created_at", { ascending: false }),
    optionalQuery(userId ? supabase.from("user_purchase_permissions").select("*").eq("user_id", userId).eq("is_active", true) : supabase.from("user_purchase_permissions").select("*").eq("is_active", true)),
    includeNews ? optionalQuery(supabase.from("news_posts").select("*").order("published_at", { ascending: false }).limit(100)) : Promise.resolve({ data: [] })
  ]);

  for (const result of [users, visits, listens, points, coupons, purchasePermissions, newsPosts]) {
    if (result.error) throw result.error;
  }
  return { users: userId ? [users.data] : users.data, visits: visits.data, listens: listens.data, pointEvents: points.data, coupons: coupons.data, purchasePermissions: purchasePermissions.data || [], newsPosts: includeNews ? mergeNewsPosts(newsPosts.data || []) : [] };
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
  const form = new FormData(formElement);
  const staffId = String(form.get("staff_id") || "").trim();
  const password = String(form.get("password") || "").trim();

  if (staffId === ADMIN_DEMO_ID && password === ADMIN_DEMO_PASSWORD) {
    localStorage.setItem(ADMIN_DEMO_STORAGE, "true");
    state = { busy: false, message: "デモ用スタッフログインで管理画面を開きました。実データは Supabase の staff/admin 権限で確認します。", error: "" };
    location.assign(publicUrl("/admin/dashboard"));
    return;
  }

  state = { busy: false, message: "", error: "デモ用スタッフIDまたはパスワードが違います。" };
  render();
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
  const data = await loadMyData();
  const { error } = await supabase.from("users").update({ birthday_visible: checked }).eq("id", data.user.id);
  if (error) state.error = appErrorMessage(error);
  render();
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

async function recordVisit(type) {
  try {
    if (!supabase) throw new Error("デモ表示では記録できません。Supabase 接続後に試してください。");
    const { data, error } = await supabase.rpc("record_visit", { visit_kind: type });
    if (error) throw error;
    state = { busy: false, message: data.message, error: "" };
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
  }
  render();
}

async function recordSoundHorror(id) {
  try {
    if (!supabase) throw new Error("デモ表示では記録できません。Supabase 接続後に試してください。");
    const { data, error } = await supabase.rpc("record_sound_horror", { horror_id: id });
    if (error) throw error;
    state = { busy: false, message: data.message, error: "" };
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
  }
  render();
}

async function recordSpecialExperience(code) {
  try {
    if (!supabase) throw new Error("デモ表示では記録できません。Supabase 接続後に試してください。");
    const { data, error } = await supabase.rpc("record_special_experience", { experience_code: code });
    if (error) throw error;
    state = { busy: false, message: data.message, error: "" };
  } catch (error) {
    state = { busy: false, message: "", error: appErrorMessage(error) };
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
    state = { ...state, message: "QRを枠内に入れてください。読み取ると自動で進みます。", error: "" };
    qrStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    });
    video.srcObject = qrStream;
    await video.play();
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
            const now = Date.now();
            if (value === lastQrValue && now - lastQrAt < 5000) {
              qrDetecting = false;
              qrFrame = requestAnimationFrame(scan);
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
    setTimeout(() => {
      if (state.qrProcessingKey !== autoKey) return;
      action();
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
    const target = document.querySelector(".flip-card");
    if (!target) throw new Error("保存する会員証が見つかりません。");
    state = { ...state, message: "会員証画像を作成しています。", error: "" };
    const mod = await import("https://esm.sh/html2canvas@1.4.1");
    const html2canvas = mod.default || mod;
    const canvas = await html2canvas(target, { backgroundColor: null, scale: Math.min(3, window.devicePixelRatio || 2), useCORS: true });
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
      state = { busy: false, message: `デモ用に ${form.get("point_name")} / ${form.get("point_value")}pt を付与した想定で確認しました。実保存は Supabase staff/admin 権限で行います。`, error: "" };
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
      state = { busy: false, message: "デモ管理では作成UIだけ確認できます。実保存はSupabase staff/admin権限で行います。", error: "" };
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
      state = { busy: false, message: "デモ管理では直接付与の操作確認だけ行いました。", error: "" };
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

function normalizeExternalUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

async function createNewsPost(event) {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const submitter = event.submitter;
  if (submitter) submitter.disabled = true;
  const submitterText = submitter?.textContent;
  if (submitter) submitter.textContent = "送信中";
  const form = new FormData(event.currentTarget);
  const mode = String(form.get("mode") || "article");
  const url = normalizeExternalUrl(form.get("url"));
  const body = String(form.get("body") || "").trim();
  const imageUrl = String(form.get("image_url") || "").trim();
  const titleInput = String(form.get("title") || "").trim();
  const title = titleInput || (mode === "url" ? sourceLabel(url) : "NEWS");
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
        title,
        body,
        image_url: imageUrl || null,
        external_url: url || null,
        source_label: sourceLabel(url),
        is_published: true,
        created_at: new Date().toISOString(),
        published_at: new Date().toISOString()
      };
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
        if (error) throw error;
        saveLocalNewsPost(post);
      } else {
        saveLocalNewsPost(post);
      }
      state = { busy: false, message: "NEWSを公開しました。", error: "" };
      render();
      return;
    }
    if (!supabase) throw new Error("Supabase接続が必要です。");
    const { error } = await supabase.from("news_posts").insert({
      title,
      body,
      image_url: imageUrl || null,
      external_url: url || null,
      source_label: sourceLabel(url),
      is_published: true,
      published_at: new Date().toISOString()
    });
    if (error) throw error;
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

async function deleteNewsPost(newsId) {
  try {
    if (String(newsId).startsWith("local-news-")) {
      localStorage.setItem(NEWS_LOCAL_STORAGE, JSON.stringify(localNewsPosts().filter((post) => post.id !== newsId)));
      state = { busy: false, message: "NEWSを削除しました。", error: "" };
      render();
      return;
    }
    if (isDemoAdmin()) {
      state = { busy: false, message: "デモ管理ではNEWS削除の操作確認だけ行いました。", error: "" };
      render();
      return;
    }
    if (!supabase) throw new Error("Supabase接続が必要です。");
    const { error } = await supabase.from("news_posts").update({ is_published: false }).eq("id", newsId);
    if (error) throw error;
    state = { busy: false, message: "NEWSを非公開にしました。", error: "" };
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
          ? `<button data-link="/admin/dashboard">管理</button><button data-link="/admin/users">登録者</button><button data-link="/admin/visits">履歴</button><button data-link="/admin/points">特別ポイント</button><button data-link="/admin/qr">QR表示</button><button data-link="/admin/coupons">クーポン</button><button data-link="/admin/news">NEWS</button>`
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
        <h1>スタッフ管理ログイン</h1>
        <p>スタッフ権限のあるアカウントで管理画面を開きます。</p>
        ${notice()}
        <form data-form="admin-login">
          <label>スタッフID<input name="staff_id" required autocomplete="username" /></label>
          <label>パスワード<input name="password" type="password" required autocomplete="current-password" /></label>
          <button class="primary" type="button" data-action="admin-login">管理画面を開く</button>
        </form>
        <div class="auth-links">
          <button data-link="/login">ユーザーログイン</button>
        </div>
        <hr class="soft-divider" />
        <h2>実データ用 staff/admin ログイン</h2>
        <p>登録者一覧などの実データは、Supabase Auth のアカウントを staff/admin にしたうえでログインすると表示されます。</p>
        <form data-form="login">
          <label>メールアドレス<input name="email" type="email" required autocomplete="email" /></label>
          <label>パスワード<input name="password" type="password" required autocomplete="current-password" /></label>
          <button class="primary" type="button" data-action="login-user">実データ管理画面へ</button>
        </form>
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
  const birthday = data.user.birthday_visible ? monthDayDate(data.user.birthday) : "非表示";
  const icon = userIcon(data.user);
  const relics = relicOptions(data.relics);
  const favoriteRelic = currentFavoriteRelic(data.user, data.relics);
  const favoriteLabel = favoriteRelic?.name || "推し呪物";
  const favoriteImage = favoriteRelic?.image || "";
  const purchasePermission = purchasePermissionFor(data.user, rank, data.purchasePermissions || []);

  return layout(html`
    <section class="member-actions">
      <button class="primary compact-action" data-link="/scan">QRを読み取る</button>
      <button class="compact-action save-action" type="button" data-action="save-card-image" aria-label="会員証を保存">保存</button>
    </section>
    <section class="card-stage">
      <div class="background-noise" aria-hidden="true"></div>
      <div class="flip-card" data-action="flip-card">
        <article class="member-card face front">
          <img class="card-brand-logo" src="assets/brand/joujou_logo_black.png" alt="" aria-hidden="true" />
          <div class="card-row">
            <div>
              <p class="eyebrow">MEMBERS CARD</p>
              <h1>${data.user.username}</h1>
              <p class="member-no">${data.user.member_number}</p>
            </div>
            <div class="member-symbols" data-no-flip>
              <label class="avatar" title="アイコンを変更" data-no-flip>
                ${icon ? `<img src="${icon}" alt="ユーザーアイコン" />` : `<span>${(data.user.username || "J").slice(0, 1).toUpperCase()}</span>`}
                <input type="file" accept="image/*" data-action="icon-upload" />
              </label>
              <button type="button" class="favorite-relic-badge ${favoriteImage ? "has-image" : ""}" data-action="open-relic-picker" data-no-flip>
                ${favoriteImage ? `<img src="${favoriteImage}" alt="${favoriteLabel}" />` : `<span class="relic-placeholder">?</span>`}
                <strong>${favoriteLabel}</strong>
              </button>
            </div>
          </div>
          <div class="rank-badge"><span>称号 ${rank.n}</span><strong>${rank.name}</strong></div>
          ${purchasePermission.allowed ? `<button type="button" class="purchase-seal ${purchasePermission.manual ? "manual" : ""}" data-action="open-purchase-seal" data-no-flip><span>呪物購入資格</span><strong>許</strong></button>` : ""}
          <div class="point-strip">
            <span>現在ポイント</span>
            <strong>${points} pt</strong>
          </div>
          <div class="mini-facts">
            <span>誕生日 ${birthday}</span>
            <span>${next ? `次のランクまで ${Math.max(0, next.min - points).toFixed(1)}pt` : "最高ランク"}</span>
          </div>
          <div class="profile-controls">
            <label class="check"><input type="checkbox" data-action="birthday" ${data.user.birthday_visible ? "checked" : ""} /> 誕生日表示</label>
          </div>
        </article>
        <article class="member-card face back">
          <img class="card-brand-logo back-logo" src="assets/brand/joujou_logo_black.png" alt="" aria-hidden="true" />
          <div class="stamp-head">
            <div><p class="eyebrow">SOUND HORROR</p><h2>${completed} / ${horrors.length}</h2></div>
            <strong>総体験 ${visibleListens.length}回</strong>
          </div>
          <div class="stamp-grid">
            ${horrors.map((horror) => {
              const image = relicImageByHorrorTitle[horror.title];
              const count = listensByHorror[horror.id] || 0;
              return `<div class="stamp ${count ? "done" : ""} ${image ? "has-image" : ""}" ${image ? `style="--stamp-image:url('${image}')"` : ""}><span class="horror-title">${count ? horror.title : "？？？？？"}</span><b>${count}</b></div>`;
            }).join("")}
          </div>
        </article>
      </div>
    </section>
    ${state.relicPicker ? relicPickerModal(relics, favoriteRelic) : ""}
    ${state.iconEditor ? iconEditorModal(state.iconEditor) : ""}
    ${state.purchaseSealOpen ? purchaseSealModal() : ""}
  `);
}

function purchaseSealModal() {
  return html`
    <div class="modal-backdrop" data-action="close-purchase-seal">
      <section class="purchase-seal-modal" data-no-flip>
        <div class="seal-mark">許</div>
        <h2>呪物購入資格</h2>
        <p>貴方は呪物を購入する資格を持っています。</p>
      </section>
    </div>
  `;
}

function viewScan() {
  return layout(html`
    <section class="action-panel qr-scan-panel">
      <h1>QR読み取り</h1>
      <p>店頭QRをカメラにかざしてください。読み取ると自動で記録・取得画面へ進みます。</p>
      <div class="qr-camera-box">
        <video class="qr-video" playsinline muted data-role="qr-video"></video>
        <div class="qr-reticle" aria-hidden="true"></div>
      </div>
      <div class="qr-scan-actions">
        <button class="primary" type="button" data-action="start-qr-scanner">カメラを起動する</button>
        <button type="button" data-action="stop-qr-scanner">停止</button>
        <button data-link="/member-card">会員証へ戻る</button>
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
          <h2>推し呪物を選ぶ</h2>
          <button type="button" data-action="close-relic-picker">閉じる</button>
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
        ${userCoupon.status === "available" ? `<button class="primary use-coupon" data-action="use-coupon" data-coupon-id="${userCoupon.id}">使用する</button>` : ""}
      </section>
    </div>
  `;
}

async function viewQrVisit() {
  const type = new URLSearchParams(location.search).get("type") === "second_floor" ? "second_floor" : "first_floor";
  const label = type === "second_floor" ? "2F visit" : "1F visit";
  return autoQrAction(`visit:${type}`, () => recordVisit(type), `${label} recording`);
}

async function viewQrSound() {
  const id = decodeURIComponent(location.pathname.split("/").pop());
  return autoQrAction(`sound:${id}`, () => recordSoundHorror(id), "Sound horror recording");
}

async function viewQrSpecial() {
  const code = decodeURIComponent(appPath().split("/").pop());
  const experience = specialExperiences.find((item) => item.code === code) || specialExperiences[0];
  return autoQrAction(`special:${experience.code}`, () => recordSpecialExperience(experience.code), "Experience recording");
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
        <p>フロントには公開可能なSupabase URLとpublishable keyのみを同梱しています。実データの保護はSupabase RLSとstaff/admin権限で行います。</p>
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
    <section class="page-head"><h1>特別カード</h1><p>期間限定カードやコラボカードを追加できる土台です。</p></section>
    <section class="empty-state">現在表示できる特別カードはありません。</section>
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
  const media = post.image_url ? `<img class="news-image" src="${post.image_url}" alt="${post.title}" />` : "";
  const body = post.body ? `<p>${post.body}</p>` : "";
  const source = post.source_label || sourceLabel(post.external_url || "");
  const host = post.external_url ? sourceLabel(post.external_url) : "";
  const preview = post.external_url
    ? `<div class="news-link-preview"><span>${host}</span><strong>${post.title}</strong><small>${post.external_url}</small></div>`
    : "";
  const content = [
    `<div class="news-author"><span class="news-avatar">呪</span><div><strong>cafeジュジュ</strong><small>${source} / ${date}</small></div></div>`,
    `<h2>${post.title}</h2>`,
    body,
    media,
    preview
  ].join("");
  return html`
    <article class="news-post ${post.external_url ? "is-link" : ""}">
      ${post.external_url ? `<a href="${post.external_url}" target="_blank" rel="noopener noreferrer">${content}</a>` : content}
      ${admin ? `<button type="button" data-action="delete-news" data-news-id="${post.id}">非公開</button>` : ""}
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
    <section class="page-head"><h1>NEWS</h1><p>ジュジュからのお知らせを新しい順に表示します。</p></section>
    <section class="news-timeline">
      ${posts.length ? posts.map((post) => newsPostCard(post)).join("") : `<p class="empty">現在表示できるNEWSはありません。</p>`}
    </section>
  `);
}

async function viewAdminNews() {
  const data = await loadAdminData(null, { includeNews: true });
  const posts = data.newsPosts || [];
  return layout(html`
    ${adminModeBanner()}
    <section class="page-head"><h1>NEWS管理</h1><p>イベント告知、SNS投稿、URLリンクをメンバーズカードのNEWSタイムラインへ追加します。</p></section>
    <section class="news-compose-grid">
    <form class="grid-form admin-form news-form news-compose-card" data-form="news-create">
      <input type="hidden" name="mode" value="article" />
      <h2>記事を作成</h2>
      <label>タイトル<input name="title" placeholder="イベント名、投稿タイトルなど" /></label>
      <label>本文<textarea name="body" rows="4" placeholder="告知本文。URLだけで投稿する場合は空でもOK"></textarea></label>
      <label>画像URL<input name="image_url" placeholder="https://...jpg" /></label>
      <label>SNS/外部URL<input name="url" placeholder="X、Instagram、TikTok、Webページなど" /></label>
      <button class="primary" type="submit">NEWSを公開</button>
    </form>
      <form class="grid-form admin-form news-form news-compose-card" data-form="news-url-create">
        <input type="hidden" name="mode" value="url" />
        <h2>URLだけで投稿</h2>
        <label>URL<input name="url" inputmode="url" placeholder="https://x.com/... など" required /></label>
        <p class="form-note">SNSやWebページのURLだけをNEWSに追加します。記事をタップすると元ページへ移動します。</p>
        <button class="primary" type="submit">URLをNEWSに追加</button>
      </form>
    </section>
    <section class="news-timeline admin-news-timeline">
      ${posts.length ? posts.map((post) => newsPostCard(post, true)).join("") : `<p class="empty">NEWSはまだありません。</p>`}
    </section>
  `, true);
}

function adminModeBanner() {
  return isDemoAdmin()
    ? `<div class="setup-warning"><strong>デモ管理モードです</strong><p>表示中の登録者は確認用データです。実際に登録したユーザーを見るには、Supabase Authでログインしたアカウントの app_profiles.role を staff/admin にしてください。</p><button type="button" data-action="exit-demo-admin">デモを終了して実データログインへ</button></div>`
    : "";
}

function visitLabel(type) {
  return type === "second_floor" ? "二階席来店" : "一階席来店";
}

function pointLabel(type) {
  return {
    visit_1f: "一階席来店",
    visit_2f: "二階席来店",
    sound_horror: "サウンドホラー",
    special: "特別ポイント",
    campaign: "キャンペーン",
    manual: "手動"
  }[type] || type;
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
  const data = await loadAdminData();
  const mode = state.analyticsMode || "gender";
  const segments = adminAnalyticsSegments(data, mode);
  return layout(html`
    ${adminModeBanner()}
    <section class="page-head"><h1>スタッフ管理</h1><p>スタッフ・管理者だけが登録者全員の情報を扱えます。</p></section>
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
  const data = await loadAdminData();
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
  `, true);
}

async function viewAdminVisits() {
  const data = await loadAdminData();
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
  const data = await loadAdminData();
  return layout(html`
    ${adminModeBanner()}
    <section class="page-head"><h1>特別ポイント付与</h1><p>スタッフ権限を持つアカウントだけが実行できます。</p></section>
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
  const data = await loadAdminData();
  const coupons = data.coupons || [];
  return layout(html`
    ${adminModeBanner()}
    <section class="page-head"><h1>クーポン管理</h1><p>タイトルと説明文だけのシンプルなクーポンを作成し、QR取得または会員への直接付与ができます。</p></section>
    <form class="grid-form admin-form" data-form="coupon-create">
      <label>クーポンのタイトル<input name="title" required placeholder="会員登録キャンペーンクーポン" /></label>
      <label>内容説明文<textarea name="description" rows="3" required placeholder="サウンドホラー一回無料（￥1,000作品のみ対象）"></textarea></label>
      <label>使用期限<input name="expires_at" type="date" /></label>
      <button class="primary">クーポンを作成</button>
    </form>
    <form class="grid-form admin-form" data-form="coupon-grant">
      <label>対象ユーザー<select name="user_id" required>${(data.users || []).map((u) => `<option value="${u.id}">${u.member_number} / ${u.real_name}</option>`).join("")}</select></label>
      <label>付与クーポン<select name="coupon_id" required>${coupons.map((c) => `<option value="${c.id}">${c.title}</option>`).join("")}</select></label>
      <button class="primary">会員に直接付与</button>
    </form>
    <section class="list-section">
      <h2>作成済みクーポン</h2>
      ${coupons.length ? coupons.map((c) => `<article class="coupon-admin-item" data-action="open-qr-modal" data-qr-title="${encodeURIComponent(`クーポン: ${c.title}`)}" data-qr-path="${encodeURIComponent(`/qr/coupon/${c.id}`)}"><div><strong>${c.title}</strong><span>${c.description || ""}</span><small>${c.expires_at ? yenDate(c.expires_at) : "無期限"}</small><code>${new URL(publicUrl(`/qr/coupon/${c.id}`), location.origin).href}</code></div><img src="${qrUrl(`/qr/coupon/${c.id}`)}" alt="${c.title} QR" /></article>`).join("") : `<p class="empty">登録済みクーポンはありません。</p>`}
    </section>
    ${state.qrModal ? qrModal(state.qrModal) : ""}
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
  if (action.dataset.action === "save-card-image") saveMemberCardImage();
  if (action.dataset.action === "revoke-purchase-permission") revokePurchasePermission(action.dataset.userId);
  if (action.dataset.action === "delete-news") deleteNewsPost(action.dataset.newsId);
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
    if (event.target.closest("[data-no-flip], .avatar, .favorite-relic-badge, .profile-controls")) return;
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
  if (form === "purchase-permission") grantPurchasePermission(event);
  if (form === "news-create" || form === "news-url-create") createNewsPost(event);
  if (form === "admin-user-search") handleAdminUserSearch(event);
});

window.addEventListener("popstate", render);
if ("serviceWorker" in navigator) navigator.serviceWorker.register(publicUrl("/sw.js")).catch(() => {});
await initSupabase();
render();
