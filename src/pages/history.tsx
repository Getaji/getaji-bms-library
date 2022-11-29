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
            <ul>
              <li>楽曲追加: Merry Christmas Mr.Lawrence</li>
            </ul>
          </section>
        </article>
      </main>
    </>
  )
};

export default Page;
