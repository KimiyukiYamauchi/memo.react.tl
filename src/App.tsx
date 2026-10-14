import { useState } from "react";
import type { KeyboardEvent } from "react";
import styles from "./App.module.css";

type Memo = {
  id: number;
  text: string;
  createdAt: string;
};

function App() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");

  // 検索語を含むメモだけを表示用の配列にする（memos自体は書き換えない）
  const filteredMemos = memos.filter((memo) => memo.text.includes(search));

  // メモを追加する
  const addMemo = () => {
    const text = input.trim();
    if (text === "") {
      setError(true);
      return;
    }
    const newMemo: Memo = {
      id: Date.now(),
      text,
      createdAt: new Date().toLocaleString("ja-JP"),
    };
    setMemos([...memos, newMemo]);
    setInput("");
  };

  // Enterキーで追加する（日本語変換確定のEnterは除く）
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      addMemo();
    }
  };

  // メモを削除する
  const deleteMemo = (id: number) => {
    setMemos(memos.filter((memo) => memo.id !== id));
  };

  // 編集を開始する
  const startEdit = (memo: Memo) => {
    setEditingId(memo.id);
    setEditText(memo.text);
  };

  // 編集内容を保存する
  const saveEdit = () => {
    const text = editText.trim();
    if (text === "") return;
    setMemos(
      memos.map((memo) => (memo.id === editingId ? { ...memo, text } : memo)),
    );
    setEditingId(null);
  };

  // 編集をキャンセルする
  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>簡単メモアプリ</h1>

      <div className={styles.form}>
        <input
          className={`${styles.input} ${error ? styles.error : ""}`}
          placeholder="メモを入力"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(false);
          }}
          onKeyDown={handleKeyDown}
        />
        <button className={styles.addButton} onClick={addMemo}>
          追加
        </button>
      </div>
      {error && <p className={styles.errorMessage}>メモを入力してください</p>}

      <input
        className={`${styles.input} ${styles.search}`}
        placeholder="メモを検索"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {memos.length === 0 ? (
        <p className={styles.empty}>メモはまだありません</p>
      ) : (
        <>
          <p className={styles.subtitle}>
            メモ一覧（{filteredMemos.length}件 / 全{memos.length}件）
          </p>
          {filteredMemos.length === 0 && (
            <p className={styles.empty}>該当するメモはありません</p>
          )}
          <ul className={styles.memoList}>
            {filteredMemos.map((memo) => (
              <li key={memo.id} className={styles.memoItem}>
                {editingId === memo.id ? (
                  <>
                    <input
                      className={styles.input}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className={styles.buttons}>
                      <button onClick={saveEdit}>保存</button>
                      <button onClick={cancelEdit}>キャンセル</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className={styles.memoText}>{memo.text}</p>
                      <p className={styles.date}>{memo.createdAt}</p>
                    </div>
                    <div className={styles.buttons}>
                      <button onClick={() => startEdit(memo)}>編集</button>
                      <button onClick={() => deleteMemo(memo.id)}>削除</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
