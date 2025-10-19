# プロダクト概要 & モジュール関係（簡易仕様書）

このドキュメントは、要件定義～拡張フェーズを想定した「フロントエンドのみ」で完結する構成の**全体像**と**各モジュールの関係**をまとめた簡潔な仕様書です。
ビルド不要（CDN＋Umd）で動作し、将来は任意の BFF/マイクロサービスにスムーズに接続できる前提です。

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
│   └─ productTaxonomy.js  # groupItemsByAxis(), itemCodeFromSku()
├─ app/
│   ├─ main.js             # ReactDOM.render / ルート起動
│   ├─ App.js              # 画面全体の状態保持と組み立て
│   └─ component/
│       ├─ Section.js
│       ├─ Filter.js
│       ├─ SelectorBar.js
│       ├─ AxisSelector.js
│       ├─ RevenueChartDetailed.js
│       └─ SalesTable.js
```

**読み込み順の要点（index.html の `<script>`）**
`shared → data → features → app/component → app/App → app/main`
（上位が下位へグローバルで依存。CDN/UMD 環境でも循環参照を避けます）

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

* **App.js**

  * 期間・指標・軸など**画面全体の状態**を保持
  * features/shared の関数を呼び出し、整形済データを子へ渡す
  * 比較モード（店舗間比較）の ON/OFF 管理
* **Filter.js**

  * 期間/拠点/部門の入力 → `onApply({start,end,location,department})` を App に返却
* **SelectorBar.js**

  * 集計粒度・カスタムバケットの UI。`setGranularity`, `setCustom` を制御
* **AxisSelector.js**

  * 商品軸（全部門～SKU）・拠点軸（全店舗/事業/ブロック/店舗）・対象グループの選択
* **SalesTable.js**

  * 行＝軸、列＝期間の**集計テーブル**描画
  * 行展開：

    * 比較モードON：**店舗内訳**を表示（SKU でも展開可能）
    * 比較モードOFF：**子分類**（部門→コーナー→…→SKU）を段階展開
* **RevenueChartDetailed.js**

  * 期間別シリーズ＋在庫ライン（概算）を Chart.js で描画
* **Section.js**

  * セクション枠・タイトル・アクション領域の統一 UI

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

**この構成のポイント**

* UI と計算・データ生成を**疎結合**に分離 → モジュール単位で差し替えやすい
* すべて**フロントエンドのみ**で完結（要件定義・試作が軽い）
* 将来のマイクロサービス/サーバ接続は**data 層の差し替えだけ**で可能（features と app の契約は維持）
