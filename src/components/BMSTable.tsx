import React, { Fragment } from "react";
import { Song } from "../common/types";
import { getJudge, makeLR2IRUrl, makeMochaUrl } from "../common/bms";
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
          <th className="lr2irLink">IR</th>
          <th className="info">情報</th>
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
                    <td className="irLinks">
                      <div className="irLinksInner">
                        <a className="lr2ir" href={makeLR2IRUrl(song.md5)} target="_blank" rel="noopener noreferrer">
                            LR2<br />IR
                        </a>
                        <a href={makeMochaUrl(song.sha256)} target="_blank" rel="noopener noreferrer">
                          <i className="fa-solid fa-mug-saucer"></i>
                        </a>
                      </div>
                    </td>
                    <td className="info">
                      <div>
                        <div>{song.notes}notes</div>
                        <div>TOTAL: {Math.floor(song.total)}</div>
                        <div>判定: {getJudge(song.judge)}({song.judge})</div>
                      </div>
                      <div>
                        <div>平均密度: {song.density.toFixed(4)}</div>
                        <div>最大: {song.peakdensity}</div>
                        <div>終盤: {song.enddensity}</div>
                      </div>
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
