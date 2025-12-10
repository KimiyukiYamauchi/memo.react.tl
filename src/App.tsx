import { useState } from "react";

export default function App() {
  const [text, setText] = useState<string>("");
  const [memos, setMemos] = useState<string[]>([]); // ← 型を指定！

  const addMemo = () => {
    if (text.trim() === "") return;
    setMemos([...memos, text]);
    setText("");
  };

  const deleteMemo = (index: number) => {
    // ← 型を指定！
    setMemos(memos.filter((_, i) => i !== index));
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "20px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>メモアプリ</h1>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="メモを入力"
        style={{ width: "100%", padding: "8px" }}
      />

      <button
        onClick={addMemo}
        style={{ marginTop: "10px", padding: "6px 10px" }}
      >
        追加
      </button>

      <ul style={{ marginTop: "20px", padding: "0" }}>
        {memos.map((memo, index) => (
          <li
            key={index}
            style={{
              listStyle: "none",
              marginBottom: "10px",
              padding: "10px",
              background: "#f2f2f2",
              borderRadius: "4px",
            }}
          >
            {memo}
            <button
              onClick={() => deleteMemo(index)}
              style={{
                float: "right",
                padding: "4px 8px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "3px",
              }}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
