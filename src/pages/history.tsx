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
      markdownRemark {
        html
      }
    }
  `);

  return (
    <>
      <Helmet>
        <title>更新履歴 | Getaji's BMS Library</title>
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
