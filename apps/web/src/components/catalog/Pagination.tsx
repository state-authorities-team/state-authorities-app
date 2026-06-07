import styles from "../../styles/Pagination.module.css";

export function Pagination() {
  return (
    <div className={styles.pagination}>
      <button className={styles.navButton}>{"<"}</button>
      <button className={`${styles.pageButton} ${styles.active}`}>1</button>
      <button className={styles.pageButton}>2</button>
      <button className={styles.pageButton}>3</button>
      <span className={styles.ellipsis}>...</span>
      <button className={styles.pageButton}>10</button>
      <button className={styles.navButton}>{">"}</button>
    </div>
  );
}
