import { FC } from "react";
import styles from "../App.module.css";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onAdd: () => void;
};

export const MemoInput: FC<Props> = ({ value, onChange, onAdd }) => {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onAdd();
        }}
        style={{ flexGrow: 1 }}
      />
      <button className={styles.button} onClick={onAdd}>
        追加
      </button>
    </div>
  );
};

export default MemoInput;
