import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { PageContainer } from "./PageContainer";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.siteFooter}>
      <PageContainer>
        <div className={styles.footerGrid}>
          <div className={styles.brandColumn}>
            <Link to="/" className={styles.footerLogo}>
              <Icon name="Frame" size={24} />
              <span>Назва</span>
            </Link>
            <p className={styles.description}>
              Єдиний державний каталог та реєстр інституцій України
            </p>
          </div>

          <div className={styles.linksColumn}>
            <span className={styles.columnTitle}>Про проєкт</span>
            <ul className={styles.linkList}>
              <li>
                <Link to="/terms">Умови використання платформи</Link>
              </li>
              <li>
                <Link to="/privacy">Політика конфіденційності</Link>
              </li>
            </ul>
          </div>

          <div className={styles.linksColumn}>
            <span className={styles.columnTitle}>Контакти</span>
            <ul className={styles.linkList}>
              <li>Телефон: 0 800 XX-XX-XX</li>
              <li>Email: support@catalog.gov.ua</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>© 2026 Каталог державних установ. Усі права захищені</p>
        </div>
      </PageContainer>
    </footer>
  );
}
