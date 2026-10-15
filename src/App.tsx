import { useState } from "react";
import styles from "./App.module.css";

// 1. メモオブジェクトの型定義に important を追加
interface Memo {
  id: number;
  text: string;
  date: string;
  important: boolean; // 【追加】
}

function App() {
  const [inputText, setInputText] = useState("");
  const [memos, setMemos] = useState<Memo[]>([]);
  const [hasError, setHasError] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (hasError) {
      setHasError(false);
    }
  };

  const handleAddMemo = () => {
    if (!inputText.trim()) {
      setHasError(true);
      return;
    }

    const newMemo: Memo = {
      id: Date.now(),
      text: inputText,
      date: new Date().toLocaleString(),
      important: false, // 【追加】初期値は「重要ではない(false)」
    };

    setMemos([...memos, newMemo]);
    setInputText("");
    setHasError(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      handleAddMemo();
    }
  };

  const handleDeleteMemo = (id: number) => {
    const isConfirmed = window.confirm("削除しますか？");
    if (!isConfirmed) return;

    const filteredMemos = memos.filter((memo) => memo.id !== id);
    setMemos(filteredMemos);
    if (editingId === id) {
      handleCancelEdit();
    }
  };

  // 【追加】重要ステータスを反転させる（トグル）関数
  const handleToggleImportant = (id: number) => {
    const updatedMemos = memos.map((memo) => {
      if (memo.id === id) {
        return { ...memo, important: !memo.important }; // 反転させる
      }
      return memo;
    });
    setMemos(updatedMemos);
  };

  const handleStartEdit = (memo: Memo) => {
    setEditingId(memo.id);
    setEditText(memo.text);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleSaveEdit = (id: number) => {
    if (!editText.trim()) return;

    const updatedMemos = memos.map((memo) => {
      if (memo.id === id) {
        return { ...memo, text: editText };
      }
      return memo;
    });

    setMemos(updatedMemos);
    handleCancelEdit();
  };

  const filteredMemos = memos.filter((memo) =>
    memo.text.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const displayMemos = [...filteredMemos].sort((a, b) => {
    if (sortOrder === "desc") {
      return b.id - a.id;
    } else {
      return a.id - b.id;
    }
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>簡単メモアプリ</h1>

      <div className={styles.searchForm} style={{ marginBottom: "20px" }}>
        <input
          className={styles.input}
          placeholder="メモを検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.form}>
        <input
          className={styles.input}
          placeholder="メモを入力"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={
            hasError
              ? {
                  borderColor: "#ff4d4f",
                  boxShadow: "0 0 0 2px rgba(255, 77, 79, 0.2)",
                }
              : {}
          }
          disabled={editingId !== null}
        />
        <button
          className={styles.addButton}
          onClick={handleAddMemo}
          disabled={editingId !== null}
        >
          追加
        </button>
      </div>

      {hasError && (
        <p
          style={{
            color: "#ff4d4f",
            fontSize: "14px",
            margin: "-10px 0 15px 0",
          }}
        >
          メモを入力してください
        </p>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        {memos.length === 0 ? (
          <p className={styles.subtitle} style={{ margin: 0 }}>
            メモはまだありません
          </p>
        ) : (
          <p className={styles.subtitle} style={{ margin: 0 }}>
            {searchQuery
              ? `検索結果（${displayMemos.length}件）`
              : `メモ一覧（${memos.length}件）`}
          </p>
        )}

        {memos.length > 0 && (
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            style={{
              marginLeft: "auto",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            {sortOrder === "desc" ? "新しい順" : "古い順"}
          </button>
        )}
      </div>

      <ul className={styles.memoList}>
        {displayMemos.map((memo) => {
          // 【追加】important が true の場合は、複数のクラスを適用する
          const itemClassName = memo.important
            ? `${styles.memoItem} ${styles.importantMemo}`
            : styles.memoItem;

          return (
            <li key={memo.id} className={itemClassName}>
              {editingId === memo.id ? (
                <>
                  <div>
                    <input
                      className={styles.input}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <p className={styles.date}>{memo.date}</p>
                  </div>
                  <div className={styles.buttons}>
                    <button onClick={() => handleSaveEdit(memo.id)}>
                      保存
                    </button>
                    <button onClick={handleCancelEdit}>キャンセル</button>
                  </div>
                </>
              ) : (
                <>
                  {/* 【追加】トグル用のチェックボックス */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={memo.important}
                      onChange={() => handleToggleImportant(memo.id)}
                      style={{
                        cursor: "pointer",
                        width: "18px",
                        height: "18px",
                      }}
                    />
                    <div>
                      <p
                        className={styles.memoText}
                        style={memo.important ? { fontWeight: "bold" } : {}}
                      >
                        {memo.text}
                      </p>
                      <p className={styles.date}>{memo.date}</p>
                    </div>
                  </div>
                  <div className={styles.buttons}>
                    <button onClick={() => handleStartEdit(memo)}>編集</button>
                    <button onClick={() => handleDeleteMemo(memo.id)}>
                      削除
                    </button>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
