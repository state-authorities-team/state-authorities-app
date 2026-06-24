import styles from "./AdminHero.module.css";

type AdminHeroProps = {
  total: number;
};

const getInstitutionLabel = (count: number): string => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) {
    return "установ";
  }

  if (mod10 === 1) {
    return "установа";
  }

  if (mod10 >= 2 && mod10 <= 4) {
    return "установи";
  }

  return "установ";
};

export function AdminHero({ total }: AdminHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>Панель адміністратора</h1>

        <div className={styles.counter}>
          Знайдено {total} {getInstitutionLabel(total)}
        </div>
      </div>
    </section>
  );
}