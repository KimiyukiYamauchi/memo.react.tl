import { useState } from "react";
import styles from "./App.module.css";

type Memo = {
  id: number;
  text: string;
  createdAt: string;
};

function App() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState(false);

  // 編集用
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // メモ追加
  const handleAdd = () => {
    if (inputText.trim() === "") {
      setError(true);
      return;
    }

    const newMemo: Memo = {
      id: Date.now(),
      text: inputText.trim(),
      createdAt: new Date().toLocaleString("ja-JP"),
    };

    setMemos([...memos, newMemo]);
    setInputText("");
    setError(false);
  };

  // メモ削除
  const handleDelete = (id: number) => {
    setMemos(memos.filter((memo) => memo.id !== id));
  };

  // 編集開始
  const handleEdit = (memo: Memo) => {
    setEditingId(memo.id);
    setEditText(memo.text);
  };

  // 編集内容を保存
  const handleSave = (id: number) => {
    if (editText.trim() === "") {
      return;
    }

    setMemos(
      memos.map((memo) =>
        memo.id === id ? { ...memo, text: editText.trim() } : memo,
      ),
    );

    setEditingId(null);
    setEditText("");
  };

  // 編集キャンセル
  const handleCancel = () => {
    setEditingId(null);
    setEditText("");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>簡単メモアプリ</h1>

      <div className={styles.form}>
        <input
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);

            // 入力を始めたらエラーを消す
            if (e.target.value !== "") {
              setError(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
              handleAdd();
            }
          }}
          placeholder="メモを入力"
        />

        <button className={styles.addButton} onClick={handleAdd}>
          追加
        </button>
      </div>

      {error && <p className={styles.errorMessage}>メモを入力してください</p>}

      <p className={styles.subtitle}>メモ一覧（{memos.length}件）</p>

      {memos.length === 0 ? (
        <p className={styles.emptyMessage}>メモはまだありません</p>
      ) : (
        <ul className={styles.memoList}>
          {memos.map((memo) => (
            <li key={memo.id} className={styles.memoItem}>
              {editingId === memo.id ? (
                <>
                  <input
                    className={styles.editInput}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />

                  <div className={styles.buttons}>
                    <button onClick={() => handleSave(memo.id)}>保存</button>

                    <button onClick={handleCancel}>キャンセル</button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className={styles.memoText}>{memo.text}</p>

                    <small className={styles.date}>{memo.createdAt}</small>
                  </div>

                  <div className={styles.buttons}>
                    <button onClick={() => handleEdit(memo)}>編集</button>

                    <button onClick={() => handleDelete(memo.id)}>削除</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
