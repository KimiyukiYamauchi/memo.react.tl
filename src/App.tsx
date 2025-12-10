import { FC, useState, useEffect } from "react";
import styles from "./App.module.css";

type Memo = {
  id: number;
  text: string;
  editing: boolean;
};

export const App: FC = () => {
  const [text, setText] = useState("");
  const [memos, setMemos] = useState<Memo[]>([]);

  // --- 初回だけ localStorage から読み込む ---
  useEffect(() => {
    const saved = localStorage.getItem("memos");
    if (saved) {
      setMemos(JSON.parse(saved));
    }
  }, []);

  // --- memos が変わったら localStorage に保存 ---
  useEffect(() => {
    localStorage.setItem("memos", JSON.stringify(memos));
  }, [memos]);

  // メモ追加
  const addMemo = () => {
    if (text.trim() === "") return;

    const newMemo: Memo = {
      id: Date.now(),
      text,
      editing: false,
    };

    setMemos([...memos, newMemo]);
    setText("");
  };

  // メモ削除
  const deleteMemo = (id: number) => {
    setMemos(memos.filter((memo) => memo.id !== id));
  };

  // すべて削除
  const deleteAll = () => {
    if (window.confirm("本当にすべて削除しますか？")) {
      setMemos([]);
    }
  };

  // 編集開始
  const startEdit = (id: number) => {
    setMemos(
      memos.map((memo) => (memo.id === id ? { ...memo, editing: true } : memo))
    );
  };

  // 編集保存
  const saveEdit = (id: number, newText: string) => {
    setMemos(
      memos.map((memo) =>
        memo.id === id ? { ...memo, text: newText, editing: false } : memo
      )
    );
  };

  // 編集キャンセル
  const cancelEdit = (id: number) => {
    setMemos(
      memos.map((memo) => (memo.id === id ? { ...memo, editing: false } : memo))
    );
  };

  return (
    <div>
      <h1>簡単メモアプリ</h1>

      {/* 入力欄 */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* 追加ボタン */}
      <button className={styles.button} onClick={addMemo}>
        追加
      </button>

      {/* 全削除ボタン */}
      {memos.length > 0 && (
        <button className={styles.button} onClick={deleteAll}>
          すべて削除
        </button>
      )}

      {/* メモ一覧 */}
      <div className={styles.container}>
        <p>メモ一覧</p>

        <ul>
          {memos.map((memo) => (
            <li key={memo.id}>
              <div className={styles.memoWrapper}>
                {memo.editing ? (
                  <>
                    {/* 編集モード */}
                    <input
                      type="text"
                      defaultValue={memo.text}
                      onChange={(e) => (memo.text = e.target.value)}
                    />

                    <button
                      className={styles.button}
                      onClick={() => saveEdit(memo.id, memo.text)}
                    >
                      保存
                    </button>

                    <button
                      className={styles.button}
                      onClick={() => cancelEdit(memo.id)}
                    >
                      キャンセル
                    </button>
                  </>
                ) : (
                  <>
                    {/* 通常表示 */}
                    <p>{memo.text}</p>

                    <button
                      className={styles.button}
                      onClick={() => startEdit(memo.id)}
                    >
                      編集
                    </button>

                    <button
                      className={styles.button}
                      onClick={() => deleteMemo(memo.id)}
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
