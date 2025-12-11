// MemoList.tsx
import { FC } from "react";
import styles from "../App.module.css";
import type { Memo } from "../App";
import { MemoItem } from "./MemoItem";

type Props = {
  memos: Memo[];
  onDelete: (id: string) => void;
};

export const MemoList: FC<Props> = ({ memos, onDelete }) => {
  return (
    <div className={styles.container}>
      <p>メモ一覧</p>
      <ul>
        {memos.map((memo) => (
          // ⭐ key に index ではなく memo.id を使用
          <MemoItem key={memo.id} memo={memo} onDelete={onDelete} />
        ))}
      </ul>
    </div>
  );
};
