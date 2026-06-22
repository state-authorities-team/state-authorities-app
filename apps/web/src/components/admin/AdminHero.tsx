import styles from "./AdminHero.module.css";

type AdminHeroProps = {
  total: number;
};

export function AdminHero({ total }: AdminHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>Панель адміністратора</h1>

        <div className={styles.counter}>Знайдено {total} установ</div>
      </div>
    </section>
  );
}
