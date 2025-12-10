import { FC, useState, useEffect } from "react";
import styles from "./App.module.css";

type Memo = {
  text: string;
  done: boolean;
};

export const App: FC = () => {
  const [text, setText] = useState("");
  const [memos, setMemos] = useState<Memo[]>([]);

  // 初回ロード時に localStorage から読み込み
  useEffect(() => {
    const saved = localStorage.getItem("memos");
    if (saved) {
      setMemos(JSON.parse(saved));
    }
  }, []);

  // memos が変わるたび localStorage に保存
  useEffect(() => {
    localStorage.setItem("memos", JSON.stringify(memos));
  }, [memos]);

  const handleAdd = () => {
    if (!text) return;

    setMemos([...memos, { text, done: false }]);
    setText("");
  };

  const handleDelete = (index: number) => {
    setMemos(memos.filter((_, i) => i !== index));
  };

  const handleToggleDone = (index: number) => {
    setMemos(
      memos.map((memo, i) =>
        i === index ? { ...memo, done: !memo.done } : memo
      )
    );
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
          {memos.map((memo, i) => (
            <li key={i}>
              <div className={styles.memoWrapper}>
                <input
                  type="checkbox"
                  checked={memo.done}
                  onChange={() => handleToggleDone(i)}
                />

                <p
                  style={{
                    textDecoration: memo.done ? "line-through" : "none",
                    color: memo.done ? "#888" : "black",
                  }}
                >
                  {memo.text}
                </p>

                <button
                  className={styles.button}
                  onClick={() => handleDelete(i)}
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
