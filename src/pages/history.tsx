import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { Helmet } from "react-helmet";
import "./common-document.css";
import "./history.css";

type GraphQLResponse = {
  markdownRemark: {
    html: string;
  };
};

const Page = () => {
  const {
    markdownRemark: {
      html
    },
  } = useStaticQuery<GraphQLResponse>(graphql`
    query HistoryQuery {
      markdownRemark(frontmatter: {id: {eq: "history"}}) {
        html
      }
    }
  `);

  return (
    <>
      <Helmet>
        <title>更新履歴 | Getaji's BMS Library</title>
        <head prefix="og: https://ogp.me/ns#" />
        <meta property="og:url" content="/history/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="更新履歴 | Getaji's BMS Library" />
        <meta property="og:description" content="楽曲・譜面の追加、難易度の変更、譜面の削除などの履歴を掲載しています。" />
      </Helmet>
      <main id="history">
        <nav>
          <a href="/">トップに戻る</a>
        </nav>
        <header>更新履歴</header>
        <article className="document">
          <section dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </main>
    </>
  )
};

export default Page;
