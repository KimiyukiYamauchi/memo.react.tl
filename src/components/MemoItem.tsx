import { FC } from "react";
import styles from "../App.module.css";

interface MemoItemProps {
  memo: string;
  index: number;
  onDelete: (index: number) => void;
}

export const MemoItem: FC<MemoItemProps> = ({ memo, index, onDelete }) => {
  return (
    <li>
      <div className={styles.memoWrapper}>
        <p>{memo}</p>
        <button className={styles.button} onClick={() => onDelete(index)}>
          削除
        </button>
      </div>
    </li>
  );
};
