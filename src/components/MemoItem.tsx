import { FC } from "react";
import styles from "../App.module.css";

interface MemoItemProps {
  memo: string;
  index: number;
  isEditing: boolean;
  editText: string;
  onStartEdit: (index: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditTextChange: (text: string) => void;
  onDelete: (index: number) => void;
}

export const MemoItem: FC<MemoItemProps> = ({
  memo,
  index,
  isEditing,
  editText,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditTextChange,
  onDelete,
}) => {
  return (
    <li>
      <div className={styles.memoWrapper}>
        {isEditing ? (
          // 編集モード
          <>
            <input
              type="text"
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
            />
            <button className={styles.button} onClick={onSaveEdit}>
              保存
            </button>
            <button className={styles.button} onClick={onCancelEdit}>
              キャンセル
            </button>
          </>
        ) : (
          // 通常表示モード
          <>
            <p>{memo}</p>
            <button
              className={styles.button}
              onClick={() => onStartEdit(index)}
            >
              編集
            </button>
            <button
              className={styles.button}
              onClick={() => onDelete(index)}
            >
              削除
            </button>
          </>
        )}
      </div>
    </li>
  );
};
