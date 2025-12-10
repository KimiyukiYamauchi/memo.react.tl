import { FC } from "react";
import styles from "../App.module.css";

type Memo = {
  text: string;
  done: boolean;
};

type Props = {
  memo: Memo;
  index: number;
  onToggle: (index: number) => void;
  onDelete: (index: number) => void;
};

const MemoItem: FC<Props> = ({ memo, index, onToggle, onDelete }) => {
  return (
    <li key={index}>
      <div className={styles.memoWrapper}>
        <input
          type="checkbox"
          checked={memo.done}
          onChange={() => onToggle(index)}
        />

        <p
          style={{
            textDecoration: memo.done ? "line-through" : "none",
            color: memo.done ? "#888" : "black",
          }}
        >
          {memo.text}
        </p>

        <button className={styles.button} onClick={() => onDelete(index)}>
          削除
        </button>
      </div>
    </li>
  );
};

export default MemoItem;
