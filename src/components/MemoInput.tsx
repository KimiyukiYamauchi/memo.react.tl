// MemoInput.tsx
import { FC, useState } from "react";
import styles from "../App.module.css";

type Props = {
  onAdd: (text: string) => void;
};

export const MemoInput: FC<Props> = ({ onAdd }) => {
  const [text, setText] = useState("");

  const handleClick = () => {
    if (text.trim() === "") return;
    onAdd(text);
    setText(""); // 追加後に入力欄をクリア
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className={styles.button} onClick={handleClick}>
        追加
      </button>
    </div>
  );
};
