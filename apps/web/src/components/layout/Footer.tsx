import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { PageContainer } from "./PageContainer";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.siteFooter}>
      <PageContainer>
        <div className={styles.footerFrame}>
          <div className={styles.footerTop}>
            <div className={styles.brandColumn}>
              <Link to="/" className={styles.footerLogo}>
                <span className={styles.logoIcon}>
                  <Icon name="Official-symbol" size={36} />
                </span>

                <span className={styles.logoText}>
                  Каталог державних
                  <br />
                  органів України
                </span>
              </Link>

              <p className={styles.description}>
                Єдиний державний каталог та реєстр інституцій України
              </p>
            </div>

            <nav className={styles.linksColumn} aria-label="Footer navigation">
              <span className={styles.columnTitle}>Про проєкт</span>

              <ul className={styles.linkList}>
                <li>
                  <Link to="/privacy">Політика конфіденційності</Link>
                </li>

                <li>
                  <Link to="/terms">Умови використання</Link>
                </li>

                <li>
                  <Link to="/team">Наша команда</Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className={styles.bottomBar}>
            <p>© 2026 Каталог державних органів. Усі права захищені</p>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}