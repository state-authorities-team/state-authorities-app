import type { Agency } from "../../types/agency";
import { Icon } from "../ui/Icon";
import styles from "./AdminCard.module.css";
import { Link } from "react-router-dom";

type AdminCardProps = {
  institution: Agency;
};

export function AdminCard({ institution }: AdminCardProps) {
  return (
    <article className={styles.adminCard}>
      <div className={styles.cardContent}>
        <span className={styles.tagBadge}>
          {institution.agencyType?.name ?? "Державна установа"}
        </span>

        <h3 className={styles.cardTitle}>{institution.name}</h3>
      </div>

      <div className={styles.cardRight}>
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
                target="_blank"
                rel="noreferrer"
                className={styles.websiteLink}
              >
                {new URL(institution.website).hostname}
              </a>
            ) : (
              <span>Вебсайт не вказано</span>
            )}
          </div>
        </div>

        <div className={styles.actions}>
            <Link
                to={`/institutions/${institution.id}`}
                className={`${styles.actionBtn} ${styles.view}`}
                aria-label={`Переглянути ${institution.name}`}
            >
                <Icon name="Look" />
            </Link>

            <button
                type="button"
                className={`${styles.actionBtn} ${styles.edit}`}
                aria-label={`Редагувати ${institution.name}`}
            >
                <Icon name="Modify" />
            </button>

            <button
                type="button"
                className={`${styles.actionBtn} ${styles.delete}`}
                aria-label={`Видалити ${institution.name}`}
            >
                <Icon name="Delete" />
            </button>
        </div>
      </div>
    </article>
  );
}
