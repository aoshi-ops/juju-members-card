const ranks = [
  { n: 1, name: "迷い人", min: 1, max: 5 },
  { n: 2, name: "常連の気配", min: 5.5, max: 10.5 },
  { n: 3, name: "蒐集者見習い", min: 11, max: 16.5 },
  { n: 4, name: "呪物蒐集者", min: 17, max: 23.5 },
  { n: 5, name: "呪物管理者", min: 24, max: 38.5 },
  { n: 6, name: "説明会補佐", min: 39, max: 68.5 },
  { n: 7, name: "蒐集録管理人", min: 69, max: null }
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
const specialExperiences = [
  { code: "sange-box", title: "さんげの箱", point: 3 }
];

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
  coupons: [],
  users: []
};

let supabase = null;
let createClient = null;
let session = null;
let state = { busy: false, message: "", error: "" };

const app = document.querySelector("#app");
const scriptUrl = new URL(import.meta.url);
const BASE_PATH = scriptUrl.pathname.replace(/\/app\.js$/, "").replace(/\/$/, "");
const ADMIN_DEMO_ID = "joujoustaff";
const ADMIN_DEMO_PASSWORD = "joujoufirstanniversary";
const ADMIN_DEMO_STORAGE = "JUJU_ADMIN_DEMO_AUTH";
const PENDING_REGISTRATION_STORAGE = "JUJU_PENDING_REGISTRATION";
const iconStorageKey = (userId) => `JUJU_ICON_${userId}`;
const cfg = () => ({
  url: localStorage.getItem("SUPABASE_URL") || "",
  anon: localStorage.getItem("SUPABASE_ANON_KEY") || ""
});
const isConfigured = () => Boolean(cfg().url && cfg().anon);
const setupHint = () =>
  isConfigured()
    ? `<p class="notice ok">Supabase接続設定済みです。この端末から会員登録できます。</p>`
    : `<div class="setup-warning"><strong>Supabase接続が未設定です</strong><p>会員登録・ログインには、この端末のブラウザに Supabase URL と anon public key を保存してください。</p><button type="button" data-link="/settings">接続設定を開く</button></div>`;
const schemaSetupMessage =
  "Supabaseのデータベース初期設定が未完了です。AuthenticationのUsersとは別に、SQL Editorで public.users などのアプリ用テーブルを作成してください。";
const yenDate = (value) => (value ? new Date(value).toLocaleDateString("ja-JP") : "-");
const html = (strings, ...values) => strings.map((s, i) => s + (values[i] ?? "")).join("");
const appPath = () => {
  const path = location.pathname;
  if (BASE_PATH && path.startsWith(`${BASE_PATH}/`)) return path.slice(BASE_PATH.length) || "/";
  if (BASE_PATH && path === BASE_PATH) return "/";
  return path;
};
const publicUrl = (path) => `${BASE_PATH}${path}`;
const absoluteUrl = (path) => new URL(publicUrl(path), location.origin).href;
const navigate = (path) => {
  history.pushState({}, "", publicUrl(path));
  render();
};

function isDemoAdmin() {
  return localStorage.getItem(ADMIN_DEMO_STORAGE) === "true";
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
    coupons: []
  };
}

function registrationPayloadFromForm(form, authUserId = null) {
  return {
    auth_user_id: authUserId,
    email: String(form.get("email") || "").trim(),
    real_name: String(form.get("real_name") || "").trim(),
    username: String(form.get("username") || "").trim(),
    birthday: String(form.get("birthday") || ""),
    age: Number(form.get("age")),
    gender: String(form.get("gender") || "回答しない"),
    birthday_visible: form.get("birthday_visible") === "on"
  };
}

function profilePayloadFromForm(form, authUser) {
  return {
    auth_user_id: authUser.id,
    email: authUser.email,
    real_name: String(form.get("real_name") || "").trim(),
    username: String(form.get("username") || "").trim(),
    birthday: String(form.get("birthday") || ""),
    age: Number(form.get("age")),
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
  if (!meta.real_name || !meta.username || !meta.birthday || meta.age === undefined || !meta.gender) return null;
  return {
    auth_user_id: authUser.id,
    email: authUser.email,
    real_name: meta.real_name,
    username: meta.username,
    birthday: meta.birthday,
    age: Number(meta.age),
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
    message.includes("public.users") ||
    message.includes("schema cache") ||
    message.includes("Could not find the table")
  ) {
    return schemaSetupMessage;
  }
  return message;
}

function userIcon(user) {
  return user.icon_url || localStorage.getItem(iconStorageKey(user.id)) || "";
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
  return data;
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
  const { data: profile } = await supabase
    .from("app_profiles")
    .select("role")
    .eq("auth_user_id", current.user.id)
    .maybeSingle();

  const [visits, listens, points, coupons, horrors, relics] = await Promise.all([
    supabase.from("visits").select("*").eq("user_id", user.id).order("visited_at", { ascending: false }),
    supabase.from("sound_horror_listens").select("*").eq("user_id", user.id).order("listened_at", { ascending: false }),
    supabase.from("point_events").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("user_coupons").select("*, coupons(*)").eq("user_id", user.id).order("issued_at", { ascending: false }),
    supabase.from("sound_horrors").select("*").eq("is_active", true).order("title"),
    supabase.from("relics").select("*").eq("is_active", true).order("name")
  ]);

  for (const result of [visits, listens, points, coupons, horrors, relics]) {
    if (result.error) throw result.error;
  }

  return {
    profile: profile || { role: "user" },
    user,
    visits: visits.data || [],
    listens: listens.data || [],
    pointEvents: points.data || [],
    coupons: coupons.data || [],
    soundHorrors: horrors.data || [],
    relics: relics.data || []
  };
}

async function loadAdminData(userId = null) {
  if (isDemoAdmin()) {
    const data = demoAdminData();
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
  const [users, visits, listens, points, coupons] = await Promise.all([
    userId ? supabase.from("users").select("*").eq("id", userId).single() : usersQuery,
    userId ? supabase.from("visits").select("*").eq("user_id", userId).order("visited_at", { ascending: false }) : supabase.from("visits").select("*").order("visited_at", { ascending: false }).limit(200),
    userId ? supabase.from("sound_horror_listens").select("*, sound_horrors(title)").eq("user_id", userId).order("listened_at", { ascending: false }) : supabase.from("sound_horror_listens").select("*").order("listened_at", { ascending: false }).limit(200),
    userId ? supabase.from("point_events").select("*").eq("user_id", userId).order("created_at", { ascending: false }) : supabase.from("point_events").select("*").order("created_at", { ascending: false }).limit(200),
    userId ? supabase.from("user_coupons").select("*, coupons(*)").eq("user_id", userId) : supabase.from("coupons").select("*").order("created_at", { ascending: false })
  ]);

  for (const result of [users, visits, listens, points, coupons]) {
    if (result.error) throw result.error;
  }
  return { users: userId ? [users.data] : users.data, visits: visits.data, listens: listens.data, pointEvents: points.data, coupons: coupons.data };
}

async function handleLogin(event) {
  event?.preventDefault?.();
  const formElement = event?.currentTarget?.matches?.("form")
    ? event.currentTarget
    : document.querySelector('[data-form="login"]');
  if (!formElement.reportValidity()) return;
  const form = new FormData(formElement);
  if (!isConfigured()) {
    state = { busy: false, message: "", error: "Supabase接続が未設定です。先に接続設定を保存してください。" };
    navigate("/settings");
    return;
  }
  state = { busy: true, message: "", error: "" };
  try {
    if (!supabase) throw new Error("Supabase URL と anon key を設定してください。");
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
  if (!isConfigured()) {
    state = { busy: false, message: "", error: "Supabase接続が未設定です。先に接続設定を保存してください。" };
    navigate("/settings");
    return;
  }
  state = { busy: true, message: "", error: "" };
  render();
  try {
    if (!supabase) throw new Error("Supabase URL と anon key を設定してください。");
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
          age: payload.age,
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
    if (!supabase) throw new Error("Supabase接続が未設定です。先に接続設定を保存してください。");
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

async function setFavoriteRelic(value) {
  if (!supabase) return;
  const data = await loadMyData();
  const { error } = await supabase.from("users").update({ favorite_relic_id: value || null }).eq("id", data.user.id);
  if (error) state.error = appErrorMessage(error);
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
    const iconUrl = String(reader.result);
    try {
      const data = await loadMyData();
      localStorage.setItem(iconStorageKey(data.user.id), iconUrl);
      if (supabase) {
        const { error } = await supabase.from("users").update({ icon_url: iconUrl }).eq("id", data.user.id);
        if (error) throw error;
      }
      state = { busy: false, message: "アイコンを更新しました。", error: "" };
    } catch (error) {
      state = { busy: false, message: "", error: appErrorMessage(error) };
    }
    render();
  };
  reader.onerror = () => {
    state = { busy: false, message: "", error: "画像を読み込めませんでした。" };
    render();
  };
  reader.readAsDataURL(file);
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

function layout(content, admin = false) {
  return html`
    <header class="topbar">
      <button class="brand" data-link="${admin ? "/admin/dashboard" : "/member-card"}">cafeジュジュ</button>
      <nav>
        ${admin
          ? `<button data-link="/admin/dashboard">管理</button><button data-link="/admin/users">登録者</button><button data-link="/admin/visits">履歴</button><button data-link="/admin/points">特別ポイント</button><button data-link="/admin/qr">QR表示</button><button data-link="/admin/coupons">クーポン</button>`
          : `<button data-link="/member-card">会員証</button><button data-link="/coupons">クーポン</button><button data-link="/special-cards">特別カード</button>`}
        <button data-link="/settings">設定</button>
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
        ${setupHint()}
        ${notice()}
        <form data-form="login">
          <label>メールアドレス<input name="email" type="email" required autocomplete="email" /></label>
          <label>パスワード<input name="password" type="password" required autocomplete="current-password" /></label>
          <button class="primary" type="button" data-action="login-user" ${state.busy ? "disabled" : ""}>ログイン</button>
        </form>
        <div class="auth-links">
          <button data-link="/register">会員登録</button>
          <button data-link="/settings">Supabase接続設定</button>
          <button data-link="/member-card">デモ表示</button>
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
        <p>仮ログインは管理UIの確認用です。本番データの閲覧・更新は Supabase の app_profiles.role が staff/admin のアカウントだけで実行します。</p>
        ${notice()}
        <div class="demo-credential">
          <span>デモ用ID</span><strong>${ADMIN_DEMO_ID}</strong>
          <span>デモ用パスワード</span><strong>${ADMIN_DEMO_PASSWORD}</strong>
        </div>
        <form data-form="admin-login">
          <label>スタッフID<input name="staff_id" required autocomplete="username" /></label>
          <label>パスワード<input name="password" type="password" required autocomplete="current-password" /></label>
          <button class="primary" type="button" data-action="admin-login">管理画面を開く</button>
        </form>
        <div class="auth-links">
          <button data-link="/login">ユーザーログイン</button>
          <button data-link="/settings">Supabase接続設定</button>
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
        ${setupHint()}
        ${notice()}
        <form class="grid-form" data-form="register">
          <label>本名<input name="real_name" required autocomplete="name" placeholder="山田 太郎" /></label>
          <label>ユーザーネーム<input name="username" required autocomplete="nickname" placeholder="juju_guest" /></label>
          <label>メールアドレス<input name="email" type="email" required autocomplete="email" placeholder="you@example.com" /></label>
          <label>パスワード<input name="password" type="password" minlength="8" required autocomplete="new-password" /></label>
          <label>誕生日<input name="birthday" type="date" required /></label>
          <label>年齢<input name="age" type="number" min="0" max="120" required inputmode="numeric" /></label>
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
          <label>年齢<input name="age" type="number" min="0" max="120" required inputmode="numeric" value="${pending.age ?? ""}" /></label>
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
  const events = data.pointEvents;
  const points = sumRankPoints(events);
  const rank = rankFor(points);
  const next = nextRank(points);
  const listensByHorror = countBy(data.listens, "sound_horror_id");
  const horrors = data.soundHorrors?.length ? data.soundHorrors : demoSoundHorrors;
  const completed = Object.keys(listensByHorror).length;
  const birthday = data.user.birthday_visible ? yenDate(data.user.birthday) : "非表示";
  const icon = userIcon(data.user);
  const favoriteRelic = data.relics?.find((relic) => relic.id === data.user.favorite_relic_id);
  const favoriteLabel = favoriteRelic?.name || "推し呪物";

  return layout(html`
    <section class="member-actions">
      <button class="primary" data-link="/scan">QRを読み取る</button>
    </section>
    <section class="card-stage">
      <button class="coupon-float" data-link="/coupons">クーポン</button>
      <div class="flip-card" data-action="flip-card">
        <article class="member-card face front">
          <div class="card-row">
            <div>
              <p class="eyebrow">MEMBERS CARD</p>
              <h1>${data.user.username}</h1>
              <p class="member-no">${data.user.member_number}</p>
            </div>
            <div class="member-symbols">
              <label class="avatar" title="アイコンを変更">
                ${icon ? `<img src="${icon}" alt="ユーザーアイコン" />` : `<span>${(data.user.username || "J").slice(0, 1).toUpperCase()}</span>`}
                <input type="file" accept="image/*" data-action="icon-upload" />
              </label>
              <div class="favorite-relic-badge"><span>推し</span><strong>${favoriteLabel}</strong></div>
            </div>
          </div>
          <div class="rank-badge"><span>称号</span><strong>ランク${rank.n} ${rank.name}</strong></div>
          <div class="point-strip">
            <span>現在ポイント</span>
            <strong>${points} pt</strong>
          </div>
          <div class="mini-facts">
            <span>誕生日 ${birthday}</span>
            <span>${next ? `次ランクまで ${Math.max(0, next.min - points).toFixed(1)}pt` : "最高ランク"}</span>
          </div>
          <div class="profile-controls">
            <label class="check"><input type="checkbox" data-action="birthday" ${data.user.birthday_visible ? "checked" : ""} /> 誕生日表示</label>
            ${data.relics?.length ? relicSelect(data.relics, data.user.favorite_relic_id) : `<span>推し呪物：未設定</span>`}
          </div>
        </article>
        <article class="member-card face back">
          <div class="stamp-head">
            <div><p class="eyebrow">SOUND HORROR</p><h2>${completed} / ${horrors.length}</h2></div>
            <strong>総体験 ${data.listens.length}回</strong>
          </div>
          <div class="stamp-grid">
            ${horrors.map((horror) => `<div class="stamp ${listensByHorror[horror.id] ? "done" : ""}"><span class="horror-title">${listensByHorror[horror.id] ? horror.title : "？？？？？"}</span><b>${listensByHorror[horror.id] || 0}</b></div>`).join("")}
          </div>
        </article>
      </div>
    </section>
    <section class="member-settings-panel">
      <h2>推し呪物設定</h2>
      <p>画像素材を追加したら、ここを呪物アイコン付きの選択UIに差し替えます。</p>
      ${data.relics?.length ? relicSelect(data.relics, data.user.favorite_relic_id) : `<p class="empty">推し呪物の候補はまだ登録されていません。</p>`}
    </section>
  `);
}

function viewScan() {
  return layout(html`
    <section class="action-panel">
      <h1>QR読み取り</h1>
      <p>スマホのカメラで店頭QRを読み取るか、下のテスト用ボタンから記録画面を開けます。実際の記録はログイン中の本人にだけ紐づきます。</p>
      <div class="admin-actions">
        <button class="primary" data-link="/qr/visit?type=first_floor">一階席来店を記録</button>
        <button class="primary" data-link="/qr/visit?type=second_floor">二階席来店を記録</button>
        <button data-link="/member-card">会員証へ戻る</button>
      </div>
    </section>
  `);
}

function relicSelect(relics, current) {
  return `<label>推し呪物<select data-action="favorite-relic"><option value="">未設定</option>${relics.map((relic) => `<option value="${relic.id}" ${relic.id === current ? "selected" : ""}>${relic.name}</option>`).join("")}</select></label>`;
}

async function viewCoupons() {
  const data = await loadMyData();
  const groups = {
    available: data.coupons.filter((c) => c.status === "available"),
    used: data.coupons.filter((c) => c.status === "used"),
    expired: data.coupons.filter((c) => c.status === "expired")
  };
  return layout(html`
    <section class="page-head"><h1>クーポン</h1><p>利用可能・使用済み・期限切れを本人のデータだけで表示します。</p></section>
    ${["available", "used", "expired"].map((key) => couponSection(key, groups[key])).join("")}
  `);
}

function couponSection(key, items) {
  const label = { available: "利用可能", used: "使用済み", expired: "期限切れ" }[key];
  return `<section class="list-section"><h2>${label}</h2>${items.length ? items.map((item) => `<article class="item"><strong>${item.coupons?.title || "クーポン"}</strong><span>${item.coupons?.description || ""}</span><small>${yenDate(item.coupons?.expires_at)}</small></article>`).join("") : `<p class="empty">現在利用できるクーポンはありません。</p>`}</section>`;
}

async function viewQrVisit() {
  const type = new URLSearchParams(location.search).get("type");
  const label = type === "second_floor" ? "二階席来店" : "一階席来店";
  return layout(html`
    <section class="action-panel">
      <h1>${label} QR</h1>
      <p>ログイン中の本人にだけ来店履歴とポイントを記録します。1日の上限は一階席・二階席合計で2回です。</p>
      <button class="primary" data-action="record-visit" data-type="${type === "second_floor" ? "second_floor" : "first_floor"}">来店を記録する</button>
    </section>
  `);
}

async function viewQrSound() {
  const id = decodeURIComponent(location.pathname.split("/").pop());
  return layout(html`
    <section class="action-panel">
      <h1>サウンドホラー QR</h1>
      <p>作品ID: ${id}</p>
      <button class="primary" data-action="record-sound" data-id="${id}">体験を記録する</button>
    </section>
  `);
}

async function viewQrSpecial() {
  const code = decodeURIComponent(appPath().split("/").pop());
  const experience = specialExperiences.find((item) => item.code === code) || specialExperiences[0];
  return layout(html`
    <section class="action-panel">
      <h1>${experience.title} QR</h1>
      <p>この体験は会員証には表示せず、内部のポイント履歴として記録します。</p>
      <button class="primary" data-action="record-special" data-code="${experience.code}">${experience.point}ptを記録する</button>
      <button data-link="/member-card">会員証へ戻る</button>
    </section>
  `);
}

function viewSettings() {
  const { url, anon } = cfg();
  return layout(html`
    <section class="settings">
      <h1>Supabase接続設定</h1>
      <p>スマホで会員登録する場合も、この画面をスマホで開いて保存してください。保存するのは公開可能な anon public key だけです。service_role key は絶対に入力しないでください。</p>
      ${notice()}
      <div class="setup-guide">
        <h2>入力する値</h2>
        <p>Supabase Dashboard の Project Settings から Project URL と anon public key をコピーします。</p>
        <ol>
          <li>Supabaseでこのアプリ用プロジェクトを開く</li>
          <li>Project Settings → API を開く</li>
          <li>Project URL を Supabase URL に貼る</li>
          <li>Project API keys の anon public を Supabase anon key に貼る</li>
        </ol>
      </div>
      <form data-form="config">
        <label>Supabase URL<input name="url" value="${url}" placeholder="https://xxxx.supabase.co" /></label>
        <label>Supabase anon key<input name="anon" value="${anon}" placeholder="eyJ..." /></label>
        <button class="primary mobile-save" type="button" data-action="save-config">保存</button>
      </form>
    </section>
  `);
}

function viewSpecialCards() {
  return layout(html`
    <section class="page-head"><h1>特別カード</h1><p>期間限定カードやコラボカードを追加できる土台です。</p></section>
    <section class="empty-state">現在表示できる特別カードはありません。</section>
  `);
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
  return `<article class="qr-card"><img src="${qrUrl(path)}" alt="${title} QR" /><div><h2>${title}</h2><p>${note}</p><code>${target}</code></div></article>`;
}

async function viewAdminDashboard() {
  const data = await loadAdminData();
  const users = data.users || [];
  return layout(html`
    ${adminModeBanner()}
    <section class="page-head"><h1>スタッフ管理</h1><p>スタッフ・管理者だけが登録者全員の情報を扱えます。</p></section>
    <section class="metric-grid">
      <div class="metric"><span>登録者数</span><strong>${users.length}</strong></div>
      <div class="metric"><span>来店履歴</span><strong>${data.visits.length}</strong></div>
      <div class="metric"><span>体験履歴</span><strong>${data.listens.length}</strong></div>
      <div class="metric"><span>ポイント履歴</span><strong>${data.pointEvents.length}</strong></div>
    </section>
    <section class="admin-actions">
      <button data-link="/admin/users">登録者一覧</button>
      <button data-link="/admin/visits">来店・ポイント履歴</button>
      <button data-link="/admin/points">特別ポイント付与</button>
      <button data-link="/admin/qr">店舗QRを表示</button>
    </section>
  `, true);
}

async function viewAdminUsers() {
  const data = await loadAdminData();
  return layout(html`
    ${adminModeBanner()}
    <section class="page-head"><h1>登録者一覧</h1><p>本名、誕生日、性別、年齢を含むため /admin と RLS で保護します。</p></section>
    <section class="intake-panel">
      <h2>メンバーズカード登録情報の受け皿</h2>
      <p>会員登録フォームから送信された情報は users テーブルに保存され、この一覧に表示されます。登録詳細の見せ方は、メンバーズカード側の登録フローを固めてから調整します。</p>
      <div class="intake-grid">
        <span>受信予定</span><strong>本名 / ユーザーネーム / 誕生日 / 性別 / 年齢 / メール / 誕生日表示 / 推し呪物</strong>
        <span>権限</span><strong>user は本人のみ、staff/admin は全員を閲覧</strong>
      </div>
    </section>
    <section class="table-wrap">
      <table>
        <thead><tr><th>会員番号</th><th>本名</th><th>ユーザーネーム</th><th>性別</th><th>年齢</th><th>ランクpt</th><th>詳細</th></tr></thead>
        <tbody>${data.users.map((u) => `<tr><td>${u.member_number}</td><td>${u.real_name}</td><td>${u.username}</td><td>${u.gender}</td><td>${u.age}</td><td>${u.rank_points ?? 0}</td><td><button data-link="/admin/users/${u.id}">開く</button></td></tr>`).join("")}</tbody>
      </table>
    </section>
  `, true);
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
      <div><span>一階席</span><strong>${data.visits.filter((v) => v.visit_type === "first_floor").length}</strong></div>
      <div><span>二階席</span><strong>${data.visits.filter((v) => v.visit_type === "second_floor").length}</strong></div>
      <div><span>総体験</span><strong>${data.listens.length}</strong></div>
      <div><span>制覇作品数</span><strong>${Object.keys(listensByHorror).length}</strong></div>
    </section>
    <section class="list-section"><h2>来店履歴</h2>${data.visits.length ? data.visits.map((visit) => `<article class="item"><strong>${visitLabel(visit.visit_type)} / ${visit.point_value}pt</strong><span>${yenDate(visit.visited_at)}</span></article>`).join("") : `<p class="empty">来店履歴はまだありません。</p>`}</section>
    <section class="list-section"><h2>ポイント履歴</h2>${data.pointEvents.map((p) => `<article class="item"><strong>${p.point_type} / ${p.point_value}pt</strong><span>${p.memo || ""}</span><small>${yenDate(p.created_at)}</small></article>`).join("")}</section>
  `, true);
}

async function viewAdminVisits() {
  const data = await loadAdminData();
  const userById = Object.fromEntries((data.users || []).map((user) => [user.id, user]));
  return layout(html`
    ${adminModeBanner()}
    <section class="page-head"><h1>来店履歴・ポイント履歴</h1><p>登録者の来店、サウンドホラー体験、特別ポイントを確認する画面です。</p></section>
    <section class="split-lists">
      <div class="list-section">
        <h2>来店履歴</h2>
        ${data.visits.length ? data.visits.map((visit) => `<article class="item"><strong>${visitLabel(visit.visit_type)} / ${visit.point_value}pt</strong><span>${userById[visit.user_id]?.member_number || visit.user_id || "-"} ${userById[visit.user_id]?.real_name || ""}</span><small>${yenDate(visit.visited_at)}</small></article>`).join("") : `<p class="empty">来店履歴はまだありません。</p>`}
      </div>
      <div class="list-section">
        <h2>ポイント履歴</h2>
        ${data.pointEvents.length ? data.pointEvents.map((point) => `<article class="item"><strong>${pointLabel(point.point_type)} / ${point.point_value}pt</strong><span>${userById[point.user_id]?.member_number || point.user_id || "-"} ${point.memo || ""}</span><small>${yenDate(point.created_at)}</small></article>`).join("") : `<p class="empty">ポイント履歴はまだありません。</p>`}
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
  const horrors = soundHorrorTitles
    .map((title) => rawHorrors.find((horror) => horror.title === title) || demoSoundHorrors.find((horror) => horror.title === title))
    .filter(Boolean);
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
  return layout(html`
    <section class="page-head"><h1>クーポン管理</h1><p>Ver.0.2 では管理構造の土台として一覧を表示します。</p></section>
    <section class="list-section">${data.coupons.length ? data.coupons.map((c) => `<article class="item"><strong>${c.title || c.coupons?.title}</strong><span>${c.description || c.status || ""}</span><small>${yenDate(c.expires_at || c.issued_at)}</small></article>`).join("") : `<p class="empty">登録済みクーポンはありません。</p>`}</section>
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
    if (path === "/" || path === "/login") paintShell(await viewLogin());
    else if (path === "/admin/login") paintShell(viewAdminLogin());
    else if (path === "/register") paintShell(viewRegister());
    else if (path === "/complete-profile") paintShell(await viewCompleteProfile());
    else if (path === "/member-card") paintShell(await viewMemberCard());
    else if (path === "/scan") paintShell(viewScan());
    else if (path === "/coupons") paintShell(await viewCoupons());
    else if (path === "/qr/visit") paintShell(await viewQrVisit());
    else if (path.startsWith("/qr/sound-horror/")) paintShell(await viewQrSound());
    else if (path.startsWith("/qr/special/")) paintShell(await viewQrSpecial());
    else if (path === "/settings") paintShell(viewSettings());
    else if (path === "/special-cards") paintShell(viewSpecialCards());
    else if (path === "/admin" || path === "/admin/dashboard") paintShell(await viewAdminDashboard());
    else if (path === "/admin/users") paintShell(await viewAdminUsers());
    else if (path.startsWith("/admin/users/")) paintShell(await viewAdminUserDetail());
    else if (path === "/admin/visits") paintShell(await viewAdminVisits());
    else if (path === "/admin/points") paintShell(await viewAdminPoints());
    else if (path === "/admin/qr") paintShell(await viewAdminQr());
    else if (path === "/admin/coupons") paintShell(await viewAdminCoupons());
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
  if (action.dataset.action === "flip-card") action.classList.toggle("is-flipped");
  if (action.dataset.action === "record-visit") recordVisit(action.dataset.type);
  if (action.dataset.action === "record-sound") recordSoundHorror(action.dataset.id);
  if (action.dataset.action === "record-special") recordSpecialExperience(action.dataset.code);
});

document.addEventListener("change", (event) => {
  if (event.target.matches('[data-action="birthday"]')) toggleBirthday(event.target.checked);
  if (event.target.matches('[data-action="favorite-relic"]')) setFavoriteRelic(event.target.value);
  if (event.target.matches('[data-action="icon-upload"]')) updateIcon(event.target.files?.[0]);
});

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
});

window.addEventListener("popstate", render);
if ("serviceWorker" in navigator) navigator.serviceWorker.register(publicUrl("/sw.js")).catch(() => {});
await initSupabase();
render();
