import { useState } from "react";
import styles from "./App.module.css";

// メモ1件の情報
export type Memo = {
  id: number;
  text: string;
  createdAt: string;
  important: boolean;
  updatedAt?: string;
};

// Appから受け取る情報と処理
type MemoItemProps = {
  memo: Memo;
  onDelete: (id: number) => void;
  onSave: (id: number, text: string) => void;
  onToggleImportant: (id: number) => void;
};

function MemoItem({
  memo,
  onDelete,
  onSave,
  onToggleImportant,
}: MemoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const errorId = `edit-error-${memo.id}`;

  // 編集を始める
  const handleEdit = () => {
    setEditText(memo.text);
    setErrorMessage("");
    setIsEditing(true);
  };

  // 編集を取り消す
  const handleCancel = () => {
    setIsEditing(false);
    setEditText("");
    setErrorMessage("");
  };

  // 編集した内容を保存する
  const handleSave = () => {
    const text = editText.trim();

    if (text === "") {
      setErrorMessage("メモを入力してください");
      return;
    }

    if (editText.length > 50) {
      setErrorMessage("メモは50文字以内で入力してください");
      return;
    }

    onSave(memo.id, text);
    handleCancel();
  };

  return (
    <li
      className={styles.memoItem}
      style={
        memo.important
          ? {
              backgroundColor: "#e5eaf5",
              color: "#24334d",
            }
          : undefined
      }
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <label>
          <input
            type="checkbox"
            checked={memo.important}
            onChange={() => onToggleImportant(memo.id)}
          />
          重要
        </label>

        {isEditing ? (
          <>
            <input
              className={
                errorMessage !== "" || editText.length > 50
                  ? `${styles.input} ${styles.error}`
                  : styles.input
              }
              aria-label="メモの編集"
              value={editText}
              onChange={(event) => {
                setEditText(event.target.value);
                setErrorMessage("");
              }}
              onKeyDown={(event) => {
                // 日本語の変換中は保存・キャンセルしない
                if (event.nativeEvent.isComposing) {
                  return;
                }

                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSave();
                }

                if (event.key === "Escape") {
                  event.preventDefault();
                  handleCancel();
                }
              }}
              aria-invalid={
                errorMessage !== "" || editText.length > 50
              }
              aria-describedby={errorId}
              autoFocus
            />

            <p
              style={{
                color: editText.length > 50 ? "#b42318" : "inherit",
              }}
            >
              {editText.length} / 50文字
            </p>

            <p
              id={errorId}
              className={styles.errorMessage}
              role="alert"
            >
              {errorMessage ||
                (editText.length > 50
                  ? "メモは50文字以内で入力してください"
                  : "")}
            </p>
          </>
        ) : (
          <p
            className={styles.memoText}
            style={{ overflowWrap: "anywhere" }}
          >
            {memo.text}
          </p>
        )}

        <p className={styles.date}>
          作成：{memo.createdAt}
        </p>

        {memo.updatedAt && (
          <p className={styles.date}>
            更新：{memo.updatedAt}
          </p>
        )}
      </div>

      <div className={styles.buttons}>
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={editText.length > 50}
            >
              保存
            </button>

            <button onClick={handleCancel}>
              キャンセル
            </button>
          </>
        ) : (
          <>
            <button onClick={handleEdit}>編集</button>
            <button onClick={() => onDelete(memo.id)}>
              削除
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export default MemoItem;