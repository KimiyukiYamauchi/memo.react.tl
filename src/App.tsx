import { FC, useState, useEffect } from "react";
import styles from "./App.module.css";

export const App: FC = () => {
  const [text, setText] = useState("");
  const [memos, setMemos] = useState<string[]>([]);

  // 初回読み込み時に localStorage から読み込む
  useEffect(() => {
    const saved = localStorage.getItem("memos");
    if (saved) {
      setMemos(JSON.parse(saved));
    }
  }, []);

  // memos が変わるたびに保存
  useEffect(() => {
    localStorage.setItem("memos", JSON.stringify(memos));
  }, [memos]);

  const handleAdd = () => {
    if (text.trim() === "") return;
    setMemos([...memos, text]);
    setText("");
  };

  const handleDelete = (index: number) => {
    setMemos(memos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h1>簡単メモアプリ</h1>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className={styles.button} onClick={handleAdd}>
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
                  onClick={() => handleDelete(index)}
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
