import { useEffect, useState } from "react";
import type { KeyboardEvent } from "react";
import styles from "./App.module.css";

type Memo = {
  id: number;
  text: string;
  createdAt: string;
  important: boolean;
};

const STORAGE_KEY = "memos";

// localStorageから保存済みのメモを読み込む
const loadMemos = (): Memo[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

function App() {
  // 初回の表示時だけlocalStorageから読み込む
  const [memos, setMemos] = useState<Memo[]>(loadMemos);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("oldest");

  // メモが変わるたびにlocalStorageへ保存する
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
  }, [memos]);

  // 検索語を含むメモだけを表示用の配列にする（memos自体は書き換えない）
  const filteredMemos = memos.filter((memo) => memo.text.includes(search));

  // コピーしてから作成順（id）で並び替える
  const sortedMemos = [...filteredMemos].sort((a, b) =>
    sortOrder === "newest" ? b.id - a.id : a.id - b.id,
  );

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
      important: false,
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

  // 確認ダイアログでOKが押されたらメモを削除する
  const deleteMemo = (id: number) => {
    if (!window.confirm("このメモを削除しますか？")) return;
    setMemos(memos.filter((memo) => memo.id !== id));
  };

  // 重要フラグを切り替える
  const toggleImportant = (id: number) => {
    setMemos(
      memos.map((memo) =>
        memo.id === id ? { ...memo, important: !memo.important } : memo,
      ),
    );
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

  // 編集中はEnterキーで保存、Escキーでキャンセルする（日本語変換中は除く）
  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
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
          <div className={styles.listHeader}>
            <p className={styles.subtitle}>
              メモ一覧（{filteredMemos.length}件 / 全{memos.length}件）
            </p>
            <div className={styles.buttons}>
              <button
                onClick={() => setSortOrder("newest")}
                disabled={sortOrder === "newest"}
              >
                新しい順
              </button>
              <button
                onClick={() => setSortOrder("oldest")}
                disabled={sortOrder === "oldest"}
              >
                古い順
              </button>
            </div>
          </div>
          {filteredMemos.length === 0 && (
            <p className={styles.empty}>該当するメモはありません</p>
          )}
          <ul className={styles.memoList}>
            {sortedMemos.map((memo) => (
              <li
                key={memo.id}
                className={`${styles.memoItem} ${memo.important ? styles.important : ""}`}
              >
                {editingId === memo.id ? (
                  <>
                    <input
                      className={styles.input}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={handleEditKeyDown}
                      autoFocus
                    />
                    <div className={styles.buttons}>
                      <button onClick={saveEdit}>保存</button>
                      <button onClick={cancelEdit}>キャンセル</button>
                    </div>
                  </>
                ) : (
                  <>
                    <label className={styles.memoContent}>
                      <input
                        type="checkbox"
                        checked={memo.important}
                        onChange={() => toggleImportant(memo.id)}
                      />
                      <div>
                        <p className={styles.memoText}>{memo.text}</p>
                        <p className={styles.date}>{memo.createdAt}</p>
                      </div>
                    </label>
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
