import { FC, useState } from "react";
import styles from "./App.module.css";

export const App: FC = () => {
  const [inputMemo, setInputMemo] = useState("");
  const [memos, setMemos] = useState<string[]>([]);

  // メモ追加
  const addMemo = () => {
    if (inputMemo.trim() === "") return;
    setMemos([...memos, inputMemo]);
    setInputMemo("");
  };

  // メモ削除
  const deleteMemo = (index: number) => {
    const newMemos = [...memos];
    newMemos.splice(index, 1);
    setMemos(newMemos);
  };

  return (
    <div>
      <h1>簡単メモアプリ</h1>

      {/* 入力フォーム */}
      <input
        type="text"
        value={inputMemo}
        onChange={(e) => setInputMemo(e.target.value)}
      />
      <button className={styles.button} onClick={addMemo}>
        追加
      </button>

      {/* メモ一覧 */}
      <div className={styles.container}>
        <p>メモ一覧</p>
        <ul>
          {memos.map((memo, index) => (
            <li key={index}>
              <div className={styles.memoWrapper}>
                <p>{memo}</p>
                <button
                  className={styles.button}
                  onClick={() => deleteMemo(index)}
                >
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
