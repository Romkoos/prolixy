import { useEffect, useState } from "react";
import { fetchArticles, type ArticleItem } from "./api";
import styles from "./App.module.css";

export const App = (): JSX.Element => {
  const [items, setItems] = useState<readonly ArticleItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const run = async (): Promise<void> => {
      try {
        const nextItems = await fetchArticles();
        setItems(nextItems);
      } catch (error: unknown) {
        setErrorMessage(error instanceof Error ? error.message : "Unknown error");
      }
    };

    void run();
  }, []);

  return (
    <main className={styles.main}>
      <h1>Prolixy</h1>
      <p>Latest scraped articles</p>
      {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a href={item.sourceUrl} target="_blank" rel="noreferrer">
              {item.title}
            </a>
            {item.summary ? <p>{item.summary}</p> : null}
          </li>
        ))}
      </ul>
    </main>
  );
};
