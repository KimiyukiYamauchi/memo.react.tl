import { FC } from "react";
import styles from "../App.module.css";
import { MemoItem } from "./MemoItem";

interface MemoListProps {
  memos: string[];
  editIndex: number | null;
  editText: string;
  onStartEdit: (index: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditTextChange: (text: string) => void;
  onDelete: (index: number) => void;
}

export const MemoList: FC<MemoListProps> = ({
  memos,
  editIndex,
  editText,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditTextChange,
  onDelete,
}) => {
  return (
    <div className={styles.container}>
      <p>メモ一覧</p>
      <ul>
        {memos.map((memo, index) => (
          <MemoItem
            key={index}
            memo={memo}
            index={index}
            isEditing={editIndex === index}
            editText={editText}
            onStartEdit={onStartEdit}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            onEditTextChange={onEditTextChange}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
};
