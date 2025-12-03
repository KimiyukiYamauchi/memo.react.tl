import { FC } from "react";
import styles from "./App.module.css";

export const App: FC = () => {
  return (
    <div>
      <h1>簡単メモアプリ</h1>
      <input type="text" />
      <button className={styles.button}>追加</button>
      <div className={styles.container}>
        <p>メモ一覧</p>
        <ul>
          <li>
            <div className={styles.memoWrapper}>
              <p>買い物に行く</p>
              <button className={styles.button}>削除</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
