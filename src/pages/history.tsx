import React from "react";
import { Helmet } from "react-helmet";
import "./history.css";

const Page = () => {
  return (
    <>
      <Helmet>
        <title>更新履歴 | Getaji's BMS Library</title>
      </Helmet>
      <main>
        <nav>
          <a href="/">トップに戻る</a>
        </nav>
        <header>更新履歴</header>
        <article>
          <section>
            <h1>2022/11/29</h1>
            <h2>楽曲追加</h2>
            <ul>
              <li>Merry Christmas Mr.Lawrence</li>
            </ul>
            <h2>譜面追加</h2>
            <table>
              <thead>
                <tr>
                  <th>難易度</th>
                  <th>譜面</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>!?</td>
                  <td>Milk [for patient player]</td>
                </tr>
                <tr>
                  <td>≡</td>
                  <td>Milk [White]</td>
                </tr>
              </tbody>
            </table>
            <h2>難易度変更</h2>
            <table>
              <thead>
                <tr>
                  <th>旧</th>
                  <th>新</th>
                  <th>譜面</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>☆4</td>
                  <td>!?</td>
                  <td>Aleph-0 [BEGINNER]</td>
                </tr>
                <tr>
                  <td>★★2</td>
                  <td>!?</td>
                  <td>Anger Control [Angry]</td>
                </tr>
                <tr>
                  <td>☆?</td>
                  <td>!?</td>
                  <td>Door Nock[enough]</td>
                </tr>
                <tr>
                  <td>☆?</td>
                  <td>★20</td>
                  <td>Milk [Dream]</td>
                </tr>
                <tr>
                  <td>★13</td>
                  <td>★14</td>
                  <td>Milk [KAHLUA]</td>
                </tr>
              </tbody>
            </table>
          </section>
        </article>
      </main>
    </>
  )
};

export default Page;
