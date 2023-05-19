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
          <p style={{textAlign: "center"}}>全{songEdges.length}曲</p>
          <ul className="songList">
          {
            songEdges.map((edge) => (
              <li key={edge.node.title} className="song">
                <span className="song-title">{edge.node.title}</span>
                <span className="song-delimiter">/</span>
                <span className="song-artist">{edge.node.artist}</span>
              </li>
            ))
          }
          </ul>
        </article>
      </main>
    </>
  )
};

export default Page;
