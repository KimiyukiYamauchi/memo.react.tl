import { FC } from "react";
import { Memo } from "../types";
import MemoItem from "./MemoItem";

type Props = {
  memos: Memo[];
  editId: number | null;
  editText: string;
  onEditStart: (memo: Memo) => void;
  onEditSave: (id: number) => void;
  onEditCancel: () => void;
  onEditTextChange: (v: string) => void;
  onDelete: (id: number) => void;
};

export const MemoList: FC<Props> = ({
  memos,
  editId,
  editText,
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditTextChange,
  onDelete,
}) => {
  return (
    <div>
      <p>メモ一覧</p>

      <ul>
        {memos.map((memo) => (
          <MemoItem
            key={memo.id}
            memo={memo}
            editId={editId}
            editText={editText}
            onEditStart={onEditStart}
            onEditSave={onEditSave}
            onEditCancel={onEditCancel}
            onEditTextChange={onEditTextChange}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
};

export default MemoList;
