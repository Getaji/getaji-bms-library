import type { GatsbyNode, CreatePagesArgs } from "gatsby";
import { writeFile, copyFile } from "fs/promises";
import { join as joinPath } from "path";

import type { Table } from "../../src/common/types";
import { parseAndSaveJSONFile } from "../../src/common/source-json-converter";

const EXCLUDE_FOLDERS = ["Fav Charts", "ホラー注意"];

type GraphQLResponse = {
  allContentJson: {
    edges: [
      {
        node: Table<{
          md5: string;
          sha256: string;
          genre: string;
          title: string;
          subtitle: string;
          artist: string;
          subartist: string;
        }>;
      }
    ];
  };
};

/**
 * パース済みのカスタムフォルダデータから難易度表データ部を構築し保存する。
 * 
 * @param graphql Gatsbyのgraphqlタグ関数
 * @param baseDir 保存先のベースディレクトリ（プロジェクトルート想定）
 */
async function generateAndSaveTableData(graphql: CreatePagesArgs["graphql"], baseDir: string) {
  const { data: resultData, errors } = await graphql<GraphQLResponse>(`
    query TableDataQuery {
      allContentJson {
        edges {
          node {
            name
            folder {
              name
              songs {
                genre
                md5
                sha256
                artist
                subartist
                title
                subtitle
              }
            }
          }
        }
      }
    }
  `);

  if (errors) {
    console.error(errors);
    return;
  }

  if (!resultData) return;

  const { allContentJson: { edges: [{ node: table }] } } = resultData;

  const tableSongs = table.folder
    .filter((folder) => !EXCLUDE_FOLDERS.includes(folder.name))
    .flatMap((folder) => folder.songs.map((song) => ({
      md5: song.md5,
      sha256: song.sha256,
      level: folder.name,
      title: `${song.title} ${song.subtitle ?? ""}`.trim(),
      artist: `${song.artist} ${song.subartist ?? ""}`.trim(),
    })));
  
  const tableSongsStr = JSON.stringify(tableSongs);

  await Promise.all([
    // TODO: ビルド出力ディレクトリの変更に対応できるようにする
    writeFile(joinPath(baseDir, "public", "table_data.json"), tableSongsStr),
    writeFile(joinPath(baseDir, "src", "table_data.json"), tableSongsStr),
  ]);
}

/**
 * プラグインの初期化時にカスタムフォルダデータを変換して上書き保存する。
 * 
 * この処理は開発サーバー起動時と本番ビルド時の両方で実行される。
 * 変換済みの場合はスキップする。
 * 
 * ビルドはマルチプロセスで実行されるので一度のビルドで複数回実行されることがある。
 */
export const onPluginInit: GatsbyNode["onPluginInit"] = async () => {
  console.log("Converting folder.json ...");
  const result = await parseAndSaveJSONFile(joinPath(process.cwd(), "src/content/folder.json"));
  if (result) {
    console.log("Done!");
  } else {
    console.log("folder.json has already been converted.");
  }
}

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
};
