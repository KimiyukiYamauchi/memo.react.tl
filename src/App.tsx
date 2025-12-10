import React, { FC, useState, useEffect } from "react";
import styles from "./App.module.css";

type Memo = {
  text: string;
  done: boolean;
};

export const App: FC = () => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [inputValue, setInputValue] = useState("");

  // ページ読み込み時に localStorage から復元 or 初期値セット
  useEffect(() => {
    const saved = localStorage.getItem("memos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMemos(parsed);
        } else {
          setMemos([{ text: "買い物に行く", done: false }]);
        }
      } catch {
        setMemos([{ text: "買い物に行く", done: false }]);
      }
    } else {
      setMemos([{ text: "買い物に行く", done: false }]);
    }
  }, []);

  // memos 更新時に localStorage に保存
  useEffect(() => {
    localStorage.setItem("memos", JSON.stringify(memos));
  }, [memos]);

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    setMemos([...memos, { text: inputValue.trim(), done: false }]);
    setInputValue("");
  };

  const handleDelete = (index: number) => {
    setMemos(memos.filter((_, i) => i !== index));
  };

  const toggleDone = (index: number) => {
    setMemos(
      memos.map((memo, i) =>
        i === index ? { ...memo, done: !memo.done } : memo
      )
    );
  };

  return (
    <div>
      <h1>簡単メモアプリ</h1>

      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="メモを入力"
        />
        <button className={styles.button} onClick={handleAdd}>
          追加
        </button>
      </div>

      <div className={styles.container}>
        <p>メモ一覧</p>
        <ul>
          {memos.map((memo, index) => (
            <li key={index}>
              <div className={styles.memoWrapper}>
                <input
                  type="checkbox"
                  checked={memo.done}
                  onChange={() => toggleDone(index)}
                />
                <span
                  style={{
                    textDecoration: memo.done ? "line-through" : "none",
                    marginLeft: "8px",
                  }}
                >
                  {memo.text}
                </span>
                <button
                  className={styles.button}
                  onClick={() => handleDelete(index)}
                  style={{ marginLeft: "8px" }}
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
