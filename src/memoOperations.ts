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

// 純粋関数: メモを編集
export const editMemo = (
  memos: string[],
  index: number,
  updatedMemo: string
): string[] => {
  if (updatedMemo.trim() === "") return memos;
  const newMemos = [...memos];
  newMemos[index] = updatedMemo;
  return newMemos;
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

// カリー化された純粋関数: メモを編集するハンドラーを返す
export const createEditMemoHandler =
  (
    setMemos: (memos: string[]) => void,
    setEditingIndex: (index: number | null) => void,
    setEditingValue: (value: string) => void,
    memos: string[]
  ) =>
  (index: number, updatedMemo: string) => {
    const newMemos = editMemo(memos, index, updatedMemo);
    setMemos(newMemos);
    saveMemos(newMemos);
    setEditingIndex(null);
    setEditingValue("");
  };

// カリー化された純粋関数: 編集モードを開始するハンドラーを返す
export const createStartEditHandler =
  (
    setEditingIndex: (index: number | null) => void,
    setEditingValue: (value: string) => void,
    memos: string[]
  ) =>
  (index: number) => {
    setEditingIndex(index);
    setEditingValue(memos[index]);
  };

// 純粋関数: Markdown記法を解析してCSSクラスのリストを返す
// 対応: 見出し(#の数)、太字(**)、イタリック(_ _)、コード(``)、リスト(-)、打ち消し(~~)、リンク[text](url)
export const parseMarkdownStyles = (text: string): string[] => {
  const styles: string[] = [];

  // 見出し
  const headingMatch = text.match(/^#{1,6}\s+/);
  if (headingMatch) {
    const level = Math.min(headingMatch[0].trim().length, 6);
    styles.push(`markdown-h${level}`);
  }

  // 太字: **text**
  if (/\*\*.*?\*\*/.test(text)) {
    styles.push("markdown-bold");
  }

  // イタリック: _text_
  if (/_.*?_/.test(text)) {
    styles.push("markdown-italic");
  }

  // コード: `text`
  if (/`[^`]+`/.test(text)) {
    styles.push("markdown-code");
  }

  // リスト: - text
  if (/^-\s+.+/m.test(text)) {
    styles.push("markdown-list");
  }

  // 打ち消し: ~~text~~
  if (/~.*?~/.test(text)) {
    styles.push("markdown-strikethrough");
  }

  // リンク: [text](url)
  if (/\[[^\]]+\]\([^)]+\)/.test(text)) {
    styles.push("markdown-link");
  }

  return styles;
};

// 純粋関数: Markdown記法を解析してHTMLに変換
export const renderMarkdown = (text: string): string => {
  let rendered = text;

  // 見出し (#... )
  rendered = rendered.replace(
    /^(#{1,6})\s+(.*)$/gm,
    (_, hashes: string, body: string) => {
      const level = Math.min(hashes.length, 6);
      return `<h${level}>${body}</h${level}>`;
    }
  );

  // リスト (- )
  let hasList = false;
  rendered = rendered.replace(/^-\s+(.*)$/gm, (_: string, body: string) => {
    hasList = true;
    return `<li>${body}</li>`;
  });
  if (hasList) {
    rendered = `<ul>${rendered}</ul>`;
  }

  // 太字 **text**
  rendered = rendered.replace(/\*(.*?)\*/g, "<strong>$1</strong>");

  // イタリック _text_
  rendered = rendered.replace(/_(.*?)_/g, "<em>$1</em>");

  // コード `text`
  rendered = rendered.replace(/`([^`]+)`/g, "<code>$1</code>");

  // 打ち消し ~~text~~
  rendered = rendered.replace(/~(.*?)~/g, "<del>$1</del>");

  // リンク [text](url)
  rendered = rendered.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  return rendered;
};
