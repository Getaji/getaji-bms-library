import type { GatsbyNode, CreatePagesArgs } from "gatsby";
import { writeFile, copyFile, readFile } from "fs/promises";
import { join as joinPath } from "path";

import type { Song } from "../../src/common/types";
import { FOLDER_NAMES } from "../../src/common/common";

const EXCLUDE_FOLDERS = ["Fav Charts", "ホラー注意"];

type GraphQLResponse = {
  allFolderJson: {
    edges: {
      node: Song;
    }[];
  };
};

/**
 * パース済みのカスタムフォルダデータから難易度表データ部を構築し保存する。
 * 
 * @param graphql Gatsbyのgraphqlタグ関数
 * @param baseDir 保存先のベースディレクトリ（プロジェクトルート想定）
 */
async function generateAndSaveTableData(graphql: CreatePagesArgs["graphql"], baseDir: string) {
  const {
    data,
    errors
  } = await graphql<GraphQLResponse>(`
    query TableDataQuery {
      allFolderJson {
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
            notes
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
    allFolderJson: {
      edges,
    },
  } = data;

  const tableSongs = edges
    .filter(({ node: song }) => !EXCLUDE_FOLDERS.includes(song.folder))
    .sort((a, b) => FOLDER_NAMES.indexOf(a.node.folder) - FOLDER_NAMES.indexOf(b.node.folder))
    .map(({ node: song }) => ({
      md5: song.md5,
      sha256: song.sha256,
      level: song.folder,
      title: song.subtitle ? `${song.title} ${song.subtitle}` : song.title,
      artist: song.subartist ? `${song.artist} ${song.subartist}` : song.artist,
    }))
    ;
  
  const tableSongsStr = JSON.stringify(tableSongs);

  await Promise.all([
    // TODO: ビルド出力ディレクトリの変更に対応できるようにする
    writeFile(joinPath(baseDir, "public", "table_data.json"), tableSongsStr),
    writeFile(joinPath(baseDir, "src", "table_data.json"), tableSongsStr),
  ]);
}

/**
 * プラグインの初期化時に呼び出される関数。
 * 
 * 以前はfolder.jsonのコンバートを行っていたが、外部で行うようにしたので廃止。
 */
// export const onPluginInit: GatsbyNode["onPluginInit"] = async () => {
// }

/**
 * ページの構築・再構築にフックして難易度表データ部JSONを生成し保存する。
 */
export const createPages: GatsbyNode["createPages"] = async ({ graphql, basePath }) => {
  await generateAndSaveTableData(graphql, basePath);
};

/**
 * ビルド完了にフックして難易度表ヘッダ部JSONをビルド結果の出力にコピーする。
 */
export const onPostBuild: GatsbyNode["onPostBuild"] = async () => {
  // TODO: ビルド出力ディレクトリの変更に対応できるようにする
  await copyFile("./src/table_header.json", "./public/table_header.json");

  const buffer = await readFile("./public/index.html");
  const html = buffer.toString("utf-8");
  await writeFile("./public/index.html", html.replace(`data-react-helmet="true" `, ""));
};
