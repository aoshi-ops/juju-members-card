# cafeジュジュ メンバーズカード Ver.0.2

仕様書に基づく、ユーザー向け会員証アプリとスタッフ向け管理アプリの初期実装です。

## 起動

この環境では通常の `npm` が使えないため、Codex 同梱 Node.js で起動します。

```powershell
& 'C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' server.js
```

表示先:

- ユーザー側: `http://localhost:4173/member-card`
- ログイン: `http://localhost:4173/login`
- 管理側: `http://localhost:4173/admin/dashboard`
- QR 来店: `http://localhost:4173/qr/visit?type=first_floor`
- QR 来店: `http://localhost:4173/qr/visit?type=second_floor`
- QR サウンドホラー: `http://localhost:4173/qr/sound-horror/<soundHorrorId>`

## Supabase 設定

1. Supabase SQL editor で `supabase/schema.sql` を実行します。
2. アプリの `/settings` で Supabase URL と anon key を保存します。
3. `service_role key` は絶対にブラウザに入力しないでください。

## 権限

- 一般ユーザーは `auth.uid()` と一致する `users.auth_user_id` のデータだけを閲覧・更新できます。
- `/admin` はフロント側でも staff/admin を確認し、DB 側でも RLS により全件取得を staff/admin のみに制限します。
- QR 記録は `record_visit` / `record_sound_horror` RPC で、ログイン中本人の `users.id` にだけ履歴を作成します。

## Ver.0.2 実装範囲

- 会員登録、ログイン
- 会員証、誕生日表示 ON/OFF、推し呪物選択
- 会員カードのフリップとサウンドホラースタンプカード
- クーポン一覧
- 来店 QR とサウンドホラー QR の記録 RPC
- スタッフ管理画面、登録者一覧、登録者詳細
- 特別ポイント付与
- クーポン管理の土台
- PWA manifest / service worker
- RLS 付き Supabase schema
