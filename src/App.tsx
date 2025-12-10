import React, { FC, useState, useRef } from "react";
import styles from "./App.module.css";

type Memo = {
  id: number;
  text: string;
};

export const App: FC = () => {
  const [value, setValue] = useState("");
  const [memos, setMemos] = useState<Memo[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addMemo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = value.trim();
    if (!text) return;
    const newMemo: Memo = { id: Date.now(), text };
    setMemos((prev) => [...prev, newMemo]);
    setValue("");
    inputRef.current?.focus();
  };

  const deleteMemo = (id: number) => {
    setMemos((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div>
      <h1>簡単メモアプリ</h1>

      {/* Enterキーでも追加できるように form を使用 */}
      <form
        onSubmit={addMemo}
        style={{ display: "flex", gap: 8, alignItems: "center" }}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="メモを入力"
        />
        <button type="submit" className={styles.button}>
          追加
        </button>
      </form>

      <div className={styles.container}>
        <p>メモ一覧</p>
        <ul>
          {memos.length === 0 ? (
            <li>メモはありません</li>
          ) : (
            memos.map((memo) => (
              <li key={memo.id}>
                <div className={styles.memoWrapper}>
                  <p>{memo.text}</p>
                  <button
                    className={styles.button}
                    onClick={() => deleteMemo(memo.id)}
                    aria-label={`メモ "${memo.text}" を削除`}
                  >
                    削除
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default App;
