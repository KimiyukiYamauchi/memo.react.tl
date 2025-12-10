import initialData from "./app.json";

export const STORAGE_KEY = "memoApp_memos";

// 純粋関数: localStorageからメモを読み込む
export const loadMemos = (): string[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialData.memos;
    }
  }
  return initialData.memos;
};

// 純粋関数: メモをlocalStorageに保存
export const saveMemos = (memos: string[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
};

// 純粋関数: メモを追加
export const addMemo = (memos: string[], newMemo: string): string[] => {
  if (newMemo.trim() === "") return memos;
  return [...memos, newMemo];
};

// 純粋関数: メモを削除
export const deleteMemo = (memos: string[], index: number): string[] => {
  return memos.filter((_, i) => i !== index);
};

// カリー化された純粋関数: メモを追加するハンドラーを返す
export const createAddMemoHandler =
  (
    setMemos: (memos: string[]) => void,
    setInputValue: (value: string) => void,
    memos: string[]
  ) =>
  (inputValue: string) => {
    const updatedMemos = addMemo(memos, inputValue);
    setMemos(updatedMemos);
    saveMemos(updatedMemos);
    setInputValue("");
  };

// カリー化された純粋関数: メモを削除するハンドラーを返す
export const createDeleteMemoHandler =
  (
    setMemos: (memos: string[]) => void,
    setSelectedIndex: (index: number | null) => void,
    memos: string[]
  ) =>
  (index: number) => {
    const updatedMemos = deleteMemo(memos, index);
    setMemos(updatedMemos);
    saveMemos(updatedMemos);
    setSelectedIndex(null);
  };

// カリー化された純粋関数: キーダウンイベントハンドラーを返す
export const createKeyDownHandler =
  (handleAdd: (inputValue: string) => void, inputValue: string) =>
  (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter または Ctrl+Enter で追加
    if (e.key === "Enter" && (e.ctrlKey || !e.shiftKey)) {
      e.preventDefault();
      handleAdd(inputValue);
    }
  };
