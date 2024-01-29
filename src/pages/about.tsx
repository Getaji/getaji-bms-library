import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { Helmet } from "react-helmet";
import "./common-document.css";
import "./about.css";

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
    query AboutQuery {
      markdownRemark(frontmatter: {id: {eq: "about"}}) {
        html
      }
    }
  `);

  return (
    <>
      <Helmet>
        <title>この難易度表について | Getaji's BMS Library</title>
        <head prefix="og: https://ogp.me/ns#" />
        <meta property="og:url" content="/about/" />
        <meta property="og:type" content=" ページの種類" />
        <meta property="og:title" content=" ページのタイトル" />
        <meta property="og:description" content=" ページの説明文" />
        <meta property="og:site_name" content="サイト名" />
        <meta property="og:image" content=" サムネイル画像のURL" />
      </Helmet>
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
  )
};

export default Page;
