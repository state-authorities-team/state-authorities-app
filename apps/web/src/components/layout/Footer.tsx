import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { PageContainer } from "./PageContainer";
import styles from "./Footer.module.css";

export function Footer() {
	return (
		<footer className={styles.siteFooter}>
			<PageContainer>
				<div className={styles.footerGrid}>
					<div>
						<Link to="/" className={styles.footerLogo}>
							<Icon name="Frame" size={24} />
							<span>Назва</span>
						</Link>
						<p>Єдиний каталог державних установ України.</p>
					</div>

					<div>
						<h3>Про проєкт</h3>
						<p>Платформа для зручного пошуку державних установ.</p>
					</div>

					<div>
						<h3>Контакти</h3>
						<p>Email: support@example.com</p>
					</div>
				</div>
			</PageContainer>
		</footer>
	);
}
