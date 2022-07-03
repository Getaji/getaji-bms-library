import React from "react";
import { ParsedTable } from "../common/types";
import { makeLR2IRUrl, makeMochaUrl } from "../common/bms";
import "./BMSTable.css";

export type Props = {
  table: ParsedTable;
};

export function BMSTable({ table }: Props) {
  return (
    <table className="bmsTable">
      <thead>
        <tr className="header">
          <th className="genre">ジャンル</th>
          <th className="title">タイトル</th>
          <th className="artist">アーティスト</th>
          <th className="lr2irLink">LR2IR</th>
          <th className="mochaLink">Mocha</th>
        </tr>
      </thead>
      <tbody>
        {
          table.folder.map((folder) => (
            <>
              <tr className="header">
                <th colSpan={5}>{folder.name} ({folder.songs.length} Songs)</th>
              </tr>
              {
                folder.songs.map((song) => (
                  <tr className="content" key={song.md5}>
                    <td className="genre">{song.genre}</td>
                    <td className="title">{song.titleFull}</td>
                    <td className="artist">{song.artistFull}</td>
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
            </>
          ))
        }
      </tbody>
    </table>
  );
}

export default BMSTable;
