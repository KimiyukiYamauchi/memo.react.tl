// App.tsx
import { FC, useEffect, useState } from "react";
import { MemoInput } from "./components/MemoInput";
import { MemoList } from "./components/MemoList";

// メモの型
export type Memo = {
  id: string;
  text: string;
};

const STORAGE_KEY = "memos";

export const App: FC = () => {
  const [memos, setMemos] = useState<Memo[]>([]);

  // 初回だけ localStorage から読み込み
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: Memo[] = JSON.parse(saved);
        setMemos(parsed);
      } catch (e) {
        console.error("memos の読み込みに失敗しました", e);
      }
    }
  }, []);

  // memos が変わるたび保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
  }, [memos]);

  // 追加
  const handleAddMemo = (text: string) => {
    if (text.trim() === "") return;

    const newMemo: Memo = {
      id: crypto.randomUUID(), // ← ここで一意なIDを作る
      text: text.trim(),
    };

    setMemos((prev) => [...prev, newMemo]);
  };

  // 削除（id で消す）
  const handleDeleteMemo = (id: string) => {
    setMemos((prev) => prev.filter((memo) => memo.id !== id));
  };

  return (
    <div>
      <h1>簡単メモアプリ</h1>

      <MemoInput onAdd={handleAddMemo} />

      <MemoList memos={memos} onDelete={handleDeleteMemo} />
    </div>
  );
};

export default App;
