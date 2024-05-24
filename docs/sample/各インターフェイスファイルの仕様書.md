### 各インターフェイスファイルの仕様書

#### 1. 設定ファイル (`settings.config`)

##### 1.1 ファイルパス
- デフォルトパス: `settings.config`

##### 1.2 ファイルフォーマット
- テキストファイル、キー=値形式

##### 1.3 設定項目

| キー | 説明 | デフォルト値 | 例 |
| --- | --- | --- | --- |
| LogRetentionDays | ログファイルの保持日数 | 7 | 7 |
| SchedulerEnabled | スケジューラの有効/無効 | true | true |
| WebServerIPAddress | WebサーバーのIPアドレス | * | 192.168.1.100 |
| WebServerPort | Webサーバーのポート番号 | 8080 | 8080 |
| WebServerAutoStart | Webサーバーの自動開始設定 | false | true |

##### 1.4 ファイル例

```
LogRetentionDays=7
SchedulerEnabled=true
WebServerIPAddress=*
WebServerPort=8080
WebServerAutoStart=false
```

#### 2. スケジュール設定ファイル (`schedules.csv`)

##### 2.1 ファイルパス
- デフォルトパス: `schedules.csv`

##### 2.2 ファイルフォーマット
- CSV形式

##### 2.3 設定項目

| 列名 | 説明 | データ型 | 例 |
| --- | --- | --- | --- |
| Enabled | スケジュールの有効/無効 | bool | true |
| Name | ジョブ名 | string | SampleJob |
| CronExpression | 実行スケジュール（cron形式） | string | "0 0 * * *" |
| SqlFile | 実行するSQLファイルのパス | string | SQL/sample.sql |
| RetryEnabled | リトライの有効/無効 | bool | true |
| RetryInterval | リトライ間隔（秒） | int | 5 |
| Description | ジョブの説明 | string | Sample job description |

##### 2.4 ファイル例

```
Enabled,Name,CronExpression,SqlFile,RetryEnabled,RetryInterval,Description
true,SampleJob,"0 0 * * *","SQL/sample.sql",true,5,Sample job description
```

#### 3. SQLファイル (`SQL/*.sql`)

##### 3.1 ファイルパス
- デフォルトディレクトリ: `SQL/`
- ファイル名例: `sample.sql`

##### 3.2 ファイルフォーマット
- テキストファイル、接続情報とクエリを含む

##### 3.3 設定項目

| 行 | 説明 | 例 |
| --- | --- | --- |
| connectionString | データベース接続文字列 | `-- connectionString: Driver={ODBC Driver 17 for SQL Server};Server=myServerAddress;Database=myDataBase;Uid=myUsername;Pwd=myPassword;` |
| outputDirectory | クエリ結果の出力ディレクトリ | `-- outputDirectory: .` |
| outputFileName | クエリ結果の出力ファイル名 | `-- outputFileName: sample_output.csv` |
| SQLクエリ | 実行するSQLクエリ | `SELECT * FROM anotherTable;` |

##### 3.4 ファイル例

```
-- connectionString: Driver={ODBC Driver 17 for SQL Server};Server=myServerAddress;Database=myDataBase;Uid=myUsername;Pwd=myPassword;
-- outputDirectory: .
-- outputFileName: sample_output.csv

SELECT * FROM anotherTable;
```

#### 4. ログファイル (`log.csv`)

##### 4.1 ファイルパス
- デフォルトパス: `log.csv`

##### 4.2 ファイルフォーマット
- CSV形式

##### 4.3 記録項目

| 列名 | 説明 | データ型 | 例 |
| --- | --- | --- | --- |
| Timestamp | 実行時刻 | datetime | 2023/05/23 14:30:00 |
| Status | 実行ステータス（Success/Error） | string | Success |
| SQLFile | 実行したSQLファイルのパス | string | SQL/sample.sql |
| Message | メッセージ（成功時のメッセージまたはエラーメッセージ） | string | Executed successfully |

##### 4.4 ファイル例

```
Timestamp,Status,SQLFile,Message
2023/05/23 14:30:00,Success,SQL/sample.sql,Executed successfully
2023/05/23 15:30:00,Error,SQL/sample.sql,Database connection failed
```

#### 5. エラーログファイル (`error/*.csv`)

##### 5.1 ファイルパス
- デフォルトディレクトリ: `error/`
- ファイル名例: `error_20230523_143000_sample.sql.csv`

##### 5.2 ファイルフォーマット
- CSV形式

##### 5.3 記録項目

| 列名 | 説明 | データ型 | 例 |
| --- | --- | --- | --- |
| Timestamp | エラー発生時刻 | datetime | 2023/05/23 14:30:00 |
| SQLFile | 実行したSQLファイルのパス | string | SQL/sample.sql |
| ErrorMessage | エラーメッセージ | string | Database connection failed |

##### 5.4 ファイル例

```
Timestamp,SQLFile,ErrorMessage
2023/05/23 14:30:00,SQL/sample.sql,Database connection failed
```

#### 6. Webサーバー設定

##### 6.1 ベースURL
- `http://<WebServerIPAddress>:<WebServerPort>/`
  - 例: `http://*:8080/`

##### 6.2 リクエストハンドリング

| エンドポイント | メソッド | 説明 |
| --- | --- | --- |
| `/` | GET | ルートディレクトリのインデックスファイルを提供 |
| `/path/to/file` | GET | 指定されたパスの静的ファイルを提供 |

##### 6.3 エラーハンドリング

| ステータスコード | 説明 |
| --- | --- |
| 404 | ファイルが見つからない場合 |

このインターフェイスファイル仕様書を基に、各インターフェイスの実装および連携を行います。質問や追加要件があればお知らせください。
