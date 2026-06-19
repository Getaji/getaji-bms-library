import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    siteUrl: `https://getaji-bms-library.pages.dev`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  // graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-remove-generator",
    "gatsby-transformer-json",
    "gatsby-transformer-remark",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: "./src/content/",
        fastHash: true,
      },
    },
    {
      resolve: "gatsby-source-better-sqlite3",
      options: {
        // .db ファイルへのパス（プロジェクトルートからの相対パス、または絶対パス）
        path: "./src/content/data.db",

        // 読み込むテーブルを指定（複数可）
        tables: [
          // シンプルな形式：テーブル名のみ指定
          // → type名は自動生成（例: "posts" -> "SqlitePosts"）
          "data",
        ],

        // 読み取り専用で開く（デフォルト: true）
        readOnly: true,
      },
    },
    "local-plugin",
  ],
};

export default config;
