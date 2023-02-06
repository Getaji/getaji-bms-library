import React, { Fragment } from "react";
import { SimpleSong } from "../common/types";
import {
  makeLR2IRUrl,
  makeMochaUrl,
} from "../common/bms";
import "./SimpleBMSTable.css";

export type Props = {
  table: [folder: string, songs: SimpleSong[]][];
};

export function BMSTable({ table }: Props) {
  return (
    <table className="simpleBmsTable">
      <thead>
        <tr className="header">
          <th className="genre">ジャンル</th>
          <th className="title">タイトル</th>
          <th className="artist">アーティスト</th>
          <th className="lr2irLink">IR</th>
          <th className="accuracy">確度</th>
          <th className="comment">コメント</th>
        </tr>
      </thead>
      <tbody>
        {table.map(([folder, songs]) => (
          <Fragment key={folder}>
            <tr className="header">
              <th colSpan={6}>
                GL{folder.replace("~", "～")} ({songs.length} Songs)
              </th>
            </tr>
            {songs.map((song) => (
              <tr
                className="content"
                key={song.md5}
                data-accuracy={song.accuracy}
              >
                <td className="genre">{song.genre}</td>
                <td className="title">
                  {song.title} {song.subtitle}
                </td>
                <td className="artist">
                  {song.artist} {song.subartist}
                </td>
                <td className="irLinks">
                  <div className="irLinksInner">
                    <a
                      className="lr2ir"
                      href={makeLR2IRUrl(song.md5)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LR2
                      <br />
                      IR
                    </a>
                    <a
                      href={makeMochaUrl(song.sha256)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fa-solid fa-mug-saucer"></i>
                    </a>
                  </div>
                </td>
                <td className="accuracy">
                  <span>{song.accuracy}</span>
                </td>
                <td className="comment">{song.comment}</td>
              </tr>
            ))}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}

export default BMSTable;
