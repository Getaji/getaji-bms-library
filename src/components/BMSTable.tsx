import React, { Fragment } from "react";
import { Song } from "../common/types";
import {
  calcTotal,
  getBpmText,
  getJudge,
  getFeatures,
  makeLR2IRUrl,
  makeMochaUrl,
  getTimeString,
} from "../common/bms";
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
          <th className="accuracy">確度</th>
          <th className="comment">コメント</th>
        </tr>
      </thead>
      <tbody>
        {table.map(([folder, songs]) => (
          <Fragment key={folder}>
            <tr className="header">
              <th colSpan={8}>
                GL{folder.replace("~", "～")} ({songs.length} Songs)
              </th>
            </tr>
            {songs.map((song) => (
              <tr
                className="content"
                key={song.md5}
                data-difficulty={song.difficulty}
                data-accuracy={song.accuracy}
              >
                <td className="level">{song.level}</td>
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
                <td className="info">
                  <div className="info-bpm_notes_time">
                    <div>BPM{getBpmText(song)}</div>
                    <div
                      title={`通常ノーツ:${song.n} 皿:${song.s}\nLN:${song.ln} BSS:${song.ls}`}
                    >
                      {song.notes}notes
                    </div>
                    <div>{getTimeString(song)}</div>
                  </div>
                  <div>
                    <div>
                      TOTAL: {Math.floor(song.total)}(
                      {(() => {
                        const total = Math.floor(song.total);
                        const calculatedTotal = Math.floor(
                          calcTotal(song.notes)
                        );
                        const diff = total - calculatedTotal;
                        const sign = diff >= 0 ? "+" : "";
                        const rate = ((total / calculatedTotal) * 100).toFixed(
                          2
                        );
                        return `${sign + diff}/${rate}%`;
                      })()}
                      )
                    </div>
                    <div className="info-judge" data-judge={getJudge(song.judge)}>
                      判定: <span className="info-judge-text">{getJudge(song.judge)}({song.judge})</span>
                    </div>
                  </div>
                  <div>
                    <div>平均密度: {song.density.toFixed(4)}</div>
                    <div>最大: {song.peakdensity}</div>
                    <div>終盤: {song.enddensity}</div>
                  </div>
                  {(() => {
                    const features = getFeatures(song);
                    return features.length ? (
                      <div className="info-features">
                        <ul>
                          {getFeatures(song).map((feature) => (
                            <li key={feature.id}>{feature.jp}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null;
                  })()}
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
