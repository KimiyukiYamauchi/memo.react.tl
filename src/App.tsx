import { FC, useState } from "react";
import styles from "./App.module.css";

export const App: FC = () => {
  //State(状態)の準備
  const [text, setTaxt] = useState("");
  const [memos, setMemos] = useState<string[]>([]);

  //メモを追加する処理
  const onClickAdd = () => {
    if (text === "") return;
    setMemos([...memos, text]);
    setTaxt(""); //入力欄を空にする
  };

  //メモを削除する処理
  const onClickDelete = (index: number) => {
    const newMemos = [...memos];
    newMemos.splice(index, 1);
    setMemos(newMemos);
  };
  //画面表示
  return (
    <div>
      <h1>簡単メモアプリ</h1>
      <input //入力欄
        type="text"
        value={text}
        onChange={(e) => setTaxt(e.target.value)}
      />
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
