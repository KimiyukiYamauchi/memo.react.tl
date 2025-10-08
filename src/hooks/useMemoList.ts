import { useCallback, useState } from "react";

// メモ一覧を管理するカスタムフック
export const useMemoList = () => {
  // メモ一覧
  const [memos, setMemos] = useState<string[]>([]); // 追加したメモを保持する

  // メモ追加
  const addMemo = useCallback(
    (text: string) => {
      if (text.trim() === "") return; // textが空文字の場合は何もしない
      const newMemos = [...memos, text]; // 既存のメモにテキストを追加
      setMemos(newMemos); // メモを更新
    },
    [memos]
  );

  // メモ削除
  const deleteMemo = useCallback(
    (index: number) => {
      const newMemos = [...memos]; // 既存のメモをコピー
      newMemos.splice(index, 1); // indexから1つ削除
      setMemos(newMemos); // メモを更新
    },
    [memos] // memosが変更されたときに再生成
  );

  return { memos, addMemo, deleteMemo };
};
