import { FC, useState, ChangeEvent } from "react";
import styles from "./App.module.css";

export const App: FC = () => {
  const [text, setText] = useState<string>("");
  const [memos, setMemos] = useState<string[]>([]);

  
  const onChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  
  const onClickAdd = () => {
    if (text.trim() === "") return;

    setMemos([...memos, text]);
    setText("");
  };

  
  const onClickDelete = (index: number) => {
    const newMemos = [...memos];
    newMemos.splice(index, 1);
    setMemos(newMemos);
  };

  return (
    <div>
      <h1>簡単メモアプリ</h1>

      <input type="text" value={text} onChange={onChangeText} />
      <button className={styles.button} onClick={onClickAdd}>
        追加
      </button>

      <div className={styles.container}>
        <p>メモ一覧</p>
        <ul>
          {memos.map((memo, index) => (
            <li key={index}>
              <div className={styles.memoWrapper}>
                <p>{memo}</p>
                <button
                  className={styles.button}
                  onClick={() => onClickDelete(index)}
                >
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

