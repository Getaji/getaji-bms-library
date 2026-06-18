import type {
  GatsbyNode,
  CreatePagesArgs,
  Reporter,
  CreateWebpackConfigArgs,
} from "gatsby";
import { writeFile, copyFile, readFile } from "fs/promises";
import path from "path";
import { realpathSync } from "fs";

// export { sourceNodes } from "../sqlite/source-node";

import type { SimpleSong } from "../../src/common/types";
import { FOLDER_NAMES } from "../../src/common/common";
import { createFilePath } from "gatsby-source-filesystem";

const EXCLUDE_FOLDERS = ["Fav Charts", "ホラー注意", "All Song"];

type GraphQLResponse = {
  allSqliteData: {
    edges: {
      node: SimpleSong;
    }[];
  };
};

interface HistoryNode {
  node: {
    frontmatter: {
      slug: string;
      title: string;
    };
  };
}

/**
 * パース済みのカスタムフォルダデータから難易度表データ部を構築し保存する。
 *
 * @param graphql Gatsbyのgraphqlタグ関数
 * @param baseDir 保存先のベースディレクトリ（プロジェクトルート想定）
 */
async function generateAndSaveTableData(
  graphql: CreatePagesArgs["graphql"],
  baseDir: string,
  reporter: Reporter,
) {
  const { data, errors } = await graphql<GraphQLResponse>(`
    query TableDataQuery {
      allSqliteData {
        edges {
          node {
            md5
            sha256
            genre
            title
            subtitle
            artist
            subartist
            folder
            comment
            url
            url_diff
            notes
            total
          }
        }
      }
    }
  `);

  if (errors) {
    reporter.panicOnBuild(`譜面データの取得中にエラーが発生しました`, errors);
    return;
  }

  if (!data) {
    reporter.panicOnBuild("譜面が1件もありません");
    return;
  }

  const {
    allSqliteData: { edges },
  } = data;

  const tableSongs = edges
    .filter(({ node: song }) => !EXCLUDE_FOLDERS.includes(song.folder))
    .sort(
      (a, b) =>
        FOLDER_NAMES.indexOf(a.node.folder) -
        FOLDER_NAMES.indexOf(b.node.folder),
    )
    .map(({ node: song }) => ({
      md5: song.md5,
      sha256: song.sha256,
      level: song.folder,
      title: song.subtitle ? `${song.title} ${song.subtitle}` : song.title,
      artist: song.subartist ? `${song.artist} ${song.subartist}` : song.artist,
      comment: song.comment,
      url: song.url,
      url_diff: song.url_diff,
    }));
  const tableSongsStr = JSON.stringify(tableSongs);

  await Promise.all([
    // TODO: ビルド出力ディレクトリの変更に対応できるようにする
    writeFile(path.join(baseDir, "public", "table_data.json"), tableSongsStr),
    writeFile(path.join(baseDir, "src", "table_data.json"), tableSongsStr),
  ]);
}

/**
 * プラグインの初期化時に呼び出される関数。
 *
 * 以前はfolder.jsonのコンバートを行っていたが、外部で行うようにしたので廃止。
 */
// export const onPluginInit: GatsbyNode["onPluginInit"] = async () => {
// }

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
  node,
  getNode,
  actions,
}) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` });
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
  }
};

/**
 * - ページの構築・再構築にフックして難易度表データ部JSONを生成し保存する。
 * - 履歴ページを生成する。
 */
export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  basePath,
  actions: { createPage },
  reporter,
}) => {
  reporter.verbose("Generating table data");
  await generateAndSaveTableData(graphql, basePath, reporter);
  
  reporter.verbose("Generating history pages");

  // ヒストリーページのテンプレートを取得
  const historyTemplate = path.resolve("src/templates/history-item.tsx");

  // 全履歴データを取得するクエリ
  const result = await graphql<{
    allMarkdownRemark: {
      edges: {
        node: {
          id: string;
          fields: {
            slug: string;
          };
        };
      }[];
    };
  }>(`
    query AllHistoryQuery {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/histories/" } }
        sort: { frontmatter: { date: DESC } }
      ) {
        edges {
          node {
            id
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  if (result.errors || !result.data) {
    reporter.panicOnBuild(
      `履歴データの取得中にエラーが発生しました`,
      result.errors,
    );
    return;
  }

  const histories = result.data.allMarkdownRemark.edges;

  // 各履歴ページを生成
  if (histories.length > 0) {
    histories.forEach((history, index) => {
      const previousPostId =
        index === histories.length - 1 ? null : histories[index + 1].node.id;
      const nextPostId = index === 0 ? null : histories[index - 1].node.id;

      createPage({
        path: history.node.fields.slug,
        component: historyTemplate,
        context: {
          id: history.node.id,
          previousPostId,
          nextPostId,
        },
      });
    });
  }
};

/**
 * ビルド完了にフックして難易度表ヘッダ部JSONをビルド結果の出力にコピーする。
 */
export const onPostBuild: GatsbyNode["onPostBuild"] = async ({
  reporter
}) => {
  reporter.verbose("Generating table header");

  // TODO: ビルド出力ディレクトリの変更に対応できるようにする
  await copyFile("./src/table_header.json", "./public/table_header.json");

  // header.json指定用のメタタグを強制的に先頭に配置する
  const buffer = await readFile("./public/index.html");
  const html = buffer.toString("utf-8");
  await writeFile(
    "./public/index.html",
    html.replace(`<head>`, `<head><meta name="bmstable" content="https://getaji-bms-library.pages.dev/table_header.json" />`),
  );
};

let gatsbyNodeModules = realpathSync("node_modules/gatsby");
gatsbyNodeModules = path.resolve(gatsbyNodeModules, "..");

export const onCreateWebpackConfig = ({ actions }: CreateWebpackConfigArgs) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [gatsbyNodeModules, "node_modules"],
    },
  });
};
