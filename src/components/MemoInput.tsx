import { FC } from "react";
import styles from "../App.module.css";

interface MemoInputProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onAdd: () => void;
}

export const MemoInput: FC<MemoInputProps> = ({
  inputText,
  onInputChange,
  onAdd,
}) => {
  return (
    <div>
      <input
        type="text"
        value={inputText}
        onChange={(e) => onInputChange(e.target.value)}
      />

      <button className={styles.button} onClick={onAdd}>
        追加
      </button>
    </div>
  );
};
