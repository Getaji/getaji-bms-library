import React from "react";
import Helmet from "react-helmet";
import loadable from "@loadable/component";
import { graphql, PageProps } from "gatsby";

import { FOLDER_NAMES } from "../common/common";

import type { Song } from "../common/types";

import "./full.css";

const BMSTable = loadable(() => import("../components/BMSTable"));

type GraphQLResponse = {
  allSqliteData: {
    edges: {
      node: Song;
    }[];
  };
};

export const query = graphql`
query FullPageTableDataQuery {
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
        notes
        n
        ln
        s
        ls
        density
        peakdensity
        enddensity
        total
        accuracy
        comment
      }
    }
  }
}
`

const IndexPage = ({ data }: PageProps<GraphQLResponse>) => {
  const edges = data.allSqliteData.edges;

  const table = edges.reduce(
    (acc, cur) => {
      if (cur.node.folder in acc) {
        acc[cur.node.folder].push(cur.node);
      }
      return acc;
    },
    Object.fromEntries(FOLDER_NAMES.map((name) => [name, []])) as Record<string, Song[]>,
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
    ] as [string, Song[]]);

  const totalSongCount = edges.length;

  return (
    <>
      <Helmet>
        <title>Getaji's BMS Library</title>
        <meta name="bmstable" content="https://getaji-bms-library.pages.dev/table_header.json" />
        <script src="https://kit.fontawesome.com/12c2830556.js" crossOrigin="anonymous"></script>
        <head prefix="og: https://ogp.me/ns#" />
        <meta property="og:url" content="/full/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Getaji's BMS Library" />
        <meta property="og:description" content="好きな曲の差分を収集し、難易度を推定して分類した7鍵用の難易度表です。" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@Getaji" />
      </Helmet>
      <main className="app full">
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
            <a href="/songs">収録楽曲一覧</a>
          </p>
          <p>
            <a href="/history">更新履歴（2025/01/06 更新）</a>
          </p>
          <p>
            収録曲数: 594曲 譜面数: {totalSongCount}譜面
          </p>
        </section>
        <BMSTable table={tableEntries} />
      </main>
    </>
  );
};

export default IndexPage;
