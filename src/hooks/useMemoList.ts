import { useCallback, useState } from "react";

// メモ一覧を管理するカスタムフック
export const useMemoList = () => {
  // メモ一覧state
  const [memos, setMemos] = useState<string[]>([]);

  // メモ追加
  const addTodo = useCallback(
    (text: string) => {
      if (text === "") return;
      // Stateを直接変更しないようにスプレッド構文で新しい配列を作成
      const newMemos = [...memos, text];
      // Stateを更新
      setMemos(newMemos);
      // 依存配列を忘れずにmemosを設定
    },
    [memos]
  );

  // メモ削除
  const deleteTodo = useCallback(
    (index: number) => {
      // 押下された要素以外で新しい配列を作成
      const newMemos = memos.filter((_, i) => i !== index);
      // Stateを更新
      setMemos(newMemos);
    },
    [memos]
  );
  return { memos, addTodo, deleteTodo };
};
