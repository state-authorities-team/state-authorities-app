import { Link, NavLink } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { PageContainer } from "./PageContainer";
import { useAdminAuth } from "../../auth/useAdminAuth";
import styles from "./Header.module.css";

export function Header() {
  const { isAdmin, logout } = useAdminAuth();

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`;

  return (
    <header className={styles.siteHeader}>
      <PageContainer>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>
              <Icon name="Official-symbol" size={63} />
            </span>

            <span className={styles.logoText}>
              Каталог державних органів України
            </span>
          </Link>

          <nav className={styles.nav}>
            <NavLink to="/" className={getNavLinkClass} end>
              <Icon name="Home" size={28} />
              <span>Головна</span>
            </NavLink>

            <NavLink to="/catalog" className={getNavLinkClass}>
              <Icon name="Catalog" size={28} />
              <span>Каталог</span>
            </NavLink>

            {isAdmin ? (
              <>
                <NavLink to="/admin" className={getNavLinkClass}>
                  <span>Адмін</span>
                </NavLink>

                <button
                  className={styles.navLogin}
                  type="button"
                  onClick={logout}
                >
                  <span>Вийти</span>
                </button>
              </>
            ) : (
              <Link to="/login" className={styles.navLogin}>
                <span>Авторизація</span>
              </Link>
            )}
          </nav>
        </div>
      </PageContainer>
    </header>
  );
}