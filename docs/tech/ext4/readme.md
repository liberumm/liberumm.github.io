http://example.com?storeMasterFile=store_master.xlsx&storeCoefficientFile=store_coefficient.xlsx&productListFile=product_list.xlsx&rowCount=5&storeCount=10


http://127.0.0.1:3000/docs/ext3/c.html?storeMasterFile=store_master.xlsx&storeCoefficientFile=store_coefficient.csv&productListFile=product_list.xlsx&rowCount=5&storeCount=5

http://127.0.0.1:3000/docs/ext3/c.html?storeCoefficientFile=data/store_coefficient.csv&productListFile=product_list.xlsx&rowCount=5&storeCount=5

アプリケーションの要件定義は以下の通りです：

### アプリケーションの名称
納品数配分システム

### 概要
本システムは、店舗ごとの納品数を計算・配分し、結果をCSVまたはExcel形式で出力するWebアプリケーションです。

### 機能要件

1. **ファイルのアップロード機能**
    - 店舗マスタ、店舗係数マスタ、商品リストの3種類のファイルをドラッグ＆ドロップまたはファイル選択でアップロード。
    - アップロードされたファイルはCSVまたはExcel形式をサポート。

2. **テンプレートダウンロード機能**
    - 店舗マスタ、店舗係数マスタ、商品リストのテンプレートファイルをExcelおよびCSV形式でダウンロード可能。

3. **テーブル表示**
    - アップロードされたデータを元に配分用のテーブルを生成し表示。
    - テーブルは商品行数と店舗列数を動的に調整可能。
    - テーブル内の各セルに対して、納品日、商品コード、商品名、原価、売価、係数パターン、配分数、単位、最低導入数、一括数量などの入力フィールドを提供。

4. **入力制御機能**
    - 行数と列数をスライダーや数値入力で調整。
    - 納品日の一括設定。
    - テーブル全体、または各行のクリア機能。

5. **配分機能**
    - 店舗ごとの係数に基づき、各商品の配分数を計算。
    - 計算結果をテーブルに反映。

6. **エクスポート機能**
    - 配分結果をExcelまたはCSV形式でエクスポート。

7. **UI/UX**
    - Bootstrapを使用したレスポンシブデザイン。
    - ファイルアップロードエリアやボタン、スライダーなどのインタラクティブなUI要素。

### 非機能要件

1. **パフォーマンス**
    - 大量のデータを扱う際のパフォーマンスを考慮し、適切なデータ処理を行う。

2. **セキュリティ**
    - アップロードされるファイルの内容を検証し、不正なデータの混入を防ぐ。

3. **拡張性**
    - 将来的な機能追加や変更に柔軟に対応できるような設計。

### システム構成

- **フロントエンド**
    - HTML、CSS（Bootstrap）、JavaScriptを使用。

- **バックエンド**
    - JavaScriptによるデータ処理とファイル操作。
    - 必要に応じてサーバーサイドでのデータ処理を追加検討。

### 開発環境
- **IDE**
    - Visual Studio Codeなどの統合開発環境。

- **バージョン管理**
    - Gitによるソースコード管理。
