import styled from "styled-components";

type Props = {
  memos: string[];
  onClickDelete: (index: number) => void;
};

export const MemoList: React.FC<Props> = (props) => {
  const { memos, onClickDelete } = props;

  return (
    <SContainer>
      <p>メモ一覧</p>
      <ul>
        {memos.map((memo, index) => (
          <li key={index}>
            <SMemoWrapper>
              <p>{memo}</p>
              <SButton onClick={() => onClickDelete(index)}>削除</SButton>
            </SMemoWrapper>
          </li>
        ))}
      </ul>
    </SContainer>
  );
};

const SButton = styled.button`
  margin-left: 16px;
  padding: 4px 12px;
  cursor: pointer;
`;
const SContainer = styled.div`
  border: 1px solid #ccc;
  padding: 16px;
  margin: 8px;
`;
const SMemoWrapper = styled.div`
  display: flex;
  align-items: center;
`;
