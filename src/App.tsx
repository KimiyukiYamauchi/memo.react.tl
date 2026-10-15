import { useState } from "react";
import styles from "./App.module.css";

// ここに処理を記述する
// （下のJSXは完成イメージです。stateとmap()を使って書き換えていきましょう）

type Memo = {
  text: string;
  date: string;
};
function App() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [inputText, setInputText] = useState("");
  const [hasError, setHasError] = useState(false);

  function handleAdd() {
    if (inputText.trim() === "") {
      setHasError(true);
      return;
    }

    setMemos([
      ...memos,
      { text: inputText, date: new Date().toLocaleString() },
    ]);
    setInputText("");
    setHasError(false);
  }

  function handleDelete(index: number) {
    const newMemos = [...memos];
    newMemos.splice(index, 1);
    setMemos(newMemos);
  }

  function editMemo(index: number) {
    const newText = prompt("新しいメモを入力してください", memos[index].text);
    if (newText !== null && newText.trim() !== "") {
      const newMemos = [...memos];
      newMemos[index].text = newText;
      setMemos(newMemos);
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>簡単メモアプリ</h1>
      <div className={styles.form}>
        <input
          className={styles.input}
          placeholder="メモを入力"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button className={styles.addButton} onClick={handleAdd}>
          追加
        </button>
      </div>
      {hasError && <p className={styles.error}>メモを入力してください</p>}
      <p className={styles.subtitle}>メモ一覧（{memos.length}件）</p>
      <ul className={styles.memoList}>
        {memos.map((memo, index) => (
          <li key={index} className={styles.memoItem}>
            <p className={styles.memoText}>{memo.text}</p>
            <button onClick={() => handleDelete(index)}>削除</button>
            <button onClick={() => editMemo(index)}>編集</button>
            <p className={styles.memoDate}>{memo.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
