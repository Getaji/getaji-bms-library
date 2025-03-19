// src/pages/histories.tsx
import React from "react";
import { Link, graphql, PageProps } from "gatsby";
import "../common/common-document.css";
import "./history-item.css";
import { Helmet } from "react-helmet";

interface HistoriesPageData {
  article: {
    edges: {
      node: {
        frontmatter: {
          date: string;
          title: string;
        };
        html: string;
      };
    }[];
  };
  allMarkdownRemark: {
    edges: {
      node: {
        id: string;
        frontmatter: {
          date: string;
          title: string;
        };
        fields: {
          slug: string;
        };
      };
    }[];
  };
}

const HistoriesPage: React.FC<PageProps<HistoriesPageData>> = ({ data }) => {
  const article = data.article.edges[0].node;
  const histories = data.allMarkdownRemark.edges;

  return (
    <>
      <Helmet>
        <title>更新履歴: {article.frontmatter.title} | Getaji's BMS Library</title>
        <head prefix="og: https://ogp.me/ns#" />
        <meta property="og:url" content="/history/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="更新履歴 | Getaji's BMS Library" />
        <meta property="og:description" content="楽曲・譜面の追加、難易度の変更、譜面の削除などの履歴を掲載しています。" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@Getaji" />
      </Helmet>
      <main id="history" className="document histories-page">
        <nav>
          <Link to="/">トップに戻る</Link>
        </nav>
        <article id="historyArticle" dangerouslySetInnerHTML={{ __html: article.html }} />

        <section className="histories">
          <h2>更新履歴一覧</h2>
          <ul>
            {histories.map(({ node }) => (
              <li key={node.id}>
                <Link to={node.fields.slug}>
                  {node.frontmatter.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
};

export const query = graphql`
  query HistoryPageQuery($id: String!) {
    article: allMarkdownRemark(filter: { id: { eq: $id } }) {
      edges {
        node {
          frontmatter {
            date
            title
          }
          html
        }
      }
    }
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/src/content/histories/" } }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          id
          frontmatter {
            date
            title
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;

export default HistoriesPage;
