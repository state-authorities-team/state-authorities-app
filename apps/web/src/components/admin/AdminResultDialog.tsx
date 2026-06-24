import styles from "./AdminResultDialog.module.css";

type AdminResultDialogProps = {
  isOpen: boolean;
  variant: "success" | "error";
  title: string;
  message: string;
  details?: string[];
  buttonText?: string;
  onClose: () => void;
};

export function AdminResultDialog({
  isOpen,
  variant,
  title,
  message,
  details = [],
  buttonText = "Закрити",
  onClose,
}: AdminResultDialogProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.dialog}>
        <div className={`${styles.badge} ${styles[variant]}`}>
          {variant === "success" ? "✓" : "!"}
        </div>

        <h2 className={styles.title}>{title}</h2>

        <p className={styles.message}>{message}</p>

        {details.length > 0 && (
          <ul className={styles.details}>
            {details.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.button} onClick={onClose}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}