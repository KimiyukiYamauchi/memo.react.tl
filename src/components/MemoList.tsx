import { FC } from "react";
import { MemoItem } from "./MemoItem";
import styles from "../App.module.css";

interface MemoListProps {
  memos: string[];
  onDelete: (index: number) => void;
}

export const MemoList: FC<MemoListProps> = ({ memos, onDelete }) => {
  return (
    <div className={styles.container}>
      <p>メモ一覧</p>
      <ul>
        {memos.map((memo, index) => (
          <MemoItem key={index} memo={memo} index={index} onDelete={onDelete} />
        ))}
      </ul>
    </div>
  );
};
