import type { Agency } from "../../types/agency";
import { Icon } from "../ui/Icon";
import styles from "./AdminCard.module.css";

type AdminCardProps = {
  institution: Agency;
  onView: (institution: Agency) => void;
  onEdit: (institution: Agency) => void;
  onDelete: (institution: Agency) => void;
};

export function AdminCard({
  institution,
  onView,
  onEdit,
  onDelete,
}: AdminCardProps) {
  return (
    <article className={styles.adminCard}>
      <div className={styles.cardContent}>
        <span className={styles.tagBadge}>
          {institution.agencyType?.name || "Без категорії"}
        </span>

        <h3 className={styles.cardTitle}>{institution.name}</h3>
      </div>

      <div className={styles.infoBlock}>
        <div className={styles.metaItem}>
            <Icon name="Worker" className={styles.metaIcon} />
            <span>
              {institution.headName
                ? institution.headName
                : "Контактну особу не вказано"}
            </span>
        </div>

        <div className={styles.metaItem}>
          <Icon name="Website" className={styles.metaIcon} />
          {institution.website ? (
            <a
              href={institution.website}
              className={styles.websiteLink}
              target="_blank"
              rel="noreferrer"
            >
              {institution.website}
            </a>
          ) : (
            <span>Сайт не вказано</span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.actionBtn} ${styles.view}`}
          onClick={() => onView(institution)}
          aria-label={`Переглянути ${institution.name}`}
        >
          <Icon name="Look" />
        </button>

        <button
          type="button"
          className={`${styles.actionBtn} ${styles.edit}`}
          onClick={() => onEdit(institution)}
          aria-label={`Редагувати ${institution.name}`}
        >
          <Icon name="Modify" />
        </button>

        <button
          type="button"
          className={`${styles.actionBtn} ${styles.delete}`}
          onClick={() => onDelete(institution)}
          aria-label={`Видалити ${institution.name}`}
        >
          <Icon name="Delete" />
        </button>
      </div>
    </article>
  );
}
