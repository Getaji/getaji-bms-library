import React, { Fragment } from "react";
import { Song } from "../common/types";
import { makeLR2IRUrl, makeMochaUrl } from "../common/bms";
import "./BMSTable.css";

export type Props = {
  table: [folder: string, songs: Song[]][];
};

export function BMSTable({ table }: Props) {
  return (
    <table className="bmsTable">
      <thead>
        <tr className="header">
          <th className="level">Lv</th>
          <th className="genre">ジャンル</th>
          <th className="title">タイトル</th>
          <th className="artist">アーティスト</th>
          <th className="lr2irLink">LR2IR</th>
          <th className="mochaLink">Mocha</th>
        </tr>
      </thead>
      <tbody>
        {
          table.map(([folder, songs]) => (
            <Fragment key={folder}>
              <tr className="header">
                <th colSpan={6}>GL{folder} ({songs.length} Songs)</th>
              </tr>
              {
                songs.map((song) => (
                  <tr className="content" key={song.md5} data-difficulty={song.difficulty}>
                    <td className="level">{song.level}</td>
                    <td className="genre">{song.genre}</td>
                    <td className="title">{song.title} {song.subtitle}</td>
                    <td className="artist">{song.artist} {song.subartist}</td>
                    <td className="lr2irLink">
                      <a href={makeLR2IRUrl(song.md5)} target="_blank" rel="noopener noreferrer">
                        <i className="fa-solid fa-link"></i>
                      </a>
                    </td>
                    <td className="mochaLink">
                      <a href={makeMochaUrl(song.sha256)} target="_blank" rel="noopener noreferrer">
                        <i className="fa-solid fa-link"></i>
                      </a>
                    </td>
                  </tr>
                ))
              }
            </Fragment>
          ))
        }
      </tbody>
    </table>
  );
}

export default BMSTable;
