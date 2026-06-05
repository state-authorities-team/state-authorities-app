import styles from "@/styles/LoadingState.module.css";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = "Завантаження даних...",
}: LoadingStateProps) {
  return (
    <div className={styles.ghost_loader_wrap}>
      <div className={styles.ghosts}>
        <div className={`${styles.ghost_item} ${styles.one}`} />
        <div className={`${styles.ghost_item} ${styles.two}`} />
        <div className={`${styles.ghost_item} ${styles.three}`} />
        <div className={`${styles.ghost_item} ${styles.four}`} />
      </div>
      <div
        className={styles.pacman_loader}
        aria-live="polite"
        aria-label={message}
      />
    </div>
  );
}
