// App.tsx
import { FC, useState } from "react";
import { MemoInput } from "./components/MemoInput";
import { MemoList } from "./components/MemoList";

export const App: FC = () => {
  // 入力欄の文字列を管理する state
  const [inputText, setInputText] = useState("");
  // メモ一覧を管理する state
  const [memos, setMemos] = useState<string[]>([]);

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
