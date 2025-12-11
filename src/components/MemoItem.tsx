// MemoItem.tsx
import { FC } from "react";
import styles from "../App.module.css";
import type { Memo } from "../App";

type Props = {
  memo: Memo;
  onDelete: (id: string) => void;
};

export const MemoItem: FC<Props> = ({ memo, onDelete }) => {
  return (
    <li>
      <div className={styles.memoWrapper}>
        <p>{memo.text}</p>
        <button className={styles.button} onClick={() => onDelete(memo.id)}>
          削除
        </button>
      </div>
    </li>
  );
};
