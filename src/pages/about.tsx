import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import "./global.css";
import "../common/common-document.css";
import "./about.css";

type GraphQLResponse = {
  markdownRemark: {
    html: string;
  };
};

export const Head = () => (
  <>
    <title>この難易度表について | Getaji's BMS Library</title>
    <head prefix="og: https://ogp.me/ns#" />
    <meta property="og:url" content="/about/" />
    <meta property="og:type" content="website" />
    <meta
      property="og:title"
      content="この難易度表について | Getaji's BMS Library"
    />
    <meta
      property="og:description"
      content="好きなBMS楽曲の譜面を収集して難易度を推定・分類した7鍵用の難易度表です。"
    />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:creator" content="@Getaji" />
  </>
);

const Page = () => {
  const {
    markdownRemark: { html },
  } = useStaticQuery<GraphQLResponse>(graphql`
    query AboutQuery {
      markdownRemark(frontmatter: { id: { eq: "about" } }) {
        html
      }
    }
  `);

  return (
    <>
      <main id="about">
        <nav>
          <a href="/">トップに戻る</a>
        </nav>
        <header>この難易度表について</header>
        <article className="document">
          <section dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </main>
    </>
  );
};

export default Page;
