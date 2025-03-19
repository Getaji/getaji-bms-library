import { graphql, PageProps, useStaticQuery } from "gatsby";
import React from "react";
import { Helmet } from "react-helmet";
import "../common/common-document.css";
import "./songs.css";

type GraphQLResponse = {
  allSongsJson: {
    edges: {
      node: {
        title: string;
        artist: string;
        note: string;
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
          note
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
        <head prefix="og: https://ogp.me/ns#" />
        <meta property="og:url" content="/songs/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="収録楽曲一覧 | Getaji's BMS Library" />
        <meta property="og:description" content="この難易度表に収録されている楽曲、公開イベントなどの出展情報、その他情報を掲載しています。" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@Getaji" />
      </Helmet>
      <main id="songs">
        <nav>
          <a href="/">トップに戻る</a>
        </nav>
        <header>収録楽曲一覧</header>
        <article className="document">
          <p style={{textAlign: "center", marginBottom: 40}}>全{songEdges.length}曲</p>
          <ul className="songList">
          {
            songEdges.map((edge) => (
              <li key={edge.node.title} className="song">
                <div className="song-titleAndArtist">
                  <span className="song-title">{edge.node.title}</span>
                  <span className="song-delimiter">/</span>
                  <span className="song-artist">{edge.node.artist}</span>
                </div>
                <div className="song-note">{edge.node.note}</div>
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
