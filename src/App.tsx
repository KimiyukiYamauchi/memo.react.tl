import { FC, useEffect, useState } from "react";
import styles from "./App.module.css";
import { Memo } from "./types";
import MemoInput from "./components/MemoInput";
import MemoList from "./components/MemoList";

export const App: FC = () => {
  const [text, setText] = useState("");
  const [memos, setMemos] = useState<Memo[]>([]);
  const [editId, setEditId] = useState<number | null>(null); // 編集中のメモID
  const [editText, setEditText] = useState("");

  // 起動時 localStorage 読み込み
  useEffect(() => {
    const saved = localStorage.getItem("memos");
    if (saved) {
      setMemos(JSON.parse(saved));
    }
  }, []);

  // memos が変わるたび保存
  useEffect(() => {
    localStorage.setItem("memos", JSON.stringify(memos));
  }, [memos]);

  // 日付生成
  const getNowDate = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
  };

  // 追加
  const handleAdd = () => {
    if (!text.trim()) return;

    const newMemo: Memo = {
      id: Date.now(),
      text,
      date: getNowDate(),
    };

    setMemos([...memos, newMemo]);
    setText("");
  };

  // 削除
  const handleDelete = (id: number) => {
    setMemos(memos.filter((m) => m.id !== id));
  };

  // 編集開始
  const handleEditStart = (memo: Memo) => {
    setEditId(memo.id);
    setEditText(memo.text);
  };

  // 編集保存
  const handleEditSave = (id: number) => {
    setMemos(
      memos.map((memo) => (memo.id === id ? { ...memo, text: editText } : memo))
    );
    setEditId(null);
    setEditText("");
  };

  // 編集キャンセル
  const handleEditCancel = () => {
    setEditId(null);
    setEditText("");
  };

  return (
    <div>
      <h1>簡単メモアプリ</h1>

      <MemoInput value={text} onChange={setText} onAdd={handleAdd} />

      <div className={styles.container}>
        <div className={styles.memoListBox}>
          <MemoList
            memos={memos}
            editId={editId}
            editText={editText}
            onEditStart={handleEditStart}
            onEditSave={handleEditSave}
            onEditCancel={handleEditCancel}
            onEditTextChange={setEditText}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
