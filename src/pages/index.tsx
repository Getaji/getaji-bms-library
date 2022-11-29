import React from "react";
import Helmet from "react-helmet";
import { graphql, useStaticQuery } from "gatsby";

import type { Table, ParsedTable } from "../common/types";
import BMSTable from "../components/BMSTable";
import "./index.css";

const EXCLUDE_FOLDERS = ["Fav Charts", "ホラー注意"];

type GraphQLResponse = {
  contentJson: Table;
};

const IndexPage = () => {
  const {
    contentJson: rawTable,
  } = useStaticQuery<GraphQLResponse>(graphql`
    query IndexPageTableDataQuery {
      contentJson {
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
  `);

  const parsedTable: ParsedTable = {
    ...rawTable,
    folder: rawTable.folder
      .filter((folder) => !EXCLUDE_FOLDERS.includes(folder.name))
      .map((folder) => {
        const songs = folder.songs.map((song) => ({
          ...song,
          titleFull: `${song.title} ${song.subtitle ?? ""}`.trim(),
          artistFull: `${song.artist} ${song.subartist ?? ""}`.trim(),
        }));
        songs.sort((a, b) => a.titleFull.localeCompare(b.titleFull, "ja"));

        return {
          ...folder,
          songs,
        };
      }),
  };

  return (
    <>
      <Helmet>
        <title>Getaji's BMS Library</title>
        <meta name="bmstable" content="https://getaji-bms-library.pages.dev/table_header.json" />
        <script src="https://kit.fontawesome.com/12c2830556.js" crossOrigin="anonymous"></script>
      </Helmet>
      <main className="app">
        <header>
          Getaji's BMS Library
        </header>
        <section>
          <p>
            BMSで好きな曲の譜面を収集して難易度を推定し分類した表です。
          </p>
          <p>
            次期難易度表フォーマットに対応しています。<br />
            読み込み時間の削減などの目的で<a href="./table_header.json">ヘッダ部のURL</a>をそのまま利用することもできます。
          </p>
          <p style={{ marginTop: "2em" }}>
            現在作業中です。
          </p>
          <p>
            <a href="/history">更新履歴（2022/11/29 更新）</a>
          </p>
        </section>
        <small>
          表内のジャンル、タイトル、アーティスト名などコンテンツの権利は各BMS作者に帰属します。<br />
          何かあれば
          <a href="https://twitter.com/Getaji" target="_blank" rel="noopener noreferrer">Twitter(@Getaji)</a>
          のDMまでお問い合わせください。
        </small>
        <BMSTable table={parsedTable} />
      </main>
    </>
  );
};

export default IndexPage;
