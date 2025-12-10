import { FC } from "react";
import styles from "../App.module.css";

interface MemoInputProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
}

export const MemoInput: FC<MemoInputProps> = ({ value, onChange, onAdd }) => {
  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          localStorage.setItem("memo_input", e.target.value);
        }}
        onKeyDown={(e) => e.key === "Enter" && onAdd()}
      />

      <button className={styles.button} onClick={onAdd}>
        追加
      </button>
    </>
  );
};
