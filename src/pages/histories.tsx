// src/pages/histories.tsx
import React from "react";
import { Link, graphql, PageProps } from "gatsby";
import "./global.css";
import "../common/common-document.css";
import "./histories.css";
import "../templates/history-item.css";
import { Helmet } from "react-helmet";

interface HistoriesPageData {
  latest: {
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
    edges: Array<{
      node: {
        id: string;
        excerpt: string;
        fields: {
          slug: string;
        }
        frontmatter: {
          date: string;
          title: string;
        };
      };
    }>;
  };
}

const HistoriesPage: React.FC<PageProps<HistoriesPageData>> = ({ data }) => {
  const latest = data.latest.edges[0].node;
  const histories = data.allMarkdownRemark.edges;

  return (
    <>
      <Helmet>
        <title>更新履歴 | Getaji's BMS Library</title>
        <head prefix="og: https://ogp.me/ns#" />
        <meta property="og:url" content="/history/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="更新履歴 | Getaji's BMS Library" />
        <meta property="og:description" content="楽曲・譜面の追加、難易度の変更、譜面の削除などの履歴を掲載しています。" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@Getaji" />
      </Helmet>
      <main id="histories" className="histories-page document">
        <nav>
          <Link to="/">トップに戻る</Link>
        </nav>

        <header>更新履歴</header>

        <section>
          現在、更新履歴を改修中です。一時的に古い履歴が閲覧できなくなっていますが、そのうち対応します。
        </section>

        <article id="historyArticle" dangerouslySetInnerHTML={{ __html: latest.html }} />

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
  query HistoriesQuery {
    latest: allMarkdownRemark(
      filter: {fileAbsolutePath: {regex: "/src/content/histories/"}}
      limit: 1,
      sort: {frontmatter: {date: DESC}}
    ) {
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
      filter: { fileAbsolutePath: { regex: "/content/histories/" } }
      sort: {frontmatter: {date: DESC}}
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            date
            title
          }
          excerpt(pruneLength: 140)
        }
      }
    }
  }
`;

export default HistoriesPage;
