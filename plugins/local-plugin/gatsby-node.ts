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

async function generateTableDataJson(graphql: CreatePagesArgs["graphql"], baseDir: string) {
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

  await Promise.all([
    writeFile(joinPath(baseDir, "public", "table_data.json"), JSON.stringify(tableSongs)),
    writeFile(joinPath(baseDir, "src", "table_data.json"), JSON.stringify(tableSongs)),
  ]);
}

export const onPluginInit: GatsbyNode["onPluginInit"] = async () => {
  console.log("Converting folder.json ...");
  const result = await parseAndSaveJSONFile(joinPath(process.cwd(), "src/content/folder.json"));
  if (result) {
    console.log("Done!");
  } else {
    console.log("folder.json has already been converted.");
  }
}

export const createPages: GatsbyNode["createPages"] = async ({ graphql, basePath }) => {
  await generateTableDataJson(graphql, basePath);
};

export const onPostBuild: GatsbyNode["onPostBuild"] = async () => {
  await copyFile("./src/table_header.json", "./public/table_header.json");
};
