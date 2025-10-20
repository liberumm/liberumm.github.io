# 小売業向け壶上・在庫分析システム 設計書

> **Version**: 0.2.1 | **Last Updated**: 2025-01

## ⚠️ 免責事項

**本ドキュメントおよび関連するシステムは、システム構想用のモックアップです。**

- **目的**: 限りなく実際の動作に近づけた定義をするためのプロトタイプ
- **データ**: 全てダミーデータであり、実際の業務データは含まれません
- **セキュリティ**: 実装時は本格的なセキュリティ対策の再検討が必要です
- **運用**: 本番環境での使用には追加の検証・テストが必要です
- **責任**: 本モックの使用による損害について一切の責任を負いません

**実際のシステム実装時は、セキュリティ、パフォーマンス、運用面での十分な検討と対策を行ってください。**

---

## 📝 ドキュメント作成方針

### 基本方針
本設計書は、**アーキテクチャに依存せず、ゼロから再構築可能**な仕様書として作成されています。

### 記載内容

1. **ビジネスロジックの明確化**
   - 計算ロジック、判定ルール、アルゴリズムを詳細に記載
   - 入力・出力・処理フローを明確に定義
   - ビジネスルールとデータ整合性を明記

2. **技術非依存の記述**
   - 特定のフレームワークに依存しない概念レベルの記述
   - データ構造と処理フローを抽象化
   - API契約を明確に定義（将来のサーバー連携用）

3. **再実装可能性**
   - 他のフレームワーク（Vue, Angular, Svelte等）でも実装可能
   - サーバーサイド（Node.js, Python, Java等）でも実装可能
   - モバイルアプリ（React Native, Flutter等）でも実装可能

4. **実装例の位置づけ**
   - 現在のReact実装は「一例」として記載
   - 実装詳細よりも仕様を優先
   - アーキテクチャ変更時の影響範囲を最小化

### 想定読者

- **システムアーキテクト**: 全体設計の理解と検証
- **開発者**: 他技術スタックでの再実装
- **プロジェクトマネージャー**: 要件と仕様の確認
- **品質保証担当**: テスト設計と検証

### 使用方法

1. **新規構築時**
   - 要件定義とビジネスロジックを基に設計
   - 選択した技術スタックで実装
   - データ構造とAPI契約を遵守

2. **アーキテクチャ変更時**
   - ビジネスロジックは変更不要
   - データ層とUI層のみ再実装
   - 既存のテストケースを流用

3. **機能拡張時**
   - 要件定義を更新
   - ビジネスロジックを追加
   - 実装例を更新

---

## 📚 目次

### 1. [要件定義](#1-要件定義)
- 1.1 [システム概要](#11-システム概要)
  - 1.1.1 目的
  - 1.1.2 対象ユーザー
  - 1.1.3 システムスコープ
  - 1.1.4 ユーザー利用フロー
- 1.2 [機能要件](#12-機能要件)
  - 1.2.1 データ分析・可視化機能
  - 1.2.2 フィルタリング・検索機能
  - 1.2.3 予測・提案機能
  - 1.2.4 タスク管理機能
  - 1.2.5 データ表示設定機能
- 1.3 [非機能要件](#13-非機能要件)
  - 1.3.1 性能要件
  - 1.3.2 可用性要件
  - 1.3.3 セキュリティ要件
  - 1.3.4 運用要件
- 1.4 [制約条件](#14-制約条件)
  - 1.4.1 技術制約
  - 1.4.2 運用制約

### 2. [基本設計書](#2-基本設計書)
- 2.1 [システム構成](#21-システム構成)
  - 2.1.1 アーキテクチャ概要
  - 2.1.2 レイヤー責務
  - 2.1.3 モジュール構成
  - 2.1.4 依存関係
- 2.2 [データ設計](#22-データ設計)
  - 2.2.1 エンティティ関係図
  - 2.2.2 データ仕様（STORES/PRODUCTS/SALES/INVENTORY）
  - 2.2.3 参考DDL（PostgreSQL）
  - 2.2.4 参考集計SQL
- 2.3 [画面設計](#23-画面設計)
  - 2.3.1 画面構成
  - 2.3.2 画面遷移図
  - 2.3.3 状態管理設計
  - 2.3.4 主要コンポーネント一覧

### 3. [詳細設計書](#3-詳細設計書)
- 3.1 [ビジネスロジック詳細仕様](#31-ビジネスロジック詳細仕様)
  - 3.1.1 売上分析ロジック（features/sales.js）
    - データ構造
    - インデックス構築
    - 集計関数
  - 3.1.2 在庫分析ロジック（features/inventory.js）
    - 在庫メトリクス計算
    - 店舗別分析
    - 在庫回転率
  - 3.1.3 予測・アクション判定ロジック（features/forecast.js）
    - アクション判定ルール
    - 在庫枯渇予測
    - 優先度判定
  - 3.1.4 商品分類ロジック（features/productTaxonomy.js）
    - 階層構造
    - グループ化関数
    - SKU解析
  - 3.1.5 日付・期間ロジック（shared/date.js）
    - 期間計算関数
    - バケット生成
    - タイムゾーン処理
  - 3.1.6 データ整合性ルール
    - 参照整合性
    - ビジネスルール
    - 計算ルール
- 3.2 [アーキテクチャ非依存の仕様](#32-アーキテクチャ非依存の仕様)
  - 3.2.1 データフロー（概念）
  - 3.2.2 処理シーケンス
    - 初期化フェーズ
    - フィルタ適用フェーズ
    - 集計フェーズ
    - 表示フェーズ
  - 3.2.3 API契約（将来のBFF連携用）
- 3.3 [UIコンポーネント設計](#33-uiコンポーネント設計)
  - 3.3.1 App.js - 状態管理
  - 3.3.2 コンポーネント間連携
  - 3.3.3 主要コンポーネント詳細
    - Filter.js
    - AxisSelector.js
    - SalesTable.js
    - RevenueChartDetailed.js
    - TransferPlanner.js
    - ActionPanel.js
- 3.4 [パフォーマンス設計](#34-パフォーマンス設計)
  - 3.4.1 データ処理最適化
  - 3.4.2 UI描画最適化
  - 3.4.3 メモリ管理

### 4. [実装ガイドライン](#4-実装ガイドライン)
- 4.1 [コーディング規約](#41-コーディング規約)
  - 4.1.1 JavaScript規約
    - ES6+構文
    - 関数型プログラミング
    - 命名規則
  - 4.1.2 React規約
    - Hooks使用
    - PropTypes
    - 状態管理
- 4.2 [ファイル構成](#42-ファイル構成)
  - 4.2.1 ディレクトリ構造（全ファイル）
  - 4.2.2 読み込み順序（必須）
  - 4.2.3 依存関係マトリクス
  - 4.2.4 ファイル命名規則
- 4.3 [開発環境セットアップ](#43-開発環境セットアップ)
  - 4.3.1 必要なツール
  - 4.3.2 ローカル開発サーバー
  - 4.3.3 デバッグ方法

### 5. [運用・保守](#5-運用保守)
- 5.1 [監視・ログ](#51-監視ログ)
  - 5.1.1 エラー監視
  - 5.1.2 パフォーマンス監視
  - 5.1.3 ユーザー行動ログ
- 5.2 [セキュリティ](#52-セキュリティ)
  - 5.2.1 脆弱性対策
    - XSS対策
    - 依存関係管理
  - 5.2.2 プライバシー保護
    - 個人情報取り扱い
    - データ暗号化
- 5.3 [バックアップ・復旧](#53-バックアップ復旧)
  - 5.3.1 データバックアップ
  - 5.3.2 障害復旧手順
- 5.4 [保守作業](#54-保守作業)
  - 5.4.1 定期メンテナンス
  - 5.4.2 データ更新手順

### 6. [今後の拡張計画](#6-今後の拡張計画)
- 6.1 [短期計画（3ヶ月）](#61-短期計画3ヶ月)
  - 詳細フィルタ機能
  - レスポンシブ対応強化
  - 大量データ対応
- 6.2 [中期計画（6ヶ月）](#62-中期計画6ヶ月)
  - BFF接続準備
  - ユーザー管理機能
  - サーバーサイド連携
- 6.3 [長期計画（1年）](#63-長期計画1年)
  - 機能別サービス分割
  - WebSocket即時更新
  - 機械学習予測

### 7. [付録](#付録)
- A. [用語集](#a-用語集)
- B. [参考資料](#b-参考資料)
  - React公式ドキュメント
  - Chart.js公式ドキュメント
  - JavaScript Style Guide
  - Web Performance Best Practices
- C. [変更履歴](#c-変更履歴)
  - バージョン管理
  - ファイル別更新履歴
- D. [トラブルシューティング](#d-トラブルシューティング)
  - よくある問題と解決方法
  - パフォーマンス問題
  - ブラウザ互換性問題

---

このドキュメントは、小売業向け売上・在庫分析システムの要件定義から詳細設計までを包括的にまとめた設計書です。
フロントエンドのみで完結する構成で、ビルド不要（CDN＋UMD）で動作し、将来のBFF/マイクロサービス接続を前提とした設計となっています。

---

# 1. 要件定義

## 1.1 システム概要

### 目的
小売業における売上・在庫データの効率的な分析と意思決定支援を目的とした、Webベースの分析システムを構築する。

### 対象ユーザー
- **主要ユーザー**: 店舗運営担当者、商品企画担当者、エリアマネージャー
- **副次ユーザー**: 経営陣、データアナリスト

### システムスコープ
- 売上データの多軸分析（商品軸・店舗軸・時系列軸）
- 在庫状況の可視化と予測
- 商品移管・値下げ等のアクション提案
- タスク管理機能

### ユーザー利用フロー

#### 基本分析フロー
```
1. ログイン/アクセス
   ↓
2. フィルタ設定
   - 期間選択（開始日・終了日）
   - 拠点選択（全店舗/特定店舗）
   - 部門選択（全部門/特定部門）
   ↓
3. 軸選択
   - 商品軸（部門/ライン/アイテム/SKU）
   - 店舗軸（全店舗/ブロック/店舗）
   ↓
4. 表示設定
   - 集計粒度（日/週/月/四半期）
   - 表示指標（売上/利益/数量）
   - 比較モードON/OFF
   ↓
5. データ閲覧
   - 集計テーブル表示
   - 推移チャート表示
   - 階層展開/折りたたみ
   ↓
6. アクション実行
   - 発注/移管/値下げの判断
   - タスク登録
```

#### 移管計画フロー
```
1. アクション列で「移管」をクリック
   ↓
2. 移管計画モーダル表示
   - 対象商品情報表示
   - 店舗別在庫状況表示
   ↓
3. 移管元・移管先選択
   - 在庫過多店舗から選択
   - 在庫不足店舗へ選択
   ↓
4. 移管数量決定
   - 推奨数量表示
   - 手動調整可能
   ↓
5. タスク登録
   - 優先度設定
   - 期限設定
   - 担当者設定
```

#### タスク管理フロー
```
1. タスク管理ボタンクリック
   ↓
2. タスク一覧表示
   - 未完了タスク
   - 期限切れタスク
   - 完了タスク
   ↓
3. タスク詳細確認
   - 対象商品・店舗
   - 実施内容
   - 期限・優先度
   ↓
4. タスク実行
   - ステータス更新
   - 実施結果記録
   - 完了マーク
```

## 1.2 機能要件

### F001: データ分析・可視化機能
- **F001-1**: 売上データの期間別集計表示
- **F001-2**: 商品軸での階層展開（部門→コーナー→ライン→カテゴリ→アイテム→SKU）
- **F001-3**: 店舗軸での階層展開（全店舗→事業→ブロック→店舗）
- **F001-4**: 時系列チャートによる推移表示
- **F001-5**: 在庫推移の可視化

### F002: フィルタリング・検索機能
- **F002-1**: 期間指定フィルタ（開始日・終了日）
- **F002-2**: 拠点選択フィルタ
- **F002-3**: 部門選択フィルタ
- **F002-4**: 複合条件での絞り込み

### F003: 予測・提案機能
- **F003-1**: 在庫枯渇予測
- **F003-2**: アクション提案（発注・移管・値下げ）
- **F003-3**: 移管計画の自動生成

### F004: タスク管理機能
- **F004-1**: タスクの作成・編集・削除
- **F004-2**: 優先度設定（High/Medium/Low）
- **F004-3**: 期限管理
- **F004-4**: 完了状態管理

### F005: データ表示設定機能
- **F005-1**: 集計粒度選択（日次・週次・月次・四半期・半期・年次・カスタム）
- **F005-2**: 表示指標選択（売上・利益・数量）
- **F005-3**: 比較モード切替

## 1.3 非機能要件

### N001: 性能要件
- **N001-1**: 初期表示時間: 3秒以内
- **N001-2**: フィルタ適用時間: 1秒以内
- **N001-3**: 同時接続ユーザー数: 50名

### N002: 可用性要件
- **N002-1**: 稼働率: 99.0%以上（営業時間内）
- **N002-2**: メンテナンス時間: 月1回、2時間以内

### N003: セキュリティ要件
- **N003-1**: データの暗号化（HTTPS通信）
- **N003-2**: アクセスログの記録
- **N003-3**: 個人情報の適切な取り扱い

### N004: 運用要件
- **N004-1**: ブラウザ対応: Chrome, Firefox, Safari, Edge（最新版）
- **N004-2**: レスポンシブ対応（PC・タブレット）
- **N004-3**: ビルド不要での動作

## 1.4 制約条件

### 技術制約
- フロントエンドのみでの実装（サーバーサイド処理なし）
- CDN + UMDでの動作
- 外部ライブラリの最小化

### 運用制約
- 既存システムとの連携は将来対応
- データは静的ファイルまたはローカルストレージ

---

# 2. 基本設計書

## 2.1 システム構成

### アーキテクチャ概要
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │    Business     │    │      Data       │
│     Layer       │    │     Logic       │    │     Layer       │
│                 │    │     Layer       │    │                 │
│ ・UI Components │    │ ・Features      │    │ ・Masters       │
│ ・State Mgmt    │◄──►│ ・Calculations  │◄──►│ ・Fixtures      │
│ ・Event Handling│    │ ・Predictions   │    │ ・Local Storage │
└─────────────────┘    └─────────────────┘    └─────────────────┘
           ▲                       ▲                       ▲
           │                       │                       │
           ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Shared Utilities Layer                       │
│  ・Date Utils  ・Format Utils  ・Store Utils  ・Common Utils   │
└─────────────────────────────────────────────────────────────────┘
```

### レイヤー責務

#### Presentation Layer (app/)
- **責務**: ユーザーインターフェース、状態管理、イベント処理
- **主要モジュール**:
  - `App.js`: アプリケーション全体の状態管理とコンポーネント統合
  - `main.js`: ReactDOM.render による起動処理
  - `components/Filter.js`: 期間・拠点・部門フィルタUI
  - `components/AxisSelector.js`: 商品軸・店舗軸選択UI
  - `components/SalesTable.js`: 売上集計テーブル表示
  - `components/RevenueChartDetailed.js`: Chart.js による推移グラフ
  - `components/TransferPlanner.js`: 移管計画モーダル
  - `components/SelectorBar.js`: 集計粒度・指標選択UI
  - `components/MarkdownModal.js`: 値下げモーダル
  - `components/OrderModal.js`: 発注モーダル
- **技術**: React (UMD), 状態管理はReact Hooks

#### Business Logic Layer (features/)
- **責務**: ビジネスロジック、計算処理、予測アルゴリズム
- **主要モジュール**:
  - `sales.js`: 売上データのインデックス構築・集計計算
  - `inventory.js`: 在庫メトリクス計算・店舗別在庫分析
  - `forecast.js`: 在庫枯渇予測・アクション判定ロジック
  - `productTaxonomy.js`: 商品階層グループ化・SKU解析
  - `actions.js`: アクション実行ロジック
  - `tasks_data.js`: タスクデータ管理
  - `events_data.js`: イベントデータ管理
  - `ActionPanel.js`: アクションパネルUI
- **特徴**: 純粋関数、UIから独立、副作用なし

#### Data Layer (data/)
- **責務**: データ定義、サンプルデータ生成、データアクセス
- **主要モジュール**:
  - `masters.js`: 店舗・商品・分類マスタの静的定義
  - `fixtures.js`: サンプル売上・在庫データの動的生成
- **データソース**: 静的定義、ローカルストレージ、将来的にはAPI連携

#### Shared Utilities Layer (shared/)
- **責務**: 共通機能、ユー# 商品ダッシュボード 設計書

## 目次

### 1. 概要
- 1.1 システム概要
- 1.2 主要機能
- 1.3 技術スタック
- 1.4 免責事項

### 2. 基本設計
- 2.1 アーキテクチャ概要
  - 2.1.1 レイヤー構成
  - 2.1.2 モジュール構成
  - 2.1.3 依存関係
- 2.2 データ設計
  - 2.2.1 エンティティ関係図
  - 2.2.2 データ仕様（STORES/PRODUCTS/SALES/INVENTORY）
  - 2.2.3 参考DDL（PostgreSQL）
  - 2.2.4 参考集計SQL
- 2.3 画面設計
  - 2.3.1 画面構成
  - 2.3.2 画面遷移図
  - 2.3.3 状態管理設計

### 3. 詳細設計書
- 3.1 ビジネスロジック詳細仕様
  - 3.1.1 売上分析ロジック（features/sales.js）
  - 3.1.2 在庫分析ロジック（features/inventory.js）
  - 3.1.3 予測・アクション判定ロジック（features/forecast.js）
  - 3.1.4 商品分類ロジック（features/productTaxonomy.js）
  - 3.1.5 日付・期間ロジック（shared/date.js）
  - 3.1.6 データ整合性ルール
- 3.2 アーキテクチャ非依存の仕様
  - 3.2.1 データフロー（概念）
  - 3.2.2 処理シーケンス
  - 3.2.3 API契約（将来のBFF連携用）
- 3.3 UIコンポーネント設計
  - 3.3.1 App.js - 状態管理
  - 3.3.2 コンポーネント間連携
  - 3.3.3 主要コンポーネント一覧
- 3.4 パフォーマンス設計
  - 3.4.1 データ処理最適化
  - 3.4.2 UI描画最適化

### 4. 実装ガイドライン
- 4.1 コーディング規約
  - 4.1.1 JavaScript規約
  - 4.1.2 React規約
- 4.2 ファイル構成
  - 4.2.1 ディレクトリ構造（全ファイル）
  - 4.2.2 読み込み順序（必須）
  - 4.2.3 依存関係マトリクス
- 4.3 開発環境セットアップ

### 5. 運用・保守
- 5.1 監視・ログ
  - 5.1.1 エラー監視
- 5.2 セキュリティ
  - 5.2.1 脆弱性対策
  - 5.2.2 プライバシー保護

### 6. 今後の拡張計画
- 6.1 短期計画（3ヶ月）
- 6.2 中期計画（6ヶ月）
- 6.3 長期計画（1年）

### 付録
- A. 用語集
- B. 参考資料
- C. 変更履歴

---

# 1. 概要

## 1.1 システム概要

本システムは、小売業における商品の売上・在庫・予測を統合的に分析し、発注・移管・値下げなどのアクションを推奨するダッシュボードです。

## 1.2 主要機能

- **売上分析**: 商品別・店舗別・期間別の売上集計
- **在庫分析**: 在庫回転率・枯渇予測
- **アクション推奨**: 発注・移管・値下げの自動判定
- **タスク管理**: 推奨アクションのワークフロー管理
- **イベント管理**: セール・キャンペーン情報の表示

## 1.3 技術スタック

- **フロントエンド**: React 18 (UMD), Material-UI 5, Chart.js 4
- **データ処理**: JavaScript (ES6+), Map/Set構造
- **デプロイ**: 静的ホスティング（GitHub Pages等）

## 1.4 免責事項

本システムはプロトタイプであり、実運用には追加の検証・セキュリティ対策が必要です。

---

# 2. 基本設計

## 2.1 アーキテクチャ概要

### 2.1.1 レイヤー構成

```
┌─────────────────────────────────────────┐
│  Presentation Layer (app/)              │  ← React Components
├─────────────────────────────────────────┤
│  Business Logic Layer (features/)       │  ← Domain Logic
├─────────────────────────────────────────┤
│  Data Layer (data/)                     │  ← Masters & Fixtures
├─────────────────────────────────────────┤
│  Utility Layer (shared/)                │  ← Pure Functions
└─────────────────────────────────────────┘
```

### 2.1.2 モジュール構成

#### Utility Layer (shared/)
共通ユーティリティ関数
- **主要モジュール**:
  - `date.js`: 日付計算・期間バケット生成
  - `format.js`: 通貨・数値フォーマット
  - `utils.js`: 汎用ユーティリティ関数
  - `store.js`: グローバルデータアクセス薄層
  - `section.js`: UI共通レイアウト

## 2.2 データ設計

### エンティティ関係図
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   STORES    │    │  PRODUCTS   │    │ INVENTORY   │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │    │ id (PK)     │    │ productId   │◄─┐
│ name        │    │ sku         │    │ storeId     │◄─┼─┐
│ channel     │    │ name        │    │ qty         │  │ │
└─────────────┘    │ price       │    └─────────────┘  │ │
       ▲           │ dept        │                     │ │
       │           │ eol         │    ┌─────────────┐  │ │
       │           │ itemId      │    │    SALES    │  │ │
       │           │ itemName    │    ├─────────────┤  │ │
       │           └─────────────┘    │ productId   │──┘ │
       │                  ▲           │ storeId     │────┘
       │                  │           │ date        │
       └──────────────────┼───────────│ units       │
                          │           │ salePrice   │
                          │           │ markdown    │
                          │           └─────────────┘
                          │
┌─────────────┐          │           ┌─────────────┐
│LINE_MASTER  │          │           │CATEGORY_    │
├─────────────┤          │           │MASTER       │
│ code (PK)   │          │           ├─────────────┤
│ name        │          │           │ code (PK)   │
└─────────────┘          │           │ name        │
                         │           └─────────────┘
┌─────────────┐          │
│STORE_BLOCK  │          │
├─────────────┤          │
│ storeId(PK) │──────────┘
│ block       │
└─────────────┘
```

### データ仕様

#### STORES（店舗マスタ）
| 項目 | 型 | 必須 | 説明 |
|------|----|----|------|
| id | string | ○ | 店舗ID（主キー） |
| name | string | ○ | 店舗名 |
| channel | string | ○ | チャネル（'店舗'/'オンライン'） |

#### PRODUCTS（商品マスタ）
| 項目 | 型 | 必須 | 説明 |
|------|----|----|------|
| id | string | ○ | 商品ID（主キー） |
| sku | string | ○ | SKUコード（8桁アイテム+2桁SKU） |
| name | string | ○ | 商品名 |
| price | number | ○ | 価格 |
| dept | string | ○ | 部門 |
| eol | string/null | - | 計画終了日（YYYY-MM-DD） |
| itemId | string | ○ | アイテムID |
| itemName | string | ○ | アイテム名 |

#### SALES（売上トランザクション）
| 項目 | 型 | 必須 | 説明 | 計算式 |
|------|----|----|------|--------|
| productId | string | ○ | 商品ID（外部キー） | - |
| storeId | string | ○ | 店舗ID（外部キー） | - |
| date | string | ○ | 売上日（YYYY-MM-DD） | - |
| units | number | ○ | 販売数量 | - |
| salePrice | number | ○ | 売上単価 | - |
| markdown | number | ○ | 値下げ額 | - |
| **計算項目** | | | | |
| revenue | number | - | 売上金額 | `units × salePrice` |
| profit | number | - | 利益 | `revenue - (units × cost) - markdown` |
| grossMargin | number | - | 粗利率 | `profit / revenue × 100` |

#### INVENTORY（在庫データ）
| 項目 | 型 | 必須 | 説明 |
|------|----|----|------|
| productId | string | ○ | 商品ID（外部キー） |
| storeId | string | ○ | 店舗ID（外部キー） |
| qty | number | ○ | 在庫数量 |

### 参考: DDL (PostgreSQL)

```sql
CREATE TABLE stores (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    channel VARCHAR(20) NOT NULL
);

CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    sku VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    dept VARCHAR(10) NOT NULL,
    eol DATE,
    item_id VARCHAR(20) NOT NULL
);

CREATE TABLE sales (
    product_id VARCHAR(50) REFERENCES products(id),
    store_id VARCHAR(50) REFERENCES stores(id),
    date DATE NOT NULL,
    units INTEGER NOT NULL,
    sale_price DECIMAL(10,2) NOT NULL,
    markdown DECIMAL(10,2) DEFAULT 0
);

CREATE INDEX idx_sales_product_date ON sales(product_id, date);

CREATE TABLE inventory (
    product_id VARCHAR(50) REFERENCES products(id),
    store_id VARCHAR(50) REFERENCES stores(id),
    qty INTEGER NOT NULL,
    PRIMARY KEY (product_id, store_id)
);
```

### 参考: 集計SQL

```sql
-- 商品別売上
SELECT p.name, SUM(s.units * s.sale_price) as revenue
FROM sales s JOIN products p ON s.product_id = p.id
WHERE s.date BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY p.name ORDER BY revenue DESC;

-- 在庫枯渇予測
WITH avg_sales AS (
    SELECT product_id, AVG(units) as avg_daily
    FROM sales WHERE date >= CURRENT_DATE - 28
    GROUP BY product_id
)
SELECT p.name, i.qty, 
       CURRENT_DATE + (i.qty / a.avg_daily)::INT as depletion
FROM inventory i
JOIN products p ON i.product_id = p.id
JOIN avg_sales a ON i.product_id = a.product_id;
```

## 2.3 画面設計

### 2.3.1 画面構成

実際の実装に基づく画面レイアウト：

```
┌─────────────────────────────────────────────────────────────────┐
│ AppBar: 商品ダッシュボード                    期間: YYYY-MM-DD 〜 │
├─────────────────────────────────────────────────────────────────┤
│ Section 1: フィルター (Filter.js)                               │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐   │
│ │ 期間選択     │ │ 拠点選択     │ │ 部門選択     │ │ 適用    │   │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘   │
├─────────────────────────────────────────────────────────────────┤
│ Section 2: 売上推移 (RevenueChartDetailed.js)                  │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ Chart.js - 時系列グラフ（売上 + 在庫推移）                 │   │
│ └───────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│ Section 3: 集計設定 (SelectorBar.js)                            │
│ ┌─────────────┐ ┌─────────────┐                                │
│ │ 集計粒度     │ │ カスタム設定 │                                │
│ └─────────────┘ └─────────────┘                                │
├─────────────────────────────────────────────────────────────────┤
│ Section 4: 分類軸 (AxisSelector.js)                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│ │ 商品軸       │ │ 拠点軸       │ │ 対象グループ │               │
│ └─────────────┘ └─────────────┘ └─────────────┘               │
│ 商品コードの体系：4桁＋4桁＋2桁（カテゴリ/アイテム/SKU）        │
├─────────────────────────────────────────────────────────────────┤
│ Section 5: アクション操作 (ActionPanel.js)                      │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│ │ アクション   │ │ 検索         │ │ 列フィルタ   │               │
│ │ 絞り込み     │ │              │ │              │               │
│ └─────────────┘ └─────────────┘ └─────────────┘               │
├─────────────────────────────────────────────────────────────────┤
│ Section 6: 販売実績テーブル (SalesTable.js)                     │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │ 表示モード: [詳細/簡潔] 指標: [販売点数/売上高/粗利高]  │   │
│ │ トグル: [店舗間比較] [ROI列] [前年値] [前年差] [前年比] │   │
│ ├─────────────────────────────────────────────────────────┤   │
│ │ 行: 商品軸（全部門/部門/コーナー/ライン/カテゴリ/       │   │
│ │              アイテム/SKU）                              │   │
│ │ 列: 期間バケット + 集計列 + アクション列                │   │
│ │ セル: チェックボックス、数値、アクションボタン          │   │
│ └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│ Section 7: やることリスト（タスク管理）                         │
│ ┌──────────────────────┐ ┌──────────────────────┐            │
│ │ 未完了（対応が必要） │ │ 完了 / 対応済み      │            │
│ │ - 発注 - XX件        │ │ - 移管 - XX件        │            │
│ │ - 移管 - XX件        │ │ - 値下 - XX件        │            │
│ │ - 値下 - XX件        │ │                      │            │
│ │ [承認] [見送り]      │ │                      │            │
│ └──────────────────────┘ └──────────────────────┘            │
├─────────────────────────────────────────────────────────────────┤
│ Section 8: イベントリスト                                        │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│ │ イベント1    │ │ イベント2    │ │ イベント3    │             │
│ │ 日付・場所   │ │ 日付・場所   │ │ 日付・場所   │             │
│ └─────────────┘ └─────────────┘ └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘

【モーダル】
┌─────────────────────────────────────────────────────────────────┐
│ Dialog: 発注 / 値下 / 移管                                       │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │ KPIカード: 直近売上 / 予測売上 / 理想売上 / 販売終了日  │   │
│ ├─────────────────────────────────────────────────────────┤   │
│ │ フォーム: 数量・日付・店舗・確認者など                  │   │
│ │ （発注: OrderModal / 値下: MarkdownModal /              │   │
│ │  移管: TransferPlanner）                                │   │
│ ├─────────────────────────────────────────────────────────┤   │
│ │ [キャンセル] [登録（申請）] [承認（本部）]              │   │
│ │ [差戻（本部）] [取下（店舗）]                           │   │
│ └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3.2 画面遷移図
```
┌─────────────────────────────────────────────────────────────┐
│                    メイン画面 (App.js)                      │
│  - フィルター                                               │
│  - 売上推移チャート                                         │
│  - 集計設定                                                 │
│  - 分類軸                                                   │
│  - アクション操作                                           │
│  - 販売実績テーブル ◄─ 行クリック ─► アクションボタン      │
│  - やることリスト                                           │
│  - イベントリスト                                           │
└─────────────────────────────────────────────────────────────┘
       │                   │                   │
       │ [発注]            │ [値下]            │ [移管]
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ OrderModal  │    │MarkdownModal│    │TransferPlan │
│ Dialog      │    │ Dialog      │    │ner Dialog   │
│             │    │             │    │             │
│ [登録/承認] │    │ [登録/承認] │    │ [自動計算]  │
│ [差戻/取下] │    │ [差戻/取下] │    │ [登録/承認] │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┴───────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ タスク追加       │
                  │ (addTask)       │
                  └─────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ やることリスト   │
                  │ 更新             │
                  └─────────────────┘
```

### 2.3.3 状態管理設計

App.jsで管理される主要な状態：

```javascript
// フィルタ状態
const [range, setRange] = useState({start, end});
const [locFilter, setLocFilter] = useState('全社');
const [deptFilter, setDeptFilter] = useState('全部門');

// 表示設定
const [granularity, setGranularity] = useState('week');
const [metric, setMetric] = useState('units');
const [viewMode, setViewMode] = useState('detail');
const [compareMode, setCompareMode] = useState(true);

// 軸設定
const [prodAxis, setProdAxis] = useState('SKU');
const [storeAxis, setStoreAxis] = useState('全店舗');
const [storeGroup, setStoreGroup] = useState('全店舗');

// 年次系トグル
const [yoyShow, setYoyShow] = useState(false);
const [yoyRateShow, setYoyRateShow] = useState(false);
const [yoyDiffShow, setYoyDiffShow] = useState(false);

// ROI系列
const [roiVisible, setRoiVisible] = useState(false);

// アクションパネル
const [filterAction, setFilterAction] = useState('all');
const [searchTerm, setSearchTerm] = useState('');
const [columnFilters, setColumnFilters] = useState({});
const [checkedRows, setCheckedRows] = useState(new Set());

// モーダル
const [selectedRow, setSelectedRow] = useState(null);
const [actionModal, setActionModal] = useState({open, type, row});
const [actionForm, setActionForm] = useState({});

// タスク・イベント
const [tasks, setTasks] = useState([]);
const [events, setEvents] = useState([]);
```

---

# 3. 詳細設計書

## 3.1 ビジネスロジック詳細仕様

### 3.1.1 売上分析ロジック (features/sales.js)

#### データ構造
```typescript
type SalesRow = {
  productId: string;
  storeId: string;
  date: string;  // YYYY-MM-DD
  units: number;
  salePrice: number;
  markdown: number;
};

type SalesIndex = {
  idxByProductDate: Map<string, Map<string, {
    units: number;
    revenue: number;
    markdown: number;
  }>>;
  idxByProductStoreDate: Map<string, Map<string, Map<string, {
    units: number;
  }>>>;
};
```

#### 主要関数

**buildIndexes(sales, products)**
- **目的**: 高速検索用の多次元インデックスを構築
- **アルゴリズム**:
  1. 商品×日付の2次元Mapを作成
  2. 商品×店舗×日付の3次元Mapを作成
  3. 各セルに units, revenue, markdown を集計
- **計算量**: O(n) where n = 売上レコード数
- **戻り値**: SalesIndex

**sumUnits(index, productId, startYmd, endYmd)**
- **目的**: 指定期間の商品別販売数量を集計
- **ロジック**:
  1. idxByProductDate[productId] を取得
  2. startYmd から endYmd までループ
  3. 各日の units を合計
- **エラー処理**: 商品が存在しない場合は 0 を返す

**sumRevenue(index, productId, startYmd, endYmd)**
- **目的**: 指定期間の商品別売上金額を集計
- **計算式**: Σ(units × salePrice) for each day

**sumUnitsByStore(index, productId, storeId, startYmd, endYmd)**
- **目的**: 指定期間の商品×店舗別販売数量を集計
- **ロジック**: idxByProductStoreDate[productId][storeId] から集計

### 3.1.2 在庫分析ロジック (features/inventory.js)

#### データ構造
```typescript
type InventoryRow = {
  productId: string;
  storeId: string;
  qty: number;
};

type StoreMetrics = {
  inv: number;           // 現在在庫
  byBucket: number[];    // 期間別売上
  total: number;         // 合計売上
};
```

#### 主要関数

**computeStoreMetricsForItems(items, storeId, buckets, metric, range)**
- **目的**: 店舗別の在庫と売上メトリクスを計算
- **入力**:
  - items: Product[] - 対象商品リスト
  - storeId: string - 対象店舗ID
  - buckets: {label, start, end}[] - 期間バケット
  - metric: 'units'|'revenue'|'profit' - 集計指標
  - range: {start, end} - 集計期間
- **処理フロー**:
  1. 在庫データから storeId の在庫を集計
  2. 各バケットごとに売上を集計
  3. metric に応じて units/revenue/profit を計算
- **戻り値**: StoreMetrics
- **実装方針**: 
  - Map構造を使用してO(1)アクセスを実現
  - バケットごとのループで効率的に集計
  - 店舗IDによる高速フィルタリング

**calculateInventoryTurnover(inventory, sales, days)**
- **目的**: 在庫回転率を計算
- **計算式**: (期間内売上数量 / 平均在庫) × (365 / days)
- **実装方針**:
  - ゼロ除算を防ぐためのガード処理
  - 平均在庫は期首・期末在庫の平均値を使用
  - 365日換算で年間回転率を算出

### 3.1.3 予測・アクション判定ロジック (features/forecast.js)

#### 方針
- **優先度ベース判定**: EOL > 在庫枯渇 > 売上好調の順で判定
- **閾値管理**: ビジネスルールに基づく閾値を定数化
- **拡張性**: 新しいアクションタイプを容易に追加可能な設計

#### アクション判定ルール

**decideAction(params)**
- **入力**:
  - forecastEnd: string|null - 在庫枯渇予測日
  - eol: string|null - 商品終了予定日
  - byStore28: Record<storeId, number> - 過去28日間の店舗別売上
- **判定フロー**:

```javascript
1. EOL判定（最優先）
   IF eol <= 今日 + 30日
   THEN return {label: '値下', color: 'error', reason: 'EOL間近'}
   // 実装: new Date() + 30日との比較

2. 在庫枯渇判定（第2優先）
   IF forecastEnd <= 今日 + 14日
   THEN return {label: '移管', color: 'warning', reason: '在庫枯渇予測'}
   // 実装: 2週間以内の枯渇を警告

3. 売上好調判定（第3優先）
   total28 = Σ(byStore28)
   IF total28 > threshold (例: 100個)
   THEN return {label: '発注', color: 'primary', reason: '好調売上'}
   // 実装: 過去28日間の合計売上で判定

4. デフォルト
   return {label: '—', color: 'default', reason: 'アクション不要'}
```

**calculateDepletionDate(currentStock, avgDailySales)**
- **目的**: 在庫枯渇予測日を計算
- **計算式**: 今日 + (currentStock / avgDailySales)
- **条件**: avgDailySales > 0、そうでなければ null
- **実装詳細**:
  ```javascript
  if (avgDailySales <= 0) return null;
  const daysUntilDepletion = Math.floor(currentStock / avgDailySales);
  const depletionDate = new Date();
  depletionDate.setDate(depletionDate.getDate() + daysUntilDepletion);
  return depletionDate.toISOString().split('T')[0];
  ```

### 3.1.4 商品分類ロジック (features/productTaxonomy.js)

#### 方針
- **階層的グループ化**: 7段階の商品階層をサポート
- **動的マスタ結合**: LINE_MASTER/CATEGORY_MASTERとの動的結合
- **パフォーマンス**: Map構造による高速グループ化

#### 階層構造
```
全部門 (最上位)
  └─ 部門 (dept) - 例: "070"
      └─ コーナー (dept前2桁) - 例: "07"
          └─ ライン (LINE_MASTER) - 例: "婦人服"
              └─ カテゴリ (CATEGORY_MASTER) - 例: "ブラウス"
                  └─ アイテム (itemId) - 例: "1234-5678"
                      └─ SKU (sku) - 例: "1234-5678-01"
```

#### 主要関数

**groupItemsByAxis(items, axis)**
- **目的**: 指定された軸で商品をグループ化
- **処理**:
  - '全部門': 全商品を1グループ（集計用）
  - '部門': dept でグループ化（3桁コード）
  - 'コーナー': dept.substring(0,2) でグループ化（2桁コード）
  - 'ライン': LINE_MASTER と結合してグループ化
  - 'カテゴリ': CATEGORY_MASTER と結合してグループ化
  - 'アイテム': itemId でグループ化
  - 'SKU': 個別商品として返す（最小単位）
- **戻り値**: {label: string, items: Product[]}[]
- **実装詳細**:
  ```javascript
  const groups = new Map();
  items.forEach(item => {
    const key = extractKey(item, axis);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });
  return Array.from(groups.entries()).map(([label, items]) => ({label, items}));
  ```

**itemCodeFromSku(sku)**
- **目的**: SKUコードからアイテムコードを抽出
- **ロジック**: sku.split('-')[0] + '-' + sku.split('-')[1]
- **例**: '1234-5678-01' → '1234-5678'
- **実装詳細**:
  ```javascript
  const parts = sku.split('-');
  if (parts.length < 2) return sku;
  return `${parts[0]}-${parts[1]}`;
  ```

### 3.1.5 日付・期間ロジック (shared/date.js)

#### 方針
- **ISO 8601準拠**: YYYY-MM-DD形式を標準とする
- **タイムゾーン考慮**: ローカルタイムゾーンで処理
- **境界値処理**: 月末・四半期末の正確な計算

#### 期間計算関数

**startOfWeek(date)** / **endOfWeek(date)**
- **週の定義**: 月曜始まり、日曜終わり（ISO 8601準拠）
- **計算**: date.getDay() を使用して調整
- **実装詳細**:
  ```javascript
  function startOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day; // 日曜日は-6、それ以外は1-day
    d.setDate(d.getDate() + diff);
    return d;
  }
  ```

**startOfMonth(date)** / **endOfMonth(date)**
- **計算**: new Date(year, month, 1) / new Date(year, month+1, 0)
- **実装詳細**:
  ```javascript
  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
  function endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }
  ```

**startOfQuarter(date)** / **endOfQuarter(date)**
- **四半期定義**: Q1(1-3月), Q2(4-6月), Q3(7-9月), Q4(10-12月)
- **計算**: Math.floor(month / 3) × 3
- **実装詳細**:
  ```javascript
  function startOfQuarter(date) {
    const quarter = Math.floor(date.getMonth() / 3);
    return new Date(date.getFullYear(), quarter * 3, 1);
  }
  ```

**buildBuckets(range, granularity, custom)**
- **目的**: 期間を指定粒度で分割
- **制約**: 最大50列まで (MAX_COLS = 50)
- **処理**:
  1. start から end までの日数を計算
  2. granularity に応じて期間を分割
  3. 各バケットに {label, start, end} を設定
  4. 列数が MAX_COLS を超える場合は limited = true
- **カスタム粒度**: intervalDays と columns を指定可能
- **実装詳細**:
  ```javascript
  function buildBuckets(range, granularity, custom) {
    const buckets = [];
    let current = new Date(range.start);
    const end = new Date(range.end);
    
    while (current <= end && buckets.length < MAX_COLS) {
      const bucketEnd = calculateBucketEnd(current, granularity);
      buckets.push({
        label: formatBucketLabel(current, granularity),
        start: formatDate(current),
        end: formatDate(Math.min(bucketEnd, end))
      });
      current = addPeriod(current, granularity);
    }
    
    return {buckets, limited: buckets.length >= MAX_COLS};
  }
  ```

### 3.1.6 データ整合性ルール

#### 参照整合性
- SALES.productId → PRODUCTS.id (必須)
- SALES.storeId → STORES.id (必須)
- INVENTORY.productId → PRODUCTS.id (必須)
- INVENTORY.storeId → STORES.id (必須)

#### ビジネスルール
1. **売上数量**: units >= 0
2. **売上単価**: salePrice >= 0
3. **値下げ額**: 0 <= markdown <= salePrice × units
4. **在庫数量**: qty >= 0
5. **日付形式**: YYYY-MM-DD (ISO 8601)
6. **SKU形式**: NNNN-NNNN-NN (8桁-2桁)

#### 計算ルール
1. **売上金額**: revenue = units × salePrice
2. **利益**: profit = revenue - cost - markdown
3. **粗利率**: grossMargin = (profit / revenue) × 100
4. **在庫回転率**: turnover = (売上数量 / 平均在庫) × (365 / 日数)

## 3.2 アーキテクチャ非依存の仕様

### データフロー（概念）
```
入力データ → インデックス構築 → フィルタリング → 集計 → 表示
     ↓              ↓              ↓          ↓       ↓
  SALES/INV    buildIndexes    期間/店舗   sumXXX   UI
```

### 処理シーケンス

#### 初期化フェーズ
1. マスタデータ読み込み (STORES, PRODUCTS, LINE_MASTER, CATEGORY_MASTER)
2. トランザクションデータ読み込み (SALES, INVENTORY)
3. インデックス構築 (buildIndexes)
4. 初期フィルタ設定 (デフォルト期間: 過去3ヶ月)
5. 初期バケット生成 (デフォルト粒度: 月次)

#### フィルタ適用フェーズ
1. ユーザー入力受付 (期間, 拠点, 部門)
2. 対象商品抽出 (部門フィルタ適用)
3. 対象店舗抽出 (拠点フィルタ適用)
4. バケット再生成 (期間変更時)
5. 集計実行

#### 集計フェーズ
1. 軸によるグループ化 (groupItemsByAxis)
2. 各グループの集計 (sumUnits, sumRevenue)
3. 店舗別内訳計算 (compareMode時)
4. アクション判定 (decideAction)
5. 結果データ構築

#### 表示フェーズ
1. テーブル描画 (行×列のマトリクス)
2. チャート描画 (時系列グラフ)
3. アクション表示 (発注/移管/値下げ)
4. インタラクション処理 (展開/折りたたみ)

### API契約（将来のBFF連携用）

#### GET /api/sales
```json
{
  "params": {
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "storeIds": ["S001", "S002"],
    "depts": ["070", "071"]
  },
  "response": {
    "sales": [
      {
        "productId": "SKU0001",
        "storeId": "S001",
        "date": "2024-01-01",
        "units": 10,
        "salePrice": 1000,
        "markdown": 0
      }
    ]
  }
}
```

#### GET /api/inventory
```json
{
  "params": {
    "storeIds": ["S001"],
    "productIds": ["SKU0001"]
  },
  "response": {
    "inventory": [
      {
        "productId": "SKU0001",
        "storeId": "S001",
        "qty": 50
      }
    ]
  }
}
```

## 3.3 UIコンポーネント設計

### App.js - 状態管理
```javascript
const [state, setState] = useState({
  // フィルタ状態
  range: {start: '', end: ''},
  location: 'all',
  department: 'all',
  
  // 表示設定
  productAxis: '全部門',
  storeAxis: '全店舗',
  granularity: 'month',
  metric: 'revenue',
  compareMode: false,
  
  // モーダル状態
  showTransferModal: false,
  showTaskModal: false,
  
  // データ状態
  indexes: null,
  buckets: [],
  filteredData: []
});
```

### コンポーネント間連携
```
App.js (状態管理)
  ├─ Filter.js → onApply() → App状態更新
  ├─ AxisSelector.js → onChange() → 軸変更
  ├─ SalesTable.js ← props注入 ← 計算済データ
  ├─ RevenueChartDetailed.js ← props注入 ← チャートデータ
  ├─ TransferPlanner.js ← モーダル制御 ← 移管データ
  └─ TaskManager.js ← タスク状態 ← タスクデータ
```

## 3.3 パフォーマンス設計

### データ処理最適化
- **Map構造**: O(1) でのデータアクセス
- **遅延計算**: 表示時のみ集計実行
- **キャッシュ**: 同一条件での再計算を回避

### UI描画最適化
- **useMemo**: 重い計算結果のメモ化
- **useCallback**: イベントハンドラーのメモ化
- **React.memo**: コンポーネントの再描画抑制

---

# 4. 実装ガイドライン

## 4.1 コーディング規約

### JavaScript規約
- **ES6+**: モダンJavaScript構文を使用
- **関数型**: 純粋関数を優先、副作用を最小化
- **命名**: camelCase、意味のある名前

### React規約
- **Hooks**: 関数コンポーネント + Hooks を使用
- **Props**: PropTypes による型チェック
- **State**: 最小限の状態管理

## 4.2 ファイル構成

### ディレクトリ構造（全ファイル）
```
/
├─ index.html                           # エントリーポイント（HTML）
│
├─ shared/                              # 共通ユーティリティ層
│  ├─ date.js                          # 日付・期間計算関数
│  ├─ format.js                        # フォーマット関数（数値、日付）
│  ├─ utils.js                         # 汎用ユーティリティ
│  ├─ store.js                         # データアクセス層（インデックス管理）
│  └─ section.js                       # セクションUI共通コンポーネント
│
├─ data/                                # データ層
│  ├─ masters.js                       # マスタデータ定義
│  │                                   # - STORES（店舗マスタ）
│  │                                   # - PRODUCTS（商品マスタ）
│  │                                   # - LINE_MASTER（ラインマスタ）
│  │                                   # - CATEGORY_MASTER（カテゴリマスタ）
│  └─ fixtures.js                      # サンプルデータ生成
│                                      # - SALES（売上トランザクション）
│                                      # - INVENTORY（在庫データ）
│
├─ features/                            # ビジネスロジック層
│  ├─ sales.js                         # 売上分析エンジン
│  │                                   # - sumUnits, sumRevenue, sumProfit
│  │                                   # - buildIndexes（インデックス構築）
│  ├─ inventory.js                     # 在庫分析エンジン
│  │                                   # - sumInventory, calculateTurnover
│  ├─ forecast.js                      # 予測・アクション判定
│  │                                   # - decideAction, calculateDepletionDate
│  ├─ productTaxonomy.js               # 商品分類ロジック
│  │                                   # - groupItemsByAxis, itemCodeFromSku
│  ├─ actions.js                       # アクション実行ロジック
│  │                                   # - executeTransfer, executeMarkdown, executeOrder
│  ├─ tasks_data.js                    # タスク管理データ
│  ├─ events_data.js                   # イベント管理データ
│  └─ ActionPanel.js                   # アクションパネルUI
│
└─ app/                                 # プレゼンテーション層
   ├─ main.js                          # アプリケーション起動（ReactDOM.render）
   ├─ App.js                           # メインコンポーネント（状態管理）
   │
   └─ components/                       # UIコンポーネント
      ├─ Filter.js                     # フィルタUI（期間、拠点、部門）
      ├─ AxisSelector.js               # 軸選択UI（商品軸、店舗軸）
      ├─ SelectorBar.js                # 設定バーUI（粒度、指標、比較モード）
      ├─ SalesTable.js                 # 売上テーブル（メインテーブル）
      ├─ RevenueChartDetailed.js       # 売上チャート（Chart.js）
      ├─ TransferPlanner.js            # 移管計画モーダル
      ├─ MarkdownModal.js              # 値下げモーダル
      ├─ OrderModal.js                 # 発注モーダル
      └─ Section.js                    # 共通レイアウトコンポーネント
```

### 読み込み順序（必須）

#### 方針
- **依存関係の明確化**: 下位層から上位層への一方向依存
- **循環参照の防止**: 同一層内での相互参照を禁止
- **グローバル変数**: window オブジェクトを介した共有

#### 読み込み順序
```html
<!-- index.html 内での読み込み順序 -->

<!-- 1. 外部ライブラリ（CDN） -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>

<!-- 2. 共通ユーティリティ層（依存なし） -->
<script src="shared/date.js"></script>
<script src="shared/format.js"></script>
<script src="shared/utils.js"></script>
<script src="shared/store.js"></script>
<script src="shared/section.js"></script>

<!-- 3. データ層（shared に依存） -->
<script src="data/masters.js"></script>
<script src="data/fixtures.js"></script>

<!-- 4. ビジネスロジック層（shared, data に依存） -->
<script src="features/sales.js"></script>
<script src="features/inventory.js"></script>
<script src="features/forecast.js"></script>
<script src="features/productTaxonomy.js"></script>
<script src="features/actions.js"></script>
<script src="features/tasks_data.js"></script>
<script src="features/events_data.js"></script>
<script src="features/ActionPanel.js"></script>

<!-- 5. UIコンポーネント層（全層に依存可） -->
<script src="app/components/Section.js"></script>
<script src="app/components/Filter.js"></script>
<script src="app/components/AxisSelector.js"></script>
<script src="app/components/SelectorBar.js"></script>
<script src="app/components/SalesTable.js"></script>
<script src="app/components/RevenueChartDetailed.js"></script>
<script src="app/components/TransferPlanner.js"></script>
<script src="app/components/MarkdownModal.js"></script>
<script src="app/components/OrderModal.js"></script>

<!-- 6. メインアプリケーション -->
<script src="app/App.js"></script>
<script src="app/main.js"></script>
```

#### 依存関係マトリクス
| 層 | shared | data | features | app/components | app |
|----|--------|------|----------|----------------|-----|
| shared | - | ✗ | ✗ | ✗ | ✗ |
| data | ✓ | - | ✗ | ✗ | ✗ |
| features | ✓ | ✓ | - | ✗ | ✗ |
| app/components | ✓ | ✓ | ✓ | - | ✗ |
| app | ✓ | ✓ | ✓ | ✓ | - |

✓ = 依存可能、✗ = 依存禁止

## 4.3 開発環境セットアップ

```bash
# VSCode Live Preview（推奨）
# 1. VSCode で index.html を開く
# 2. 右クリック → "Show Preview"

# または任意の静的サーバー
python -m http.server 8000
# http://localhost:8000 でアクセス
```

---

# 5. 運用・保守

## 5.1 監視・ログ

### エラー監視
- **ブラウザコンソール**: JavaScript エラーの監視
- **ユーザーフィードバック**: エラー報告機能
- **パフォーマンス**: Core Web Vitals の監視

## 5.2 セキュリティ

### 脆弱性対策
- **XSS対策**: 入力値のサニタイズ
- **依存関係**: 定期的な脆弱性スキャン

### プライバシー保護
- **個人情報**: 取り扱わない設計
- **ローカルデータ**: ユーザー端末内のみで処理
- **通信**: HTTPS による暗号化

---

# 6. 今後の拡張計画

## 6.1 短期計画（3ヶ月）
- 詳細フィルタ機能
- レスポンシブ対応強化
- 大量データ対応

## 6.2 中期計画（6ヶ月）
- BFF との接続準備
- ユーザー管理機能
- サーバーサイド連携

## 6.3 長期計画（1年）
- 機能別サービス分割
- WebSocket による即時更新
- 機械学習による予測精度向上

---

# 付録

## A. 用語集

| 用語 | 説明 |
|------|------|
| SKU | Stock Keeping Unit - 在庫管理単位 |
| EOL | End of Life - 商品の販売終了予定日 |
| BFF | Backend for Frontend - フロントエンド専用API |
| UMD | Universal Module Definition - モジュール形式 |
| CDN | Content Delivery Network - コンテンツ配信ネットワーク |

## B. 参考資料

- [React Documentation](https://reactjs.org/docs/)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Web Performance Best Practices](https://web.dev/performance/)

## C. 変更履歴

| バージョン | 日付 | 変更内容 | 担当者 |
|-----------|------|----------|--------|
| 0.1.0 | 2024-11-15 | 初版作成 | 開発チーム |
| 0.2.0 | 2024-12-20 | 要件定義・設計書追加、免責事項追加 | 設計チーム |
| 0.2.1 | 2025-10-20 | 全モジュール実装完了、ドキュメント整理 | 開発チーム |

### ファイル別更新履歴（2025-10-20）

#### Core Files
- `app/App.js`: メインアプリケーション状態管理
- `app/main.js`: React起動処理
- `data/masters.js`: マスタデータ定義
- `data/fixtures.js`: サンプルデータ生成

#### Business Logic
- `features/sales.js`: 売上分析エンジン
- `features/inventory.js`: 在庫分析エンジン
- `features/forecast.js`: 予測・アクション判定
- `features/productTaxonomy.js`: 商品分類ロジック
- `features/actions.js`: アクション実行
- `features/tasks_data.js`: タスク管理
- `features/events_data.js`: イベント管理
- `features/ActionPanel.js`: アクションパネルUI

#### UI Components
- `app/components/Filter.js`: フィルタUI
- `app/components/AxisSelector.js`: 軸選択UI
- `app/components/SalesTable.js`: 売上テーブル
- `app/components/RevenueChartDetailed.js`: 売上チャート
- `app/components/TransferPlanner.js`: 移管計画モーダル
- `app/components/SelectorBar.js`: 設定バー
- `app/components/Section.js`: 共通レイアウト
- `app/components/MarkdownModal.js`: 値下げモーダル
- `app/components/OrderModal.js`: 発注モーダル

#### Utilities
- `shared/date.js`: 日付ユーティリティ
- `shared/format.js`: フォーマット関数
- `shared/utils.js`: 汎用ユーティリティ
- `shared/store.js`: データアクセス層
- `shared/section.js`: セクションUI

---

## 🎯 ドキュメント終了

**本設計書はここで終了です。**

追加情報や質問がある場合は、開発チームまでお問い合わせください。

---

**Document Version**: 0.2.1  
**Last Updated**: 2025-10-20  
**Status**: 完成  
**Next Review**: 2025-11-20
