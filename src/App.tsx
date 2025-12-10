import { FC, useState, useEffect } from "react";
import styles from "./App.module.css";
import {
  loadMemos,
  saveMemos,
  STORAGE_KEY,
  createAddMemoHandler,
  createDeleteMemoHandler,
  createKeyDownHandler,
} from "./memoOperations";

export const App: FC = () => {
  const [memos, setMemos] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
                <p>{memo}</p>
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
