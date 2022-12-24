import { graphql, PageProps, useStaticQuery } from "gatsby";
import React from "react";
import { Helmet } from "react-helmet";
import "./common-document.css";
import "./songs.css";

type GraphQLResponse = {
  allSongsJson: {
    edges: {
      node: {
        title: string;
        artist: string;
      };
    }[];
  };
};

export const query = graphql`
  query SongsQuery {
    allSongsJson {
      edges {
        node {
          title
          artist
        }
      }
    }
  }
`;

const Page = ({ data }: PageProps<GraphQLResponse>) => {

  const songEdges = data.allSongsJson.edges.sort((a, b) => a.node.title.localeCompare(b.node.title, "ja"));

  return (
    <>
      <Helmet>
        <title>収録楽曲一覧 | Getaji's BMS Library</title>
      </Helmet>
      <main id="songs">
        <nav>
          <a href="/">トップに戻る</a>
        </nav>
        <header>収録楽曲一覧</header>
        <article className="document">
          <table>
            <thead>
              <tr>
                <th>曲名</th>
                <th>アーティスト</th>
              </tr>
            </thead>
            <tbody>
              {
                songEdges.map((edge) => (
                  <tr key={edge.node.title}>
                    <td>{edge.node.title}</td>
                    <td>{edge.node.artist}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </article>
      </main>
    </>
  )
};

export default Page;
