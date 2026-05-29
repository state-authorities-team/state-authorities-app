import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { PageContainer } from "./PageContainer";
import styles from "./Header.module.css";

export function Header() {
	return (
		<header className={styles.siteHeader}>
			<PageContainer>
				<div className={styles.headerInner}>
					<Link to="/" className={styles.logo}>
						<Icon name="Frame" size={24} />
						<span>Назва</span>
					</Link>

					<nav className={styles.nav}>
						<Link to="/" className={styles.navLink}>
							<Icon name="Home" size={18} />
							<span>Головна</span>
						</Link>

						<Link to="/catalog" className={styles.navLink}>
							<Icon name="Catalog" size={18} />
							<span>Каталог установ</span>
						</Link>
					</nav>
				</div>
			</PageContainer>
		</header>
	);
}
