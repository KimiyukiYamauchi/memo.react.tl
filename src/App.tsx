import styles from "./App.module.css";

// ここに処理を記述する
// （下のJSXは完成イメージです。stateとmap()を使って書き換えていきましょう）

function App() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>簡単メモアプリ</h1>

      <div className={styles.form}>
        <input className={styles.input} placeholder="メモを入力" />
        <button className={styles.addButton}>追加</button>
      </div>

      <p className={styles.subtitle}>メモ一覧（1件）</p>
      <ul className={styles.memoList}>
        <li className={styles.memoItem}>
          <div>
            <p className={styles.memoText}>買い物に行く</p>
            <p className={styles.date}>2026/10/8 10:00:00</p>
          </div>
          <div className={styles.buttons}>
            <button>編集</button>
            <button>削除</button>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default App;
