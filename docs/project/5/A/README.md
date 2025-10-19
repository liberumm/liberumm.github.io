# プロダクト概要 & モジュール関係（簡易仕様書）

> **Version**: 0.2.0 | **Last Updated**: 2024-12

このドキュメントは、要件定義～拡張フェーズを想定した「フロントエンドのみ」で完結する構成の**全体像**と**各モジュールの関係**をまとめた簡潔な仕様書です。
ビルド不要（CDN＋UMD）で動作し、将来は任意の BFF/マイクロサービスにスムーズに接続できる前提です。

## クイックスタート

```bash
# 1. リポジトリをクローン
git clone <repository-url>
cd <project-directory>

# 2. ローカルサーバー起動（いずれか）
# VSCode Live Preview拡張を使用
# または Python
python -m http.server 8000
# または Node.js
npx serve .

# 3. ブラウザでアクセス
# http://localhost:8000
```

---

## 1. 全体アーキテクチャ（論理）

```
+--------------------+      +--------------------+
|  shared/utils.js   |<-----|  shared/date.js    |
|  shared/format.js  |<-----|  shared/store.js   |
+---------^----------+      +--------------------+
          |
          | provides helpers (ymd, bucket, formatting, etc.)
          v
 +--------------------+   uses    +-----------------------+
 |  data/masters.js   |---------->|  data/fixtures.js     |
 |  (定義: MASTERS)   |           |  (生成: Store API)    |
 +---------^----------+           +-----------^-----------+
           |                                  |
           | exposes global read-only         | exposes window.Store.getFixtures()
           |                                  |
           v                                  v
 +--------------------+   (pure functions)  +---------------------+
 |  features/sales.js |<--------------------|  features/inventory |
 |  features/forecast |                     |  features/taxonomy  |
 +---------^----------+                     +---------------------+
           |                                              ^
           | compute indexes, sums                        |
           v                                              |
 +----------------------+          +----------------------+--------+
 |   app/components/*   | <------> |        app/App.js             |
 |  (Filter, Table,     |          | (全体状態/画面構築)            |
 |   AxisSelector,      |          +-------------------------------+
 |   RevenueChart...)   |
 +----------------------+ 
```

* **data**: マスタ定義（静的）とサンプルデータの生成（疑似トランザクション）。
* **features**: 集計・在庫推定・分類などの**純粋関数群**。UIから独立。
* **shared**: 日付・整形・ユーティリティ・小規模状態アクセス。
* **app**: React UI（状態管理・描画・操作）。すべての依存を注入して表示。

---

## 2. フォルダ構成（物理）

```
/ (ルート)
├─ index.html              # エントリ（CDN・script 読み込み順を制御）
├─ shared/
│   ├─ date.js             # 期間・バケット・日付計算
│   ├─ format.js           # 通貨/数値フォーマット
│   ├─ store.js            # グローバル読み出しの薄いラッパ
│   ├─ utils.js            # 共通ユーティリティ（ymd, buildBuckets 等）
│   └─ section.js          # セクションUIの薄いラッパ（見た目共通化）
├─ data/
│   ├─ masters.js          # MASTERS: STORES, STORE_BLOCK, LINE_MASTER, CATEGORY_MASTER...
│   └─ fixtures.js         # window.Store.getFixtures(): {PRODUCTS, INVENTORY, SALES}
├─ features/
│   ├─ sales.js            # buildIndexes(), sumUnits(), sumRevenue(), sumUnitsByStore()...
│   ├─ inventory.js        # computeStoreMetrics(), inv集計系
│   ├─ forecast.js         # decideAction(), depletion予測など
│   ├─ productTaxonomy.js  # groupItemsByAxis(), itemCodeFromSku()
│   └─ transfer.js         # 移管関連の計算・フィルタリング
├─ app/
│   ├─ main.js             # ReactDOM.render / ルート起動
│   ├─ App.js              # 画面全体の状態保持と組み立て
│   └─ component/
│       ├─ Section.js
│       ├─ Filter.js
│       ├─ SelectorBar.js
│       ├─ AxisSelector.js
│       ├─ RevenueChartDetailed.js
│       ├─ SalesTable.js
│       ├─ TransferPlanner.js    # 移管計画モーダル
│       ├─ TaskManager.js        # タスク管理UI
│       └─ TransferFilter.js     # 移管専用フィルタ
```

**読み込み順の要点（index.html の `<script>`）**
`shared → data → features → app/component → app/App → app/main`
(上位が下位へグローバルで依存。CDN/UMD 環境でも循環参照を避けます)

---

## 3. データモデル（簡易）

### 3.1 マスタ（data/masters.js → `window.MASTERS`）

```ts
type Store = { id: string; name: string; channel: '店舗'|'オンライン' };
type StoreBlockMap = Record<string, '東日本'|'中部'|'EC'|string>;
type LineMaster = { code: string; name: string };
type CategoryMaster = { code: string; name: string };

MASTERS = {
  STORES: Store[],
  STORE_BLOCK: StoreBlockMap,
  LINE_MASTER: LineMaster[],
  CATEGORY_MASTER: CategoryMaster[],
  NAME_BANK: Record<'070'|'071'|string, {items:string[], variants:string[]}>
}
```

### 3.2 サンプルデータ（data/fixtures.js → `window.Store.getFixtures()`）

```ts
// 参照整合性: PRODUCTS[*].id === INVENTORY.productId === SALES.productId
type Product = {
  id: string;        // 'SKU0001'...
  sku: string;       // '1234-5678-01'（8桁アイテム＋2桁SKU）
  name: string; price: number; dept: string;
  eol: string|null;  // 計画終了日
  itemId: string; itemName: string;
};

type InventoryRow = { productId: string; storeId: string; qty: number };
type SalesRow = { productId: string; storeId: string; date: 'YYYY-MM-DD'; units: number; salePrice: number; markdown: number };

getFixtures(): {
  PRODUCTS: Product[],
  INVENTORY: InventoryRow[],
  SALES: SalesRow[]
}
```

---

## 4. 主要 API（features & shared）

### 4.1 sales.js

```ts
buildIndexes(sales: SalesRow[], products: Product[]) => {
  idxByProductDate: Map<productId, Map<date,{units:number,revenue:number,markdown:number}>>,
  idxByProductStoreDate: Map<productId, Map<storeId, Map<date,{units:number}>>>
}
sumUnits(idxByProductDate, productId, startYmd, endYmd) => number
sumRevenue(idxByProductDate, productId, startYmd, endYmd) => number
sumUnitsByStore(idxByProductStoreDate, productId, storeId, startYmd, endYmd) => number
```

### 4.2 inventory.js

```ts
computeStoreMetricsForItems(
  items: Product[], storeId: string,
  buckets: {label,start,end}[], metric: 'units'|'revenue'|'profit', range: {start,end}
) => { inv:number; byBucket:number[]; total:number }
```

### 4.3 forecast.js

```ts
decideAction({forecastEnd?:string|null, eol?:string|null, byStore28: Record<storeId, number>})
  => { label:'発注'|'移管'|'値下'|'—', color:'primary'|'warning'|'error'|'default', reason:string }
```

### 4.4 productTaxonomy.js

```ts
itemCodeFromSku(sku: string) => string    // '1234-5678' を返す
groupItemsByAxis(items: Product[], axis: '全部門'|'部門'|'コーナー'|'ライン'|'カテゴリ'|'アイテム'|'SKU')
  => {label:string, items:Product[]}[]
```

### 4.5 shared/utils.js & shared/date.js

```ts
ymd(date: Date) => 'YYYY-MM-DD'
startOfWeek/Month/Quarter/Half/Year(date:Date) => Date
endOfWeek/Month/Quarter/Half/Year(date:Date) => Date
buildBuckets(range:{start,end}, granularity:'day'|'week'|'month'|'quarter'|'half'|'year'|'custom', custom:{intervalDays:number, columns:number})
  => { buckets: {label,start,end}[], limited:boolean, MAX_COLS:number }
fmtYen(n:number) => '￥1,234'
```

---

## 5. UI コンポーネントの責務

### 5.1 メインコンポーネント

* **App.js** - アプリケーション全体の制御中枢
  * **状態管理**: 期間・指標・軸・比較モード・モーダル表示状態
  * **データ処理**: features層の関数を呼び出し、整形済データを子コンポーネントに注入
  * **イベント統合**: 各コンポーネントからのコールバックを受け取り、状態を更新
  * **初期化**: `buildIndexes()`, `buildBuckets()` などの初期処理を実行
  * **Props注入**: 計算結果を各子コンポーネントに適切な形で渡す

### 5.2 フィルタ・選択系

* **Filter.js** - 基本フィルタ機能
  * **入力**: 期間（開始/終了）、拠点、部門の選択UI
  * **出力**: `onApply({start,end,location,department})` でAppに通知
  * **バリデーション**: 日付範囲の妥当性チェック
  * **再利用**: TransferFilterでも同じコンポーネントを使用

* **AxisSelector.js** - 軸選択とグループ化
  * **商品軸**: 全部門→部門→コーナー→ライン→カテゴリ→アイテム→SKU
  * **拠点軸**: 全店舗→事業→ブロック→店舗
  * **対象グループ**: 選択された軸に基づく商品・店舗の絞り込み
  * **動的更新**: 軸変更時に利用可能な選択肢を再計算

* **SelectorBar.js** - 集計設定
  * **粒度選択**: day/week/month/quarter/half/year/custom
  * **カスタム設定**: intervalDays, columns の入力UI
  * **制限表示**: MAX_COLS超過時の警告表示

### 5.3 表示・可視化系

* **SalesTable.js** - メイン集計テーブル
  * **基本構造**: 行＝軸（商品/店舗）、列＝期間バケット
  * **展開機能**:
    * 比較モードON: 店舗別内訳（SKUレベルでも展開可能）
    * 比較モードOFF: 階層展開（部門→コーナー→...→SKU）
  * **アクション列**: 各行に予測アクション（発注/移管/値下/—）を表示
  * **インタラクション**: 行クリック→展開、アクションクリック→詳細表示
  * **データ同期**: App状態変更時の自動再描画

* **RevenueChartDetailed.js** - 推移チャート
  * **Chart.js統合**: 期間別売上・利益の折れ線グラフ
  * **在庫ライン**: 概算在庫推移をオーバーレイ表示
  * **インタラクション**: ホバー時の詳細情報、期間選択
  * **レスポンシブ**: 画面サイズに応じたチャートリサイズ

### 5.4 モーダル・特殊機能系

* **TransferPlanner.js** - 移管計画モーダル
  * **モーダル制御**: 開閉状態、ESCキー・背景クリック対応
  * **タスク管理**: 移管タスクの一覧表示・編集・完了処理
  * **フィルタ統合**: TransferFilter.jsを内包
  * **データ連携**: App.jsとの双方向データバインディング
  * **自動更新**: forecast結果に基づくタスク自動生成

* **TaskManager.js** - タスク管理UI
  * **CRUD操作**: タスクの作成・更新・削除・完了
  * **優先度管理**: High/Medium/Low の視覚的表示
  * **期限管理**: 期限切れタスクのハイライト
  * **フィルタリング**: 状態・優先度・期限による絞り込み
  * **永続化**: localStorage への自動保存

* **TransferFilter.js** - 移管専用フィルタ
  * **店舗間フィルタ**: 移管元・移管先店舗の選択
  * **商品フィルタ**: 移管対象商品の絞り込み
  * **条件設定**: 在庫量・売上実績による自動フィルタ
  * **プリセット**: よく使う条件の保存・呼び出し

### 5.5 共通・ユーティリティ系

* **Section.js** - レイアウト統一
  * **構造**: タイトル・コンテンツ・アクション領域の標準レイアウト
  * **スタイル**: 統一されたパディング・マージン・ボーダー
  * **アクセシビリティ**: 適切なARIA属性・キーボードナビゲーション
  * **レスポンシブ**: モバイル対応のレイアウト調整

### 5.6 コンポーネント間連携パターン

```
App.js (状態管理)
  ├─ Filter.js → onApply() → App状態更新
  ├─ AxisSelector.js → onChange() → 軸変更
  ├─ SalesTable.js ← props注入 ← 計算済データ
  ├─ RevenueChart.js ← props注入 ← チャートデータ
  └─ TransferPlanner.js
      ├─ TaskManager.js ← タスクデータ
      └─ TransferFilter.js → onFilter() → タスク絞り込み
```

**重要な設計原則**:
- **単方向データフロー**: App → 子コンポーネント（props）
- **イベント駆動**: 子 → App（コールバック）
- **純粋コンポーネント**: propsのみに依存、副作用なし
- **責務分離**: 表示ロジックとビジネスロジックの分離

---

## 6. データフロー（主要シーケンス）

1. **index.html** が `shared → data → features → app` の順にロード
2. `Store.getFixtures()` が `PRODUCTS/INVENTORY/SALES` を提供
3. `App` 初期化 → `Utils.buildBuckets()` → `features.sales.buildIndexes()`
4. `App` は state（期間・軸・指標・比較モード等）に応じて**計算結果**を

   * `RevenueChartDetailed`（推移）
   * `SalesTable`（集計表）
     に**props で注入**
5. `SalesTable` で行クリック → 子展開 or 店舗内訳展開 → `App` に選択行を通知

---

## 7. 拡張指針（マイクロサービス連携を見据えて）

* **I/O 抽象化**

  * 今は `data/fixtures.js` がローカル生成。将来は `window.Api.fetchSales(range, scope)` などの**フェッチ層**を追加し、features の API は変えない（入力/出力契約を固定）。
* **バージョニング**

  * `window.__APP_VERSION__ = '0.1.0'` などを index.html で宣言。データ契約の破壊変更は minor/major で管理。
* **スキーマバリデーション**

  * 軽量に `features` 入口で `validate(Product[])` のようなチェックを追加可能。
* **演算の切り出し**

  * 大規模化したら `features` の純関数群を WASM / Web Worker に移設して UI スレッドを軽くする。
* **権限・フィルタ**

  * 拠点/事業などは**サーバ側フィルタ**も想定。クエリパラメータ契約：`{stores?: string[], channels?: string[], blocks?: string[]}`。

---

## 8. 非機能（簡潔）

* **性能**:

  * 期間→バケット数を最大 24 にクランプ。
  * インデックス構築は初回のみ、以後は参照・加算。
* **安定性**:

  * 依存順序を厳守（404/未定義参照回避）。
* **エラー処理**:

  * 404/ロード失敗時は index.html で `onerror` ログ出し。
  * データ不整合は features 側で `0` フォールバック。

---

## 9. 開発運用メモ

* **ローカル起動**: 任意の静的サーバ（VSCode Live Preview 可）。
* **読み込み順序**は**必須**：shared → data → features → app/component → app/App → app/main。
* **コーディング規約（抜粋）**

  * features/shared は**副作用禁止（純関数）**
  * app から features を呼ぶ。features から app は参照しない
  * グローバル公開は `window.Xxx = { ... }` の**名前空間ごと**のみ

---

## 10. 将来ロードマップ（例）

* [ ] 実在庫 API 接続（BFF 経由）
* [ ] 需要予測モデルの差し替え（forecast.js を Worker 化）
* [ ] 価格感応度/粗利最大化のシミュレーション UI
* [ ] ToDo/イベントの永続化（localStorage → API）
* [ ] 多言語化（i18n テーブルの shared 追加）

---

## 11. 開発者向けクイックスタート

### セットアップ

1. **必要な環境**
   - モダンブラウザ（Chrome 90+, Firefox 88+, Safari 14+）
   - 静的ファイルサーバー

2. **ローカル開発**
   ```bash
   # VSCode Live Preview（推奨）
   # 1. VSCode で index.html を開く
   # 2. 右クリック → "Show Preview"
   
   # または任意の静的サーバー
   python -m http.server 8000
   # http://localhost:8000 でアクセス
   ```

3. **ファイル編集時の注意**
   - **読み込み順序を厳守**: `shared → data → features → app`
   - **循環参照を避ける**: 上位モジュールは下位を参照しない
   - **副作用禁止**: features/shared は純関数のみ

### デバッグ

```javascript
// ブラウザコンソールで利用可能
window.MASTERS.STORES          // マスタデータ確認
window.Store.getFixtures()     // サンプルデータ確認
window.Utils.ymd(new Date())   // ユーティリティ関数テスト
```

### よくある問題

- **404エラー**: ファイルパスの確認、静的サーバーの起動確認
- **undefined参照**: script読み込み順序の確認
- **データ不整合**: fixtures.jsの参照整合性確認

---

## 12. 変更履歴（Changelog）

### v0.2.0 (2024-12)
- **追加**: TransferPlanner モーダル実装
- **追加**: 移管フィルタ UI（モーダル内配置）
- **改善**: tasks 初期化方法の最適化
- **修正**: App/TransferPlanner の状態同期
- **ドキュメント**: 開発者向けクイックスタート追加

### v0.1.0 (2024-11)
- **初回リリース**: 基本アーキテクチャ実装
- **実装**: 売上分析・在庫管理・予測機能
- **実装**: React UI コンポーネント群
- **実装**: CDN/UMD ベースの依存管理

---

## 13. アーキテクチャ詳細補足

### TransferPlanner 仕様
- **UI配置**: モーダル内でフィルタ編集可能
- **データフロー**: App → TransferPlanner → Filter → App
- **状態管理**: App.js で一元管理、props経由で注入
- **tasks初期化**: `forecast.decideAction()` の結果をベースに自動生成

### 移管フィルタ仕様
- **場所**: TransferPlannerモーダル内の専用セクション
- **機能**: 店舗間移管対象の絞り込み
- **連携**: 既存Filter.jsコンポーネントを再利用

---

**この構成のポイント**

* UI と計算・データ生成を**疎結合**に分離 → モジュール単位で差し替えやすい
* すべて**フロントエンドのみ**で完結（要件定義・試作が軽い）
* 将来のマイクロサービス/サーバ接続は**data 層の差し替えだけ**で可能（features と app の契約は維持）
