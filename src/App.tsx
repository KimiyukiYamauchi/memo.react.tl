import styles from "./App.module.css";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, SubmitEvent } from "react";

type Memo = {
  id: number;
  text: string;
  createdAt: string;
  createdAtTimestamp: number;
  updatedAt: string;
  important: boolean;
};

const storageKey = "memo-list";
const memosPerPage = 6;

function App() {
  const [input, setInput] = useState("");
  const [memos, setMemos] = useState<Memo[]>(() => {
    const savedMemos = localStorage.getItem(storageKey);
    if (!savedMemos) {
      return [];
    }

    try {
      return JSON.parse(savedMemos) as Memo[];
    } catch (error) {
      console.error("メモの読み込みに失敗しました", error);
      return [];
    }
  });
  const [error, setError] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState<
    "important" | "newest" | "oldest"
  >("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const nextId = useRef(
    memos.reduce((maxId, memo) => Math.max(maxId, memo.id), -1) + 1,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId !== null) {
      inputRef.current?.focus();
    }
  }, [editingId]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(memos));
  }, [memos]);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!input.trim()) {
      setError(true);
      return;
    }

    if (editingId !== null) {
      const updatedAt = new Date().toLocaleString("ja-JP");
      setMemos((currentMemos) =>
        currentMemos.map((memo) =>
          memo.id === editingId ? { ...memo, text: input, updatedAt } : memo,
        ),
      );
      setEditingId(null);
    } else {
      const createdAtTimestamp = Date.now();
      const createdAt = new Date(createdAtTimestamp).toLocaleString("ja-JP");
      setMemos((currentMemos) => [
        ...currentMemos,
        {
          id: nextId.current++,
          text: input,
          createdAt,
          createdAtTimestamp,
          updatedAt: createdAt,
          important: false,
        },
      ]);
    }

    setInput("");
    setError(false);
  };

  const handleDelete = (idToDelete: number) => {
    setMemos((currentMemos) =>
      currentMemos.filter((memo) => memo.id !== idToDelete),
    );
    if (editingId === idToDelete) {
      setEditingId(null);
      setInput("");
      setError(false);
    }
  };

  const handleEdit = (memoToEdit: Memo) => {
    setInput(memoToEdit.text);
    setEditingId(memoToEdit.id);
    setError(false);
  };

  const handleCancel = () => {
    setInput("");
    setEditingId(null);
    setError(false);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape" && editingId !== null) {
      event.preventDefault();
      handleCancel();
      return;
    }

    if (event.key === "Enter" && event.nativeEvent.isComposing) {
      event.preventDefault();
    }
  };

  const handleToggleImportant = (idToToggle: number) => {
    setMemos((currentMemos) =>
      currentMemos.map((memo) =>
        memo.id === idToToggle
          ? { ...memo, important: !memo.important }
          : memo,
      ),
    );
  };

  const displayedMemos = [...memos]
    .filter((memo) => memo.text.includes(searchText))
    .sort((a, b) => {
      if (sortOrder === "important" && a.important !== b.important) {
        return a.important ? -1 : 1;
      }

      return sortOrder === "oldest"
        ? a.createdAtTimestamp - b.createdAtTimestamp
        : b.createdAtTimestamp - a.createdAtTimestamp;
    });
  const totalPages = Math.ceil(displayedMemos.length / memosPerPage);
  const pagedMemos = displayedMemos.slice(
    (currentPage - 1) * memosPerPage,
    currentPage * memosPerPage,
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>簡単メモアプリ</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className={`${styles.input} ${error ? styles.error : ""}`}
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setError(false);
          }}
          onKeyDown={handleInputKeyDown}
          placeholder="メモを入力"
        />
        <button className={styles.addButton} type="submit">
          {editingId === null ? "追加" : "保存"}
        </button>
      </form>
      {error && <p className={styles.errorMessage}>メモを入力してください</p>}
      {editingId !== null && (
        <button type="button" onClick={handleCancel}>
          キャンセル
        </button>
      )}

      <input
        className={styles.input}
        value={searchText}
        onChange={(event) => {
          setSearchText(event.target.value);
          setCurrentPage(1);
        }}
        placeholder="メモを検索"
        aria-label="メモを検索"
      />
      <div className={styles.listHeader}>
        <p className={styles.subtitle}>メモ一覧（{memos.length}件）</p>
        <div className={styles.sortButtons}>
          {[
            { value: "newest", label: "新しい順" },
            { value: "oldest", label: "古い順" },
            { value: "important", label: "重要" },
          ].map((option) => (
            <button
              className={sortOrder === option.value ? styles.selected : ""}
              key={option.value}
              type="button"
              onClick={() => {
                setSortOrder(
                  option.value as "important" | "newest" | "oldest",
                );
                setCurrentPage(1);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      {memos.length === 0 ? (
        <p className={styles.empty}>メモはまだありません</p>
      ) : displayedMemos.length === 0 ? (
        <p className={styles.empty}>該当するメモはありません</p>
      ) : (
        <ul className={styles.memoList}>
          {pagedMemos.map((memo) => (
            <li
              className={`${styles.memoItem} ${
                memo.important ? styles.important : ""
              }`}
              key={memo.id}
            >
              <input
                type="checkbox"
                checked={memo.important}
                onChange={() => handleToggleImportant(memo.id)}
                aria-label="重要なメモにする"
              />
              <div className={styles.memoContent}>
                <p className={styles.memoText}>{memo.text}</p>
                <p className={styles.date}>
                  作成: {memo.createdAt} / 更新: {memo.updatedAt}
                </p>
              </div>
              <div className={styles.buttons}>
                <button type="button" onClick={() => handleEdit(memo)}>
                  編集
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("削除しますか？")) {
                      handleDelete(memo.id);
                    }
                  }}
                >
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
          >
            前へ
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            次へ
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
