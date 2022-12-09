import React from "react";
import Helmet from "react-helmet";
import { graphql, useStaticQuery } from "gatsby";

import { FOLDER_NAMES } from "../common/common";
import BMSTable from "../components/BMSTable";

import type { Song } from "../common/types";

import "./index.css";

type GraphQLResponse = {
  allFolderJson: {
    edges: {
      node: Song;
    }[];
  };
};

const IndexPage = () => {
  const {
    allFolderJson: {
      edges,
    },
  } = useStaticQuery<GraphQLResponse>(graphql`
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
      </Helmet>
      <main className="app">
        <header>
          Getaji's BMS Library
        </header>
        <section>
          <p>
            BMSで好きな曲の譜面を収集して難易度を推定し分類した難易度表です。<br />
            作業中につき、それなりのペースで譜面が追加されたり難易度が変更されたりします。
          </p>
          <p>
            次期難易度表フォーマットに対応しています。<br />
            読み込み時間の削減などの目的で<a href="./table_header.json">ヘッダ部のURL</a>をそのまま利用することもできます。
          </p>
          <p>
            現在の収録数: {totalSongCount}曲
          </p>
          <p>
            <a href="/about">もっと詳しい説明はこちら</a>
          </p>
          <p>
            <a href="/history">更新履歴（2022/12/09 更新）</a>
          </p>
        </section>
        <small>
          表内のジャンル、タイトル、アーティスト名などコンテンツの権利は各BMS作者に帰属します。<br />
          難易度の変更提案や掲載取り下げ要請などのお問い合わせは
          <a href="https://twitter.com/Getaji" target="_blank" rel="noopener noreferrer">Twitter(@Getaji)</a>
          のDMまでお願いします。
        </small>
        <BMSTable table={tableEntries} />
      </main>
    </>
  );
};

export default IndexPage;
