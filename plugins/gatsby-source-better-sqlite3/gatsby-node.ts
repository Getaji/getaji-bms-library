import path from 'path';
import fs from 'fs';
import Database, { Database as DatabaseType } from 'better-sqlite3';

import { GatsbyNode, Reporter, PluginOptions } from "gatsby";

/**
 * "blog_posts" -> "BlogPosts", "users" -> "Users" のように
 * テーブル名をPascalCaseに変換する（ノードのtype名生成用）。
 */
function toPascalCase(str: string) {
  return str
    .replace(/[-_]+/g, ' ')
    .replace(/\s+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, (chr) => chr.toUpperCase());
}

/**
 * プラグイン設定のtablesフィールドに渡す要素のオブジェクト型
 */
type EntryObject = {
  tableName: string;
  type: string;
  idField: string;
};

type MyPluginOptions = PluginOptions & {
  path: string;
  tables: (EntryObject | string)[];
}

function validatePluginOptions(options: PluginOptions, reporter: Reporter): MyPluginOptions {
  if (typeof options.path !== "string") {
    reporter.panic("options.pathは文字列で指定してください。");
  }
  validateEntries(options.tables, reporter);

  return options as MyPluginOptions;
}

function validateEntries(entries: unknown, reporter: Reporter): (EntryObject | string)[] {
  if (!Array.isArray(entries)) {
    reporter.panic("options.tablesは配列で指定してください。");
  }

  entries.some((entry) => {
    if (typeof entry === "string") {
      return true;
    }
    if (typeof entry !== "object") {
      reporter.panic("options.tablesの各要素は文字列かオブジェクトでなければなりません。");
      return false;
    }
    if (typeof entry.tableName !== "string") {
      reporter.panic("options.tablesの要素のオブジェクト型が間違っています。");
      return false;
    }
    if (typeof entry.type !== "string") {
      reporter.panic("options.tablesの要素のオブジェクト型が間違っています。");
      return false;
    }
    if (typeof entry.idField !== "string") {
      reporter.panic("options.tablesの要素のオブジェクト型が間違っています。");
      return false;
    }
    return true;
  });

  return entries as (EntryObject | string)[];
}

/**
 * pluginOptions.tables の各要素（文字列 or オブジェクト）を
 * { tableName, type, idField } の形に統一する。
 */
function normalizeTableConfigs(tables: (EntryObject | string)[]) {
  return tables.map((entry) => {
    if (typeof entry === 'string') {
      return {
        tableName: entry,
        type: `Sqlite${toPascalCase(entry)}`,
        idField: 'id',
      };
    }

    return {
      tableName: entry.tableName,
      type: entry.type || `Sqlite${toPascalCase(entry.tableName)}`,
      idField: entry.idField || 'id',
    };
  });
}

/**
 * pluginOptions の検証スキーマ。
 * `gatsby-config.js` に渡されたオプションの型チェック・必須項目チェックに使われる。
 */
export const pluginOptionsSchema: GatsbyNode["pluginOptionsSchema"] = ({ Joi }) => {
  return Joi.object({
    path: Joi.string()
      .required()
      .description(
        '読み込む .db ファイルへのパス（プロジェクトルートからの相対パス、または絶対パス）'
      ),
    tables: Joi.array()
      .items(
        Joi.alternatives().try(
          Joi.string(),
          Joi.object({
            tableName: Joi.string().required(),
            type: Joi.string(),
            idField: Joi.string(),
          })
        )
      )
      .min(1)
      .required()
      .description(
        '読み込む対象のテーブル名のリスト。文字列、または { tableName, type, idField } の形で指定可能。'
      ),
    readOnly: Joi.boolean()
      .default(true)
      .description('true の場合、SQLiteファイルを読み取り専用で開く（デフォルト: true）。'),
  });
};

/**
 * Gatsby本体から呼ばれるソースプラグインの本体処理。
 * 指定された各テーブルの全行を読み込み、それぞれをGatsbyノードとして作成する。
 */
export const sourceNodes: GatsbyNode["sourceNodes"] = async (
  { actions, createNodeId, createContentDigest, reporter },
  pluginOptions
) => {
  const { createNode } = actions;

  const options = validatePluginOptions(pluginOptions, reporter);

  const dbPath = path.isAbsolute(options.path)
    ? options.path
    : path.join(process.cwd(), options.path);

  if (!fs.existsSync(dbPath)) {
    reporter.panic(
      `gatsby-source-better-sqlite3: データベースファイルが見つかりません: "${dbPath}"。pluginOptions.path を確認してください。`
    );
    return;
  }

  const tableConfigs = normalizeTableConfigs(options.tables);

  const activity = reporter.activityTimer(
    'gatsby-source-better-sqlite3: テーブルを読み込み中'
  );
  activity.start();

  let db: DatabaseType | null = null;

  try {
    db = new Database(dbPath, {
      readonly: pluginOptions.readOnly !== false,
      fileMustExist: true,
    });

    for (const { tableName, type, idField } of tableConfigs) {
      let rows;

      try {
        rows = db.prepare<[], Record<string, unknown>>(`SELECT * FROM "${tableName}"`).all();
      } catch (err) {
        reporter.panicOnBuild(
          `gatsby-source-better-sqlite3: テーブル "${tableName}" の読み込みに失敗しました。テーブル名が正しいか確認してください。`,
          err as Error | Error[]
        );
        continue;
      }

      reporter.info(
        `gatsby-source-better-sqlite3: "${tableName}" から ${rows.length} 行を読み込み、type "${type}" として作成します`
      );

      rows.forEach((row, index) => {
        const rawId = row[idField] !== undefined ? row[idField] : index;
        const nodeId = createNodeId(`${tableName}-${rawId}`);

        const nodeData = {
          ...row,
          // 元のidField（例: id列）の値は sqliteId として残しておく
          sqliteId: rawId,
          sqliteTable: tableName,
          id: nodeId,
          parent: null,
          children: [],
          internal: {
            type,
            contentDigest: createContentDigest(row),
          },
        };

        createNode(nodeData);
      });
    }
  } finally {
    if (db) {
      db.close();
    }
    activity.end();
  }
};
