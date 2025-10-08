import { ChangeEvent, useState, FC } from "react";
import styled from "styled-components";
import { MemoList } from "./MemoList";

export const App: FC = () => {
  const [text, setText] = useState<string>("");
  const [memos, setMemos] = useState<string[]>([]);

  const onChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const onClickAdd = () => {
    if (text.trim() === "") return;
    setMemos([...memos, text]);
    setText("");
  };

  const onClickDelete = (index: number) => {
    const newMemos = [...memos];
    newMemos.splice(index, 1);
    setMemos(newMemos);
  };

  return (
    <div>
      <h1>簡単メモアプリ</h1>
      <input
        type="text"
        value={text}
        onChange={onChangeText}
        placeholder="メモを入力"
      />
      <SButton onClick={onClickAdd}>追加</SButton>
      <MemoList memos={memos} onClickDelete={onClickDelete} />
    </div>
  );
};

const SButton = styled.button`
  margin-left: 16px;
  padding: 4px 12px;
  cursor: pointer;
`;
