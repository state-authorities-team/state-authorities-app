import { Link } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";

export function HomePage() {
	return (
		<main>
			<section className="hero-section">
				<PageContainer>
					<p className="eyebrow">Україна</p>
					<h1>Національний каталог державних установ України</h1>
					<p className="hero-text">
						Централізована платформа для пошуку державних установ, контактної
						інформації та основних відомостей.
					</p>

					<div className="search-panel">
						<input placeholder="Пошук установ..." />
						<Link to="/catalog">Шукати</Link>
					</div>

					<div className="stats-grid">
						<div className="card">
							<strong>16 423</strong>
							<span>Державних установ</span>
						</div>
						<div className="card">
							<strong>2.85M</strong>
							<span>Працівників</span>
						</div>
						<div className="card">
							<strong>25</strong>
							<span>Регіонів</span>
						</div>
					</div>
				</PageContainer>
			</section>

			<section className="section">
				<PageContainer>
					<h2>Основні категорії державних установ</h2>

					<div className="category-grid">
						<div className="card">Кабінет міністрів</div>
						<div className="card">Міністерства</div>
						<div className="card">Територіальні органи</div>
						<div className="card">Органи місцевої влади</div>
						<div className="card">Державні підприємства</div>
						<div className="card">Судова система</div>
					</div>
				</PageContainer>
			</section>

			<section className="section">
				<PageContainer>
					<div className="card about-card">
						<h2>Про платформу</h2>
						<p>
							Платформа допомагає громадянам швидко знаходити державні установи,
							їхні контакти, керівництво та загальну інформацію.
						</p>
					</div>
				</PageContainer>
			</section>
		</main>
	);
}
