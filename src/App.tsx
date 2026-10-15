import { useState } from "react";
import styles from "./App.module.css";

// メモ1件に入れる情報
type Memo = {
  id: number;
  text: string;
  createdAt: string;
};

function App() {
  const [inputText, setInputText] = useState("");
  const [memoList, setMemoList] = useState<Memo[]>([]);
  const [hasError, setHasError] = useState(false);

  // どのメモを編集中か（nullなら編集していない）
  const [editingId, setEditingId] = useState<number | null>(null);

  // 編集中の文字
  const [editText, setEditText] = useState("");

  // 編集欄の入力エラー
  const [editHasError, setEditHasError] = useState(false);

  // メモを追加する
  const handleAdd = () => {
    const text = inputText.trim();

    if (text === "") {
      setHasError(true);
      return;
    }

    const newMemo: Memo = {
      id: Date.now(),
      text: text,
      createdAt: new Date().toLocaleString("ja-JP"),
    };

    setMemoList([...memoList, newMemo]);
    setInputText("");
    setHasError(false);
  };

  // メモを削除する
  const handleDelete = (id: number) => {
    setMemoList(memoList.filter((memo) => memo.id !== id));

    if (editingId === id) {
      handleCancel();
    }
  };

  // 編集を始める
  const handleEdit = (memo: Memo) => {
    setEditingId(memo.id);
    setEditText(memo.text);
    setEditHasError(false);
  };

  // 編集した内容を保存する
  const handleSave = () => {
    const text = editText.trim();

    if (text === "") {
      setEditHasError(true);
      return;
    }

    setMemoList(
      memoList.map((memo) =>
        memo.id === editingId
          ? { ...memo, text: text }
          : memo
      )
    );

    handleCancel();
  };

  // 編集を取り消す
  const handleCancel = () => {
    setEditingId(null);
    setEditText("");
    setEditHasError(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>簡単メモアプリ</h1>

      <div className={styles.form}>
        <input
          className={
            hasError
              ? `${styles.input} ${styles.error}`
              : styles.input
          }
          placeholder="メモを入力"
          value={inputText}
          onChange={(event) => {
            setInputText(event.target.value);
            setHasError(false);
          }}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              handleAdd();
            }
          }}
          aria-invalid={hasError}
          aria-describedby={hasError ? "input-error" : undefined}
        />

        <button className={styles.addButton} onClick={handleAdd}>
          追加
        </button>
      </div>

      {hasError && (
        <p
          id="input-error"
          className={styles.errorMessage}
          role="alert"
        >
          メモを入力してください
        </p>
      )}

      <p className={styles.subtitle}>
        メモ一覧（{memoList.length}件）
      </p>

      {memoList.length === 0 && (
        <p className={styles.empty}>メモはまだありません</p>
      )}

      <ul className={styles.memoList}>
        {memoList.map((memo) => (
          <li key={memo.id} className={styles.memoItem}>
            {editingId === memo.id ? (
              <>
                <div>
                  <input
                    className={
                      editHasError
                        ? `${styles.input} ${styles.error}`
                        : styles.input
                    }
                    aria-label="メモの編集"
                    value={editText}
                    onChange={(event) => {
                      setEditText(event.target.value);
                      setEditHasError(false);
                    }}
                    aria-invalid={editHasError}
                    aria-describedby={
                      editHasError ? "edit-error" : undefined
                    }
                    autoFocus
                  />

                  {editHasError && (
                    <p
                      id="edit-error"
                      className={styles.errorMessage}
                      role="alert"
                    >
                      メモを入力してください
                    </p>
                  )}

                  <p className={styles.date}>{memo.createdAt}</p>
                </div>

                <div className={styles.buttons}>
                  <button onClick={handleSave}>保存</button>
                  <button onClick={handleCancel}>
                    キャンセル
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className={styles.memoText}>{memo.text}</p>
                  <p className={styles.date}>{memo.createdAt}</p>
                </div>

                <div className={styles.buttons}>
                  <button onClick={() => handleEdit(memo)}>
                    編集
                  </button>

                  <button onClick={() => handleDelete(memo.id)}>
                    削除
                  </button>
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