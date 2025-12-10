import { FC, useState, useEffect } from "react";
import styles from "./App.module.css";

export const App: FC = () => {
  const [inputText, setInputText] = useState("");
  const [memos, setMemos] = useState<string[]>([]);

  // Load memos from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("memos");
    if (saved) {
      setMemos(JSON.parse(saved));
    }
  }, []);

  // Save memos to localStorage
  useEffect(() => {
    localStorage.setItem("memos", JSON.stringify(memos));
  }, [memos]);

  const handleAdd = () => {
    if (!inputText.trim()) return;
    setMemos([...memos, inputText]);
    setInputText("");
  };

  const handleDelete = (index: number) => {
    setMemos(memos.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.background}>
      <h1>簡単メモアプリ</h1>

      <input
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAdd();
        }}
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={handleAdd} className={styles.button}>
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
                  onClick={() => handleDelete(index)}
                  className={styles.deleteButton}
                  style={{ padding: "2px 6px", fontSize: "0.8rem" }}
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
