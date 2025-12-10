import { FC, useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import styles from "./App.module.css";

export const App: FC = () => {
  const [inputText, setInputText] = useState("");
  const [memos, setMemos] = useState<string[]>([]);

  // 初回読み込み時に localStorage からメモを取得
  useEffect(() => {
    const saved = localStorage.getItem("memos");
    if (saved) {
      setMemos(JSON.parse(saved));
    }
  }, []);

  // memos に変更があるたび localStorage に保存
  useEffect(() => {
    localStorage.setItem("memos", JSON.stringify(memos));
  }, [memos]);

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const onKeyDownInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addMemo();
  };

  const addMemo = () => {
    if (!inputText.trim()) return;
    setMemos([...memos, inputText]);
    setInputText("");
  };

  const deleteMemo = (index: number) => {
    setMemos(memos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h1>簡単メモアプリ</h1>

      <input
        type="text"
        value={inputText}
        onChange={onChangeInput}
        onKeyDown={onKeyDownInput}
      />

      <button className={styles.button} onClick={addMemo}>
        追加
      </button>

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
