# gatsby-source-better-sqlite3

Gatsby v5用のローカルソースプラグインです。`better-sqlite3` を使ってローカルの `.db`（SQLite）ファイルから指定したテーブルを読み込み、それぞれの行をGatsbyのGraphQLノードとして公開します。

## 1. 配置方法

このフォルダ全体を、Gatsbyプロジェクトの `plugins/` フォルダ内にコピーしてください。

```
my-gatsby-site/
├── plugins/
│   └── gatsby-source-better-sqlite3/   ← このフォルダ
│       ├── package.json
│       ├── gatsby-node.js
│       └── README.md
├── gatsby-config.js
└── ...
```

## 2. 依存パッケージのインストール

`better-sqlite3` はネイティブモジュール（C++のビルドが必要）です。Gatsbyプロジェクトのルートで以下を実行してください。

```bash
npm install better-sqlite3
# または
yarn add better-sqlite3
```

ビルドに失敗する場合は、Node.jsのバージョンとOSのビルドツール（Linuxなら `build-essential`、Macなら Xcode Command Line Tools、Windowsなら `windows-build-tools` 相当）が揃っているか確認してください。

## 3. gatsby-config.js の設定

```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-better-sqlite3',
      options: {
        // .db ファイルへのパス（プロジェクトルートからの相対パス、または絶対パス）
        path: './data/app.db',

        // 読み込むテーブルを指定（複数可）
        tables: [
          // シンプルな形式：テーブル名のみ指定
          // → type名は自動生成（例: "posts" -> "SqlitePosts"）
          'posts',

          // 詳細指定：type名やid列を明示的に指定する場合
          {
            tableName: 'users',
            type: 'User',       // 省略時は "SqliteUsers" になる
            idField: 'user_id', // 省略時は "id" 列を使う
          },
        ],

        // 読み取り専用で開く（デフォルト: true）
        readOnly: true,
      },
    },
  ],
};
```

## 4. GraphQLでの取得例

上記の設定の場合、以下のようなクエリでデータを取得できます。

```graphql
{
  allSqlitePosts {
    nodes {
      id
      sqliteId
      title
      body
    }
  }

  allUser {
    nodes {
      id
      sqliteId
      name
      email
    }
  }
}
```

- `id`: Gatsby内部で使われるノードの一意なID（GraphQLの`id`フィールド）
- `sqliteId`: 元のテーブルの主キー（`idField`で指定した列）の値
- `sqliteTable`: どのテーブルから生成されたノードかを示す文字列

## 5. 制約・注意点

- **テーブル間のリレーション（外部キー）の解決は行いません。** 各行はそのままフラットなノードとして作成されます。リレーションが必要な場合は、別途 `createSchemaCustomization` でリンクフィールドを定義してください。
- `idField` で指定した列が存在しない行がある場合、配列のインデックスをフォールバックのIDとして使用します。主キー列がない（または `WITHOUT ROWID` でない）テーブルでは、必要に応じて `idField` を明示的に指定してください。
- スキーマ推論はGatsbyの自動推論に任せています。同じテーブル内で型が混在する列（SQLiteは緩い型付けのため起こり得ます）がある場合、Gatsbyのスキーマ推論で警告が出ることがあります。気になる場合は `createSchemaCustomization` で明示的に型を定義してください。
- このプラグインは `sourceNodes` 実行時にDBファイル全体を毎回読み込みます。差分更新やキャッシュは行っていないため、巨大なDBの場合はビルド時間に影響する可能性があります。
