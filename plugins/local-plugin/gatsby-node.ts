import type { GatsbyNode, CreatePagesArgs } from "gatsby";
import { writeFile, copyFile, readFile } from "fs/promises";
import path from "path";

import type { Song } from "../../src/common/types";
import { FOLDER_NAMES } from "../../src/common/common";
import { createFilePath } from "gatsby-source-filesystem";

const EXCLUDE_FOLDERS = ["Fav Charts", "ホラー注意", "All Song"];

type GraphQLResponse = {
  allSqliteData: {
    edges: {
      node: Song;
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
) {
  const { data, errors } = await graphql<GraphQLResponse>(`
    query TableDataQuery {
      allSqliteData {
        edges {
          node {
            folder
            md5
            sha256
            genre
            title
            subtitle
            artist
            subartist
            content
            level
            difficulty
            maxbpm
            minbpm
            mainbpm
            length
            judge
            feature
            comment
            url
            appendurl
          }
        }
      }
    }
  `);

  if (errors) {
    console.error(errors);
    return;
  }

  if (!data) return;

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
      appendurl: song.appendurl,
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
  await generateAndSaveTableData(graphql, basePath);

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
export const onPostBuild: GatsbyNode["onPostBuild"] = async () => {
  // TODO: ビルド出力ディレクトリの変更に対応できるようにする
  await copyFile("./src/table_header.json", "./public/table_header.json");

  const buffer = await readFile("./public/index.html");
  const html = buffer.toString("utf-8");
  await writeFile(
    "./public/index.html",
    html.replace(`data-react-helmet="true" `, ""),
  );
};
