import { FC } from "react";
import styles from "../App.module.css";
import { Memo } from "../types";

type Props = {
  memo: Memo;
  editId: number | null;
  editText: string;
  onEditStart: (memo: Memo) => void;
  onEditSave: (id: number) => void;
  onEditCancel: () => void;
  onEditTextChange: (v: string) => void;
  onDelete: (id: number) => void;
};

export const MemoItem: FC<Props> = ({
  memo,
  editId,
  editText,
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditTextChange,
  onDelete,
}) => {
  const isEditing = editId === memo.id;

  return (
    <li key={memo.id}>
      <div className={styles.memoWrapper}>
        {isEditing ? (
          <div style={{ flexGrow: 1 }}>
            <input
              type="text"
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onEditSave(memo.id);
              }}
            />
            <div>
              <button
                className={styles.button}
                onClick={() => onEditSave(memo.id)}
              >
                保存
              </button>
              <button
                className={styles.button}
                onClick={onEditCancel}
                style={{ marginLeft: "8px", background: "#777" }}
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <p>{memo.text}</p>
              <small style={{ color: "#666" }}>{memo.date}</small>
            </div>

            <div>
              <button
                className={styles.button}
                onClick={() => onEditStart(memo)}
                style={{ marginRight: "8px" }}
              >
                編集
              </button>

              <button
                className={styles.button}
                onClick={() => onDelete(memo.id)}
              >
                削除
              </button>
            </div>
          </>
        )}
      </div>
    </li>
  );
};

export default MemoItem;
