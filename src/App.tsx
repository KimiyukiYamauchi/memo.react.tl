import { useState } from "react";
import styles from "./App.module.css";

type Memo = { id: number; text: string; createdAt: string };

function App() {
  const [memoList, setMemoList] = useState<Memo[]>([]);
  const [inputText, setInputText] = useState("");
  const [hasError, setHasError] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const handleAdd = () => {
    const text = inputText.trim();
    if (text === "") {
      setHasError(true);
      return;
    }

    setMemoList([
      ...memoList,
      { id: Date.now(), text, createdAt: new Date().toLocaleString() },
    ]);
    setInputText("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    setHasError(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 日本語の変換確定のEnterでは追加しない
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      handleAdd();
    }
  };

  const handleDelete = (id: number) => {
    setMemoList(memoList.filter((memo) => memo.id !== id));
  };

  const handleEditStart = (memo: Memo) => {
    setEditingId(memo.id);
    setEditText(memo.text);
  };

  const handleEditSave = (id: number) => {
    const text = editText.trim();
    if (text === "") return;

    setMemoList(
      memoList.map((memo) => (memo.id === id ? { ...memo, text } : memo)),
    );
    setEditingId(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>簡単メモアプリ</h1>

      <div className={styles.form}>
        <input
          className={
            hasError ? `${styles.input} ${styles.error}` : styles.input
          }
          value={inputText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="メモを入力"
        />
        <button className={styles.addButton} onClick={handleAdd}>
          追加
        </button>
      </div>
      {hasError && (
        <p className={styles.errorMessage}>メモを入力してください</p>
      )}

      <p className={styles.subtitle}>メモ一覧（{memoList.length}件）</p>
      {memoList.length === 0 && (
        <p className={styles.empty}>メモはまだありません</p>
      )}
      <ul className={styles.memoList}>
        {memoList.map((memo) => (
          <li key={memo.id} className={styles.memoItem}>
            {editingId === memo.id ? (
              <>
                <input
                  className={styles.input}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <div className={styles.buttons}>
                  <button onClick={() => handleEditSave(memo.id)}>保存</button>
                  <button onClick={handleEditCancel}>キャンセル</button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className={styles.memoText}>{memo.text}</p>
                  <p className={styles.date}>{memo.createdAt}</p>
                </div>
                <div className={styles.buttons}>
                  <button onClick={() => handleEditStart(memo)}>編集</button>
                  <button onClick={() => handleDelete(memo.id)}>削除</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
