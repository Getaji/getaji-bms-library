import React from "react";
import Helmet from "react-helmet";
import loadable from "@loadable/component";
import { graphql, Link, PageProps } from "gatsby";

import { FOLDER_NAMES } from "../common/common";

import type { SimpleSong } from "../common/types";

import "./global.css";
import "./index.css";

const SimpleBMSTable = loadable(() => import("../components/SimpleBMSTable"));

type GraphQLResponse = {
  latestHistory: {
    edges: {
      node: {
        frontmatter: {
          date: string;
        }
      }
    }[]
  }
  songsCount: {
    totalCount: number;
  };
  charts: {
    edges: {
      node: SimpleSong;
    }[];
  };
};

export const query = graphql`
query IndexPageTableDataQuery {
  latestHistory: allMarkdownRemark(
    filter: {fileAbsolutePath: {regex: "/src/content/histories/"}}
    limit: 1,
    sort: {frontmatter: {date: DESC}}
  ) {
    edges {
      node {
        frontmatter {
          date
        }
      }
    }
  }
  songsCount: allSongsJson {
    totalCount
  }
  charts: allSqliteData {
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
        url
        url_diff
      }
    }
  }
}
`

const IndexPage = ({ data }: PageProps<GraphQLResponse>) => {
  const updatedAt = data.latestHistory.edges[0].node.frontmatter.date;
  const songsCount = data.songsCount.totalCount;
  const charts = data.charts.edges;

  const table = charts.reduce(
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

  const chartsCount = charts.length;

  return (
    <>
      <Helmet>
        <title>Getaji's BMS Library</title>
        <meta name="bmstable" content="https://getaji-bms-library.pages.dev/table_header.json" />
        <script src="https://kit.fontawesome.com/12c2830556.js" crossOrigin="anonymous"></script>
        <head prefix="og: https://ogp.me/ns#" />
        <meta property="og:url" content="/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Getaji's BMS Library" />
        <meta property="og:description" content="好きな曲の差分を収集し、難易度を推定して分類した7鍵用の難易度表です。" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@Getaji" />
      </Helmet>
      <main id="index" className="app">
        <header>
          Getaji's BMS Library
        </header>
        <section>
          <p>
            好きなBMS楽曲の譜面を収集して難易度を推定・分類した7鍵用の難易度表です。
          </p>
          <p>
            次期難易度表フォーマットに対応しています。<br />
            このページのURLをそのまま管理アプリやBMSプレイヤーに追加して利用できます。
          </p>
          <p>
            {updatedAt} 更新
          </p>
          <nav id="indexNav">
            <Link className="navItem" to="/about">詳細説明</Link>
            <Link className="navItem" to="/songs">楽曲一覧</Link>
            <Link className="navItem" to="/histories">更新履歴</Link>
          </nav>
          <p>
            収録曲数: {songsCount}曲 譜面数: {chartsCount}譜面
          </p>
        </section>
        <div id="tableContainer">
          <SimpleBMSTable table={tableEntries} />
        </div>
      </main>
    </>
  );
};

export default IndexPage;
