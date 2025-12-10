import { FC, useState, useEffect } from "react";
import styles from "./App.module.css";
import {
  loadMemos,
  saveMemos,
  STORAGE_KEY,
  createAddMemoHandler,
  createDeleteMemoHandler,
  createKeyDownHandler,
  createEditMemoHandler,
  createStartEditHandler,
} from "./memoOperations";

export const App: FC = () => {
  const [memos, setMemos] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");

  // 初回読み込み時にlocalStorageからメモを読み込む
  useEffect(() => {
    setMemos(loadMemos());
  }, []);

  // memosが変更されたらlocalStorageに保存
  useEffect(() => {
    if (memos.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      saveMemos(memos);
    }
  }, [memos]);

  // ハンドラーの作成
  const handleAdd = createAddMemoHandler(setMemos, setInputValue, memos);
  const handleDelete = createDeleteMemoHandler(
    setMemos,
    setSelectedIndex,
    memos
  );
  const handleKeyDown = createKeyDownHandler(handleAdd, inputValue);
  const handleEditMemo = createEditMemoHandler(
    setMemos,
    setEditingIndex,
    setEditingValue,
    memos
  );
  const handleStartEdit = createStartEditHandler(
    setEditingIndex,
    setEditingValue,
    memos
  );

  return (
    <div>
      <h1>簡単メモアプリ</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className={styles.button} onClick={() => handleAdd(inputValue)}>
        追加
      </button>
      <div className={styles.container}>
        <p>メモ一覧</p>
        <ul>
          {memos.map((memo, index) => (
            <li
              key={index}
              onClick={() => setSelectedIndex(index)}
              style={{
                backgroundColor:
                  selectedIndex === index ? "#e0e0e0" : "transparent",
              }}
            >
              <div className={styles.memoWrapper}>
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onBlur={() => handleEditMemo(index, editingValue)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEditMemo(index, editingValue);
                      } else if (e.key === "Escape") {
                        setEditingIndex(null);
                      }
                    }}
                    autoFocus
                    style={{ flex: 1, marginRight: "8px" }}
                  />
                ) : (
                  <p>{memo}</p>
                )}
                {editingIndex !== index && (
                  <button
                    className={styles.editButton}
                    onClick={() => handleStartEdit(index)}
                  >
                    編集
                  </button>
                )}
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(index)}
                  onKeyDown={(e) => {
                    // Ctrl+W または Delete で削除
                    if ((e.key === "w" && e.ctrlKey) || e.key === "Delete") {
                      e.preventDefault();
                      handleDelete(index);
                    }
                  }}
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
