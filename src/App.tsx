import { useEffect, useState } from "react";
import MemoItem from "./MemoItem";
import type { Memo } from "./MemoItem";
import styles from "./App.module.css";

const STORAGE_KEY = "memo-react-list";

// 保存データが正しいメモか確認する
function isMemo(value: unknown): value is Memo {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const memo = value as Record<string, unknown>;

  return (
    typeof memo.id === "number" &&
    Number.isFinite(memo.id) &&
    typeof memo.text === "string" &&
    typeof memo.createdAt === "string" &&
    typeof memo.important === "boolean" &&
    (memo.updatedAt === undefined ||
      typeof memo.updatedAt === "string")
  );
}

// 保存してあるメモを読み込む
function loadMemos(): Memo[] {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData === null) {
      return [];
    }

    const data: unknown = JSON.parse(savedData);

    if (!Array.isArray(data)) {
      return [];
    }

    return data.filter(isMemo);
  } catch {
    return [];
  }
}

function App() {
  const [inputText, setInputText] = useState("");
  const [memoList, setMemoList] = useState<Memo[]>(loadMemos);
  const [errorMessage, setErrorMessage] = useState("");
  const [storageError, setStorageError] = useState("");

  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState<"new" | "old">("new");
  const [importantOnly, setImportantOnly] = useState(false);

  // メモが変わったら自動保存
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(memoList)
      );
      setStorageError("");
    } catch {
      setStorageError(
        "ブラウザに保存できませんでした。再読み込みすると変更が消える可能性があります。"
      );
    }
  }, [memoList]);

  // 元の一覧を変更せず、表示するメモを作る
  const displayedMemos = [...memoList]
    .filter((memo) => memo.text.includes(searchText))
    .filter((memo) => !importantOnly || memo.important)
    .sort((a, b) => {
      // 重要なメモを先に表示
      if (a.important !== b.important) {
        return a.important ? -1 : 1;
      }

      // 重要度が同じなら作成順で比較
      return sortOrder === "new" ? b.id - a.id : a.id - b.id;
    });

  // メモを追加する
  const handleAdd = () => {
    const text = inputText.trim();

    if (text === "") {
      setErrorMessage("メモを入力してください");
      return;
    }

    if (inputText.length > 50) {
      setErrorMessage("メモは50文字以内で入力してください");
      return;
    }

    const createdAt = new Date().toLocaleString("ja-JP");

    setMemoList((currentMemos) => {
      const latestId = currentMemos.reduce(
        (largest, memo) => Math.max(largest, memo.id),
        0
      );

      const newMemo: Memo = {
        id: Math.max(Date.now(), latestId + 1),
        text: text,
        createdAt: createdAt,
        important: false,
      };

      return [...currentMemos, newMemo];
    });

    setInputText("");
    setErrorMessage("");
  };

  // 確認してから削除する
  const handleDelete = (id: number) => {
    if (!window.confirm("削除しますか？")) {
      return;
    }

    setMemoList((currentMemos) =>
      currentMemos.filter((memo) => memo.id !== id)
    );
  };

  // 編集内容と更新日時を保存する
  const handleSave = (id: number, text: string) => {
    const updatedAt = new Date().toLocaleString("ja-JP");

    setMemoList((currentMemos) =>
      currentMemos.map((memo) =>
        memo.id === id
          ? {
              ...memo,
              text: text,
              updatedAt: updatedAt,
            }
          : memo
      )
    );
  };

  // 重要チェックを切り替える
  const handleToggleImportant = (id: number) => {
    setMemoList((currentMemos) =>
      currentMemos.map((memo) =>
        memo.id === id
          ? { ...memo, important: !memo.important }
          : memo
      )
    );
  };

  const inputError =
    errorMessage ||
    (inputText.length > 50
      ? "メモは50文字以内で入力してください"
      : "");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>簡単メモアプリ</h1>

      {storageError !== "" && (
        <p className={styles.errorMessage} role="alert">
          {storageError}
        </p>
      )}

      <div className={styles.form}>
        <input
          className={
            inputError !== ""
              ? `${styles.input} ${styles.error}`
              : styles.input
          }
          aria-label="新しいメモ"
          placeholder="メモを入力"
          value={inputText}
          onChange={(event) => {
            setInputText(event.target.value);
            setErrorMessage("");
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
          aria-invalid={inputError !== ""}
          aria-describedby="input-count input-error"
        />

        <button
          className={styles.addButton}
          onClick={handleAdd}
          disabled={inputText.length > 50}
        >
          追加
        </button>
      </div>

      <p
        id="input-count"
        style={{
          color: inputText.length > 50 ? "#b42318" : "inherit",
        }}
      >
        {inputText.length} / 50文字
      </p>

      <p
        id="input-error"
        className={styles.errorMessage}
        role="alert"
      >
        {inputError}
      </p>

      <p className={styles.subtitle}>メモを検索</p>

      <div className={styles.form}>
        <input
          className={styles.input}
          aria-label="メモを検索"
          placeholder="検索する言葉を入力"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />

        <button onClick={() => setSearchText("")}>
          クリア
        </button>
      </div>

      <div className={styles.buttons}>
        <button
          onClick={() => setSortOrder("new")}
          aria-pressed={sortOrder === "new"}
          disabled={sortOrder === "new"}
        >
          新しい順
        </button>

        <button
          onClick={() => setSortOrder("old")}
          aria-pressed={sortOrder === "old"}
          disabled={sortOrder === "old"}
        >
          古い順
        </button>

        <button
          onClick={() => setImportantOnly(!importantOnly)}
          aria-pressed={importantOnly}
        >
          {importantOnly ? "すべて表示する" : "重要なメモだけ表示"}
        </button>
      </div>

      <p>重要なメモを先に表示します。</p>

      <p className={styles.subtitle}>
        メモ一覧（{memoList.length}件）
      </p>

      <p>表示中：{displayedMemos.length}件</p>

      {memoList.length === 0 && (
        <p className={styles.empty}>メモはまだありません</p>
      )}

      {memoList.length > 0 && displayedMemos.length === 0 && (
        <p className={styles.empty}>
          条件に一致するメモはありません
        </p>
      )}

      <ul className={styles.memoList}>
        {displayedMemos.map((memo) => (
          <MemoItem
            key={memo.id}
            memo={memo}
            onDelete={handleDelete}
            onSave={handleSave}
            onToggleImportant={handleToggleImportant}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;