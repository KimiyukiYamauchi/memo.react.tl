import { useState } from "react";
import styles from "./App.module.css";

// 2. 作成日時の表示のための型定義
type Memo = {
  id: number;
  text: string;
  createdAt: string;
};

function App() {
  // --- 各種 State の定義 ---
  const [memoList, setMemoList] = useState<Memo[]>([]); // メモ一覧
  const [inputText, setInputText] = useState(""); // 新規入力テキスト
  const [hasError, setHasError] = useState(false); // 3. 入力エラー状態

  // 5. 編集機能用の State
  const [editingId, setEditingId] = useState<number | null>(null); // 編集中メモのID（nullは編集なし）
  const [editText, setEditText] = useState(""); // 編集中のテキスト

  // --- メモ追加処理 ---
  const handleAdd = () => {
    // 3. 入力チェック（空文字、またはスペースのみの場合はエラー）
    if (!inputText.trim()) {
      setHasError(true);
      return;
    }

    // メモを追加し、入力欄とエラーをリセット
    const newMemo: Memo = {
      id: Date.now(),
      text: inputText,
      createdAt: new Date().toLocaleString(), // 2. 作成日時の保存
    };
    setMemoList([...memoList, newMemo]);
    setInputText("");
    setHasError(false);
  };

  // --- 1. Enterキーでの追加処理 ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      handleAdd();
    }
  };

  // --- メモ削除処理 ---
  const handleDelete = (id: number) => {
    // 指定されたID以外のメモを残すことで削除を実現
    setMemoList(memoList.filter((memo) => memo.id !== id));
  };

  // --- 5. 編集モード開始処理 ---
  const handleStartEdit = (memo: Memo) => {
    setEditingId(memo.id);
    setEditText(memo.text);
  };

  // --- 5. 編集保存処理 ---
  const handleSaveEdit = (id: number) => {
    if (!editText.trim()) return; // 空文字のときは保存させない

    // map を使って対象のIDのメモだけテキストを更新する
    const updatedList = memoList.map((memo) =>
      memo.id === id ? { ...memo, text: editText } : memo
    );
    setMemoList(updatedList);
    setEditingId(null); // 編集モード終了
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>簡単メモアプリ</h1>

      {/* 入力フォームエリア */}
      <div className={styles.form}>
        <input
          className={hasError ? `${styles.input} ${styles.error}` : styles.input}
          placeholder="メモを入力"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (e.target.value.trim()) setHasError(false); // 入力されたらエラー解除
          }}
          onKeyDown={handleKeyDown}
        />
        <button className={styles.addButton} onClick={handleAdd}>
          追加
        </button>
      </div>
      
      {/* 3. エラーメッセージの表示 */}
      {hasError && (
        <p className={styles.errorMessage}>メモを入力してください</p>
      )}

      {/* 4. 件数表示 */}
      <p className={styles.subtitle}>メモ一覧（{memoList.length}件）</p>

      {/* メモ一覧リスト */}
      <ul className={styles.memoList}>
        {memoList.map((memo) => (
          <li key={memo.id} className={styles.memoItem}>
            {/* 5. 編集モードか通常モードかで三項演算子を使い切り替え */}
            {editingId === memo.id ? (
              // ▼ 編集モードの表示
              <>
                <div>
                  <input
                    className={styles.input} // 必要に応じてスタイルを調整してください
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <p className={styles.date}>{memo.createdAt}</p>
                </div>
                <div className={styles.buttons}>
                  <button onClick={() => handleSaveEdit(memo.id)}>保存</button>
                  <button onClick={() => setEditingId(null)}>キャンセル</button>
                </div>
              </>
            ) : (
              // ▼ 通常モードの表示
              <>
                <div>
                  <p className={styles.memoText}>{memo.text}</p>
                  <p className={styles.date}>{memo.createdAt}</p>
                </div>
                <div className={styles.buttons}>
                  <button onClick={() => handleStartEdit(memo)}>編集</button>
                  <button onClick={() => handleDelete(memo.id)}>削除</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
