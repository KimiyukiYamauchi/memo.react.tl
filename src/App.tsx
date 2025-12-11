// App.tsx
import { FC, useState, useEffect } from "react";
import { MemoInput } from "./components/MemoInput";
import { MemoList } from "./components/MemoList";

export const App: FC = () => {
  // 入力欄の文字列を管理する state
  const [inputText, setInputText] = useState("");
  // メモ一覧を管理する state
  const [memos, setMemos] = useState<string[]>([]);

  // -------------------------------------------
  // ⭐ 初回表示時に localStorage からデータを読み込む
  // -------------------------------------------
  useEffect(() => {
    const saved = localStorage.getItem("memos");
    if (saved) {
      setMemos(JSON.parse(saved));
    }
  }, []);

  // -------------------------------------------
  // ⭐ memos が変わるたびに localStorage に保存
  // -------------------------------------------
  useEffect(() => {
    localStorage.setItem("memos", JSON.stringify(memos));
  }, [memos]);

  // 追加ボタンを押したときの処理
  const handleAdd = () => {
    // 何も入力されていなければ何もしない
    if (inputText.trim() === "") return;

    // 既存のメモに新しいメモを追加
    setMemos((prevMemos) => [...prevMemos, inputText]);

    // 入力欄を空にする
    setInputText("");
  };

  // 削除ボタンを押したときの処理
  const handleDelete = (index: number) => {
    setMemos((prevMemos) => prevMemos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h1>簡単メモアプリ</h1>
      <MemoInput
        inputText={inputText}
        onInputChange={setInputText}
        onAdd={handleAdd}
      />
      <MemoList memos={memos} onDelete={handleDelete} />
    </div>
  );
};
