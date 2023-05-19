import React from "react";
import Helmet from "react-helmet";
import { graphql, PageProps } from "gatsby";

import { FOLDER_NAMES } from "../common/common";

import type { SimpleSong } from "../common/types";

import "./index.css";
import SimpleBMSTable from "../components/SimpleBMSTable";

type GraphQLResponse = {
  allFolderJson: {
    edges: {
      node: SimpleSong;
    }[];
  };
};

export const query = graphql`
query IndexPageTableDataQuery {
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
        accuracy
        comment
      }
    }
  }
}
`

const IndexPage = ({ data }: PageProps<GraphQLResponse>) => {
  const edges = data.allFolderJson.edges;

  const table = edges.reduce(
    (acc, cur) => {
      if (cur.node.folder in acc) {
        acc[cur.node.folder].push(cur.node);
      }
      return acc;
    },
    Object.fromEntries(FOLDER_NAMES.map((name) => [name, []])) as Record<string, SimpleSong[]>,
  );

  const tableEntries = Object.entries(table)
    .sort(([a], [b]) => {
      return FOLDER_NAMES.indexOf(a) - FOLDER_NAMES.indexOf(b);
    })
    .map(([folder, songs]) => [
      folder,
      songs.sort((a, b) => {
        const titleA = a.title + " " + a.subtitle;
        const titleB = b.title + " " + b.subtitle;
        return titleA.localeCompare(titleB, "ja");
      }),
    ] as [string, SimpleSong[]]);

  const totalSongCount = edges.length;

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
            BMSで好きな曲の譜面を収集して難易度を推定し分類した7鍵用の難易度表です。
          </p>
          <p>
            次期難易度表フォーマットに対応しています。<br />
            このページのURLをそのまま管理アプリやBMSプレイヤーに追加して利用できます。
          </p>
          <p>
            <a href="/about">もっと詳しい説明はこちら</a>
          </p>
          <p>
            <a href="/full">譜面密度などの詳細版ページはこちら（重いので注意）</a>
          </p>
          <p>
            <a href="/songs">収録楽曲一覧</a>
          </p>
          <p>
            <a href="/history">更新履歴（2023/05/19 更新）</a>
          </p>
          <p>
            収録曲数: 365曲 譜面数: {totalSongCount}譜面
          </p>
        </section>
        <SimpleBMSTable table={tableEntries} />
      </main>
    </>
  );
};

export default IndexPage;
