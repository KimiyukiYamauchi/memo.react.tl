import { FC, useState, useEffect } from "react";
import styles from "./App.module.css";

export const App: FC = () => {
  const [text, setText] = useState(
    () => localStorage.getItem("memo_input") || ""
  );

  const [memos, setMemos] = useState<string[]>(
    () => JSON.parse(localStorage.getItem("memos") || "[]")
  );

  // 編集中のメモ情報
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("memos", JSON.stringify(memos));
  }, [memos]);

  const addMemo = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMemos([...memos, trimmed]);
    setText("");
    localStorage.setItem("memo_input", "");
  };

  const deleteMemo = (index: number) => {
    setMemos(memos.filter((_, i) => i !== index));
  };

  // 編集モード開始
  const startEdit = (index: number) => {
    setEditIndex(index);
    setEditText(memos[index]);
  };

  // 編集保存
  const saveEdit = () => {
    if (editIndex === null) return;
    const updated = [...memos];
    updated[editIndex] = editText;
    setMemos(updated);
    setEditIndex(null);
    setEditText("");
  };

  // 編集キャンセル
  const cancelEdit = () => {
    setEditIndex(null);
    setEditText("");
  };

  return (
    <div>
      <h1>簡単メモアプリ</h1>

      <input
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          localStorage.setItem("memo_input", e.target.value);
        }}
        onKeyDown={(e) => e.key === "Enter" && addMemo()}
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
                {editIndex === index ? (
                  // 編集モード
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button className={styles.button} onClick={saveEdit}>
                      保存
                    </button>
                    <button className={styles.button} onClick={cancelEdit}>
                      キャンセル
                    </button>
                  </>
                ) : (
                  // 通常表示モード
                  <>
                    <p>{memo}</p>
                    <button
                      className={styles.button}
                      onClick={() => startEdit(index)}
                    >
                      編集
                    </button>
                    <button
                      className={styles.button}
                      onClick={() => deleteMemo(index)}
                    >
                      削除
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
