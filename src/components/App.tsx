import { ChangeEvent, useState, FC } from "react";
import styled from "styled-components";

export const App: FC = () => {
  return (
    <div>
      <h1>簡単メモアプリ</h1>
      <input type="text" />
      <SButton>追加</SButton>
      <SContainer>
        <ul>
          <li>
            <SMemoWrapper>
              <p>買い物に行く</p>
              <SButton>削除</SButton>
            </SMemoWrapper>
          </li>
        </ul>
      </SContainer>
    </div>
  );
};

const SButton = styled.button`
  margin-left: 16px;
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
