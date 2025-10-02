## node.js のインストール手順

```
# 旧パッケージを念のため除去（標準apt由来の場合）
sudo apt purge -y nodejs npm
sudo apt update

# NodeSource の LTS（例：22.x）を追加してインストール
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

node -v
npm -v

sudo npm install -g npm@latest
npm -v

```

## 依存パッケージのインストール

```
npm install
```

## 開発用サーバの起動

```
npm start
```